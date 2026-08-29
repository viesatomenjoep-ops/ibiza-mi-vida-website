import { SITE_URL, SITE_NAME } from '@/lib/seo'

/**
 * Service structured data for the commercial category pages (boat charters,
 * ferry, guestlist, boat parties).
 *
 * Why this exists: those pages had no structured data at all, so both Google
 * and answer engines had to infer what is actually being sold from prose.
 * Service + areaServed + provider states it explicitly — what the service is,
 * that it's offered on Ibiza, and who provides it — which is the difference
 * between "a page mentioning boat charters" and "a business that charters
 * boats in Ibiza".
 *
 * `provider` points at the existing Organization node (@id from HomeJsonLd)
 * rather than redeclaring the business, so search engines merge these into one
 * entity instead of seeing several unrelated companies with the same name.
 *
 * priceFrom is optional and must only be passed when a real "from" price is
 * shown on the page — inventing prices in markup that don't appear on-page is
 * a structured-data policy violation.
 */
export function ServiceSchema({
  name,
  description,
  path,
  serviceType,
  priceFrom,
  image,
}: {
  name: string
  description: string
  /** locale-prefixed path, e.g. `en/private-boat-charters` */
  path: string
  /** schema.org-friendly service category, e.g. "Boat charter" */
  serviceType: string
  /** lowest real price shown on the page, in EUR */
  priceFrom?: number
  image?: string
}) {
  const url = `${SITE_URL}/${path.replace(/^\//, '')}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    serviceType,
    url,
    ...(image ? { image } : {}),
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'Place', name: 'Ibiza, Spain' },
      { '@type': 'Place', name: 'Formentera, Spain' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      availableLanguage: ['nl', 'en', 'de', 'es', 'fr'],
    },
    ...(priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            price: priceFrom,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
