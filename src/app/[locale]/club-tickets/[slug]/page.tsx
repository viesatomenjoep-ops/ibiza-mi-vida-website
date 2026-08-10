import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { VenueDetailPage } from '@/components/templates/VenueDetailPage'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'

export const revalidate = 3600

interface Props {
  params: { slug: string; locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type?.slug === 'clubbing')
  if (!venue) return staticMetadata(params.locale, 'club-tickets')
  return detailMetadata(params.locale, `club-tickets/${params.slug}`, venue.name, {
    description: (venue as any).cleanDescription || venue.description,
    image: venue.cover || venue.picture,
    suffix: 'Tickets 2026',
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
