import React from 'react';
import type { Metadata } from 'next';
import { getVenues } from '@/lib/clubtickets';
import { BoatListClient } from '@/components/boats/BoatListClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Ibiza Boat Trip — Boottochten & excursies | Ibiza mi Vida',
  description: 'Ontdek Ibiza vanaf zee: boottochten naar baaien, grotten en Es Vedrà. Boek je excursie.',
}

interface Props {
  params: {
    locale: string;
  };
}

export default async function ExcursionsPage({ params }: Props) {
  const allVenues = await getVenues(params.locale);
  // Original logic was v.type.slug === 'activities', but let's map 'boat' trips that are not parties
  const boats = allVenues.filter(v => v.type.slug === 'boat');
  
  // Categorization lists based on user request (from original boat-parties page)
  const boatTripNames = ['the formentera cruise', 'the beach hopper', 'calas de formentera', 'crystal waters', 'capitan nemo', 'salvador'];
  
  const boatTrips = boats.filter(boat => {
    const n = boat.name.toLowerCase();
    if (boatTripNames.some(kw => n.includes(kw))) return true;
    if (!n.includes('party') && !n.includes('formentera') && !n.includes('ferry')) return true;
    return false;
  });

  const events = boatTrips.map(boat => ({
    id: boat.id,
    title: boat.name,
    coverImage: boat.cover || boat.picture || '',
    departureTime: 'Ochtend / Middag',
    departureLocation: 'Diverse havens',
    price: '—€',
    badges: ['Excursie', 'Day Trip'],
    slug: boat.slug,
    basePath: 'boat-parties' // The actual venue detail page is under boat-parties in Next.js structure
  }));

  const stats = [
    { label: 'Vertrek', value: 'Diverse havens', icon: <svg viewBox="0 0 24 24"><path d="M3 16h18l-2.5 4.5a1 1 0 0 1-.9.5H6.4a1 1 0 0 1-.9-.5L3 16zM5 16l1.2-5h11.6L19 16M12 11V4l5 3-5 2"/></svg> },
    { label: 'Duur', value: '3–6 uur', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg> },
    { label: 'Vanaf', value: 'Live', icon: <svg viewBox="0 0 24 24"><path d="M12 2v20M6 6h9a3 3 0 0 1 0 6H6"/></svg> }
  ];

  const crumbs = [
    { label: 'Home', href: `/${params.locale}` },
    { label: 'Op het water', href: `/${params.locale}/boat-parties` },
    { label: 'Excursies' }
  ];

  return (
    <BoatListClient
      eyebrow="Boottochten & Excursies"
      title="Ibiza vanaf het water"
      subtitle="Ontdek verborgen baaien, magische grotten en de mystiek van Es Vedrà. Bekijk hieronder alle boottochten en boek je plek."
      coverImage="https://images.unsplash.com/photo-1544211158-b6df3db0f671?w=1920&q=85"
      crumbs={crumbs}
      stats={stats}
      sectionTitle="Aankomende excursies"
      sectionSubtitle="Actueel aanbod — vertrektijden en tickets."
      events={events}
    />
  );
}
