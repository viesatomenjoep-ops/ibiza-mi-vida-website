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
  /**
   * Waar dit cijfer vandaan komt.
   *
   * 'api'    — rechtstreeks van Google, dit moment opgehaald en dus actueel.
   * 'manual' — door de eigenaar ingevoerd omdat de API dit profiel niet kent.
   *
   * Dit onderscheid bestaat niet voor de sier: alleen 'api' mag in de
   * gestructureerde data terecht. Zie de toelichting bij MANUAL_* hieronder.
   */
  source: 'api' | 'manual'
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
/**
 * Hoe vers het cijfer is.
 *
 * Stond op 24 uur puur om de rekening te drukken, want de Places API rekent
 * per aanroep en het veldmasker hieronder vraagt `reviews` op — het duurste
 * onderdeel. Maar 24 uur betekent ook dat een nieuwe beoordeling een dag lang
 * niet zichtbaar is, en het aantal is juist het cijfer dat groeit.
 *
 * Zes uur is de afweging: vier aanroepen per dag, ongeveer 120 per maand. Dat
 * valt ruim binnen wat het kost om te verwaarlozen, terwijl een nieuwe review
 * nog dezelfde dagdeel op de site staat.
 *
 * Let op dat dit niet per pagina telt. De fetch wordt door Next gecachet op de
 * URL, dus alle pagina's en alle vijf de talen delen dezelfde aanroep — ook al
 * roepen zowel de layout als de homepage deze functie aan.
 */
const REVALIDATE_SECONDS = 21_600 // 6h

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
/**
 * Handmatige terugval, en waarom die er is.
 *
 * ── Het probleem ──────────────────────────────────────────────────────────
 * Dit bedrijfsprofiel bestaat, is geverifieerd en heeft echte beoordelingen —
 * zichtbaar in Google Maps en in Google Search. Maar de Places API kent het
 * niet. Nagetrokken, niet aangenomen: gezocht op naam, op telefoonnummer, op
 * type binnen 300 meter van de eigen coördinaten en in een rechthoek rond de
 * vestiging. Nul treffers, terwijl buurbedrijven wel netjes terugkomen. Dat
 * gebeurt bij service-area profielen zonder publiek straatadres.
 *
 * Er is dus geen technische weg naar dat cijfer, en tegelijk is het cijfer
 * waar en publiek controleerbaar.
 *
 * ── Waarom dit géén terugkeer is van de verzonnen reviews ─────────────────
 * Het verschil met wat hier ooit stond — vijf bedachte klanten met
 * stockfoto's en een "982 reviews"-badge — zit in drie dingen:
 *
 *  1. Het gaat om één getal en één aantal, allebei van het eigen, publieke
 *     Google-profiel, niet om verzonnen personen of quotes.
 *  2. Elke weergave linkt naar dat profiel, zodat iedere bezoeker het in twee
 *     tikken kan natrekken. Dat is precies wat een niet te controleren
 *     sterscore mist.
 *  3. Het komt NIET in de gestructureerde data. Google mag een
 *     AggregateRating alleen zien als wij hem live kunnen aantonen; een door
 *     de eigenaar ingevoerd cijfer in schema.org-opmaak is een
 *     spambeleid-overtreding, ongeacht of het waar is. Zie ReviewSchema.
 *
 * Zodra de API het profiel wél kent wint die vanzelf: de handmatige waarden
 * worden alleen gebruikt als er niets van Google terugkomt.
 *
 * Zet in Vercel: GOOGLE_RATING (bijv. 5.0), GOOGLE_RATING_COUNT (bijv. 19) en
 * GOOGLE_PROFILE_URL (de deel-link van het profiel). Ontbreekt er één, dan
 * gebeurt er niets.
 *
 * Bewust zonder NEXT_PUBLIC_-voorvoegsel. Die worden in de build gebakken, dus
 * een wijziging vraagt dan om een nieuwe deploy; deze functie draait alleen op
 * de server en leest ze bij elke render opnieuw. Wijzigen en herstarten
 * volstaat.
 */
function handmatigeBeoordeling(): GoogleReviewsData | null {
  const cijfer = parseFloat(process.env.GOOGLE_RATING || '')
  const aantal = parseInt(process.env.GOOGLE_RATING_COUNT || '', 10)
  const url = process.env.GOOGLE_PROFILE_URL || ''
  // Zonder link geen weergave: de controleerbaarheid is het hele punt.
  if (!url) return null
  if (!Number.isFinite(cijfer) || cijfer <= 0 || cijfer > 5) return null
  if (!Number.isFinite(aantal) || aantal < 1) return null
  return { source: 'manual', rating: cijfer, total: aantal, url, reviews: [] }
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  // Geen koppeling: dan de handmatige waarden, of niets.
  if (!apiKey || !placeId) return handmatigeBeoordeling()

  try {
    const res = await fetch(`${ENDPOINT}/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      // Deze fetch staat in de root layout, dus in het renderpad van élke
      // pagina. Zonder deadline hangt een Google-storing de hele site.
      signal: AbortSignal.timeout(2500),
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) { console.warn(`[google-reviews] HTTP ${res.status}`); return handmatigeBeoordeling() }

    const data = (await res.json()) as PlacesResponse

    const rating = typeof data.rating === 'number' ? data.rating : null
    const total = typeof data.userRatingCount === 'number' ? data.userRatingCount : null
    // No rating or no ratings counted means there is nothing true to display.
    if (rating === null || total === null || total < 1) return handmatigeBeoordeling()

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
      source: 'api',
      rating,
      total,
      url: data.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      reviews,
    }
  } catch (e) {
    // Network failure, malformed JSON, quota, timeout — all mean "we have
    // nothing real". Wél loggen: de balk rendert gewoon door zonder cijfer,
    // dus zonder logregel merkt niemand dat de koppeling eruit ligt.
    console.warn(`[google-reviews] niet gebruikt: ${e instanceof Error ? e.message : String(e)}`)
    return handmatigeBeoordeling()
  }
}
