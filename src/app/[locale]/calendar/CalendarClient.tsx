'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { EventsBackground } from '@/components/layout/EventsBackground';
import Image from 'next/image';
import { format, addDays, isToday, isTomorrow, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Heart, Ticket, ChevronLeft, ChevronRight, Search, X, SlidersHorizontal, Calendar, Clock } from 'lucide-react';

interface CalEvent {
  id: string;
  name: string;
  date: string;
  prices: string;
  lineUp: string;
  ct_events: { name?: string; slug?: string; logo?: string; cover?: string };
  ct_venues: { name?: string; slug?: string; whitelogo?: string; type_slug?: string };
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

export default function CalendarClient({ events, allVenues, allArtists, dict, locale, initialMonth }: CalendarClientProps) {
  const loc = getLoc(locale);
  const today = useMemo(() => new Date(), []);
  const todayStr = format(today, 'yyyy-MM-dd');

  // ── State ──
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('today');
  const [activeMonth, setActiveMonth] = useState(initialMonth || format(today, 'yyyy-MM'));
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewEvent, setPreviewEvent] = useState<CalEvent | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cal_favs') || '[]');
      setFavorites(new Set(saved));
    } catch {}
  }, []);

  const toggleFav = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('cal_favs', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  // ── Week bounds ──
  const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');

  // ── Filtered events ──
  const filtered = useMemo(() => {
    let evs = [...events];

    // Quick filter
    if (quickFilter === 'today') evs = evs.filter(e => e.date === todayStr);
    else if (quickFilter === 'tomorrow') evs = evs.filter(e => e.date === tomorrowStr);
    else if (quickFilter === 'week') evs = evs.filter(e => e.date >= weekStart && e.date <= weekEnd);
    else evs = evs.filter(e => e.date.startsWith(activeMonth));

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
  }, [events, quickFilter, activeMonth, selectedVenue, searchQuery, todayStr, tomorrowStr, weekStart, weekEnd]);

  // Group by date
  const grouped = useMemo(() => {
    const m: Record<string, CalEvent[]> = {};
    filtered.forEach(e => { if (!m[e.date]) m[e.date] = []; m[e.date].push(e); });
    return m;
  }, [filtered]);

  const sortedDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // Set initial preview
  useEffect(() => {
    const first = filtered.find(e => e.ct_events?.cover || e.ct_events?.logo);
    if (first) setPreviewEvent(first);
  }, [filtered]);

  // Unique months for selector
  const months = useMemo(() => {
    const s = new Set<string>();
    events.forEach(e => { if (e.date) s.add(e.date.slice(0, 7)); });
    return Array.from(s).sort();
  }, [events]);

  // Venues with events (for filter)
  const activeVenues = useMemo(() => {
    const slugs = new Set(events.map(e => e.ct_venues?.slug).filter(Boolean));
    return allVenues.filter(v => slugs.has(v.slug));
  }, [events, allVenues]);

  // Preview image/info
  const previewImg = previewEvent?.ct_events?.cover || previewEvent?.ct_events?.logo;
  const previewLink = previewEvent
    ? `/${locale}/club-tickets/${previewEvent.ct_venues?.slug || 'club'}/${previewEvent.ct_events?.slug || 'event'}`
    : '#';

  // Date display helper
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
    <div className="ck-shell bg-transparent">
      <EventsBackground />

      {/* ══════════════════════════════════════
          HEADER
          ══════════════════════════════════════ */}
      <div className="ck-header pt-[140px] flex flex-col items-center text-center">
        <div className="ck-header-top w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight">KALENDER</h1>
          </div>

          {/* Search bar */}
          <div className="ck-search">
            <Search size={14} className="ck-search-icon" />
            <input
              type="text"
              placeholder="Zoek event, artiest of club..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ck-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="ck-search-clear">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── Quick time filters ── */}
        <div className="ck-quick-bar">
          <div className="ck-quick-tabs">
            {([
              ['today', dict.cal_today || `Vandaag`, todayCount],
              ['tomorrow', dict.cal_tomorrow || `Morgen`, tomorrowCount],
              ['week', dict.cal_this_week || `Deze week`, weekCount],
              ['all', dict.cal_all || `Alle`, null],
            ] as [QuickFilter, string, number | null][]).map(([key, label, count]) => (
              <button
                key={key}
                className={`ck-qtab ${quickFilter === key ? 'active' : ''}`}
                onClick={() => { setQuickFilter(key); if (key === 'all') setActiveMonth(format(today, 'yyyy-MM')); }}
              >
                {label}
                {count !== null && count > 0 && <span className="ck-qtab-badge">{count}</span>}
              </button>
            ))}
          </div>

          <div className="ck-filter-actions">
            {/* Venue filter dropdown */}
            <button
              className={`ck-filter-btn ${(selectedVenue || filtersOpen) ? 'active' : ''}`}
              onClick={() => setFiltersOpen(v => !v)}
            >
              <SlidersHorizontal size={12} />
              {selectedVenue ? allVenues.find(v => v.slug === selectedVenue)?.name || selectedVenue : 'Club'}
              {selectedVenue && (
                <span onClick={e => { e.stopPropagation(); setSelectedVenue(null); }} className="ck-filter-clear">
                  <X size={10} />
                </span>
              )}
            </button>

            <span className="ck-result-count">{filtered.length} events</span>
          </div>
        </div>

        {/* ── Venue filter dropdown ── */}
        {filtersOpen && (
          <div className="ck-venue-dropdown">
            <button
              className={`ck-venue-chip ${!selectedVenue ? 'active' : ''}`}
              onClick={() => { setSelectedVenue(null); setFiltersOpen(false); }}
            >
              Alle clubs
            </button>
            {activeVenues.map(v => (
              <button
                key={v.slug}
                className={`ck-venue-chip ${selectedVenue === v.slug ? 'active' : ''}`}
                onClick={() => { setSelectedVenue(v.slug); setFiltersOpen(false); }}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        {/* ── Month selector (only in 'all' mode) ── */}
        {quickFilter === 'all' && (
          <div className="ck-month-bar">
            {months.map(mo => {
              let label = mo;
              try {
                const [y, m] = mo.split('-').map(Number);
                label = format(new Date(y, m - 1, 1), 'MMM yy', { locale: loc }).toUpperCase();
              } catch {}
              return (
                <button
                  key={mo}
                  className={`ck-month-tab ${activeMonth === mo ? 'active' : ''}`}
                  onClick={() => setActiveMonth(mo)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          BODY — Large Event Cards
          ══════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        {sortedDates.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200 mt-8">
              <Calendar size={40} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500 font-medium">Geen events gevonden</p>
            </div>
        ) : sortedDates.map(ds => (
            <div key={ds} className="mt-12">
              {/* Date heading */}
              <div className="flex items-center gap-4 mb-6 pb-2 border-b-2 border-black/10">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-black tracking-tight">{dateLabel(ds)}</h3>
                {isDateToday(ds) && <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Live</span>}
              </div>

              {/* Event rows */}
              <div className="flex flex-col gap-6">
                {grouped[ds].map(ev => {
                  const eventTitle = ev.ct_events?.name || ev.name || '—';
                  const venueName = ev.ct_venues?.name || '—';
                  const image = ev.ct_events?.cover || ev.ct_events?.logo || ev.ct_venues?.whitelogo;
                  
                  return (
                    <div key={ev.id} className="group bg-white rounded-[32px] border border-neutral-200 shadow-sm hover:shadow-xl hover:border-black/20 transition-all overflow-hidden flex flex-col md:flex-row">
                      
                      {/* Image / Artist */}
                      <div className="w-full md:w-72 h-72 md:h-auto shrink-0 relative p-6 bg-neutral-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100">
                        {image ? (
                           <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner border-[6px] border-white">
                             <img src={image} alt={eventTitle} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           </div>
                        ) : (
                           <div className="w-full h-full rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400 font-bold border-[6px] border-white text-3xl">
                             {venueName.slice(0,2)}
                           </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center bg-white">
                        <div className="text-sm font-bold tracking-widest text-neutral-400 uppercase mb-2">{venueName}</div>
                        <h4 className="text-2xl md:text-4xl font-serif font-bold text-black leading-tight mb-4">{eventTitle}</h4>
                        {ev.lineUp && (
                          <p className="text-neutral-500 text-sm leading-relaxed mb-8 line-clamp-2">
                            {ev.lineUp.replace(/MAIN ROOM|THE BUNKER|ROOM [A-Z]/g, '·').replace(/^·\s*/, '')}
                          </p>
                        )}
                        <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-neutral-100">
                          {ev.prices && <div className="text-2xl font-bold text-black">{dict.event_from_price || 'v.a.'} €{ev.prices.split('-')[0].trim().replace('€','').trim()}</div>}
                          <Link
                            href={`/${locale}/club-tickets/${ev.ct_venues?.slug || 'club'}/${ev.ct_events?.slug || 'event'}`}
                            className="bg-black hover:bg-neutral-800 text-white font-bold tracking-widest text-xs uppercase px-8 py-4 rounded-full transition-colors w-full sm:w-auto sm:ml-auto text-center"
                          >
                            {dict.event_buy_tickets || 'Koop Tickets'}
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
