import { PROOF } from '@/lib/proof'
import { getGoogleReviews } from '@/lib/google-reviews'
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

const SOLD_FOR: Record<Locale, string> = {
  nl: 'Dit seizoen verkochten we onder meer tickets voor',
  en: 'Shows we have sold tickets for this season',
  de: 'Shows, für die wir diese Saison Tickets verkauft haben',
  es: 'Shows para los que hemos vendido entradas esta temporada',
  fr: 'Événements pour lesquels nous avons vendu des billets cette saison',
}

const TICKETS: Record<Locale, string> = {
  nl: 'tickets verkocht dit seizoen',
  en: 'tickets sold this season',
  de: 'Tickets diese Saison verkauft',
  es: 'entradas vendidas esta temporada',
  fr: 'billets vendus cette saison',
}

const RATING: Record<Locale, (r: number, n: number) => string> = {
  nl: (r, n) => `${r} van 5 op Google, uit ${n} beoordelingen`,
  en: (r, n) => `${r} out of 5 on Google, from ${n} reviews`,
  de: (r, n) => `${r} von 5 bei Google, aus ${n} Bewertungen`,
  es: (r, n) => `${r} sobre 5 en Google, de ${n} reseñas`,
  fr: (r, n) => `${r} sur 5 sur Google, sur ${n} avis`,
}

export async function Proof({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const reviews = await getGoogleReviews()

  const hasArtists = PROOF.soldFor.length > 0
  const hasTickets = typeof PROOF.ticketsSold === 'number' && PROOF.ticketsSold > 0
  const hasRating = reviews !== null && reviews.total > 0

  if (!hasArtists && !hasTickets && !hasRating) return null

  return (
    <section className="border-t border-black/5 bg-neutral-50 py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{HEADING[l]}</h2>

        {hasTickets && (
          <p className="mt-5 font-serif text-xl font-black text-neutral-900">
            {PROOF.ticketsSold?.toLocaleString(l)}{' '}
            <span className="text-[15px] font-normal text-neutral-600">{TICKETS[l]}</span>
          </p>
        )}

        {hasArtists && (
          <div className="mt-6">
            <h3 className="text-[13px] font-semibold uppercase tracking-widest text-neutral-500">{SOLD_FOR[l]}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {PROOF.soldFor.map((name) => (
                <li key={name} className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-[14px] font-medium text-neutral-900">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasRating && reviews && (
          <p className="mt-6 text-[15px] text-neutral-700">
            <span aria-hidden className="text-gold">★</span>{' '}
            {reviews.url ? (
              <a href={reviews.url} target="_blank" rel="noopener" className="text-neutral-900 underline underline-offset-2">
                {RATING[l](reviews.rating, reviews.total)}
              </a>
            ) : (
              RATING[l](reviews.rating, reviews.total)
            )}
          </p>
        )}
      </div>
    </section>
  )
}
