import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { WiberBanner } from '@/components/partner/WiberBanner'
import { WIBER_URL } from '@/lib/partners'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Directe route naar Wiber, boven aan een autopagina.
 *
 * De boekknop stond onder de prijstabel, de FAQ en de interne links — ruim
 * anderhalf scherm onder de kop. Wie boven aan de pagina besloot te boeken had
 * geen knop, en dat is de bezoeker die je juist niet wilt laten scrollen.
 *
 * ── Wat hier server-gerenderd staat en wat niet ───────────────────────────
 * De knop, de voorwaarden en de disclosure zijn gewone HTML: een crawler die
 * geen JavaScript draait leest ze, en ze verschijnen ongeacht wat een bezoeker
 * met cookies doet. De Awin-banner eronder is het enige deel dat op
 * toestemming wacht, omdat het laden van die afbeelding bij Awin tegelijk de
 * vertoning registreert.
 *
 * ── Waarom de prijs hier ontbreekt zolang hij null is ─────────────────────
 * `RENTAL_PRICES.carPerDay` is nog niet bevestigd. De regel elders in deze
 * codebase geldt ook hier: geen getal noemen dat we niet waar kunnen maken, dus
 * de zin over de prijs verdwijnt in plaats van een placeholder te tonen.
 */

type T = Record<Locale, string>

const HEADING: T = {
  nl: 'Direct boeken bij Wiber',
  en: 'Book direct with Wiber',
  de: 'Direkt bei Wiber buchen',
  es: 'Reserva directa con Wiber',
  fr: 'Réserver directement chez Wiber',
}

const LEAD: T = {
  nl: 'Kies je datums op de site van Wiber en zie meteen wat er vrij is. All-in tarief, verzekering inbegrepen, ophalen op vijf minuten van de luchthaven.',
  en: 'Pick your dates on Wiber’s own site and see what is free right away. All-inclusive rate, insurance included, pick-up five minutes from the airport.',
  de: 'Wähle deine Daten direkt bei Wiber und sieh sofort, was frei ist. All-inclusive-Tarif, Versicherung inklusive, Abholung fünf Minuten vom Flughafen.',
  es: 'Elige tus fechas en la web de Wiber y mira al momento qué hay libre. Tarifa todo incluido, seguro incluido, recogida a cinco minutos del aeropuerto.',
  fr: 'Choisissez vos dates sur le site de Wiber et voyez tout de suite les disponibilités. Tarif tout compris, assurance incluse, retrait à cinq minutes de l’aéroport.',
}

const CTA: T = {
  nl: 'Bekijk prijzen en beschikbaarheid',
  en: 'Check prices and availability',
  de: 'Preise und Verfügbarkeit ansehen',
  es: 'Ver precios y disponibilidad',
  fr: 'Voir les prix et disponibilités',
}

const FROM: T = {
  nl: 'per dag, all-in',
  en: 'per day, all-inclusive',
  de: 'pro Tag, all-inclusive',
  es: 'por día, todo incluido',
  fr: 'par jour, tout compris',
}

const POINTS: Record<Locale, string[]> = {
  nl: ['Verzekering in de prijs', 'Gratis shuttle vanaf de terminal', 'Contactloos ophalen', 'Vanaf 21 jaar'],
  en: ['Insurance in the price', 'Free shuttle from the terminal', 'Contactless pick-up', 'From age 21'],
  de: ['Versicherung im Preis', 'Gratis-Shuttle vom Terminal', 'Kontaktlose Übernahme', 'Ab 21 Jahren'],
  es: ['Seguro incluido en el precio', 'Shuttle gratuito desde la terminal', 'Recogida sin contacto', 'Desde los 21 años'],
  fr: ['Assurance comprise', 'Navette gratuite depuis le terminal', 'Prise en charge sans contact', 'Dès 21 ans'],
}

export function WiberDirect({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const price = RENTAL_PRICES.carPerDay.amount

  return (
    /* Eigen donkere ondergrond: dit blok landt op de witte HubHero en op de
       donkere body, en moet op allebei leesbaar zijn. */
    <section className="mt-8 rounded-2xl bg-obsidian p-6 text-white md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-soft">Wiber Rent a Car</p>
          <h2 className="mt-2 font-serif text-xl font-black leading-tight tracking-tight text-white md:text-2xl">
            {HEADING[l]}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/75">{LEAD[l]}</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
            {POINTS[l].map(point => (
              <li key={point} className="flex items-center gap-2 text-[14px] text-white/85">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
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
          <div className="mt-4 flex flex-col items-start gap-3 md:items-end">
            <AffiliateLink href={WIBER_URL} partner="Wiber Rent a Car" locale={l}>
              {CTA[l]}
            </AffiliateLink>
          </div>
        </div>
      </div>

      <WiberBanner className="mt-6" />
    </section>
  )
}
