import { notFound } from 'next/navigation';
import { getVenues } from '@/lib/clubtickets';
import CategoryClient from '@/components/nightlife/CategoryClient';

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const typeVenues = allVenues.filter(v => v.type.slug === 'activities');
  const filteredVenues = typeVenues.filter(v => true);

  const translations = {
    title: 'Activities',
    description: 'Ontdek de beste opties voor Activities in Ibiza.',
    allBtn: 'Alle Activities',
    searchPlaceholder: 'Zoeken...'
  };

  return <CategoryClient venues={filteredVenues} translations={translations} locale={params.locale} basePath="activities" />;
}