import { getDictionary } from '@/lib/dictionary'
import ActivitiesClient from './ActivitiesClient'

export default async function ActivitiesPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <ActivitiesClient dict={dict} />
}
