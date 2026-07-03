'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Sun, Moon } from 'lucide-react';

import { EventsBackground } from '@/components/layout/EventsBackground';

interface ClubsClientProps {
  venues: any[];
  translations: {
    title: string;
    description: string;
    allClubs: string;
    searchPlaceholder: string;
  };
}

export default function ClubsClient({ venues, translations }: ClubsClientProps) {
  const [filter, setFilter] = useState<'all' | 'day' | 'night'>('all');
  const [search, setSearch] = useState('');

  const filteredVenues = useMemo(() => {
    return venues.filter(v => {
      // 1. Search filter
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // 2. Day/Night filter
      if (filter === 'day' && !v.is_day_club) return false;
      if (filter === 'night' && v.is_day_club) return false;
      return true;
    });
  }, [venues, filter, search]);

  return (
    <div className="theme-monaco-vip bg-transparent text-[var(--color-ink)] min-h-screen pt-4 pb-24 relative overflow-hidden">
      <EventsBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-black mt-2">
            {translations.title}
          </h1>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 bg-black/5 backdrop-blur-md p-4 rounded-3xl border border-black/10 shadow-lg">
          
          {/* Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-full font-serif text-sm font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-ibiza-green text-velvet-obsidian shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {translations.allClubs}
            </button>
            <button
              onClick={() => setFilter('day')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-full font-serif text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                filter === 'day'
                  ? 'bg-ibiza-green text-velvet-obsidian shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <Sun size={15} />
              Day Clubs
            </button>
            <button
              onClick={() => setFilter('night')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-full font-serif text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                filter === 'night'
                  ? 'bg-ibiza-green text-velvet-obsidian shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <Moon size={15} />
              Night Clubs
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder={translations.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-ibiza-green focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => {
            const imageUrl = venue.cover || venue.picture || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80';
            return (
              <Link
                href={`/${(typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en')}/club-tickets/${venue.slug}`}
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
                    {venue.is_day_club ? <Sun size={10} /> : <Moon size={10} />}
                    {venue.is_day_club ? 'Day Club' : 'Night Club'}
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
                      Bekijk Feesten
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
    </div>
  );
}
