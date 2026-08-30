import { SITE_URL, SITE_NAME, type Locale } from '@/lib/seo'
import { HOME_DESC } from '@/lib/seo-pages'
import { FOUNDER_ID, founderNode } from '@/lib/team'

/**
 * Homepage structured data: Organization + WebSite (with SearchAction) +
 * TravelAgency/LocalBusiness. Rendered once on the homepage so Google can build
 * rich results (sitelinks search box, knowledge panel, business info).
 */
export function HomeJsonLd({ locale = 'nl' }: { locale?: string }) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const ogImage = `${SITE_URL}/og-default.jpg`
  // Same localized "bio" everywhere Google can surface it: Knowledge Panel
  // (Organization), rich result business card (TravelAgency), and the page's
  // own meta description (page.tsx) — one consistent story, five languages.
  const bio = HOME_DESC[locale as Locale] || HOME_DESC.en

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-clean.png`,
    image: ogImage,
    description: bio,
    ...(phone ? { telephone: `+${phone}` } : {}),
    // Elk profiel dat aantoonbaar van dit bedrijf is. Dit is het veld waarmee
    // een zoekmachine of taalmodel deze site koppelt aan wat er elders over ons
    // staat, en dat is waar het merendeel van de vermeldingen vandaan komt —
    // zonder deze koppeling moeten ze zelf raden dat @ibizamivida hetzelfde
    // bedrijf is als ibizamivida.com.
    //
    // Alleen kanalen waarvan de URL bevestigd is. Een gokje dat naar een
    // vreemd of leeg profiel wijst is erger dan een korte lijst: dan claim je
    // een account dat niet van jou is, en dat is lastig terug te draaien.
    // Canonieke URL's, zonder tracking-parameters — TikTok plakt er
    // ?is_from_webapp=... achter als je hem uit de app kopieert, en die hoort
    // hier niet in.
    //
    // Aanvullen zodra ze bestaan: Google Bedrijfsprofiel en TripAdvisor.
    sameAs: [
      'https://www.instagram.com/ibizamivida/',
      'https://www.tiktok.com/@ibizamivida',
    ],
    // E-E-A-T: names a real person behind the business. Referenced by @id — the
    // Person itself is emitted alongside, and declared identically on /about-us
    // and /contact, so all of them merge into one entity.
    founder: { '@id': FOUNDER_ID },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/calendar?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const business = {
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    image: ogImage,
    ...(phone ? { telephone: `+${phone}` } : {}),
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ibiza',
      addressRegion: 'Balearic Islands',
      addressCountry: 'ES',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 38.9067, longitude: 1.4206 },
    areaServed: { '@type': 'Place', name: 'Ibiza, Spain' },
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    description: bio,
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [organization, founderNode(), website, business],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
