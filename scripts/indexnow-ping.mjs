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
 *   node scripts/indexnow-ping.mjs                 # key pages
 *   node scripts/indexnow-ping.mjs --sitemap       # everything in the sitemap
 *   node scripts/indexnow-ping.mjs --on-deploy     # no-op unless this is a
 *                                                  # Vercel production build
 *
 * Run it after `npm run sync-clubtickets`, when the event data has actually
 * changed. Pinging unchanged URLs is pointless and gets a host throttled.
 *
 * `--on-deploy` is wired into postbuild. Before that, this file was a manual
 * command that nothing ever called: the lever described above existed but was
 * never pulled, so Bing's copy of a calendar that changes every day went stale
 * between whenever somebody last remembered to run it. The flag exists so the
 * same script can sit in postbuild without every local `npm run build` firing
 * a submission at Bing.
 */

const KEY = '006dbc51fcf510e41156e205c664581ba84684c08531c50da12497b933a913ae'
const HOST = 'www.ibizamivida.com'
const SITE = `https://${HOST}`
const LOCALES = ['nl', 'en', 'de', 'es', 'fr']

/** The pages worth pushing on a routine sync. */
const KEY_PATHS = ['', '/calendar', '/clubs', '/artists', '/boats', '/boat-party', '/ferry-formentera', '/private-boat-charters', '/guestlist']

async function fromSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'))
}

async function main() {
  // Postbuild runs on every build, including preview deploys and local ones.
  // Only a real production deploy has new content worth telling Bing about,
  // and submitting a preview URL would be actively wrong.
  if (process.argv.includes('--on-deploy') && process.env.VERCEL_ENV !== 'production') {
    console.log(`IndexNow: skipped (VERCEL_ENV=${process.env.VERCEL_ENV || 'unset'}, not a production deploy).`)
    return
  }

  const useSitemap = process.argv.includes('--sitemap')
  let urls = useSitemap
    ? await fromSitemap()
    : LOCALES.flatMap((l) => KEY_PATHS.map((p) => `${SITE}/${l}${p}`))

  // IndexNow accepts at most 10,000 URLs per request.
  urls = [...new Set(urls)].slice(0, 10000)
  console.log(`Submitting ${urls.length} URLs to IndexNow…`)

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  })

  // 200 = accepted, 202 = accepted but key still being validated. Both fine.
  if (res.status === 200 || res.status === 202) {
    console.log(`OK (${res.status}) — ${urls.length} URLs submitted.`)
    return
  }
  console.error(`IndexNow returned ${res.status}: ${await res.text()}`)
  process.exitCode = 1
}

main().catch((e) => {
  console.error(e.message)
  process.exitCode = 1
})
