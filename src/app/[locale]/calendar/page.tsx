import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'calendar')
}

import EventsExplorer from './EventsExplorer';
import { getVenues, getAllDates } from '@/lib/clubtickets';
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd';
import { pickCover } from '@/lib/blank-covers';
import { eventBasePath } from '@/lib/event-path';
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { crumbLabel } from '@/lib/breadcrumb-labels'

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
        cover: pickCover(d.eventCover, d.eventLogo, venueObj?.picture, d.venueCover),
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

  // Structured data for the listing itself. Paths go through eventBasePath()
  // for the same reason the sitemap does: only 'clubbing' venues live under
  // /club-tickets, and pointing a boat event there is a guaranteed 404.
  const listEntries = mappedEvents
    .filter(e => e.ct_venues.slug && e.ct_events.slug)
    .map(e => ({
      name: `${e.ct_events.name || e.name} — ${e.ct_venues.name}`,
      path: `${params.locale}/${eventBasePath(e.ct_venues.type_slug)}/${e.ct_venues.slug}/${e.ct_events.slug}`,
      date: e.date,
    }));

  return (
    <>
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[{ name: homeLabel(params.locale), path: '' }, { name: crumbLabel('calendar', params.locale) }]}
      />
      <ItemListJsonLd
        entries={listEntries}
        locale={params.locale}
        name="Ibiza event calendar"
      />
      <EventsExplorer
        events={mappedEvents}
        allVenues={lightVenues}
        locale={params.locale}
      />
    </>
  );
}
