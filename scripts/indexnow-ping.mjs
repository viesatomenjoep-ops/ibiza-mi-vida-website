#!/usr/bin/env node
/**
 * Tell Bing (and Yandex, Naver, Seznam) that URLs changed, via IndexNow.
 *
 * Why this matters beyond Bing itself: ChatGPT's web search runs on Bing's
 * index, not Google's — OpenAI's search partnership is with Microsoft. Google
 * discovers our changes through the sitemap and its own crawl schedule, but
 * Bing crawls smaller sites far less often, so an event calendar that updates
 * daily can sit stale in the index for weeks. IndexNow is a push instead of a
 * wait, and it is the cheapest lever we have on ChatGPT visibility.
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                     # key pages
 *   node scripts/indexnow-ping.mjs --sitemap           # everything in the sitemap
 *   node scripts/indexnow-ping.mjs /en/boats /nl/clubs # only these changed URLs
 *   node scripts/indexnow-ping.mjs --file=changed.txt  # one URL or path per line
 *   git diff --name-only | node scripts/indexnow-ping.mjs --stdin
 *   node scripts/indexnow-ping.mjs --dry-run           # print, submit nothing
 *   node scripts/indexnow-ping.mjs --on-deploy         # no-op unless this is a
 *                                                      # Vercel production build
 *
 * Run it after `npm run sync-clubtickets`, when the event data has actually
 * changed. Pinging unchanged URLs is pointless and gets a host throttled —
 * which is the whole reason the explicit changed-URL forms above exist: a
 * daily calendar sync changes a handful of pages, not the entire sitemap.
 *
 * `--on-deploy` is wired into postbuild. Before that, this file was a manual
 * command that nothing ever called: the lever described above existed but was
 * never pulled, so Bing's copy of a calendar that changes every day went stale
 * between whenever somebody last remembered to run it. The flag exists so the
 * same script can sit in postbuild without every local `npm run build` firing
 * a submission at Bing.
 */

import { readFileSync } from 'node:fs'

const KEY = '006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae'
const HOST = 'www.ibizamivida.com'
const SITE = `https://${HOST}`
const LOCALES = ['nl', 'en', 'de', 'es', 'fr']

/** The pages worth pushing on a routine sync. */
const KEY_PATHS = ['', '/calendar', '/clubs', '/artists', '/boats', '/boat-party', '/ferry-formentera', '/private-boat-charters', '/guestlist']

const argv = process.argv.slice(2)
const hasFlag = (name) => argv.includes(`--${name}`)
const flagValue = (name) => {
  const prefix = `--${name}=`
  const hit = argv.find((a) => a.startsWith(prefix))
  return hit ? hit.slice(prefix.length) : null
}

async function fromSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'))
}

/** Everything on stdin, or '' when nothing is piped in. */
async function readStdin() {
  if (process.stdin.isTTY) return ''
  let data = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) data += chunk
  return data
}

/**
 * One URL per line, blank lines and `#` comments dropped.
 *
 * Accepts paths as readily as absolute URLs so the common case — a deploy
 * script or a sync job that knows it touched /en/boats — does not have to
 * paste the origin onto every line.
 */
const parseList = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, '').trim())
    .filter(Boolean)

/**
 * Paths become absolute; absolute URLs are kept as-is.
 *
 * IndexNow rejects the entire submission with 422 if a single URL belongs to
 * another host, so a foreign host is worth failing on here, locally, where the
 * message can name the offending line — rather than losing the whole batch to
 * a status code from Microsoft.
 */
function normalise(entry) {
  const url = entry.startsWith('http://') || entry.startsWith('https://')
    ? entry
    : `${SITE}${entry.startsWith('/') ? '' : '/'}${entry}`

  let parsed
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`not a URL: ${entry}`)
  }
  if (parsed.host !== HOST) {
    throw new Error(`wrong host: ${url} (IndexNow only accepts ${HOST}; the whole batch would be rejected)`)
  }
  return parsed.toString()
}

/** Where the URLs for this run come from, in order of precedence. */
async function collectUrls() {
  const explicit = []

  // Repeatable --url=…, and bare positional arguments (anything not a flag).
  for (const arg of argv) {
    if (arg.startsWith('--url=')) explicit.push(arg.slice('--url='.length))
    else if (!arg.startsWith('--')) explicit.push(arg)
  }

  const file = flagValue('file')
  if (file) explicit.push(...parseList(readFileSync(file, 'utf8')))

  if (hasFlag('stdin')) explicit.push(...parseList(await readStdin()))

  if (explicit.length) return { urls: explicit.map(normalise), source: 'changed URLs' }
  if (hasFlag('sitemap')) return { urls: await fromSitemap(), source: 'sitemap' }

  return {
    urls: LOCALES.flatMap((l) => KEY_PATHS.map((p) => `${SITE}/${l}${p}`)),
    source: 'key pages',
  }
}

async function main() {
  const dryRun = hasFlag('dry-run')

  // Postbuild runs on every build, including preview deploys and local ones.
  // Only a real production deploy has new content worth telling Bing about,
  // and submitting a preview URL would be actively wrong. A dry run submits
  // nothing, so it is exempt — that is how you inspect a deploy's payload
  // from a laptop.
  if (hasFlag('on-deploy') && !dryRun && process.env.VERCEL_ENV !== 'production') {
    console.log(`IndexNow: skipped (VERCEL_ENV=${process.env.VERCEL_ENV || 'unset'}, not a production deploy).`)
    return
  }

  let { urls, source } = await collectUrls()

  // IndexNow accepts at most 10,000 URLs per request.
  const deduped = [...new Set(urls)]
  urls = deduped.slice(0, 10000)
  if (deduped.length > urls.length) {
    console.warn(`IndexNow: ${deduped.length} URLs exceeds the 10,000 per-request limit; submitting the first 10,000.`)
  }

  if (!urls.length) {
    console.log('IndexNow: nothing to submit.')
    return
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  }

  if (dryRun) {
    console.log(`IndexNow DRY RUN — ${urls.length} URLs from ${source}, nothing submitted.`)
    console.log(`  endpoint:    POST https://api.indexnow.org/IndexNow`)
    console.log(`  host:        ${payload.host}`)
    console.log(`  keyLocation: ${payload.keyLocation}`)
    for (const url of urls) console.log(`  - ${url}`)
    return
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow (${source})…`)

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })

  // 200 = accepted, 202 = accepted but key still being validated. Both fine.
  if (res.status === 200 || res.status === 202) {
    console.log(`OK (${res.status}) — ${urls.length} URLs submitted.`)
    return
  }
  throw new Error(`IndexNow returned ${res.status}: ${await res.text()}`)
}

/**
 * Telling a search engine about new URLs is not a build step, and it must never
 * be able to stop a release.
 *
 * It already did once. Hanging this on postbuild without this guard took a
 * production deploy down: IndexNow answered 403 (the key was still being
 * validated after its first ever submission), the script exited non-zero, and
 * Vercel failed the whole build over a ping. The site was fine — the
 * notification was not — and the deploy died anyway.
 *
 * So on --on-deploy every outcome is a warning and the exit code stays 0. A
 * missed ping costs a day of crawl latency. A failed deploy costs the site.
 * Run without the flag when you want a real exit code, e.g. from a terminal.
 */
main().catch((e) => {
  const onDeploy = process.argv.includes('--on-deploy')
  console[onDeploy ? 'warn' : 'error'](`IndexNow: ${e.message}`)
  if (onDeploy) {
    console.warn('IndexNow: continuing — a search-engine ping never fails a deploy.')
    return
  }
  process.exitCode = 1
})
