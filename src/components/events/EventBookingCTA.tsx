'use client'

import { ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/cart-context'
import type { FeaturedEvent } from '@/types/featured-event'
import { CATEGORY_LABELS } from '@/types/featured-event'

interface EventBookingCTAProps {
  event: FeaturedEvent
}

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 50;
}

export function EventBookingCTA({ event }: EventBookingCTAProps) {
  const { addToCart, openDrawer } = useCart()

  const handleAddToCart = () => {
    addToCart({
      serviceId: `event-${event.id}`,
      title: event.title,
      price: event.price_from || 0,
      image: event.image_url ?? '/fotos/hero-pattern.jpg',
      date: event.event_date ?? undefined
    })
    openDrawer()
  }

  /* External promoter link */
  if (event.booking_type === 'external_link' && event.external_url) {
    return (
      <div className="flex flex-col gap-3">
        <a
          href={event.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-rustic-terracotta px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors hover:bg-rustic-terracotta/90"
        >
          {event.cta_label}
          <ExternalLink size={15} />
        </a>
        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-velvet-obsidian/20 px-6 py-3 font-sans text-sm font-medium text-velvet-obsidian transition-colors hover:border-velvet-obsidian hover:bg-velvet-obsidian hover:text-ibiza-sand"
        >
          Add to Cart
        </button>
      </div>
    )
  }

  /* Internal category link — on the detail page the primary action is WhatsApp */
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAddToCart}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-rustic-terracotta px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors hover:bg-rustic-terracotta/90"
      >
        Add to Cart
      </button>

      {event.cta_href && (
        <Link
          href={event.cta_href}
          className="flex w-full items-center justify-center rounded-full border border-velvet-obsidian/20 px-6 py-3 font-sans text-sm font-medium text-velvet-obsidian transition-colors hover:border-velvet-obsidian hover:bg-velvet-obsidian hover:text-ibiza-sand"
        >
          Browse all {CATEGORY_LABELS[event.category]}s
        </Link>
      )}
    </div>
  )
}
