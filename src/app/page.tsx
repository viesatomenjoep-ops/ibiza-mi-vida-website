import React from 'react'
import HomePageClient from './HomePageClient'
import { getAllDates } from '@/lib/clubtickets'

export const revalidate = 3600

export default async function Home() {
  const allEventDates = await getAllDates()
  
  return (
    <HomePageClient allEventDates={allEventDates} />
  )
}
