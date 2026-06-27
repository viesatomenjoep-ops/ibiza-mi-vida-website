import React from 'react';
import type { Metadata } from 'next';
import { getVenues, getAllDates } from '@/lib/clubtickets';
import { CategoryHero } from '@/components/hero/CategoryHero';
import { getPageContent } from '@/lib/page-content';
import { VenueEventsSlider, VenueSliderEvent } from '@/components/venues/VenueEventsSlider';
import { VenueCalendarList } from '@/components/venues/VenueCalendarList';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Ibiza Boat Party Tickets — Sunset & Party Cruises',
  description:
    'Book Ibiza boat party tickets with Ibiza mi vida. Sunset cruises, music boat parties, and group celebrations on the Mediterranean.',
}

interface Props {
  params: {
    locale: string;
  };
}

export default async function BoatPartiesPage({ params }: Props) {
  const allVenues = await getVenues(params.locale);
  // Only boat venues
  const boats = allVenues.filter(v => v.type.slug === 'boat');
  
  // Categorization lists based on user request
  const boatPartyNames = ['cruise crush', 'brunch on the boat', 'float your boat', 'pukka up', 'the ibz boat'];
  const boatTripNames = ['the formentera cruise', 'the beach hopper', 'calas de formentera', 'crystal waters', 'capitan nemo', 'salvador'];
  const shuttleFerryNames = ['cala salada', 'beach city boat', 'shuttle ferry ibiza', 'es canar'];
  const ibizaFormenteraNames = ['figueretas & playa', 'ibiza puerto', 'balearia', 'santa eulalia - formentera', 'aquabus'];
  
  const boatParties: VenueSliderEvent[] = [];
  const boatTrips: VenueSliderEvent[] = [];
  const shuttleFerries: VenueSliderEvent[] = [];
  const ibizaFormenteraFerries: VenueSliderEvent[] = [];

  boats.forEach(boat => {
    const n = boat.name.toLowerCase();
    
    const sliderEvent: VenueSliderEvent = {
      id: boat.id,
      name: boat.name,
      slug: boat.slug,
      cover: boat.cover || boat.picture,
      logo: boat.whitelogo || (boat as any).logo,
      venueName: boat.type?.name || 'Ibiza Boat'
    };

    if (boatPartyNames.some(kw => n.includes(kw))) {
      boatParties.push(sliderEvent);
    } else if (boatTripNames.some(kw => n.includes(kw))) {
      boatTrips.push(sliderEvent);
    } else if (shuttleFerryNames.some(kw => n.includes(kw))) {
      shuttleFerries.push(sliderEvent);
    } else if (ibizaFormenteraNames.some(kw => n.includes(kw)) || n.includes('formentera') || n.includes('ferry')) {
      ibizaFormenteraFerries.push(sliderEvent);
    } else {
      // Default fallback
      if (n.includes('party')) boatParties.push(sliderEvent);
      else boatTrips.push(sliderEvent);
    }
  });

  const pageContent = await getPageContent('boat-party', {
    title: "Ibiza Boat Parties & Ferries",
    subtitle: "Dance on the open sea or travel to Formentera. Discover Ibiza's best boat parties, sunset cruises, and ferry tickets.",
    backgroundImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85"
  });

  // Fetch all calendar dates for ALL boats
  const allDatesGlobal = await getAllDates(params.locale);
  const boatSlugs = new Set(boats.map(b => b.slug));
  const boatDates = allDatesGlobal.filter(d => d.venueSlug && boatSlugs.has(d.venueSlug));
  boatDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <CategoryHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        backgroundImage={pageContent.backgroundImage}
        colorTheme="indigo"
        eyebrow="Ibiza 2026"
      />

      {/* Sliders */}
      <div className="py-8 bg-[#FAF9F6]">
        {boatParties.length > 0 && (
          <VenueEventsSlider 
            title="Ibiza Boat Party"
            events={boatParties}
            venueSlug=""
            basePath="boat-parties"
            theme="light"
          />
        )}

        {boatTrips.length > 0 && (
          <VenueEventsSlider 
            title="Ibiza Boat Trip"
            events={boatTrips}
            venueSlug=""
            basePath="boat-parties"
            theme="blue"
          />
        )}

        {shuttleFerries.length > 0 && (
          <VenueEventsSlider 
            title="Shuttle Ferry"
            events={shuttleFerries}
            venueSlug=""
            basePath="boat-parties"
            theme="light"
          />
        )}

        {ibizaFormenteraFerries.length > 0 && (
          <VenueEventsSlider 
            title="Ferry Ibiza - Formentera"
            events={ibizaFormenteraFerries}
            venueSlug=""
            basePath="boat-parties"
            theme="blue"
          />
        )}
      </div>

      {/* Unified Boat Calendar */}
      <div className="border-t border-[#1A1A1A]/10">
        <VenueCalendarList 
          dates={boatDates} 
          venueName="Ibiza Boats & Ferries" 
          locale={params.locale} 
          basePath="boat-parties" 
        />
      </div>
    </div>
  );
}
