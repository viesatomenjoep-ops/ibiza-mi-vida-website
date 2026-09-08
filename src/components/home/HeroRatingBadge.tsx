import { Star } from 'lucide-react'
import type { Locale } from '@/lib/seo'
import { GoogleGMark } from '@/components/ui/GoogleGMark'

export interface HeroRating {
  /** Average as Google reports it, e.g. 4.9. */
  rating: number
  /** Number of ratings the profile has. */
  total: number
  /** Public Google Maps listing. */
  url: string
}

/**
 * Volledige bewering voor wie met een schermlezer leest: cijfer en aantal
 * blijven daar staan, ook nu ze visueel weg zijn -- alleen ziende bezoekers
 * zien voortaan enkel de sterren.
 */
const A11Y: Record<string, (r: string, n: number) => string> = {
  nl: (r, n) => `Google-beoordeling ${r} van 5, op basis van ${n} reviews. Opent Google Maps in een nieuw tabblad.`,
  en: (r, n) => `Google rating ${r} out of 5, based on ${n} reviews. Opens Google Maps in a new tab.`,
  de: (r, n) => `Google-Bewertung ${r} von 5, basierend auf ${n} Rezensionen. Öffnet Google Maps in einem neuen Tab.`,
  es: (r, n) => `Valoración de Google ${r} sobre 5, basada en ${n} reseñas. Abre Google Maps en una pestaña nueva.`,
  fr: (r, n) => `Note Google ${r} sur 5, basée sur ${n} avis. Ouvre Google Maps dans un nouvel onglet.`,
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
      aria-label={(A11Y[locale] || A11Y.en)(nf.format(rating), total)}
    >
      {/* Alleen de sterren, geen cijfer en geen aantal -- op verzoek. De
          precieze bewering staat nog in aria-label hieronder voor wie met een
          schermlezer leest. */}
      <span className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={i < filled ? 'fill-gold-soft text-gold-soft' : 'text-white/35'}
          />
        ))}
      </span>
      {/* Het Google-logo erachter, op verzoek -- met een dun lijntje ertussen
          zodat het duidelijk een los kenmerk is en niet aan de sterren
          vastplakt. Witte cirkel eronder: het logo heeft zelf geen
          achtergrond en de vier kleuren vielen weg tegen de doorschijnend
          zwarte pil. */}
      <span aria-hidden className="h-4 w-px bg-white/25" />
      <span aria-hidden className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white">
        <GoogleGMark size={13} />
      </span>
    </a>
  )
}
