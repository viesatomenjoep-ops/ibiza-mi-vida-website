import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getVenues } from '@/lib/clubtickets';
import { CategoryHero } from '@/components/hero/CategoryHero';
import { getPageContent } from '@/lib/page-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Ibiza Boat Party Tickets — Sunset & Party Cruises',
  description:
    'Book Ibiza boat party tickets with Ibiza mi vida. Sunset cruises, music boat parties, and group celebrations on the Mediterranean.',
}

interface Props {
  params: {
    locale: string;
  };
}

export default async function BoatPartiesPage({ params }: Props) {
  const allVenues = await getVenues(params.locale);
  // Only show boat venues
  const boats = allVenues.filter(v => v.type.slug === 'boat');

  const pageContent = await getPageContent('boat-party', {
    title: "Ibiza Boat Parties",
    subtitle: "Dance on the open sea. Ibiza's best boat parties — sunset cruises, full-day music events, and private group celebrations.",
    backgroundImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85"
  });

  return (
    <>
      <div className="min-h-screen text-white pb-20">
        <CategoryHero
          title={pageContent.title}
          subtitle={pageContent.subtitle}
          backgroundImage={pageContent.backgroundImage}
          colorTheme="indigo"
          eyebrow="Ibiza 2026"
        />

        <section id="boats" className="mx-auto max-w-7xl px-4 pt-8 pb-16 md:px-8 md:pb-24 mt-8 bg-ibiza-sand/90 backdrop-blur-md rounded-3xl relative z-20 border border-white/50 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boats.map((boat) => (
              <Link href={`/${params.locale}/boat-parties/${boat.slug}`} key={boat.id} className="bg-white/95 text-velvet-obsidian rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-[380px]">
                <div className="relative h-full w-full overflow-hidden">
                  <Image 
                    src={boat.cover || boat.picture || 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80'} 
                    alt={boat.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {boat.type && (
                    <div className="absolute top-4 right-4 bg-[#00A698]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                      {boat.type.name}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center transform transition-transform duration-300">
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 drop-shadow-md">{boat.name}</h3>
                    
                    <span className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-[#00A698] text-white backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-all duration-300">
                      View Event Calendar
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14m-7-7 7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {boats.length === 0 && (
            <div className="text-center py-20 text-velvet-obsidian/60">
              <p>No boat parties available at the moment. Please check back later.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
