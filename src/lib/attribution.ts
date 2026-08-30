/**
 * First-touch attribution for on-site leads.
 *
 * Why this exists: the booking form stored `utm_source: null` hardcoded, so
 * every lead that came through our own form was anonymous — we could see that
 * someone enquired, never how they found us. Outbound ticket links already
 * carry UTM tags (see lib/ct-link.ts); this is the same idea for leads that
 * stay on our side.
 *
 * FIRST touch, not last: the campaign that first brought someone to the site is
 * the one that earned the lead. A visitor typically lands on an ad, browses a
 * few pages, then fills the form a page or two later with a clean URL — reading
 * the UTMs at submit time would attribute almost everything to "direct" and
 * quietly overstate it.
 *
 * Stored in sessionStorage, not a cookie: it never leaves the browser except on
 * the lead the user deliberately submits, it dies with the tab, and it is not
 * used for tracking across sites — so it does not require a consent banner
 * under the ePrivacy rules that cover cookies and similar storage.
 */

const KEY = 'imv_attr'

export interface Attribution {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  /** Referring host on the first page of the session, if any. */
  referrer: string | null
  /** Path the visitor first landed on. */
  landing: string | null
}

const EMPTY: Attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  referrer: null,
  landing: null,
}

/** Cap stored values — these end up in a database column, not a log line. */
const clean = (v: string | null): string | null =>
  v ? v.replace(/[^\w .\-/:]/g, '').slice(0, 120) || null : null

/**
 * Record attribution once per session. Safe to call on every page — it only
 * writes the first time, which is what makes it first-touch.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    if (sessionStorage.getItem(KEY)) return

    const p = new URLSearchParams(window.location.search)
    let ref: string | null = null
    if (document.referrer) {
      try {
        const host = new URL(document.referrer).hostname
        // Our own pages are not a referrer worth recording.
        if (host && host !== window.location.hostname) ref = host
      } catch {
        /* malformed referrer — ignore */
      }
    }

    const attr: Attribution = {
      utm_source: clean(p.get('utm_source')),
      utm_medium: clean(p.get('utm_medium')),
      utm_campaign: clean(p.get('utm_campaign')),
      referrer: clean(ref),
      landing: clean(window.location.pathname),
    }

    // Nothing to remember for a bare direct visit with no referrer.
    if (!attr.utm_source && !attr.utm_medium && !attr.utm_campaign && !attr.referrer) {
      sessionStorage.setItem(KEY, JSON.stringify({ ...EMPTY, landing: attr.landing }))
      return
    }
    sessionStorage.setItem(KEY, JSON.stringify(attr))
  } catch {
    // Private mode / storage disabled — attribution is a nice-to-have, never
    // let it break a booking.
  }
}

/** Read what was captured. Returns empty values rather than throwing. */
export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return EMPTY
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Attribution>) }
  } catch {
    return EMPTY
  }
}
