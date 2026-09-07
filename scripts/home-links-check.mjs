#!/usr/bin/env node
/**
 * Kloppen de interne links op de homepage nog?
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * Acht van de vijftien clublinks op de homepage gaven een 404. Niet door een
 * kapotte route, maar doordat iemand de slugs met de hand had ingevuld op basis
 * van hoe de club heet in plaats van hoe hij in de ClubTickets-feed staat:
 * 'ushuaia' tegenover 'ushuaia-ibiza', 'universe' tegenover 'unvrs-ibiza',
 * 'chinois' tegenover 'club-chinois-ibiza'. Plus twee links naar routes die
 * nooit hebben bestaan (/vip-catamaran, /formentera-boat-trips) en twee clubs
 * die niet in de catalogus zitten.
 *
 * Geen enkele bestaande check zag dat. check:ssr en check:onpage crawlen de
 * sitemap, en een 404 die alleen vanáf de homepage bereikbaar is staat daar per
 * definitie niet in. De links wezen dus maandenlang de belangrijkste pagina van
 * de site uit naar niets, en dat is niet alleen een gebruiker die vastloopt:
 * Google leest interne links naar 404's als een signaal over de kwaliteit van
 * de hele site.
 *
 * Dit script is de tegenhanger: het leest de hrefs uit de homepage-componenten
 * en haalt ze op. Geen HTML-parsing, geen browser — de hrefs staan als
 * literals in de bron, en dat is precies waar de fout in zat.
 *
 * ── Gebruik ───────────────────────────────────────────────────────────────
 *   npm run check:homelinks            (tegen http://localhost:3000)
 *   CHECK_BASE_URL=https://… npm run check:homelinks
 *
 * Verwacht een draaiende server. Exit 1 zodra één link geen 2xx of 3xx geeft.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = (process.env.CHECK_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const LOCALE = 'en'
const DIR = 'src/components/home'

const bestanden = readdirSync(DIR).filter((f) => f.endsWith('.tsx'))

/** Alle interne hrefs uit de homepage-componenten, ontdubbeld. */
const hrefs = new Set()
for (const f of bestanden) {
  const bron = readFileSync(join(DIR, f), 'utf8')
  // `href: '/pad'` in een categorie-array, en `href="/pad"` in JSX.
  for (const m of bron.matchAll(/href[:=]\s*['"](\/[^'"{}]+)['"]/g)) {
    const pad = m[1]
    // Ankers, api-routes en bestanden slaan we over; die zijn geen pagina's.
    if (pad.startsWith('/api/') || pad.includes('#') || /\.[a-z0-9]{2,4}$/i.test(pad)) continue
    hrefs.add(pad)
  }
}

const lijst = [...hrefs].sort()
if (lijst.length === 0) {
  console.error('Geen hrefs gevonden in ' + DIR + ' — is de map verplaatst?')
  process.exit(1)
}

console.log(`home-links: ${lijst.length} interne links uit ${bestanden.length} componenten, tegen ${BASE}\n`)

let stuk = 0
for (const pad of lijst) {
  const url = `${BASE}/${LOCALE}${pad}`
  let status = 0
  try {
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) })
    status = res.status
  } catch (e) {
    console.log(`  ✗ ${pad}  (${e instanceof Error ? e.message : e})`)
    stuk++
    continue
  }
  if (status >= 400) {
    console.log(`  ✗ ${pad}  → HTTP ${status}`)
    stuk++
  } else if (status >= 300) {
    // Werkt, maar kost een hop. Geen fout: sommige zijn een bewuste 308.
    console.log(`  → ${pad}  → HTTP ${status} (redirect)`)
  } else {
    console.log(`  ✓ ${pad}`)
  }
}

console.log()
if (stuk) {
  console.error(`home-links FAILED — ${stuk} van ${lijst.length} links werkt niet.`)
  console.error('Clubslugs komen uit src/data/clubtickets_en.json (venues[].slug),')
  console.error('niet uit hoe de club heet. Controleer daar voor je een slug typt.')
  process.exit(1)
}
console.log(`home-links PASSED — ${lijst.length} links, 0 kapot.`)
