'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Calendar } from 'lucide-react'
import type { FeaturedEvent } from '@/types/featured-event'
import { CATEGORY_LABELS } from '@/types/featured-event'

interface FeaturedEventsSliderProps {
  events: FeaturedEvent[]
}

function formatEventDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function EventSlideCard({ event }: { event: FeaturedEvent }) {
  const formattedDate = formatEventDate(event.event_date)

  return (
    <Link href={`/events/${event.id}`} aria-label={`View details for ${event.title}`}>
      <div className="group relative flex h-[400px] w-[280px] shrink-0 flex-col justify-end overflow-hidden rounded-[2rem] md:w-[320px] shadow-lg border border-black/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-velvet-obsidian">
        <Image
          src={event.image_url || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=85'}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 280px, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian/90 via-velvet-obsidian/40 to-transparent" />

        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-sm">
              {CATEGORY_LABELS[event.category]}
            </span>
            {event.badge_text && (
              <span className="rounded-full bg-gold px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-velvet-obsidian shadow-sm">
                {event.badge_text}
              </span>
            )}
          </div>
          {formattedDate && (
            <div className="flex items-center gap-1.5 font-sans text-sm font-bold text-white bg-velvet-obsidian/80 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg w-fit">
              <Calendar size={14} className="text-gold" />
              {formattedDate}
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col gap-2 p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {event.venue_name && (
              <span className="flex items-center gap-1.5 font-sans text-xs font-semibold text-white/80 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                <MapPin size={12} className="text-gold" />
                {event.venue_name}
              </span>
            )}
          </div>
          <h3 className="mt-1 font-serif text-3xl font-medium leading-tight text-white line-clamp-2 drop-shadow-md">
            {event.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 font-sans text-sm font-bold text-gold transition-colors group-hover:text-white bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 group-hover:bg-gold group-hover:text-velvet-obsidian group-hover:border-gold">
            <span>Explore Event</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedEventsSlider({ events }: FeaturedEventsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (events.length === 0) return
    const el = scrollRef.current
    if (!el) return

    let animationFrameId: number
    let lastTime = performance.now()
    const speed = 0.03 // pixels per millisecond (slower)

    const scroll = (time: number) => {
      const delta = time - lastTime
      lastTime = time

      if (!isPaused) {
        el.scrollLeft += speed * delta
        
        // Loop back seamlessly if we reach the end of the first original set
        // A single card is roughly 320px + gap.
        // If we duplicate the array, we can reset scrollLeft when it reaches half.
        const maxScroll = el.scrollWidth / 2
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft = 0
        }
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPaused, events.length])

  if (events.length === 0) return null

  // Duplicate to allow infinite scrolling effect manually and automatically
  const displayEvents = [...events, ...events, ...events, ...events, ...events, ...events, ...events]

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  // Mouse drag to scroll logic
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPos, setScrollLeftPos] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setIsPaused(true)
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft)
      setScrollLeftPos(scrollRef.current.scrollLeft)
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft
      const walk = (x - startX) * 2 // Scroll-fast
      scrollRef.current.scrollLeft = scrollLeftPos - walk
    }
  }

  return (
    <section className="overflow-hidden py-16 md:py-24 bg-ibiza-sand" aria-label="Featured events">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 mb-8 flex flex-col items-center justify-center text-center gap-4">
        <div>
          <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-widest text-rustic-terracotta bg-rustic-terracotta/10 px-3 py-1 rounded-full border border-rustic-terracotta/20">
            This Season
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-velvet-obsidian tracking-tight">
            Featured Events
          </h2>
        </div>
        
        <p className="text-velvet-obsidian/60 font-sans max-w-sm text-sm md:text-base font-medium">
          Discover the hottest tickets and exclusive parties happening on the island this week.
        </p>

        {/* Navigation Arrows Centered Just Above Cards */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-velvet-obsidian hover:bg-gold hover:text-white transition-all transform hover:scale-105 active:scale-95"
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={scrollRight}
            className="w-12 h-12 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-velvet-obsidian hover:bg-gold hover:text-white transition-all transform hover:scale-105 active:scale-95"
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="relative w-full">
        {/* Left/Right fading edges for desktop */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ibiza-sand to-transparent z-10 pointer-events-none" />
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ibiza-sand to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className={`flex gap-4 md:gap-6 px-4 md:px-[10vw] overflow-x-auto snap-x snap-mandatory py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x scroll-smooth ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {displayEvents.map((event, i) => (
            <div key={`${event.id}-${i}`} className="shrink-0 snap-center first:ml-4 last:mr-4">
              <EventSlideCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
