import { NextResponse } from 'next/server';
import { getVenues, getAllDates } from '@/lib/clubtickets';
import { locations } from '@/lib/locations';
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-experiences';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const locale = searchParams.get('locale') || 'nl';

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: any[] = [];

  try {
    // 1. Search Venues (Clubs)
    const venues = await getVenues(locale);
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
        url: `/${locale}/club-tickets/${v.slug}`
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
      const dateFormatted = new Date(e.date).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
      results.push({
        id: `event-${e.id}`,
        type: 'Event',
        title: e.eventName || 'Club Event',
        subtitle: `${dateFormatted} @ ${e.venueName || 'Ibiza'}`,
        image: e.eventCover || e.eventLogo || e.venueLogo || null,
        url: `/${locale}/club-tickets/${e.venueSlug}/${e.eventSlug}?date=${e.date}`
      });
    });

    // 3. Search Locations
    const matchedLocations = locations.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.tagline.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q)
    ).slice(0, 3);

    matchedLocations.forEach(l => {
      results.push({
        id: `loc-${l.id}`,
        type: 'Location',
        title: l.name,
        subtitle: l.tagline,
        image: l.imageUrl || null,
        url: `/${locale}/locations/${l.slug}`
      });
    });

    // 4. Search Experiences
    Object.keys(FALLBACK_EXPERIENCES).forEach(category => {
      const exps = FALLBACK_EXPERIENCES[category];
      const matchedExps = exps.filter(ex => 
        ex.title.toLowerCase().includes(q) ||
        (ex.description && ex.description.toLowerCase().includes(q))
      ).slice(0, 3);

      matchedExps.forEach(ex => {
        let routeCat = 'excursions';
        if (category === 'boat-party') routeCat = 'boat-parties';
        if (category === 'boat-charter') routeCat = 'private-boat-charters';
        if (category === 'catamaran') routeCat = 'vip-catamaran';
        if (category === 'formentera') routeCat = 'formentera-boat-trips';

        results.push({
          id: `exp-${ex.id}`,
          type: 'Experience',
          title: ex.title,
          subtitle: ex.tagline,
          image: ex.image_url || null,
          url: `/${locale}/${routeCat}/${ex.slug}`
        });
      });
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ results: [], error: 'Failed to perform search' }, { status: 500 });
  }
}
