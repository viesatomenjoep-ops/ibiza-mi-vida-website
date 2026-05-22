interface VenueSchemaProps {
  name: string
  slug: string
  description?: string
  image?: string
}

export function VenueSchema({ name, slug, description, image }: VenueSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NightClub',
    name,
    url: `${siteUrl}/club-tickets/${slug}`,
    description,
    image: image ?? `${siteUrl}/og-default.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ibiza',
      addressCountry: 'ES',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
