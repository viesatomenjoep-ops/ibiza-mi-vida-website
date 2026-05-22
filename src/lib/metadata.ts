import type { Metadata } from 'next'

const siteName = 'Ibiza mi vida'
const defaultDescription =
  'Book Ibiza club tickets, private boat charters, boat parties, and more with Ibiza mi vida — your premium Ibiza events agency.'

export function createMetadata({
  title,
  description = defaultDescription,
  path,
  image,
}: {
  title: string
  description?: string
  path: string
  image?: string
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'
  const url = `${siteUrl}${path}`
  const ogImage = image ?? `${siteUrl}/og-default.jpg`

  return {
    title: `${title} | ${siteName}`,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
  }
}
