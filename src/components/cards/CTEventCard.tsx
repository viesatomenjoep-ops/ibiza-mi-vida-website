'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ExternalLink } from 'lucide-react'
import type { CTVenueEvent } from '@/lib/clubtickets'
import { cleanHtml } from '@/lib/html-utils'

interface CTEventCardProps {
  event: CTVenueEvent
  venueSlug: string
  basePath?: string
}

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 50;
}

function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

export function CTEventCard({ event, venueSlug, basePath = 'club-tickets' }: CTEventCardProps) {
  const imageUrl = event.cover || event.logo || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80'
  const startDate = formatDate(event.startAt)

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-velvet-obsidian/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:w-32">
        <Image
          src={imageUrl}
          alt={event.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 128px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-center gap-2">
        <h3 className="font-serif text-xl font-bold text-neutral-900 leading-tight">{event.name}</h3>

        {startDate && (
          <div className="flex items-center gap-1.5 font-sans text-sm text-neutral-500" suppressHydrationWarning>
            <Calendar size={14} className="text-rustic-terracotta" />
            Season Start: {startDate}
          </div>
        )}
        
        {event.description && (
          <div className="text-sm text-gray-500 line-clamp-2 prose prose-sm max-w-none prose-p:my-0 prose-p:leading-snug" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: cleanHtml(event.description) }}></div>
        )}
      </div>

      {/* CTA */}
      <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:justify-center">
        <Link
          href={`/${basePath}/${venueSlug}/${event.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-black px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          View Dates & Tickets
        </Link>
      </div>
    </article>
  )
}
