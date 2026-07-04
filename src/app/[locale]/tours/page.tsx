import { getVenues, getAllDates } from '@/lib/clubtickets';
import WaterAgendaClient, { WaterAgendaEvent, WaterAgendaVenue } from '@/components/boats/WaterAgendaClient';

export const revalidate = 3600;

const TOUR_MATCH = /buggy|excursion|safari|tour|adventure|island|es vedra|es sabini|cova/i;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const catVenues = allVenues.filter(
    v => v.type?.slug === 'activities' && TOUR_MATCH.test(v.name)
  );
  const catSlugs = new Set(catVenues.map(v => v.slug));

  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];
  const events: WaterAgendaEvent[] = allDates
    .filter(d => d.venueSlug && catSlugs.has(d.venueSlug) && d.date >= todayStr)
    .map(d => ({
      id: String(d.id),
      name: d.name,
      date: d.date,
      prices: String(d.prices ?? ''),
      lineUp: d.lineUp,
      eventName: d.eventName,
      eventSlug: d.eventSlug,
      eventCover: d.eventCover,
      eventLogo: d.eventLogo,
      venueName: d.venueName,
      venueSlug: d.venueSlug,
      venueCover: d.venueCover,
      venueLogo: d.venueLogo,
      affLink: d.affLink,
    }));

  const venues: WaterAgendaVenue[] = catVenues.map(v => ({
    slug: v.slug,
    name: v.name,
    picture: v.picture,
    whitelogo: v.whitelogo,
    cover: v.cover,
    logo: (v as any).logo,
  }));

  return (
    <WaterAgendaClient
      locale={params.locale}
      kicker={`Ibiza Tours ${new Date().getFullYear()}`}
      title="Tours"
      subtitle="Alle tours en excursies in Ibiza per dag, week en maand — direct te boeken via ClubTickets."
      events={events}
      venues={venues}
    />
  );
}
