import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getVenues, getEvent } from '@/lib/clubtickets'
import { ArrowRight } from 'lucide-react'

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
              venueSlug: venue.slug,
              venueLogo: venue.whitelogo,
              venueCover: venue.cover || venue.picture
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
        venueLogo: e.venueLogo,
        image: e.venueCover || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920'
      })) : []
    )
    
    // Sort chronologically (earliest first)
    const now = new Date().getTime() - (24 * 60 * 60 * 1000) 
    let validDates = allDates.filter(d => new Date(d.date).getTime() > now)
    
    if (validDates.length === 0 && allDates.length > 0) {
      validDates = allDates
    }
    
    validDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const upcomingDates = validDates.slice(0, 15) // take top 15 upcoming events
    
    if (upcomingDates.length === 0) return null

    return (
      <section className="py-16 md:py-24 bg-ibiza-sand w-full overflow-hidden" id="daily-events">
        <div className="container mx-auto px-[5%] mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-rustic-terracotta font-semibold tracking-widest uppercase mb-3 text-sm">Live Lineup</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-velvet-obsidian transition-all duration-500">Upcoming Daily Events</h2>
            </div>
            <Link href="/club-tickets" className="inline-flex items-center gap-2 text-velvet-obsidian font-bold hover:text-rustic-terracotta transition-colors group">
              View full calendar
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="w-full pb-8">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 px-4 md:px-[5%] pb-12 pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style dangerouslySetInnerHTML={{ __html: `
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
            
            {upcomingDates.map((dateObj, idx) => {
              const eventDate = new Date(dateObj.date)
              return (
                <Link 
                  key={`${dateObj.id}-${idx}`} 
                  href={dateObj.affLink || `/club-tickets/${dateObj.venueSlug}/${dateObj.eventSlug}`}
                  target={dateObj.affLink ? "_blank" : undefined}
                  rel={dateObj.affLink ? "noopener noreferrer" : undefined}
                  className="group relative flex flex-col justify-end snap-center shrink-0 w-[calc(100vw-2rem)] sm:w-[350px] md:w-[400px] h-[500px] md:h-[560px] rounded-3xl overflow-hidden bg-black shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-black/10"
                >
                  <Image 
                    src={dateObj.image} 
                    alt={dateObj.eventName}
                    fill
                    className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 768px) 85vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-5 right-5 bg-white backdrop-blur-md px-4 py-2 rounded-xl text-center flex flex-col items-center justify-center border border-black/10 shadow-lg">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rustic-terracotta leading-none mb-1">
                      {eventDate.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-xl md:text-2xl font-black text-velvet-obsidian leading-none">
                      {eventDate.getDate()}
                    </span>
                  </div>
                  
                  {/* Club Logo */}
                  {dateObj.venueLogo && (
                    <div className="absolute top-5 left-5 w-14 h-14 md:w-16 md:h-16 opacity-90 drop-shadow-xl">
                      <Image src={dateObj.venueLogo} alt={dateObj.venueName} fill className="object-contain" />
                    </div>
                  )}

                  <div className="relative z-10 p-6 md:p-8 flex flex-col w-full mt-auto">
                    <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md mb-2 leading-tight group-hover:text-rustic-terracotta transition-colors">{dateObj.eventName}</h3>
                    <p className="text-white/80 text-sm md:text-base mb-6 font-sans font-medium uppercase tracking-widest">
                      @ {dateObj.venueName}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-white/20 pt-5">
                      <span className="text-sm md:text-base font-bold text-white uppercase tracking-widest">
                        {dateObj.prices || 'Tickets Available'}
                      </span>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rustic-terracotta flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rustic-terracotta/20">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
            
            {/* Spacer */}
            <div className="snap-start shrink-0 w-4 md:w-8"></div>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error rendering DailyEventsSection:', error)
    return null
  }
}
