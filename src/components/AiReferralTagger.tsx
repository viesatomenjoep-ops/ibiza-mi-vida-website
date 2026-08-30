'use client'

import { useEffect } from 'react'
import { getAiSource } from '@/lib/attribution'

/**
 * Stamps the assistant a visitor arrived from onto outbound ticket links.
 *
 * ── What this buys ────────────────────────────────────────────────────────
 * A lot of this site is built to be citable by ChatGPT, Claude, Gemini and
 * Perplexity, and until now none of that was measurable. The ClubTickets
 * affiliate dashboard already reports Source / Medium / Campaign per sale and
 * already receives our tags, so redirecting one field turns an existing report
 * into an answer: not "how many people visited from ChatGPT" but "how many of
 * them bought a ticket". Sessions are cheap; sales are the question.
 *
 * ── Why a delegated click handler and not the href ────────────────────────
 * The source lives in sessionStorage, which the server cannot read. Writing it
 * into an href during render would make server and client markup disagree and
 * trip a hydration mismatch on every ticket link on the page. Rewriting on the
 * way out avoids that entirely, and one listener on the document costs nothing
 * regardless of how many links a page holds or how many appear later — which
 * matters here, because the agendas mount links continuously as you scroll.
 *
 * Capture phase, so the URL is already correct by the time any other handler
 * or the browser's own navigation sees it.
 *
 * ── What it does not do ───────────────────────────────────────────────────
 * It only ever replaces our own default `utm_source` (`ibizamivida.com`).
 * A link that already carries a hand-set campaign source keeps it: a manually
 * tagged link is a deliberate act and silently overwriting it would corrupt
 * exactly the reporting someone set up on purpose.
 *
 * No cookies and no network call. The value comes from the same first-touch
 * sessionStorage record described in lib/attribution.ts, it dies with the tab,
 * and it is not used to follow anyone between sites.
 */
const DEFAULT_SOURCE = 'ibizamivida.com'

export function AiReferralTagger() {
  useEffect(() => {
    const source = getAiSource()
    if (!source) return

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!link) return

      try {
        const url = new URL(link.href)
        if (!url.hostname.endsWith('clubtickets.com')) return
        // Untagged or default-tagged links only — never a hand-set source.
        const current = url.searchParams.get('utm_source')
        if (current && current !== DEFAULT_SOURCE) return

        url.searchParams.set('utm_source', source)
        link.href = url.toString()
      } catch {
        // Malformed href — leave the link exactly as it was. Attribution is
        // never worth breaking a click that would otherwise sell a ticket.
      }
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
