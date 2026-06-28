import type { Metadata } from 'next'
import { getAllDates } from '@/lib/clubtickets'
import DealsClient from '@/components/nightlife/DealsClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Deals of the Day Ibiza — Dagelijkse aanbiedingen | Ibiza mi Vida',
  description: 'Elke dag nieuwe deals op Ibiza: clubtickets, boat parties en activiteiten met korting. Wees er snel bij.',
}

export default async function DealsOfTheDayPage({
  params,
}: {
  params: { locale: string }
}) {
  // Fetch all upcoming dates
  const allDates = await getAllDates(params.locale)
  
  // Provide translations to the client component
  const translations = {
    title: 'Deals of the Day Ibiza',
    description: 'Dagelijks wisselende aanbiedingen van ClubTickets en onze eigen events. Scherp geprijsd, beperkt beschikbaar — wees er snel bij.',
    allDeals: 'Alle deals',
    clubbing: 'Clubbing',
    boat: 'Boat',
    searchPlaceholder: 'Zoek een event...',
    sortBy: 'Sorteer op',
    date: 'Datum',
    priceLowHigh: 'Prijs (Laag naar Hoog)',
    priceHighLow: 'Prijs (Hoog naar Laag)',
    results: 'resultaten',
    loadMore: 'Laad meer deals',
    buyTickets: 'Bekijk Deal',
    from: 'Vanaf',
    dealBadge: 'Vroege vogel',
    hotBadge: 'HOT'
  }

  return <DealsClient dates={allDates} translations={translations} />
}
