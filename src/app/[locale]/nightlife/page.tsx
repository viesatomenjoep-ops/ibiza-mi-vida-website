import type { Metadata } from 'next'
import { getVenues } from '@/lib/clubtickets'
import ClubsClient from '@/components/nightlife/ClubsClient'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Clubs Ibiza — Alle clubs en feesten | Ibiza mi Vida',
  description: 'Ontdek alle bekende clubs op Ibiza: Pacha, Amnesia, Ushuaïa, Hï en meer. Boek je officiële tickets direct online.',
}

export default async function NightlifePage({
  params,
}: {
  params: { locale: string }
}) {
  const venues = await getVenues(params.locale)

  const translations = {
    title: 'Clubs Ibiza',
    description: 'Ontdek het legendarische nachtleven van Ibiza. Van wereldberoemde superclubs tot intieme underground venues. Vind jouw favoriete feest en boek officiële tickets.',
    allClubs: 'Alle clubs',
    searchPlaceholder: 'Zoek een club...',
  }

  return (
    <>
      <ClubsClient venues={venues} translations={translations} />

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24 pt-8">
        <CrossSellBanner triggerPage="/nightlife" fromPrice={500} />
      </section>
    </>
  )
}
