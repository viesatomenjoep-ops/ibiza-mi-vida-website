/**
 * Live Google reviews, pulled from the business's Google Business Profile via
 * the Places API (New).
 *
 * ── THE ONE RULE: NO FAKE DATA, EVER ──────────────────────────────────────
 * This site previously carried a /reviews page with five invented customers,
 * stock-photo avatars and an unsourced "Based on 982 Reviews / 5.0" badge, plus
 * two schema components that hardcoded a default AggregateRating. All of it was
 * live and indexed. Fabricated reviews and fabricated review markup are a
 * Google spam-policy violation (and, for a business selling to consumers, a
 * consumer-protection problem). That page and those components have been
 * deleted and must not come back in any form.
 *
 * So: this module either returns REAL data that Google just handed us, or it
 * returns `null`. `null` is not an error state and not a "loading" state — it
 * is the correct, expected result whenever we cannot prove a review is real.
 * Every consumer of this module must render literally nothing when it is null:
 * no placeholder cards, no sample quotes, no default star count, no skeleton
 * that implies reviews exist. An empty page section is the honest outcome.
 *
 * There is deliberately no fallback/sample export in this file. If you find
 * yourself wanting one, that is the bug.
 *
 * ── Operational notes ─────────────────────────────────────────────────────
 * • The Business Profile is still being verified, so at the time of writing
 *   there are no env vars and no data. Missing env vars => return null before
 *   any network call. The build must succeed in exactly that state.
 * • The Places API is billed per request, so the fetch is cached for 24h via
 *   Next's `revalidate`. Rendering five locales × many pages against an
 *   uncached endpoint would be a real invoice, not just sloppiness.
 * • Any network or API failure returns null and is swallowed. A reviews widget
 *   must never take down a page.
 * • Places API (New) returns at most 5 reviews per place; that is a hard API
 *   limit, not something to work around by storing/rewriting reviews locally.
 */

export interface GoogleReview {
  author: string
  rating: number
  text: string
  /** Google's own phrasing, e.g. "2 months ago" — already localised by the API. */
  relativeTime: string
  profilePhoto?: string
  /** ISO 8601 timestamp, used for the Review schema's datePublished. */
  publishTime: string
}

export interface GoogleReviewsData {
  /** Average rating as reported by Google, e.g. 4.6. */
  rating: number
  /** Total number of ratings the profile has, e.g. 38. */
  total: number
  /** Link to the public Google Maps listing. */
  url: string
  reviews: GoogleReview[]
}

const ENDPOINT = 'https://places.googleapis.com/v1/places'
const FIELD_MASK = 'id,displayName,rating,userRatingCount,googleMapsUri,reviews'
const REVALIDATE_SECONDS = 86_400 // 24h — the Places API bills per call.

/** Shape of the subset of the Places API (New) response we consume. */
interface PlacesResponse {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: Array<{
    rating?: number
    publishTime?: string
    relativePublishTimeDescription?: string
    text?: { text?: string }
    originalText?: { text?: string }
    authorAttribution?: { displayName?: string; photoUri?: string }
  }>
}

/**
 * Fetch the live Google profile. Returns null — meaning "render nothing" — when
 * the integration is not configured, when Google errors, or when the profile
 * has no rating yet. Never throws.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  // Not configured yet (Business Profile still under verification). Do not call
  // the API, do not throw, do not invent anything.
  if (!apiKey || !placeId) return null

  try {
    const res = await fetch(`${ENDPOINT}/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null

    const data = (await res.json()) as PlacesResponse

    const rating = typeof data.rating === 'number' ? data.rating : null
    const total = typeof data.userRatingCount === 'number' ? data.userRatingCount : null
    // No rating or no ratings counted means there is nothing true to display.
    if (rating === null || total === null || total < 1) return null

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r): GoogleReview | null => {
        const author = r.authorAttribution?.displayName?.trim()
        const text = (r.text?.text ?? r.originalText?.text ?? '').trim()
        const stars = typeof r.rating === 'number' ? r.rating : null
        // Drop anything incomplete rather than filling a gap ourselves.
        if (!author || !text || stars === null || !r.publishTime) return null
        return {
          author,
          rating: stars,
          text,
          relativeTime: r.relativePublishTimeDescription?.trim() || '',
          profilePhoto: r.authorAttribution?.photoUri || undefined,
          publishTime: r.publishTime,
        }
      })
      .filter((r): r is GoogleReview => r !== null)

    return {
      rating,
      total,
      url: data.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      reviews,
    }
  } catch {
    // Network failure, malformed JSON, quota — all mean "we have nothing real".
    return null
  }
}
