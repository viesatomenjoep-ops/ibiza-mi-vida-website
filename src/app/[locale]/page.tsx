import React from 'react'
import HomePageClient from './HomePageClient'
import { getAllDates, getArtists } from '@/lib/clubtickets'

export const revalidate = 3600

import enDict from '../../../src/dictionaries/en.json'
import nlDict from '../../../src/dictionaries/nl.json'
import deDict from '../../../src/dictionaries/de.json'
import frDict from '../../../src/dictionaries/fr.json'
import esDict from '../../../src/dictionaries/es.json'

function getDictionary(locale: string) {
  switch (locale) {
    case 'en': return enDict;
    case 'de': return deDict;
    case 'fr': return frDict;
    case 'es': return esDict;
    case 'nl':
    default: return nlDict;
  }
}

export default async function Home({ params }: { params: { locale: string } }) {
  const allEventDates = await getAllDates(params.locale);
  const artists = await getArtists(params.locale);
  const dict = await getDictionary(params.locale);
  
  return (
    <HomePageClient allEventDates={allEventDates} artists={artists} dict={dict} locale={params.locale} />
  )
}
