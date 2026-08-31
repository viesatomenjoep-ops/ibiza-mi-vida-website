#!/usr/bin/env node
/**
 * Validates the hreflang cluster across every route in the sitemap.
 *
 * hreflang is unusual among SEO signals in that it is only worth anything when
 * it is complete and mutually consistent. Google discards a whole cluster when
 * the links do not reciprocate, so a page that lists four alternates but is
 * listed by none of them contributes nothing — and nothing in Search Console
 * says so loudly. That is what this script exists to catch, before a deploy
 * rather than six weeks later.
 *
 * Five assertions per route:
 *   1. self-reference — the page lists its own locale, pointing at itself
 *   2. completeness   — every locale we publish is present
 *   3. x-default      — present, and pointing at the /en version
 *   4. valid codes    — only locales we actually publish, no duplicates
 *   5. symmetry       — every alternate lists this page back, with the same URL
 *
 * Usage:
 *   npm run check:hreflang
 *   CHECK_BASE_URL=https://www.ibizamivida.com npm run check:hreflang
 *   CHECK_ROUTES=boat-rental-ibiza npm run check:hreflang
 */

import { BASE, LOCALES, DEFAULT_LOCALE, Report, get, hreflangs, canonical, onBase, mapLimit, routesToCheck, c } from './seo-check/lib.mjs'

const report = new Report('hreflang')

/** Normalise for comparison: strip trailing slash, ignore protocol/host drift. */
const norm = (href) => {
  try {
    return new URL(href, BASE).pathname.replace(/\/$/, '') || '/'
  } catch {
    return href
  }
}

async function main() {
  const routes = await routesToCheck()
  if (!routes.length) {
    console.log(c.warn('hreflang: no routes matched — nothing to check.'))
    return 0
  }

  // Fetch every route once, then reason over the whole set: symmetry cannot be
  // judged from a single page.
  const pages = new Map()
  await mapLimit(routes, 8, async (r) => {
    const url = onBase(r.absolute)
    const { status, html } = await get(url)
    pages.set(r.pathname.replace(/\/$/, ''), { ...r, url, status, html })
  })

  for (const [pathname, page] of pages) {
    report.checked++
    const where = `${page.locale ?? '?'} ${pathname}`

    if (page.status !== 200) {
      report.fail(where, `HTTP ${page.status} — page did not render, so hreflang could not be read.`)
      continue
    }

    const tags = hreflangs(page.html)
    if (!tags.length) {
      report.fail(where, 'No <link rel="alternate" hreflang> tags at all.')
      continue
    }

    const byLang = new Map()
    for (const t of tags) {
      if (byLang.has(t.hreflang)) {
        report.fail(where, `Duplicate hreflang="${t.hreflang}" — a cluster with duplicates is discarded.`)
      }
      byLang.set(t.hreflang, t.href)
    }

    // 4. valid codes
    for (const lang of byLang.keys()) {
      if (lang !== 'x-default' && !LOCALES.includes(lang)) {
        report.fail(where, `hreflang="${lang}" is not a locale this site publishes (${LOCALES.join(', ')}).`)
      }
    }

    // 1. self-reference
    const self = byLang.get(page.locale)
    if (!self) {
      report.fail(where, `Missing self-referencing hreflang="${page.locale}".`)
    } else if (norm(self) !== pathname) {
      report.fail(where, `Self-reference points at ${norm(self)}, not at this page (${pathname}).`)
    }

    // 2. completeness, measured against what the sitemap declares for this URL
    //    rather than against all five locales. Not every page exists in every
    //    language — the pillars do, several spokes are English-only — and a
    //    page claiming an alternate that 404s invalidates the whole cluster.
    const declared = Object.keys(page.alternates || {}).filter((l) => l !== 'x-default')
    const expected = declared.length ? declared : [page.locale]
    for (const l of expected) {
      if (!byLang.has(l)) {
        report.fail(where, `Missing alternate for locale "${l}", which the sitemap declares for this page.`)
      }
    }
    for (const l of byLang.keys()) {
      if (l === 'x-default') continue
      if (expected.length && !expected.includes(l)) {
        report.fail(where, `Page declares hreflang="${l}" but the sitemap does not list that language for this URL — the alternate may not exist.`)
      }
    }

    // 3. x-default → /en
    const xd = byLang.get('x-default')
    if (!xd) {
      report.fail(where, 'Missing x-default.')
    } else {
      const expected = norm(byLang.get(DEFAULT_LOCALE) ?? '')
      if (expected && norm(xd) !== expected) {
        report.fail(where, `x-default points at ${norm(xd)} but should match the ${DEFAULT_LOCALE} version (${expected}).`)
      }
    }

    // Canonical must be self-referencing, or the cluster is ambiguous.
    const canon = canonical(page.html)
    if (!canon) {
      report.fail(where, 'No canonical link.')
    } else if (norm(canon) !== pathname) {
      report.fail(where, `Canonical points at ${norm(canon)} rather than this page — the alternates then describe a page that does not claim itself.`)
    }

    // 5. symmetry — every alternate we point at must point back at us.
    for (const [lang, href] of byLang) {
      if (lang === 'x-default') continue
      const target = pages.get(norm(href))
      if (!target) continue // not in the checked subset; covered by its own run
      if (target.status !== 200) continue
      const back = hreflangs(target.html).find((t) => t.hreflang === page.locale)
      if (!back) {
        report.fail(where, `Asymmetric: we list ${lang} (${norm(href)}), but that page does not list "${page.locale}" back.`)
      } else if (norm(back.href) !== pathname) {
        report.fail(where, `Asymmetric: ${lang} points its "${page.locale}" alternate at ${norm(back.href)}, not at ${pathname}.`)
      }
    }
  }

  return report.finish()
}

main()
  .then((code) => { process.exitCode = code })
  .catch((e) => {
    console.error(c.fail(`hreflang check could not run: ${e.message}`))
    process.exitCode = 1
  })
