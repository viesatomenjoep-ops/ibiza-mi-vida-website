import { getDictionary } from '@/lib/dictionary'
import GuestlistClient from './GuestlistClient'

export default async function GuestlistPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <GuestlistClient dict={dict} />
}
