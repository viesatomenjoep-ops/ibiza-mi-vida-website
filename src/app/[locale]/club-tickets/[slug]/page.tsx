import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { VenueDetailPage } from '@/components/templates/VenueDetailPage'
import { venueMetaDescription, VENUE_TITLE_SUFFIX } from '@/lib/venue-meta'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

interface Props {
  params: { slug: string; locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type?.slug === 'clubbing')
  if (!venue) return staticMetadata(params.locale, 'club-tickets')

  const l = (LOCALES as readonly string[]).includes(params.locale)
    ? (params.locale as Locale)
    : DEFAULT_LOCALE

  // Search Console showed these pages ranking but never being clicked — 102
  // Ushuaïa queries, zero clicks — because the snippet was the venue's own
  // scraped blurb, cut mid-word. Lead with what the searcher asked for instead:
  // how many nights are on and when the next one is.
  const allDates = await getAllDates(params.locale)
  const todayStr = new Date().toISOString().split('T')[0]
  const upcoming = allDates.filter(d => d.venueSlug === venue.slug && (d.date || '') >= todayStr)
  const composed = venueMetaDescription(venue.name, upcoming, l)

  return detailMetadata(params.locale, `club-tickets/${params.slug}`, venue.name, {
    description: composed || (venue as any).cleanDescription || venue.description,
    image: venue.cover || venue.picture,
    suffix: VENUE_TITLE_SUFFIX[l],
  })
}

export default async function ClubDetailPage({ params }: Props) {
  // Same data source as every other category (activities/boat-trip/tours/...):
  // the fast, always-available local JSON feed — NOT Supabase, which crashed
  // this route whenever its production credentials weren't configured.
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type?.slug === 'clubbing')
  if (!venue) notFound()

  const allDates = await getAllDates(params.locale)
  const todayStr = new Date().toISOString().split('T')[0]
  const venueDates = allDates.filter(d => d.venueSlug === venue.slug && d.date >= todayStr)

  return (
    <VenueDetailPage
      club={venue as any}
      allDates={venueDates as any}
      locale={params.locale}
      basePath="club-tickets"
    />
  )
}
