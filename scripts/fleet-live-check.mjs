#!/usr/bin/env node
/**
 * Werkt de live partner-API (The Yacht Broker) nog met onze vloot?
 *
 *   npm run check:fleet
 *
 * Haalt exact hetzelfde endpoint op als src/lib/yacht-broker.ts en legt het
 * naast de brokerKeys in src/data/fleet.ts. Rapporteert:
 *  - bereikbaarheid, HTTP-status, omvang en duur;
 *  - generatedAt / bereik / seizoen zoals de feed ze meegeeft;
 *  - hoeveel van onze 94 boten een match hebben, en welke NIET (dan heeft de
 *    broker een boot hernoemd of verwijderd → fleet.ts opnieuw genereren);
 *  - boten in de feed die wij niet kennen (nieuw aanbod);
 *  - een steekproef: status + dagprijs van vandaag voor drie boten, met
 *    dezelfde rekenregels als de site.
 *
 * Exit 1 als de feed onbereikbaar is of minder dan 90% van de vloot matcht —
 * dan is de live laag op de site stil weggevallen of grotendeels leeg, en dat
 * merk je anders alleen doordat "alleen beschikbaar" niets meer toont.
 *
 * Geen afhankelijkheden: fleet.ts wordt met een regex gelezen, want dit
 * script draait ook zonder build.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const URL_ = 'https://www.theyachtbroker.club/api/availability?months=1&start=0'

const norm = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const ibizaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
const priceForDate = (b, iso, season) => {
  if (b.priceBands?.length) {
    const mmdd = iso.slice(5, 10)
    for (const band of b.priceBands) if (mmdd >= band.from && mmdd <= band.to) return band.price
    return null
  }
  return b.price?.[season] ?? null
}

const fleetSrc = readFileSync(join(HERE, '..', 'src', 'data', 'fleet.ts'), 'utf8')
const ours = [...fleetSrc.matchAll(/slug: '([^']+)'[^\n]*?brokerKey: '([^']+)'/g)].map(m => ({ slug: m[1], key: m[2] }))
if (!ours.length) { console.error('Geen boten gevonden in src/data/fleet.ts'); process.exit(1) }

const t0 = Date.now()
let res, text
try {
  res = await fetch(URL_, { headers: { 'user-agent': 'ibizamivida.com partner integration (check:fleet)' } })
  text = await res.text()
} catch (e) {
  console.error(`✗ Feed onbereikbaar: ${e?.cause?.code || e?.message || e}`)
  process.exit(1)
}
const ms = Date.now() - t0
console.log(`${res.ok ? '✓' : '✗'} ${URL_}\n  HTTP ${res.status} · ${(text.length / 1024).toFixed(1)} kB · ${ms} ms`)
if (!res.ok) process.exit(1)

let data
try { data = JSON.parse(text) } catch { console.error('✗ Antwoord is geen JSON'); process.exit(1) }
if (!Array.isArray(data.boats) || !data.generatedAt) { console.error('✗ Onverwachte vorm: geen boats[]/generatedAt'); process.exit(1) }

console.log(`  generatedAt ${data.generatedAt} · bereik ${data.rangeStart} → ${data.rangeEnd} · seizoen ${data.season} · ${data.boats.length} boten in de feed`)

const feed = new Map(data.boats.map(b => [norm(b.boat), b]))
const matched = ours.filter(o => feed.has(o.key))
const missing = ours.filter(o => !feed.has(o.key))
const unknown = [...feed.keys()].filter(k => !ours.some(o => o.key === k))

console.log(`\n${matched.length}/${ours.length} van onze boten hebben live data (${Math.round((matched.length / ours.length) * 100)}%)`)
if (missing.length) console.log(`  ✗ zonder match in de feed: ${missing.map(o => o.slug).join(', ')}`)
if (unknown.length) console.log(`  · in de feed maar niet in fleet.ts: ${unknown.join(', ')}`)

const today = ibizaToday()
const inRange = today >= data.rangeStart && today < data.rangeEnd
console.log(`\nSteekproef voor ${today}${inRange ? '' : ' (buiten het feedbereik!)'}:`)
for (const o of matched.slice(0, 3)) {
  const b = feed.get(o.key)
  const status = b.days?.[today] ?? 'free'
  const price = priceForDate(b, today, data.season)
  console.log(`  ${o.slug.padEnd(16)} ${status.padEnd(7)} ${price != null ? `€${price}` : 'geen prijs'}`)
}

const totalDays = data.boats.reduce((n, b) => n + Object.keys(b.days || {}).length, 0)
console.log(`\n${totalDays} dagvermeldingen (booked/option) in het venster`)

if (matched.length / ours.length < 0.9) {
  console.error('\n✗ Minder dan 90% gematcht: fleet.ts loopt achter op de feed.')
  process.exit(1)
}
console.log('\n✓ Live API werkt met de vloot.')
