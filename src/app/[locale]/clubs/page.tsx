import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'
import { getVenues } from '@/lib/clubtickets'
import ClubsClient from '@/components/nightlife/ClubsClient'
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd'
import { CrossSellBanner } from '@/components/cards/CrossSellBanner'

export const revalidate = 3600

/** Venue slugs pinned to the top of the clubs grid, in this order. */
const PINNED = ['ushuaia-ibiza'];

// Was a static `metadata` export: one Dutch title served to all five locales,
// the brand suffix doubled (the layout template already appends it), and no
// canonical or hreflang at all — the only page on the site missing both.
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'clubs')
}

export default async function NightlifePage({
  params,
}: {
  params: { locale: string }
}) {
  // The ClubTickets JSON feed, like every other page on the site — not
  // Supabase. Supabase held stale image URLs: Baloo's cover pointed at
  // media.clubtickets.com/migrated/venue/86aeded9-….jpg, which now 404s, so the
  // card rendered a broken image. The feed has a working 233KB photo for the
  // same venue. One source of truth also means /clubs no longer renders empty
  // when Supabase is unreachable, which it silently did.
  const allVenues = await getVenues(params.locale);
  const venues = allVenues
    .filter(v => (v as any).type?.slug === 'clubbing')
    .map(v => ({
      ...v,
      is_day_club: !!(v as any).isDayClub,
      type_slug: 'clubbing',
    }))
    .sort((a, b) => {
      // Ushuaïa first, always. It carries the most search demand of any venue
      // we cover — Search Console logs 102 distinct Ushuaïa queries — so
      // alphabetical order buried the one card most visitors arrived looking
      // for. The rest stay alphabetical.
      const rank = (v: { slug?: string }) => (PINNED.indexOf(v.slug || '') + 1) || 99;
      const d = rank(a) - rank(b);
      return d !== 0 ? d : (a.name || '').localeCompare(b.name || '');
    });

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

  const clubEntries = (venues || [])
    .filter((v: any) => v.slug && v.name)
    .map((v: any) => ({ name: v.name, path: `${params.locale}/club-tickets/${v.slug}` }))

  return (
    <>
      <ItemListJsonLd entries={clubEntries} locale={params.locale} name="Ibiza clubs" />
      <ClubsClient venues={venues || []} translations={translations} locale={params.locale} />

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24 pt-8">
        <CrossSellBanner triggerPage="/clubs" fromPrice={500} />
      </section>
    </>
  )
}
