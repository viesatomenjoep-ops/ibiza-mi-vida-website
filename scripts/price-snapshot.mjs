#!/usr/bin/env node
/**
 * Legt vast wat er met ticketprijzen gebeurt, dag voor dag.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * "Is het goedkoper om vroeg te boeken?" en "wordt het duurder naarmate de
 * datum nadert?" horen bij de meest gestelde vragen over Ibiza, en niemand kan
 * ze onderbouwen — ook wij niet, want wij zien alleen de prijs van vandaag.
 * Wie een jaar lang vastlegt wat de agenda zegt, kan ze als eerste met echte
 * data beantwoorden. Dat is de enige ontbrekende dataset die we zelf kunnen
 * aanleggen; alle andere onbeantwoordbare vragen vragen om gegevens die we
 * niet kunnen maken (settijden, beschikbaarheid, barprijzen).
 *
 * ── Wat dit NIET veronderstelt ────────────────────────────────────────────
 * Niet dat prijzen stijgen. Clubprijzen werken in vaste stappen die de club
 * zelf zet — een early-bird die opraakt, een tier die omklapt — en niet als
 * een koers die vanzelf oploopt. Dit script legt daarom alleen vast wát er
 * verandert en in welke richting, en trekt geen conclusie. Als de data straks
 * laat zien dat er nauwelijks iets beweegt, is dát het antwoord, en ook dat is
 * meer dan iemand anders kan aantonen.
 *
 * ── Waarom alleen verschillen ─────────────────────────────────────────────
 * Een volledige momentopname is 116 KB. Dagelijks bewaren is 42 MB per jaar
 * aan vrijwel identieke bestanden. In plaats daarvan één basisstand plus een
 * append-only logregel per wijziging. Verandert er weinig — wat de verwachting
 * is — dan groeit dit met een paar regels per dag.
 *
 * Draaien NA `npm run sync-clubtickets`, anders vergelijk je met jezelf.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FEED = join(ROOT, 'src/data/clubtickets_en.json')
const DIR = join(ROOT, 'data/price-history')
const BASELINE = join(DIR, 'baseline.json')
const CHANGES = join(DIR, 'changes.jsonl')

/** yyyy-mm-dd van vandaag, UTC — zodat een run om 23:00 en om 01:00 niet
 *  op verschillende dagen belandt afhankelijk van de zone van de runner. */
const today = new Date().toISOString().slice(0, 10)

function main() {
  if (!existsSync(FEED)) {
    console.error(`Feed niet gevonden: ${FEED}. Draai eerst npm run sync-clubtickets.`)
    process.exitCode = 1
    return
  }

  const feed = JSON.parse(readFileSync(FEED, 'utf8'))
  const rows = (feed.dates || []).filter(d => d?.id != null && d?.prices)

  if (rows.length === 0) {
    console.warn('Geen datums met prijs in de feed — niets vastgelegd. Loopt de sync nog?')
    return
  }

  // Huidige stand: id -> prijsstring, precies zoals de feed hem schrijft.
  // Niet geparseerd naar een getal: "40 € - 50 €" verandert naar "45 €" is een
  // echte wijziging, en welk deel ervan de entree is bepalen we elders.
  const now = {}
  for (const r of rows) now[String(r.id)] = String(r.prices)

  mkdirSync(DIR, { recursive: true })

  if (!existsSync(BASELINE)) {
    writeFileSync(BASELINE, JSON.stringify({ takenOn: today, prices: now }, null, 0) + '\n')
    console.log(`Basisstand aangelegd: ${rows.length} datums op ${today}. Vanaf morgen worden verschillen bijgehouden.`)
    return
  }

  const prev = JSON.parse(readFileSync(BASELINE, 'utf8'))
  const before = prev.prices || {}

  const lines = []
  for (const [id, price] of Object.entries(now)) {
    const was = before[id]
    if (was === undefined) {
      lines.push({ d: today, i: id, k: 'new', to: price })
    } else if (was !== price) {
      lines.push({ d: today, i: id, k: 'change', from: was, to: price })
    }
  }
  // Datums die uit de agenda verdwenen: afgelopen, geannuleerd of uitverkocht.
  // We weten niet welk van de drie — dus loggen we het feit, niet de reden.
  for (const id of Object.keys(before)) {
    if (now[id] === undefined) lines.push({ d: today, i: id, k: 'gone', from: before[id] })
  }

  if (lines.length === 0) {
    console.log(`${today}: niets veranderd aan ${rows.length} prijzen.`)
    return
  }

  appendFileSync(CHANGES, lines.map(l => JSON.stringify(l)).join('\n') + '\n')
  writeFileSync(BASELINE, JSON.stringify({ takenOn: today, prices: now }, null, 0) + '\n')

  const c = lines.filter(l => l.k === 'change')
  const up = c.filter(l => firstNumber(l.to) > firstNumber(l.from)).length
  const down = c.filter(l => firstNumber(l.to) < firstNumber(l.from)).length
  console.log(
    `${today}: ${lines.length} regels vastgelegd — ` +
    `${c.length} prijswijziging(en) (${up} omhoog, ${down} omlaag), ` +
    `${lines.filter(l => l.k === 'new').length} nieuw, ` +
    `${lines.filter(l => l.k === 'gone').length} verdwenen.`,
  )
}

/** Eerste getal uit een prijsstring, puur om richting te kunnen tellen. */
function firstNumber(s) {
  const m = String(s || '').match(/\d+(?:[.,]\d+)?/)
  return m ? parseFloat(m[0].replace(',', '.')) : 0
}

main()
