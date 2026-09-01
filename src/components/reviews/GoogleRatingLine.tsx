import { Star } from 'lucide-react'
import type { Locale } from '@/lib/seo'
import { localeTag } from '@/lib/date-label'

export interface GoogleRating {
  /** Gemiddelde zoals Google het teruggeeft, bijv. 4.9. */
  rating: number
  /** Aantal beoordelingen waarop dat gemiddelde rust. */
  total: number
  /** Publieke Google Maps-vermelding. */
  url: string
}

const ON_GOOGLE: Record<string, string> = {
  nl: 'op Google', en: 'on Google', de: 'auf Google', es: 'en Google', fr: 'sur Google',
}
const REVIEWS: Record<string, string> = {
  nl: 'reviews', en: 'reviews', de: 'Bewertungen', es: 'reseñas', fr: 'avis',
}
const A11Y: Record<string, (r: string, n: number) => string> = {
  nl: (r, n) => `Google-beoordeling ${r} van 5, op basis van ${n} reviews. Opent Google Maps in een nieuw tabblad.`,
  en: (r, n) => `Google rating ${r} out of 5, based on ${n} reviews. Opens Google Maps in a new tab.`,
  de: (r, n) => `Google-Bewertung ${r} von 5, basierend auf ${n} Rezensionen. Öffnet Google Maps in einem neuen Tab.`,
  es: (r, n) => `Valoración de Google ${r} sobre 5, basada en ${n} reseñas. Abre Google Maps en una pestaña nueva.`,
  fr: (r, n) => `Note Google ${r} sur 5, basée sur ${n} avis. Ouvre Google Maps dans un nouvel onglet.`,
}

/**
 * De Google-beoordeling als één regel, voor lichte achtergronden.
 *
 * HeroRatingBadge doet hetzelfde in de hero, maar die is gebouwd voor een
 * donkere foto: witte tekst op een doorschijnend zwart pilletje. Dat kun je
 * niet op een witte footer zetten. In plaats van dat bestand met varianten te
 * belasten staat hier de lichte versie, en beide houden zich aan dezelfde
 * regel — echt getal of niets.
 *
 * ── Waarom hier ook geen standaardwaarde staat ────────────────────────────
 * Geen fallback, geen plaatshouder, geen hardgecodeerd cijfer. Ontbreekt de
 * data, dan rendert dit niets. Deze site heeft ooit een reviewpagina gehad met
 * vijf verzonnen klanten en een "Based on 982 Reviews"-badge, live en
 * geïndexeerd, die verwijderd moest worden. Verzonnen beoordelingen zijn een
 * overtreding van Google's spambeleid, en een niet te onderbouwen sterscore in
 * reclame is in de EU een consumentenrechtelijk probleem onder de
 * Omnibusrichtlijn — niet slechts slordig.
 *
 * ── Waarom het een link is ────────────────────────────────────────────────
 * Naar het publieke Google-profiel. Een sterscore die je niet kunt natrekken
 * is precies zo veel waard als een verzonnen sterscore; de link is wat het
 * verschil aantoonbaar maakt. `noopener noreferrer` omdat dit naar buiten gaat
 * en er geen affiliaterelatie is die een verwijzende header nodig heeft.
 *
 * ── Halve sterren worden niet getekend ────────────────────────────────────
 * Een 4,6 toont vier gevulde sterren en één lege. Dat doet het cijfer tekort
 * in plaats van het te flatteren, en dat is de goede kant om op af te ronden.
 * Het geschreven getal ernaast is de precieze bewering; de sterren maken het
 * alleen scanbaar.
 */
export function GoogleRatingLine({
  rating, total, url, locale, className = '',
}: GoogleRating & { locale: Locale; className?: string }) {
  if (!rating || !total) return null

  const nf = new Intl.NumberFormat(localeTag(locale), { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const shown = nf.format(rating)
  const filled = Math.floor(rating)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      // text-neutral-700 staat op de <a> zelf en niet op een ouder: globals.css
      // heeft `a{color:var(--white)}`, een regel die de link direct raakt, en
      // een geërfde kleur verliest daar altijd van. Zonder dit wordt dit
      // #faf3f5 op wit — gemeten 1.09:1, oftewel onzichtbaar.
      className={`inline-flex items-center gap-2 text-neutral-700 transition-colors hover:text-neutral-900 ${className}`}
      aria-label={(A11Y[locale] || A11Y.en)(shown, total)}
    >
      <span className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={13} className={i < filled ? 'fill-gold text-gold' : 'text-neutral-300'} />
        ))}
      </span>
      <span aria-hidden className="text-sm font-bold tabular-nums text-neutral-900">{shown}</span>
      {/* neutral-600 en niet neutral-500. Op wit meet 500 4,74:1 — dat haalt
          AA (4,5) net, maar dit is 12px-tekst en dan is een marge van 0,24 geen
          marge. 600 zit op ongeveer 7,4:1. */}
      <span aria-hidden className="text-xs text-neutral-600">
        {ON_GOOGLE[locale] || ON_GOOGLE.en} · {total} {REVIEWS[locale] || REVIEWS.en}
      </span>
    </a>
  )
}
