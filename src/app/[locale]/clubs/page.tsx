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

  const CLUBS_I18N: Record<string, { title: string; description: string; allClubs: string; searchPlaceholder: string }> = {
    en: {
      title: 'Clubs Ibiza',
      description: 'Discover the legendary nightlife of Ibiza. From world-famous superclubs to intimate day clubs and legendary discotheques. Find your favourite venue and book official tickets.',
      allClubs: 'All clubs',
      searchPlaceholder: 'Search a club...',
    },
    nl: {
      title: 'Clubs Ibiza',
      description: 'Ontdek het legendarische nachtleven van Ibiza. Van wereldberoemde superclubs tot intieme day clubs en legendarische discotheken. Vind jouw favoriete venue en boek officiële tickets.',
      allClubs: 'Alle clubs',
      searchPlaceholder: 'Zoek een club...',
    },
    de: {
      title: 'Clubs Ibiza',
      description: 'Entdecke das legendäre Nachtleben von Ibiza. Von weltberühmten Superclubs bis zu intimen Day Clubs und legendären Diskotheken. Finde deine Lieblingslocation und buche offizielle Tickets.',
      allClubs: 'Alle Clubs',
      searchPlaceholder: 'Club suchen...',
    },
    es: {
      title: 'Clubs Ibiza',
      description: 'Descubre la legendaria vida nocturna de Ibiza. Desde superclubs de fama mundial hasta íntimos day clubs y discotecas legendarias. Encuentra tu local favorito y reserva entradas oficiales.',
      allClubs: 'Todos los clubs',
      searchPlaceholder: 'Buscar un club...',
    },
    fr: {
      title: 'Clubs Ibiza',
      description: "Découvrez la vie nocturne légendaire d'Ibiza. Des superclubs de renommée mondiale aux day clubs intimistes et aux discothèques légendaires. Trouvez votre lieu favori et réservez des billets officiels.",
      allClubs: 'Tous les clubs',
      searchPlaceholder: 'Rechercher un club...',
    },
  }
  const translations = CLUBS_I18N[params.locale] || CLUBS_I18N.en

  return (
    <>
      <ClubsClient venues={venues || []} translations={translations} locale={params.locale} />

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24 pt-8">
        <CrossSellBanner triggerPage="/clubs" fromPrice={500} />
      </section>
    </>
  )
}
