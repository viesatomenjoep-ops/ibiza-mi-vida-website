'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CTVenue, CTEventDate } from '@/lib/clubtickets'
import { CalendarGrid } from './CalendarGrid'

interface Props {
  venues: CTVenue[]
  allDates: CTEventDate[]
  locale: string
}

const CATEGORIES = [
  { id: 'clubbing', name: 'Ibiza party calendar', typeId: 1, bgColor: 'bg-[var(--color-sea)] text-[var(--color-paper)]', inactiveColor: 'bg-[var(--color-card)] text-[var(--color-ink)] hover:bg-[var(--color-line)]', themeClass: 'theme-monaco-vip' },
  { id: 'boat', name: 'Ibiza boat calendar', typeId: 2, bgColor: 'bg-[var(--color-sea)] text-[var(--color-paper)]', inactiveColor: 'bg-[var(--color-card)] text-[var(--color-ink)] hover:bg-[var(--color-line)]', themeClass: 'theme-monaco-water' },
  { id: 'activities', name: 'Ibiza activities calendar', typeId: 3, bgColor: 'bg-[var(--color-sea)] text-[var(--color-paper)]', inactiveColor: 'bg-[var(--color-card)] text-[var(--color-ink)] hover:bg-[var(--color-line)]', themeClass: 'theme-monaco-sand' },
]

export default function IbizaCalendarClient({ venues, allDates, locale }: Props) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  
  // 1. Filter dates by category
  // A venue has a `type.id`. A date belongs to a venue.
  // We need a quick lookup to know a date's venue type.
  const venueTypeMap = useMemo(() => {
    const map = new Map<number, number>()
    venues.forEach(v => map.set(v.id, v.type.id))
    return map
  }, [venues])

  const categoryDates = useMemo(() => {
    return allDates.filter(d => {
      // Find the venue ID for this date
      const venueId = d.venueId
      if (!venueId) return false
      const typeId = venueTypeMap.get(venueId)
      // Clubbing typeId is 1, Boat is 2, etc. If category is 'clubbing', match typeId 1.
      return typeId === activeCategory.typeId
    })
  }, [allDates, activeCategory, venueTypeMap])

  // 2. Extract available Months from the filtered dates
  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    categoryDates.forEach(d => {
      const dateObj = new Date(d.date)
      // Format: "Jun 26"
      const monthYear = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' })
      months.add(monthYear)
    })
    // Sort chronologically
    return Array.from(months).sort((a, b) => {
      const dateA = new Date(`1 ${a}`)
      const dateB = new Date(`1 ${b}`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [categoryDates])

  const [activeMonth, setActiveMonth] = useState(availableMonths[0] || '')

  // 3. Extract available Weeks for the active month
  const availableWeeks = useMemo(() => {
    if (!activeMonth) return []
    const weeks = new Map<string, Date[]>()
    
    categoryDates.forEach(d => {
      const dateObj = new Date(d.date)
      const monthYear = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' })
      if (monthYear === activeMonth) {
        // Calculate start of week (Monday)
        const day = dateObj.getUTCDay()
        const diff = dateObj.getUTCDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
        const startOfWeek = new Date(dateObj.setUTCDate(diff))
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6)
        
        const weekLabel = `${startOfWeek.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })} – ${endOfWeek.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}`
        
        if (!weeks.has(weekLabel)) {
          // Generate array of 7 days
          const days = []
          for (let i = 0; i < 7; i++) {
            const current = new Date(startOfWeek)
            current.setUTCDate(startOfWeek.getUTCDate() + i)
            days.push(current)
          }
          weeks.set(weekLabel, days)
        }
      }
    })
    
    return Array.from(weeks.entries()).map(([label, days]) => ({ label, days }))
  }, [categoryDates, activeMonth])

  // Select the first week by default when month changes
  const [activeWeekIndex, setActiveWeekIndex] = useState(0)
  
  // Reset week index when month changes
  React.useEffect(() => {
    setActiveWeekIndex(0)
  }, [activeMonth])

  const activeWeek = availableWeeks[activeWeekIndex]

  // 4. Get events for the active week
  const weekEvents = useMemo(() => {
    if (!activeWeek) return []
    const start = activeWeek.days[0].getTime()
    const end = activeWeek.days[6].getTime() + (24 * 60 * 60 * 1000) // End of Sunday
    
    return categoryDates.filter(d => {
      const t = new Date(d.date).getTime()
      return t >= start && t < end
    })
  }, [categoryDates, activeWeek])

  // 5. Group by Venue for the Grid
  const venuesInWeek = useMemo(() => {
    const venueIds = new Set(weekEvents.map(e => e.venueId))
    return venues.filter(v => venueIds.has(v.id))
  }, [weekEvents, venues])

  return (
    <div className={`flex flex-col items-center w-full ${activeCategory.themeClass} min-h-screen bg-[var(--color-paper)] p-4 md:p-8 rounded-[32px] transition-colors duration-500`}>
      
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 bg-[var(--color-card)] p-4 md:p-6 rounded-3xl w-full max-w-4xl shadow-lg border border-[var(--color-line)]">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory.id === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat); setActiveMonth('') }}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${isActive ? cat.bgColor + ' shadow-md scale-105' : cat.inactiveColor}`}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Month Pills */}
      {availableMonths.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {availableMonths.map(month => {
            const isActive = activeMonth === month
              // Use theme colors
              const baseClass = "px-6 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer shadow-sm border border-[var(--color-line)]"
              const activeClass = "bg-[var(--color-sea)] text-[var(--color-paper)]"
              const inactiveClass = "bg-[var(--color-card)] text-[var(--color-ink)] hover:brightness-95"
            
            return (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                {month}
              </button>
            )
          })}
        </div>
      )}

      {/* Week Pills */}
      {availableWeeks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {availableWeeks.map((week, idx) => {
            const isActive = activeWeekIndex === idx
            const baseClass = "px-6 py-3 rounded-full font-bold text-sm transition-all cursor-pointer shadow-sm border border-[var(--color-line)]"
            const activeClass = "bg-[var(--color-sea)] text-[var(--color-paper)]"
            const inactiveClass = "bg-[var(--color-card)] text-[var(--color-ink)] hover:brightness-95"
            
            return (
              <button
                key={week.label}
                onClick={() => setActiveWeekIndex(idx)}
                className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                {week.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Calendar Grid */}
      {activeWeek && (
        <CalendarGrid 
          days={activeWeek.days} 
          venues={venuesInWeek} 
          events={weekEvents} 
          locale={locale} 
        />
      )}

    </div>
  )
}
