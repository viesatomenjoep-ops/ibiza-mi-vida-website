#!/usr/bin/env node
/**
 * Werkt de live ClubTickets event-API nog, en levert hij lowestAvailablePrice?
 *
 *   npm run check:event
 *
 * Haalt exact hetzelfde endpoint op als src/lib/clubtickets-live.ts voor één
 * druk clubevent en legt het naast src/data/clubtickets_en.json. Rapporteert
 * bereikbaarheid, het aantal datums live vs. in de JSON, en of
 * lowestAvailablePrice als getal terugkomt.
 *
 * Exit 1 als de feed onbereikbaar is, nul datums geeft, het veld
 * lowestAvailablePrice volledig verdwenen is, of er live minder dan de helft
 * van de datums over zijn die de JSON voor dat event kent — dan is de overlay
 * op de eventpagina's stil weggevallen of grotendeels leeg.
 *
 * Kies zelf een event met CHECK_EVENT="venueId/eventId". Zonder dat pakt het
 * script het clubevent met de meeste toekomstige datums uit de JSON.
 *
 * Geen afhankelijkheden; draait zonder build. Vanuit de Claude-sandbox faalt
 * dit met een 403 van de proxy — dat is de netwerkpolicy, niet de partner.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const KEY = process.env.CLUBTICKETS_API_KEY || '80aac9f0b1a44b63060b083f3813271a'
const BASE = `https://affiliates.clubtickets.com/api/affiliate/${KEY}/get`

const feedPath = join(HERE, '..', 'src', 'data', 'clubtickets_en.json')
let feed
try {
  feed = JSON.parse(readFileSync(feedPath, 'utf8'))
} catch (e) {
  console.error(`✗ Kan ${feedPath} niet lezen: ${e.message}`)
  process.exit(1)
}

const clubbing = new Set((feed.venues || []).filter((v) => v.type?.slug === 'clubbing').map((v) => v.id))

// eventId -> { venueId, count } uit de toekomstige datums in de JSON
const byEvent = new Map()
for (const d of feed.dates || []) {
  if (d.eventId == null || d.venueId == null || !clubbing.has(d.venueId)) continue
  const cur = byEvent.get(d.eventId) || { venueId: d.venueId, count: 0 }
  cur.count++
  byEvent.set(d.eventId, cur)
}

let venueId, eventId
if (process.env.CHECK_EVENT && /^\d+\/\d+$/.test(process.env.CHECK_EVENT)) {
  ;[venueId, eventId] = process.env.CHECK_EVENT.split('/').map(Number)
} else {
  const best = [...byEvent.entries()].sort((a, b) => b[1].count - a[1].count)[0]
  if (!best) {
    console.error('✗ Geen clubevent met datums in de JSON gevonden')
    process.exit(1)
  }
  eventId = best[0]
  venueId = best[1].venueId
}
const jsonCount = byEvent.get(eventId)?.count ?? 0

const url = `${BASE}/venue/${venueId}/event/${eventId}?locale=en`
const t0 = Date.now()
let res, text
try {
  res = await fetch(url, {
    headers: { 'user-agent': 'ibizamivida.com partner integration (check:event)', accept: 'application/json' },
  })
  text = await res.text()
} catch (e) {
  console.error(`✗ Feed onbereikbaar: ${e?.cause?.code || e?.message || e}`)
  process.exit(1)
}
const ms = Date.now() - t0
console.log(`${res.ok ? '✓' : '✗'} ${url}\n  HTTP ${res.status} · ${(text.length / 1024).toFixed(1)} kB · ${ms} ms`)
if (!res.ok) process.exit(1)

let json
try {
  json = JSON.parse(text)
} catch {
  console.error('✗ Antwoord is geen JSON')
  process.exit(1)
}
const data = json?.data
if (!data || !Array.isArray(data.dates)) {
  console.error('✗ Onverwachte vorm: geen data.dates')
  process.exit(1)
}

const liveCount = data.dates.length
console.log(`  event ${data.name || eventId} @ ${data.venue?.name || venueId}`)
console.log(`  ${liveCount} datums live · ${jsonCount} in clubtickets_en.json`)
if (liveCount === 0) {
  console.error('✗ Nul datums live')
  process.exit(1)
}

const withNumber = data.dates.filter((d) => typeof d.lowestAvailablePrice === 'number').length
const soldOut = data.dates.filter((d) => d.prices === '' && d.lowestAvailablePrice == null).length
const missing = data.dates.filter((d) => !('lowestAvailablePrice' in d)).length
const s = data.dates[0]
console.log(`  lowestAvailablePrice: ${withNumber} numeriek · ${soldOut} uitverkocht · ${missing} ontbreekt`)
console.log(`  eerste datum: ${s.date} · "${s.prices}" · lowestAvailablePrice=${JSON.stringify(s.lowestAvailablePrice)}`)

if (missing === liveCount) {
  console.error('✗ Geen enkele datum heeft het veld lowestAvailablePrice — API-contract gewijzigd')
  process.exit(1)
}
if (missing > 0) console.warn(`  ⚠ ${missing} datum(s) missen lowestAvailablePrice`)
if (withNumber === 0 && soldOut < liveCount) {
  console.error('✗ Geen enkele beschikbare datum heeft een numerieke lowestAvailablePrice')
  process.exit(1)
}
if (jsonCount > 0 && liveCount < jsonCount * 0.5) {
  console.error(`✗ Live heeft <50% van de datums die de JSON kent (${liveCount} < ${jsonCount}) — overlay grotendeels leeg`)
  process.exit(1)
}

console.log('\n✓ Live event-API werkt en levert lowestAvailablePrice.')
