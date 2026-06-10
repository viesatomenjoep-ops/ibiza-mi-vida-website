import React from 'react'
import HomePageClient from './HomePageClient'
import { ClubTicketsSlider } from '@/components/sections/ClubTicketsSlider'
import { DailyEventsSection } from '@/components/sections/DailyEventsSection'

export const revalidate = 3600

export default function Home() {
  return (
    <HomePageClient 
      clubTicketsSlider={<ClubTicketsSlider />} 
      dailyEventsSection={<DailyEventsSection />}
    />
  )
}
