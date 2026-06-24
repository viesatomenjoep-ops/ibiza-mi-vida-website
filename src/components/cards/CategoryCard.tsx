'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
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

  const label = ctaLabel ?? (href ? 'Bekijk Details' : 'Book Now')

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
      price: parsePrice(badge) || 50,
      image: imageUrl,
      date: bookingConfig.arrivalDate || 'Selecteer Datum'
    });
  }

  const inner = (
    <>
      <div className="relative h-48 md:h-56 w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Star size={48} />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col bg-white">
        {tagline && (
          <span className="inline-block bg-[#00A698]/10 text-[#00A698] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-3 self-start">
            {tagline}
          </span>
        )}
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3 group-hover:text-[#00A698] transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-sm font-semibold text-[#00A698] flex items-center gap-1 group-hover:underline">
            {label} <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
          {badge && (
             <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Vanaf</div>
              <div className="text-lg font-bold text-slate-900">
                € {parsePrice(badge).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  /* Navigation variant — renders as a Next.js Link */
  if (href) {
    return (
      <Link
        href={href}
        className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
        aria-label={`View ${title}`}
      >
        {inner}
      </Link>
    )
  }

  /* Modal variant — renders as a button-like article */
  return (
    <article
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
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
