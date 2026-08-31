/**
 * Outbound partner URLs.
 *
 * Kept in one file so an affiliate link can be updated (or a tracking
 * parameter corrected) in a single place rather than hunted through page copy.
 * Every one of these is rendered through <AffiliateLink>, which is what
 * guarantees rel="sponsored noopener noreferrer" and a visible disclosure —
 * never link to one of these with a bare <a>.
 *
 * ── Why these are in the repo rather than in env vars ─────────────────────
 * An affiliate deeplink is not a secret. It is published verbatim in the HTML
 * of every page that renders it, which is the entire point of it: the network
 * reads the publisher id out of the URL when a visitor clicks. Treating it as a
 * secret would mean the site could not attribute a single click without an env
 * var set correctly in every environment, and a missing one fails silently —
 * the link still works, the commission just goes nowhere.
 *
 * The env override exists anyway, for swapping a campaign without a deploy.
 */

/**
 * Wiber Rent a Car, via Awin.
 *
 * From the Awin creative for "Wiber ES": s=4715915 (creative), v=124596 and
 * q=598784 (campaign), r=3064911 (our publisher id). The r parameter is the one
 * that credits us — if a link ever loses it, the click is untracked, so copy
 * this constant rather than retyping a URL from a dashboard.
 *
 * Awin's own creative pairs this clickthrough with a cshow.php impression
 * pixel. We deliberately do not render that pixel: it is a tracking image that
 * fires on page load for every visitor, which is a consent question under GDPR
 * (see src/components/consent/) rather than a click. The cread.php link tracks
 * the click correctly on its own, which is what the commission is based on.
 */
export const WIBER_URL =
  process.env.NEXT_PUBLIC_WIBER_AFFILIATE_URL ??
  'https://www.awin1.com/cread.php?s=4715915&v=124596&q=598784&r=3064911'

/** ClubTickets affiliate base. Existing links elsewhere in the app use ct-link.ts. */
export const CLUBTICKETS_URL =
  process.env.NEXT_PUBLIC_CLUBTICKETS_AFFILIATE_URL ?? 'https://www.clubtickets.com/'
