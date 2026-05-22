'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useBooking } from '@/context/booking-context'
import type { BookingConfig } from '@/types/booking'

interface CategoryCardProps {
  title: string
  tagline?: string
  imageUrl: string
  bookingConfig: BookingConfig
  badge?: string
}

export function CategoryCard({
  title,
  tagline,
  imageUrl,
  bookingConfig,
  badge,
}: CategoryCardProps) {
  const { openModal } = useBooking()

  return (
    <article
      className="group relative flex min-h-[500px] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl"
      onClick={() => openModal(bookingConfig)}
      role="button"
      tabIndex={0}
      aria-label={`Enquire about ${title}`}
      onKeyDown={(e) => e.key === 'Enter' && openModal(bookingConfig)}
    >
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
        <div className="absolute right-4 top-4 z-10 rounded-full bg-teal px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-white">
          {badge}
        </div>
      )}

      {/* Text content */}
      <div className="relative z-10 flex flex-col gap-3 p-6">
        {tagline && (
          <p className="font-sans text-sm font-light text-soft-white/70">{tagline}</p>
        )}
        <h3 className="font-serif text-3xl font-light leading-tight text-soft-white">{title}</h3>

        {/* CTA pill */}
        <div className="mt-1 self-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all duration-200 group-hover:bg-teal-dark group-hover:gap-3">
            Book Now
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  )
}
