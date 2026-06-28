import React from 'react';
import type { Metadata } from 'next';
import { getVenues } from '@/lib/clubtickets';
import { BoatListClient } from '@/components/boats/BoatListClient';
import { getPageContent } from '@/lib/page-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Ferry Ibiza - Formentera — Tijden & tickets | Ibiza mi Vida',
  description: 'Ferry van Ibiza naar Formentera: overtocht in ~30 min naar de mooiste stranden. Bekijk tijden en boek.',
}

interface Props {
  params: {
    locale: string;
  };
}

export default async function FormenteraTripsPage({ params }: Props) {
  const allVenues = await getVenues(params.locale);
  // Only show formentera day trips (ferries / trips)
  const trips = allVenues.filter(v => v.type.slug === 'formentera-day-trip');

  const pageContent = await getPageContent('formentera-boat-trips', {
    title: "Ferry van Ibiza naar Formentera",
    subtitle: "In ongeveer een half uur naar het paradijselijke Formentera, met zijn turquoise water en witte stranden. Bekijk de afvaarttijden en boek je tickets.",
    backgroundImage: "https://images.unsplash.com/photo-1544211158-b6df3db0f671?w=1920&q=85"
  });

  const formattedEvents = trips.map(trip => ({
    id: trip.id.toString(),
    title: trip.name,
    coverImage: trip.cover || trip.picture,
    price: 'API', // We can't fetch lowest price easily without event parsing
    slug: trip.slug,
    basePath: 'formentera-boat-trips',
    badges: ['Ferry'],
    departureLocation: trip.events?.[0]?.venue?.name || 'Ibiza Haven'
  }));

  const crumbs = [
    { label: 'Home', href: `/${params.locale}` },
    { label: 'Op het water', href: `/${params.locale}/boat-parties` },
    { label: 'Ferry Formentera' }
  ];

  const stats = [
    { label: 'Overtocht', value: '± 30 min', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg> },
    { label: 'Aankomst', value: 'La Savina', icon: <svg viewBox="0 0 24 24"><path d="M3 17h18l-2-6H5zM8 11V5h8v6M12 17v4M5 21h14"/></svg> },
    { label: 'Vanaf', value: 'Uit API', icon: <svg viewBox="0 0 24 24"><path d="M12 2v20M6 6h9a3 3 0 0 1 0 6H6"/></svg> }
  ];

  return (
    <BoatListClient
      eyebrow="Ferry Formentera"
      title={pageContent.title}
      subtitle={pageContent.subtitle}
      coverImage={pageContent.backgroundImage}
      crumbs={crumbs}
      stats={stats}
      sectionTitle="Ibiza → Formentera"
      sectionSubtitle=""
      events={formattedEvents}
    >
      <div className="route">
        <div className="stop"><div className="dot"></div><b>Ibiza</b><small>haven uit API</small></div>
        <div className="leg"></div>
        <div className="stop"><div className="dot" style={{ background: 'var(--blue)' }}></div><b>~30 min</b><small>overtocht</small></div>
        <div className="leg"></div>
        <div className="stop"><div className="dot"></div><b>Formentera</b><small>La Savina</small></div>
      </div>
      
      <div style={{ marginTop: '18px' }} className="mb-6">
        <span className="api-note"><span className="pulse"></span>Afvaarttijden laden uit ClubTickets API (JSON)</span>
      </div>
    </BoatListClient>
  );
}
