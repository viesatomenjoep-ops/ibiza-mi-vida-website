import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { getGoogleReviews } from '@/lib/google-reviews'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * The "who are you actually booking through" block.
 *
 * Sits low on a hub page, after the reader knows what they want and starts
 * asking who is handling it. Three things belong here and nothing else: who the
 * supplying partner is, how money is protected (deposit and insurance), and
 * whatever real rating exists.
 *
 * The rating comes from the live Google Business Profile via getGoogleReviews()
 * and is omitted entirely when that returns null. There is no prop for it,
 * deliberately — see src/lib/google-reviews.ts.
 */

export interface TrustPoint {
  title: string
  body: string
}

const RATING: Record<Locale, (r: number, n: number) => string> = {
  nl: (r, n) => `${r} van 5 op Google, uit ${n} beoordelingen`,
  en: (r, n) => `${r} out of 5 on Google, from ${n} reviews`,
  de: (r, n) => `${r} von 5 bei Google, aus ${n} Bewertungen`,
  es: (r, n) => `${r} sobre 5 en Google, de ${n} reseñas`,
  fr: (r, n) => `${r} sur 5 sur Google, sur ${n} avis`,
}

export async function TrustBlock({
  heading,
  intro,
  points,
  locale,
  partner,
  partnerHref,
  partnerCta,
}: {
  heading: string
  intro?: string
  points: TrustPoint[]
  locale: string
  /** Partner name, e.g. 'Click&Boat' or 'Wiber Rent a Car'. */
  partner?: string
  /** Partner deeplink. Rendered through AffiliateLink, so always rel=sponsored. */
  partnerHref?: string
  partnerCta?: string
}) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const reviews = await getGoogleReviews()

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        {intro && <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">{intro}</p>}

        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          {points.map((p) => (
            <div key={p.title}>
              <dt className="font-serif text-base font-black text-neutral-900">{p.title}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-neutral-600">{p.body}</dd>
            </div>
          ))}
        </dl>

        {reviews && reviews.total > 0 && (
          <p className="mt-8 text-[15px] text-neutral-700">
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

        {partner && partnerHref && partnerCta && (
          <div className="mt-8">
            <AffiliateLink href={partnerHref} partner={partner} locale={locale}>
              {partnerCta}
            </AffiliateLink>
          </div>
        )}
      </div>
    </section>
  )
}
