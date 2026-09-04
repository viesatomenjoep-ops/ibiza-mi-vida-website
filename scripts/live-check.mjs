#!/usr/bin/env node
/**
 * Doet de live site nog wat hij moet doen?
 *
 *   npm run check:live                 # tegen www.ibizamivida.com
 *   LIVE_BASE_URL=https://… npm run check:live
 *
 * Dit is de tegenhanger van check:seo. Die draait tegen een build in CI en
 * bewijst dat de HTML klopt; deze draait tegen de draaiende site en bewijst
 * dat de dingen die alleen dáár kunnen breken het nog doen. Alle vier de
 * controles hieronder gaan over een storing die STIL is — de pagina blijft
 * gewoon renderen, er komt geen foutmelding, en je merkt het pas als iemand
 * belt of als het verkeer al weg is.
 *
 *  1. x-robots-tag. Staat NEXT_PUBLIC_SITE_URL op een andere host dan waarop
 *     de site draait, dan krijgt élke pagina 'noindex, nofollow' mee. Geen
 *     kapotte pagina, geen fout: de site verdwijnt alleen uit Google en uit
 *     elke AI-crawler. Dit is de goedkoopste alarmbel die er is.
 *  2. /api/fleet-live. Valt de partnerfeed weg, dan tonen de bootkaarten
 *     gewoon de statische prijsbanden verder — precies daarom merkt niemand
 *     het. Ook de versheid wordt gecontroleerd: een feed die blijft hangen op
 *     een oud tijdstip is net zo stuk als een feed die 503't.
 *  3. De charterpagina moet de live beschikbaarheid in de HTML hebben. Dat is
 *     de server-side laag; staat die er niet, dan is de koppeling eruit ook
 *     al antwoordt de API.
 *  4. De affiches op /this-week komen van media.clubtickets.com via onze
 *     image-optimizer. Gaat die keten stuk, dan blijft de lijst staan met
 *     lege vlakken.
 *
 * Exit 1 zodra één controle faalt, zodat een workflow eraan kan hangen.
 * Geen afhankelijkheden: draait met kale node, zonder build en zonder npm ci.
 */

const BASE = (process.env.LIVE_BASE_URL || 'https://www.ibizamivida.com').replace(/\/$/, '')
const TIMEOUT_MS = 15000
const MAX_FEED_AGE_MIN = 180 // de feed wordt elke 15 min ververst; 3 uur is ruim

