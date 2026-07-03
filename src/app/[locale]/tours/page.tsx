import { notFound } from 'next/navigation';
import { getVenues } from '@/lib/clubtickets';
import CategoryClient from '@/components/nightlife/CategoryClient';

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const typeVenues = allVenues.filter(v => v.type.slug === 'activities');
  const filteredVenues = typeVenues.filter(v => v.name.toLowerCase().includes('buggy') || v.name.toLowerCase().includes('excursion') || v.name.toLowerCase().includes('safari'));

  const translations = {
    title: 'Tours',
    description: 'Ontdek de beste opties voor Tours in Ibiza.',
    allBtn: 'Alle Tours',
    searchPlaceholder: 'Zoeken...'
  };

  return <CategoryClient venues={filteredVenues} translations={translations} locale={params.locale} basePath="tours" />;
}