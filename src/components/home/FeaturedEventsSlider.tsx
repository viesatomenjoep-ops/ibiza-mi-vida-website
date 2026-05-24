'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import type { FeaturedEvent } from '@/types/featured-event'
import { CATEGORY_LABELS } from '@/types/featured-event'

interface FeaturedEventsSliderProps {
  events: FeaturedEvent[]
}

function formatEventDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function EventSlideCard({ event }: { event: FeaturedEvent }) {
  const formattedDate = formatEventDate(event.event_date)

  return (
    <Link href={event.cta_href || `/events/${event.id}`} aria-label={`View details for ${event.title}`} className="block h-full">
      <div className="group relative flex h-[260px] md:h-[300px] w-[160px] md:w-[260px] flex-col justify-end overflow-hidden rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 bg-velvet-obsidian snap-start shrink-0">
        <Image
          src={event.image_url || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=85'}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 160px, 260px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian/95 via-velvet-obsidian/40 to-transparent pointer-events-none" />

        <div className="absolute left-3 top-3 md:left-4 md:top-4 z-10 flex flex-col gap-1.5 md:gap-2">
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            <span className="rounded-full bg-white/20 px-2 py-0.5 md:px-2.5 md:py-1 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-sm">
              {CATEGORY_LABELS[event.category]}
            </span>
            {event.badge_text && (
              <span className="rounded-full bg-champagne-bronze px-2 py-0.5 md:px-2.5 md:py-1 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                {event.badge_text}
              </span>
            )}
          </div>
          {formattedDate && (
            <div className="flex items-center gap-1 md:gap-1.5 font-sans text-[10px] md:text-xs font-bold text-velvet-obsidian bg-white/95 px-2 py-1 md:px-2.5 md:py-1.5 rounded-full backdrop-blur-md shadow-sm w-fit mt-0.5 md:mt-1">
              <Calendar size={10} className="text-rustic-terracotta md:w-3 md:h-3" />
              {formattedDate}
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col gap-1.5 md:gap-2 p-3 md:p-4 mt-auto">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {event.venue_name && (
              <span className="flex items-center gap-1 font-sans text-[9px] md:text-[11px] font-semibold text-white/90 bg-white/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md backdrop-blur-sm">
                <MapPin size={9} className="text-champagne-bronze md:w-2.5 md:h-2.5" />
                {event.venue_name}
              </span>
            )}
          </div>
          <h3 className="font-serif text-[16px] md:text-[20px] font-medium leading-[110%] text-white line-clamp-2 drop-shadow-md">
            {event.title}
          </h3>
          <div className="mt-1 md:mt-2 flex items-center gap-1.5 md:gap-2 font-sans text-[10px] md:text-xs font-bold text-champagne-bronze transition-colors group-hover:text-white bg-white/10 w-fit px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl backdrop-blur-sm group-hover:bg-rustic-terracotta">
            <span>Explore Event</span>
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1 md:w-3.5 md:h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedEventsSlider({ events }: FeaturedEventsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (events.length === 0) return null

  // Sort events so that upcoming events (>= today) are at the front, followed by past events
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.event_date ? new Date(a.event_date) : new Date(0)
    const dateB = b.event_date ? new Date(b.event_date) : new Date(0)
    const isFutureA = dateA >= today
    const isFutureB = dateB >= today
    
    if (isFutureA && !isFutureB) return -1
    if (!isFutureA && isFutureB) return 1
    if (isFutureA && isFutureB) return dateA.getTime() - dateB.getTime() // Soonest first
    return dateB.getTime() - dateA.getTime() // Most recent past event first
  })

  // All events are shown, no slicing
  const displayEvents = sortedEvents

  const handleNext = () => {
    if (scrollRef.current) {
      // Card width (160 or 240) + gap (16 or 20). Just scroll approx 1 card width and let snap handle the rest.
      const scrollAmount = window.innerWidth < 768 ? 176 : 260
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? -176 : -260
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="overflow-hidden py-12 md:py-20 bg-ibiza-sand" aria-label="Featured events">
      <div className="mx-auto max-w-6xl px-4 md:px-8 mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        
        {/* Header Content */}
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-rustic-terracotta bg-rustic-terracotta/10 px-3 py-1 rounded-full border border-rustic-terracotta/20">
            This Season
          </span>
          <h2 className="mt-4 font-serif text-[28px] md:text-[36px] font-medium text-velvet-obsidian tracking-tight leading-none">
            Featured Events
          </h2>
          <p className="mt-3 text-velvet-obsidian/60 font-sans max-w-sm text-sm">
            Discover the hottest tickets and exclusive parties happening on the island this week.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white border border-velvet-obsidian/10 shadow-sm flex items-center justify-center text-velvet-obsidian hover:bg-rustic-terracotta hover:text-white hover:border-rustic-terracotta transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white border border-velvet-obsidian/10 shadow-sm flex items-center justify-center text-velvet-obsidian hover:bg-rustic-terracotta hover:text-white hover:border-rustic-terracotta transition-all"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Area */}
      <div className="w-full relative mx-auto max-w-6xl">
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            margin: 0 32px; /* Matches md:px-8 */
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(148, 73, 51, 0.5); /* rustic-terracotta semi-transparent */
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 73, 51, 1);
          }
        `}} />
        
        <div 
          ref={scrollRef}
          className="custom-scrollbar flex gap-4 md:gap-5 px-4 md:px-8 overflow-x-auto snap-x snap-mandatory py-4 pb-8 w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {displayEvents.map((event, i) => (
            <EventSlideCard key={`${event.id}-${i}`} event={event} />
          ))}
          {/* Spacer to allow the last item to scroll into center if needed */}
          <div className="shrink-0 w-4 md:w-8" />
        </div>
      </div>
    </section>
  )
}
