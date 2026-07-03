'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  format, isSameDay, startOfMonth, endOfMonth,
  eachDayOfInterval, startOfWeek, endOfWeek,
  addDays, subDays, isToday, isSameMonth, getWeek,
  startOfWeek as startW,
} from 'date-fns';
import { nl, enUS, de, es } from 'date-fns/locale';
import '@/styles/calendar.css';
import { Search, X, Ticket, ChevronLeft, ChevronRight, Filter, Heart, SlidersHorizontal } from 'lucide-react';

interface CalendarClientProps {
  events: any[];
  allVenues: any[];
  allArtists: any[];
  dict: any;
  locale: string;
  initialMonth: string;
}

const getLocaleObj = (locale: string) => {
  switch (locale) { case 'nl': return nl; case 'de': return de; case 'es': return es; default: return enUS; }
};

// View modes
type ViewMode = 'today' | 'week' | 'month';

export default function CalendarClient({ events, allVenues, allArtists, dict, locale, initialMonth }: CalendarClientProps) {
  const localeObj = getLocaleObj(locale);
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // ── View & navigation state ──
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [weekStart, setWeekStart] = useState<Date>(startW(today, { weekStartsOn: 1 }));
  const [activeMonth, setActiveMonth] = useState<string>(format(today, 'yyyy-MM'));
  const [selectedCalDay, setSelectedCalDay] = useState<string | null>(null);

  // ── Filter state ──
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [artistQuery, setArtistQuery] = useState('');

  // ── Preview state ──
  const [previewEvent, setPreviewEvent] = useState<any | null>(null);

  useEffect(() => {
    try { setFavorites(JSON.parse(localStorage.getItem('ibizaFavorites') || '[]')); } catch {}
  }, []);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setFavorites(prev => {
      const n = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('ibizaFavorites', JSON.stringify(n));
      return n;
    });
  };

  // ── Filtered events (global filters apply to all views) ──
  const filtered = useMemo(() => events.filter(e => {
    if (selectedVenue && e.ct_venues?.slug !== selectedVenue) return false;
    if (selectedArtist) {
      const q = selectedArtist.toLowerCase();
      if (!e.lineUp?.toLowerCase().includes(q) && !e.ct_events?.name?.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory === 'favorites') return favorites.includes(e.id);
    const v = e.ct_venues;
    if (selectedCategory === 'nightclubs') return v?.type_slug === 'clubbing' && !v?.is_day_club;
    if (selectedCategory === 'boat') return v?.type_slug === 'boat';
    if (selectedCategory === 'day') return v?.type_slug === 'clubbing' && v?.is_day_club;
    return true;
  }), [events, selectedVenue, selectedArtist, selectedCategory, favorites]);

  // Events by date index
  const eventsByDate = useMemo(() => {
    const m: Record<string, any[]> = {};
    filtered.forEach(e => { if (!m[e.date]) m[e.date] = []; m[e.date].push(e); });
    return m;
  }, [filtered]);

  // ── TODAY VIEW ──
  const todayEvents = useMemo(() => eventsByDate[todayStr] || [], [eventsByDate, todayStr]);
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
  const tomorrowEvents = useMemo(() => eventsByDate[tomorrowStr] || [], [eventsByDate, tomorrowStr]);

  // Next 7 days with events (for "This Week" strip in today view)
  const upcomingWeekDays = useMemo(() => {
    const days: { dateStr: string; dateObj: Date; events: any[] }[] = [];
    for (let i = 0; i <= 7; i++) {
      const d = addDays(today, i);
      const ds = format(d, 'yyyy-MM-dd');
      if (eventsByDate[ds]?.length) days.push({ dateStr: ds, dateObj: d, events: eventsByDate[ds] });
    }
    return days;
  }, [eventsByDate]);

  // ── WEEK VIEW ──
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // ── MONTH VIEW ──
  const monthDays = useMemo(() => {
    const [y, m] = activeMonth.split('-').map(Number);
    const ms = startOfMonth(new Date(y, m - 1, 1));
    return eachDayOfInterval({
      start: startW(ms, { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(ms), { weekStartsOn: 1 }),
    });
  }, [activeMonth]);

  const activeMonthLabel = useMemo(() => {
    try {
      const [y, m] = activeMonth.split('-').map(Number);
      return format(new Date(y, m - 1, 1), 'MMMM yyyy', { locale: localeObj });
    } catch { return ''; }
  }, [activeMonth, localeObj]);

  // ── Unique months for quick jump ──
  const uniqueMonths = useMemo(() => {
    const s = new Set<string>();
    events.forEach(e => { if (e.date) s.add(e.date.substring(0, 7)); });
    return Array.from(s).sort();
  }, [events]);

  // ── Set initial preview ──
  useEffect(() => {
    const withImg = filtered.find(e => e.ct_events?.cover || e.ct_events?.logo);
    if (withImg) setPreviewEvent(withImg);
  }, [filtered]);

  const previewImg = previewEvent?.ct_events?.cover || previewEvent?.ct_events?.logo;
  const previewSlug = previewEvent
    ? `/${locale}/club-tickets/${previewEvent.ct_venues?.slug || 'club'}/${previewEvent.ct_events?.slug || 'event'}`
    : '#';

  // ── Tonight open clubs ──
  const tonightClubs = useMemo(() => {
    const slugs = new Set<string>();
    const clubs: any[] = [];
    (eventsByDate[todayStr] || []).forEach(e => {
      const slug = e.ct_venues?.slug;
      if (slug && !slugs.has(slug)) {
        slugs.add(slug);
        const venue = allVenues.find(v => v.slug === slug);
        clubs.push({ slug, name: e.ct_venues?.name, whitelogo: venue?.whitelogo, events: (eventsByDate[todayStr] || []).filter(x => x.ct_venues?.slug === slug) });
      }
    });
    return clubs;
  }, [eventsByDate, todayStr, allVenues]);

  const filteredArtists = useMemo(() => {
    const q = artistQuery.toLowerCase().trim();
    return q ? allArtists.filter(a => a.name.toLowerCase().includes(q)) : allArtists;
  }, [allArtists, artistQuery]);

  const totalFiltered = filtered.length;

  // ── Render helper: single event row ──
  const EventRow = ({ ev, compact = false }: { ev: any; compact?: boolean }) => {
    const evt = ev.ct_events;
    const venue = ev.ct_venues;
    const isFav = favorites.includes(ev.id);
    const isActive = previewEvent?.id === ev.id;
    return (
      <Link
        href={`/${locale}/club-tickets/${venue?.slug || 'club'}/${evt?.slug || 'event'}`}
        className={`cal-row ${isActive ? 'active' : ''} ${compact ? 'compact' : ''}`}
        onMouseEnter={() => setPreviewEvent(ev)}
        onFocus={() => setPreviewEvent(ev)}
      >
        <div className="cal-row-venue">
          {venue?.whitelogo
            ? <img src={venue.whitelogo} alt={venue.name || ''} className="cal-row-venue-logo" loading="lazy" decoding="async" />
            : <span className="cal-row-venue-name">{venue?.name || '—'}</span>}
        </div>
        <div className="cal-row-info">
          <span className="cal-row-name">{ev.name}</span>
          {evt?.name && <span className="cal-row-sub">{evt.name}</span>}
        </div>
        {ev.prices && <span className="cal-row-price">v.a. €{ev.prices}</span>}
        <button className="cal-row-fav" onClick={(e) => toggleFav(ev.id, e)} aria-label="Favoriet">
          <Heart size={13} fill={isFav ? 'currentColor' : 'none'} className={isFav ? 'text-red-500' : 'text-gray-400'} />
        </button>
        <div className="cal-row-cta"><Ticket size={12} /> TICKETS</div>
      </Link>
    );
  };

  return (
    <div className="calv2-shell">

      {/* ════════════════════════════════════
          FULL-BLEED HEADER — right under navbar
          ════════════════════════════════════ */}
      <div className="calv2-header">
        <div className="calv2-header-content">
          <div className="calv2-header-left">
            <div className="calv2-eyebrow">Ibiza mi Vida · {new Date().getFullYear()}</div>
            <h1 className="calv2-title">Kalender</h1>
            <p className="calv2-subtitle">
              {totalFiltered.toLocaleString()} events · {uniqueMonths.length} maanden · Officiële tickets via Clubtickets
            </p>
          </div>

          {/* Tonight clubs — quick strip */}
          {tonightClubs.length > 0 && (
            <div className="calv2-tonight">
              <div className="calv2-tonight-label">● Vanavond open</div>
              <div className="calv2-tonight-clubs">
                {tonightClubs.map(c => (
                  <div key={c.slug} className="calv2-tonight-club">
                    {c.whitelogo
                      ? <img src={c.whitelogo} alt={c.name} className="calv2-tonight-logo" loading="lazy" />
                      : <span>{c.name}</span>}
                    <span className="calv2-tonight-count">{c.events.length}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── View mode switcher ── */}
        <div className="calv2-viewnav">
          <div className="calv2-viewtabs">
            {(['today', 'week', 'month'] as ViewMode[]).map(m => (
              <button
                key={m}
                className={`calv2-vtab ${viewMode === m ? 'active' : ''}`}
                onClick={() => setViewMode(m)}
              >
                {m === 'today' ? 'Vandaag' : m === 'week' ? 'Week' : 'Maand'}
              </button>
            ))}
          </div>

          {/* Month jump tabs */}
          <div className="calv2-monthjump">
            {uniqueMonths.map(mo => {
              let label = mo;
              try { const [y, mm] = mo.split('-').map(Number); label = format(new Date(y, mm - 1, 1), 'MMM', { locale: localeObj }).toUpperCase(); } catch {}
              const isActive = activeMonth === mo;
              return (
                <button
                  key={mo}
                  className={`calv2-mjtab ${isActive ? 'active' : ''}`}
                  onClick={() => { setActiveMonth(mo); if (viewMode === 'today') setViewMode('month'); }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Filter bar */}
          <div className="calv2-filterrow">
            <button
              className={`calv2-filterbtn ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen(v => !v)}
            >
              <SlidersHorizontal size={13} />
              Filters {(selectedVenue || selectedArtist || selectedCategory !== 'all') ? '·' : ''}
            </button>

            {/* Active filter badges */}
            {selectedVenue && (
              <span className="calv2-badge">{selectedVenue} <X size={10} onClick={() => setSelectedVenue(null)} style={{ cursor: 'pointer' }} /></span>
            )}
            {selectedArtist && (
              <span className="calv2-badge">{selectedArtist} <X size={10} onClick={() => setSelectedArtist(null)} style={{ cursor: 'pointer' }} /></span>
            )}

            {/* Category pills */}
            {['all', 'nightclubs', 'day', 'boat', 'favorites'].map(cat => (
              <button
                key={cat}
                className={`calv2-catpill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Alle' : cat === 'nightclubs' ? 'Clubs' : cat === 'day' ? 'Day' : cat === 'boat' ? 'Boat' : '♥'}
              </button>
            ))}

            <span className="calv2-count">{totalFiltered} events</span>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="calv2-filterpanel">
          <div className="calv2-fp-section">
            <div className="calv2-fp-label">Club</div>
            <div className="calv2-fp-chips">
              <button className={`calv2-fp-chip ${!selectedVenue ? 'active' : ''}`} onClick={() => { setSelectedVenue(null); }}>Alle clubs</button>
              {allVenues.filter(v => (v.typeSlug || v.type?.slug) === 'clubbing').map(v => (
                <button key={v.slug} className={`calv2-fp-chip ${selectedVenue === v.slug ? 'active' : ''}`} onClick={() => { setSelectedVenue(v.slug); setFilterOpen(false); }}>{v.name}</button>
              ))}
            </div>
          </div>
          <div className="calv2-fp-section">
            <div className="calv2-fp-label">Artiest</div>
            <div className="calv2-fp-search">
              <Search size={13} />
              <input type="text" placeholder="Zoek artiest..." value={artistQuery} onChange={e => setArtistQuery(e.target.value)} />
            </div>
            <div className="calv2-fp-artists">
              <button className={`calv2-fp-chip ${!selectedArtist ? 'active' : ''}`} onClick={() => setSelectedArtist(null)}>Geen filter</button>
              {filteredArtists.slice(0, 30).map(a => (
                <button key={a.slug} className={`calv2-fp-chip ${selectedArtist === a.name ? 'active' : ''}`} onClick={() => { setSelectedArtist(a.name); setFilterOpen(false); }}>{a.name}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          MAIN BODY — 2 column
          ════════════════════════════════════ */}
      <div className="calv2-body">

        {/* ── LEFT: Events panel ── */}
        <div className="calv2-list">

          {/* ═══════ VANDAAG VIEW ═══════ */}
          {viewMode === 'today' && (
            <div className="calv2-today-view">
              {/* Today date banner */}
              <div className="calv2-today-banner">
                <div className="calv2-today-date">
                  {format(today, 'EEEE d MMMM', { locale: localeObj })}
                </div>
                <span className="calv2-live-dot">● LIVE</span>
              </div>

              {/* Tonight clubs at a glance */}
              {tonightClubs.length > 0 && (
                <div className="calv2-tonightstrip">
                  {tonightClubs.map(c => (
                    <Link
                      key={c.slug}
                      href={`/${locale}/clubs/${c.slug}`}
                      className="calv2-tonightcard"
                    >
                      <div className="calv2-tc-logo">
                        {c.whitelogo && <img src={c.whitelogo} alt={c.name} loading="lazy" />}
                      </div>
                      <div className="calv2-tc-name">{c.name}</div>
                      <div className="calv2-tc-count">{c.events.length} {c.events.length === 1 ? 'event' : 'events'}</div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Today events */}
              {todayEvents.length > 0 ? (
                <div className="calv2-section">
                  <div className="calv2-section-hd today">Vandaag</div>
                  {todayEvents.map(ev => <EventRow key={ev.id} ev={ev} />)}
                </div>
              ) : (
                <div className="calv2-empty-today">
                  <div className="calv2-empty-icon">🎉</div>
                  <div className="calv2-empty-text">Geen events gevonden voor vandaag</div>
                  <button className="calv2-empty-btn" onClick={() => setViewMode('week')}>Bekijk deze week →</button>
                </div>
              )}

              {/* Tomorrow preview */}
              {tomorrowEvents.length > 0 && (
                <div className="calv2-section">
                  <div className="calv2-section-hd">Morgen · {format(addDays(today, 1), 'd MMM', { locale: localeObj })}</div>
                  {tomorrowEvents.slice(0, 4).map(ev => <EventRow key={ev.id} ev={ev} compact />)}
                  {tomorrowEvents.length > 4 && (
                    <button className="calv2-more-btn" onClick={() => setViewMode('week')}>+ {tomorrowEvents.length - 4} meer morgen</button>
                  )}
                </div>
              )}

              {/* Upcoming week */}
              {upcomingWeekDays.filter(d => d.dateStr !== todayStr && d.dateStr !== tomorrowStr).length > 0 && (
                <div className="calv2-section">
                  <div className="calv2-section-hd">Deze week</div>
                  <div className="calv2-weekstrip">
                    {upcomingWeekDays.filter(d => d.dateStr !== todayStr && d.dateStr !== tomorrowStr).map(d => (
                      <button
                        key={d.dateStr}
                        className="calv2-weekday-chip"
                        onClick={() => { setViewMode('week'); setWeekStart(startW(d.dateObj, { weekStartsOn: 1 })); }}
                      >
                        <span className="calv2-wdc-day">{format(d.dateObj, 'EEE', { locale: localeObj })}</span>
                        <span className="calv2-wdc-num">{format(d.dateObj, 'd')}</span>
                        <span className="calv2-wdc-count">{d.events.length}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════ WEEK VIEW ═══════ */}
          {viewMode === 'week' && (
            <div className="calv2-week-view">
              {/* Week navigation */}
              <div className="calv2-week-nav">
                <button className="calv2-wk-btn" onClick={() => setWeekStart(d => subDays(d, 7))}>
                  <ChevronLeft size={16} />
                </button>
                <span className="calv2-wk-label">
                  {format(weekStart, 'd MMM', { locale: localeObj })} — {format(addDays(weekStart, 6), 'd MMM yyyy', { locale: localeObj })}
                </span>
                <button className="calv2-wk-btn" onClick={() => setWeekStart(d => addDays(d, 7))}>
                  <ChevronRight size={16} />
                </button>
                <button className="calv2-wk-today" onClick={() => setWeekStart(startW(today, { weekStartsOn: 1 }))}>
                  Vandaag
                </button>
              </div>

              {/* 7 day columns */}
              <div className="calv2-week-cols">
                {weekDays.map(day => {
                  const ds = format(day, 'yyyy-MM-dd');
                  const dayEvs = eventsByDate[ds] || [];
                  const isT = isToday(day);
                  return (
                    <div key={ds} className={`calv2-wkcol ${isT ? 'today' : ''}`}>
                      <div className="calv2-wkcol-hd">
                        <span className="calv2-wkcol-dow">{format(day, 'EEE', { locale: localeObj })}</span>
                        <span className={`calv2-wkcol-num ${isT ? 'today' : ''}`}>{format(day, 'd')}</span>
                        {dayEvs.length > 0 && <span className="calv2-wkcol-count">{dayEvs.length}</span>}
                      </div>
                      <div className="calv2-wkcol-events">
                        {dayEvs.length === 0 ? (
                          <div className="calv2-wkcol-empty">—</div>
                        ) : dayEvs.map(ev => (
                          <Link
                            key={ev.id}
                            href={`/${locale}/club-tickets/${ev.ct_venues?.slug || 'club'}/${ev.ct_events?.slug || 'event'}`}
                            className="calv2-wk-event"
                            onMouseEnter={() => setPreviewEvent(ev)}
                          >
                            <div className="calv2-wk-ev-venue">{ev.ct_venues?.name}</div>
                            <div className="calv2-wk-ev-name">{ev.name}</div>
                            {ev.prices && <div className="calv2-wk-ev-price">€{ev.prices}</div>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════ MAAND VIEW ═══════ */}
          {viewMode === 'month' && (
            <div className="calv2-month-view">
              {/* Month navigation */}
              <div className="calv2-month-nav">
                <button className="calv2-wk-btn" onClick={() => {
                  const [y, m] = activeMonth.split('-').map(Number);
                  const prev = new Date(y, m - 2, 1);
                  setActiveMonth(format(prev, 'yyyy-MM'));
                  setSelectedCalDay(null);
                }}>
                  <ChevronLeft size={16} />
                </button>
                <span className="calv2-month-label">{activeMonthLabel}</span>
                <button className="calv2-wk-btn" onClick={() => {
                  const [y, m] = activeMonth.split('-').map(Number);
                  const next = new Date(y, m, 1);
                  setActiveMonth(format(next, 'yyyy-MM'));
                  setSelectedCalDay(null);
                }}>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="calv2-cal-grid">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => (
                  <div key={d} className="calv2-cal-dow">{d}</div>
                ))}
                {monthDays.map((day, idx) => {
                  const ds = format(day, 'yyyy-MM-dd');
                  const dayEvs = eventsByDate[ds] || [];
                  const inMonth = isSameMonth(day, new Date(parseInt(activeMonth.split('-')[0]), parseInt(activeMonth.split('-')[1]) - 1, 1));
                  const isT = isToday(day);
                  const isSelected = selectedCalDay === ds;
                  return (
                    <button
                      key={idx}
                      className={`calv2-cal-cell ${!inMonth ? 'out' : ''} ${isT ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvs.length > 0 ? 'has-events' : ''}`}
                      onClick={() => { if (inMonth) setSelectedCalDay(isSelected ? null : ds); }}
                    >
                      <span className="calv2-cal-num">{format(day, 'd')}</span>
                      {dayEvs.length > 0 && inMonth && (
                        <span className="calv2-cal-dots">
                          {Math.min(dayEvs.length, 4) > 0 && (
                            <span className="calv2-cal-dot-row">
                              {Array.from({ length: Math.min(dayEvs.length, 3) }).map((_, i) => <span key={i} className="calv2-dot" />)}
                              {dayEvs.length > 3 && <span className="calv2-dot-more">+{dayEvs.length - 3}</span>}
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected day events */}
              {selectedCalDay && eventsByDate[selectedCalDay] && (
                <div className="calv2-cal-dayevents">
                  <div className="calv2-section-hd">
                    {format(new Date(selectedCalDay + 'T00:00:00Z'), 'EEEE d MMMM', { locale: localeObj })}
                    <button className="calv2-cal-close" onClick={() => setSelectedCalDay(null)}><X size={14} /></button>
                  </div>
                  {eventsByDate[selectedCalDay].map(ev => <EventRow key={ev.id} ev={ev} />)}
                </div>
              )}

              {/* If no day selected: show all month events as stream */}
              {!selectedCalDay && (
                <div className="calv2-month-stream">
                  {Object.keys(eventsByDate)
                    .filter(ds => ds.startsWith(activeMonth))
                    .sort()
                    .map(ds => {
                      const dayEvs = eventsByDate[ds];
                      const dayObj = new Date(ds + 'T00:00:00Z');
                      const isT = isToday(dayObj);
                      return (
                        <div key={ds} className="calv2-section">
                          <div className={`calv2-section-hd ${isT ? 'today' : ''}`}>
                            {format(dayObj, 'EEEE d MMMM', { locale: localeObj })}
                            {isT && <span className="calv2-live-dot">● VANDAAG</span>}
                          </div>
                          {dayEvs.map(ev => <EventRow key={ev.id} ev={ev} />)}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: Sticky artist preview ── */}
        <div className="calv2-preview">
          <div className="calv2-preview-panel">
            {previewImg ? (
              <>
                <div className="calv2-preview-img-wrap">
                  <Image src={previewImg} alt={previewEvent?.name || ''} fill className="calv2-preview-img" sizes="360px" />
                  <div className="calv2-preview-grad" />
                </div>
                <div className="calv2-preview-info">
                  <div className="calv2-pi-venue">{previewEvent?.ct_venues?.name}</div>
                  <div className="calv2-pi-name">{previewEvent?.name}</div>
                  <div className="calv2-pi-meta">
                    <span>{previewEvent?.date ? format(new Date(previewEvent.date + 'T00:00:00Z'), 'EEEE d MMM', { locale: localeObj }) : ''}</span>
                    {previewEvent?.prices && <span>· v.a. €{previewEvent.prices}</span>}
                  </div>
                  <Link href={previewSlug} className="calv2-pi-btn">
                    <Ticket size={13} /> Koop Tickets
                  </Link>
                </div>
              </>
            ) : (
              <div className="calv2-preview-empty">
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎶</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', fontWeight: 600 }}>Hover over een event</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
