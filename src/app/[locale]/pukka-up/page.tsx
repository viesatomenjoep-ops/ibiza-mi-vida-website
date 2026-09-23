import type { Metadata } from 'next'
import { TripCollectionGuide, tripPageMetadata } from '@/components/guides/TripCollectionGuide'
import { PUKKA_UP } from '@/lib/pukka-up-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Pukka Up-merkpagina — slug identiek in vijf talen, dus één routemap; de
 * taal komt uit params.locale (zelfde patroon als concierge-ibiza).
 * Structuur in TripCollectionGuide.tsx, tekst in pukka-up-copy.ts.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return tripPageMetadata(PUKKA_UP, loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <TripCollectionGuide copy={PUKKA_UP} locale={loc(params.locale)} />
}
