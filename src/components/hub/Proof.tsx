import { PROOF, TICKETS_TODAY } from '@/lib/proof'
import { getGoogleReviews } from '@/lib/google-reviews'
import { ibizaToday } from '@/lib/date-label'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Social proof, assembled entirely from data.
 *
 * Two sources, both of which can be empty, and the component renders whatever
 * survives:
 *
 *  • src/lib/proof.ts — our own figures, updated monthly by hand. Artist names
 *    and ticket counts live there so they are never written into page copy,
 *    where nobody would remember to update them once the season turns over.
 *
 *  • getGoogleReviews() — the live Google Business Profile. The rating and
 *    review count are NEVER passed in as props or defaults: this component
 *    fetches them, and renders no rating at all when the call returns null.
 *    That is the correct output while the profile is still being verified, and
 *    it is why "5.0 from 8 reviews" appears nowhere in this file. See the
 *    header of src/lib/google-reviews.ts.
 *
 * If both sources are empty the component returns null rather than an empty
 * shell — a proof block with nothing in it is worse than no proof block.
 */

const HEADING: Record<Locale, string> = {
  nl: 'Waarom mensen via ons boeken',
  en: 'Why people book through us',
  de: 'Warum Gäste über uns buchen',
  es: 'Por qué reservan con nosotros',
  fr: 'Pourquoi réserver chez nous',
}

/**
 * "Vandaag al X tickets geboekt via ons." Rendert alleen met een echt getal
 * uit `TICKETS_TODAY`, en alleen op de dag waarvoor dat getal geldt — een
 * teller van gisteren die "vandaag" zegt is een onware mededeling, ook als
 * het getal zelf klopte. Zie de toelichting in src/lib/proof.ts voor waarom
 * hier nooit een geschat of willekeurig getal in mag.
 */
const TODAY: Record<Locale, string> = {
  nl: 'tickets vandaag via ons geboekt',
  en: 'tickets booked through us today',
  de: 'Tickets heute über uns gebucht',
  es: 'entradas reservadas hoy con nosotros',
  fr: 'billets réservés chez nous aujourd’hui',
}

const TICKETS: Record<Locale, string> = {
  nl: 'tickets verkocht dit seizoen',
  en: 'tickets sold this season',
  de: 'Tickets diese Saison verkauft',
  es: 'entradas vendidas esta temporada',
  fr: 'billets vendus cette saison',
}

/**
 * Het cijfer zonder het aantal beoordelingen.
 *
 * Het aantal stond er wel ("uit 7 beoordelingen") en is er op verzoek uit: bij
 * een jong profiel werkt een laag aantal tegen het cijfer in. Het getal is
 * daarmee niet verstopt — de regel linkt naar het Bedrijfsprofiel, waar het
 * aantal gewoon staat, en `reviewCount` blijft in de AggregateRating-markup
 * staan omdat Google dat veld vereist en het waar is. Alleen de zin noemt het
 * niet meer.
 */
const RATING: Record<Locale, (r: number) => string> = {
  nl: (r) => `${r} van 5 op Google`,
  en: (r) => `${r} out of 5 on Google`,
  de: (r) => `${r} von 5 bei Google`,
  es: (r) => `${r} sobre 5 en Google`,
  fr: (r) => `${r} sur 5 sur Google`,
}

export async function Proof({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const reviews = await getGoogleReviews()

  const hasTickets = typeof PROOF.ticketsSold === 'number' && PROOF.ticketsSold > 0
  const hasRating = reviews !== null && reviews.total > 0
  // Ibiza-dag, geen UTC-dag: tussen middernacht en 02:00 wijkt UTC een dag af
  // en zou de teller van gisteren als "vandaag" blijven staan.
  const today = TICKETS_TODAY && TICKETS_TODAY.count > 0 && TICKETS_TODAY.date === ibizaToday()
    ? TICKETS_TODAY
    : null

  if (!hasTickets && !hasRating && !today) return null

  return (
    <section className="border-t border-black/5 bg-neutral-50 py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{HEADING[l]}</h2>

        {today && (
          <p className="mt-5 font-serif text-xl font-black text-neutral-900">
            {today.count.toLocaleString(l)}{' '}
            <span className="text-[15px] font-normal text-neutral-600">{TODAY[l]}</span>
          </p>
        )}

        {hasTickets && (
          <p className="mt-5 font-serif text-xl font-black text-neutral-900">
            {PROOF.ticketsSold?.toLocaleString(l)}{' '}
            <span className="text-[15px] font-normal text-neutral-600">{TICKETS[l]}</span>
          </p>
        )}

        {hasRating && reviews && (
          <p className="mt-6 text-[15px] text-neutral-700">
            <span aria-hidden className="text-gold">★</span>{' '}
            {reviews.url ? (
              <a href={reviews.url} target="_blank" rel="noopener" className="text-neutral-900 underline underline-offset-2">
                {RATING[l](reviews.rating)}
              </a>
            ) : (
              RATING[l](reviews.rating)
            )}
          </p>
        )}
      </div>
    </section>
  )
}
