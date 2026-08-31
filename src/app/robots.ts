import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * Crawler access.
 *
 * Two things this file must get right, and both are easy to get wrong:
 *
 * 1. Naming a bot creates a SEPARATE group for it. robots.txt is not additive:
 *    a crawler obeys exactly one group — the most specific one that matches its
 *    token — and ignores every other group including `*`. So every named bot
 *    below carries the full Disallow list of its own. Adding a name here with
 *    an empty group would silently grant that bot access to /api/ and /admin.
 *
 * 2. There is no blanket Disallow on public content, deliberately. The whole
 *    commercial premise of this site is being readable by answer engines; a
 *    broad disallow added "temporarily" is the single change that would undo
 *    it, and nothing in any dashboard would report the loss.
 */

/** Search crawlers we explicitly welcome, each getting its own group. */
const SEARCH_CRAWLERS = [
  'Googlebot',
  'Googlebot-Image',
  'Bingbot',
]

/**
 * Assistant/answer-engine crawlers. Naming them is deliberate: it documents
 * the intent (we WANT to be citable in ChatGPT, Claude, Gemini, Perplexity and
 * Copilot answers) and stops a future blanket disallow from silently cutting
 * off AI referral traffic.
 *
 * Google-Extended is the one that genuinely matters as a separate token — it
 * governs Gemini/Vertex grounding independently of Googlebot, so leaving it
 * unlisted is only an implicit yes. Note it is a training/grounding control,
 * not a crawler: it fetches nothing itself.
 */
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',        // OpenAI / ChatGPT
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',   // Anthropic / Claude
  'Google-Extended',                                // Gemini, Vertex grounding
  'PerplexityBot', 'Perplexity-User',               // Perplexity
  'Applebot-Extended',                              // Apple Intelligence
  'CCBot',                                          // Common Crawl
  'meta-externalagent',                             // Meta AI
]

// NOTE — Brave deliberately has no token on that list, and cannot have one.
// Brave Search runs its own index (it is what Claude's web search reads), but
// its crawler does not advertise a differentiated user agent on purpose: they
// state it would get them blocked by sites that allowlist only Google. So the
// only thing that keeps Brave — and therefore Claude — able to read this site
// is the `User-Agent: *` rule below. If anyone ever narrows that to a
// disallow while trusting the named list above to cover AI crawlers, Brave
// disappears silently and there is no dashboard anywhere that will report it.
// Brave has no webmaster tools; URLs are submitted by hand at
// https://search.brave.com/submit-url.

/**
 * Private/technical areas. Everything here is non-public or duplicate — none
 * of it is content we would ever want ranked.
 *
 * `/preview` and `/draft` cover in-app preview routes. They do NOT cover
 * Vercel preview DEPLOYMENTS: those are served from *.vercel.app, a different
 * host, whose robots.txt is this same file. A preview deployment is kept out
 * of the index by an `X-Robots-Tag: noindex` header set in middleware for any
 * host that is not the canonical one — see src/middleware.ts. robots.txt
 * cannot do that job, because a Disallow only stops crawling, not indexing of
 * a URL discovered elsewhere.
 */
const DISALLOW = [
  '/api/',
  '/admin',
  '/*/admin',
  '/*/planner/',
  '/preview',
  '/*/preview',
  '/draft',
  '/*/draft',
]

export default function robots(): MetadataRoute.Robots {
  // One group per named crawler, each with the identical Allow + Disallow set.
  const named = [...SEARCH_CRAWLERS, ...AI_CRAWLERS].map((userAgent) => ({
    userAgent,
    allow: '/',
    disallow: DISALLOW,
  }))

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...named,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
