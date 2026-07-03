'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { EventsBackground } from '@/components/layout/EventsBackground';
import Image from 'next/image';
import { Calendar, MapPin, Tag, ChevronRight, Music, Ticket, ExternalLink } from 'lucide-react';
import { CSSClock } from '@/components/ui/CSSClock';

interface DatabaseDate {
  id: string;
  provider_id: string;
  name: string;
  date: string;
  prices: number | null;
  raw_prices?: string;
  raw_lineup?: string;
  aff_link: string | null;
  ct_events: {
    name: string;
    slug: string;
    logo: string;
    cover: string;
  } | null;
  ct_venues: {
    name: string;
    slug: string;
    logo: string;
    whitelogo: string;
    cover?: string;
  } | null;
}

interface Props {
  initialEvents: DatabaseDate[];
  locale: string;
}

export default function DealsOfTheDayClient({ initialEvents, locale }: Props) {
  const [clientToday, setClientToday] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'music' | 'events' | 'boats' | 'active'>('all');
  

  // 2. Generate date pills for the next 10 days starting from client's today
  const datePills = useMemo(() => {
    if (!clientToday) return [];
    const pills = [];
    const baseDate = new Date(clientToday);
    
    for (let i = 0; i < 10; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`;

      pills.push({
        dateStr,
        dayName: i === 0 
          ? (locale === 'nl' ? 'Vandaag' : 'Today') 
          : i === 1 
            ? (locale === 'nl' ? 'Morgen' : 'Tomorrow') 
            : d.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { month: 'short' })
      });
    }
    return pills;
  }, [clientToday, locale]);

  // 3. Helper to format a full readable date string
  const formatFullDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // 4. Filtering logic
  const filteredEvents = useMemo(() => {
    return initialEvents.filter(deal => {
      if (selectedDate !== 'all' && deal.date !== selectedDate) return false;
      if (selectedDate === 'all' && clientToday && deal.date < clientToday) return false;

      const eventName = deal.ct_events?.name?.toLowerCase() || '';
      const venueName = deal.ct_venues?.name?.toLowerCase() || '';
      const combined = `${eventName} ${venueName}`;
      const isBoat = combined.includes('boat') || combined.includes('boot') || combined.includes('cruise') || combined.includes('ferry');
      const isActive = combined.includes('activ') || combined.includes('sport') || combined.includes('water') || combined.includes('rental');

      if (categoryFilter === 'boats') return isBoat;
      if (categoryFilter === 'active') return isActive;
      if (categoryFilter === 'music') return !isBoat && !isActive && (combined.includes('dj') || combined.includes('music') || combined.includes('concert') || combined.includes('muziek') || combined.includes('night') || combined.includes('club'));
      if (categoryFilter === 'events') return !isBoat && !isActive;
      return true;
    });
  }, [initialEvents, selectedDate, categoryFilter, clientToday]);

  return (
    <div className="theme-monaco-vip bg-transparent text-[var(--color-ink)] min-h-screen pt-8 pb-24 relative overflow-hidden">
      <EventsBackground />
      
      {/* Inline styles for drifting keyframes animation */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-[140px]">
        
        {/* Breadcrumb */}
        

        {/* Hero Title + Clock inline */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl md:text-6xl font-black font-serif text-black leading-tight drop-shadow-md uppercase">
            Deals of the Day
          </h1>

          {/* Clock — compact, inline with title */}
          <div className="flex items-center gap-3 bg-black/5 border border-black/10 px-4 py-3 rounded-2xl backdrop-blur-md shrink-0">
            <CSSClock />
            <div className="leading-none">
              <small className="text-[9px] font-black uppercase tracking-widest text-ibiza-green block mb-1">Ibiza Local Time</small>
              <span className="text-xs font-bold text-black/60 uppercase tracking-wide block">Europe / Madrid</span>
            </div>
          </div>
        </div>

        {/* Removed filter and date selector per user request */}

        {/* Dynamic header showing active filter state */}
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-ibiza-green animate-ping shrink-0" />
            <h2 className="text-xl md:text-2xl font-serif font-black text-black uppercase tracking-wide">
              {selectedDate === 'all' 
                ? (locale === 'nl' ? 'Alle Aankomende Deals' : 'All Upcoming Deals')
                : formatFullDate(selectedDate)}
            </h2>
          </div>
          <span className="text-xs font-bold text-black/40 uppercase tracking-widest">
            {filteredEvents.length} {locale === 'nl' ? 'Deals gevonden' : 'Deals found'}
          </span>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-20 text-black/50 bg-black/5 rounded-3xl border border-black/10 backdrop-blur-sm">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30 text-ibiza-green" />
              <p className="font-semibold text-base mb-2">
                {locale === 'nl' 
                  ? 'Geen geplande events gevonden voor deze dag.' 
                  : 'No scheduled events found for this day.'}
              </p>
              <button 
                onClick={() => setSelectedDate('all')}
                className="mt-3 bg-black/5 border border-black/10 hover:bg-white/10 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all"
              >
                {locale === 'nl' ? 'Bekijk alle aankomende deals' : 'View all upcoming deals'}
              </button>
            </div>
          ) : (
            filteredEvents.map((deal) => {
              const venue = deal.ct_venues;
              const event = deal.ct_events;
              const image = event?.cover || event?.logo || venue?.cover;
              const logoSrc = venue?.whitelogo;
              const price = deal.prices;

              return (
                <div 
                  key={deal.id}
                  className="bg-black/5 hover:bg-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-black/10 hover:border-ibiza-green/60 transition-all duration-300 group flex flex-col hover:scale-[1.02]"
                >
                  <div className="h-48 relative bg-[#0D0509] overflow-hidden shrink-0">
                    {image ? (
                      <img src={image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-[#0D0509] to-neutral-900 flex flex-col items-center justify-center p-6 text-center group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.08)_0%,transparent_70%)]" />
                        <div className="w-12 h-12 rounded-full bg-black/5 border border-black/10 flex items-center justify-center mb-2 shadow-inner">
                          <Music className="w-5 h-5 text-ibiza-green/70 animate-pulse" />
                        </div>
                      </div>
                    )}
                    
                    {/* Price badge */}
                    {price && (
                      <div className="absolute top-4 right-4 bg-ibiza-green text-velvet-obsidian font-black text-sm px-3.5 py-1.5 rounded-xl shadow-lg transform rotate-3">
                        €{price.toFixed(0)}
                      </div>
                    )}

                    {/* Unified Logo Overlay Badge */}
                    {logoSrc && (
                      <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl bg-white border border-white/20 p-1.5 flex items-center justify-center shadow-lg z-10">
                        <img 
                          src={logoSrc} 
                          alt="" 
                          style={{ filter: !['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza'].includes(venue?.slug || '') ? 'brightness(0)' : 'none' }}
                          className="object-contain max-w-full max-h-full" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 text-black">
                    {selectedDate === 'all' && (
                      <div className="text-ibiza-green text-[10px] font-black tracking-widest uppercase mb-1.5">
                        {deal.date}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-black leading-snug mb-1 group-hover:text-ibiza-green transition-colors line-clamp-2">
                      {deal.name}
                    </h3>
                    <div className="text-xs font-semibold text-black/50 flex items-center gap-1.5 mb-5 mt-auto pt-3">
                      <MapPin size={14} className="text-black/40" /> {venue?.name || 'Ibiza'}
                    </div>
                    
                    {/* Dynamic dual booking check out buttons */}
                    <div className="pt-3 border-t border-black/10 flex gap-2 items-center">
                      <Link 
                        href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${event?.slug || 'event'}`}
                        className="flex-1 text-center bg-black/5 border border-black/10 hover:bg-white/10 hover:text-black text-black/80 font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-full transition-all"
                      >
                        Info
                      </Link>
                      {deal.aff_link ? (
                        <a 
                          href={deal.aff_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-ibiza-green text-velvet-obsidian hover:brightness-95 font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-full transition-all flex items-center justify-center gap-1 shadow-md"
                        >
                          Checkout <ExternalLink size={12} />
                        </a>
                      ) : (
                        <Link 
                          href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${event?.slug || 'event'}`}
                          className="flex-1 text-center bg-ibiza-green text-velvet-obsidian hover:brightness-95 font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-full transition-all"
                        >
                          Boek
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
