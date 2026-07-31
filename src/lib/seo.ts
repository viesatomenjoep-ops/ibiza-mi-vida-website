import type { Metadata } from 'next'

// ── Central SEO configuration ──────────────────────────────────────────
// Single source of truth for the canonical domain, locales and the helpers
// that build canonical + hreflang alternates and per-page metadata.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com').replace(/\/$/, '')
export const SITE_NAME = 'Ibiza mi vida'
export const TWITTER_HANDLE = '@ibizamivida'

export const LOCALES = ['nl', 'en', 'de', 'es', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'nl'

// hreflang uses the bare language codes; OpenGraph wants a locale tag.
export const OG_LOCALE: Record<Locale, string> = {
  nl: 'nl_NL',
  en: 'en_GB',
  de: 'de_DE',
  es: 'es_ES',
  fr: 'fr_FR',
}

/** Absolute URL for a path (path may be with or without a leading slash). */
export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL
  return `${SITE_URL}/${path.replace(/^\//, '')}`
}

/**
 * Canonical + hreflang alternates for a page.
 * @param locale  the current locale
 * @param path    the locale-agnostic path, e.g. '' for home or '/calendar'
 */
export function buildAlternates(locale: Locale, path = ''): NonNullable<Metadata['alternates']> {
  const clean = path ? `/${path.replace(/^\//, '')}` : ''
  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${clean}`
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${clean}`
  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages,
  }
}

interface PageMetaInput {
  locale: Locale
  path?: string
  title: string
  description: string
  images?: string[]
  noindex?: boolean
}

/** Build a complete Metadata object (canonical, hreflang, OG, Twitter) for a page. */
export function pageMetadata({ locale, path = '', title, description, images, noindex }: PageMetaInput): Metadata {
  const url = `${SITE_URL}/${locale}${path ? `/${path.replace(/^\//, '')}` : ''}`
  const ogImages = (images && images.length ? images : ['/og-default.jpg']).map((src) =>
    src.startsWith('http') ? src : absoluteUrl(src),
  )
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: ogImages.map((u) => ({ url: u, width: 1200, height: 630, alt: title })),
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: ogImages,
    },
  }
}
