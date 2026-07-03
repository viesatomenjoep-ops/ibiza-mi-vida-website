import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibizamivida.nl'
const LOCALES = ['nl', 'en', 'de', 'es']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  // Add static routes
  const staticPaths = [
    '',
    '/calendar',
    '/club-tickets',
    '/boat-parties',
    '/deals-of-the-day'
  ]

  staticPaths.forEach((path) => {
    LOCALES.forEach((locale) => {
      routes.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: path === '' ? 1 : 0.8,
      })
    })
  })

  // Fetch all venues
  const { data: venues } = await supabase.from('ct_venues').select('slug')
  if (venues) {
    venues.forEach((venue) => {
      LOCALES.forEach((locale) => {
        routes.push({
          url: `${SITE_URL}/${locale}/club-tickets/${venue.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        })
      })
    })
  }

  // Fetch all events
  const { data: events } = await supabase.from('ct_events').select('slug, ct_venues(slug)')
  if (events) {
    events.forEach((event: any) => {
      if (!event.ct_venues?.slug) return
      LOCALES.forEach((locale) => {
        routes.push({
          url: `${SITE_URL}/${locale}/club-tickets/${event.ct_venues.slug}/${event.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        })
      })
    })
  }

  // Fetch all artists
  const { data: artists } = await supabase.from('ct_artists').select('slug')
  if (artists) {
    artists.forEach((artist) => {
      LOCALES.forEach((locale) => {
        routes.push({
          url: `${SITE_URL}/${locale}/artists/${artist.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    })
  }

  return routes
}
