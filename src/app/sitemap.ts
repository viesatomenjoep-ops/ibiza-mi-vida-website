import { MetadataRoute } from 'next'
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from '@/lib/seo'
import { getVenues, getAllEvents, getArtists } from '@/lib/clubtickets'

export const revalidate = 86400 // rebuild the sitemap at most once a day

// Locale-agnostic paths → crawl priority + change frequency.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/calendar', priority: 0.9, changeFrequency: 'daily' },
  { path: '/club-tickets', priority: 0.9, changeFrequency: 'daily' },
  { path: '/clubs', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/deals-of-the-day', priority: 0.8, changeFrequency: 'daily' },
  { path: '/artists', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/private-boat-charters', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/boat-party', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/boat-trip', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/water-sports', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/activities', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/ferry-formentera', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/shuttle-ferry', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/car-scooter-rental', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/drink-packages', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/guestlist', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/tips', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/reviews', priority: 0.4, changeFrequency: 'weekly' },
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms-&-conditions', priority: 0.2, changeFrequency: 'yearly' },
]

// Next's sitemap XML serializer doesn't escape `&` in <loc>/hreflang URLs, so a
// raw ampersand (e.g. the /terms-&-conditions route) produces invalid XML.
// The sitemap protocol requires it as &amp; — escape it ourselves.
const xmlSafeUrl = (url: string) => url.replace(/&/g, '&amp;')

// One <url> per locale, each carrying the full hreflang alternate set.
function entriesFor(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  lastModified?: Date,
): MetadataRoute.Sitemap {
  const clean = path ? `/${path.replace(/^\//, '')}` : ''
  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[l] = xmlSafeUrl(`${SITE_URL}/${l}${clean}`)
  languages['x-default'] = xmlSafeUrl(`${SITE_URL}/${DEFAULT_LOCALE}${clean}`)
  return LOCALES.map((l) => ({
    url: xmlSafeUrl(`${SITE_URL}/${l}${clean}`),
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  for (const r of STATIC_ROUTES) {
    routes.push(...entriesFor(r.path, r.priority, r.changeFrequency))
  }

  // Dynamic routes — slugs are locale-agnostic, so fetch the lists once.
  try {
    const [venues, events, artists] = await Promise.all([
      getVenues(DEFAULT_LOCALE),
      getAllEvents(DEFAULT_LOCALE),
      getArtists(DEFAULT_LOCALE),
    ])

    for (const v of venues) {
      if (v.slug) routes.push(...entriesFor(`/club-tickets/${v.slug}`, 0.7, 'weekly'))
    }
    for (const e of events) {
      const venueSlug = (e as any).venueSlug || e.venue?.slug
      if (venueSlug && e.slug) routes.push(...entriesFor(`/club-tickets/${venueSlug}/${e.slug}`, 0.6, 'daily'))
    }
    for (const a of artists) {
      if (a.slug) routes.push(...entriesFor(`/artists/${a.slug}`, 0.5, 'weekly'))
    }
  } catch {
    // If data loading fails, still return the static routes above.
  }

  return routes
}
