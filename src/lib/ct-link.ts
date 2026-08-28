// ClubTickets outbound links — force the language segment to the site locale.
// The per-locale JSON feeds carry localized affLinks, but some sources
// (Supabase rows, older data) hold English URLs; without this a Spanish
// visitor lands on the English ClubTickets checkout.
//
// URL format, confirmed against ClubTickets' own affiliate feeds: ENGLISH IS
// UNPREFIXED (https://www.clubtickets.com/clubbing/...), only nl/es/de/fr get
// a language segment. Fabricating /en/... produces a hard 404 on their side —
// that exact bug shipped once and broke every ticket link in the /m app
// (which defaults to English). Never add a prefix for 'en'.
const CT_LOCALES = new Set(['en', 'nl', 'de', 'es', 'fr'])

export function ctLink(url: string | undefined | null, locale: string): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (!u.hostname.includes('clubtickets.com')) return url
    const lang = CT_LOCALES.has(locale) ? locale : 'en'
    const parts = u.pathname.split('/').filter(Boolean)
    if (parts.length && CT_LOCALES.has(parts[0])) parts.shift()
    if (lang !== 'en') parts.unshift(lang)
    u.pathname = '/' + parts.join('/')
    return u.toString()
  } catch {
    return url
  }
}
