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

import { LOCALES } from './seo-check/lib.mjs'

const BASE = (process.env.CHECK_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const LOCALE = 'en'
const DIR = 'src/components/home'

const bestanden = readdirSync(DIR).filter((f) => f.endsWith('.tsx'))

/**
 * Stap 1: componenten die niemand importeert.
 *
 * Dit script leest de hrefs uit élk bestand in de map, dus een component die
 * nergens meer gerenderd wordt telt gewoon mee. Dat is precies wat hier mis
 * ging: zes dode componenten (ColorfulCategoryList, HomeSearchFigma en vier
 * andere) linkten naar twee clubs die uit de ClubTickets-feed verdwenen waren,
 * en de check meldde zes kapotte links op een homepage waar ze niet stonden.
 * Andersom is erger: zolang er dode bestanden in de map liggen weet je van een
 * geslaagde run niet of hij de pagina of de prullenbak heeft gecontroleerd.
 *
 * Dus: een bestand in deze map hoort ergens geïmporteerd te worden. Zo niet,
 * dan is het dood en gaat het weg — niet blijven liggen tot iemand het per
 * ongeluk als bron van waarheid leest.
 */
const dood = []
for (const f of bestanden) {
  const naam = f.replace(/\.tsx$/, '')
  // Op het modulepad zoeken en niet op de componentnaam: een dynamische import
  // (`dynamic(() => import('@/components/home/HomeTikTok'))`) is geen
  // import-statement, en een naam die in een toelichting valt is er juist wél
  // een. Alleen het pad zegt met zekerheid dat het bestand geladen wordt.
  const pad = new RegExp(`['\"][^'\"]*/${naam}['\"]`)
  let gebruikt = false
  for (const bestand of alleBronnen('src')) {
    if (bestand === join(DIR, f)) continue
    if (pad.test(readFileSync(bestand, 'utf8'))) { gebruikt = true; break }
  }
  if (!gebruikt) dood.push(f)
}

/** Elk .ts/.tsx-bestand onder een map, recursief. */
function alleBronnen(map) {
  const uit = []
  for (const item of readdirSync(map, { withFileTypes: true })) {
    const vol = join(map, item.name)
    if (item.isDirectory()) uit.push(...alleBronnen(vol))
    else if (/\.tsx?$/.test(item.name)) uit.push(vol)
  }
  return uit
}

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
  // Een pad dat al met een taalcode begint is compleet — er hoort niets meer
  // voor. Het US-cluster staat alleen in het Engels en linkt daarom bewust met
  // `/en/...`; daar nog eens `/en` voor plakken maakt `/en/en/...`, en dat is
  // dezelfde 404 die check:onpage op de pagina's zelf afvangt.
  const eerste = pad.split('/').filter(Boolean)[0]
  const url = LOCALES.includes(eerste) ? `${BASE}${pad}` : `${BASE}/${LOCALE}${pad}`
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


/**
 * Stap 3: de homepage zoals hij echt uitkomt.
 *
 * De bronscan hierboven vindt alleen hrefs die als letterlijke string in een
 * component staan, en dat zijn er nog maar een handvol: de meeste links op de
 * homepage worden opgebouwd met `pathFor()` of komen uit de ClubTickets-feed.
 * Precies die twee soorten breken als een venue uit de feed verdwijnt of een
 * route van taal wisselt — en juist die zag dit script niet.
 *
 * Dus halen we de gerenderde pagina op, in alle vijf de talen, en knippen op
 * `<main>`: menu en footer staan op élke pagina en zouden elke telling naar
 * tientallen links tillen (zie CLAUDE.md). Wat overblijft is waar een bezoeker
 * vanaf de homepage naartoe kan.
 */
const gerenderd = new Map()
for (const taal of LOCALES) {
  let html = ''
  try {
    const res = await fetch(`${BASE}/${taal}`, { signal: AbortSignal.timeout(30000) })
    if (!res.ok) {
      console.error(`  ✗ /${taal} → HTTP ${res.status} (homepage zelf)`)
      stuk++
      continue
    }
    html = await res.text()
  } catch (e) {
    console.error(`  ✗ /${taal} (${e instanceof Error ? e.message : e})`)
    stuk++
    continue
  }
  const begin = html.indexOf('<main')
  const eind = html.lastIndexOf('</main>')
  const romp = begin >= 0 && eind > begin ? html.slice(begin, eind) : html
  for (const m of romp.matchAll(/href="(\/[^"#]*)"/g)) {
    const pad = m[1].replace(/\?.*$/, '')
    if (!pad || pad.startsWith('/api/') || /\.[a-z0-9]{2,4}$/i.test(pad)) continue
    if (!gerenderd.has(pad)) gerenderd.set(pad, taal)
  }
}

const paden = [...gerenderd.keys()].sort()
console.log(`\nhome-links: ${paden.length} links uit de gerenderde homepage in ${LOCALES.length} talen\n`)
let kapot = 0
await Promise.all(
  paden.map(async (pad) => {
    try {
      const res = await fetch(`${BASE}${pad}`, { redirect: 'manual', signal: AbortSignal.timeout(20000) })
      if (res.status >= 400) {
        console.log(`  \u2717 ${pad}  \u2192 HTTP ${res.status}  (gevonden op /${gerenderd.get(pad)})`)
        kapot++
      } else if (res.status >= 300) {
        // Een 301/308 vanaf de eigen homepage is geen kapotte link, maar wel
        // linkwaarde die onderweg verdampt. Zie CLAUDE.md.
        console.log(`  \u2192 ${pad}  \u2192 HTTP ${res.status} (redirect, gevonden op /${gerenderd.get(pad)})`)
      }
    } catch (e) {
      console.log(`  \u2717 ${pad}  (${e instanceof Error ? e.message : e})`)
      kapot++
    }
  }),
)
stuk += kapot
if (!kapot) console.log(`  alle ${paden.length} links geven 2xx of 3xx.`)

console.log()
if (dood.length) {
  console.error(`home-links FAILED — ${dood.length} component(en) in ${DIR} worden nergens geïmporteerd:`)
  for (const f of dood) console.error(`  ✗ ${f}`)
  console.error('Dode bestanden horen niet in deze map: de check leest hun hrefs alsof ze live staan.')
  process.exit(1)
}
if (stuk) {
  console.error(`home-links FAILED — ${stuk} van ${lijst.length} links werkt niet.`)
  console.error('Clubslugs komen uit src/data/clubtickets_en.json (venues[].slug),')
  console.error('niet uit hoe de club heet. Controleer daar voor je een slug typt.')
  process.exit(1)
}
console.log(`home-links PASSED — ${lijst.length} links, 0 kapot.`)
