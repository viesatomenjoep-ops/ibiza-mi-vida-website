import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { getLiveEvent } from '@/lib/clubtickets-live'
import { mergeEventDates } from '@/lib/merge-event-dates'
import { ibizaToday } from '@/lib/date-label'
import { EventDetailPage } from '@/components/templates/EventDetailPage'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'

// 900, not 3600: the live overlay (prices, sold-out state) is in the HTML and
// the partner feed is cached 15 min, so a page held for an hour could show a
// tier that sold out 45 minutes ago. Matches the boats charter page.
export const revalidate = 900

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type?.slug === 'clubbing')
  const dates = venue ? await getAllDates(params.locale) : []
  const ev = dates.find(d => d.venueSlug === params.slug && d.eventSlug === params.eventSlug)
  if (!ev || !venue) return staticMetadata(params.locale, 'club-tickets')
  return detailMetadata(params.locale, `club-tickets/${params.slug}/${params.eventSlug}`, ev.eventName || ev.name || venue.name, {
    description: (venue as any).cleanDescription || venue.description,
    image: ev.eventCover || ev.eventLogo || venue.cover || venue.picture,
    suffix: `Tickets — ${venue.name}`,
  })
}

export default async function EventPage({ params }: Props) {
  // Same data source as every other category (activities/boat-trip/tours/...):
  // the fast, always-available local JSON feed — NOT Supabase, which crashed
  // this route (and every /club-tickets/[slug]/[eventSlug] page) whenever its
  // production credentials weren't configured.
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type?.slug === 'clubbing')
  if (!venue) notFound()

  const allDates = await getAllDates(params.locale)
  const eventDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug)
  if (eventDates.length === 0) notFound()

  // Live overlay: fresher prices, sold-out state and line-ups than the nightly
  // JSON (see src/lib/clubtickets-live.ts). `null` on any failure — the merge
  // then passes the JSON rows through untouched, so the page is unchanged.
  const eventId = eventDates[0]?.eventId ?? 0
  const live = await getLiveEvent(venue.id, eventId, params.locale)
  const dates = mergeEventDates(eventDates, live, ibizaToday())

  return (
    <EventDetailPage
      eventDates={dates}
      liveTimes={live ? { startAt: live.startAt, endAt: live.endAt } : undefined}
      eventSoldOut={live?.soldOut ?? false}
      eventSlug={params.eventSlug}
      club={venue as any}
      locale={params.locale}
      basePath="club-tickets"
    />
  )
}
