import React from 'react';
import type { Metadata } from 'next';
import { getVenues } from '@/lib/clubtickets';
import { getPageContent } from '@/lib/page-content';
import { BoatListClient } from '@/components/boats/BoatListClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bootfeesten op Ibiza — Party Boats & Sunset Cruises',
  description: 'Dansen op het dek met de skyline van Ibiza achter je. Bekijk de aankomende party boats met line-up en boek direct.',
}

interface Props {
  params: {
    locale: string;
  };
}

export default async function BoatPartiesListPage({ params }: Props) {
  const allVenues = await getVenues(params.locale);
  const boats = allVenues.filter(v => v.type.slug === 'boat');
  
  const boatPartyNames = ['cruise crush', 'brunch on the boat', 'float your boat', 'pukka up', 'the ibz boat'];
  
  const boatParties = boats.filter(boat => {
    const n = boat.name.toLowerCase();
    if (boatPartyNames.some(kw => n.includes(kw))) return true;
    if (n.includes('party')) return true;
    return false;
  });

  const events = boatParties.map(boat => ({
    id: boat.id,
    title: boat.name,
    coverImage: boat.cover || boat.picture || '',
    departureTime: 'Diverse tijden', // Could be fetched from dates if needed
    departureLocation: 'Ibiza Port / San Antonio',
    price: '—€', // Could be fetched from API if available
    badges: ['Party Boat', 'Day/Night'],
    slug: boat.slug,
    basePath: 'boat-parties'
  }));

  const stats = [
    { label: 'Vertrek', value: 'Diverse havens', icon: <svg viewBox="0 0 24 24"><path d="M3 16h18l-2.5 4.5a1 1 0 0 1-.9.5H6.4a1 1 0 0 1-.9-.5L3 16zM5 16l1.2-5h11.6L19 16M12 11V4l5 3-5 2"/></svg> },
    { label: 'Duur', value: '2–5 uur', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg> },
    { label: 'Vanaf', value: 'Live', icon: <svg viewBox="0 0 24 24"><path d="M12 2v20M6 6h9a3 3 0 0 1 0 6H6"/></svg> }
  ];

  const crumbs = [
    { label: 'Home', href: `/${params.locale}` },
    { label: 'Op het water', href: `/${params.locale}/boat-parties` },
    { label: 'Bootfeesten' }
  ];

  return (
    <BoatListClient
      eyebrow="Bootfeesten"
      title="Bootfeesten op de Middellandse Zee"
      subtitle="Dansen op het dek met de skyline van Ibiza achter je. Bekijk de aankomende party boats met line-up en boek direct."
      coverImage="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85"
      crumbs={crumbs}
      stats={stats}
      sectionTitle="Aankomende bootfeesten"
      sectionSubtitle="Live aanbod uit ClubTickets — line-ups, tijden en tickets."
      events={events}
    />
  );
}
