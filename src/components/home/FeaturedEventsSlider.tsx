'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import type { FeaturedEvent } from '@/types/featured-event'
import { CATEGORY_LABELS } from '@/types/featured-event'
import useWindowSize from '@/hooks/useWindowSize'

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
      <div className="group relative flex h-full min-h-[400px] w-full flex-col justify-end overflow-hidden rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 bg-velvet-obsidian">
        <Image
          src={event.image_url || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=85'}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian/90 via-velvet-obsidian/30 to-transparent" />

        <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-sm">
              {CATEGORY_LABELS[event.category]}
            </span>
            {event.badge_text && (
              <span className="rounded-full bg-champagne-bronze px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                {event.badge_text}
              </span>
            )}
          </div>
          {formattedDate && (
            <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-velvet-obsidian bg-white/90 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm w-fit mt-1">
              <Calendar size={12} className="text-rustic-terracotta" />
              {formattedDate}
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col gap-3 p-6 mt-auto">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {event.venue_name && (
              <span className="flex items-center gap-1.5 font-sans text-xs font-semibold text-white/90 bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-sm">
                <MapPin size={12} className="text-champagne-bronze" />
                {event.venue_name}
              </span>
            )}
          </div>
          <h3 className="font-serif text-[24px] font-medium leading-[110%] text-white line-clamp-2 drop-shadow-md">
            {event.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 font-sans text-sm font-bold text-champagne-bronze transition-colors group-hover:text-white bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm group-hover:bg-rustic-terracotta">
            <span>Explore Event</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedEventsSlider({ events }: FeaturedEventsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { width } = useWindowSize()

  if (events.length === 0) return null

  // Determine how many items to show based on screen width
  const itemsToShow = width && width >= 768 ? 2 : 1
  const maxIndex = Math.max(0, events.length - itemsToShow)

  const handleNext = () => {
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : 0)) // Loop back to 0
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : maxIndex)) // Loop to end
  }

  // Calculate widths for slider wrapper
  const percentage = 100 / itemsToShow

  return (
    <section className="overflow-hidden py-12 md:py-20 bg-ibiza-sand" aria-label="Featured events">
      <div className="mx-auto max-w-5xl px-4 md:px-8 mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        
        {/* Header Content */}
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-rustic-terracotta bg-rustic-terracotta/10 px-3 py-1 rounded-full border border-rustic-terracotta/20">
            This Season
          </span>
          <h2 className="mt-4 font-serif text-[32px] md:text-[40px] font-medium text-velvet-obsidian tracking-tight leading-none">
            Featured Events
          </h2>
          <p className="mt-4 text-velvet-obsidian/60 font-sans max-w-sm text-sm">
            Discover the hottest tickets and exclusive parties happening on the island this week.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white border border-velvet-obsidian/10 shadow-sm flex items-center justify-center text-velvet-obsidian hover:bg-rustic-terracotta hover:text-white hover:border-rustic-terracotta transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white border border-velvet-obsidian/10 shadow-sm flex items-center justify-center text-velvet-obsidian hover:bg-rustic-terracotta hover:text-white hover:border-rustic-terracotta transition-all"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Slider Area */}
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * percentage}%`,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 1
            }}
            style={{ width: `${(events.length / itemsToShow) * 100}%` }}
          >
            {events.map((event, i) => (
              <div 
                key={`${event.id}-${i}`} 
                style={{ width: `${100 / events.length}%` }} 
                className="px-2 md:px-3 h-full"
              >
                <EventSlideCard event={event} />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Progress indicators (Dots) */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${currentIndex === idx ? 'w-6 bg-rustic-terracotta' : 'w-2 bg-velvet-obsidian/20 hover:bg-velvet-obsidian/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
