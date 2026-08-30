import type { Metadata } from 'next'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { PageFaq } from '@/components/seo/PageFaq'
import { QuickFacts } from '@/components/water/QuickFacts'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'ferry-formentera')
}

import { getVenues, getAllDates } from '@/lib/clubtickets';
import { agendaCopy } from '@/lib/agenda-i18n';
import WaterAgendaClient, { WaterAgendaEvent, WaterAgendaVenue } from '@/components/boats/WaterAgendaClient';


/**
 * The answer to "how do I get to Formentera", as the first prose on the page.
 *
 * Every figure is counted from the same feed the agenda below renders, so the
 * paragraph cannot drift away from what the page is actually selling. The two
 * facts that are not computed — no airport, roughly half an hour by fast ferry
 * — are stable properties of the island rather than of our inventory.
 */
function ferryLead(operators: number, departures: number, fromPrice: number, locale: string): string {
  const p = fromPrice > 0
  const M: Record<string, string> = {
    nl: `Formentera heeft geen vliegveld, dus de veerboot vanaf Ibiza is de enige manier om er te komen. De snelle overtocht duurt ongeveer een half uur. Voor de komende 31 dagen staan er ${departures} afvaarten van ${operators} rederijen in onze agenda${p ? `, met tickets vanaf €${fromPrice}` : ''}. De goedkoopste zijn de gewone overtochten; dagtochten die onderweg stoppen om te zwemmen kosten meer. Je boekt een specifieke datum en afvaart, geen open ticket.`,
    en: `Formentera has no airport, so the ferry from Ibiza is the only way to reach it. The fast crossing takes about half an hour. For the next 31 days our agenda holds ${departures} departures from ${operators} operators${p ? `, with tickets from €${fromPrice}` : ''}. The cheapest are the plain crossings; day trips that stop for swimming along the way cost more. You book a specific date and departure, not an open ticket.`,
    de: `Formentera hat keinen Flughafen, die Fähre ab Ibiza ist also der einzige Weg dorthin. Die schnelle Überfahrt dauert etwa eine halbe Stunde. Für die nächsten 31 Tage stehen ${departures} Abfahrten von ${operators} Reedereien in unserem Kalender${p ? `, mit Tickets ab €${fromPrice}` : ''}. Am günstigsten sind die reinen Überfahrten; Tagestouren mit Badestopps kosten mehr. Du buchst ein konkretes Datum und eine konkrete Abfahrt, kein offenes Ticket.`,
    es: `Formentera no tiene aeropuerto, así que el ferry desde Ibiza es la única forma de llegar. La travesía rápida dura alrededor de media hora. Para los próximos 31 días nuestra agenda tiene ${departures} salidas de ${operators} navieras${p ? `, con billetes desde ${fromPrice} €` : ''}. Las más baratas son las travesías simples; las excursiones de un día con paradas para bañarse cuestan más. Reservas una fecha y una salida concretas, no un billete abierto.`,
    fr: `Formentera n'a pas d'aéroport : le ferry depuis Ibiza est donc le seul moyen d'y accéder. La traversée rapide dure environ une demi-heure. Pour les 31 prochains jours, notre agenda compte ${departures} départs de ${operators} compagnies${p ? `, avec des billets dès ${fromPrice} €` : ''}. Les moins chers sont les traversées simples ; les excursions à la journée avec arrêts baignade coûtent plus. Vous réservez une date et un départ précis, pas un billet ouvert.`,
  }
  return M[locale] || M.en
}

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const ferryVenues = allVenues.filter(v => v.type?.slug === 'formentera-day-trip');
  const ferrySlugs = new Set(ferryVenues.map(v => v.slug));

  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];
  // PERF: only ship the next 31 days to the client - the full season (1000+ dates)
  // made the page payload huge and froze the browser.
  const windowEndStr = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0];
  const events: WaterAgendaEvent[] = allDates
    .filter(d => d.venueSlug && ferrySlugs.has(d.venueSlug) && d.date >= todayStr && d.date <= windowEndStr)
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

  const lowPrices = events
    .map(e => { const m = String(e.prices || '').match(/\d+(?:[.,]\d+)?/); return m ? parseFloat(m[0].replace(',', '.')) : 0 })
    .filter(n => n > 0);
  const lead = ferryLead(
    ferryVenues.length,
    events.length,
    lowPrices.length ? Math.round(Math.min(...lowPrices)) : 0,
    params.locale,
  );

  const C = agendaCopy('ferry-formentera', params.locale);
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const sc = SERVICE_COPY['ferry-formentera']

  return (
    <>
    <ServiceSchema name={sc.name[l]} description={sc.description[l]} serviceType={sc.serviceType} path={`${l}/ferry-formentera`} />
    <WaterAgendaClient
      locale={params.locale}
      basePath="ferry-formentera"
      kicker={C.kicker}
      title={C.title}
      subtitle={C.subtitle}
      lead={lead}
      events={events}
      venues={venues}
    />
    <QuickFacts pageKey="ferry-formentera" locale={params.locale} />
    <PageFaq pageKey="ferry-formentera" locale={params.locale} />
    <AuthorByline locale={params.locale} topic="the ferry to Formentera" />
    </>
  );
}
