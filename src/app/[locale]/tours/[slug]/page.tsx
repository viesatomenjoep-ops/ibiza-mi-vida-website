import { detailMetadata, staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'activities')
  if (!venue) return staticMetadata(params.locale, 'tours')
  return detailMetadata(params.locale, `tours/${params.slug}`, venue.name, {
    description: (venue as any).cleanDescription || venue.description,
    image: venue.cover || venue.picture,
  })
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { VenueDetailPage } from '@/components/templates/VenueDetailPage'

export const revalidate = 3600

interface Props {
  params: { slug: string; locale: string }
}

export default async function DetailPage({ params }: Props) {
  const venues = await getVenues(params.locale);
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'activities');
  if (!venue) notFound();

  const allDates = await getAllDates(params.locale);
  const venueDates = allDates.filter(d => d.venueSlug === venue.slug);

  return (
    <VenueDetailPage 
      club={venue as any} 
      allDates={venueDates as any} 
      locale={params.locale} 
      basePath="tours" 
    />
  )
}