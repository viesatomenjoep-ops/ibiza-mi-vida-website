/**
 * AI-zichtbaarheidsmeter — kunnen de antwoordmachines ons lezen?
 *
 * Usage: npm run check:ai   [CHECK_BASE_URL=… CHECK_AI_HISTORY=0]
 *
 * ── Wat dit wél meet, en wat bewust niet ──────────────────────────────────
 * Dit meet NIET of ChatGPT ons noemt. Dat klinkt als de vraag die je wil
 * beantwoorden, maar het is via een API niet eerlijk te meten: een model
 * zonder browsing antwoordt uit zijn trainingsdata, waar een jonge site per
 * definitie niet in zit, en een model mét browsing geeft per aanroep een ander
 * antwoord. Een script daaromheen levert een getal op dat gezaghebbend oogt en
 * de verkeerde werkelijkheid meet. Dat is erger dan niet meten.
 *
 * Wat wél deterministisch en gratis vast te stellen is, is of de voorwaarden
 * kloppen — en dat is precies de laag waar het in stilte misgaat:
 *
 *   1. robots  — mag elke crawler erin, volgens ons eigen robots.txt
 *   2. bereik  — komt elke crawler er in de praktijk ook echt in
 *   3. antwoord— staat er een citeerbaar antwoord in de kale HTML
 *
 * Punt 2 is de reden dat dit bestand bestaat. robots.txt kan keurig "allow"
 * zeggen terwijl botbescherming bij de hosting of een CDN-regel GPTBot een 403
 * of een lege JS-schil geeft. Dan ben je onzichtbaar in ChatGPT, hoe goed je
 * pagina's ook geschreven zijn, en er is geen enkel signaal dat je dat vertelt.
 * Dit is een storing die maanden kan duren zonder dat iemand hem opmerkt.
 *
 * ── Waarom dit tegen de live site draait ──────────────────────────────────
 * De andere checks draaien tegen localhost, want die controleren wat de code
 * produceert. Deze controleert iets anders: wat er tussen de crawler en onze
 * HTML gebeurt. Botbescherming en CDN-regels zitten bij de hosting, niet in de
 * build — op localhost bestaan ze niet en zou elke test slagen. Vandaar dat
 * BASE hier standaard de productiesite is.
 */

import { appendFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Report, c, mapLimit, tagText, stripTags } from './seo-check/lib.mjs'

const BASE = (process.env.CHECK_BASE_URL || 'https://www.ibizamivida.com').replace(/\/$/, '')

/**
 * Crawlers die daadwerkelijk pagina's ophalen.
 *
 * De user-agents zijn de door de aanbieders gepubliceerde strings. Ze staan
 * hier voluit en niet als losse tokens, omdat botfilters op de hele string
 * kunnen matchen: een verkorte variant zou door een filter kunnen glippen dat
 * de echte crawler wél tegenhoudt, en dan test je je eigen verzinsel.
 */
