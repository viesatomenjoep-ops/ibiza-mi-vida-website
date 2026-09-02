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
 * From the Awin creative for "Wiber ES": s=4715895 (creative), v=124596 and
 * q=598784 (campaign), r=3064911 (our publisher id). The r parameter is the one
 * that credits us — if a link ever loses it, the click is untracked, so copy
 * this constant rather than retyping a URL from a dashboard.
 *
 * s stood at 4715915 here: one digit off from the creative, transcribed by hand
 * instead of pasted. Awin resolves an unknown creative id against the campaign
 * rather than erroring, so nothing looked broken — the link opened Wiber and the
 * page rendered — while the clicks were filed under a creative that is not ours.
 * That is exactly the failure mode this constant exists to prevent: paste the
 * URL from the creative, never retype it.
 *
 * Awin's own creative pairs this clickthrough with a cshow.php impression
 * pixel. We deliberately do not render that pixel: it is a tracking image that
 * fires on page load for every visitor, which is a consent question under GDPR
 * (see src/components/consent/) rather than a click. The cread.php link tracks
 * the click correctly on its own, which is what the commission is based on.
 */
export const WIBER_URL =
  process.env.NEXT_PUBLIC_WIBER_AFFILIATE_URL ??
  'https://www.awin1.com/cread.php?s=4715895&v=124596&q=598784&r=3064911'

/**
 * Click&Boat, via Impact (pxf.io).
 *
 * From the Click&Boat creative: 7702481 is our Impact account id, 3995680 the
 * ad, 19914 the campaign. The account id matches the Impact universal tracking
 * tag already loaded in src/components/consent/ConsentScripts.tsx
 * (P-A7702481-…), so clicks and the site-wide tag report into the same place.
 *
 * Two parts of Impact's creative are deliberately NOT used:
 *
 *  • the `imp.pxf.io/i/…` impression pixel — a 0×0 tracking image that fires on
 *    page load for every visitor. That is a consent question under GDPR, not a
 *    click, and the UTT above is already consent-gated; adding an ungated pixel
 *    beside it would undo that work. The click link tracks the commission on
 *    its own, which is what we are paid on.
 *
 *  • the `a.impactradius-go.com` iframe ad unit — it renders Impact's banner
 *    instead of our own CTA, in a third-party frame we cannot style, that
 *    shifts layout and is invisible to a crawler that runs no JavaScript. On a
 *    site built to be readable without JS, an iframe ad is the one shape of CTA
 *    that cannot work.
 */
export const CLICKANDBOAT_URL =
  process.env.NEXT_PUBLIC_CLICKANDBOAT_AFFILIATE_URL ??
  'https://click-and-boat.pxf.io/X4v2Rb'

/**
 * De korte vorm hierboven is de vanity-link die Impact zelf uitgeeft, en die is
 * aangeleverd als de juiste. Hij lost aan Impact's kant op naar dezelfde
 * account- en campagne-ids als de lange `/c/7702481/3995680/19914` die hier
 * eerst stond, maar wélke creative eraan hangt bepaalt Impact — niet wij. Dat
 * is precies waarom hij hier staat en niet in de paginatekst: verandert de
 * campagne, dan is dit één regel.
 */

/**
 * ClubTickets does NOT live here.
 *
 * Its links need the locale rules (English is unprefixed; inventing /en/
 * produces a hard 404 on their side), the UTM tagging, and the `aff=CT219`
 * affiliate id — none of which a bare constant can carry. All of that lives in
 * src/lib/ct-link.ts: use `ctLink()` for a URL that came out of the feed
 * already carrying its own `aff`, and `ctBrowseLink()` for one we build
 * ourselves. A hand-written clubtickets.com URL looks identical, works
 * identically, and earns nothing.
 */

/**
 * Partner logo assets.
 *
 * ── Why these are null and not drawn ──────────────────────────────────────
 * A logo is a trademark. Recreating one by hand — tracing it, approximating the
 * wordmark in a similar typeface, generating something close — produces a fake
 * that is wrong in ways the owner will notice, and using a mark you built
 * yourself is a trademark problem rather than a design shortcut. So nothing
 * here is invented.
 *
 * Both networks supply the official files to publishers precisely for this, and
 * using them is covered by the affiliate agreement already in place:
 *
 *   • Wiber      — Awin dashboard → the Wiber ES advertiser → Creatives /
 *                  Brand assets. Take the logo, not a banner.
 *   • Click&Boat — Impact dashboard → Click&Boat → Ads / Assets, or their
 *                  press-and-brand page.
 *
 * ── How to switch one on ──────────────────────────────────────────────────
 * Drop the file in `public/partners/`, then fill in the entry below. That is
 * the whole change: every surface that shows a partner picks it up at once,
 * and until then each one renders the styled wordmark it renders today.
 *
 * `dark` is the version for our dark cards (obsidian ground), so it wants the
 * white or reversed-out variant. `light` is for white sections. Give the real
 * intrinsic width and height — Next's <Image> needs them to reserve space, and
 * a wrong ratio squashes somebody's brand.
 */
export interface PartnerLogo {
  /** Path under /public, e.g. '/partners/wiber-white.svg'. */
  dark: string | null
  light: string | null
  width: number
  height: number
}

export const PARTNER_LOGOS: Record<'wiber' | 'clickandboat', PartnerLogo> = {
  wiber: {
    // `light` alleen is genoeg: <PartnerLogo> zet er op donkere kaarten een
    // witte chip omheen, dus een gewoon logo op wit werkt overal.
    dark: null,
    light: '/partners/wiber.png',
    width: 2000,
    height: 1000,
  },
  clickandboat: {
    // TODO: add from the Impact asset library — see the note above.
    dark: null,
    light: null,
    width: 160,
    height: 40,
  },
}
