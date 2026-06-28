import React from 'react';
import { getAllDates } from '@/lib/clubtickets';
import ClubTicketsClient from './ClubTicketsClient';

interface Props {
  params: {
    locale: string;
  };
}

export const revalidate = 3600;

export default async function ClubTicketsPage({ params }: Props) {
  // Fetch all events/dates for the listing
  const allEvents = await getAllDates(params.locale);

  // You might want to fetch translations here if you have a dictionary system
  const dict = {}; 

  return (
    <div className="pt-20"> {/* Add some padding top since we have a fixed transparent navbar */}
      <ClubTicketsClient initialEvents={allEvents} locale={params.locale} dict={dict} />
    </div>
  );
}
