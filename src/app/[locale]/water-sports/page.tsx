import { notFound } from 'next/navigation';
import { getVenues } from '@/lib/clubtickets';
import CategoryClient from '@/components/nightlife/CategoryClient';

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const typeVenues = allVenues.filter(v => v.type.slug === 'activities');
  const filteredVenues = typeVenues.filter(v => v.name.toLowerCase().includes('jet') || v.name.toLowerCase().includes('sup') || v.name.toLowerCase().includes('parasailing'));

  const translations = {
    title: 'Water Sports',
    description: 'Ontdek de beste opties voor Water Sports in Ibiza.',
    allBtn: 'Alle Water Sports',
    searchPlaceholder: 'Zoeken...'
  };

  return <CategoryClient venues={filteredVenues} translations={translations} locale={params.locale} basePath="water-sports" />;
}