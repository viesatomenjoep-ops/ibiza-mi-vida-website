import type { Metadata } from 'next'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { getDictionary } from '@/lib/dictionary'
import PrivateBoatChartersClient from './PrivateBoatChartersClient'
import { PageFaq } from '@/components/seo/PageFaq'
import { BoatAdviceCta } from '@/components/boats/BoatAdviceCta'
import { SailingRoutes } from '@/components/boats/SailingRoutes'
import { AuthorByline } from '@/components/seo/AuthorByline'

export const revalidate = 3600

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isNl = locale === 'nl';
  return {
    title: isNl ? 'Privé Boot Huren Ibiza | Luxe Yacht Charters 2026' : 'Private Boat Hire Ibiza | Luxury Yacht Charters 2026',
    description: isNl 
      ? 'Huur een luxe jacht of motorboot op Ibiza met kapitein. Inclusief brandstof, drankjes en snorkels. Vaar naar Formentera of Es Vedrà.' 
      : 'Hire a luxury yacht or motorboat in Ibiza with captain. Including fuel, drinks and snorkel gear. Sail to Formentera or Es Vedrà.',
  }
}

export default async function PrivateBoatChartersPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const sc = SERVICE_COPY['private-boat-charters']

  return (
    <>
      <ServiceSchema name={sc.name[l]} description={sc.description[l]} serviceType={sc.serviceType} path={`${l}/private-boat-charters`} />
      <PrivateBoatChartersClient locale={locale} />
      <SailingRoutes locale={locale} />
      <BoatAdviceCta locale={locale} />
      <PageFaq pageKey="private-boat-charters" locale={locale} />
      <AuthorByline locale={locale} topic="private boat charters in Ibiza" />
    </>
  )
}