let mislukt = 0
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`)
const fout = (m) => { mislukt++; console.log(`  \x1b[31m✗\x1b[0m ${m}`) }

/** Eén herkansing: een enkele netwerkhik is geen storing. */
async function haal(url, opts = {}) {
  for (let poging = 1; poging <= 2; poging++) {
    try {
      return await fetch(url, { ...opts, signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'follow' })
    } catch (e) {
      if (poging === 2) throw e
      await new Promise(r => setTimeout(r, 1500))
    }
  }
}

console.log(`Live check — ${BASE}\n`)

// ── 1. Wordt de site geïndexeerd? ────────────────────────────────────────
console.log('x-robots-tag')
try {
  const res = await haal(`${BASE}/en`)
  const robots = res.headers.get('x-robots-tag') || ''
  if (!res.ok) fout(`/en gaf HTTP ${res.status}`)
  else if (/noindex/i.test(robots)) fout(`/en stuurt "x-robots-tag: ${robots}" — de site staat op noindex. Controleer NEXT_PUBLIC_SITE_URL: die moet exact de host zijn waarop de site draait, mét www.`)
  else ok(`/en indexeerbaar${robots ? ` (x-robots-tag: ${robots})` : ' (geen x-robots-tag)'}`)
} catch (e) { fout(`/en onbereikbaar: ${e?.message || e}`) }

// ── 2. Antwoordt de partnerfeed via onze eigen route? ────────────────────
console.log('\n/api/fleet-live')
try {
  const res = await haal(`${BASE}/api/fleet-live`)
  if (res.status === 503) {
    fout('503 — de partnerfeed is nu niet bruikbaar. De bootkaarten tonen alleen de statische prijsbanden.')
  } else if (!res.ok) {
    fout(`HTTP ${res.status}`)
  } else {
    const d = await res.json()
    const aantal = Object.keys(d?.boats || {}).length
    if (!d?.generatedAt || !aantal) {
      fout('antwoord zonder generatedAt of zonder boten')
    } else {
      const minuten = Math.round((Date.now() - new Date(d.generatedAt).getTime()) / 60000)
      ok(`${aantal} boten · bereik ${d.rangeStart} → ${d.rangeEnd}`)
      if (minuten > MAX_FEED_AGE_MIN) fout(`generatedAt is ${minuten} min oud (grens ${MAX_FEED_AGE_MIN}) — de feed hangt op een oude stand`)
      else ok(`stand is ${minuten} min oud`)
    }
  }
} catch (e) { fout(`onbereikbaar: ${e?.message || e}`) }

// ── 3. Staat de live laag server-side in de charterpagina? ───────────────
console.log('\nLive beschikbaarheid in de HTML')
try {
  const res = await haal(`${BASE}/nl/private-boat-charters`)
  const html = (await res.text()).replace(/<!-- -->/g, '')
  const kaarten = (html.match(/<article/g) || []).length
  const pillen = (html.match(/Beschikbaar|Geboekt|In optie/g) || []).length
  if (!res.ok) fout(`HTTP ${res.status}`)
  else if (!kaarten) fout('geen bootkaarten in de HTML')
  else if (!pillen) fout(`${kaarten} kaarten, maar geen enkele statusregel — de live laag rendert niet server-side`)
  else ok(`${kaarten} kaarten, ${pillen} statusregels in de kale HTML`)
} catch (e) { fout(`onbereikbaar: ${e?.message || e}`) }

// ── 4. Laden de affiches op /this-week? ──────────────────────────────────
console.log('\nAffiches op /this-week')
try {
  const res = await haal(`${BASE}/en/this-week`)
  const html = await res.text()
  const srcs = [...new Set([...html.matchAll(/srcSet="([^"]*?)"/g)]
    .map(m => m[1].split(',')[0].trim().split(' ')[0])
    .filter(u => u.includes('/_next/image')))].slice(0, 5)
  if (!res.ok) fout(`HTTP ${res.status}`)
  else if (!srcs.length) fout('geen affiches in de HTML gevonden')
  else {
    let goed = 0
    for (const src of srcs) {
      const u = src.startsWith('http') ? src : BASE + src.replace(/&amp;/g, '&')
      try {
        const r = await haal(u)
        if (r.ok && (r.headers.get('content-type') || '').startsWith('image/')) goed++
        else fout(`${r.status} ${(r.headers.get('content-type') || '?')} — ${decodeURIComponent(u).slice(0, 110)}`)
      } catch (e) { fout(`onbereikbaar — ${decodeURIComponent(u).slice(0, 110)}`) }
    }
    if (goed === srcs.length) ok(`${goed}/${srcs.length} steekproef-affiches laden`)
  }
} catch (e) { fout(`onbereikbaar: ${e?.message || e}`) }

// ── 5. Staan de echte Google-reviews op de site? ─────────────────────────
// Bewust géén harde fout zolang de koppeling nooit gewerkt heeft: dat is een
// configuratiestand (GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID in Vercel), geen
// storing. Maar zodra hij ooit gewerkt heeft, is wegvallen wél stil — de
// site rendert gewoon door zonder cijfer. Daarom staat het hier zichtbaar.
console.log('\nGoogle-reviews')
try {
  const res = await haal(`${BASE}/en`)
  const html = (await res.text()).replace(/<!-- -->/g, '')
  const badge = /Google rating [\d.,]+ out of 5, based on \d+ reviews/i.test(html) || /aria-label="[^"]*out of 5[^"]*"/i.test(html)
  // Alle drie booleans. De eerste versie telde de reviewsectie als getal en
  // vergeleek dat met een boolean: 0 !== false is in JavaScript wáár, dus
  // "allebei afwezig" werd gemeld als "lopen uit elkaar".
  const teksten = /What guests say on Google/.test(html)
  const schema = /"@type"\s*:\s*"AggregateRating"/.test(html)
  if (badge || teksten || schema) {
    ok(`gekoppeld — cijfer ${badge ? 'zichtbaar' : 'ontbreekt'}, AggregateRating-schema ${schema ? 'aanwezig' : 'ontbreekt'}, reviewsectie ${teksten ? 'aanwezig' : 'ontbreekt'}`)
    // Zo zit de code in elkaar, en daar toetst dit op:
    //  - het cijfer komt uit rating + aantal en staat los van de teksten;
    //  - GoogleReviews én ReviewSchema renderen allebei alleen als er
    //    geschreven reviews zijn (reviews.length > 0) — dus die twee horen
    //    altijd sámen aan of sámen uit te staan.
    // Een profiel met beoordelingen maar zonder geschreven review geeft dus
    // terecht: cijfer ja, sectie nee, schema nee. Dat is informatie, geen
    // storing. Uit elkaar lopen van sectie en schema is wél een storing.
    if (teksten !== schema) fout('reviewsectie en Review/AggregateRating-schema komen uit dezelfde bron (reviews.length > 0) en horen samen te gaan; één ervan ontbreekt')
    else if (!badge) fout('reviews zonder cijfer kan niet: de rating ontbreekt terwijl er wel reviews renderen')
    else if (!teksten) console.log('  \x1b[33m⚠\x1b[0m cijfer staat, maar geen geschreven reviews (nog): sectie en schema blijven dan allebei bewust weg')
  } else {
    console.log('  \x1b[33m⚠\x1b[0m niet gekoppeld: geen cijfer, geen reviewsectie, geen schema op /en. Zet GOOGLE_PLACES_API_KEY en GOOGLE_PLACE_ID in Vercel (zie .env.example).')
  }
} catch (e) { fout(`onbereikbaar: ${e?.message || e}`) }

console.log(mislukt === 0 ? '\n\x1b[32mPASS  live: alles in orde\x1b[0m' : `\n\x1b[31mFAIL  live: ${mislukt} controle(s) mislukt\x1b[0m`)
process.exit(mislukt === 0 ? 0 : 1)
