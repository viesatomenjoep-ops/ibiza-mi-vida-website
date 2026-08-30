import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Assistant/answer-engine crawlers we explicitly welcome. `User-Agent: *`
// already allows them, but naming them is deliberate: it documents the intent
// (we WANT to be citable in ChatGPT, Claude, Gemini, Perplexity and Copilot
// answers) and stops a future blanket disallow from silently cutting off AI
// referral traffic. Google-Extended is the one that genuinely matters as a
// separate token — it governs Gemini/Vertex grounding independently of
// Googlebot, so leaving it unlisted is only an implicit yes.
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

// Keep private/technical areas out of the index.
const DISALLOW = ['/api/', '/admin', '/*/admin', '/*/planner/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
