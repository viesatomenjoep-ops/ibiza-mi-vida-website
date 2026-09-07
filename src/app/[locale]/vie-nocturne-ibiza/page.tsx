import type { Metadata } from 'next'
import { NightlifeGuide, nightlifeMetadata } from '@/components/guides/NightlifeGuide'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Uitgaansgids — Franse slug.
 *
 * De taal komt uit `params.locale`; de tekst staat in
 * src/lib/nightlife-copy.ts en de structuur in
 * src/components/guides/NightlifeGuide.tsx.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return nightlifeMetadata(loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <NightlifeGuide locale={loc(params.locale)} />
}
