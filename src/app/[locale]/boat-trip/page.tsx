import type { Metadata } from 'next'
import { BoatRentalPromo } from '@/components/hub/BoatRentalPromo'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boat-trip')
}

import { getVenues, getAllDates } from '@/lib/clubtickets';
import { agendaCopy } from '@/lib/agenda-i18n';
import WaterAgendaClient, { WaterAgendaEvent, WaterAgendaVenue } from '@/components/boats/WaterAgendaClient';
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { crumbLabel } from '@/lib/breadcrumb-labels'
import { ibizaToday } from '@/lib/date-label'

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const catVenues = allVenues.filter(v => v.type?.slug === 'boat');
  const catSlugs = new Set(catVenues.map(v => v.slug));

  const allDates = await getAllDates(params.locale);
  const todayStr = ibizaToday();
  // PERF: only ship the next 31 days to the client — the full season would
  // make the payload huge (see the other agenda pages).
  const windowEndStr = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0];
  const events: WaterAgendaEvent[] = allDates
    .filter(d => d.venueSlug && catSlugs.has(d.venueSlug) && d.date >= todayStr && d.date <= windowEndStr)
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

  const C = agendaCopy('boat-trip', params.locale);
  return (
    <>
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[{ name: homeLabel(params.locale), path: '' }, { name: crumbLabel('boat-trip', params.locale) }]}
      />
    <WaterAgendaClient
      today={todayStr}
      locale={params.locale}
      basePath="boat-trip"
      kicker={C.kicker}
      title={C.title}
      subtitle={C.subtitle}
      events={events}
      venues={venues}
    />
    {/* Server-gerenderd onder de agenda: deze pagina beschreef boten zonder
        ergens een manier te bieden om er een te boeken. */}
    <BoatRentalPromo locale={params.locale} />
    </>
  );
}
