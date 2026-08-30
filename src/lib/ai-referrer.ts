/**
 * Recognise visits that came out of an AI assistant.
 *
 * ── Why this is worth wiring up ───────────────────────────────────────────
 * A lot of work on this site is aimed at being citable by ChatGPT, Claude,
 * Gemini and Perplexity, and none of it was measurable: those referrals landed
 * in the same undifferentiated "direct-ish" bucket as everything else, so
 * there was no way to tell whether any of it produced a booking. The ClubTickets
 * dashboard already has Source / Medium / Campaign columns and already receives
 * our tags (see ct-link.ts), so the cheapest honest answer is to put the right
 * value in `utm_source` and read the answer off a report that already exists —
 * rather than bolting on an analytics product to count pageviews nobody acts on.
 *
 * Sales, not sessions. A pageview counter would say "40 people came from
 * ChatGPT". This says which of them bought a ticket, which is the only version
 * of the question worth asking.
 *
 * ── Matching rules ────────────────────────────────────────────────────────
 * Suffix matching on the hostname, never `includes()`. A substring test would
 * match `chatgpt.com.phishing.example`, and an attacker-chosen referrer would
 * then be written into our own reporting.
 *
 * Values are short, lowercase and stable: they become the `utm_source` column,
 * so renaming one splits its history in two.
 */

export type AiSource =
  | 'chatgpt'
  | 'claude'
  | 'perplexity'
  | 'gemini'
  | 'copilot'
  | 'brave-ai'
  | 'you'
  | 'poe'

/** Hostname suffix → source id. Order does not matter; matches are exact-suffix. */
const HOSTS: [string, AiSource][] = [
  ['chatgpt.com', 'chatgpt'],
  ['chat.openai.com', 'chatgpt'],
  ['openai.com', 'chatgpt'],
  ['claude.ai', 'claude'],
  ['perplexity.ai', 'perplexity'],
  ['gemini.google.com', 'gemini'],
  ['bard.google.com', 'gemini'],
  ['copilot.microsoft.com', 'copilot'],
  ['you.com', 'you'],
  ['poe.com', 'poe'],
  // Brave Search is what Claude's web search reads, and Brave's own answer
  // panel cites sources too — so a referral from here is an AI referral even
  // though the host looks like an ordinary search engine.
  ['search.brave.com', 'brave-ai'],
]

/** True when `host` is exactly `suffix` or a subdomain of it. */
function hostMatches(host: string, suffix: string): boolean {
  return host === suffix || host.endsWith(`.${suffix}`)
}

/**
 * Classify a referrer URL. Returns null for anything that is not a known
 * assistant — including malformed input, which must never throw here: this
 * runs on every first pageview and an exception would take attribution with it.
 */
export function aiSourceFromReferrer(referrer: string | null | undefined): AiSource | null {
  if (!referrer) return null
  let host: string
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
  for (const [suffix, source] of HOSTS) {
    if (hostMatches(host, suffix)) return source
  }
  return null
}

/** Every source id, for tests and for documenting the reporting values. */
export const AI_SOURCES: AiSource[] = Array.from(new Set(HOSTS.map(([, s]) => s)))
