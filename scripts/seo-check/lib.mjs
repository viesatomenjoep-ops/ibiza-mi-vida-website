/**
 * Shared plumbing for the SEO check scripts.
 *
 * Zero dependencies on purpose: these run in CI on every PR, and a check suite
 * that needs its own install step is a check suite that gets skipped. Node's
 * built-in fetch plus a handful of regexes is enough, because everything being
 * asserted lives in the raw server-rendered HTML — which is itself the point.
 * If a check ever needs a DOM to find something, that something was not in the
 * HTML, and the check should fail rather than reach for a parser.
 */

import { readFileSync, writeFileSync } from 'node:fs'

export const BASE = (process.env.CHECK_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
export const LOCALES = ['en', 'nl', 'de', 'es', 'fr']
export const DEFAULT_LOCALE = 'en'

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

export const c = {
  pass: (s) => `${GREEN}${s}${RESET}`,
  fail: (s) => `${RED}${s}${RESET}`,
  warn: (s) => `${YELLOW}${s}${RESET}`,
  dim: (s) => `${DIM}${s}${RESET}`,
}

/**
 * Known pre-existing failures, so the suite can be enforced from day one.
 *
 * When these checks were first written they found 300-plus problems across
 * pages that predate them — meta descriptions on generated month and venue
 * pages, sections with no structured data, a canonical pointing at the wrong
 * URL. Blocking every PR until all of that is fixed would have meant the checks
 * never went into CI at all, which is the usual way a linter dies on a legacy
 * codebase.
 *
 * So the baseline records what was already broken. Anything in it is reported
 * as KNOWN and does not fail the run; anything NOT in it fails. New code is
 * held to the standard immediately, and the backlog is visible rather than
 * silently tolerated.
 *
 * The baseline is a debt list, not a permission slip. It should only ever
 * shrink. Regenerate it with `npm run check:seo -- --update-baseline` after
 * FIXING things, never to make a new failure go away.
 */
const BASELINE_PATH = new URL('./baseline.json', import.meta.url)

function loadBaseline() {
  try {
    return new Set(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).known)
  } catch {
    return new Set()
  }
}

/**
 * A stable identity for a failure.
 *
 * Numbers are stripped from the message so that "Meta description is 102
 * characters" and "…is 103 characters" are the same known issue — otherwise
 * every regeneration of a data-driven page would look like a brand new failure.
 */
export function failureKey(check, where, message) {
  // Collapse data-driven paths to their template: /en/club-tickets/hi-ibiza/x
  // becomes /en/club-tickets/*. Event, venue and artist URLs churn every time
  // the ClubTickets sync runs, so a baseline keyed on exact URLs would go stale
  // within a day and start reporting brand-new "failures" for pages that are
  // simply new. The trade-off is deliberate and worth naming: a second failure
  // of the same type on the same template is absorbed by the same key. Landing
  // pages, which have one URL each and no churn, keep their exact path.
  const [locale, path = ''] = where.split(' ')
  const segments = path.split('/').filter(Boolean)
  const template = segments.length > 2 ? `/${segments.slice(0, 2).join('/')}/*` : path
  return `${check}|${locale} ${template}|${message.replace(/\d+/g, 'N').slice(0, 120)}`
}

/** Collects failures so a run reports every problem, not just the first. */
export class Report {
  constructor(name) {
    this.name = name
    this.failures = []
    this.known = []
    this.warnings = []
    this.checked = 0
    this.baseline = loadBaseline()
    this.updating = process.argv.includes('--update-baseline')
  }

  fail(where, message) {
    const key = failureKey(this.name, where, message)
    if (!this.updating && this.baseline.has(key)) this.known.push({ where, message, key })
    else this.failures.push({ where, message, key })
  }

  warn(where, message) {
    this.warnings.push({ where, message })
  }

  /** Prints the outcome and returns the process exit code. */
  finish() {
    for (const w of this.warnings) {
      console.log(`${c.warn('WARN')} ${w.where}\n     ${w.message}`)
    }
    for (const f of this.failures) {
      console.log(`${c.fail('FAIL')} ${f.where}\n     ${f.message}`)
    }

    if (this.updating) {
      writeFileSync(
        BASELINE_PATH,
        JSON.stringify(
          {
            _comment:
              'Known pre-existing SEO check failures. This list should only ever shrink. ' +
              'Regenerate with `npm run check:seo -- --update-baseline` after FIXING issues, ' +
              'never to silence a new one. See docs/search-setup.md.',
            generated: new Date().toISOString().slice(0, 10),
            known: [...new Set([...this.baseline, ...this.failures.map((f) => f.key)])].sort(),
          },
          null,
          2,
        ) + '\n',
      )
      console.log(c.warn(`${this.name}: baseline updated with ${this.failures.length} entries.`))
      return 0
    }

    const ok = this.failures.length === 0
    const knownNote = this.known.length ? `, ${this.known.length} known (baseline)` : ''
    const summary = `${this.name}: ${this.checked} checked, ${this.failures.length} failed${knownNote}, ${this.warnings.length} warnings`
    console.log(ok ? c.pass(`PASS  ${summary}`) : c.fail(`FAIL  ${summary}`))
    return ok ? 0 : 1
  }
}

/** Fetch a URL and return { status, headers, html }. Never throws on HTTP errors. */
export async function get(url) {
  const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'ibiza-mi-vida-seo-check' } })
  const html = res.status >= 200 && res.status < 400 ? await res.text() : ''
  return { status: res.status, headers: res.headers, html, url }
}

/** All <loc> values from the live sitemap — the routes every check runs against. */
export async function sitemapUrls() {
  return (await sitemapEntries()).map((e) => e.loc)
}

