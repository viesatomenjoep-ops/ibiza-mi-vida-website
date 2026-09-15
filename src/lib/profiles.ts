/**
 * Every external profile that is PROVABLY ours — the `sameAs` list.
 *
 * This is the field a search engine or a language model uses to decide that
 * @ibizamivida on Instagram, the Google Business Profile and ibizamivida.com
 * are one entity. It used to live in two places (SchemaMarkup and HomeJsonLd)
 * with two slightly different lists, which is the one thing `sameAs` must
 * never do: two lists describe two entities.
 *
 * Rules:
 *  - Confirmed URLs only. A guessed profile URL claims an account we may not
 *    own, and that is hard to undo once it is indexed.
 *  - Canonical form, no tracking parameters (TikTok appends
 *    ?is_from_webapp=… when copied from the app; Google Maps' /maps/place/…
 *    URL carries session parameters — the cid form below is the stable one).
 *  - Profiles that do not exist yet (Trustpilot, TripAdvisor) come in through
 *    an env var, so switching them on is a Vercel setting, not a deploy that
 *    somebody has to remember. Empty var = not listed.
 */
const CONFIRMED = [
  'https://www.instagram.com/ibizamivida/',
  'https://www.tiktok.com/@ibizamivida',
  // Het Google Bedrijfsprofiel, in de stabiele cid-vorm.
  'https://maps.google.com/?cid=2584947247658109964',
]

/** Optional profile URLs, added only when the env var is set to a URL. */
const OPTIONAL_ENV = [
  'NEXT_PUBLIC_GOOGLE_BUSINESS_URL',
  'NEXT_PUBLIC_TRUSTPILOT_URL',
  'NEXT_PUBLIC_TRIPADVISOR_URL',
  'NEXT_PUBLIC_FACEBOOK_URL',
  'NEXT_PUBLIC_YOUTUBE_URL',
] as const

function isHttpsUrl(v: string | undefined): v is string {
  return !!v && /^https:\/\/[^\s]+$/i.test(v.trim())
}

export function sameAs(): string[] {
  const out = [...CONFIRMED]
  for (const key of OPTIONAL_ENV) {
    const v = process.env[key]
    if (isHttpsUrl(v) && !out.includes(v.trim())) out.push(v.trim())
  }
  return out
}
