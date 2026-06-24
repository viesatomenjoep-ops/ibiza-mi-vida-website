import React from 'react'
import HomePageClient from './HomePageClient'
import { getAllDates, getArtists } from '@/lib/clubtickets'
import { getDictionary } from '@/lib/dictionary'

export const revalidate = 3600

export default async function Home({ params }: { params: { locale: string } }) {
  const allEventDates = await getAllDates(params.locale);
  const artists = await getArtists(params.locale);
  const dict = await getDictionary(params.locale);
  
  return (
    <HomePageClient allEventDates={allEventDates} artists={artists} dict={dict} locale={params.locale} />
  )
}
