import { getGoogleReviews } from '@/lib/google-reviews'
import { SITE_URL, SITE_NAME } from '@/lib/seo'

/**
 * AggregateRating + Review structured data, sourced ONLY from the live Google
 * Business Profile.
 *
 * By design this component takes NO props. Not an optional rating, not a
 * default count, not a fallback array — nothing a caller could pass in. The
 * only path to a number in this markup is the Places API response, so it is
 * structurally impossible for this component to emit a rating that did not come
 * from Google. When `getGoogleReviews()` returns null, or the profile has no
 * usable reviews, it returns null and emits no JSON-LD at all.
 *
 * That constraint is the whole point of the file. This site previously shipped
 * two schema components with hardcoded AggregateRating defaults (alongside a
 * page of five invented customers), which is a Google spam-policy violation —
 * self-serving review markup that no real review backs up. All of it was
 * deleted. Do not add a prop, a default value, or a "sensible fallback" here:
 * absent markup is correct when there is no real rating. See the header of
 * src/lib/google-reviews.ts.
 *
 * The AggregateRating is attached to the existing Organization by @id
 * (`${SITE_URL}/#organization`, declared in HomeJsonLd) rather than
 * redeclaring the business, so search engines merge it into the one entity.
 */
export async function ReviewSchema() {
  const data = await getGoogleReviews()
  if (!data || data.reviews.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.total,
          bestRating: 5,
          worstRating: 1,
        },
      },
      ...data.reviews.map((r) => ({
        '@type': 'Review',
        itemReviewed: { '@id': `${SITE_URL}/#organization` },
        author: { '@type': 'Person', name: r.author },
        datePublished: r.publishTime,
        reviewBody: r.text,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        publisher: { '@type': 'Organization', name: 'Google' },
      })),
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
