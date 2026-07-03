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

  // Strip huge HTML descriptions from venues to keep RSC payload small
  const lightVenues = venues.map(v => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    whitelogo: v.whitelogo,
    isDayClub: v.isDayClub,
    type: v.type,
    // Only pass necessary string fields, ignore heavy ones like cleanDescription
  }));

  const dict = {}; 

  return (
    <div>
      <ClubTicketsClient initialEvents={allEvents} venues={lightVenues} locale={params.locale} dict={dict} />
    </div>
  );
}
