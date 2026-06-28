import { getDictionary } from '@/dictionaries'
import ActivitiesClient from './ActivitiesClient'

export default async function ActivitiesPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <ActivitiesClient dict={dict} />
}
