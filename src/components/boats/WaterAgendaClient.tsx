'use client';

import React, { useState, useMemo } from 'react';
import {
  format, addDays, addMonths, isToday, isTomorrow, isSameMonth, isSameDay,
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isValid,
} from 'date-fns';
import { nl, enUS, de, es, fr } from 'date-fns/locale';
import { Search, X, Calendar, ChevronRight, ChevronLeft, Ship, Ticket } from 'lucide-react';
import type { PickerEvent } from '@/lib/picker-event';
import { WeekDockBar } from '@/components/ui/WeekDockBar';
import { ScrollCue } from '@/components/ui/ScrollCue';
import { optImg } from '@/lib/img';

// ── i18n labels (en, nl, de, es, fr) ──
interface AgendaLabels {
  today: string; tomorrow: string; week: string; month: string; all: string;
  allOperators: string; searchPlaceholder: string; noResults: string;
  departures: string; tickets: string; live: string; more: string;
  todayPrefix: string; tomorrowPrefix: string;
}
const LABELS: Record<string, AgendaLabels> = {
  en: { today: 'Today', tomorrow: 'Tomorrow', week: 'This week', month: 'This month', all: 'All', allOperators: 'All', searchPlaceholder: 'Search route or operator…', noResults: 'No departures found', departures: 'Departures', tickets: 'Tickets', live: 'Live', more: 'more', todayPrefix: 'Today', tomorrowPrefix: 'Tomorrow' },
  nl: { today: 'Vandaag', tomorrow: 'Morgen', week: 'Deze week', month: 'Deze maand', all: 'Alles', allOperators: 'Alle', searchPlaceholder: 'Zoek route of aanbieder…', noResults: 'Geen afvaarten gevonden', departures: 'Afvaarten', tickets: 'Tickets', live: 'Live', more: 'meer', todayPrefix: 'Vandaag', tomorrowPrefix: 'Morgen' },
  de: { today: 'Heute', tomorrow: 'Morgen', week: 'Diese Woche', month: 'Diesen Monat', all: 'Alle', allOperators: 'Alle', searchPlaceholder: 'Route oder Anbieter suchen…', noResults: 'Keine Abfahrten gefunden', departures: 'Abfahrten', tickets: 'Tickets', live: 'Live', more: 'mehr', todayPrefix: 'Heute', tomorrowPrefix: 'Morgen' },
  es: { today: 'Hoy', tomorrow: 'Mañana', week: 'Esta semana', month: 'Este mes', all: 'Todos', allOperators: 'Todos', searchPlaceholder: 'Buscar ruta u operador…', noResults: 'No se encontraron salidas', departures: 'Salidas', tickets: 'Entradas', live: 'En vivo', more: 'más', todayPrefix: 'Hoy', tomorrowPrefix: 'Mañana' },
  fr: { today: "Aujourd'hui", tomorrow: 'Demain', week: 'Cette semaine', month: 'Ce mois-ci', all: 'Tout', allOperators: 'Tout', searchPlaceholder: 'Rechercher une route ou un opérateur…', noResults: 'Aucun départ trouvé', departures: 'Départs', tickets: 'Billets', live: 'Live', more: 'plus', todayPrefix: "Aujourd'hui", tomorrowPrefix: 'Demain' },
};
const getLabels = (locale: string): AgendaLabels => LABELS[locale] || LABELS.en;

export interface WaterAgendaEvent {
  id: string;
  name: string;
  date: string;            // YYYY-MM-DD
  prices: string;
  lineUp?: string;
  eventName?: string;
  eventSlug?: string;
  eventCover?: string;
  eventLogo?: string;
  venueName?: string;
  venueSlug?: string;
  venueCover?: string;
  venueLogo?: string;
  affLink?: string;
}

export interface WaterAgendaVenue {
  slug: string;
  name: string;
  picture?: string;
  whitelogo?: string;
  cover?: string;
  logo?: string;
}

interface WaterAgendaClientProps {
  title: string;
  subtitle: string;
  kicker?: string;
  events: WaterAgendaEvent[];
  venues: WaterAgendaVenue[];
  locale: string;
  /** URL segment for the internal event detail page, e.g. "tours". When set,
   *  event cards link to /{locale}/{basePath}/{venueSlug}/{eventSlug} (our own
   *  intermediate page) instead of straight to ClubTickets. */
  basePath?: string;
}

