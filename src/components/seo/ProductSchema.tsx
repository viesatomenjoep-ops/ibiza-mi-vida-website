interface ProductSchemaProps {
  name: string
  description: string
  priceFrom: number
  ratingValue?: string
  reviewCount?: number
  url: string
  image?: string
}

export function ProductSchema({
  name,
  description,
  priceFrom,
  ratingValue = '4.9',
  reviewCount = 87,
  url,
  image,
}: ProductSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ibizamivida.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: 'Ibiza mi vida',
    },
    image: image ?? `${siteUrl}/og-default.jpg`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: priceFrom.toString(),
      availability: 'https://schema.org/InStock',
      url,
      seller: {
        '@type': 'Organization',
        name: 'Ibiza mi vida',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
