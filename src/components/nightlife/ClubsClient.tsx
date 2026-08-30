'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Sun, Moon } from 'lucide-react';
import { ClubLogoSlider } from '@/components/ui/ClubLogoSlider';
import { optImg } from '@/lib/img';

interface ClubsClientProps {
  venues: any[];
  locale: string;
  translations: {
    title: string;
    description: string;
    allClubs: string;
    searchPlaceholder: string;
  };
}

export default function ClubsClient({ venues, translations, locale }: ClubsClientProps) {
  const [filter, setFilter] = useState<'all' | 'day' | 'night'>('all');
  const [search, setSearch] = useState('');

  // When a category is picked in the bottom dock, glide to the top so the title +
  // the fresh grid are perfectly framed in one glance.
  const firstFilter = useRef(true);
  useEffect(() => {
    if (firstFilter.current) { firstFilter.current = false; return; }
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60);
    return () => clearTimeout(t);
  }, [filter]);

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

  // Autocomplete suggestions for the standalone search box
  const suggestions = useMemo(
    () => (search.trim() ? venues.filter(v => v.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6) : []),
    [venues, search]
  );
  const pickImg = (pred: (v: any) => boolean) => { const v = venues.find(pred); return v?.cover || v?.picture || ''; };
  const tabs: { key: 'all' | 'day' | 'night'; label: string; img: string }[] = [
    { key: 'all', label: translations.allClubs, img: pickImg(() => true) },
    { key: 'day', label: 'Day Clubs', img: pickImg(v => v.is_day_club) },
    { key: 'night', label: 'Night Clubs', img: pickImg(v => !v.is_day_club) },
  ];

  return (
    <div className="theme-monaco-vip min-h-screen bg-neutral-50 relative">
      <section className="pt-[calc(var(--nav-h)+12px)] pb-2 relative z-10 flex flex-col items-center text-center px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">
            {translations.title}
          </h1>
        </div>
      </section>

      <section className="relative z-10 pb-40 mt-2">
        <div className="wrap">

        {/* Standalone club search — with live suggestions */}
        <div className="relative mx-auto mb-10 w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={18} />
          <input
            type="text"
            placeholder={translations.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-black/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
              {suggestions.map(v => (
                <Link
                  key={v.id}
                  href={`/${locale}/club-tickets/${v.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-black/5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-neutral-900">
                    {(v.whitelogo || v.cover || v.picture) ? <img src={optImg(v.whitelogo || v.cover || v.picture, 100)} loading="lazy" alt="" className="max-h-full max-w-full object-contain" /> : null}
                  </span>
                  <span className="flex-1 truncate font-serif text-sm font-bold text-black">{v.name}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black/50">
                    {v.is_day_club ? <Sun size={10} /> : <Moon size={10} />}
                    {v.is_day_club ? 'Day' : 'Night'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => {
            // No stock-photo fallback: a generic Unsplash shot presented as this venue is
            // the same fabrication problem as an invented review. Better an empty tile.
            const imageUrl = venue.cover || venue.picture || '';
            return (
              <Link
                href={`/${locale}/club-tickets/${venue.slug}`}
                key={venue.id}
                className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[32px] border border-white/5 bg-black/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background image */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={venue.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : null}

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
      </section>

      {/* Club logo slider — below the tiles, above the private-yacht CTA */}
      <ClubLogoSlider clubLogos={venues} base={`/${locale}`} />

      {/* Fixed bottom dock — three category blocks (same style as the week bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-[55] border-t border-black/10 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-2 pt-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <div className="grid grid-cols-3 gap-1.5">
            {tabs.map(t => {
              const on = filter === t.key;
              // All clubs = red, Day clubs = black, Night clubs = electric blue (palette match)
              const bg = t.key === 'all' ? '#E14D68' : t.key === 'day' ? '#111111' : '#0E7C66';
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setFilter(t.key)}
                  style={{ backgroundColor: bg }}
                  className={`relative flex h-14 items-center justify-center overflow-hidden rounded-lg transition-all active:scale-95 ${on ? 'ring-[3px] ring-ibiza-green ring-offset-1 ring-offset-white' : ''}`}
                >
                  <span className="relative px-1 text-center font-serif text-sm font-black uppercase tracking-wide text-white drop-shadow">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
