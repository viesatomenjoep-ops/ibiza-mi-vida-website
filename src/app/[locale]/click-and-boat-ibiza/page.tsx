import type { Metadata } from 'next'
import { PartnerDossierPage, dossierMetadata } from '@/components/guides/PartnerDossierPage'
import { CLICKANDBOAT_DOSSIER } from '@/lib/clickandboat-dossier-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Partnerdossier Click&Boat — in alle vijf de talen dezelfde slug (eigennaam).
 *
 * De taal komt uit `params.locale`; de tekst staat in
 * src/lib/clickandboat-dossier-copy.ts en de structuur in
 * src/components/guides/PartnerDossierPage.tsx.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return dossierMetadata(CLICKANDBOAT_DOSSIER, loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <PartnerDossierPage copy={CLICKANDBOAT_DOSSIER} locale={loc(params.locale)} />
}
