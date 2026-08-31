#!/usr/bin/env node
/**
 * On-page metadata audit: titles, descriptions, headings and image alt text.
 *
 * These are the checks a person does by eye on one page and never repeats
 * across 200 URLs in five languages. Everything here is mechanical — length
 * bounds, uniqueness, presence — which is exactly the kind of thing that
 * silently rots as pages get added.
 *
 * Assertions:
 *   1. <title> present, ≤ 60 characters, and unique across the site
 *   2. meta description present, 140–160 characters, and unique
 *   3. exactly one <h1>
 *   4. every <img> has a non-empty alt (or an explicit alt="" if decorative,
 *      which is valid and is treated as intentional)
 *   5. no heading level is skipped (h1 → h3 with no h2)
 *
 * Usage: npm run check:onpage   [CHECK_ROUTES=… CHECK_BASE_URL=…]
 */

import { Report, get, onBase, mapLimit, routesToCheck, tagText, metaContent, allTagText, c } from './seo-check/lib.mjs'

const report = new Report('onpage')

const TITLE_MAX = 60
const DESC_MIN = 140
const DESC_MAX = 160

async function main() {
  const routes = await routesToCheck()
  if (!routes.length) {
    console.log(c.warn('onpage: no routes matched — nothing to check.'))
    return 0
  }

  // Uniqueness is judged in a second, sorted pass rather than as pages arrive.
  // Fetches run concurrently, so "which page did I see this title on first?"
  // varies between runs — and a check whose message changes run to run cannot
  // be baselined, and reports a different page as the culprit each time.
  const titles = new Map()
  const descriptions = new Map()

  await mapLimit(routes, 8, async (r) => {
    const url = onBase(r.absolute)
    const { status, html } = await get(url)
    const where = `${r.locale ?? '?'} ${r.pathname}`
    report.checked++

    if (status !== 200) {
      report.fail(where, `HTTP ${status}`)
      return
    }

    // 1. title
    const title = tagText(html, 'title')
    if (!title) {
      report.fail(where, 'No <title>.')
    } else {
      if (title.length > TITLE_MAX) {
        report.fail(where, `Title is ${title.length} characters (max ${TITLE_MAX}): "${title}"`)
      }
      // Per locale, niet site-breed. Dezelfde titel op /en/artists/deseo en
      // /de/artists/deseo is geen duplicaat maar een taalvariant, en hreflang
      // vertelt Google dat ook — een artiestennaam vertaalt nu eenmaal niet.
      // Wat wél fout is: twee VERSCHILLENDE pagina's in dezelfde taal die om
      // dezelfde titel concurreren.
      const tkey = `${r.locale}|${title}`
      if (!titles.has(tkey)) titles.set(tkey, [])
      titles.get(tkey).push(where)
    }

    // 2. description
    const desc = metaContent(html, 'description')
    if (!desc) {
      report.fail(where, 'No meta description.')
    } else {
      if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
        report.fail(where, `Meta description is ${desc.length} characters (want ${DESC_MIN}–${DESC_MAX}): "${desc.slice(0, 80)}…"`)
      }
      const dkey = `${r.locale}|${desc}`
      if (!descriptions.has(dkey)) descriptions.set(dkey, [])
      descriptions.get(dkey).push(where)
    }

    // 3. one h1
    const h1s = allTagText(html, 'h1').filter(Boolean)
    if (h1s.length !== 1) report.fail(where, `${h1s.length} <h1> elements (want exactly 1).`)

    // 4. image alt text
    const imgs = html.match(/<img\b[^>]*>/gi) || []
    let missing = 0
    for (const img of imgs) {
      if (!/\balt=/i.test(img)) missing++
    }
    if (missing) {
      report.fail(where, `${missing} of ${imgs.length} <img> elements have no alt attribute.`)
    }

    // 5. heading order
    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((m) => Number(m[1]))
    let previous = 0
    for (const level of headings) {
      if (previous && level > previous + 1) {
        report.fail(where, `Heading level jumps from h${previous} to h${level}.`)
        break
      }
      previous = level
    }
  })

  // Deterministic duplicate reporting: the alphabetically first URL is treated
  // as the original and every other one is reported against it, so the same
  // input always produces the same failures in the same order.
  for (const [label, map] of [['Title', titles], ['Meta description', descriptions]]) {
    for (const [key, pages] of map) {
      const value = key.slice(key.indexOf('|') + 1)
      if (pages.length < 2) continue
      const sorted = [...pages].sort()
      const [original, ...duplicates] = sorted
      for (const dup of duplicates) {
        report.fail(dup, `${label} is identical to ${original}: "${value.slice(0, 70)}"`)
      }
    }
  }

  return report.finish()
}

main()
  .then((code) => { process.exitCode = code })
  .catch((e) => {
    console.error(c.fail(`onpage check could not run: ${e.message}`))
    process.exitCode = 1
  })
