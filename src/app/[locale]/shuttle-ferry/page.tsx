import { notFound } from 'next/navigation';
import { getVenues } from '@/lib/clubtickets';
import CategoryClient from '@/components/nightlife/CategoryClient';

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const typeVenues = allVenues.filter(v => v.type.slug === 'boat');
  const filteredVenues = typeVenues.filter(v => v.name.toLowerCase().includes('aquabus') || v.name.toLowerCase().includes('shuttle'));

  const translations = {
    title: 'Shuttle Ferry',
    description: 'Ontdek de beste opties voor Shuttle Ferry in Ibiza.',
    allBtn: 'Alle Shuttle Ferry',
    searchPlaceholder: 'Zoeken...'
  };

  return <CategoryClient venues={filteredVenues} translations={translations} locale={params.locale} basePath="shuttle-ferry" />;
}