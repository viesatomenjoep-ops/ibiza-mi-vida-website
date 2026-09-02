import { NextResponse } from 'next/server';
import { getVenues, getAllDates, getArtists } from '@/lib/clubtickets';

export const dynamic = 'force-dynamic';
import { locations } from '@/lib/locations';
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo';
import { eventBasePath } from '@/lib/event-path';
import { localeTag } from '@/lib/date-label';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  // Eerst valideren: een ongeldige locale gooide een RangeError in
  // toLocaleDateString en daarmee een 500 op de hele zoekopdracht.
  const rawLocale = searchParams.get('locale') || DEFAULT_LOCALE;
  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale) ? (rawLocale as Locale) : DEFAULT_LOCALE;

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
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
