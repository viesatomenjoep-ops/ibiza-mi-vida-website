interface VenueSchemaProps {
  name: string
  slug: string
  description?: string
  image?: string
  /** Locale-agnostic base path, e.g. 'club-tickets' (default) or 'activities'. */
  basePath?: string
  /** 'NightClub' for clubs (default); use 'TouristAttraction' for activities/boats. */
  type?: 'NightClub' | 'TouristAttraction'
  locale?: string
}

export function VenueSchema({ name, slug, description, image, basePath = 'club-tickets', type = 'NightClub', locale }: VenueSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ibizamivida.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url: `${siteUrl}${locale ? `/${locale}` : ''}/${basePath}/${slug}`,
    description: description ? description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) : undefined,
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
