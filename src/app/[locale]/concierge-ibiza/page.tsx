import type { Metadata } from 'next'
import { ConciergeGuide, conciergeMetadata } from '@/components/guides/ConciergeGuide'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Conciergegids — de slug die NL, EN en DE delen.
 *
 * De taal komt uit `params.locale`; de tekst staat in
 * src/lib/concierge-copy.ts en de structuur in
 * src/components/guides/ConciergeGuide.tsx.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return conciergeMetadata(loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <ConciergeGuide locale={loc(params.locale)} />
}
