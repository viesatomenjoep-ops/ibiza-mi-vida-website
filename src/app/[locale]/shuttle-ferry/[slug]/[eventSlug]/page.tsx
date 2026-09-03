import type { Metadata } from 'next'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { slug: string; eventSlug: string; locale: string } }): Promise<Metadata> {
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'formentera-day-trip')
  const dates = venue ? await getAllDates(params.locale) : []
  const ev = dates.find(d => d.venueSlug === params.slug && d.eventSlug === params.eventSlug)
  if (!ev || !venue) return staticMetadata(params.locale, 'shuttle-ferry')
  return detailMetadata(params.locale, `shuttle-ferry/${params.slug}/${params.eventSlug}`, ev.eventName || ev.name || venue.name, {
    description: (venue as any).cleanDescription || venue.description,
    image: ev.eventCover || ev.eventLogo || venue.cover || venue.picture,
    suffix: `— ${venue.name}`,
  })
}

import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { EventDetailPage } from '@/components/templates/EventDetailPage'
import { dateParam } from '@/lib/event-date-param'
import { liveVoorEvent } from '@/lib/clubtickets-live'
import { getGoogleReviews } from '@/lib/google-reviews'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
  searchParams?: { date?: string | string[] }
}

export default async function EventPage({ params, searchParams }: Props) {
  const venues = await getVenues(params.locale);
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'formentera-day-trip');
  if (!venue) notFound();

  const allDates = await getAllDates(params.locale);
  const eventDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug);
  if (eventDates.length === 0) notFound();

  // Actuele stand bij ClubTickets voor deze avond. Zie clubtickets-live.ts:
  // faalt of vertraagt dit, dan komt er undefined uit en rendert de pagina
  // precies zoals hij dat zonder deze call ook deed.
  const gekozenDatum = dateParam(searchParams)
  const live = await liveVoorEvent(eventDates as any, gekozenDatum, params.locale)
  // Gecachet per zes uur en gedeeld met de layout: dit kost geen tweede aanroep.
  const reviews = await getGoogleReviews()

  return (
    <EventDetailPage 
      eventDates={eventDates as any} 
      eventSlug={params.eventSlug}
      club={venue as any} 
      locale={params.locale} 
      basePath="shuttle-ferry"
      selectedDate={gekozenDatum}
      live={live}
      rating={reviews ? { rating: reviews.rating, total: reviews.total, url: reviews.url } : null}
    />
  )
}