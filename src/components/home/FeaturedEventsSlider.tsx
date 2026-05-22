'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react'
import type { FeaturedEvent } from '@/types/featured-event'
import { CATEGORY_LABELS } from '@/types/featured-event'

const AUTO_SCROLL_MS = 4000

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
    <Link href={`/events/${event.id}`} aria-label={`View details for ${event.title}`}>
      {/* Card: slightly smaller than before — 240/265/290px × 380px */}
      <div className="group relative flex h-[380px] w-[240px] shrink-0 flex-col justify-end overflow-hidden rounded-2xl sm:w-[265px] md:w-[290px]">
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="290px"
        />
        <div className="absolute inset-0 card-gradient" />

        {/* Category + badge */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
          <span className="rounded-full bg-midnight/60 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-soft-white backdrop-blur-sm">
            {CATEGORY_LABELS[event.category]}
          </span>
          {event.badge_text && (
            <span className="rounded-full bg-teal px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-white">
              {event.badge_text}
            </span>
          )}
        </div>

        {/* Bottom content */}
        <div className="relative z-10 flex flex-col gap-1.5 p-4">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {event.venue_name && (
              <span className="flex items-center gap-1 font-sans text-[11px] text-soft-white/60">
                <MapPin size={10} className="text-teal" />
                {event.venue_name}
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1 font-sans text-[11px] text-soft-white/60">
                <Calendar size={10} className="text-teal" />
                {formattedDate}
              </span>
            )}
          </div>

          <h3 className="font-serif text-xl font-light leading-snug text-soft-white">
            {event.title}
          </h3>

          {event.subtitle && (
            <p className="line-clamp-1 font-sans text-[11px] leading-relaxed text-soft-white/60">
              {event.subtitle}
            </p>
          )}

          <div className="mt-1 flex items-center justify-between gap-2">
            {event.price_from !== null ? (
              <div>
                <span className="font-sans text-[9px] uppercase tracking-wide text-soft-white/40">
                  From
                </span>
                <p className="font-serif text-xl font-light leading-none text-soft-white">
                  €{event.price_from.toFixed(0)}
                </p>
              </div>
            ) : (
              <div />
            )}

            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal px-3 py-2 font-sans text-xs font-semibold text-white transition-all duration-200 group-hover:gap-1.5 group-hover:bg-teal-dark">
              View
              <ArrowRight
                size={12}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedEventsSlider({ events }: FeaturedEventsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  /* ── Sync arrow visibility with scroll position ── */
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  /* ── Auto-advance one card width every AUTO_SCROLL_MS ── */
  const advance = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      const firstChild = el.firstElementChild as HTMLElement | null
      const cardWidth = firstChild?.offsetWidth ?? 290
      el.scrollBy({ left: cardWidth + 16, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    intervalRef.current = setInterval(advance, AUTO_SCROLL_MS)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPaused, advance])

  /* ── Manual navigation ── */
  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const firstChild = el.firstElementChild as HTMLElement | null
    const cardWidth = firstChild?.offsetWidth ?? 290
    el.scrollBy({
      left: direction === 'left' ? -(cardWidth + 16) : cardWidth + 16,
      behavior: 'smooth',
    })
  }

  if (events.length === 0) return null

  return (
    <section
      className="py-12 md:py-16"
      aria-label="Featured events"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header row */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-teal">
              This Season
            </span>
            <h2 className="mt-1.5 font-serif text-4xl font-light text-midnight md:text-5xl">
              Featured Events
            </h2>
          </div>

          <div className="flex shrink-0 gap-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollByCard('left')}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-midnight/20 text-midnight transition-colors hover:border-midnight hover:bg-midnight hover:text-soft-white disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollByCard('right')}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-midnight/20 text-midnight transition-colors hover:border-midnight hover:bg-midnight hover:text-soft-white disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* Scroll container — centered within max-w-7xl */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          aria-label="Scrollable events list"
        >
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <EventSlideCard event={event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
