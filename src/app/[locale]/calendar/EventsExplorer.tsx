'use client'

import React, { useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfDay, eachDayOfInterval, parseISO, isToday, isTomorrow,
} from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { MapPin, Ticket, CalendarDays, X, ChevronRight } from 'lucide-react'
import { VENUE_SPOTS, IBIZA_ISLAND_PATH } from '@/data/venue-coordinates'

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

// ── i18n ──────────────────────────────────────────────────────────────────────
const T_I18N: Record<string, {
  title: string; sub: string; mapHint: string; allClubs: string; clear: string;
  day: string; week: string; month: string; year: string; whole: (p: string) => string;
  events: (n: number) => string; noEvents: string; tickets: string; lineupMore: string;
  tonight: string; today: string; tomorrow: string; pickClub: string; live: string;
}> = {
  en: { title: 'EVENTS', sub: 'Discover what’s on across Ibiza — tap a club on the map or slide through the dates.', mapHint: 'Tap a club to see its events', allClubs: 'All clubs', clear: 'Clear', day: 'Day', week: 'Week', month: 'Month', year: 'Whole year', whole: p => `All ${p}`, events: n => `${n} ${n === 1 ? 'event' : 'events'}`, noEvents: 'No events for this selection.', tickets: 'Tickets', lineupMore: 'more', tonight: 'Tonight', today: 'Today', tomorrow: 'Tomorrow', pickClub: 'Showing', live: 'On tonight' },
  nl: { title: 'EVENTS', sub: 'Ontdek wat er speelt op Ibiza — tik een club op de kaart of schuif door de data.', mapHint: 'Tik op een club voor de events', allClubs: 'Alle clubs', clear: 'Wissen', day: 'Dag', week: 'Week', month: 'Maand', year: 'Heel het jaar', whole: p => `Hele ${p}`, events: n => `${n} ${n === 1 ? 'event' : 'events'}`, noEvents: 'Geen events voor deze selectie.', tickets: 'Tickets', lineupMore: 'meer', tonight: 'Vanavond', today: 'Vandaag', tomorrow: 'Morgen', pickClub: 'Weergave', live: 'Vanavond open' },
  de: { title: 'EVENTS', sub: 'Entdecke, was auf Ibiza los ist — tippe einen Club auf der Karte oder wische durch die Daten.', mapHint: 'Tippe auf einen Club für die Events', allClubs: 'Alle Clubs', clear: 'Zurücksetzen', day: 'Tag', week: 'Woche', month: 'Monat', year: 'Ganzes Jahr', whole: p => `Ganze ${p}`, events: n => `${n} ${n === 1 ? 'Event' : 'Events'}`, noEvents: 'Keine Events für diese Auswahl.', tickets: 'Tickets', lineupMore: 'mehr', tonight: 'Heute Abend', today: 'Heute', tomorrow: 'Morgen', pickClub: 'Anzeige', live: 'Heute Abend' },
  es: { title: 'EVENTS', sub: 'Descubre qué hay en Ibiza — toca un club en el mapa o desliza por las fechas.', mapHint: 'Toca un club para ver sus eventos', allClubs: 'Todos los clubs', clear: 'Borrar', day: 'Día', week: 'Semana', month: 'Mes', year: 'Todo el año', whole: p => `Todo el/la ${p}`, events: n => `${n} ${n === 1 ? 'evento' : 'eventos'}`, noEvents: 'No hay eventos para esta selección.', tickets: 'Entradas', lineupMore: 'más', tonight: 'Esta noche', today: 'Hoy', tomorrow: 'Mañana', pickClub: 'Mostrando', live: 'Esta noche' },
  fr: { title: 'EVENTS', sub: 'Découvrez ce qui se passe à Ibiza — touchez un club sur la carte ou faites défiler les dates.', mapHint: 'Touchez un club pour voir ses événements', allClubs: 'Tous les clubs', clear: 'Effacer', day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Toute l’année', whole: p => `Tout le/la ${p}`, events: n => `${n} ${n === 1 ? 'événement' : 'événements'}`, noEvents: 'Aucun événement pour cette sélection.', tickets: 'Billets', lineupMore: 'plus', tonight: 'Ce soir', today: 'Aujourd’hui', tomorrow: 'Demain', pickClub: 'Affichage', live: 'Ce soir' },
}
const getLoc = (l: string) => ({ nl, de, es, fr, en: enUS } as Record<string, Locale>)[l] || enUS
type Locale = typeof enUS

function priceFrom(prices?: string): string | null {
  if (!prices) return null
  const m = prices.match(/\d+([.,]\d+)?/)
  return m ? `€${m[0].replace(',', '.')}` : null
}
function lineupArtists(lineUp?: string): string[] {
  if (!lineUp) return []
  const txt = lineUp.replace(/<[^>]+>/g, ' ').replace(/\b(MAIN ROOM|THE BUNKER|CLUB ROOM|TERRACE|ROOM \d)\b/gi, ' ')
  return txt.replace(/\s+/g, ' ').trim().split(/[,\-–|]/).map(s => s.trim()).filter(s => s.length > 1)
}

export default function EventsExplorer({ events, allVenues, locale }: Props) {
  const loc = getLoc(locale)
  const T = T_I18N[locale] || T_I18N.en
  const base = `/${locale}`
  const today = useMemo(() => startOfDay(new Date()), [])
  const todayStr = format(today, 'yyyy-MM-dd')

  const [period, setPeriod] = useState<Period>('week')
  const [activeDay, setActiveDay] = useState<string | null>(null)
  const [venue, setVenue] = useState<string | null>(null)

  // Only clubbing events, upcoming
  const clubEvents = useMemo(
    () => events.filter(e => e.ct_venues?.type_slug === 'clubbing' && e.date >= todayStr),
    [events, todayStr]
  )

  const venueMap = useMemo(() => new Map(allVenues.map(v => [v.slug, v])), [allVenues])

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

  // Count of events per day (clubbing, in the venue-agnostic sense but respecting selected club) for the strip
  const countForDay = useCallback((ds: string) => {
    return clubEvents.filter(e => e.date === ds && (!venue || e.ct_venues?.slug === venue)).length
  }, [clubEvents, venue])

  // Events in current range (before venue filter) — drives the map
  const rangeEvents = useMemo(() => {
    const eff = period === 'day' && activeDay ? [activeDay] : null
    return clubEvents.filter(e => {
      if (eff) return eff.includes(e.date)
      if (activeDay) return e.date === activeDay
      return e.date >= rangeStartStr && e.date <= rangeEndStr
    })
  }, [clubEvents, period, activeDay, rangeStartStr, rangeEndStr])

  // Count per venue within range (for map badges)
  const venueCounts = useMemo(() => {
    const m: Record<string, number> = {}
    rangeEvents.forEach(e => { const s = e.ct_venues?.slug; if (s) m[s] = (m[s] || 0) + 1 })
    return m
  }, [rangeEvents])

  const liveTonight = useMemo(() => {
    const s = new Set<string>()
    clubEvents.forEach(e => { if (e.date === todayStr && e.ct_venues?.slug) s.add(e.ct_venues.slug) })
    return s
  }, [clubEvents, todayStr])

  // Final tiles (apply venue filter), grouped by date
  const grouped = useMemo(() => {
    const list = venue ? rangeEvents.filter(e => e.ct_venues?.slug === venue) : rangeEvents
    const m: Record<string, ExEvent[]> = {}
    list.forEach(e => { (m[e.date] ||= []).push(e) })
    Object.values(m).forEach(a => a.sort((x, y) => (x.ct_venues?.name || '').localeCompare(y.ct_venues?.name || '')))
    return m
  }, [rangeEvents, venue])
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

  const selectedVenueName = venue ? (venueMap.get(venue)?.name || venue) : null

  return (
    <div className="min-h-screen bg-[#0B0410] pb-24 pt-24 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">

        {/* ── Header ── */}
        <header className="mb-8 md:mb-10">
          <h1 className="font-serif text-6xl font-black uppercase leading-none tracking-tight text-white md:text-8xl">{T.title}</h1>
          <p className="mt-4 max-w-xl text-base font-medium text-white/55 md:text-lg">{T.sub}</p>
        </header>

        {/* ── Ibiza map ── */}
        <section className="relative mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#150826] via-[#0E0518] to-[#0B0410] p-4 shadow-2xl md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ background: 'radial-gradient(600px circle at 30% 20%, #14FF00, transparent 60%)' }} />
          <div className="relative flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 ring-1 ring-white/10">
              <MapPin size={14} className="text-ibiza-green" /> {T.mapHint}
            </span>
            {venue && (
              <button onClick={() => setVenue(null)} className="inline-flex items-center gap-1.5 rounded-full bg-ibiza-green/15 px-3.5 py-2 text-xs font-bold text-ibiza-green ring-1 ring-ibiza-green/30 transition hover:bg-ibiza-green/25">
                <X size={13} /> {T.clear}
              </button>
            )}
          </div>

          <div className="relative mx-auto mt-4 aspect-[4/3] w-full max-w-3xl">
            {/* Island silhouette */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="isle" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1C1030" />
                  <stop offset="100%" stopColor="#120A22" />
                </linearGradient>
              </defs>
              <path d={IBIZA_ISLAND_PATH} fill="url(#isle)" stroke="#14FF00" strokeOpacity="0.35" strokeWidth="0.6" />
            </svg>

            {/* Club pins */}
            {Object.entries(VENUE_SPOTS).map(([slug, spot]) => {
              const v = venueMap.get(slug)
              const count = venueCounts[slug] || 0
              const isLive = liveTonight.has(slug)
              const active = venue === slug
              const dim = count === 0 && !active
              return (
                <button
                  key={slug}
                  onClick={() => setVenue(active ? null : slug)}
                  title={v?.name || slug}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${active ? 'z-30 scale-125' : 'z-10 hover:z-20 hover:scale-110'}`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <span
                    className={`relative grid h-11 w-11 place-items-center rounded-full border-2 p-1.5 shadow-lg backdrop-blur-sm transition md:h-14 md:w-14 ${active ? 'border-ibiza-green bg-black' : dim ? 'border-white/15 bg-black/50' : 'border-white/40 bg-black/70'}`}
                    style={active ? { boxShadow: `0 0 22px ${spot.color}` } : undefined}
                  >
                    {v?.whitelogo ? (
                      <Image src={v.whitelogo} alt={v?.name || slug} width={44} height={44} className={`h-full w-full object-contain transition ${dim ? 'opacity-40' : 'opacity-100'}`} />
                    ) : (
                      <span className="text-[9px] font-bold">{(v?.name || slug).slice(0, 3)}</span>
                    )}
                    {count > 0 && (
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[10px] font-black text-black" style={{ background: spot.color }}>{count}</span>
                    )}
                    {isLive && <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 animate-pulse rounded-full border-2 border-black bg-ibiza-green" />}
                  </span>
                  <span className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100 ${active ? 'opacity-100' : ''}`}>{v?.name || slug}</span>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="relative mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-white/50">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ibiza-green" /> {T.live}</span>
            <span className="inline-flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded-full bg-white text-[8px] font-black text-black">3</span> {T.events(0).split(' ')[1] || 'events'}</span>
          </div>
        </section>

        {/* ── Airbnb-style period selector ── */}
        <div className="mb-5">
          <div className="relative grid grid-cols-4 rounded-full border border-white/10 bg-white/[0.04] p-1.5">
            <span
              className="absolute top-1.5 bottom-1.5 rounded-full bg-ibiza-green shadow-[0_0_18px_rgba(20,255,0,0.35)] transition-all duration-300 ease-out"
              style={{ left: `calc(${periodIdx * 25}% + 6px)`, width: 'calc(25% - 12px)' }}
            />
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => changePeriod(p.key)}
                className={`relative z-10 rounded-full py-2.5 text-center text-sm font-black uppercase tracking-wide transition-colors md:text-base ${period === p.key ? 'text-black' : 'text-white/70 hover:text-white'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Day-of-week strip ── */}
        {showStrip && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {period !== 'day' && (
              <button
                onClick={() => setActiveDay(null)}
                className={`shrink-0 rounded-2xl border px-4 py-3 text-sm font-bold transition ${!activeDay ? 'border-ibiza-green bg-ibiza-green/15 text-ibiza-green' : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25'}`}
              >
                {T.whole(period === 'week' ? T.week : T.month)}
              </button>
            )}
            {stripDays.map(d => {
              const ds = format(d, 'yyyy-MM-dd')
              const past = ds < todayStr
              const cnt = countForDay(ds)
              const on = activeDay === ds
              return (
                <button
                  key={ds}
                  disabled={past}
                  onClick={() => setActiveDay(on ? (period === 'day' ? ds : null) : ds)}
                  className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-2.5 transition ${on ? 'border-ibiza-green bg-ibiza-green text-black' : past ? 'cursor-not-allowed border-white/5 bg-transparent text-white/20' : 'border-white/10 bg-white/[0.03] text-white hover:border-white/30'}`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${on ? 'text-black/70' : 'text-white/45'}`}>{format(d, 'EEE', { locale: loc })}</span>
                  <span className="text-xl font-black leading-tight">{format(d, 'd')}</span>
                  <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${cnt > 0 ? (on ? 'bg-black' : 'bg-ibiza-green') : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>
        )}

        {/* ── Result summary ── */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-black text-white md:text-3xl">
            {selectedVenueName ? selectedVenueName : T.title.charAt(0) + T.title.slice(1).toLowerCase()}
          </h2>
          <span className="rounded-full bg-white/5 px-4 py-1.5 text-sm font-bold text-white/60 ring-1 ring-white/10">{T.events(totalCount)}</span>
        </div>

        {/* ── Tiles ── */}
        {totalCount === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center">
            <CalendarDays size={40} className="mx-auto mb-4 text-white/25" />
            <p className="text-lg font-semibold text-white/50">{T.noEvents}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {dateKeys.map(ds => (
              <div key={ds}>
                <h3 className="mb-4 flex items-center gap-3 font-serif text-lg font-black capitalize text-white/90 md:text-xl">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-ibiza-green/20 text-ibiza-green"><CalendarDays size={16} /></span>
                  {dayHeader(ds)}
                  <span className="text-sm font-bold text-white/35">· {grouped[ds].length}</span>
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[ds].map(ev => {
                    const img = ev.ct_events?.cover || ev.ct_events?.logo || ev.ct_venues?.picture || ''
                    const artists = lineupArtists(ev.lineUp).slice(0, 3)
                    const extra = Math.max(0, lineupArtists(ev.lineUp).length - 3)
                    const price = priceFrom(ev.prices)
                    const href = `${base}/club-tickets/${ev.ct_venues?.slug || 'club'}/${ev.ct_events?.slug || 'event'}`
                    return (
                      <Link key={ev.id} href={href} className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-lg transition-all hover:-translate-y-1 hover:border-ibiza-green/40 hover:shadow-2xl">
                        <div className="relative h-44 w-full overflow-hidden">
                          {img ? (
                            <Image src={img} alt={ev.ct_events?.name || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-[#1C1030] to-[#0B0410]" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          {/* Club logo badge */}
                          {ev.ct_venues?.whitelogo && (
                            <span className="absolute left-3 top-3 grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-black/60 p-1.5 backdrop-blur-md">
                              <Image src={ev.ct_venues.whitelogo} alt={ev.ct_venues?.name || ''} width={48} height={48} className="h-full w-full object-contain" />
                            </span>
                          )}
                          {price && (
                            <span className="absolute right-3 top-3 rounded-full bg-ibiza-green px-3 py-1 text-xs font-black text-black shadow">{price}</span>
                          )}
                          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-white/85">
                            <MapPin size={12} className="text-ibiza-green" /> {ev.ct_venues?.name}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h4 className="font-serif text-lg font-black leading-tight text-white line-clamp-2">{ev.ct_events?.name || ev.name}</h4>
                          {artists.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {artists.map((a, i) => (
                                <span key={i} className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-semibold text-white/75 ring-1 ring-white/10">{a}</span>
                              ))}
                              {extra > 0 && <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-ibiza-green">+{extra} {T.lineupMore}</span>}
                            </div>
                          )}
                          <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-ibiza-green px-4 py-2 text-sm font-black uppercase tracking-wide text-black transition group-hover:gap-2.5">
                            <Ticket size={15} /> {T.tickets} <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                          </span>
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
    </div>
  )
}
