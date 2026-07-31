import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'calendar')
}

import EventsExplorer from './EventsExplorer';
import { getVenues, getAllDates } from '@/lib/clubtickets';

export default async function CalendarPage({
  params,
}: {
  params: { locale: string },
}) {
  // Fetch dates and venues statically from JSON
  const allDates = await getAllDates(params.locale);
  const venues = await getVenues(params.locale);
  const venuesMap = new Map(venues.map(v => [v.slug, v]));

  // PERF: only ship the next 31 days to the client — the full season (4000+
  // dates) made the payload huge and froze the calendar.
  const todayStr = new Date().toISOString().split('T')[0];
  const windowEndStr = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0];
  const windowedDates = allDates.filter(d => d.date >= todayStr && d.date <= windowEndStr);

  // Map dates to the format expected by the client
  const mappedEvents = windowedDates.map(d => {
    const venueObj = d.venueSlug ? venuesMap.get(d.venueSlug) : undefined;
    return {
      id: String(d.id),
      name: d.name,
      date: d.date,
      prices: d.prices,
      lineUp: d.lineUp,
      ct_events: {
        name: d.eventName,
        slug: d.eventSlug,
        logo: d.eventLogo,
        cover: d.eventCover,
      },
      ct_venues: {
        name: d.venueName,
        slug: d.venueSlug,
        whitelogo: venueObj?.whitelogo || d.venueLogo || venueObj?.picture || '',
        picture: venueObj?.picture || d.venueCover || '',
        type_slug: venueObj?.type?.slug || '',
      },
    };
  });

  const lightVenues = venues.map(v => ({
    name: v.name,
    slug: v.slug,
    whitelogo: v.whitelogo || '',
    picture: v.picture || '',
    type_slug: v.type?.slug || '',
  }));

  return (
    <EventsExplorer
      events={mappedEvents}
      allVenues={lightVenues}
      locale={params.locale}
    />
  );
}
