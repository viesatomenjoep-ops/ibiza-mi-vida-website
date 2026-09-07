import type { Metadata } from 'next'
import { PartnerDossierPage, dossierMetadata } from '@/components/guides/PartnerDossierPage'
import { WIBER_DOSSIER } from '@/lib/wiber-dossier-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Partnerdossier Wiber — Franse slug.
 *
 * De taal komt uit `params.locale`; de tekst staat in
 * src/lib/wiber-dossier-copy.ts en de structuur in
 * src/components/guides/PartnerDossierPage.tsx.
 */
const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return dossierMetadata(WIBER_DOSSIER, loc(params.locale))
}

export default function Page({ params }: { params: { locale: string } }) {
  return <PartnerDossierPage copy={WIBER_DOSSIER} locale={loc(params.locale)} />
}
