import { MetadataRoute } from 'next'
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from '@/lib/seo'
import { getVenues, getAllEvents, getArtists, getDataLastUpdated } from '@/lib/clubtickets'
import { eventBasePath } from '@/lib/event-path'
import { publishableMonths } from '@/lib/month-pages'
import { locations } from '@/lib/locations'

export const revalidate = 86400 // rebuild the sitemap at most once a day

// Locale-agnostic paths → crawl priority + change frequency.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/calendar', priority: 0.9, changeFrequency: 'daily' },
  { path: '/clubs', priority: 0.8, changeFrequency: 'weekly' },
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
  // Recomputed from the live agenda on every revalidation, so 'daily' is
  // honest rather than optimistic.
  { path: '/ibiza-prices', priority: 0.8, changeFrequency: 'daily' },
  { path: '/beach-clubs', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/boats', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tours', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/legal', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/locations', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about-us', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms-&-conditions', priority: 0.2, changeFrequency: 'yearly' },
]

// Next's sitemap XML serializer doesn't escape `&` in <loc>/hreflang URLs, so a
// raw ampersand (e.g. the /terms-&-conditions route) produces invalid XML.
// The sitemap protocol requires it as &amp; — escape it ourselves.
const xmlSafeUrl = (url: string) => url.replace(/&/g, '&amp;')

// Stamped once per sitemap generation (this route revalidates daily) rather
// than per URL. `lastModified: new Date()` evaluated per entry claimed every
// page on the site changed at this exact instant, which is not true and which
// Google eventually discounts. Event-driven pages pass their own real date.
const GENERATED_AT = new Date()

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
    lastModified: lastModified ?? GENERATED_AT,
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
    const [venues, events, artists, dataDate] = await Promise.all([
      getVenues(DEFAULT_LOCALE),
      getAllEvents(DEFAULT_LOCALE),
      getArtists(DEFAULT_LOCALE),
      getDataLastUpdated(DEFAULT_LOCALE),
    ])

    // Route every venue/event through eventBasePath(): only 'clubbing' lives
    // under /club-tickets. Boats, ferries and activities have their own
    // sections, and each of those pages notFound()s for the wrong venue type —
    // so hardcoding /club-tickets here both omitted 27 of 42 venues from the
    // sitemap and would have submitted guaranteed 404s for the rest.
    const typeBySlug = new Map<string, string>()
    for (const v of venues) {
      if (!v.slug) continue
      const base = eventBasePath((v as any).type?.slug)
      typeBySlug.set(v.slug, base)
      routes.push(...entriesFor(`/${base}/${v.slug}`, 0.7, 'weekly', dataDate))
    }
    for (const e of events) {
      const venueSlug = (e as any).venueSlug || e.venue?.slug
      if (!venueSlug || !e.slug) continue
      const base = typeBySlug.get(venueSlug) || eventBasePath((e as any).venue?.type?.slug)
      routes.push(...entriesFor(`/${base}/${venueSlug}/${e.slug}`, 0.6, 'daily', dataDate))
    }
    // "Ibiza in <month>" pages exist only for months with a real programme,
    // so ask the same helper the route uses rather than listing all twelve.
    for (const loc of locations) {
      if (loc.slug) routes.push(...entriesFor(`/locations/${loc.slug}`, 0.5, 'monthly'))
    }
    for (const m of await publishableMonths(DEFAULT_LOCALE)) {
      routes.push(...entriesFor(`/ibiza-in/${m}`, 0.7, 'daily', dataDate))
    }
    for (const a of artists) {
      if (a.slug) routes.push(...entriesFor(`/artists/${a.slug}`, 0.5, 'weekly', dataDate))
    }
  } catch {
    // If data loading fails, still return the static routes above.
  }

  return routes
}
