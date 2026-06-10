'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import type { BookingConfig } from '@/types/booking'

interface CategoryCardProps {
  title: string
  tagline?: string
  imageUrl: string
  bookingConfig: BookingConfig
  badge?: string
  /** When provided, the card navigates to this URL instead of opening the booking modal */
  href?: string
  /** Override the CTA button label (defaults to "Explore" for links, "Book Now" for modal) */
  ctaLabel?: string
}

export function CategoryCard({
  title,
  tagline,
  imageUrl,
  bookingConfig,
  badge,
  href,
  ctaLabel,
}: CategoryCardProps) {
  const { addToCart } = useCart()

  const label = ctaLabel ?? (href ? 'Explore' : 'Book Now')

  // Parse price from badge (e.g. "From €120" -> 120) or default to 0
  const parsePrice = (b?: string) => {
    if (!b) return 0;
    const match = b.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  const handleBook = () => {
    addToCart({
      serviceId: bookingConfig.serviceType + '-' + title,
      title: title,
      price: parsePrice(badge),
      image: imageUrl,
      date: bookingConfig.arrivalDate
    });
  }

  const inner = (
    <>
      {/* Background image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 card-gradient" />

      {/* Badge */}
      {badge && (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-rustic-terracotta px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-white">
          {badge}
        </div>
      )}

      {/* Text content */}
      <div className="relative z-10 flex flex-col gap-3 p-6">
        {tagline && (
          <p className="font-sans text-sm font-light text-ibiza-sand/70">{tagline}</p>
        )}
        <h3 className="font-serif text-3xl font-light leading-tight text-ibiza-sand">{title}</h3>

        {/* CTA pill */}
        <div className="mt-1 self-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-rustic-terracotta px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all duration-200 group-hover:bg-rustic-terracotta/90 group-hover:gap-3">
            {label}
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </>
  )

  /* Navigation variant — renders as a Next.js Link */
  if (href) {
    return (
      <Link
        href={href}
        className="group relative flex min-h-[500px] flex-col justify-end overflow-hidden rounded-3xl"
        aria-label={`View ${title}`}
      >
        {inner}
      </Link>
    )
  }

  /* Modal variant — renders as a button-like article */
  return (
    <article
      className="group relative flex min-h-[500px] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl"
      onClick={handleBook}
      role="button"
      tabIndex={0}
      aria-label={`Add ${title} to cart`}
      onKeyDown={(e) => e.key === 'Enter' && handleBook()}
    >
      {inner}
    </article>
  )
}