const getLoc = (locale: string) => ({ nl, de, es, fr, en: enUS }[locale] || enUS);

const GALLERY_TITLE: Record<string, string> = { nl: 'Alle events', en: 'All events', de: 'Alle Events', es: 'Todos los eventos', fr: 'Tous les événements' };
const fmtGallery = (iso: string, locale: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, 'EEE d MMM', { locale: getLoc(locale) }) : ''; } catch { return ''; } };
type QuickFilter = 'today' | 'tomorrow' | 'week' | 'month' | 'all';

const priceShort = (p?: string) => {
  if (!p) return '';
  const first = String(p).split('-')[0].trim().replace(/€/g, '').trim();
  return first ? `${first} €` : '';
};
const eventImg = (e: WaterAgendaEvent) => e.eventCover || e.eventLogo || e.venueCover || e.venueLogo || '';

export default function WaterAgendaClient({ title, subtitle, kicker, events, venues, locale, basePath = '' }: WaterAgendaClientProps) {
  const loc = getLoc(locale);
  const L = getLabels(locale);
  const today = useMemo(() => new Date(), []);
  const todayStr = format(today, 'yyyy-MM-dd');

  // ── Month-by-month loading ──
  // The server only ships a 31-day window (perf); browsing further ahead
  // fetches the missing month from /api/agenda and merges it in (dedupe by id).
  const [extraEvents, setExtraEvents] = useState<WaterAgendaEvent[]>([]);
  const loadedMonthsRef = React.useRef<Set<string>>(new Set([format(today, 'yyyy-MM')]));
  const allEvents = useMemo(() => {
    if (!extraEvents.length) return events;
    const seen = new Set(events.map(e => String(e.id)));
    return [...events, ...extraEvents.filter(e => !seen.has(String(e.id)))];
  }, [events, extraEvents]);
  const ensureMonth = React.useCallback((month: string) => {
    if (!month || month < format(today, 'yyyy-MM') || loadedMonthsRef.current.has(month)) return;
    loadedMonthsRef.current.add(month);
    const slugs = venues.map(v => v.slug).join(',');
    fetch(`/api/agenda?locale=${encodeURIComponent(locale)}&month=${month}&venues=${encodeURIComponent(slugs)}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(j => { if (Array.isArray(j?.events) && j.events.length) setExtraEvents(prev => [...prev, ...j.events]); })
      .catch(() => { loadedMonthsRef.current.delete(month); });
  }, [venues, locale, today]);

  // Normalised events for the ClubTickets-style calendar picker
  const pickerEvents: PickerEvent[] = useMemo(() => allEvents.map(e => {
    const mv = venues.find(v => v.slug === e.venueSlug);
    const m = String(e.prices || '').match(/\d+([.,]\d+)?/);
    return {
      id: `${e.id}-${e.eventSlug}`,
      clubSlug: e.venueSlug || '',
      clubName: e.venueName || '',
      // Only real logos here — a photo forced to brightness-0 becomes an ugly black square,
      // so if there's no proper logo we leave it empty and the UI shows clean initials.
      clubLogo: mv?.whitelogo || mv?.logo || e.venueLogo || '',
      eventSlug: e.eventSlug || '',
      eventName: e.eventName || e.name || '',
      image: e.eventCover || e.eventLogo || e.venueCover || mv?.cover || mv?.picture || mv?.logo || '',
      date: e.date || '',
      price: m ? parseFloat(m[0].replace(',', '.')) : 0,
      lineUp: e.lineUp || '',
      href: `/${locale}/${basePath || 'club-tickets'}/${e.venueSlug}/${e.eventSlug}`,
      affLink: e.affLink || '',
    };
  }), [allEvents, venues, locale, basePath]);

  const [quickFilter, setQuickFilter] = useState<QuickFilter>('today');
  const [activeMonth, setActiveMonth] = useState(format(today, 'yyyy-MM'));
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Fixed bottom week dock (same feature as the event detail page)
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const imgByDate = useMemo(() => { const m = new Map<string, string>(); pickerEvents.forEach(e => { if (!m.has(e.date) && e.image) m.set(e.date, e.image); }); return m; }, [pickerEvents]);
  const [dockWeekStart, setDockWeekStart] = useState<string>(() => {
    const ds = pickerEvents.map(e => e.date).filter(d => d >= todayStr).sort()[0] || todayStr;
    return format(startOfWeek(parseISO(ds), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  });
  const [dockDay, setDockDay] = useState<string | null>(null);
  const galleryEvents = useMemo(() => {
    const sorted = [...pickerEvents].sort((a, b) => a.date.localeCompare(b.date));
    if (dockDay) return sorted.filter(e => e.date === dockDay);
    // No day selected: show only the active dock week — rendering every event
    // at once (hundreds of cards) froze the page.
    const weekEndStr = format(addDays(parseISO(dockWeekStart), 6), 'yyyy-MM-dd');
    return sorted.filter(e => e.date >= dockWeekStart && e.date <= weekEndStr);
  }, [pickerEvents, dockDay, dockWeekStart]);
  React.useEffect(() => { if (!dockDay || !galleryRef.current) return; const el = galleryRef.current; const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 90); return () => clearTimeout(t); }, [dockDay]);

  // Lazy-load months when browsing past the shipped 31-day window.
  React.useEffect(() => { ensureMonth(activeMonth); }, [activeMonth, ensureMonth]);
  React.useEffect(() => {
    try {
      ensureMonth(dockWeekStart.slice(0, 7));
      ensureMonth(format(addDays(parseISO(dockWeekStart), 6), 'yyyy-MM'));
      // Approaching the edge of loaded data? Prefetch the following month so
      // the week dock can keep sliding forward.
      const maxLoaded = allEvents.reduce((m, e) => (e.date > m ? e.date : m), todayStr);
      if (format(addDays(parseISO(dockWeekStart), 13), 'yyyy-MM-dd') >= maxLoaded) {
        ensureMonth(format(addMonths(parseISO(`${maxLoaded.slice(0, 7)}-01`), 1), 'yyyy-MM'));
      }
    } catch {}
  }, [dockWeekStart, ensureMonth, allEvents, todayStr]);

  const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');

  // Venue + text scope (applied to every view). Time is applied per view.
  const scoped = useMemo(() => {
    let evs = [...allEvents];
    if (selectedVenue) evs = evs.filter(e => e.venueSlug === selectedVenue);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      evs = evs.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.eventName?.toLowerCase().includes(q) ||
        e.venueName?.toLowerCase().includes(q)
      );
    }
    return evs;
  }, [events, selectedVenue, searchQuery]);

  const eventsByDate = useMemo(() => {
    const m: Record<string, WaterAgendaEvent[]> = {};
    scoped.forEach(e => { (m[e.date] ||= []).push(e); });
    return m;
  }, [scoped]);

  const dayEvents = (ds: string) => eventsByDate[ds] || [];

  // Only operators that actually have upcoming departures in the current scope search
  const activeVenues = useMemo(() => {
    const slugs = new Set(allEvents.map(e => e.venueSlug).filter(Boolean));
    return venues.filter(v => slugs.has(v.slug));
  }, [events, venues]);

  // ── Counts (reflect the active operator + search) ──
  const todayCount = dayEvents(todayStr).length;
  const tomorrowCount = dayEvents(tomorrowStr).length;
  const weekCount = scoped.filter(e => e.date >= weekStart && e.date <= weekEnd).length;
  const monthCount = scoped.filter(e => e.date.startsWith(activeMonth)).length;
  const allCount = scoped.filter(e => e.date >= todayStr).length;

  const timeTabs: { key: QuickFilter; label: string; count: number }[] = [
    { key: 'today', label: L.today, count: todayCount },
    { key: 'tomorrow', label: L.tomorrow, count: tomorrowCount },
    { key: 'week', label: L.week, count: weekCount },
    { key: 'month', label: L.month, count: monthCount },
    // 'all' removed — the server now ships only a 31-day window, and rendering
    // the entire season at once made the page freeze.
  ];

  // ── List view (today / tomorrow / week / all) ──
  const listGroups = useMemo(() => {
    let evs = scoped;
    if (quickFilter === 'today') evs = evs.filter(e => e.date === todayStr);
    else if (quickFilter === 'tomorrow') evs = evs.filter(e => e.date === tomorrowStr);
    else if (quickFilter === 'week') evs = evs.filter(e => e.date >= weekStart && e.date <= weekEnd);
    else if (quickFilter === 'all') evs = evs.filter(e => e.date >= todayStr);
    else evs = [];
    const m: Record<string, WaterAgendaEvent[]> = {};
    evs.forEach(e => { (m[e.date] ||= []).push(e); });
    return Object.keys(m).sort().map(ds => ({ date: ds, items: m[ds] }));
  }, [scoped, quickFilter, todayStr, tomorrowStr, weekStart, weekEnd]);

  // ── Month grid ──
  const months = useMemo(() => {
    const s = new Set<string>();
    allEvents.forEach(e => { if (e.date) s.add(e.date.slice(0, 7)); });
    // Always allow browsing a few months ahead — those load on demand via /api/agenda.
    for (let i = 0; i <= 3; i++) s.add(format(addMonths(today, i), 'yyyy-MM'));
    return Array.from(s).sort();
  }, [allEvents, today]);

  const monthDate = useMemo(() => parseISO(`${activeMonth}-01`), [activeMonth]);
  const gridDays = useMemo(() => {
    const gs = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const ge = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gs, end: ge });
  }, [monthDate]);

  const canPrev = months.length > 0 && activeMonth > months[0];
  const canNext = months.length > 0 && activeMonth < months[months.length - 1];
  const shiftMonth = (dir: number) => {
    const next = format(addMonths(monthDate, dir), 'yyyy-MM');
    if (months.includes(next) || (dir < 0 && canPrev) || (dir > 0 && canNext)) {
      setActiveMonth(next);
      setSelectedDay(null);
    }
  };

  // Which day's detail to show under the month grid
  const detailDay = useMemo(() => {
    if (selectedDay && selectedDay.startsWith(activeMonth)) return selectedDay;
    if (todayStr.startsWith(activeMonth) && dayEvents(todayStr).length) return todayStr;
    const firstWithEvents = gridDays
      .map(d => format(d, 'yyyy-MM-dd'))
      .find(ds => ds.startsWith(activeMonth) && dayEvents(ds).length);
    return firstWithEvents || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, activeMonth, gridDays, eventsByDate, todayStr]);

  const dateLabel = (ds: string) => {
    try {
      const d = parseISO(ds);
      if (isToday(d)) return `${L.todayPrefix} · ${format(d, 'd MMM', { locale: loc })}`;
      if (isTomorrow(d)) return `${L.tomorrowPrefix} · ${format(d, 'd MMM', { locale: loc })}`;
      return format(d, 'EEEE d MMMM', { locale: loc });
    } catch { return ds; }
  };

  return (
    <div className="theme-monaco-vip bg-neutral-50 text-[var(--color-ink)] min-h-screen relative overflow-x-clip">
      {/* Header */}
      <div className="relative z-10 pt-[calc(var(--nav-h)+28px)] pb-2 flex flex-col items-center text-center px-4">
        <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-black/40 mb-2">{kicker || `Ibiza Agenda ${format(today, 'yyyy')}`}</p>
        <h1 className="text-5xl md:text-7xl font-black font-serif text-black leading-none uppercase m-0 tracking-tight drop-shadow-sm">{title}</h1>
        <p className="text-sm md:text-base text-black/50 font-medium mt-3 max-w-md">{subtitle}</p>
      </div>


      {/* ── Promo gallery: every event of this category, from today onward ── */}
      {pickerEvents.length > 0 && (
        <section ref={galleryRef} style={{ scrollMarginTop: 'calc(var(--nav-h) + 8px)', minHeight: dockDay ? 'calc(100svh - var(--nav-h))' : undefined }} className="relative z-10 mx-auto max-w-4xl px-4 pb-40 pt-2">
          {dockDay && <ScrollCue className="mb-2" />}
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-serif text-2xl md:text-3xl font-black text-black">{title} events</h2>
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {galleryEvents.map(e => (
              <a key={e.id} href={e.href} className="group flex h-28 overflow-hidden rounded-2xl border border-black/10 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl sm:h-32">
                {/* Left half — the photo, with price top-left and CTA bottom, both on the image */}
                <div className="relative h-full w-[55%] shrink-0 bg-neutral-900">
                  {e.image ? <img src={optImg(e.image, 400)} loading="lazy" alt={e.eventName} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                  {e.price > 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-black shadow">€{e.price}</span>}
                  <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white backdrop-blur-sm transition-colors group-hover:bg-ibiza-green group-hover:text-black">{L.tickets} <ChevronRight size={10} /></span>
                </div>
                {/* Right half — red panel: event name + date, centred */}
                <div className="flex w-[45%] flex-col items-center justify-center gap-1 p-2.5 text-center" style={{ backgroundColor: '#E14D68' }}>
                  <div className="line-clamp-3 font-serif text-[12px] font-black leading-tight text-white">{e.eventName}</div>
                  <div className="line-clamp-1 text-[9px] font-bold uppercase tracking-wide text-white/85">{fmtGallery(e.date, locale)}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}} />

      {/* Fixed bottom week dock — pick a day to open that day's events */}
      {pickerEvents.length > 0 && (
        <WeekDockBar
          eventDates={pickerEvents.map(e => e.date)}
          weekStart={dockWeekStart}
          setWeekStart={setDockWeekStart}
          activeDay={dockDay}
          setActiveDay={setDockDay}
          locale={locale}
          imageFor={(iso) => imgByDate.get(iso) || ''}
        />
      )}
    </div>
  );
}

/* ─────────── Sub-components ─────────── */

function EmptyState({ locale }: { locale: string }) {
  const L = getLabels(locale);
  return (
    <div className="text-center py-20 bg-white rounded-[32px] border border-neutral-100 shadow-sm">
      <Calendar size={48} className="mx-auto text-neutral-300 mb-4" />
      <p className="text-neutral-500 font-bold uppercase tracking-widest text-lg">{L.noResults}</p>
    </div>
  );
}

function EventTile({ ev, locale, basePath = '' }: { ev: WaterAgendaEvent; locale: string; basePath?: string }) {
  const L = getLabels(locale);
  const eventTitle = ev.eventName || ev.name || '—';
  const venueName = ev.venueName || '—';
  const image = eventImg(ev);
  // Prefer our own intermediate detail page; fall back to ClubTickets only if we
  // can't build an internal route.
  const internal = basePath && ev.venueSlug && ev.eventSlug
    ? `/${locale}/${basePath}/${ev.venueSlug}/${ev.eventSlug}`
    : '';
  const link = internal || ev.affLink || `/${locale}`;
  const isExternal = link.startsWith('http');
  const price = priceShort(ev.prices);
  return (
    <a href={link} target={isExternal ? '_blank' : '_self'} rel="noopener noreferrer" className="group flex flex-col bg-white rounded-2xl md:rounded-3xl border-2 border-transparent hover:border-black shadow-md hover:shadow-xl transition-all overflow-hidden h-full">
      <div className="w-full aspect-square relative bg-neutral-100 flex items-center justify-center border-b border-black/5">
        {image ? (
          <img src={optImg(image, 400)} loading="lazy" alt={eventTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-neutral-300 font-bold text-3xl">{venueName.slice(0, 2)}</div>
        )}
        {price && <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-black px-2 py-1 rounded-full z-10 shadow-md">{price}</div>}
      </div>
      <div className="p-3 md:p-4 flex-1 flex flex-col bg-white">
        <div className="text-[9px] md:text-[10px] font-black tracking-widest text-black uppercase mb-1 line-clamp-1">{venueName}</div>
        <h4 className="text-sm md:text-base font-serif font-bold text-black leading-tight mb-2 line-clamp-2">{eventTitle}</h4>
        <div className="mt-auto pt-2 border-t border-neutral-100">
          <span className="text-[10px] md:text-xs font-bold text-neutral-400 group-hover:text-black transition-colors uppercase tracking-widest flex items-center justify-between">
            {L.tickets} <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </a>
  );
}

function DayBlock({ date, items, label, isToday, locale, basePath = '' }: { date: string; items: WaterAgendaEvent[]; label: string; isToday: boolean; locale: string; basePath?: string }) {
  const L = getLabels(locale);
  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black/5">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight capitalize">{label}</h3>
          {isToday && <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">{L.live}</span>}
        </div>
        <div className="text-neutral-400 font-bold uppercase tracking-widest text-xs">{items.length} {L.departures}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {items.map(ev => <EventTile key={ev.id} ev={ev} locale={locale} basePath={basePath} />)}
      </div>
    </div>
  );
}

function MonthGrid({
  gridDays, monthDate, todayStr, dayEvents, selectedDay, onSelectDay, loc, moreLabel,
}: {
  gridDays: Date[];
  monthDate: Date;
  todayStr: string;
  dayEvents: (ds: string) => WaterAgendaEvent[];
  selectedDay: string | null;
  onSelectDay: (ds: string) => void;
  loc: Locale;
  moreLabel: string;
}) {
  const weekdays = gridDays.slice(0, 7);
  const MAX_CHIPS = 3;
  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-2 md:p-4">
      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
        {weekdays.map((d, i) => (
          <div key={i} className="text-center text-[9px] md:text-[11px] font-black uppercase tracking-widest text-black/40 py-1">
            {format(d, 'EEEEEE', { locale: loc })}
          </div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {gridDays.map((d, i) => {
          const ds = format(d, 'yyyy-MM-dd');
          const inMonth = isSameMonth(d, monthDate);
          const isDayToday = ds === todayStr;
          const isSelected = ds === selectedDay;
          const evs = inMonth ? dayEvents(ds) : [];
          const has = evs.length > 0;
          return (
            <button
              key={i}
              onClick={() => has && onSelectDay(ds)}
              disabled={!has}
              className={`relative min-h-[64px] md:min-h-[112px] rounded-xl md:rounded-2xl p-1.5 md:p-2 text-left align-top border transition-all flex flex-col
                ${!inMonth ? 'bg-neutral-50/40 border-transparent text-black/20' : has ? 'bg-white hover:border-black cursor-pointer' : 'bg-white/60 cursor-default'}
                ${isSelected ? 'border-black shadow-md ring-1 ring-black' : 'border-black/5'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] md:text-sm font-black ${isDayToday ? 'bg-red-500 text-white w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full' : inMonth ? 'text-black' : 'text-black/25'}`}>
                  {format(d, 'd')}
                </span>
                {has && <span className="hidden md:inline text-[9px] font-black text-black/40 bg-black/5 rounded-full px-1.5 py-0.5">{evs.length}</span>}
              </div>

              {/* Event blocks */}
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {evs.slice(0, MAX_CHIPS).map(ev => {
                  const img = eventImg(ev);
                  return (
                    <div key={ev.id} className="flex items-center gap-1 rounded-md bg-black/[0.04] hover:bg-black/[0.08] transition-colors px-1 py-0.5 min-w-0">
                      <span className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-[4px] overflow-hidden bg-white shrink-0 hidden md:flex items-center justify-center border border-black/5">
                        {img ? <img src={optImg(img, 60)} loading="lazy" alt="" className="w-full h-full object-cover" /> : <Ticket size={9} className="text-black/40" />}
                      </span>
                      <span className="text-[8px] md:text-[10px] font-bold text-black/70 truncate leading-tight">{ev.venueName || ev.eventName || '—'}</span>
                    </div>
                  );
                })}
                {evs.length > MAX_CHIPS && (
                  <span className="text-[8px] md:text-[10px] font-black text-black/40 pl-1">+{evs.length - MAX_CHIPS} {moreLabel}</span>
                )}
                {/* Mobile dot indicator when chips are hidden */}
                {has && (
                  <span className="md:hidden mt-auto w-1.5 h-1.5 rounded-full bg-ibiza-green shadow-[0_0_6px_rgba(61,106,150,0.6)]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// date-fns Locale type (imported implicitly through usage)
type Locale = typeof nl;
