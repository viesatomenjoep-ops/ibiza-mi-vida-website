'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
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
    <Link href={`/events/${event.id}`} aria-label={`View details for ${event.title}`}>
      <div className="group relative flex h-[380px] w-[265px] shrink-0 flex-col justify-end overflow-hidden rounded-2xl md:w-[290px]">
        <Image
          src={event.image_url || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=85'}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="290px"
        />
        <div className="absolute inset-0 card-gradient" />

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

        <div className="relative z-10 flex flex-col gap-1.5 p-4">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {event.venue_name && (
              <span className="flex items-center gap-1 font-sans text-[11px] text-soft-white/60">
                <MapPin size={10} className="text-teal" />
                {event.venue_name}
              </span>
            )}
            {formattedDate && (
              <span className="font-sans text-[11px] text-soft-white/60">
                {formattedDate}
              </span>
            )}
          </div>
          <h3 className="font-serif text-2xl font-light leading-tight text-white line-clamp-2">
            {event.title}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 font-sans text-xs font-medium text-teal transition-colors group-hover:text-white">
            <span>Explore Event</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedEventsSlider({ events }: FeaturedEventsSliderProps) {
  if (events.length === 0) return null

  // Duplicate the array many times to ensure a massive continuous loop
  const duplicatedEvents = [...events, ...events, ...events, ...events, ...events, ...events]

  return (
    <section className="overflow-hidden py-16 md:py-20" aria-label="Featured events">
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-10">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-teal">
          This Season
        </span>
        <h2 className="mt-1.5 font-serif text-4xl font-light text-midnight md:text-5xl">
          Featured Events
        </h2>
      </div>

      <div className="relative flex w-full flex-col justify-center">
        <motion.div
          className="flex w-max gap-4 px-4 md:gap-6 md:px-8"
          animate={{ x: "-50%" }}
          transition={{ 
            duration: events.length * 6, // Very gradual and smooth
            ease: "linear", 
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          {duplicatedEvents.map((event, i) => (
            <motion.div
              key={`${event.id}-${i}`}
              className="shrink-0"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1], 
                delay: (i % events.length) * 0.1 
              }}
            >
              <EventSlideCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
