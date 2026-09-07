import type { Metadata } from 'next'
import { DressCodeGuide, dressCodeMetadata } from '@/components/guides/DressCodeGuide'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Dresscode-gids — Spaanse slug.
 *
 * De taal komt uit `params.locale` en staat hier bewust niet vast. Nederlands
 * en Duits delen dezelfde slug (`ibiza-club-dresscode`), dus één vaste taal in
 * dit bestand zou op `/de/…` Nederlandse tekst renderen. Een taalprefix in de
 * URL bepaalt de taal; de middleware stuurt een slug die niet bij de gevraagde
 * taal hoort naar de juiste variant.
 *
 * Alle tekst staat in src/lib/dress-code-copy.ts, de structuur in
 * src/components/guides/DressCodeGuide.tsx.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return dressCodeMetadata(loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <DressCodeGuide locale={loc(params.locale)} />
}
