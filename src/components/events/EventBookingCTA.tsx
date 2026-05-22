'use client'

import { ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useBooking } from '@/context/booking-context'
import type { FeaturedEvent } from '@/types/featured-event'
import { CATEGORY_LABELS } from '@/types/featured-event'

interface EventBookingCTAProps {
  event: FeaturedEvent
}

export function EventBookingCTA({ event }: EventBookingCTAProps) {
  const { openModal } = useBooking()

  const handleWhatsApp = () => {
    openModal({
      serviceType: event.category,
      serviceName: event.title,
      clubName: event.venue_name ?? undefined,
      arrivalDate: event.event_date ?? undefined,
      sourcePage: `/events/${event.id}`,
    })
  }

  /* External promoter link */
  if (event.booking_type === 'external_link' && event.external_url) {
    return (
      <div className="flex flex-col gap-3">
        <a
          href={event.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors hover:bg-teal-dark"
        >
          {event.cta_label}
          <ExternalLink size={15} />
        </a>
        <button
          onClick={handleWhatsApp}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-midnight/20 px-6 py-3 font-sans text-sm font-medium text-midnight transition-colors hover:border-midnight hover:bg-midnight hover:text-soft-white"
        >
          <MessageCircle size={15} />
          Ask us on WhatsApp
        </button>
      </div>
    )
  }

  /* Internal category link — on the detail page the primary action is WhatsApp */
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleWhatsApp}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors hover:bg-teal-dark"
      >
        <MessageCircle size={15} />
        {event.cta_label}
      </button>

      {event.cta_href && (
        <Link
          href={event.cta_href}
          className="flex w-full items-center justify-center rounded-full border border-midnight/20 px-6 py-3 font-sans text-sm font-medium text-midnight transition-colors hover:border-midnight hover:bg-midnight hover:text-soft-white"
        >
          Browse all {CATEGORY_LABELS[event.category]}s
        </Link>
      )}
    </div>
  )
}
