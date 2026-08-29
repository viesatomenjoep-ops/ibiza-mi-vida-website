// ClubTickets outbound links — force the language segment to the site locale,
// and tag every link so sales become attributable.
//
// URL format, confirmed against ClubTickets' own affiliate feeds: ENGLISH IS
// UNPREFIXED (https://www.clubtickets.com/clubbing/...), only nl/es/de/fr get
// a language segment. Fabricating /en/... produces a hard 404 on their side —
// that exact bug shipped once and broke every ticket link in the /m app
// (which defaults to English). Never add a prefix for 'en'.
const CT_LOCALES = new Set(['en', 'nl', 'de', 'es', 'fr'])

/**
 * Where on our site the click came from. Becomes `utm_medium`, so these strings
 * are what shows up in the ClubTickets sales dashboard — keep them short,
 * stable and lowercase, and do not rename one without accepting that historical
 * reporting for that surface splits in two.
 */
export type CtSurface =
  | 'homepage-tonight'   // the "Tonight on Ibiza" rail
  | 'homepage-featured'  // featured events grid
  | 'homepage-deals'     // deals strip
  | 'calendar'           // /calendar grid
  | 'venue'              // a club/venue page
  | 'event'              // an event detail page
  | 'artist'             // an artist page
  | 'agenda'             // the water/boat agendas
  | 'app'                // the /m mobile app
  | 'site'               // fallback — untagged surface

const UTM_SOURCE = 'ibizamivida.com'

/** Lowercase, strip accents/punctuation — safe as a UTM value. */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/**
 * Last meaningful path segment, skipping trailing dates.
 *
 * ClubTickets event URLs end in a date (`/clubbing/ushuaia-ibiza/ants/2026-08-29`),
 * so naively taking the final segment filled utm_campaign with "2026-08-29" —
 * a Campaign column full of dates, which reports on nothing. Walk back past any
 * date-like or purely numeric segment to reach the actual event slug.
 */
function eventSlugFromPath(parts: string[]): string {
  for (let i = parts.length - 1; i >= 0; i--) {
    const seg = parts[i]
    if (/^\d{4}-\d{2}-\d{2}$/.test(seg) || /^\d+$/.test(seg)) continue
    return seg
  }
  return ''
}

/**
 * Build an outbound ClubTickets URL.
 *
 * Why the UTM tagging exists: the ClubTickets dashboard has Source / Medium /
 * Campaign columns, and every single sale showed them blank — because we never
 * sent anything. That made it impossible to tell whether a spike came from the
 * homepage, the calendar, an artist page or the app, so there was no way to
 * learn what actually works. Tagging is pure URL, no cookies and no consent
 * banner needed.
 *
 * The affiliate id (`?aff=CT219`) already present on the feed URLs is left
 * untouched — that is what credits the sale to us, and it is separate from
 * attribution. Any pre-existing utm_* on the URL also wins, so a campaign link
 * pasted in by hand is never silently overwritten.
 */
export function ctLink(
  url: string | undefined | null,
  locale: string,
  surface: CtSurface = 'site',
  /** Event or venue name/slug — becomes `utm_campaign`. */
  campaign?: string | null,
): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (!u.hostname.includes('clubtickets.com')) return url

    const lang = CT_LOCALES.has(locale) ? locale : 'en'
    const parts = u.pathname.split('/').filter(Boolean)
    if (parts.length && CT_LOCALES.has(parts[0])) parts.shift()
    if (lang !== 'en') parts.unshift(lang)
    u.pathname = '/' + parts.join('/')

    if (!u.searchParams.has('utm_source')) u.searchParams.set('utm_source', UTM_SOURCE)
    if (!u.searchParams.has('utm_medium')) u.searchParams.set('utm_medium', surface)
    if (!u.searchParams.has('utm_campaign')) {
      const value = slugify(campaign || eventSlugFromPath(parts))
      if (value) u.searchParams.set('utm_campaign', value)
    }

    return u.toString()
  } catch {
    return url
  }
}
