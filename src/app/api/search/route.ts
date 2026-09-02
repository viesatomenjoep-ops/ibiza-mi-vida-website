import { NextResponse } from 'next/server';
import { getVenues, getAllDates, getArtists } from '@/lib/clubtickets';

export const dynamic = 'force-dynamic';
import { locations } from '@/lib/locations';
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo';
import { eventBasePath } from '@/lib/event-path';
import { localeTag } from '@/lib/date-label';
import { FLEET } from '@/data/fleet';
import { slugFor } from '@/lib/route-slugs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  // Eerst valideren: een ongeldige locale gooide een RangeError in
  // toLocaleDateString en daarmee een 500 op de hele zoekopdracht.
  const rawLocale = searchParams.get('locale') || DEFAULT_LOCALE;
  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale) ? (rawLocale as Locale) : DEFAULT_LOCALE;

  // Lege zoekopdracht: suggesties in plaats van niets.
  //
  // Een leeg zoekveld met een knipperende cursor legt het werk bij de
  // bezoeker: hij moet zelf bedenken wat deze site te bieden heeft. De
  // eerstvolgende avonden, de bekendste clubs en de vaste ingangen kosten ons
  // niets en beantwoorden de vraag "wat kan ik hier eigenlijk zoeken".
  if (!q || q.length < 1) {
    return NextResponse.json({ results: await suggesties(locale) });
  }

  const results: any[] = [];

  try {
    // 1. Search Venues (Clubs)
    const venues = await getVenues(locale);
    const venueTypeBySlug = new Map(venues.map(v => [v.slug, v.type?.slug || '']));
    const matchedVenues = venues.filter(v => 
      v.name.toLowerCase().includes(q) || 
      (v.description && v.description.toLowerCase().includes(q))
    ).slice(0, 5);

    matchedVenues.forEach(v => {
      results.push({
        id: `venue-${v.id}`,
        type: 'Club',
        title: v.name,
        subtitle: 'Official Club Tickets',
        image: v.cover || v.picture || null,
        // Alleen 'clubbing' leeft onder /club-tickets; een boot daarheen is een 404.
        url: `/${locale}/${eventBasePath(v.type?.slug)}/${v.slug}`
      });
    });

    // 1b. Search Artists / DJs
    const artists = await getArtists(locale);
    const matchedArtists = artists.filter(a => a.name && a.name.toLowerCase().includes(q)).slice(0, 6);
    matchedArtists.forEach((a: any) => {
      results.push({
        id: `artist-${a.slug}`,
        type: 'Artiest',
        title: a.name,
        subtitle: a.venueName ? `@ ${a.venueName}` : 'DJ / Artiest',
        image: a.image || null,
        url: `/${locale}/artists/${a.slug}`,
      });
    });

    // 2. Search Events
    const allDates = await getAllDates(locale);
    // Remove duplicates by eventId just in case, but usually we just show the first few matching dates
    const matchedEvents = allDates.filter(d => 
      (d.eventName && d.eventName.toLowerCase().includes(q)) || 
      (d.venueName && d.venueName.toLowerCase().includes(q)) ||
      (d.lineUp && d.lineUp.toLowerCase().includes(q))
    ).slice(0, 10);

    matchedEvents.forEach(e => {
      const dateFormatted = new Date(e.date).toLocaleDateString(localeTag(locale), { day: 'numeric', month: 'short', timeZone: 'UTC' });
      results.push({
        id: `event-${e.id}`,
        type: 'Event',
        title: e.eventName || 'Club Event',
        subtitle: `${dateFormatted} @ ${e.venueName || 'Ibiza'}`,
        image: e.eventCover || e.eventLogo || e.venueLogo || null,
        url: `/${locale}/${eventBasePath(venueTypeBySlug.get(e.venueSlug || ''))}/${e.venueSlug}/${e.eventSlug}?date=${e.date}`
      });
    });

    // 2b. Search Boats -- de eigen vloot. Iemand die "Sunseeker" of
    // "Formentera" intikt hoort onze eigen boten te vinden, niet alleen
    // ClubTickets-events.
    const boten = FLEET.filter(b =>
      b.model.toLowerCase().includes(q) ||
      (b.name || '').toLowerCase().includes(q) ||
      b.marina.toLowerCase().includes(q)
    ).slice(0, 5);
    boten.forEach(b => {
      results.push({
        id: `boat-${b.slug}`,
        type: 'Boot',
        title: b.name ? `${b.model} ${b.name}` : b.model,
        subtitle: `${b.marina} · ${b.pax} pers. · vanaf €${b.price.low}`,
        image: b.image || null,
        url: `/${locale}/private-boat-charters`,
      });
    });

    // 2c. Vaste pagina's. Zonder deze vond je "guestlist", "autohuur" of
    // "agenda" nergens -- terwijl dat pagina's zijn die bestaan.
    PAGINAS.forEach(p => {
      const titel = (p.titel[locale] || p.titel.en);
      if (!titel.toLowerCase().includes(q) && !p.sleutels.some(k => k.includes(q))) return;
      results.push({
        id: `page-${p.pad}`,
        type: 'Pagina',
        title: titel,
        subtitle: null,
        image: null,
        url: `/${locale}/${p.routeKey ? slugFor(p.routeKey as never, locale) : p.pad}`,
      });
    });

    // 3. Search Locations
    // tagline/intro are localized objects now, and `description` was replaced
    // by the richer place-guide fields.
    const sl = locale;
    const matchedLocations = locations.filter(l =>
      l.name.toLowerCase().includes(q) ||
      (l.tagline[sl] || '').toLowerCase().includes(q) ||
      (l.intro[sl] || '').toLowerCase().includes(q)
    ).slice(0, 3);

    matchedLocations.forEach(l => {
      results.push({
        id: `loc-${l.id}`,
        type: 'Location',
        title: l.name,
        subtitle: l.tagline[sl],
        image: l.imageUrl || null,
        url: `/${locale}/locations/${l.slug}`
      });
    });

    // Fallback-experiences zijn hier weg: hun routes (/excursions,
    // /vip-catamaran, /formentera-boat-trips, /boat-parties) bestaan niet,
    // dus elk resultaat daarvan was een 404.

    // Dedupe (events repeat per date) and rank exact prefix matches first
    const seen = new Set<string>();
    const deduped = results.filter(r => {
      const key = `${r.type}|${(r.title || '').toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const rank = (r: any) => ((r.title || '').toLowerCase().startsWith(q) ? 0 : 1);
    deduped.sort((a, b) => rank(a) - rank(b));

    return NextResponse.json({ results: deduped.slice(0, 16) });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ results: [], error: 'Failed to perform search' }, { status: 500 });
  }
}


/** Vaste pagina's die vindbaar horen te zijn. */
const PAGINAS: { pad: string; routeKey?: string; sleutels: string[]; titel: Record<string, string> }[] = [
  { pad: 'calendar', sleutels: ['agenda', 'calendar', 'kalender', 'clubagenda'], titel: { nl: 'Clubagenda', en: 'Club calendar', de: 'Clubkalender', es: 'Agenda de clubs', fr: 'Agenda des clubs' } },
  { pad: 'activities-calendar', sleutels: ['activiteiten', 'activities', 'excursies', 'aktivitaten'], titel: { nl: 'Activiteitenagenda', en: 'Activities calendar', de: 'Aktivitätenkalender', es: 'Agenda de actividades', fr: 'Agenda des activités' } },
  { pad: 'this-week', sleutels: ['deze week', 'this week', 'week'], titel: { nl: 'Deze week', en: 'This week', de: 'Diese Woche', es: 'Esta semana', fr: 'Cette semaine' } },
  { pad: 'private-boat-charters', sleutels: ['boot', 'boat', 'jacht', 'yacht', 'charter', 'boot huren'], titel: { nl: 'Privé boot charters', en: 'Private boat charters', de: 'Private Bootscharter', es: 'Alquiler de barcos privados', fr: 'Location de bateaux privés' } },
  { pad: 'guestlist', sleutels: ['guestlist', 'gastenlijst', 'gratis'], titel: { nl: 'Guestlist', en: 'Guestlist', de: 'Gästeliste', es: 'Lista de invitados', fr: 'Guestlist' } },
  { pad: 'clubs', sleutels: ['clubs', 'club'], titel: { nl: 'Clubs op Ibiza', en: 'Clubs in Ibiza', de: 'Clubs auf Ibiza', es: 'Clubes en Ibiza', fr: 'Clubs à Ibiza' } },
  { pad: 'artists', sleutels: ['artiesten', 'artists', 'dj', "dj's"], titel: { nl: 'Artiesten', en: 'Artists', de: 'Künstler', es: 'Artistas', fr: 'Artistes' } },
  { pad: 'car-rental', routeKey: 'car-rental', sleutels: ['auto', 'car', 'huurauto', 'autohuur', 'wiber'], titel: { nl: 'Auto huren', en: 'Car rental', de: 'Mietwagen', es: 'Alquiler de coches', fr: 'Location de voiture' } },
  { pad: 'contact', sleutels: ['contact', 'whatsapp'], titel: { nl: 'Contact', en: 'Contact', de: 'Kontakt', es: 'Contacto', fr: 'Contact' } },
];

/**
 * Wat we tonen zolang er niets is ingetikt.
 *
 * De eerstvolgende avonden uit de agenda, aangevuld met de vaste ingangen.
 * Alles komt uit dezelfde feed als de zoekresultaten zelf, dus er staat niets
 * bij dat niet bestaat.
 */
async function suggesties(locale: Locale) {
  try {
    const [venues, allDates] = await Promise.all([getVenues(locale), getAllDates(locale)]);
    const typeBySlug = new Map(venues.map(v => [v.slug, v.type?.slug || '']));
    const vandaag = new Date().toISOString().slice(0, 10);
    const gezien = new Set<string>();
    const uit: any[] = [];
    for (const e of allDates) {
      if ((e.date || '') < vandaag) continue;
      const sleutel = e.eventSlug || '';
      if (!sleutel || gezien.has(sleutel)) continue;
      gezien.add(sleutel);
      uit.push({
        id: `sug-${e.id}`,
        type: 'Event',
        title: e.eventName || 'Event',
        subtitle: `${new Date(e.date).toLocaleDateString(localeTag(locale), { day: 'numeric', month: 'short', timeZone: 'UTC' })} @ ${e.venueName || 'Ibiza'}`,
        image: e.eventCover || e.eventLogo || e.venueLogo || null,
        url: `/${locale}/${eventBasePath(typeBySlug.get(e.venueSlug || ''))}/${e.venueSlug}/${e.eventSlug}?date=${e.date}`,
      });
      if (uit.length === 6) break;
    }
    PAGINAS.slice(0, 4).forEach(p => uit.push({
      id: `sug-page-${p.pad}`,
      type: 'Pagina',
      title: p.titel[locale] || p.titel.en,
      subtitle: null,
      image: null,
      url: `/${locale}/${p.routeKey ? slugFor(p.routeKey as never, locale) : p.pad}`,
    }));
    return uit;
  } catch {
    return [];
  }
}
