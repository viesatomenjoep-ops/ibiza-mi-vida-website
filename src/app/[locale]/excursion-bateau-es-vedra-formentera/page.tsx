import type { Metadata } from 'next'
import { EsVedraTripGuide, esVedraTripMetadata } from '@/components/guides/EsVedraTripGuide'
import type { Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Franse slug van de Es Vedrà + Formentera-dagtocht (routekey
 * 'es-vedra-trip'). Structuur in EsVedraTripGuide.tsx, tekst in
 * es-vedra-trip-copy.ts; een verkeerde-taal-URL wordt door de middleware
 * naar de juiste slug gestuurd.
 */
const LOCALE: Locale = 'fr'

export async function generateMetadata(): Promise<Metadata> {
  return esVedraTripMetadata(LOCALE)
}

export default function Page() {
  return <EsVedraTripGuide locale={LOCALE} />
}
