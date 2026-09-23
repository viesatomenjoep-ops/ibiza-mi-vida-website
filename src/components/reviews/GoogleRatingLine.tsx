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
    // Geen <a> meer: de sterren linkten naar het Bedrijfsprofiel en die
    // doorklik is er op verzoek van de eigenaar uit. Een <span> en geen <a>
    // zonder href — dat laatste laat het element in de toegankelijkheidsboom
    // nog als link staan terwijl er niets gebeurt, en dat is verwarrender dan
    // gewone tekst. De aria-label blijft: die draagt het precieze cijfer en
    // het aantal, en dat is de volledige bewering voor wie met een schermlezer
    // leest.
    //
    // De kleurregel die hier stond ging over globals.css `a{color:var(--white)}`
    // en is daarmee vervallen; text-neutral-700 blijft staan omdat de sectie
    // eromheen licht is.
    <span
      className={`inline-flex items-center gap-2 text-neutral-700 ${className}`}
      role="img"
      aria-label={(A11Y[locale] || A11Y.en)(shown, total)}
    >
      {/* Alleen de sterren, geen cijfer en geen aantal -- op verzoek. Het
          precieze getal en de "op basis van N reviews" staan nog wel in de
          aria-label hieronder: dat blijft de volledige, natrekbare bewering
          voor wie met een schermlezer leest, alleen ziende bezoekers zien nu
          alleen de sterren zelf. */}
      <span className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={13} className={i < filled ? 'fill-gold text-gold' : 'text-neutral-300'} />
        ))}
      </span>
    </span>
  )
}
