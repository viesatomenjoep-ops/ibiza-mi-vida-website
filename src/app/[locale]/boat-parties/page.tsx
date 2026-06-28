import React from 'react';
import type { Metadata } from 'next';
import { BoatHubClient } from '@/components/boats/BoatHubClient';

export const metadata: Metadata = {
  title: 'Op het water — Boat Parties, Excursions & Ferries | Ibiza mi Vida',
  description: 'Van party boats en rustige excursies tot privé charters en ferry\'s — kies hieronder hoe jij Ibiza vanaf het water wilt beleven.',
}

export default function BoatPartiesPage() {
  return (
    <BoatHubClient />
  );
}
