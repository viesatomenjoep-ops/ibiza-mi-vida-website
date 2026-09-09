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
import { reconcileEventDates } from '@/lib/clubtickets-live'
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
  const snapshotDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug);
  if (snapshotDates.length === 0) notFound();

  // Live-stand bij ClubTickets. Zie clubtickets-live.ts: faalt of vertraagt dit,
  // dan valt alles terug op de opgeslagen datums en rendert de pagina precies
  // zoals hij dat zonder deze call ook deed. `eventDates` bevat vanaf hier alleen
  // de avonden die ClubTickets nú nog in de agenda heeft.
  const requestedDate = dateParam(searchParams)
  const { dates: eventDates, selected } = await reconcileEventDates(snapshotDates, requestedDate, params.locale)
  // Alleen een afwijking is het melden waard: 'available' en 'unknown' zeggen de
  // bezoeker niets nieuws.
  const banner = selected.status === 'available' || selected.status === 'unknown' ? undefined : selected
  // Gecachet per zes uur en gedeeld met de layout: dit kost geen tweede aanroep.
  const reviews = await getGoogleReviews()

  return (
    <EventDetailPage 
      eventDates={eventDates as any} 
      eventSlug={params.eventSlug}
      club={venue as any} 
      locale={params.locale} 
      basePath="shuttle-ferry"
      selectedDate={requestedDate}
      live={banner}
      rating={reviews ? { rating: reviews.rating, total: reviews.total, url: reviews.url } : null}
    />
  )
}