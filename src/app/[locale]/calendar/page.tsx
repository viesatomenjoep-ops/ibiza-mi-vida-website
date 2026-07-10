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

  // Map dates to the format expected by the client
  const mappedEvents = allDates.map(d => {
    const venueObj = d.venueSlug ? venuesMap.get(d.venueSlug) : undefined;
    return {
      id: String(d.id),
      name: d.name,
      date: d.date,
      prices: d.prices,
      lineUp: d.lineUp,
      affLink: d.affLink || '',
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
