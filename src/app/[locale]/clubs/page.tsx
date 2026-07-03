import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
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
  // Query all active venues that are clubs from Supabase
  const { data: venues } = await supabase
    .from('ct_venues')
    .select('*')
    .eq('type_slug', 'clubbing')
    .eq('active', true)
    .order('name');

  const translations = {
    title: 'Clubs Ibiza',
    description: 'Ontdek het legendarische nachtleven van Ibiza. Van wereldberoemde superclubs tot intieme day clubs en legendarische discotheken. Vind jouw favoriete venue en boek officiële tickets.',
    allClubs: 'Alle clubs',
    searchPlaceholder: 'Zoek een club...',
  }

  return (
    <>
      <ClubsClient venues={venues || []} translations={translations} locale={params.locale} />

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24 pt-8">
        <CrossSellBanner triggerPage="/clubs" fromPrice={500} />
      </section>
    </>
  )
}
