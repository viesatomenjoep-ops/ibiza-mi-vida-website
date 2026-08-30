#!/usr/bin/env node
/**
 * Find event covers that are blank placeholders and write them to a blocklist.
 *
 * ClubTickets serves a solid-black image for some events — verified: the
 * Swedish House Mafia cover is a 1200x806 all-black JPEG, and several events
 * share byte-identical placeholder files. Nothing is wrong with our rendering;
 * the source image genuinely has no picture in it, so the card shows a black
 * box. Dropping those URLs lets the existing fallback chain (eventLogo ->
 * venueCover -> venue logo) supply something real instead.
 *
 * Detection is by CONTENT HASH, not filename or size: the same placeholder is
 * reused across events, so one confirmed hash removes every copy of it. Size
 * alone would also catch legitimately small logos.
 *
 * Run after `npm run sync-clubtickets`:  node scripts/find-blank-covers.mjs
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'

const DATA = 'src/data/clubtickets_nl.json'
const OUT = 'src/data/blank-covers.json'
/** Hashes confirmed by eye to be solid-colour placeholders. */
const KNOWN_BLANK = new Set(['e385cc99f6', '054b2e1dde', '104b2b2aef'])

const data = JSON.parse(readFileSync(DATA, 'utf8'))
const urls = new Set()
for (const d of data.dates || []) {
  for (const k of ['eventCover', 'eventLogo']) {
    const u = String(d[k] || '')
    if (u.startsWith('http')) urls.add(u)
  }
}

const blank = []
let checked = 0
await Promise.all([...urls].map(async (u) => {
  try {
    const res = await fetch(u)
    if (!res.ok) return
    const buf = Buffer.from(await res.arrayBuffer())
    const h = createHash('md5').update(buf).digest('hex').slice(0, 10)
    checked++
    if (KNOWN_BLANK.has(h)) blank.push(u)
  } catch { /* a fetch failure is not evidence of blankness */ }
}))

blank.sort()
writeFileSync(OUT, JSON.stringify(blank, null, 1) + '\n')
console.log(`checked ${checked} images, ${blank.length} blank placeholders -> ${OUT}`)
