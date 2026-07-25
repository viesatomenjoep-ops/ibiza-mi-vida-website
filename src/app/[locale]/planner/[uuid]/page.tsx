import type { Metadata } from 'next'
import PlannerDashboard from './PlannerDashboard'

export const metadata: Metadata = {
  title: 'Your Private Ibiza Planner',
  description:
    'Your personal VIP concierge dashboard — flights, villa, transfers, day-to-day itinerary and downloadable vouchers, all in one secure private link.',
  robots: { index: false, follow: false },
}

export default function PlannerPage({
  params,
}: {
  params: { locale: string; uuid: string }
}) {
  return <PlannerDashboard uuid={params.uuid} locale={params.locale} />
}
