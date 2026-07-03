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
      if (isToday(d)) return `Vandaag · ${format(d, 'd MMM', { locale: loc })}`;
      if (isTomorrow(d)) return `Morgen · ${format(d, 'd MMM', { locale: loc })}`;
      return format(d, 'EEEE d MMMM', { locale: loc });
    } catch { return ds; }
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
      <div className="ck-header pt-[140px]">
        <div className="ck-header-top">
          <div className="flex flex-col gap-2">
            
            <h1 className="text-4xl md:text-6xl font-black font-serif text-black leading-tight drop-shadow-md uppercase m-0">Evenementen</h1>
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
              ['today', `Vandaag`, todayCount],
              ['tomorrow', `Morgen`, tomorrowCount],
              ['week', `Deze week`, weekCount],
              ['all', `Alle`, null],
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
          BODY — Left list + Right preview
          ══════════════════════════════════════ */}
      <div className="ck-body">

        {/* LEFT: event stream */}
        <div className="ck-stream">
          {sortedDates.length === 0 ? (
            <div className="ck-empty">
              <Calendar size={40} style={{ color: '#ddd', marginBottom: 16 }} />
              <p>Geen events gevonden</p>
              {quickFilter !== 'all' && (
                <button className="ck-empty-action" onClick={() => setQuickFilter('all')}>
                  Bekijk alle events →
                </button>
              )}
            </div>
          ) : sortedDates.map(ds => (
            <div key={ds} className="ck-date-group">

              {/* Date heading */}
              <div className={`ck-date-hd ${isDateToday(ds) ? 'today' : ''}`}>
                <span className="ck-date-label">{dateLabel(ds)}</span>
                {isDateToday(ds) && <span className="ck-live-pill">● LIVE</span>}
                <span className="ck-date-count">{grouped[ds].length} events</span>
              </div>

              {/* Event rows */}
              {grouped[ds].map(ev => {
                const isFav = favorites.has(ev.id);
                const isActive = previewEvent?.id === ev.id;
                const eventTitle = ev.ct_events?.name || ev.name || '—';
                const venueLogoUrl = ev.ct_venues?.whitelogo;
                const venueName = ev.ct_venues?.name || '—';

                return (
                  <div
                    key={ev.id}
                    className={`ck-row ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => { setPreviewEvent(ev); setHoveredId(ev.id); }}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Venue badge */}
                    <div className="ck-row-venue">
                      {venueLogoUrl ? (
                        <img
                          src={venueLogoUrl}
                          alt={venueName}
                          className="ck-venue-logo"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="ck-venue-abbr">
                          {venueName.slice(0, 4).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="ck-row-info">
                      <div className="ck-row-title">{eventTitle}</div>
                      <div className="ck-row-meta">
                        <span className="ck-row-club">{venueName}</span>
                        {ev.prices && <span className="ck-row-price">v.a. €{ev.prices.split('-')[0].trim().replace('€','').trim()}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ck-row-actions">
                      <button
                        className={`ck-fav-btn ${isFav ? 'active' : ''}`}
                        onClick={e => toggleFav(ev.id, e)}
                        aria-label="Favoriet"
                        title={isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                      >
                        <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                      <Link
                        href={`/${locale}/club-tickets/${ev.ct_venues?.slug || 'club'}/${ev.ct_events?.slug || 'event'}`}
                        className="ck-ticket-btn"
                        onClick={e => e.stopPropagation()}
                      >
                        <Ticket size={12} />
                        <span>Tickets</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* RIGHT: sticky preview panel */}
        <div className="ck-preview-col">
          <div className="ck-preview-wrap">
            {previewEvent ? (
              <>
                {/* Image */}
                <div className="ck-preview-img-box">
                  {previewImg ? (
                    <Image
                      key={previewImg}
                      src={previewImg}
                      alt={previewEvent.ct_events?.name || previewEvent.name || ''}
                      fill
                      className="ck-preview-img"
                      sizes="360px"
                      priority={false}
                    />
                  ) : (
                    <div className="ck-preview-no-img">
                      <Calendar size={48} style={{ color: 'rgba(255,255,255,.15)' }} />
                    </div>
                  )}
                  <div className="ck-preview-gradient" />
                </div>

                {/* Info */}
                <div className="ck-preview-info">
                  <div className="ck-pi-venue">{previewEvent.ct_venues?.name}</div>
                  <div className="ck-pi-title">
                    {previewEvent.ct_events?.name || previewEvent.name}
                  </div>
                  <div className="ck-pi-meta">
                    <span>
                      <Calendar size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {dateLabel(previewEvent.date)}
                    </span>
                    {previewEvent.prices && (
                      <span>· v.a. €{previewEvent.prices.split('-')[0].trim().replace('€','').trim()}</span>
                    )}
                  </div>
                  {previewEvent.lineUp && (
                    <div className="ck-pi-lineup">
                      {previewEvent.lineUp.replace(/MAIN ROOM|THE BUNKER|ROOM [A-Z]/g, '·').replace(/^·\s*/, '').slice(0, 100)}
                    </div>
                  )}
                  <Link href={previewLink} className="ck-pi-cta">
                    <Ticket size={13} /> Koop Tickets
                  </Link>
                  <button
                    className={`ck-pi-fav ${favorites.has(previewEvent.id) ? 'active' : ''}`}
                    onClick={e => toggleFav(previewEvent.id, e)}
                  >
                    <Heart size={13} fill={favorites.has(previewEvent.id) ? 'currentColor' : 'none'} />
                    {favorites.has(previewEvent.id) ? 'Opgeslagen' : 'Favoriet'}
                  </button>
                </div>

                {/* Venue logo at bottom */}
                {previewEvent.ct_venues?.whitelogo && (
                  <div className="ck-pi-venue-logo">
                    <img
                      src={previewEvent.ct_venues.whitelogo}
                      alt={previewEvent.ct_venues.name}
                      className="ck-pi-vlogo-img"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="ck-preview-empty">
                <Calendar size={36} />
                <span>Hover over een event om een preview te zien</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
