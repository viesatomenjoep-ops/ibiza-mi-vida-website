#!/usr/bin/env node
/**
 * Asserts that every public page's content exists in the server-rendered HTML.
 *
 * This is the project's hardest rule made testable. OAI-SearchBot,
 * PerplexityBot and ClaudeBot do not execute JavaScript: whatever appears only
 * after hydration is, to them, absent. A single `"use client"` added to a route
 * page can empty an entire page for the crawlers this site is built to be cited
 * by, and the page will still look perfect in a browser — which is precisely
 * why this needs a script rather than a code review.
 *
 * What it asserts, all against the raw HTML with no JS run:
 *   1. HTTP 200
 *   2. exactly one <h1>, with real text in it
 *   3. a meaningful amount of body text (not an empty shell)
 *   4. no noindex — neither the meta tag nor the X-Robots-Tag header
 *   5. an <html lang> that matches the URL's locale
 *
 * Usage: npm run check:ssr   [CHECK_ROUTES=… CHECK_BASE_URL=…]
 */

import { Report, get, onBase, mapLimit, routesToCheck, allTagText, stripTags, decode, c } from './seo-check/lib.mjs'

const report = new Report('ssr')

/**
 * Minimum visible characters for a page to count as rendered.
 *
 * Chosen to sit far below any real page and far above an empty shell: the
 * layout chrome (nav + footer) alone lands near this figure, so a page whose
 * own content failed to render server-side falls under it.
 */
const MIN_TEXT = 600

async function main() {
  const routes = await routesToCheck()
  if (!routes.length) {
    console.log(c.warn('ssr: no routes matched — nothing to check.'))
    return 0
  }

  await mapLimit(routes, 8, async (r) => {
    const url = onBase(r.absolute)
    const { status, html, headers } = await get(url)
    const where = `${r.locale ?? '?'} ${r.pathname}`
    report.checked++

    if (status !== 200) {
      report.fail(where, `HTTP ${status}`)
      return
    }

    // 2. exactly one h1
    const h1s = allTagText(html, 'h1').filter((t) => t.length > 0)
    if (h1s.length === 0) {
      report.fail(where, 'No <h1> in the server-rendered HTML.')
    } else if (h1s.length > 1) {
      report.fail(where, `${h1s.length} <h1> elements: ${h1s.map((h) => `"${h.slice(0, 40)}"`).join(', ')}`)
    }

    // 3. real content, not a hydration shell
    const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)
    const text = decode(stripTags(bodyMatch ? bodyMatch[1] : html))
    if (text.length < MIN_TEXT) {
      report.fail(
        where,
        `Only ${text.length} characters of text in the server HTML (minimum ${MIN_TEXT}). ` +
          'This is what a client-rendered page looks like to a crawler that runs no JavaScript.',
      )
    }

    // 4. no noindex, in either place it can hide
    if (/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
      report.fail(where, 'Page carries <meta name="robots" content="noindex">.')
    }
    const xRobots = headers.get('x-robots-tag')
    if (xRobots && /noindex/i.test(xRobots)) {
      report.fail(where, `Response carries X-Robots-Tag: ${xRobots}`)
    }

    // 5. lang attribute matches the URL
    const lang = (html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i) || [])[1]
    if (!lang) {
      report.fail(where, 'No lang attribute on <html>.')
    } else if (r.locale && lang.split('-')[0] !== r.locale) {
      report.fail(where, `<html lang="${lang}"> does not match the URL locale "${r.locale}".`)
    }
  })

  return report.finish()
}

main()
  .then((code) => { process.exitCode = code })
  .catch((e) => {
    console.error(c.fail(`ssr check could not run: ${e.message}`))
    process.exitCode = 1
  })
