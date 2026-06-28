import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtist, getArtistDates, getArtists } from '@/lib/clubtickets'
import ArtistClient from '@/components/nightlife/ArtistClient'

export const revalidate = 3600

interface Props {
  params: { slug: string; locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtist(params.slug, params.locale)
  if (!artist) return { title: 'Artist Not Found | Ibiza mi Vida' }

  return {
    title: `${artist.name} in Ibiza 2026 | Tickets & Lineup`,
    description: `Bekijk waar ${artist.name} dit seizoen op Ibiza draait. Speeldata, eigen verhaal en tickets, live uit ClubTickets.`,
    openGraph: {
      title: `${artist.name} Ibiza 2026 | Ibiza mi vida`,
      description: `Koop officiële tickets voor ${artist.name} op Ibiza.`,
      images: artist.image ? [{ url: artist.image, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function ArtistDetailPage({ params }: Props) {
  const artist = await getArtist(params.slug, params.locale)
  if (!artist) notFound()

  // Get artist's upcoming dates
  const dates = await getArtistDates(artist.name, params.locale)
  dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get similar artists (random for now, or based on venue)
  const allArtists = await getArtists(params.locale)
  const similarArtists = allArtists
    .filter(a => a.id !== artist.id && a.venueSlug === artist.venueSlug)
    .slice(0, 10)

  const translations = {
    dates: 'Speeldata',
    story: 'Eigen verhaal',
    noDates: 'Geen speeldata gevonden voor deze artiest.',
    buyTickets: 'Koop tickets',
    from: 'Vanaf',
    biographyTitle: 'Het verhaal achter de beats',
    biographyIntro: `Ervaar de unieke sound van ${artist.name} op Ibiza.`,
    biographyContent: `Bekend om hun energieke sets en onvergetelijke momenten op de dansvloer. Mis het niet wanneer ze dit seizoen Ibiza overnemen!`,
    similarArtistsTitle: 'Zelfde vibe'
  }

  return (
    <ArtistClient 
      artist={artist} 
      dates={dates} 
      similarArtists={similarArtists}
      translations={translations}
    />
  )
}
