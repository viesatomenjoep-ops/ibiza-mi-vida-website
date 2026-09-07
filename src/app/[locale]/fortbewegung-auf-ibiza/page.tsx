import type { Metadata } from 'next'
import { GettingAroundGuide, gettingAroundMetadata } from '@/components/guides/GettingAroundGuide'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Vervoersgids — Duitse slug.
 *
 * De taal komt uit `params.locale`; de tekst staat in
 * src/lib/getting-around-copy.ts en de structuur in
 * src/components/guides/GettingAroundGuide.tsx.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return gettingAroundMetadata(loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <GettingAroundGuide locale={loc(params.locale)} />
}
