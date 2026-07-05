'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Sun, Moon } from 'lucide-react';

interface CategoryClientProps {
  venues: any[];
  locale: string;
  basePath: string;
  translations: {
    title: string;
    description: string;
    allBtn: string;
    searchPlaceholder: string;
  };
}

export default function CategoryClient({ venues, translations, locale, basePath }: CategoryClientProps) {
  const [search, setSearch] = useState('');

  const filteredVenues = useMemo(() => {
    return venues.filter(v => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [venues, search]);

  return (
    <div className="theme-monaco-vip min-h-screen bg-neutral-50 relative">
      <section className="pt-[calc(var(--nav-h)+16px)] pb-6 relative z-10 flex flex-col items-center text-center px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2 text-center mb-4">
            <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">
              {translations.title}
            </h1>
            <p className="font-sans text-base md:text-lg text-neutral-600 max-w-2xl mx-auto mt-6">
              {translations.description}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-24 mt-8">
        <div className="wrap">
          
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-black/5 p-4 rounded-3xl backdrop-blur-sm border border-black/10">
          
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 bg-black text-white shadow-lg`}
            >
              {translations.allBtn}
            </button>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => {
            const imageUrl = venue.cover || venue.picture || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80';
            return (
              <Link
                href={`/${locale}/${basePath}/${venue.slug}`}
                key={venue.id}
                className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[32px] border border-white/5 bg-black/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background image */}
                <Image
                  src={imageUrl}
                  alt={venue.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* White Logo overlay (optional, absolute center/top if exists) */}
                {venue.whitelogo && (
                  <div className="absolute top-6 left-6 z-10 w-20 h-10 relative">
                    <Image
                      src={venue.whitelogo}
                      alt={`${venue.name} logo`}
                      fill
                      className="object-contain filter brightness-100 drop-shadow-md"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-3 p-8">
                  
                  {/* Badge */}
                  <span className="self-start inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 font-serif text-[11px] font-bold uppercase tracking-wider text-ibiza-green">
                    Ibiza {new Date().getFullYear()}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-3xl font-bold leading-tight text-white group-hover:text-ibiza-green transition-colors duration-300">
                    {venue.name}
                  </h3>

                  {/* Description snippet if exists */}
                  {venue.description && (
                    <p className="text-sm font-light text-white/60 line-clamp-2 leading-relaxed">
                      {venue.description.replace(/<\/?[^>]+(>|$)/g, "")}
                    </p>
                  )}

                  {/* Action Link */}
                  <div className="mt-2 self-start">
                    <span className="inline-flex items-center gap-2 rounded-full bg-ibiza-green text-velvet-obsidian font-bold text-sm px-5 py-2.5 hover:brightness-95 transition-all duration-300 group-hover:gap-3">
                      Bekijk Tickets & Details
                      <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md">
            <p className="text-lg text-white/60">
              Geen clubs gevonden voor deze zoekopdracht.
            </p>
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
