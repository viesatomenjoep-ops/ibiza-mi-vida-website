import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import PrivateBoatChartersClient from './PrivateBoatChartersClient'

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

  return <PrivateBoatChartersClient locale={locale} />
}
