import type { Metadata } from 'next'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import IbizaCalendarClient from '@/components/calendar/IbizaCalendarClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Ibiza Party Calendar 2026 | Ibiza mi vida',
  description: 'The official Ibiza party calendar. Discover all club nights, boat parties, and activities. Book your tickets now.',
}

export default async function CalendarPage({
  params,
}: {
  params: { locale: string }
}) {
  const venues = await getVenues(params.locale)
  const allDates = await getAllDates(params.locale)

  return (
    <main className="theme-nightlife bg-[#f2f1fc] min-h-screen text-[var(--color-ink)] pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="font-serif text-5xl md:text-6xl text-white drop-shadow-md mb-12">
          Ibiza party calendar
        </h1>
        
        {/* Pass all necessary data to the Client Component */}
        <IbizaCalendarClient 
          venues={venues} 
          allDates={allDates} 
          locale={params.locale} 
        />
      </div>
    </main>
  )
}
