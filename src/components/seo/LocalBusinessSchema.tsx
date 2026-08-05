interface LocalBusinessSchemaProps {
  ratingValue?: string
  reviewCount?: number
}

export function LocalBusinessSchema({
  ratingValue = '4.9',
  reviewCount = 127,
}: LocalBusinessSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '33666528412'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Ibiza mi vida',
    url: siteUrl,
    telephone: `+${phone}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ibiza',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.9067,
      longitude: 1.4206,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: '€€€',
    image: `${siteUrl}/og-default.jpg`,
    description:
      'Premium Ibiza events and booking agency. Private boat charters, club tickets, boat parties, VIP catamaran, Formentera trips and more.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
