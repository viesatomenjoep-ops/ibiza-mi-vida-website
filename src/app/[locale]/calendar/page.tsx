import { getDictionary } from '@/lib/dictionary';
import CalendarClient from './CalendarClient';
import { getVenues, getAllDates, getArtists } from '@/lib/clubtickets';

export default async function CalendarPage({ 
  params,
  searchParams
}: { 
  params: { locale: string },
  searchParams: { month?: string }
}) {
  const dict = await getDictionary(params.locale as any);
  
  // Default to current month if no month is provided
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  const targetMonthStr = searchParams.month || currentMonth;

  // Fetch dates and venues statically from JSON
  const allDates = await getAllDates(params.locale);
  const venues = await getVenues(params.locale);
  const artists = await getArtists(params.locale);
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
      ct_events: {
        name: d.eventName,
        slug: d.eventSlug,
        logo: d.eventLogo,
        cover: d.eventCover
      },
      ct_venues: {
        name: d.venueName,
        slug: d.venueSlug,
        whitelogo: venueObj?.whitelogo || '',
        is_day_club: venueObj?.isDayClub || false,
        type_slug: venueObj?.type?.slug || ''
      }
    };
  });

  const lightVenues = venues.map(v => ({
    name: v.name,
    slug: v.slug
  }));

  return (
    <CalendarClient 
      events={mappedEvents} 
      allVenues={lightVenues}
      allArtists={[]} // Not used in CalendarClient
      dict={dict} 
      locale={params.locale}
      initialMonth={targetMonthStr}
    />
  );
}
