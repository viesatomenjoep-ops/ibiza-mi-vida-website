'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Calendar, ChevronRight, Search, X, Grid, List, Ticket } from 'lucide-react';

interface CalendarClientProps {
  events: any[];
  allVenues: any[];
  allArtists: any[];
  dict: any;
  locale: string;
  initialMonth: string;
}

const getLocaleObj = (locale: string) => {
  switch (locale) {
    case 'nl': return nl;
    case 'de': return de;
    case 'es': return es;
    default: return enUS;
  }
};

export default function CalendarClient({
  events,
  allVenues,
  allArtists,
  dict,
  locale,
  initialMonth,
}: CalendarClientProps) {
  const [activeMonth, setActiveMonth] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Hover preview state
  const [previewEvent, setPreviewEvent] = useState<any | null>(null);

  // Modal / Dropdown
  const [venuesModalOpen, setVenuesModalOpen] = useState(false);
  const [artistsModalOpen, setArtistsModalOpen] = useState(false);
  const [datepickerOpen, setDatepickerOpen] = useState(false);
  const [artistSearchQuery, setArtistSearchQuery] = useState('');

  const localeObj = getLocaleObj(locale);
  const today = new Date();

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('ibizaFavorites') || '[]');
      setFavorites(favs);
    } catch (e) {}
  }, []);

  const toggleFavorite = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId];
      localStorage.setItem('ibizaFavorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    events.forEach(e => { if (e.date) months.add(e.date.substring(0, 7)); });
    return Array.from(months).sort();
  }, [events]);

  useEffect(() => {
    if (uniqueMonths.includes(initialMonth)) {
      setActiveMonth(initialMonth);
    } else if (uniqueMonths.length > 0) {
      const currentMonthStr = format(new Date(), 'yyyy-MM');
      setActiveMonth(uniqueMonths.includes(currentMonthStr) ? currentMonthStr : uniqueMonths[0]);
    }
  }, [uniqueMonths, initialMonth]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (activeMonth !== 'all' && e.date.substring(0, 7) !== activeMonth) return false;
      if (selectedVenue && e.ct_venues?.slug !== selectedVenue) return false;
      if (selectedArtist) {
        const q = selectedArtist.toLowerCase();
        if (!e.lineUp?.toLowerCase().includes(q) && !e.ct_events?.name?.toLowerCase().includes(q)) return false;
      }
      if (selectedCategory === 'favorites') return favorites.includes(e.id);
      const venue = e.ct_venues;
      if (selectedCategory === 'nightclubs') return venue?.type_slug === 'clubbing' && !venue?.is_day_club;
      if (selectedCategory === 'boat') return venue?.type_slug === 'boat';
      if (selectedCategory === 'day') return venue?.type_slug === 'clubbing' && venue?.is_day_club === true;
      return true;
    });
  }, [events, activeMonth, selectedVenue, selectedArtist, selectedCategory, favorites]);

  const eventsByDate = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredEvents.forEach(e => {
      const d = e.date;
      if (!groups[d]) groups[d] = [];
      groups[d].push(e);
    });
    return Object.keys(groups).sort().map(d => ({
      dateStr: d,
      dateObj: new Date(d + 'T00:00:00Z'),
      events: groups[d],
    }));
  }, [filteredEvents]);

  // Datepicker grid
  const datepickerDays = useMemo(() => {
    if (activeMonth === 'all') return [];
    try {
      const [y, m] = activeMonth.split('-').map(Number);
      const monthStart = startOfMonth(new Date(y, m - 1, 1));
      return eachDayOfInterval({
        start: startOfWeek(monthStart, { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }),
      });
    } catch { return []; }
  }, [activeMonth]);

  const activeMonthLabel = useMemo(() => {
    if (activeMonth === 'all') return '';
    try {
      const [y, m] = activeMonth.split('-').map(Number);
      return format(new Date(y, m - 1, 1), 'MMMM yyyy', { locale: localeObj });
    } catch { return ''; }
  }, [activeMonth, localeObj]);

  const dayHasEvents = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.some(e => e.date === dayStr);
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setDatepickerOpen(false);
    const dateStr = format(day, 'yyyy-MM-dd');
    document.getElementById(`date-group-${dateStr}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const filteredArtists = useMemo(() => {
    const q = artistSearchQuery.toLowerCase().trim();
    return q ? allArtists.filter(a => a.name.toLowerCase().includes(q)) : allArtists;
  }, [allArtists, artistSearchQuery]);

  // Set initial preview to first upcoming event with an image
  useEffect(() => {
    if (!previewEvent && filteredEvents.length > 0) {
      const withImg = filteredEvents.find(e => e.ct_events?.cover || e.ct_events?.logo);
      setPreviewEvent(withImg || filteredEvents[0]);
    }
  }, [filteredEvents]);

  const previewImg = previewEvent?.ct_events?.cover || previewEvent?.ct_events?.logo || null;
  const previewName = previewEvent?.name || previewEvent?.ct_events?.name || '';
  const previewVenue = previewEvent?.ct_venues?.name || '';
  const previewDate = previewEvent?.date
    ? format(new Date(previewEvent.date + 'T00:00:00Z'), 'EEEE d MMM', { locale: localeObj })
    : '';
  const previewPrice = previewEvent?.prices;
  const previewSlug = previewEvent
    ? `/${locale}/club-tickets/${previewEvent.ct_venues?.slug || 'club'}/${previewEvent.ct_events?.slug || 'event'}`
    : '#';

  return (
    <div className="cal-shell">
      {/* ─── TOP BAR ─── */}
      <div className="cal-topbar">
        <div className="cal-topbar-left">
          <Link href={`/${locale}`} className="cal-breadcrumb">
            <Calendar size={14} /> Home
          </Link>
          <ChevronRight size={12} className="cal-breadcrumb-sep" />
          <span className="cal-breadcrumb-active">Kalender</span>
        </div>

        {/* Month tabs */}
        <div className="cal-month-tabs">
          <button
            className={`cal-mtab ${activeMonth === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveMonth('all'); setDatepickerOpen(false); }}
          >
            ALL
          </button>
          {uniqueMonths.map(m => {
            let label = m;
            try {
              const [y, mo] = m.split('-').map(Number);
              label = format(new Date(y, mo - 1, 1), 'MMM', { locale: localeObj }).toUpperCase();
            } catch {}
            return (
              <button
                key={m}
                className={`cal-mtab ${activeMonth === m ? 'active' : ''}`}
                onClick={() => { setActiveMonth(m); setDatepickerOpen(false); }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Layout toggle */}
        <div className="cal-topbar-right">
          <button className={`cal-layout-btn ${layoutMode === 'grid' ? 'active' : ''}`} onClick={() => setLayoutMode('grid')}><Grid size={15} /></button>
          <button className={`cal-layout-btn ${layoutMode === 'list' ? 'active' : ''}`} onClick={() => setLayoutMode('list')}><List size={15} /></button>
        </div>
      </div>

      {/* ─── FILTER BAR ─── */}
      <div className="cal-filterbar">
        <button
          className={`cal-filter-btn ${selectedVenue ? 'on' : ''}`}
          onClick={() => { setVenuesModalOpen(v => !v); setArtistsModalOpen(false); setDatepickerOpen(false); }}
        >
          VENUES {selectedVenue ? `· ${selectedVenue}` : ''} ▾
        </button>

        {activeMonth !== 'all' && (
          <button
            className={`cal-filter-btn ${datepickerOpen ? 'on' : ''}`}
            onClick={() => { setDatepickerOpen(v => !v); setVenuesModalOpen(false); setArtistsModalOpen(false); }}
          >
            DATE ▾
          </button>
        )}

        <button
          className={`cal-filter-btn ${selectedArtist ? 'on' : ''}`}
          onClick={() => { setArtistsModalOpen(v => !v); setVenuesModalOpen(false); setDatepickerOpen(false); }}
        >
          ARTISTS {selectedArtist ? `· ${selectedArtist}` : ''} ▾
        </button>

        {/* Category pills */}
        {['all', 'nightclubs', 'day', 'boat', 'favorites'].map(cat => (
          <button
            key={cat}
            className={`cal-cat-pill ${selectedCategory === cat ? 'on' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'Alle' : cat === 'nightclubs' ? 'Clubs' : cat === 'day' ? 'Day' : cat === 'boat' ? 'Boats' : '♥'}
          </button>
        ))}

        <div className="cal-stats">{filteredEvents.length} events · {eventsByDate.length} days</div>
      </div>

      {/* ─── FILTER DROPDOWNS ─── */}
      {venuesModalOpen && (
        <div className="cal-board">
          <div className="cal-board-hd">
            <span>Kies een Club</span>
            <X size={16} onClick={() => setVenuesModalOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          <div className="cal-venue-grid">
            <button className={`cal-venue-tag ${!selectedVenue ? 'on' : ''}`} onClick={() => { setSelectedVenue(null); setVenuesModalOpen(false); }}>Alle clubs</button>
            {allVenues.map(v => (
              <button key={v.slug} className={`cal-venue-tag ${selectedVenue === v.slug ? 'on' : ''}`} onClick={() => { setSelectedVenue(v.slug); setVenuesModalOpen(false); }}>{v.name}</button>
            ))}
          </div>
        </div>
      )}

      {artistsModalOpen && (
        <div className="cal-board">
          <div className="cal-board-hd">
            <span>Zoek Artiest</span>
            <X size={16} onClick={() => setArtistsModalOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          <div className="cal-artist-search">
            <Search size={14} />
            <input type="text" placeholder="Typ naam..." value={artistSearchQuery} onChange={e => setArtistSearchQuery(e.target.value)} />
          </div>
          <div className="cal-artist-list">
            <div className={`cal-artist-item ${!selectedArtist ? 'on' : ''}`} onClick={() => { setSelectedArtist(null); setArtistsModalOpen(false); }}>Geen selectie</div>
            {filteredArtists.map(a => (
              <div key={a.slug} className={`cal-artist-item ${selectedArtist === a.name ? 'on' : ''}`} onClick={() => { setSelectedArtist(a.name); setArtistsModalOpen(false); }}>
                <span>{a.name}</span>
                {a.venueName && <span className="cal-artist-venue">{a.venueName}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {datepickerOpen && activeMonth !== 'all' && (
        <div className="cal-board cal-datepicker-board">
          <div className="cal-board-hd" style={{ marginBottom: 12 }}>
            <span>{activeMonthLabel}</span>
            <X size={16} onClick={() => setDatepickerOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          <div className="datepicker-grid">
            {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => <div key={d} className="datepicker-dow">{d}</div>)}
            {datepickerDays.map((day, idx) => {
              const dayMonthStr = format(day, 'yyyy-MM');
              if (dayMonthStr !== activeMonth) return <div key={idx} className="datepicker-cell empty" />;
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, today);
              const hasEvents = dayHasEvents(day);
              return (
                <div key={idx} className={`datepicker-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!hasEvents ? 'none' : ''}`} onClick={() => handleDateClick(day)}>
                  {format(day, 'd')}
                  <div className="datepicker-cell-dot" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MAIN 2-COLUMN BODY ─── */}
      <div className="cal-body">
        {/* LEFT: Event list */}
        <div className="cal-list-col">
          {eventsByDate.length === 0 ? (
            <div className="cal-empty">
              <Calendar size={40} />
              <p>Geen feesten gevonden voor deze selectie.</p>
            </div>
          ) : (
            <div className={layoutMode === 'grid' ? 'cal-stream grid-view' : 'cal-stream'}>
              {eventsByDate.map(group => {
                const isTodayGroup = isSameDay(group.dateObj, today);
                return (
                  <div key={group.dateStr} id={`date-group-${group.dateStr}`} className="cal-date-group">
                    <div className={`cal-date-hd ${isTodayGroup ? 'today' : ''}`}>
                      <span>{format(group.dateObj, 'EEEE d MMMM', { locale: localeObj })}</span>
                      {isTodayGroup && <span className="cal-today-badge">● TODAY</span>}
                    </div>

                    {group.events.map(ev => {
                      const evt = ev.ct_events;
                      const venue = ev.ct_venues;
                      const isActive = previewEvent?.id === ev.id;

                      return (
                        <Link
                          key={ev.id}
                          href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${evt?.slug || 'event'}`}
                          className={`cal-row ${isActive ? 'active' : ''}`}
                          onMouseEnter={() => setPreviewEvent(ev)}
                          onFocus={() => setPreviewEvent(ev)}
                        >
                          {/* Venue badge */}
                          <div className="cal-row-venue">
                            {venue?.whitelogo ? (
                              <img src={venue.whitelogo} alt={venue.name} className="cal-row-venue-logo" />
                            ) : (
                              <span className="cal-row-venue-name">{venue?.name || '—'}</span>
                            )}
                          </div>

                          {/* Event name + subtitle */}
                          <div className="cal-row-info">
                            <span className="cal-row-name">{ev.name}</span>
                            {evt?.name && <span className="cal-row-sub">{evt.name}</span>}
                          </div>

                          {/* Tickets CTA */}
                          <div className="cal-row-cta">
                            <Ticket size={13} />
                            TICKETS
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Sticky preview panel */}
        <div className="cal-preview-col">
          <div className="cal-preview-panel">
            {previewImg ? (
              <div className="cal-preview-img-wrap">
                <Image
                  src={previewImg}
                  alt={previewName}
                  fill
                  className="cal-preview-img"
                  sizes="(max-width:1200px) 0px, 380px"
                  priority={false}
                />
                {/* Gradient overlay */}
                <div className="cal-preview-overlay" />
              </div>
            ) : (
              <div className="cal-preview-placeholder">
                <Calendar size={48} />
              </div>
            )}

            {/* Info bar at bottom of preview */}
            {previewEvent && (
              <div className="cal-preview-info">
                <div className="cal-preview-venue">{previewVenue}</div>
                <div className="cal-preview-title">{previewName}</div>
                <div className="cal-preview-meta">
                  <span>{previewDate}</span>
                  {previewPrice && <span>· v.a. €{previewPrice}</span>}
                </div>
                <Link href={previewSlug} className="cal-preview-btn">
                  <Ticket size={14} /> Koop Tickets
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
