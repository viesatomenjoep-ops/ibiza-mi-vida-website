const fs = require('fs');
const path = require('path');

const categories = [
  { slug: 'shuttle-ferry', apiType: 'boat', name: 'Shuttle Ferry', filter: "v => v.name.toLowerCase().includes('aquabus') || v.name.toLowerCase().includes('shuttle')" },
  { slug: 'ferry-formentera', apiType: 'formentera-day-trip', name: 'Ferry Formentera', filter: "v => true" },
  { slug: 'activities', apiType: 'activities', name: 'Activities', filter: "v => true" },
  { slug: 'tours', apiType: 'activities', name: 'Tours', filter: "v => v.name.toLowerCase().includes('buggy') || v.name.toLowerCase().includes('excursion') || v.name.toLowerCase().includes('safari')" },
  { slug: 'water-sports', apiType: 'activities', name: 'Water Sports', filter: "v => v.name.toLowerCase().includes('jet') || v.name.toLowerCase().includes('sup') || v.name.toLowerCase().includes('parasailing')" }
];

const templateEventPage = (cat) => `
import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { EventDetailPage } from '@/components/templates/EventDetailPage'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
}

export default async function EventPage({ params }: Props) {
  const venues = await getVenues(params.locale);
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === '${cat.apiType}');
  if (!venue) notFound();

  const allDates = await getAllDates(params.locale);
  const eventDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug);
  if (eventDates.length === 0) notFound();

  return (
    <EventDetailPage 
      eventDates={eventDates as any} 
      eventSlug={params.eventSlug}
      club={venue as any} 
      locale={params.locale} 
      basePath="${cat.slug}"
    />
  )
}
`;

categories.forEach(cat => {
  const dir = path.join(__dirname, '..', 'src', 'app', '[locale]', cat.slug);
  const slugDir = path.join(dir, '[slug]');
  const eventDir = path.join(slugDir, '[eventSlug]');
  
  fs.writeFileSync(path.join(eventDir, 'page.tsx'), templateEventPage(cat).trim());
});

console.log("Pages fixed!");
