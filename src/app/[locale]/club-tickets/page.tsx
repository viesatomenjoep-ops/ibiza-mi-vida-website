

import { permanentRedirect } from 'next/navigation';

interface Props {
  params: { locale: string };
}

// The Club Tickets overview page has been removed — its events now live in the
// calendar. Anyone landing here (or on old links) is sent to the calendar.
export default function ClubTicketsPage({ params }: Props) {
  permanentRedirect(`/${params.locale}/calendar`);
}
