import React from 'react';
import { getAllDates, getVenues } from '@/lib/clubtickets';
import ClubTicketsClient from './ClubTicketsClient';

interface Props {
  params: {
    locale: string;
  };
}

export const revalidate = 3600;

export default async function ClubTicketsPage({ params }: Props) {
  // Fetch all events/dates and venues for the listing
  const allEvents = await getAllDates(params.locale);
  const venues = await getVenues(params.locale);

  // You might want to fetch translations here if you have a dictionary system
  const dict = {}; 

  return (
    <div>
      <ClubTicketsClient initialEvents={allEvents} venues={venues} locale={params.locale} dict={dict} />
    </div>
  );
}
