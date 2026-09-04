import type { Metadata } from 'next'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { slug: string; eventSlug: string; locale: string } }): Promise<Metadata> {
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'activities')
  const dates = venue ? await getAllDates(params.locale) : []
  const ev = dates.find(d => d.venueSlug === params.slug && d.eventSlug === params.eventSlug)
  if (!ev || !venue) return staticMetadata(params.locale, 'tours')
  return detailMetadata(params.locale, `tours/${params.slug}/${params.eventSlug}`, ev.eventName || ev.name || venue.name, {
    description: (venue as any).cleanDescription || venue.description,
    image: ev.eventCover || ev.eventLogo || venue.cover || venue.picture,
    suffix: `— ${venue.name}`,
  })
}

import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { getLiveEvent } from '@/lib/clubtickets-live'
import { mergeEventDates } from '@/lib/merge-event-dates'
import { ibizaToday } from '@/lib/date-label'
import { EventDetailPage } from '@/components/templates/EventDetailPage'

export const revalidate = 900

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
}

export default async function EventPage({ params }: Props) {
  const venues = await getVenues(params.locale);
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'activities');
  if (!venue) notFound();

  const allDates = await getAllDates(params.locale);
  const eventDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug);
  if (eventDates.length === 0) notFound();

  // Live overlay — see the club-tickets route. null on any failure → the merge
  // passes the JSON rows through untouched.
  const eventId = eventDates[0]?.eventId ?? 0;
  const live = await getLiveEvent(venue.id, eventId, params.locale);
  const dates = mergeEventDates(eventDates, live, ibizaToday());

  return (
    <EventDetailPage
      eventDates={dates}
      liveTimes={live ? { startAt: live.startAt, endAt: live.endAt } : undefined}
      eventSoldOut={live?.soldOut ?? false}
      eventSlug={params.eventSlug}
      club={venue as any}
      locale={params.locale}
      basePath="tours"
    />
  )
}