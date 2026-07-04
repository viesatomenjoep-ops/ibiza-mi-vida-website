import { getVenues, getAllDates } from '@/lib/clubtickets';
import WaterAgendaClient, { WaterAgendaEvent, WaterAgendaVenue } from '@/components/boats/WaterAgendaClient';

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const ferryVenues = allVenues.filter(v => v.type?.slug === 'formentera-day-trip');
  const ferrySlugs = new Set(ferryVenues.map(v => v.slug));

  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];
  const events: WaterAgendaEvent[] = allDates
    .filter(d => d.venueSlug && ferrySlugs.has(d.venueSlug) && d.date >= todayStr)
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

  const venues: WaterAgendaVenue[] = ferryVenues.map(v => ({
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
      kicker={`Ibiza · Formentera ${new Date().getFullYear()}`}
      title="Ferry Formentera"
      subtitle="Bekijk alle afvaarten naar Formentera per dag, week en maand en boek direct via ClubTickets."
      events={events}
      venues={venues}
    />
  );
}
