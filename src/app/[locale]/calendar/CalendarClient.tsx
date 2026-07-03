'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, addDays, isToday, isTomorrow, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Search, X, Calendar, MapPin, ChevronRight } from 'lucide-react';

interface CalEvent {
  id: string;
  name: string;
  date: string;
  prices: string;
  lineUp: string;
  ct_events: { name?: string; slug?: string; logo?: string; cover?: string };
  ct_venues: { name?: string; slug?: string; whitelogo?: string; logo?: string; type_slug?: string; image?: string; picture?: string };
}

interface CalendarClientProps {
  events: CalEvent[];
  allVenues: any[];
  allArtists: any[];
  dict: any;
  locale: string;
  initialMonth: string;
}

const getLoc = (locale: string) => ({ nl, de, es, en: enUS }[locale] || enUS);
type QuickFilter = 'today' | 'tomorrow' | 'week' | 'all';
type CategoryFilter = 'all' | 'clubbing' | 'boat';

export default function CalendarClient({ events, allVenues, allArtists, dict, locale, initialMonth }: CalendarClientProps) {
  const loc = getLoc(locale);
  const today = useMemo(() => new Date(), []);
  const todayStr = format(today, 'yyyy-MM-dd');

  // ── State ──
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('today');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [activeMonth, setActiveMonth] = useState(initialMonth || format(today, 'yyyy-MM'));
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Week bounds ──
  const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');

  const venuesMap = useMemo(() => new Map(allVenues.map(v => [v.slug, v])), [allVenues]);

  // Venues with events
  const activeVenues = useMemo(() => {
    const slugs = new Set(events.map(e => e.ct_venues?.slug).filter(Boolean));
    return allVenues.filter(v => slugs.has(v.slug));
  }, [events, allVenues]);

  // Venues to show based on category
  const visibleVenues = useMemo(() => {
    if (categoryFilter === 'all') return activeVenues;
    if (categoryFilter === 'clubbing') return activeVenues.filter(v => v.type_slug === 'clubbing');
    if (categoryFilter === 'boat') return activeVenues.filter(v => v.type_slug === 'boat-party');
    return activeVenues;
  }, [activeVenues, categoryFilter]);

  // ── Filtered events ──
  const filtered = useMemo(() => {
    let evs = [...events];

    // Quick time filter
    if (quickFilter === 'today') evs = evs.filter(e => e.date === todayStr);
    else if (quickFilter === 'tomorrow') evs = evs.filter(e => e.date === tomorrowStr);
    else if (quickFilter === 'week') evs = evs.filter(e => e.date >= weekStart && e.date <= weekEnd);
    else evs = evs.filter(e => e.date.startsWith(activeMonth));

    // Category filter
    if (categoryFilter === 'clubbing') evs = evs.filter(e => e.ct_venues?.type_slug === 'clubbing');
    if (categoryFilter === 'boat') evs = evs.filter(e => e.ct_venues?.type_slug === 'boat-party');

    // Venue filter
    if (selectedVenue) evs = evs.filter(e => e.ct_venues?.slug === selectedVenue);

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      evs = evs.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.ct_events?.name?.toLowerCase().includes(q) ||
        e.ct_venues?.name?.toLowerCase().includes(q) ||
        e.lineUp?.toLowerCase().includes(q)
      );
    }

    return evs.sort((a, b) => a.date.localeCompare(b.date));
  }, [events, quickFilter, activeMonth, selectedVenue, searchQuery, todayStr, tomorrowStr, weekStart, weekEnd, categoryFilter]);

  // Group by date
  const grouped = useMemo(() => {
    const m: Record<string, CalEvent[]> = {};
    filtered.forEach(e => { if (!m[e.date]) m[e.date] = []; m[e.date].push(e); });
    return m;
  }, [filtered]);

  const sortedDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // Unique months for selector
  const months = useMemo(() => {
    const s = new Set<string>();
    events.forEach(e => { if (e.date) s.add(e.date.slice(0, 7)); });
    return Array.from(s).sort();
  }, [events]);

  const dateLabel = (ds: string) => {
    try {
      const d = parseISO(ds);
      if (isToday(d)) return `${dict.cal_today || 'Vandaag'} · ${format(d, 'd MMM', { locale: loc })}`;
      if (isTomorrow(d)) return `${dict.cal_tomorrow || 'Morgen'} · ${format(d, 'd MMM', { locale: loc })}`;
      return format(d, 'EEEE d MMMM', { locale: loc });
    } catch {
      return ds;
    }
  };

  const isDateToday = (ds: string) => ds === todayStr;

  // Counts
  const todayCount = events.filter(e => e.date === todayStr).length;
  const tomorrowCount = events.filter(e => e.date === tomorrowStr).length;
  const weekCount = events.filter(e => e.date >= weekStart && e.date <= weekEnd).length;

  return (
    <div className="theme-monaco-vip bg-neutral-50 text-[var(--color-ink)] min-h-screen relative overflow-hidden">
      {selectedVenue && (
        <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
          <img 
            src={venuesMap.get(selectedVenue)?.whitelogo || venuesMap.get(selectedVenue)?.picture} 
            alt="Venue background" 
            className="w-full h-full object-cover blur-sm scale-110"
          />
        </div>
      )}

      <div className="ck-header relative z-10 pt-[240px] md:pt-[280px] flex flex-col items-center text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">EVENTS</h1>
        <p className="mt-4 md:mt-6 max-w-xl mx-auto text-sm md:text-base lg:text-lg font-medium text-black/70 px-4 leading-relaxed tracking-wide drop-shadow-sm">
          {dict.calendar_subtitle || "Vind de beste feesten en events op Ibiza. Selecteer een datum of club en plan je perfecte avond."}
        </p>
      </div>

      <div className="ck-header-top w-full max-w-7xl mx-auto flex flex-col items-center gap-6 px-4 mt-8">
        <div className="relative w-full max-w-xl mt-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Zoek event, artiest of club..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-black/10 rounded-full py-3 md:py-4 pl-12 pr-10 text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-ibiza-green transition-all shadow-md font-bold"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 px-4 w-full max-w-7xl">
          {[
            ['all', 'Alle Events'],
            ['clubbing', 'Clubs'],
            ['boat', 'Op het Water']
          ].map(([key, label]) => (
            <button
              key={key}
              className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm border-2 transition-all duration-300 shadow-sm ${categoryFilter === key ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-200 hover:border-black'}`}
              onClick={() => { setCategoryFilter(key as CategoryFilter); setSelectedVenue(null); }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Quick Time */}
        <div className="flex flex-wrap justify-center gap-3 mt-4 mb-8 px-4 w-full max-w-7xl">
            {([
              ['today', dict.cal_today || `Vandaag`, todayCount],
              ['tomorrow', dict.cal_tomorrow || `Morgen`, tomorrowCount],
              ['week', dict.cal_this_week || `Deze week`, weekCount],
              ['all', dict.cal_all || `Alle`, null],
            ] as [QuickFilter, string, number | null][]).map(([key, label, count]) => (
              <button
                key={key}
                className={`relative overflow-hidden px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm border-2 transition-all duration-300 shadow-sm ${quickFilter === key ? 'bg-ibiza-green text-black border-ibiza-green shadow-[0_0_15px_rgba(20,255,0,0.3)]' : 'bg-white text-black border-neutral-200 hover:border-black'}`}
                onClick={() => { setQuickFilter(key); if (key === 'all') setActiveMonth(format(today, 'yyyy-MM')); }}
              >
                {label}
                {count !== null && count > 0 && <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-black ${quickFilter === key ? 'bg-black text-ibiza-green' : 'bg-neutral-100 text-black'}`}>{count}</span>}
              </button>
            ))}
        </div>

        {/* Venue Selector Row */}
        <div className="w-full max-w-7xl mx-auto px-4 mb-10 overflow-hidden relative">
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-4 px-2 snap-x hide-scrollbar mask-edges">
            <button
              className={`snap-start shrink-0 flex flex-col items-center gap-3 group w-20 md:w-24`}
              onClick={() => setSelectedVenue(null)}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full transition-all duration-300 ${!selectedVenue ? 'bg-ibiza-green text-black border-2 border-ibiza-green shadow-[0_0_20px_rgba(20,255,0,0.5)] scale-110' : 'bg-white text-neutral-400 border-2 border-neutral-200 group-hover:border-black group-hover:text-black group-hover:scale-105'}`}>
                <MapPin size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />
              </div>
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest text-center line-clamp-2 ${!selectedVenue ? 'text-ibiza-green' : 'text-neutral-500 group-hover:text-black'}`}>
                Alle {categoryFilter === 'all' ? 'Venues' : categoryFilter === 'clubbing' ? 'Clubs' : 'Boats'}
              </span>
            </button>
            {visibleVenues.map(v => {
              const vImg = v.logo || v.picture || v.whitelogo || v.image;
              const isActive = selectedVenue === v.slug;
              return (
                <button
                  key={v.slug}
                  className={`snap-start shrink-0 flex flex-col items-center gap-3 group w-20 md:w-24`}
                  onClick={() => setSelectedVenue(v.slug)}
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 p-1 ${isActive ? 'scale-110 drop-shadow-[0_0_15px_rgba(20,255,0,0.5)]' : 'group-hover:scale-105'}`}>
                    {vImg ? (
                      <img src={vImg} alt={v.name} className={`w-full h-full object-contain ${isActive ? 'brightness-0' : 'brightness-0 opacity-60 group-hover:opacity-100'}`} />
                    ) : (
                      <span className={`text-2xl font-black ${isActive ? 'text-ibiza-green' : 'text-black opacity-60 group-hover:opacity-100'}`}>{v.name.slice(0,2)}</span>
                    )}
                  </div>
                  <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest text-center line-clamp-2 ${isActive ? 'text-ibiza-green' : 'text-neutral-900 group-hover:text-black'}`}>
                    {v.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {quickFilter === 'all' && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
            {months.map(mo => {
              let label = mo;
              try {
                const [y, m] = mo.split('-').map(Number);
                label = format(new Date(y, m - 1, 1), 'MMM yy', { locale: loc }).toUpperCase();
              } catch {}
              return (
                <button
                  key={mo}
                  className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all ${activeMonth === mo ? 'bg-black text-white border-black' : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'}`}
                  onClick={() => setActiveMonth(mo)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {sortedDates.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-neutral-100 mt-8 shadow-sm">
              <Calendar size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-lg">Geen events gevonden</p>
            </div>
        ) : sortedDates.map(ds => (
            <div key={ds} className="mt-12">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black/5">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight">{dateLabel(ds)}</h3>
                  {isDateToday(ds) && <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">Live</span>}
                </div>
                <div className="text-neutral-400 font-bold uppercase tracking-widest text-xs">{grouped[ds].length} Events</div>
              </div>

              {/* Event Grid (2 cols mobile, 6 cols desktop) */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {grouped[ds].map(ev => {
                  const eventTitle = ev.ct_events?.name || ev.name || '—';
                  const venueName = ev.ct_venues?.name || '—';
                  const image = ev.ct_events?.cover || ev.ct_events?.logo || ev.ct_venues?.whitelogo || ev.ct_venues?.logo;
                  
                  return (
                    <Link href={`/${locale}/club-tickets/${ev.ct_venues?.slug || 'club'}/${ev.ct_events?.slug || 'event'}`} key={ev.id} className="group flex flex-col bg-white rounded-2xl md:rounded-3xl border-2 border-transparent hover:border-ibiza-green shadow-lg hover:shadow-[0_0_30px_rgba(20,255,0,0.2)] transition-all overflow-hidden h-full">
                      <div className="w-full aspect-square relative bg-neutral-100 flex items-center justify-center border-b border-neutral-100 p-4">
                        {image ? (
                           <img src={image} alt={eventTitle} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" />
                        ) : (
                           <div className="text-neutral-300 font-bold text-3xl">{venueName.slice(0,2)}</div>
                        )}
                        {ev.prices && (
                          <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-black px-2 py-1 rounded-full z-10 shadow-md">
                            €{ev.prices.split('-')[0].trim().replace('€','').trim()}
                          </div>
                        )}
                      </div>

                      <div className="p-3 md:p-4 flex-1 flex flex-col bg-white">
                        <div className="text-[9px] md:text-[10px] font-black tracking-widest text-ibiza-green uppercase mb-1 line-clamp-1">{venueName}</div>
                        <h4 className="text-sm md:text-base font-serif font-bold text-black leading-tight mb-2 line-clamp-2">{eventTitle}</h4>
                        <div className="mt-auto pt-2 border-t border-neutral-100">
                          <span className="text-[10px] md:text-xs font-bold text-neutral-400 group-hover:text-black transition-colors uppercase tracking-widest flex items-center justify-between">
                            Tickets <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}} />
    </div>
  );
}
