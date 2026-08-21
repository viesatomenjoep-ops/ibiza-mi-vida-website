'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, addDays, isToday, isTomorrow, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Search, X, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { optImg } from '@/lib/img';

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
type QuickFilter = 'today' | 'tomorrow' | 'week' | 'month' | 'all';
type CategoryFilter = 'all' | 'clubbing' | 'boat';

// Clubtickets venue types that count as "Op het Water"
const WATER_SLUGS = ['boat', 'formentera-day-trip'];
const isWater = (slug?: string) => !!slug && WATER_SLUGS.includes(slug);
const isClub = (slug?: string) => slug === 'clubbing';

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
    if (categoryFilter === 'clubbing') return activeVenues.filter(v => isClub(v.type_slug));
    if (categoryFilter === 'boat') return activeVenues.filter(v => isWater(v.type_slug));
    return activeVenues;
  }, [activeVenues, categoryFilter]);

  // ── Filtered events ──
  const filtered = useMemo(() => {
    let evs = [...events];

    // Quick time filter
    if (quickFilter === 'today') evs = evs.filter(e => e.date === todayStr);
    else if (quickFilter === 'tomorrow') evs = evs.filter(e => e.date === tomorrowStr);
    else if (quickFilter === 'week') evs = evs.filter(e => e.date >= weekStart && e.date <= weekEnd);
    else if (quickFilter === 'month') evs = evs.filter(e => e.date.startsWith(activeMonth));
    else evs = evs.filter(e => e.date >= todayStr); // 'all' = alle aankomende events

    // Category filter
    if (categoryFilter === 'clubbing') evs = evs.filter(e => isClub(e.ct_venues?.type_slug));
    if (categoryFilter === 'boat') evs = evs.filter(e => isWater(e.ct_venues?.type_slug));

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

  // Counts (respecting the active category so the numbers match what's shown)
  const inCategory = (e: CalEvent) =>
    categoryFilter === 'all' ? true :
    categoryFilter === 'clubbing' ? isClub(e.ct_venues?.type_slug) :
    isWater(e.ct_venues?.type_slug);
  const todayCount = events.filter(e => e.date === todayStr && inCategory(e)).length;
  const tomorrowCount = events.filter(e => e.date === tomorrowStr && inCategory(e)).length;
  const weekCount = events.filter(e => e.date >= weekStart && e.date <= weekEnd && inCategory(e)).length;
  const monthCount = events.filter(e => e.date.startsWith(activeMonth) && inCategory(e)).length;
  const allCount = events.filter(e => e.date >= todayStr && inCategory(e)).length;

  const activeMonthLabel = (() => {
    try {
      const [y, m] = activeMonth.split('-').map(Number);
      return format(new Date(y, m - 1, 1), 'MMMM', { locale: loc });
    } catch { return ''; }
  })();

  const timeTabs: { key: QuickFilter; label: string; count: number }[] = [
    { key: 'today', label: dict.cal_today || 'Vandaag', count: todayCount },
    { key: 'tomorrow', label: dict.cal_tomorrow || 'Morgen', count: tomorrowCount },
    { key: 'week', label: dict.cal_this_week || 'Deze week', count: weekCount },
    { key: 'month', label: dict.cal_this_month || 'Deze maand', count: monthCount },
    { key: 'all', label: dict.cal_all || 'Alles', count: allCount },
  ];

  const catTabs: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: dict.cal_cat_all || 'Alles' },
    { key: 'clubbing', label: dict.cal_cat_clubs || 'Clubs' },
    { key: 'boat', label: dict.cal_cat_water || 'Op het Water' },
  ];

  return (
    <div className="theme-monaco-vip bg-neutral-50 text-[var(--color-ink)] min-h-screen relative overflow-x-clip">
      {selectedVenue && (
        <div className="absolute top-0 left-0 w-full h-[50vh] z-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
          <img
            src={optImg(venuesMap.get(selectedVenue)?.whitelogo || venuesMap.get(selectedVenue)?.picture, 800)} loading="lazy"
            alt="Venue background"
            className="w-full h-full object-cover blur-sm scale-110"
          />
        </div>
      )}

      <div className="relative z-10 pt-[calc(var(--nav-h)+16px)] pb-2 flex flex-col items-center text-center px-4">
        <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-black/40 mb-2">Ibiza Agenda {format(today, 'yyyy')}</p>
        <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-none uppercase m-0 tracking-tight drop-shadow-sm">EVENTS</h1>
        <p className="text-sm md:text-base text-black/50 font-medium mt-3 max-w-md">{dict.cal_subtitle || 'Ontdek wat er vandaag, deze week en deze maand te doen is op het eiland.'}</p>
      </div>

        {/* ── Tactical selector bar (sticky) ── */}
        <div className="sticky top-[70px] md:top-[84px] z-40 mt-5 bg-neutral-50/95 backdrop-blur-md border-y border-black/5">
          <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col items-center gap-3">

            {/* Primary: time range segmented control */}
            <div className="w-full overflow-x-auto hide-scrollbar">
              <div className="flex md:justify-center gap-2 min-w-max mx-auto">
                {timeTabs.map(tab => {
                  const active = quickFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setQuickFilter(tab.key)}
                      aria-pressed={active}
                      className={`group flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-xs md:text-sm font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${active ? 'bg-black text-white border-black shadow-lg scale-[1.03]' : 'bg-white text-black/55 border-black/10 hover:border-black hover:text-black'}`}
                    >
                      {tab.label}
                      <span className={`text-[10px] leading-none font-black rounded-full px-1.5 py-1 min-w-[20px] text-center ${active ? 'bg-white/20 text-white' : 'bg-black/5 text-black/40 group-hover:bg-black/10'}`}>{tab.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary: category pills + search */}
            <div className="w-full flex flex-wrap items-center justify-center gap-2">
              {catTabs.map(tab => {
                const active = categoryFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setCategoryFilter(tab.key); setSelectedVenue(null); }}
                    aria-pressed={active}
                    className={`rounded-full px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all ${active ? 'bg-ibiza-green text-black border-ibiza-green shadow-[0_0_12px_rgba(61,106,150,0.35)]' : 'bg-white text-black/50 border-black/10 hover:border-black hover:text-black'}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
              <div className="relative ml-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.cal_search || 'Zoek event of artiest…'}
                  className="w-44 md:w-64 rounded-full border border-black/10 bg-white pl-8 pr-8 py-1.5 text-xs font-medium text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} aria-label="Zoekopdracht wissen" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Month picker — only in 'Deze maand' mode */}
            {quickFilter === 'month' && (
              <div className="w-full overflow-x-auto hide-scrollbar">
                <div className="flex md:justify-center gap-2 min-w-max mx-auto pt-1">
                  {months.map(mo => {
                    let label = mo;
                    try {
                      const [y, m] = mo.split('-').map(Number);
                      label = format(new Date(y, m - 1, 1), 'MMM yy', { locale: loc }).toUpperCase();
                    } catch {}
                    const active = activeMonth === mo;
                    return (
                      <button
                        key={mo}
                        onClick={() => setActiveMonth(mo)}
                        className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${active ? 'bg-black text-white border-black' : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Venue Selector Row */}
        <div className="w-full max-w-7xl mx-auto px-4 mb-2 overflow-hidden relative">
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 pt-4 px-2 snap-x hide-scrollbar mask-edges">
            <button
              className={`snap-start shrink-0 flex flex-col items-center gap-3 group w-20 md:w-24`}
              onClick={() => setSelectedVenue(null)}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full transition-all duration-300 ${!selectedVenue ? 'bg-black text-white border-2 border-black scale-110 shadow-lg' : 'bg-white text-black border-2 border-black/20 group-hover:border-black group-hover:bg-black/5 group-hover:scale-105'}`}>
                <MapPin size={18} strokeWidth={3} />
              </div>
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest text-center line-clamp-2 ${!selectedVenue ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>
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
                  <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full overflow-hidden bg-white border-2 transition-all duration-300 ${isActive ? 'border-ibiza-green shadow-[0_0_15px_rgba(61,106,150,0.3)] scale-110' : 'border-black/10 group-hover:border-black/30 group-hover:scale-105'}`}>
                    {vImg ? (
                      <img src={optImg(vImg, 160)} loading="lazy" alt={v.name} className={`w-full h-full object-contain p-2`} />
                    ) : (
                      <span className={`text-2xl font-black ${isActive ? 'text-black' : 'text-black/40 group-hover:text-black'}`}>{v.name.slice(0,2)}</span>
                    )}
                  </div>
                  <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest text-center line-clamp-2 ${isActive ? 'text-ibiza-green' : 'text-black/60 group-hover:text-black'}`}>
                    {v.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 pt-4">
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
                  
                  const affiliateLink = (ev.ct_events as any)?.affLink || `/${locale}/club-tickets/${ev.ct_venues?.slug || 'club'}/${ev.ct_events?.slug || 'event'}`;

                  return (
                    <a href={affiliateLink} target={affiliateLink.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" key={ev.id} className="group flex flex-col bg-white rounded-2xl md:rounded-3xl border-2 border-transparent hover:border-black shadow-md hover:shadow-xl transition-all overflow-hidden h-full">
                      <div className="w-full aspect-square relative bg-neutral-100 flex items-center justify-center p-0 border-b border-black/5">
                        {image ? (
                           <img src={optImg(image, 400)} loading="lazy" alt={eventTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                        <div className="text-[9px] md:text-[10px] font-black tracking-widest text-black uppercase mb-1 line-clamp-1">{venueName}</div>
                        <h4 className="text-sm md:text-base font-serif font-bold text-black leading-tight mb-2 line-clamp-2">{eventTitle}</h4>
                        <div className="mt-auto pt-2 border-t border-neutral-100">
                          <span className="text-[10px] md:text-xs font-bold text-neutral-400 group-hover:text-black transition-colors uppercase tracking-widest flex items-center justify-between">
                            Tickets <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </a>
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
