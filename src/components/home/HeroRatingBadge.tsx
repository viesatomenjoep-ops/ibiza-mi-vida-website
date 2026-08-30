import { Star } from 'lucide-react'
import type { Locale } from '@/lib/seo'

export interface HeroRating {
  /** Average as Google reports it, e.g. 4.9. */
  rating: number
  /** Number of ratings the profile has. */
  total: number
  /** Public Google Maps listing. */
  url: string
}

const LABEL: Record<string, string> = {
  nl: 'op Google', en: 'on Google', de: 'auf Google', es: 'en Google', fr: 'sur Google',
}
const REVIEWS: Record<string, string> = {
  nl: 'reviews', en: 'reviews', de: 'Bewertungen', es: 'reseñas', fr: 'avis',
}

/**
 * Star rating under the hero call to action.
 *
 * ── Why this takes a prop and cannot be given a default ───────────────────
 * The number here is a public claim about how customers rate the business.
 * It is passed in from a live Google Business Profile read and there is no
 * fallback, no placeholder and no hardcoded rating anywhere in this file — if
 * `rating` is absent the component renders nothing and the hero simply has no
 * badge.
 *
 * That is not caution for its own sake. This site already shipped a reviews
 * page with five invented customers and a "Based on 982 Reviews" badge, all of
 * it live and indexed, and it had to be deleted. Fabricated review claims are
 * a Google spam-policy violation, and in the EU an unsubstantiated star rating
 * in advertising is a consumer-protection problem under the Omnibus Directive,
 * not merely bad practice. So: real number or no badge.
 *
 * The moment GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are set and the profile
 * has ratings, this appears on its own with the true figure.
 *
 * Half stars are not drawn. A 4.6 shows four filled and one outline, which
 * understates rather than flatters — the written number next to it is the
 * precise claim, and the stars are only there to make it scannable.
 */
export function HeroRatingBadge({ rating, total, url, locale }: HeroRating & { locale: Locale }) {
  if (!rating || !total) return null
  const filled = Math.floor(rating)
  const nf = new Intl.NumberFormat(
    ({ nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB',
    { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  )

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:border-white/45 hover:bg-black/50"
    >
      <span className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={i < filled ? 'fill-gold-soft text-gold-soft' : 'text-white/35'}
          />
        ))}
      </span>
      <span className="text-sm font-bold tabular-nums">{nf.format(rating)}</span>
      <span className="text-xs font-medium text-white/70">
        {LABEL[locale] || LABEL.en} · {total} {REVIEWS[locale] || REVIEWS.en}
      </span>
    </a>
  )
}