const FETCHERS = [
  ['GPTBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot'],
  ['OAI-SearchBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot'],
  ['ChatGPT-User', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot'],
  ['ClaudeBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com'],
  ['Claude-User', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Claude-User/1.0; +Claude-User@anthropic.com'],
  ['PerplexityBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot'],
  ['Bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'],
  ['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
  ['CCBot', 'CCBot/2.0 (https://commoncrawl.org/faq/)'],
]

/**
 * Robots-tokens die géén crawler zijn.
 *
 * Google-Extended en Applebot-Extended halen niets op. Het zijn schakelaars in
 * robots.txt die bepalen of materiaal dat Googlebot respectievelijk Applebot al
 * heeft opgehaald, gebruikt mag worden voor hun AI-producten — voor Google is
 * dat de kant die Gemini voedt. Ze meenemen in de bereikbaarheidstest zou een
 * groen vinkje opleveren dat niets betekent, want elke user-agent die je
 * verzint krijgt gewoon een pagina terug. Ze horen alleen in de robots-check.
 */
const TOKEN_ONLY = ['Google-Extended', 'Applebot-Extended']

/**
 * De pagina's waar het om gaat.
 *
 * Niet de hele sitemap: dit doet negen fetches per pagina en dat is 200+ keer
 * uitvoeren zinloos. Dit is de selectie waar we op geciteerd willen worden —
 * de pagina's die een vraag beantwoorden in plaats van iets aanbieden. Als een
 * botfilter toeslaat, doet hij dat domeinbreed, dus een steekproef vangt het.
 */
const PAGES = [
  '/en/guestlist',
  '/en/ibiza-prices',
  '/en/this-week',
  '/en/ibiza-season',
  '/en/private-boat-charters',
  '/en/boat-hire-ibiza-no-licence',
  '/nl/guestlist',
  '/nl/ibiza-prices',
]

/** Kale fetch met een eigen user-agent. Werpt nooit op een HTTP-status. */
async function fetchAs(url, ua) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': ua } })
    const body = res.status >= 200 && res.status < 400 ? await res.text() : ''
    return { status: res.status, body }
  } catch (e) {
    return { status: 0, body: '', error: e.message }
  }
}

/**
 * robots.txt uitlezen tot losse groepen.
 *
 * Opeenvolgende User-agent-regels horen bij één groep; de regels daarna gelden
 * voor alle user-agents in die kop. Dat is de vorm die het protocol
 * voorschrijft en die een naïeve "laatste user-agent wint"-lezing fout doet.
 */
function parseRobots(txt) {
  const groups = []
  let current = null
  let collectingAgents = false

  for (const raw of txt.split('\n')) {
    const line = raw.replace(/#.*$/, '').trim()
    if (!line) continue
    const i = line.indexOf(':')
    if (i === -1) continue
    const field = line.slice(0, i).trim().toLowerCase()
    const value = line.slice(i + 1).trim()

    if (field === 'user-agent') {
      if (!collectingAgents || !current) {
        current = { agents: [], rules: [] }
        groups.push(current)
        collectingAgents = true
      }
      current.agents.push(value.toLowerCase())
    } else if (field === 'allow' || field === 'disallow') {
      if (!current) continue
      collectingAgents = false
      current.rules.push({ type: field, path: value })
    }
  }
  return groups
}

/**
 * Mag `agent` de site in?
 *
 * Alleen de grove vraag: is alles geblokkeerd. Een `Disallow: /` zonder
 * tegenhangende `Allow:` sluit de crawler volledig buiten, en dat is het geval
 * dat we willen zien. Losse verboden paden (/api/, /admin) zijn juist gewenst
 * en horen hier geen alarm te geven.
 */
function robotsVerdict(groups, agent) {
  const a = agent.toLowerCase()
  const own = groups.find((g) => g.agents.includes(a))
  const star = groups.find((g) => g.agents.includes('*'))
  const group = own || star
  if (!group) return { allowed: true, via: 'geen groep — standaard toegestaan' }

  const blocksAll = group.rules.some((r) => r.type === 'disallow' && (r.path === '/' || r.path === ''))
  const disallowRoot = group.rules.some((r) => r.type === 'disallow' && r.path === '/')
  const allowsRoot = group.rules.some((r) => r.type === 'allow' && r.path === '/')
  const allowed = !disallowRoot || allowsRoot
  void blocksAll
  return { allowed, via: own ? `eigen groep (${agent})` : 'de *-groep' }
}

/**
 * Zoek de langste server-gerenderde alinea in de HTML.
 *
 * Dit is de kern van citeerbaarheid. Een antwoordmachine tilt een aaneengesloten
 * stuk tekst uit de pagina; staat het antwoord verspreid over acht kopjes en
 * losse zinnetjes, dan valt er niets te citeren en pakt hij een bron die het wel
 * op orde heeft. De drempel van 240 tekens is waar een alinea ophoudt een
 * bijschrift te zijn en een antwoord wordt.
 *
 * Bewust op de ruwe HTML en niet op een DOM: staat de tekst er pas na het
 * uitvoeren van JavaScript, dan telt hij niet mee — en dat is precies goed,
 * want de meeste AI-crawlers voeren geen JavaScript uit.
 */
function longestParagraph(html) {
  const body = html.slice(html.indexOf('<body'))
  let best = ''
  for (const m of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = stripTags(m[1])
    if (text.length > best.length) best = text
  }
  return best
}

const ANSWER_MIN = 240

async function main() {
  const report = new Report('ai')
  console.log(c.dim(`AI-zichtbaarheid tegen ${BASE}\n`))

  // ── 1. robots.txt ────────────────────────────────────────────────────────
  const robotsRes = await fetchAs(`${BASE}/robots.txt`, 'ibiza-mi-vida-ai-check')
  if (robotsRes.status !== 200) {
    report.fail('/robots.txt', `HTTP ${robotsRes.status} — zonder robots.txt is geen uitspraak mogelijk`)
    return report.finish()
  }
  const groups = parseRobots(robotsRes.body)
  const allAgents = [...FETCHERS.map(([n]) => n), ...TOKEN_ONLY]
  const robotsState = {}
  for (const agent of allAgents) {
    report.checked++
    const v = robotsVerdict(groups, agent)
    robotsState[agent] = v.allowed
    if (!v.allowed) report.fail(`robots/${agent}`, `volledig uitgesloten via ${v.via}`)
  }
  console.log(c.dim(`robots.txt: ${Object.values(robotsState).filter(Boolean).length}/${allAgents.length} toegestaan`))

  // ── 2. bereikbaarheid ────────────────────────────────────────────────────
  // Eerst een gewone browser als ijkpunt. Alles wordt daartegen afgezet, want
  // "GPTBot krijgt 200" zegt niets als die 200 een lege pagina is.
  const BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  const baselines = new Map()
  await mapLimit(PAGES, 4, async (path) => {
    const r = await fetchAs(BASE + path, BROWSER)
    baselines.set(path, r)
  })

  for (const path of PAGES) {
    const b = baselines.get(path)
    if (b.status !== 200 || !b.body) {
      report.fail(`bereik${path}`, `ijkmeting mislukt: een gewone browser krijgt HTTP ${b.status}`)
    }
  }

  const jobs = []
  for (const path of PAGES) {
    const b = baselines.get(path)
    if (b.status !== 200 || !b.body) continue
    for (const [name, ua] of FETCHERS) jobs.push({ path, name, ua, baseline: b })
  }

  const reachFails = {}
  await mapLimit(jobs, 6, async ({ path, name, ua, baseline }) => {
    report.checked++
    const r = await fetchAs(BASE + path, ua)
    const where = `bereik${path} [${name}]`

    if (r.status !== 200) {
      reachFails[name] = (reachFails[name] || 0) + 1
      return report.fail(where, `HTTP ${r.status} terwijl een browser 200 krijgt${r.error ? ` (${r.error})` : ''}`)
    }
    // Afwijking van meer dan 10% duidt op afgeknepen of vervangen inhoud.
    // Kleine verschillen zijn normaal: nonces en tijdstempels verschillen per
    // response, dus exact vergelijken zou vals alarm geven.
    const ratio = r.body.length / baseline.body.length
    if (ratio < 0.9) {
      reachFails[name] = (reachFails[name] || 0) + 1
      return report.fail(where, `krijgt ${Math.round(ratio * 100)}% van de inhoud die een browser krijgt (${r.body.length} vs ${baseline.body.length} bytes)`)
    }
    const h1 = tagText(r.body, 'h1')
    const baseH1 = tagText(baseline.body, 'h1')
    if (baseH1 && h1 !== baseH1) {
      reachFails[name] = (reachFails[name] || 0) + 1
      return report.fail(where, `ziet een andere H1 dan een browser: "${h1}" vs "${baseH1}"`)
    }
  })
  const reachOk = FETCHERS.filter(([n]) => !reachFails[n]).length
  console.log(c.dim(`bereik: ${reachOk}/${FETCHERS.length} crawlers krijgen dezelfde inhoud als een browser`))

  // ── 3. citeerbaar antwoord ───────────────────────────────────────────────
  let answersOk = 0
  for (const path of PAGES) {
    const b = baselines.get(path)
    if (b.status !== 200 || !b.body) continue
    report.checked++
    const p = longestParagraph(b.body)
    if (p.length < ANSWER_MIN) {
      report.fail(`antwoord${path}`, `langste server-gerenderde alinea is ${p.length} tekens, onder de ${ANSWER_MIN} die een citeerbaar antwoord vraagt`)
    } else {
      answersOk++
    }
  }
  console.log(c.dim(`antwoord: ${answersOk}/${PAGES.length} pagina's hebben een citeerbare alinea\n`))

  // ── geschiedenis ─────────────────────────────────────────────────────────
  // Eén regel per run, zodat een terugval zichtbaar wordt als verandering en
  // niet alleen als een rode CI-melding die iemand wegklikt. Zelfde vorm als
  // data/price-history.
  if (process.env.CHECK_AI_HISTORY !== '0') {
    const file = fileURLToPath(new URL('../data/ai-visibility/history.jsonl', import.meta.url))
    mkdirSync(dirname(file), { recursive: true })
    appendFileSync(
      file,
      JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        base: BASE,
        robotsAllowed: Object.values(robotsState).filter(Boolean).length,
        robotsTotal: allAgents.length,
        reachOk,
        reachTotal: FETCHERS.length,
        answersOk,
        answersTotal: PAGES.length,
        failures: report.failures.length,
      }) + '\n',
    )
  }

  return report.finish()
}

main()
  .then((code) => { process.exitCode = code })
  .catch((e) => {
    console.error(c.fail(`ai check could not run: ${e.message}`))
    process.exitCode = 1
  })
