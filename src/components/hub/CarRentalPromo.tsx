import Link from 'next/link'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { WIBER_URL } from '@/lib/partners'
import { slugFor } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Wiber car-rental block, for pages that are not the car-rental page itself.
 *
 * It exists because the two places a visitor most obviously looks for car hire
 * — the homepage and /car-scooter-rental — pointed at nothing. The rental page
 * read "the full range will be here soon" above an empty state, which is the
 * worst version of a commercial page: it ranks, it gets clicked, and it hands
 * the visitor a dead end and a WhatsApp button.
 *
 * ── Why this carries its own background ───────────────────────────────────
 * It renders on two pages with opposite palettes: the homepage sits on the
 * dark body (globals.css sets `body{background:var(--black)}`), while
 * /car-scooter-rental uses .pl-shell, which is `background:#fff;color:#111`.
 * A block that inherited either one would be invisible on the other — exactly
 * the failure that made the fleet price text unreadable. So the card paints its
 * own dark ground and sets every colour on top of it explicitly, and reads the
 * same either way.
 *
 * The price clause disappears while `carPerDay` is null, like everywhere else.
 */

type T = Record<Locale, string>

const HEADING: T = {
  nl: 'Auto huren bij Wiber',
  en: 'Car rental with Wiber',
  de: 'Mietwagen bei Wiber',
  es: 'Alquiler de coches con Wiber',
  fr: 'Location de voiture avec Wiber',
}

const LEAD: T = {
  nl: 'All-in tarief met de verzekering erin, kantoor op vijf minuten van de luchthaven met gratis shuttle, en contactloos ophalen. Vanaf 21 jaar.',
  en: 'All-inclusive rate with the insurance in the price, an office five minutes from the airport with a free shuttle, and contactless pick-up. From 21.',
  de: 'All-inclusive-Tarif mit Versicherung im Preis, Büro fünf Minuten vom Flughafen mit Gratis-Shuttle und kontaktlose Übernahme. Ab 21 Jahren.',
  es: 'Tarifa todo incluido con el seguro dentro, oficina a cinco minutos del aeropuerto con shuttle gratuito y recogida sin contacto. Desde 21 años.',
  fr: 'Tarif tout compris avec l’assurance incluse, agence à cinq minutes de l’aéroport avec navette gratuite et prise en charge sans contact. Dès 21 ans.',
}

const READ_MORE: T = {
  nl: 'Voorwaarden, prijzen en tips',
  en: 'Conditions, prices and tips',
  de: 'Bedingungen, Preise und Tipps',
  es: 'Condiciones, precios y consejos',
  fr: 'Conditions, prix et conseils',
}

const CTA: T = {
  nl: 'Bekijk beschikbaarheid',
  en: 'Check availability',
  de: 'Verfügbarkeit prüfen',
  es: 'Consultar disponibilidad',
  fr: 'Voir les disponibilités',
}

const FROM: T = {
  nl: 'per dag, all-in',
  en: 'per day, all-inclusive',
  de: 'pro Tag, all-inclusive',
  es: 'por día, todo incluido',
  fr: 'par jour, tout compris',
}

const POINTS: Record<Locale, string[]> = {
  nl: ['All-in prijs, geen verrassingen aan de balie', '5 minuten van Ibiza Airport, gratis shuttle', 'Contactloos ophalen na een late landing'],
  en: ['All-inclusive price, no surprises at the desk', 'Five minutes from Ibiza Airport, free shuttle', 'Contactless pick-up after a late landing'],
  de: ['All-inclusive-Preis, keine Überraschungen am Schalter', 'Fünf Minuten vom Flughafen Ibiza, Gratis-Shuttle', 'Kontaktlose Übernahme nach später Landung'],
  es: ['Precio todo incluido, sin sorpresas en el mostrador', 'A cinco minutos del aeropuerto, shuttle gratuito', 'Recogida sin contacto tras un aterrizaje tardío'],
  fr: ['Prix tout compris, pas de surprise au comptoir', 'À cinq minutes de l’aéroport, navette gratuite', 'Prise en charge sans contact après un vol tardif'],
}

export function CarRentalPromo({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const price = RENTAL_PRICES.carPerDay.amount
  const href = `/${l}/${slugFor('car-rental', l)}`

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-obsidian p-7 text-white md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">Wiber Rent a Car</p>
            <h2 className="mt-3 font-serif text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
              {HEADING[l]}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">{LEAD[l]}</p>

            <ul className="mt-6 space-y-2">
              {POINTS[l].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] text-white/85">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 md:text-right">
            {price !== null && (
              <p className="font-serif text-3xl font-black text-white">
                €{price}
                <span className="mt-1 block font-sans text-[13px] font-normal text-white/60">{FROM[l]}</span>
              </p>
            )}
            <div className="mt-6 flex flex-col items-start gap-4 md:items-end">
              <AffiliateLink href={WIBER_URL} partner="Wiber Rent a Car" locale={l}>
                {CTA[l]}
              </AffiliateLink>
              <Link
                href={href}
                className="text-[14px] font-semibold text-white underline underline-offset-4 hover:text-gold"
              >
                {READ_MORE[l]} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
