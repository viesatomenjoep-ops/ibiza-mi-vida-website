import { permanentRedirect } from 'next/navigation'
import { pathFor } from '@/lib/route-slugs'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Teruggetrokken partnerdossier. De vijf `wiber-*`-URL's zijn op verzoek van
 * de eigenaar uit de index gehaald; het autoverhuurcluster
 * (`/car-rental-ibiza` en vertalingen) draagt die zoekintentie al én houdt de
 * Awin-deeplink, dus daar gaat de linkwaarde heen.
 *
 * 308 en geen 404: deze URL's stonden in de sitemap en waren intern gelinkt,
 * dus de index en de inkomende links verhuizen mee in plaats van dood te
 * lopen. Geen `generateMetadata` meer: die titel wordt nooit geserveerd en
 * zou wél met de pillar concurreren op dezelfde term.
 */
export default function Page({ params }: { params: { locale: string } }) {
  const l: Locale = (LOCALES as readonly string[]).includes(params.locale)
    ? (params.locale as Locale)
    : DEFAULT_LOCALE
  permanentRedirect(pathFor('car-rental', l))
}
