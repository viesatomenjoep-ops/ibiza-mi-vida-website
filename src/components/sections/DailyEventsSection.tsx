import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getVenues, getEvent } from '@/lib/clubtickets'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export async function DailyEventsSection() {
  try {
    const venues = await getVenues('en')
    
    // Top clubs that host 90% of the bookable parties
    const topSlugs = ['hi-ibiza', 'ushuaia-ibiza', 'amnesia-ibiza', 'pacha-ibiza', 'eden-ibiza', 'unvrs-ibiza']
    const topVenues = venues.filter(v => topSlugs.includes(v.slug))
    
    // Collect promises to fetch all events for these top clubs
    const eventPromises = []
    for (const venue of topVenues) {
      if (!venue.events) continue
      for (const eventRef of venue.events) {
        eventPromises.push(
          getEvent(venue.id, eventRef.id, 'en').then(fullEvent => {
            if (!fullEvent) return null
            return {
              ...fullEvent,
              venueName: venue.name,
              venueSlug: venue.slug
            }
          })
        )
      }
    }
    
    const fullEvents = await Promise.all(eventPromises)
    
    // Extract dates and flatten
    const allDates = fullEvents.flatMap(e => 
      e?.dates ? e.dates.map(d => ({
        ...d,
        eventName: e.name,
        eventSlug: e.slug,
        venueName: e.venueName,
        venueSlug: e.venueSlug,
        image: e.logo || e.cover || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920'
      })) : []
    )
    
    // Sort chronologically (earliest first)
    // Only include dates in the future (or very recent)
    const now = new Date().getTime() - (24 * 60 * 60 * 1000) // Allow yesterday just in case of timezone diffs
    const validDates = allDates.filter(d => new Date(d.date).getTime() > now)
    validDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    const upcomingDates = validDates.slice(0, 15) // take top 15 upcoming events
    
    if (upcomingDates.length === 0) return null

    return (
      <section className="section bg-ibiza-sand py-16 md:py-24" id="daily-events">
        <div className="container">
          <div className="section__header text-center mb-12">
            <p className="text-rustic-terracotta font-sans text-sm font-bold uppercase tracking-widest mb-3">Live Lineup</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-velvet-obsidian mb-4">Upcoming Daily Events</h2>
            <p className="font-sans text-velvet-obsidian/60 max-w-2xl mx-auto">
              Don't miss out! Secure your tickets for the hottest parties happening in Ibiza over the next few days.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 max-w-5xl mx-auto">
            {upcomingDates.map((dateObj, idx) => (
              <AnimatedSection 
                key={`${dateObj.id}-${idx}`} 
                delay={idx * 50}
                className="group flex flex-col md:flex-row bg-white rounded-2xl p-4 md:p-6 border border-black/5 hover:border-black/10 hover:shadow-xl transition-all items-start md:items-center gap-6"
              >
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center bg-ibiza-sand/50 rounded-xl p-4 min-w-[100px] shrink-0 border border-black/5">
                  <span className="font-sans text-xs font-bold uppercase text-rustic-terracotta tracking-wider mb-1">
                    {new Date(dateObj.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="font-serif text-3xl font-bold text-velvet-obsidian leading-none">
                    {new Date(dateObj.date).getDate()}
                  </span>
                  <span className="font-sans text-xs font-bold uppercase text-velvet-obsidian/60 mt-1">
                    {new Date(dateObj.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-velvet-obsidian text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                      {dateObj.venueName}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-velvet-obsidian group-hover:text-rustic-terracotta transition-colors">
                    {dateObj.eventName}
                  </h3>
                </div>
                
                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-black/5">
                  <div className="flex flex-col text-center md:text-right">
                    <span className="text-[11px] font-bold text-velvet-obsidian/50 uppercase tracking-widest">Starting at</span>
                    <span className="font-serif text-2xl font-bold text-velvet-obsidian">{dateObj.prices || 'Avail'}</span>
                  </div>
                  <a 
                    href={dateObj.affLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-rustic-terracotta text-white px-8 py-3 rounded-xl font-bold font-sans text-sm text-center transition-transform hover:scale-105 shadow-lg shadow-rustic-terracotta/20"
                  >
                    Buy Tickets
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Link href="/club-tickets" className="inline-flex items-center gap-2 font-sans font-bold text-velvet-obsidian hover:text-rustic-terracotta transition-colors border-b-2 border-velvet-obsidian hover:border-rustic-terracotta pb-1">
              View full calendar
            </Link>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error rendering DailyEventsSection:', error)
    return null
  }
}
