import type { Metadata } from 'next'
import { ConciergeGuide, conciergeMetadata } from '@/components/guides/ConciergeGuide'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Conciergegids — Spaanse slug.
 *
 * 'Conserjería' staat hier en niet 'concierge' omdat het Spaans een eigen
 * woord heeft dat mensen ook echt intypen. Zie de toelichting bij de
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
