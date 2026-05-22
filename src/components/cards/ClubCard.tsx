import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import type { Club } from '@/types/club'

interface ClubCardProps {
  club: Club
}

export function ClubCard({ club }: ClubCardProps) {
  const isPromoterLink = club.booking_type === 'promoter_link'
  const imageUrl = club.image_url ?? 'https://images.unsplash.com/photo-1571266028243-e4d811c95a1f?w=800&q=80'

  return (
    <Link
      href={`/club-tickets/${club.slug}`}
      className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl"
      aria-label={`${club.name} — view events and tickets`}
    >
      {/* Background image */}
      <Image
        src={imageUrl}
        alt={club.name}
        fill
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 card-gradient" />

      {/* Official badge for promoter-link clubs */}
      {isPromoterLink && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-driftwood px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-white">
          <ExternalLink size={10} />
          Official
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2.5 p-6">
        {club.music_genre && (
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-driftwood">
            {club.music_genre}
          </p>
        )}
        <h3 className="font-serif text-2xl font-light leading-tight text-soft-white">
          {club.name}
        </h3>
        {club.tagline && (
          <p className="font-sans text-sm font-light text-soft-white/70">{club.tagline}</p>
        )}

        <div className="mt-1 self-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all duration-200 group-hover:bg-teal-dark group-hover:gap-3">
            See Events
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}
