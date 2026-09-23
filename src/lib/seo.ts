import type { Metadata } from 'next'

// ── Central SEO configuration ──────────────────────────────────────────
// Single source of truth for the canonical domain, locales and the helpers
// that build canonical + hreflang alternates and per-page metadata.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ibizamivida.com').replace(/\/$/, '')
export const SITE_NAME = 'Ibiza mi vida'
export const TWITTER_HANDLE = '@ibizamivida'

export const LOCALES = ['nl', 'en', 'de', 'es', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
// English. This drives the `x-default` hreflang — the version search engines
// serve to users whose language matches none of ours — and the fallback when a
// locale param is invalid. It was 'nl', which told Google to send the entire
// unmatched world to the Dutch site, matching the old middleware default.
export const DEFAULT_LOCALE: Locale = 'en'

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
/**
 * A true sentence used to bring a too-short meta description up to length.
 *
 * Google truncates a description around 155–160 characters, but a description
 * far UNDER that wastes the space — and hundreds of pages here were generating
 * 90-to-110-character descriptions from a name plus a generic tail, which is
 * the single largest category of on-page problem on this site.
 *
 * Everything here has to be true of every page it can land on, because it lands
 * on all of them. It describes how this business actually works — a local team,
 * confirmation over WhatsApp before booking — and claims nothing about the
 * specific venue, boat or event the page is about. Do not add a figure, a
 * promise or a superlative to these strings: they cannot be verified per page.
 */
const DESC_TAIL: Record<Locale, string> = {
  nl: 'Ons team woont op Ibiza en bevestigt data, prijzen en beschikbaarheid via WhatsApp voordat je boekt.',
  en: 'Our team lives on Ibiza and confirms dates, prices and availability over WhatsApp before you book.',
  de: 'Unser Team lebt auf Ibiza und bestätigt Termine, Preise und Verfügbarkeit per WhatsApp vor der Buchung.',
  es: 'Nuestro equipo vive en Ibiza y confirma fechas, precios y disponibilidad por WhatsApp antes de reservar.',
  fr: 'Notre équipe vit à Ibiza et confirme dates, prix et disponibilités par WhatsApp avant votre réservation.',
}

/**
 * Een tweede ware zin, voor het geval de eerste de ondergrens niet haalt.
 *
 * De staart hierboven is ~100 tekens, dus een bron van een paar woorden ("TAKE
 * OFF") kwam daarmee op ~110 uit en bleef onder de 140 — precies de gevallen
 * die in de baseline stonden. Deze zin beschrijft het aanbod van de site en
 * geldt daarmee op elke pagina waar hij kan landen; hij zegt niets over de
 * specifieke club, boot of avond. Zelfde regel als hierboven: geen cijfer,
 * geen belofte, geen superlatief.
 */
const DESC_TAIL_2: Record<Locale, string> = {
  nl: 'Clubtickets, boten en activiteiten op Ibiza op één plek.',
  en: 'Club tickets, boats and activities in Ibiza, all in one place.',
  de: 'Clubtickets, Boote und Aktivitäten auf Ibiza an einem Ort.',
  es: 'Entradas de club, barcos y actividades en Ibiza en un solo lugar.',
  fr: 'Billets de club, bateaux et activités à Ibiza au même endroit.',
}

/** Google's useful range. Below the minimum the snippet wastes space; above the
 *  maximum it gets cut off mid-sentence in the results. */
const DESC_MIN = 140
const DESC_MAX = 158

/**
 * Bring a description into the 140–158 range: pad a short one with DESC_TAIL,
 * trim a long one at a word boundary. Never returns something outside the range
 * unless the tail itself cannot close the gap, which it can for any input.
 */
export function fitDescription(text: string, locale: Locale): string {
  // Leestekens aan de voorkant weg: de partnerfeed levert beschrijvingen die
  // met een punt of een streepje beginnen, en die kwamen als ". Ons team woont
  // op Ibiza…" in de zoekresultaten terecht.
  let out = (text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s.,;:\-–—]+/, '')
    .trim()
  for (const tail of [DESC_TAIL[locale], DESC_TAIL_2[locale]]) {
    if (out.length >= DESC_MIN) break
    out = out ? `${out.replace(/[\s.]+$/, '')}. ${tail}` : tail
  }
  return truncateAtWord(out, DESC_MAX)
}


/**
 * Trim to a length without breaking a word, and without leaving dangling
 * punctuation. Falls back to a hard cut only if the text has no spaces at all.
 */
export function truncateAtWord(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  const base = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut
  return base.replace(/[\s,;:.\-–—]+$/, '') + '…'
}

export function pageMetadata({ locale, path = '', title, description, images, noindex }: PageMetaInput): Metadata {
  // Eén doorgang voor élke pagina. Routes die hun beschrijving zelf schreven en
  // `fitDescription` oversloegen (`/this-week`, de homepage) landden anders
  // buiten de 140–160 die Google bruikbaar toont — en dat is niet te zien aan
  // de aanroep. Nog een keer fitten is onschadelijk: binnen bereik verandert er
  // niets.
  description = fitDescription(description, locale)
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
