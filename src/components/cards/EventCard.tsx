'use client'

import Image from 'next/image'
import { Calendar, Clock, Users, ExternalLink } from 'lucide-react'
import { useBooking } from '@/context/booking-context'
import type { ClubEvent } from '@/types/club'

interface EventCardProps {
  event: ClubEvent
  clubName: string
  clubSlug: string
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(time: string | null): string | null {
  if (!time) return null
  const [h, m] = time.split(':')
  return `${h}:${m}`
}

export function EventCard({ event, clubName, clubSlug }: EventCardProps) {
  const { openModal } = useBooking()
  const imageUrl = event.image_url ?? 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80'
  const isPromoterLink = event.booking_type === 'promoter_link'
  const doorsOpen = formatTime(event.doors_open)

  const handleWhatsAppBook = () => {
    openModal({
      serviceType: 'club-tickets',
      serviceName: event.title,
      clubName,
      sourcePage: `/club-tickets/${clubSlug}`,
      arrivalDate: event.event_date,
    })
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-midnight/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:w-32">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 128px"
        />
        {event.sold_out && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-midnight/70">
            <span className="rounded-full bg-red-500 px-3 py-1 font-sans text-xs font-bold text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-serif text-xl font-light text-midnight leading-tight">{event.title}</h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 font-sans text-xs text-midnight/50">
            <Calendar size={12} className="text-teal" />
            {formatDate(event.event_date)}
          </span>
          {doorsOpen && (
            <span className="flex items-center gap-1.5 font-sans text-xs text-midnight/50">
              <Clock size={12} className="text-teal" />
              Doors {doorsOpen}
            </span>
          )}
        </div>

        {/* Lineup */}
        {event.lineup && event.lineup.length > 0 && (
          <p className="font-sans text-sm text-midnight/70">
            {event.lineup.slice(0, 3).join(' · ')}
            {event.lineup.length > 3 && ` + ${event.lineup.length - 3} more`}
          </p>
        )}

        {/* Genre tags */}
        {event.genre_tags && event.genre_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.genre_tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-driftwood/40 px-2.5 py-0.5 font-sans text-[11px] text-driftwood"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
        {event.price_from !== null && (
          <div className="text-right">
            <p className="font-sans text-[10px] uppercase tracking-wide text-midnight/40">From</p>
            <p className="font-serif text-2xl font-light text-midnight">
              €{event.price_from.toFixed(0)}
            </p>
          </div>
        )}

        {isPromoterLink ? (
          <a
            href={event.promoter_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-midnight px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-midnight/80 disabled:opacity-50"
            aria-label={`Get tickets for ${event.title} — opens official ticketing site`}
          >
            Get Tickets
            <ExternalLink size={13} />
          </a>
        ) : (
          <button
            onClick={handleWhatsAppBook}
            disabled={event.sold_out}
            className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Book tickets for ${event.title} via WhatsApp`}
          >
            Book via WhatsApp
          </button>
        )}
      </div>
    </article>
  )
}
