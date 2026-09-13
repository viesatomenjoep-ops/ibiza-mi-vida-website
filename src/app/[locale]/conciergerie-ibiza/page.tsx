import type { Metadata } from 'next'
import { ConciergeGuide, conciergeMetadata } from '@/components/guides/ConciergeGuide'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Conciergegids — Franse slug.
 *
 * 'Conciergerie' is het Franse woord dat werkelijk gezocht wordt; 'concierge'
 * betekent in het Frans de portier van een gebouw. Zie de toelichting bij de
 * slugdefinitie in src/lib/route-slugs.ts.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return conciergeMetadata(loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <ConciergeGuide locale={loc(params.locale)} />
}
