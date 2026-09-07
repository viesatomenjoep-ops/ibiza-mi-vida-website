import type { Metadata } from 'next'
import { AirportTransferGuide, airportTransferMetadata } from '@/components/guides/AirportTransferGuide'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Luchthaventransfer — Nederlandse slug.
 *
 * De taal komt uit `params.locale`; de tekst staat in
 * src/lib/airport-transfer-copy.ts en de structuur in
 * src/components/guides/AirportTransferGuide.tsx.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return airportTransferMetadata(loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <AirportTransferGuide locale={loc(params.locale)} />
}
