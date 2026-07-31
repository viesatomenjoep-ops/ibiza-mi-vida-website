import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'club-tickets')
}

import { redirect } from 'next/navigation';

interface Props {
  params: { locale: string };
}

// The Club Tickets overview page has been removed — its events now live in the
// calendar. Anyone landing here (or on old links) is sent to the calendar.
export default function ClubTicketsPage({ params }: Props) {
  redirect(`/${params.locale}/calendar`);
}
