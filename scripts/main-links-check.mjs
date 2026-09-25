#!/usr/bin/env node
/**
 * Waar kan een bezoeker heen vanaf een pagina van dit type?
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * "Bezoekers dwalen" was geen gevoel maar een meetbaar gebrek: de
 * plaatspagina's hadden vijf links die allemaal naar elkaar wezen, en de
 * venuepagina's hadden er één of nul die de pagina verliet. Een kale
 * linktelling ziet dat niet, want menu en footer staan op élke pagina en
 * tillen elke telling naar tientallen. Daarom knippen we op `<main>` en tellen
 * we alleen daarbinnen.
 *
 * De methode stond als één regel in CLAUDE.md en het script stond nergens.
 * Dat is precies de vorm van kennis die verdwijnt: de volgende keer dat een
 * paginatype doodloopt, is er niets dat het meet. Nu wel.
 *
 * Drie kolommen, want ze zeggen iets anders:
 *   totaal — alle verschillende interne bestemmingen binnen <main>. Hierop
 *            faalt de drempel: dit is "kan de bezoeker hier weg".
 *   eigen  — daarvan de links dieper het eigen pad in (een club naar zijn
 *            eigen avonden).
 *   elders — de rest. Lees deze kolom bij een detailpagina: staat daar 0 of 1,
 *            dan wijst alles naar de eigen inhoud en loopt de bezoeker vast
 *            zodra hij niet wil wat díé pagina aanbiedt. Bij een hub zegt
 *            deze kolom niets — de kinderen ván een hub zijn de uitweg, en
 *            die tellen hier als "eigen".
 *
 * ── Gebruik ───────────────────────────────────────────────────────────────
 *   npm run check:mainlinks
 *   CHECK_BASE_URL=https://… npm run check:mainlinks
 *   MAIN_LINKS_MIN=3 npm run check:mainlinks    (faalt onder die drempel)
 *
 * Zonder drempel rapporteert hij alleen. Verwacht een draaiende server.
 */

const BASE = (process.env.CHECK_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
/** Onder deze drempel is een paginatype een doodlopende weg. 0 = alleen rapporteren. */
const MIN = Number(process.env.MAIN_LINKS_MIN || 0)
/** Hoeveel pagina's per type we bekijken. Meer is nauwkeuriger en trager. */
const PROEF = 3
/** Types met minder URL's dan dit halen we niet apart door de molen. */
const MIN_URLS = 1

const xml = await (await fetch(`${BASE}/sitemap.xml`, { signal: AbortSignal.timeout(60000) })).text()
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  // Eén taal volstaat: de pagina's zijn per taal dezelfde componenten, en vijf
  // talen meten kost vijf keer zoveel verzoeken voor dezelfde uitkomst.
  .filter((u) => /\/en(\/|$)/.test(u))
  .map((u) => new URL(u).pathname)

if (paden.length === 0) {
  console.error('Geen /en-URL\'s in de sitemap — draait de server en klopt CHECK_BASE_URL?')
  process.exit(1)
}

/**
 * Paginatype = de vorm van het pad, niet het pad zelf. De diepte hoort erbij:
 * `/club-tickets/hi-ibiza` en `/club-tickets/hi-ibiza/camelphat` zijn twee
 * verschillende sjablonen, en ze samen middelen verbergt allebei.
 */
function typeVan(pad) {
  const d = pad.split('/').filter(Boolean)
  if (d.length <= 1) return '(home)'
  if (d.length === 2) return `/${d[1]}`
  if (d.length === 3) return `/${d[1]}/[venue]`
  return `/${d[1]}/[venue]/[event]`
}

const groepen = new Map()
for (const p of paden) {
  const t = typeVan(p)
  if (!groepen.has(t)) groepen.set(t, [])
  groepen.get(t).push(p)
}

/** Gelijkmatig door de gesorteerde lijst, zodat de proef niet alleen de kop pakt. */
function steekproef(lijst, n) {
  const uit = []
  const stap = Math.max(1, Math.floor(lijst.length / n))
  for (let i = 0; i < lijst.length && uit.length < n; i += stap) uit.push(lijst[i])
  return uit
}

console.log(`main-links: ${groepen.size} paginatypes uit ${paden.length} URL's, tegen ${BASE}\n`)

const rijen = []
for (const [type, lijst] of [...groepen].sort()) {
  if (lijst.length < MIN_URLS) continue
  let eigen = 0
  let elders = 0
  let totaal = 0
  let gemeten = 0
  let voorbeeld = ''
  for (const pad of steekproef([...lijst].sort(), PROEF)) {
    let html = ''
    try {
      const res = await fetch(BASE + pad, { signal: AbortSignal.timeout(30000) })
      if (!res.ok) continue
      html = await res.text()
    } catch {
      continue
    }
    const a = html.indexOf('<main')
    const b = html.lastIndexOf('</main>')
    // Geen <main>: dan meten we de hele pagina en tellen menu en footer mee.
    // Dat is geen meting, dus die pagina slaan we over.
    if (a < 0 || b <= a) continue
    const romp = html.slice(a, b)
    const links = new Set(
      [...romp.matchAll(/href="(\/[^"#]*)"/g)]
        .map((m) => m[1].replace(/\?.*$/, ''))
        // `?date=` maakt van één eventpagina tien links; die tellen als één
        // bestemming. Zie event-date-param.ts.
        .filter((l) => !l.startsWith('/api/') && !/\.[a-z0-9]{2,4}$/i.test(l)),
    )
    links.delete(pad)
    for (const l of links) {
      if (l.startsWith(pad + '/')) eigen++
      else elders++
    }
    totaal += links.size
    gemeten++
    if (!voorbeeld) voorbeeld = pad
  }
  if (gemeten) {
    rijen.push({
      type,
      urls: lijst.length,
      totaal: Math.round(totaal / gemeten),
      eigen: Math.round(eigen / gemeten),
      elders: Math.round(elders / gemeten),
      voorbeeld,
    })
  }
}

rijen.sort((a, b) => a.totaal - b.totaal || b.urls - a.urls)

const kolom = Math.max(12, ...rijen.map((r) => r.type.length))
console.log('paginatype'.padEnd(kolom), "URL's".padStart(6), 'totaal'.padStart(7), 'eigen'.padStart(7), 'elders'.padStart(8), '  voorbeeld')
let onder = 0
for (const r of rijen) {
  const vlag = MIN > 0 && r.totaal < MIN ? ' ✗' : '  '
  if (MIN > 0 && r.totaal < MIN) onder++
  console.log(
    r.type.padEnd(kolom),
    String(r.urls).padStart(6),
    String(r.totaal).padStart(7),
    String(r.eigen).padStart(7),
    String(r.elders).padStart(8),
    vlag + r.voorbeeld,
  )
}

console.log()
if (MIN > 0 && onder) {
  console.error(`main-links FAILED — ${onder} paginatype(s) onder de drempel van ${MIN} interne links in <main>.`)
  console.error('Een pagina waar een bezoeker niet weg kan, krijgt geen tweede klik.')
  process.exit(1)
}
console.log(MIN > 0 ? `main-links PASSED — elk type haalt ${MIN} interne links in <main>.` : 'main-links: rapport (zet MAIN_LINKS_MIN om te laten falen).')
