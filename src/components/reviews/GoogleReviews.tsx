import { Star } from 'lucide-react'
import { getGoogleReviews, type GoogleReview } from '@/lib/google-reviews'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Live Google reviews block (server component).
 *
 * Renders REAL reviews from the Google Business Profile, or nothing at all.
 * There is no empty state, no placeholder and no sample review anywhere in this
 * file: the profile is still being verified, so today this component returns
 * null on every page, and that is the intended behaviour. See the header of
 * src/lib/google-reviews.ts for why (this site shipped fabricated reviews once
 * already and they had to be deleted).
 *
 * CONTRAST NOTE — do not remove the explicit text colours on the <a>. A legacy
 * global rule sets link colour to #faf3f5, which on this white section measures
 * 1.09:1, i.e. completely invisible. Every anchor here therefore carries its own
 * text-neutral-900. Body text uses text-neutral-600 rather than text-black/60
 * (3.94:1, below AA).
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const HEADING: T = L(
  'Wat gasten op Google zeggen',
  'What guests say on Google',
  'Was Gäste bei Google sagen',
  'Lo que dicen los clientes en Google',
  'Ce que disent les clients sur Google',
)
const ON_GOOGLE: T = L(
  'reviews op Google',
  'reviews on Google',
  'Rezensionen bei Google',
  'reseñas en Google',
  'avis sur Google',
)
/**
 * Niet meer in beeld: de knop die hiermee naar het Bedrijfsprofiel linkte is
 * op verzoek van de eigenaar verwijderd. De sterren blijven staan, en de
 * reviewkaarten eronder tonen nog steeds echte auteurs en teksten uit dezelfde
 * bron — de herkomst is dus zichtbaar, alleen niet meer aanklikbaar.
 *
 * De vertalingen blijven staan omdat de knop een keuze is en geen fout: zetten
 * we hem terug, dan staat de tekst er in vijf talen klaar in plaats van dat
 * iemand hem opnieuw moet laten vertalen.
 */
const READ_ALL: T = L(
  'Lees alle reviews op Google',
  'Read all reviews on Google',
  'Alle Rezensionen bei Google lesen',
  'Leer todas las reseñas en Google',
  'Lire tous les avis sur Google',
)
const OUT_OF: T = L('van 5', 'out of 5', 'von 5', 'de 5', 'sur 5')

function Stars({ rating, label }: { rating: number; label: string }) {
  const rounded = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={15}
          aria-hidden
          className={i <= rounded ? 'fill-gold text-gold' : 'fill-black/10 text-black/10'}
        />
      ))}
    </span>
  )
}

function ReviewCard({ review, l }: { review: GoogleReview; l: Locale }) {
  return (
    <li className="flex flex-col rounded-[22px] border border-black/8 bg-white p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gold font-serif text-base font-black text-white"
        >
          {review.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element -- Google's CDN host, not worth a remotePatterns entry
            <img
              src={review.profilePhoto}
              alt={`${review.author} review`}
              width={40}
              height={40}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-10 w-10 object-cover"
            />
          ) : (
            review.author.charAt(0).toUpperCase()
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-black leading-tight text-neutral-900">{review.author}</p>
          <div className="mt-1 flex items-center gap-2">
            <Stars rating={review.rating} label={`${review.rating} ${OUT_OF[l]}`} />
            {review.relativeTime ? <span className="text-xs text-neutral-600">{review.relativeTime}</span> : null}
          </div>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-neutral-600">{review.text}</p>
    </li>
  )
}

export async function GoogleReviews({ locale }: { locale: string }) {
  const data = await getGoogleReviews()
  // Not configured, Google unreachable, or no reviews yet — render nothing.
  if (!data || data.reviews.length === 0) return null

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const ratingLabel = data.rating.toFixed(1)

  return (
    <section className="mb-14 border-y border-black/5 bg-neutral-50 py-14">
      <div className="mx-auto max-w-5xl px-4">
        {/* Stond als twee kolommen met de knop "Lees alle reviews op Google"
            rechts; die knop is er op verzoek uit (zie READ_ALL hieronder).
            Zonder tweede kolom heeft een justify-between-rij niets meer te
            verdelen, dus die is ook weg — anders houd je een lege helft over
            die op smalle schermen als witruimte onder de sterren landt. */}
        <div>
          <div>
            <h2 className="font-serif text-2xl font-black tracking-tight text-neutral-900 md:text-3xl">
              {HEADING[l]}
            </h2>
            {/* Alleen de sterren, geen cijfer en geen aantal -- op verzoek.
                Beide staan nog in de aria-label, voor wie met een
                schermlezer leest. */}
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <Stars rating={data.rating} label={`${ratingLabel} ${OUT_OF[l]} — ${data.total} ${ON_GOOGLE[l]}`} />
            </div>
          </div>
        </div>

        <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.reviews.map((r, i) => (
            <ReviewCard key={`${r.author}-${r.publishTime}-${i}`} review={r} l={l} />
          ))}
        </ul>
      </div>
    </section>
  )
}
