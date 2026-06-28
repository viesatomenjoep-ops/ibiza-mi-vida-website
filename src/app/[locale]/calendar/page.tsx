import { getAllDates, getVenues, getArtists } from '@/lib/clubtickets';
import { getDictionary } from '@/lib/dictionary';
import CalendarClient from './CalendarClient';

export default async function CalendarPage({ params }: { params: { locale: string } }) {
  const [dict, eventDates, venues, artists] = await Promise.all([
    getDictionary(params.locale as any),
    getAllDates(),
    getVenues(),
    getArtists()
  ]);

  return (
    <CalendarClient 
      allEventDates={eventDates} 
      dict={dict} 
      locale={params.locale} 
      artists={artists} 
      venues={venues} 
    />
  );
}
