import type { Metadata } from 'next'
import { TripCollectionGuide, tripPageMetadata } from '@/components/guides/TripCollectionGuide'
import { FLOAT_YOUR_BOAT } from '@/lib/float-your-boat-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Float Your Boat-merkpagina — slug identiek in vijf talen, dus één routemap; de
 * taal komt uit params.locale (zelfde patroon als concierge-ibiza).
 * Structuur in TripCollectionGuide.tsx, tekst in float-your-boat-copy.ts.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return tripPageMetadata(FLOAT_YOUR_BOAT, loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <TripCollectionGuide copy={FLOAT_YOUR_BOAT} locale={loc(params.locale)} />
}
