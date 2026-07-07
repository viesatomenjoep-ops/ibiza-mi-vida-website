'use client'

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { WeekDockBar } from '@/components/ui/WeekDockBar'
import { ScrollCue } from '@/components/ui/ScrollCue'
import {
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfDay, eachDayOfInterval, parseISO, isToday, isTomorrow,
} from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { MapPin, Calendar } from 'lucide-react'
import { HomeCalendarLauncher, type PickerEvent } from '@/components/events/EventPickerWheel'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExEvent {
  id: string
  name: string
  date: string
  prices: string
  lineUp: string
  ct_events: { name?: string; slug?: string; logo?: string; cover?: string }
  ct_venues: { name?: string; slug?: string; whitelogo?: string; picture?: string; type_slug?: string }
}
interface LightVenue { name: string; slug: string; whitelogo: string; picture: string; type_slug: string }
interface Props {
  events: ExEvent[]
  allVenues: LightVenue[]
  locale: string
}

type Period = 'day' | 'week' | 'month' | 'year'

// Venue logos that are already light/coloured — keep as-is; all others get inverted to black on the white badge.
const KEEP_LOGO = ['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza']

// ── i18n ──────────────────────────────────────────────────────────────────────
const T_I18N: Record<string, {
  title: string; sub: string;
  day: string; week: string; month: string; year: string; whole: (p: string) => string;
  events: (n: number) => string; noEvents: string; tickets: string; view: string; lineupMore: string;
  today: string; tomorrow: string; upcoming: string;
}> = {
  en: { title: 'Club Tickets Ibiza', sub: 'Discover what’s on across Ibiza — slide through the dates and grab your tickets.', day: 'Day', week: 'Week', month: 'Month', year: 'Year', whole: p => `All ${p}`, events: n => `${n} ${n === 1 ? 'event' : 'events'}`, noEvents: 'No events for this selection.', tickets: 'Tickets', view: 'View', lineupMore: 'more', today: 'Today', tomorrow: 'Tomorrow', upcoming: 'All upcoming events' },
  nl: { title: 'Club Tickets Ibiza', sub: 'Ontdek wat er speelt op Ibiza — schuif door de data en scoor je tickets.', day: 'Dag', week: 'Week', month: 'Maand', year: 'Jaar', whole: p => `Hele ${p}`, events: n => `${n} ${n === 1 ? 'event' : 'events'}`, noEvents: 'Geen events voor deze selectie.', tickets: 'Tickets', view: 'Bekijk', lineupMore: 'meer', today: 'Vandaag', tomorrow: 'Morgen', upcoming: 'Alle aankomende events' },
  de: { title: 'Club Tickets Ibiza', sub: 'Entdecke, was auf Ibiza los ist — wische durch die Daten und sichere dir deine Tickets.', day: 'Tag', week: 'Woche', month: 'Monat', year: 'Jahr', whole: p => `Ganze ${p}`, events: n => `${n} ${n === 1 ? 'Event' : 'Events'}`, noEvents: 'Keine Events für diese Auswahl.', tickets: 'Tickets', view: 'Ansehen', lineupMore: 'mehr', today: 'Heute', tomorrow: 'Morgen', upcoming: 'Alle kommenden Events' },
  es: { title: 'Club Tickets Ibiza', sub: 'Descubre qué hay en Ibiza — desliza por las fechas y consigue tus entradas.', day: 'Día', week: 'Semana', month: 'Mes', year: 'Año', whole: p => `Todo el/la ${p}`, events: n => `${n} ${n === 1 ? 'evento' : 'eventos'}`, noEvents: 'No hay eventos para esta selección.', tickets: 'Entradas', view: 'Ver', lineupMore: 'más', today: 'Hoy', tomorrow: 'Mañana', upcoming: 'Todos los próximos eventos' },
  fr: { title: 'Club Tickets Ibiza', sub: 'Découvrez ce qui se passe à Ibiza — faites défiler les dates et prenez vos billets.', day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Année', whole: p => `Tout le/la ${p}`, events: n => `${n} ${n === 1 ? 'événement' : 'événements'}`, noEvents: 'Aucun événement pour cette sélection.', tickets: 'Billets', view: 'Voir', lineupMore: 'plus', today: 'Aujourd’hui', tomorrow: 'Demain', upcoming: 'Tous les événements à venir' },
}
const getLoc = (l: string) => ({ nl, de, es, fr, en: enUS } as Record<string, Locale>)[l] || enUS
type Locale = typeof enUS

function priceFrom(prices?: string): string | null {
  if (!prices) return null
  const m = prices.match(/\d+([.,]\d+)?/)
  return m ? `€${m[0].replace(',', '.').replace(/\.00$/, '')}` : null
}
function lineupArtists(lineUp?: string): string[] {
  if (!lineUp) return []
  const txt = lineUp.replace(/<[^>]+>/g, ' ').replace(/\b(MAIN ROOM|THE BUNKER|CLUB ROOM|TERRACE|ROOM \d)\b/gi, ' ')
  return txt.replace(/\s+/g, ' ').trim().split(/[,\-–|]/).map(s => s.trim()).filter(s => s.length > 1)
}

export default function EventsExplorer({ events, locale }: Props) {
  const loc = getLoc(locale)
  const T = T_I18N[locale] || T_I18N.en
  const base = `/${locale}`
  const today = useMemo(() => startOfDay(new Date()), [])
  const todayStr = format(today, 'yyyy-MM-dd')

  const [period, setPeriod] = useState<Period>('week')
  const [activeDay, setActiveDay] = useState<string | null>(null)

  // Normalised events for the iOS-style picker wheel
  const pickerEvents: PickerEvent[] = useMemo(() => events
    .filter(e => e.ct_venues?.type_slug === 'clubbing' && (e.date || '') >= todayStr)
    .map(e => {
      const m = String(e.prices || '').match(/\d+([.,]\d+)?/)
      return {
        id: e.id,
        clubSlug: e.ct_venues?.slug || '',
        clubName: e.ct_venues?.name || '',
        // real logos only — a photo forced to brightness-0 becomes a black square
        clubLogo: e.ct_venues?.whitelogo || '',
        eventSlug: e.ct_events?.slug || '',
        eventName: e.ct_events?.name || e.name || '',
        image: e.ct_events?.cover || e.ct_events?.logo || e.ct_venues?.picture || '',
        date: e.date || '',
        price: m ? parseFloat(m[0].replace(',', '.')) : 0,
        lineUp: e.lineUp || '',
        href: `/${locale}/club-tickets/${e.ct_venues?.slug}/${e.ct_events?.slug}`,
        affLink: (e as any).affLink || '',
      }
    }), [events, locale, todayStr])

  // Only clubbing events, upcoming
  const clubEvents = useMemo(
    () => events.filter(e => e.ct_venues?.type_slug === 'clubbing' && e.date >= todayStr),
    [events, todayStr]
  )

  // Date range for the current period
  const { rangeStart, rangeEnd, stripDays, showStrip } = useMemo(() => {
    let s = today, e = today, strip = true
    if (period === 'day') { s = today; e = addDays(today, 13) }
    else if (period === 'week') { s = startOfWeek(today, { weekStartsOn: 1 }); e = endOfWeek(today, { weekStartsOn: 1 }) }
    else if (period === 'month') { s = startOfMonth(today); e = endOfMonth(today) }
    else { s = today; e = addDays(today, 365); strip = false }
    const days = strip ? eachDayOfInterval({ start: s, end: e }) : []
    return { rangeStart: s, rangeEnd: e, stripDays: days, showStrip: strip }
  }, [period, today])

  const rangeStartStr = format(rangeStart, 'yyyy-MM-dd')
  const rangeEndStr = format(rangeEnd, 'yyyy-MM-dd')

  const changePeriod = useCallback((p: Period) => {
    setPeriod(p)
    setActiveDay(p === 'day' ? todayStr : null)
  }, [todayStr])

  const countForDay = useCallback((ds: string) => {
    return clubEvents.filter(e => e.date === ds).length
  }, [clubEvents])

  // Fixed bottom week dock (blurred event photos) — day-select filters the list
  const listRef = useRef<HTMLDivElement>(null)
  const imgByDate = useMemo(() => { const m = new Map<string, string>(); pickerEvents.forEach(e => { if (!m.has(e.date) && e.image) m.set(e.date, e.image) }); return m }, [pickerEvents])
  const imagePool = useMemo(() => Array.from(new Set(pickerEvents.map(e => e.image).filter(Boolean))).slice(0, 12) as string[], [pickerEvents])
  const [dockWeekStart, setDockWeekStart] = useState<string>(() => {
    const ds = pickerEvents.map(e => e.date).filter(d => d >= todayStr).sort()[0] || todayStr
    return format(startOfWeek(parseISO(ds), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  })
  useEffect(() => {
    if (!activeDay || !listRef.current) return
    const el = listRef.current
    const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 90)
    return () => clearTimeout(t)
  }, [activeDay])

  // Tiles: all upcoming events, or just the day picked in the dock
  const rangeEvents = activeDay ? clubEvents.filter(e => e.date === activeDay) : clubEvents

  // Grouped by date — shuffled per day, with the biggest clubs favoured toward the
  // top (in random order among themselves), so it's never always "Universe first".
  const grouped = useMemo(() => {
    const TOP = ['unvrs-ibiza', 'hi-ibiza', 'ushuaia-ibiza']
    const m: Record<string, ExEvent[]> = {}
    rangeEvents.forEach(e => { (m[e.date] ||= []).push(e) })
    Object.values(m).forEach(a => {
      // shuffle first, then a stable sort that only lifts the top clubs above the rest
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
      a.sort((x, y) => (TOP.includes(x.ct_venues?.slug || '') ? 0 : 1) - (TOP.includes(y.ct_venues?.slug || '') ? 0 : 1))
    })
    return m
  }, [rangeEvents])
  const dateKeys = useMemo(() => Object.keys(grouped).sort(), [grouped])
  const totalCount = useMemo(() => dateKeys.reduce((n, k) => n + grouped[k].length, 0), [dateKeys, grouped])

  const dayHeader = (ds: string) => {
    const d = parseISO(ds)
    if (isToday(d)) return `${T.today} · ${format(d, 'd MMM', { locale: loc })}`
    if (isTomorrow(d)) return `${T.tomorrow} · ${format(d, 'd MMM', { locale: loc })}`
    return format(d, 'EEEE d MMMM', { locale: loc })
  }

  const periods: { key: Period; label: string }[] = [
    { key: 'day', label: T.day }, { key: 'week', label: T.week },
    { key: 'month', label: T.month }, { key: 'year', label: T.year },
  ]
  const periodIdx = periods.findIndex(p => p.key === period)

  return (
    <div className="theme-monaco-vip bg-neutral-50 text-[var(--color-ink)] min-h-screen relative overflow-hidden">

      {/* ── Header (house style) ── */}
      <section className="pt-[calc(var(--nav-h)+12px)] pb-0 relative z-10 flex flex-col items-center text-center px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-col gap-1 text-center mb-0">
            <h1 className="text-4xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">
              {T.title}
            </h1>
            <p className="hidden md:block font-sans text-base md:text-lg text-neutral-600 max-w-2xl mx-auto mt-2">
              {T.sub}
            </p>
          </div>
        </div>
      </section>


      <div ref={listRef} style={{ scrollMarginTop: 'calc(var(--nav-h) + 32px)', minHeight: activeDay ? 'calc(100svh - var(--nav-h))' : undefined }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-40">

        {/* Scroll-down cue — appears once a day is picked in the dock */}
        {activeDay && <ScrollCue className="mb-2" />}

        {/* ── Section label (Deals-of-the-Day style) ── */}
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-ibiza-green animate-ping shrink-0" />
            <h2 className="text-xl md:text-2xl font-serif font-black text-black uppercase tracking-wide">
              {activeDay ? dayHeader(activeDay) : T.upcoming}
            </h2>
          </div>
          <span className="hidden sm:inline text-xs font-bold text-black/50 uppercase tracking-widest">{T.events(totalCount)}</span>
        </div>

        {/* ── Tiles ── */}
        {totalCount === 0 ? (
          <div className="col-span-full text-center py-20 text-black/50 bg-black/5 rounded-3xl border border-black/10">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30 text-ibiza-green" />
            <p className="font-semibold text-base">{T.noEvents}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {dateKeys.map(ds => (
              <div key={ds}>
                {/* Day group header (only meaningful for multi-day ranges) */}
                {!activeDay && (
                  <h3 className="mb-4 flex items-center gap-3 font-serif text-lg font-black capitalize text-black md:text-xl">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-ibiza-green/15 text-ibiza-green"><Calendar size={16} /></span>
                    {dayHeader(ds)}
                    <span className="text-sm font-bold text-black/30">· {grouped[ds].length}</span>
                  </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {grouped[ds].map(ev => {
                    const image = ev.ct_events?.cover || ev.ct_events?.logo || ev.ct_venues?.picture || ''
                    const logoSrc = ev.ct_venues?.whitelogo
                    const slug = ev.ct_venues?.slug || ''
                    const artists = lineupArtists(ev.lineUp).slice(0, 3)
                    const extra = Math.max(0, lineupArtists(ev.lineUp).length - 3)
                    const price = priceFrom(ev.prices)
                    const href = `${base}/club-tickets/${slug || 'club'}/${ev.ct_events?.slug || 'event'}`
                    return (
                      <Link
                        key={ev.id}
                        href={href}
                        className="bg-black/5 hover:bg-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-black/10 hover:border-ibiza-green/60 transition-all duration-300 group flex flex-col hover:scale-[1.02]"
                      >
                        <div className="h-48 relative bg-[#0D0509] overflow-hidden shrink-0">
                          {image ? (
                            <img src={image} alt={ev.ct_events?.name || ev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-[#0D0509] to-neutral-900" />
                          )}

                          {/* Price badge */}
                          {price && (
                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-ibiza-green border border-ibiza-green/30 font-black text-sm px-4 py-1.5 rounded-lg shadow-lg">
                              {price}
                            </div>
                          )}

                          {/* Club logo badge */}
                          {logoSrc && (
                            <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl bg-white border border-white/20 p-1.5 flex items-center justify-center shadow-lg z-10">
                              <img
                                src={logoSrc}
                                alt=""
                                style={{ filter: KEEP_LOGO.includes(slug) ? 'none' : 'brightness(0)' }}
                                className="object-contain max-w-full max-h-full"
                              />
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1 text-black">
                          <div className="text-ibiza-green text-[10px] font-black tracking-widest uppercase mb-1.5">
                            {ev.date}
                          </div>
                          <h3 className="text-lg font-bold text-black leading-snug mb-1 group-hover:text-ibiza-green transition-colors line-clamp-2">
                            {ev.ct_events?.name || ev.name}
                          </h3>
                          {artists.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {artists.map((a, i) => (
                                <span key={i} className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/70 ring-1 ring-black/10">{a}</span>
                              ))}
                              {extra > 0 && <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-ibiza-green">+{extra} {T.lineupMore}</span>}
                            </div>
                          )}
                          <div className="text-xs font-semibold text-black/50 flex items-center gap-1.5 mb-5 mt-auto pt-3">
                            <MapPin size={14} className="text-black/40" /> {ev.ct_venues?.name || 'Ibiza'}
                          </div>
                          <div className="pt-4 border-t border-black/10 w-full mt-auto flex justify-between items-center">
                            <span className="text-xs font-bold text-black/60 uppercase tracking-widest">{T.tickets}</span>
                            <span className="bg-ibiza-green text-velvet-obsidian text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider group-hover:brightness-95 transition-all">
                              {T.view}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed bottom week dock — blurred event photos, white text; pick a day to open it */}
      {pickerEvents.length > 0 && (
        <WeekDockBar
          eventDates={pickerEvents.map(e => e.date)}
          weekStart={dockWeekStart}
          setWeekStart={setDockWeekStart}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          locale={locale}
          variant="photo"
          photoDim={false}
          imageFor={(iso) => imgByDate.get(iso) || ''}
          imagePool={imagePool}
          agenda={<HomeCalendarLauncher events={pickerEvents} locale={locale} persistKey="calendar" compact />}
        />
      )}
    </div>
  )
}
