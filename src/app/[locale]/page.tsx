import React from 'react'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { getDictionary } from '@/lib/dictionary'
import HomePageClient from './HomePageClient'

export const revalidate = 3600

export default async function Home({ params }: { params: { locale: string } }) {
  const dict = getDictionary(params.locale)

  // Fetch top featured clubs from local compiled JSON
  const allVenues = await getVenues(params.locale);
  const featuredClubs = allVenues
    .filter(v => ['hi-ibiza', 'ushuaia-ibiza', 'eden-ibiza', 'es-paradis'].includes(v.slug))
    .map(v => ({
      name: v.name,
      slug: v.slug,
      whitelogo: v.whitelogo,
      cover: v.cover
    }));

  // Fetch upcoming dates from local compiled JSON
  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingDates = allDates
    .filter(d => d.date >= todayStr)
    .slice(0, 10)
    .map(d => ({
      id: d.id,
      name: d.name,
      date: d.date,
      prices: d.prices,
      ct_events: {
        name: d.eventName,
        slug: d.eventSlug,
        logo: d.eventLogo,
        cover: d.eventCover
      },
      ct_venues: {
        name: d.venueName,
        slug: d.venueSlug
      }
    }));

  return (
    <HomePageClient 
      locale={params.locale} 
      translations={dict}
      featuredClubs={featuredClubs}
      upcomingDates={upcomingDates}
      allVenues={allVenues.map(v => ({
        slug: v.slug,
        name: v.name,
        picture: v.picture,
        whitelogo: v.whitelogo,
        typeSlug: (v as any).type?.slug || ''
      }))}
    />
  )
}
