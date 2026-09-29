#!/usr/bin/env node
/**
 * Doet elke URL die we zelf aanbieden, ook echt wat we beloven?
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * Een sitemap is een belofte: dit zijn mijn pagina's, indexeer ze. Elke URL
 * daarin die omleidt, 404't of op `noindex` staat, is een tegenspraak die we
 * zelf hebben ingediend — en Search Console rekent het ons aan in precies die
 * categorieën ("Pagina met omleiding", "Niet gevonden (404)", "Uitgesloten
 * door tag noindex").
 *
 * Dat was geen theorie. De eventroute roept `notFound()` zodra een event geen
 * toekomstige avond meer heeft, terwijl de sitemap élk event uit de feed
 * aanbood. Zodra de laatste datum passeerde liepen die twee uit elkaar, en
 * `/club-tickets/ibiza-rocks/nothing-new` stond in alle vijf de talen als 404
 * in onze eigen sitemap.
 *
 * `check:seo` ving dat niet: die crawlt een steekproef van routes, niet de
 * volledige sitemap, en een event dat toevallig niet in de steekproef zat
 * bleef onzichtbaar.
 *
 * ── Gebruik ───────────────────────────────────────────────────────────────
 *   npm run check:sitemap
 *   CHECK_BASE_URL=https://… npm run check:sitemap
 *
 * Verwacht een draaiende server. Exit 1 zodra één aangeboden URL geen
 * indexeerbare 200 geeft.
 */

const BASE = (process.env.CHECK_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
/** Gelijktijdige verzoeken. Hoger is sneller en belast de server meer. */
const PARALLEL = Number(process.env.SITEMAP_CHECK_PARALLEL || 12)

const xml = await (await fetch(`${BASE}/sitemap.xml`, { signal: AbortSignal.timeout(60000) })).text()
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)

if (paden.length === 0) {
  console.error("Geen URL's in de sitemap — draait de server en klopt CHECK_BASE_URL?")
  process.exit(1)
}

console.log(`sitemap-check: ${paden.length} aangeboden URL's, tegen ${BASE}\n`)

const omleiding = []
const fout = []
const noindex = []
let goed = 0
let volgende = 0

async function werker() {
  while (volgende < paden.length) {
    const pad = paden[volgende++]
    try {
      // `redirect: 'manual'`: een omleiding volgen zou hem juist verbergen, en
      // het is precies wat we willen zien.
      const res = await fetch(BASE + pad, { redirect: 'manual', signal: AbortSignal.timeout(30000) })
      if (res.status >= 300 && res.status < 400) {
        omleiding.push(`${pad} → ${res.status} ${res.headers.get('location') || ''}`)
        continue
      }
      if (res.status >= 400) {
        fout.push(`${pad} → HTTP ${res.status}`)
        continue
      }
      // Zowel de header als de meta-tag: een pagina kan op allebei de manieren
      // op noindex staan, en de sitemap spreekt allebei tegen.
      const header = res.headers.get('x-robots-tag') || ''
      const html = await res.text()
      const meta = html.match(/<meta name="robots" content="([^"]*)"/i)
      const samen = `${header} ${meta ? meta[1] : ''}`.toLowerCase()
      if (samen.includes('noindex')) {
        noindex.push(`${pad} → ${samen.trim()}`)
        continue
      }
      goed++
    } catch (e) {
      fout.push(`${pad} (${e instanceof Error ? e.message : String(e)})`)
    }
  }
}

await Promise.all(Array.from({ length: PARALLEL }, werker))

console.log(`  indexeerbare 200 : ${goed}`)
console.log(`  omleiding        : ${omleiding.length}`)
console.log(`  4xx/5xx          : ${fout.length}`)
console.log(`  noindex          : ${noindex.length}`)

for (const [naam, lijst] of [
  ['OMLEIDING — een sitemap hoort de eindbestemming te noemen', omleiding],
  ['FOUT — door onszelf ingediende 404', fout],
  ['NOINDEX — sitemap en pagina spreken elkaar tegen', noindex],
]) {
  if (!lijst.length) continue
  console.log(`\n--- ${naam} (${lijst.length}) ---`)
  // Gesorteerd, zodat twee runs dezelfde volgorde geven en een verschil een
  // echt verschil is. Zie de determinisme-regel in CLAUDE.md.
  for (const r of [...lijst].sort().slice(0, 40)) console.log(`  ✗ ${r}`)
  if (lijst.length > 40) console.log(`  … en nog ${lijst.length - 40}`)
}

const stuk = omleiding.length + fout.length + noindex.length
console.log()
if (stuk) {
  console.error(`sitemap-check FAILED — ${stuk} van ${paden.length} aangeboden URL's doet niet wat de sitemap belooft.`)
  process.exit(1)
}
console.log(`sitemap-check PASSED — alle ${paden.length} URL's geven een indexeerbare 200.`)
