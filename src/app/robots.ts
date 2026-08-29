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
