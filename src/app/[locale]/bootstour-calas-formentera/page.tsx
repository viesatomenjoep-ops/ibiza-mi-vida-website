import type { Metadata } from 'next'
import { TripCollectionGuide, tripPageMetadata } from '@/components/guides/TripCollectionGuide'
import { CALAS_TRIP } from '@/lib/calas-trip-copy'
import type { Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Duitse slug van de Calas de Formentera-dagtocht (routekey 'calas-trip').
 * Structuur in TripCollectionGuide.tsx, tekst in calas-trip-copy.ts; een
 * verkeerde-taal-URL wordt door de middleware naar de juiste slug gestuurd.
 */
const LOCALE: Locale = 'de'

export async function generateMetadata(): Promise<Metadata> {
  return tripPageMetadata(CALAS_TRIP, LOCALE)
}

export default function Page() {
  return <TripCollectionGuide copy={CALAS_TRIP} locale={LOCALE} />
}
