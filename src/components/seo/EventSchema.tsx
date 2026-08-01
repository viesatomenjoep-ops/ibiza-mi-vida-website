interface EventSchemaProps {
  name: string
  startDate: string
  venueName: string
  description?: string
  priceFrom?: number
  image?: string
  lineup?: string[]
  pageUrl: string
  /** 'MusicEvent' for club nights (default); 'Event' for tours/activities/boats. */
  type?: 'MusicEvent' | 'Event'
}

export function EventSchema({
  name,
  startDate,
  venueName,
  description,
  priceFrom,
  image,
  lineup = [],
  pageUrl,
  type = 'MusicEvent',
}: EventSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    startDate,
    description,
    image: image ?? `${siteUrl}/og-default.jpg`,
    location: {
      '@type': 'Place',
      name: venueName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ibiza',
        addressCountry: 'ES',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Ibiza mi vida',
      url: siteUrl,
    },
    ...(lineup.length > 0 && {
      performer: lineup.map((artist) => ({
        '@type': 'MusicGroup',
        name: artist,
      })),
    }),
    ...(priceFrom !== undefined && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: priceFrom.toString(),
        availability: 'https://schema.org/InStock',
        url: pageUrl,
        validFrom: new Date().toISOString(),
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