/**
 * The sitemap parsed into { loc, alternates } — the declared hreflang cluster
 * for every URL.
 *
 * This is what makes "is the hreflang complete?" answerable without hardcoding
 * "all five locales". Not every page exists in every language: the two big
 * pillars are written in all five, while several spokes are English-only for
 * now. A page that claimed five alternates while four of them 404 would be
 * worse than one claiming a single language — Google drops a cluster whose
 * links do not resolve.
 *
 * So the sitemap is the contract. It declares which languages a page exists in,
 * and the check asserts the page's <head> says exactly the same thing.
 */
export async function sitemapEntries() {
  const { status, html } = await get(`${BASE}/sitemap.xml`)
  if (status !== 200) throw new Error(`sitemap.xml returned ${status} — is the server running on ${BASE}?`)
  const entries = []
  for (const block of html.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = (block.match(/<loc>(.*?)<\/loc>/) || [])[1]
    if (!loc) continue
    const alternates = {}
    for (const m of block.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"[^>]*\/?>/g)) {
      alternates[m[1]] = m[2].replace(/&amp;/g, '&')
    }
    entries.push({ loc: loc.replace(/&amp;/g, '&'), alternates })
  }
  return entries
}

/**
 * Turn an absolute sitemap URL into a { locale, path } pair.
 * The path is locale-agnostic, so the five language versions of one page all
 * reduce to the same path — which is what the hreflang symmetry check needs.
 */
export function splitLocale(absoluteUrl) {
  const u = new URL(absoluteUrl)
  const segments = u.pathname.split('/').filter(Boolean)
  const locale = LOCALES.includes(segments[0]) ? segments[0] : null
  const path = locale ? segments.slice(1).join('/') : segments.join('/')
  return { locale, path, pathname: u.pathname }
}

/** Rewrites a production URL onto the base being tested (localhost in CI). */
export function onBase(absoluteUrl) {
  const u = new URL(absoluteUrl)
  return `${BASE}${u.pathname}${u.search}`
}

/** Every <link rel="alternate" hreflang="..."> in a document. */
export function hreflangs(html) {
  const out = []
  const linkTags = html.match(/<link\b[^>]*>/gi) || []
  for (const tag of linkTags) {
    if (!/rel=["']alternate["']/i.test(tag)) continue
    const lang = tag.match(/hreflang=["']([^"']+)["']/i)
    const href = tag.match(/href=["']([^"']+)["']/i)
    if (lang && href) out.push({ hreflang: lang[1], href: href[1] })
  }
  return out
}

/** The canonical URL, or null. */
export function canonical(html) {
  const tag = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) || [])[0]
  if (!tag) return null
  const href = tag.match(/href=["']([^"']+)["']/i)
  return href ? href[1] : null
}

/** Every JSON-LD block's raw text. */
export function jsonLdBlocks(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1].trim())
    .filter(Boolean)
}

/** Text content of the first matching tag, tags stripped and entities decoded. */
export function tagText(html, tag) {
  const m = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return m ? decode(stripTags(m[1])) : null
}

export function allTagText(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi'))]
    .map((m) => decode(stripTags(m[1])))
}

export function metaContent(html, name) {
  const re = new RegExp(`<meta\\b[^>]*name=["']${name}["'][^>]*>`, 'i')
  const tag = (html.match(re) || [])[0]
  if (!tag) return null
  const content = tag.match(/content=["']([^"']*)["']/i)
  return content ? decode(content[1]) : null
}

export const stripTags = (s) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .trim()
}

/** Small concurrency limiter — a 300-URL sitemap must not open 300 sockets. */
export async function mapLimit(items, limit, fn) {
  const results = []
  let i = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  })
  await Promise.all(workers)
  return results
}

/**
 * Routes to check.
 *
 * The sitemap carries ~2,000 URLs, most of them the same three templates
 * repeated over every event, artist and venue. Fetching all of them on every
 * PR would take minutes and tell us nothing the first few of each template did
 * not — and a check suite slow enough to be annoying is a check suite someone
 * eventually deletes from CI.
 *
 * So the default is a stratified sample: every route grouped by its first path
 * segment (the template it belongs to), small groups checked in full, large
 * groups sampled. Every template stays covered, every hub and pillar page is
 * checked in full because those groups are small, and the run stays in the tens
 * of seconds.
 *
 * Override with:
 *   CHECK_ROUTES=boat-rental-ibiza,car-rental-ibiza   one or more exact paths
 *   CHECK_ALL=1                                       the entire sitemap
 *   CHECK_SAMPLE=5                                    per-template sample size
 */
export async function routesToCheck() {
  const entries = await sitemapEntries()
  const parsed = entries.map((e) => ({ ...splitLocale(e.loc), absolute: e.loc, alternates: e.alternates }))

  const only = (process.env.CHECK_ROUTES || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (only.length) return parsed.filter((r) => only.includes(r.path))
  if (process.env.CHECK_ALL === '1') return parsed

  const sampleSize = Number(process.env.CHECK_SAMPLE || 3)
  const groups = new Map()
  for (const r of parsed) {
    // Group key = locale + first path segment, so each template is sampled
    // per language rather than only ever in one.
    const key = `${r.locale}/${r.path.split('/')[0] || '(home)'}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(r)
  }

  const out = []
  for (const [, members] of groups) {
    if (members.length <= sampleSize) out.push(...members)
    else {
      // Deterministic spread rather than random: a check that picks different
      // URLs each run turns an intermittent failure into an unreproducible one.
      const step = Math.floor(members.length / sampleSize)
      for (let i = 0; i < sampleSize; i++) out.push(members[i * step])
    }
  }
  return out
}
