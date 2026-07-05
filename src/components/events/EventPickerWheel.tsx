'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { format, parseISO, isValid, startOfDay, startOfWeek, addDays, endOfMonth } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { Ticket, Music, ChevronRight, ChevronLeft, CalendarDays, X, Maximize2 } from 'lucide-react'

export interface PickerEvent {
  id: string
  clubSlug: string
  clubName: string
  clubLogo?: string
  eventSlug: string
  eventName: string
  image?: string
  date: string // ISO yyyy-mm-dd
  price: number
  lineUp?: string
  href: string
  affLink?: string
}

type Period = 'day' | 'week' | 'month'

const DF: Record<string, any> = { nl, en: enUS, de, es, fr }

const LABELS: Record<string, {
  day: string; week: string; month: string; from: string; lineup: string;
  view: string; none: string; open: string; book: string; pickClub: string; pickDate: string; seeLineup: string; weekN: string; openCal: string; close: string
}> = {
  en: { day: 'Day', week: 'Week', month: 'Month', from: 'From', lineup: 'Line-up', view: 'View event', none: 'No events', open: 'Spin to your night', book: 'View & book', pickClub: 'Club', pickDate: 'Date', seeLineup: 'See line-up', weekN: 'Week', openCal: 'Open the calendar', close: 'Close' },
  nl: { day: 'Dag', week: 'Week', month: 'Maand', from: 'Vanaf', lineup: 'Line-up', view: 'Bekijk event', none: 'Geen events', open: 'Draai naar jouw avond', book: 'Bekijk & boek', pickClub: 'Club', pickDate: 'Datum', seeLineup: 'Bekijk line-up', weekN: 'Week', openCal: 'Open de kalender', close: 'Sluiten' },
  de: { day: 'Tag', week: 'Woche', month: 'Monat', from: 'Ab', lineup: 'Line-up', view: 'Event ansehen', none: 'Keine Events', open: 'Dreh zu deiner Nacht', book: 'Ansehen & buchen', pickClub: 'Club', pickDate: 'Datum', seeLineup: 'Line-up ansehen', weekN: 'Woche', openCal: 'Kalender öffnen', close: 'Schließen' },
  es: { day: 'Día', week: 'Semana', month: 'Mes', from: 'Desde', lineup: 'Line-up', view: 'Ver evento', none: 'Sin eventos', open: 'Gira hacia tu noche', book: 'Ver y reservar', pickClub: 'Club', pickDate: 'Fecha', seeLineup: 'Ver line-up', weekN: 'Semana', openCal: 'Abrir el calendario', close: 'Cerrar' },
  fr: { day: 'Jour', week: 'Semaine', month: 'Mois', from: 'Dès', lineup: 'Line-up', view: 'Voir', none: 'Aucun événement', open: 'Tourne vers ta nuit', book: 'Voir & réserver', pickClub: 'Club', pickDate: 'Date', seeLineup: 'Voir le line-up', weekN: 'Semaine', openCal: 'Ouvrir le calendrier', close: 'Fermer' },
}

// ── Vertical iOS-style wheel (compact) ────────────────────────────────────────
function Wheel({ count, rowH, visible, onIndex, render, initialIndex = 0 }: {
  count: number; rowH: number; visible: number; onIndex?: (i: number) => void; render: (i: number, active: boolean) => React.ReactNode; initialIndex?: number
}) {
  const H = rowH * visible
  const PAD = H / 2 - rowH / 2
  const scrollRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const raf = useRef(0)
  const last = useRef(-1)
  const [act, setAct] = useState(0)

  const apply = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const s = el.scrollTop / rowH
    let near = Math.max(0, Math.min(count - 1, Math.round(s)))
    for (let i = 0; i < count; i++) {
      const row = rowRefs.current[i]
      if (!row) continue
      const d = i - s
      const ad = Math.abs(d)
      row.style.transform = `scale(${Math.max(0.68, 1 - ad * 0.13).toFixed(3)}) rotateX(${Math.max(-60, Math.min(60, -d * 22)).toFixed(1)}deg)`
      row.style.opacity = Math.max(0.22, 1 - ad * 0.3).toFixed(3)
    }
    if (near !== last.current) { last.current = near; setAct(near); onIndex?.(near) }
  }, [count, rowH, onIndex])

  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(apply) }
  useEffect(() => { last.current = -1; requestAnimationFrame(apply) }, [count, apply])
  useEffect(() => {
    const el = scrollRef.current
    if (el && initialIndex > 0 && initialIndex < count) { el.scrollTop = initialIndex * rowH; last.current = -1; requestAnimationFrame(apply) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative select-none" style={{ height: H }}>
      <div className="pointer-events-none absolute inset-x-1 z-0 rounded-2xl border-2 border-ibiza-green/70 bg-ibiza-green/5" style={{ top: PAD, height: rowH }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white to-transparent" style={{ height: PAD }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white to-transparent" style={{ height: PAD }} />
      <div ref={scrollRef} onScroll={onScroll} className="hide-scrollbar h-full overflow-y-auto" style={{ scrollSnapType: 'y mandatory', perspective: '900px', paddingTop: PAD, paddingBottom: PAD }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} ref={(el) => { rowRefs.current[i] = el }} className="flex items-center justify-center px-1" style={{ height: rowH, scrollSnapAlign: 'center', transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
            {render(i, i === act)}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Horizontal iOS-style wheel (full-screen agenda) ───────────────────────────
function WheelH({ count, itemW, itemH, onIndex, render, initialIndex = 0 }: {
  count: number; itemW: number; itemH: number; onIndex?: (i: number) => void; render: (i: number, active: boolean) => React.ReactNode; initialIndex?: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const raf = useRef(0)
  const last = useRef(-1)
  const [act, setAct] = useState(0)

  const apply = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const s = el.scrollLeft / itemW
    let near = Math.max(0, Math.min(count - 1, Math.round(s)))
    for (let i = 0; i < count; i++) {
      const row = rowRefs.current[i]
      if (!row) continue
      const d = i - s
      const ad = Math.abs(d)
      row.style.transform = `scale(${Math.max(0.66, 1 - ad * 0.12).toFixed(3)}) rotateY(${Math.max(-55, Math.min(55, -d * 24)).toFixed(1)}deg)`
      row.style.opacity = Math.max(0.22, 1 - ad * 0.28).toFixed(3)
    }
    if (near !== last.current) { last.current = near; setAct(near); onIndex?.(near) }
  }, [count, itemW, onIndex])

  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(apply) }
  useEffect(() => { last.current = -1; requestAnimationFrame(apply) }, [count, apply])
  useEffect(() => {
    const el = scrollRef.current
    if (el && initialIndex > 0 && initialIndex < count) { el.scrollLeft = initialIndex * itemW; last.current = -1; requestAnimationFrame(apply) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const step = (dir: number) => { const el = scrollRef.current; if (el) el.scrollBy({ left: dir * itemW, behavior: 'smooth' }) }

  const pad = `calc(50% - ${itemW / 2}px)`
  return (
    <div className="relative select-none" style={{ height: itemH }}>
      <div className="pointer-events-none absolute inset-y-1 left-1/2 z-0 -translate-x-1/2 rounded-2xl border-2 border-ibiza-green/70 bg-ibiza-green/5" style={{ width: itemW }} />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-white to-transparent" />
      <button type="button" aria-label="Previous" onClick={() => step(-1)} className="absolute left-1 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white text-black shadow-md transition-colors hover:bg-ibiza-green md:grid"><ChevronLeft size={20} /></button>
      <button type="button" aria-label="Next" onClick={() => step(1)} className="absolute right-1 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white text-black shadow-md transition-colors hover:bg-ibiza-green md:grid"><ChevronRight size={20} /></button>
      <div ref={scrollRef} onScroll={onScroll} className="hide-scrollbar flex h-full items-center overflow-x-auto" style={{ scrollSnapType: 'x mandatory', perspective: '1100px', paddingLeft: pad, paddingRight: pad }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} ref={(el) => { rowRefs.current[i] = el }} className="flex shrink-0 items-center justify-center" style={{ width: itemW, scrollSnapAlign: 'center', transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
            {render(i, i === act)}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Shared data hook for the picker ───────────────────────────────────────────
function usePickerData(events: PickerEvent[], locale: string, persistKey?: string) {
  const todayStr = useMemo(() => format(startOfDay(new Date()), 'yyyy-MM-dd'), [])
  const saved = useRef<{ period?: Period; clubIdx?: number; dateIdx?: number }>(
    (() => { if (persistKey && typeof window !== 'undefined') { try { return JSON.parse(sessionStorage.getItem('epw:' + persistKey) || '{}') } catch { return {} } } return {} })()
  ).current
  const [period, setPeriod] = useState<Period>(saved.period || 'week')
  const [clubIdx, setClubIdx] = useState<number>(saved.clubIdx ?? 0)
  const [dateIdx, setDateIdx] = useState<number>(saved.dateIdx ?? 0)

  useEffect(() => {
    if (persistKey && typeof window !== 'undefined') {
      try { sessionStorage.setItem('epw:' + persistKey, JSON.stringify({ period, clubIdx, dateIdx })) } catch {}
    }
  }, [persistKey, period, clubIdx, dateIdx])

  const clubs = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; logo?: string }>()
    events.filter(e => e.date >= todayStr).forEach(e => { if (!map.has(e.clubSlug)) map.set(e.clubSlug, { slug: e.clubSlug, name: e.clubName, logo: e.clubLogo }) })
    return Array.from(map.values())
  }, [events, todayStr])

  const club = clubs[Math.min(clubIdx, clubs.length - 1)]

  // Date items depend on the period:
  //  • day   → one item per event day
  //  • week  → one item per Mon–Sun week that has events (pick a whole week at a glance)
  //  • month → one item per month (season runs ~Apr–Oct, from the real events)
  type DItem = { key: string; ev: PickerEvent; top: string; mid: string; bottom: string; start: string; end: string }
  const dateItems = useMemo<DItem[]>(() => {
    if (!club) return []
    const all = events
      .filter(e => e.clubSlug === club.slug && /^\d{4}-\d{2}-\d{2}/.test(e.date) && e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
    const loc = DF[locale] || enUS
    const f = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }

    if (period === 'day') {
      const seen = new Set<string>()
      const out: DItem[] = []
      all.forEach(e => { if (!seen.has(e.date)) { seen.add(e.date); out.push({ key: e.date, ev: e, top: f(e.date, 'EEE'), mid: f(e.date, 'd'), bottom: f(e.date, 'MMM'), start: e.date, end: e.date }) } })
      return out
    }
    if (period === 'week') {
      const map = new Map<string, PickerEvent>()
      all.forEach(e => { const wk = format(startOfWeek(parseISO(e.date), { weekStartsOn: 1 }), 'yyyy-MM-dd'); if (!map.has(wk)) map.set(wk, e) })
      return Array.from(map.entries()).map(([wk, e]) => {
        const mon = parseISO(wk); const sun = addDays(mon, 6); const fri = addDays(mon, 4)
        return { key: wk, ev: e, top: f(wk, 'MMM'), mid: `${format(mon, 'd')}–${format(fri, 'd')}`, bottom: 'WEEK', start: wk, end: format(sun, 'yyyy-MM-dd') }
      })
    }
    // month
    const map = new Map<string, PickerEvent>()
    all.forEach(e => { const mk = e.date.slice(0, 7); if (!map.has(mk)) map.set(mk, e) })
    return Array.from(map.entries()).map(([mk, e]) => {
      const start = `${mk}-01`
      return { key: mk, ev: e, top: f(e.date, 'yyyy'), mid: f(e.date, 'MMM'), bottom: '', start, end: format(endOfMonth(parseISO(start)), 'yyyy-MM-dd') }
    })
  }, [events, club, period, todayStr, locale])

  const dateItem = dateItems[Math.min(dateIdx, dateItems.length - 1)]
  const ev = dateItem?.ev

  // All events for the selected club within the selected window (day/week/month)
  const windowEvents = useMemo(() => {
    if (!club || !dateItem) return [] as PickerEvent[]
    return events
      .filter(e => e.clubSlug === club.slug && e.date >= dateItem.start && e.date <= dateItem.end)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [events, club, dateItem])

  return { period, setPeriod, clubs, club, clubIdx, setClubIdx, dateItems, dateIdx, setDateIdx, ev, dateItem, windowEvents, initialClubIdx: saved.clubIdx ?? 0, initialDateIdx: saved.dateIdx ?? 0 }
}

function PeriodTabs({ period, setPeriod, locale }: { period: Period; setPeriod: (p: Period) => void; locale: string }) {
  const L = LABELS[locale] || LABELS.en
  return (
    <div className="mb-4 flex justify-center">
      <div className="inline-flex rounded-full bg-black/5 p-1">
        {(['day', 'week', 'month'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all md:px-5 md:text-sm ${period === p ? 'bg-ibiza-green text-black shadow-sm' : 'text-black/50 hover:text-black'}`}>{L[p]}</button>
        ))}
      </div>
    </div>
  )
}

function InfoCta({ ev, locale, fmt }: { ev: PickerEvent; locale: string; fmt: (iso: string, p: string) => string }) {
  const L = LABELS[locale] || LABELS.en
  return (
    <Link href={ev.href} className="group mt-4 flex items-center gap-4 rounded-2xl border border-black/10 bg-black/5 p-4 transition-colors hover:bg-white">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ibiza-green text-black"><Ticket size={20} /></span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-lg font-black text-black md:text-xl">{ev.eventName}</h3>
        <p className="truncate text-sm font-semibold text-black/60">{ev.clubName} · <span className="capitalize">{fmt(ev.date, 'EEEE d MMMM')}</span></p>
        {ev.lineUp && <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-semibold text-black/50"><Music size={13} className="shrink-0 text-ibiza-green" /> {ev.lineUp}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end">
        {ev.price > 0 && <><span className="text-[10px] font-bold uppercase tracking-wider text-black/40">{L.from}</span><span className="font-serif text-xl font-black text-black">€{ev.price}</span></>}
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-ibiza-green px-3 py-1 text-xs font-black uppercase tracking-wider text-black">{L.book} <ChevronRight size={14} /></span>
      </div>
    </Link>
  )
}

// ── Event mini-card (whole card → event detail / line-up page) ────────────────
function EventMini({ e, locale, fmt }: { e: PickerEvent; locale: string; fmt: (iso: string, p: string) => string }) {
  return (
    <Link href={e.href} className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-3 shadow-sm transition-colors hover:border-ibiza-green">
      <span className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-neutral-900">
        {e.image ? <img src={e.image} alt={e.eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
        {e.price > 0 && <span className="absolute left-1.5 top-1.5 rounded bg-ibiza-green px-2 py-0.5 text-[11px] font-black text-black">€{e.price}</span>}
      </span>
      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 font-serif text-lg font-black leading-tight text-black">{e.eventName}</div>
        <div className="mt-0.5 truncate text-xs font-semibold capitalize text-black/50">{fmt(e.date, 'EEEE d MMM')}</div>
        {e.lineUp && <div className="mt-1 flex items-center gap-1 truncate text-[11px] text-black/45"><Music size={11} className="shrink-0 text-ibiza-green" /> {e.lineUp}</div>}
      </div>
      <ChevronRight size={20} className="shrink-0 text-ibiza-green" />
    </Link>
  )
}

// Grouped list of all window events (per day for week, per week→day for month)
function WindowList({ events, period, locale, fmt }: { events: PickerEvent[]; period: Period; locale: string; fmt: (iso: string, p: string) => string }) {
  const L = LABELS[locale] || LABELS.en
  if (events.length === 0) return <div className="rounded-2xl border border-black/10 bg-black/5 p-6 text-center text-sm font-semibold text-black/40">{L.none}</div>

  const byDay = (list: PickerEvent[]) => {
    const groups: { date: string; items: PickerEvent[] }[] = []
    list.forEach(e => { const g = groups.find(x => x.date === e.date); if (g) g.items.push(e); else groups.push({ date: e.date, items: [e] }) })
    return groups
  }

  if (period === 'month') {
    // group by ISO week
    const weeks: { key: string; label: string; items: PickerEvent[] }[] = []
    events.forEach(e => {
      const wk = format(startOfWeek(parseISO(e.date), { weekStartsOn: 1 }), 'yyyy-MM-dd')
      const g = weeks.find(x => x.key === wk)
      if (g) g.items.push(e)
      else weeks.push({ key: wk, label: `${L.weekN} ${weeks.length + 1}`, items: [e] })
    })
    return (
      <div className="flex flex-col gap-5">
        {weeks.map(w => (
          <div key={w.key}>
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ibiza-green">
              <CalendarDays size={14} /> {w.label} · {fmt(w.key, 'd MMM')}
            </div>
            <div className="flex flex-col gap-2.5">
              {byDay(w.items).map(g => g.items.map(e => <EventMini key={e.id} e={e} locale={locale} fmt={fmt} />))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // week → group by day
  return (
    <div className="flex flex-col gap-4">
      {byDay(events).map(g => (
        <div key={g.date}>
          <div className="mb-1.5 text-xs font-black uppercase tracking-widest capitalize text-black/50">{fmt(g.date, 'EEEE d MMMM')}</div>
          <div className="flex flex-col gap-2.5">
            {g.items.map(e => <EventMini key={e.id} e={e} locale={locale} fmt={fmt} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Compact picker (vertical columns) ─────────────────────────────────────────
function PickerColumns({ events, locale }: { events: PickerEvent[]; locale: string }) {
  const L = LABELS[locale] || LABELS.en
  const loc = DF[locale] || enUS
  const fmt = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }
  const { period, setPeriod, clubs, club, setClubIdx, dateItems, setDateIdx, ev } = usePickerData(events, locale)

  if (clubs.length === 0) return <div className="p-10 text-center text-sm font-semibold text-black/40">{L.none}</div>

  return (
    <div className="w-full">
      <PeriodTabs period={period} setPeriod={setPeriod} locale={locale} />
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">
        <div className="grid grid-cols-[1fr_1fr_1.5fr] items-stretch">
          <div className="border-r border-black/5">
            <div className="border-b border-black/5 py-2 text-center text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickClub}</div>
            <Wheel count={clubs.length} rowH={66} visible={3} onIndex={(i) => { setClubIdx(i); setDateIdx(0) }} render={(i, active) => {
              const c = clubs[i]
              return (
                <div className="flex flex-col items-center gap-1">
                  <span className="grid h-9 w-full place-items-center">{c.logo ? <img src={c.logo} alt="" className="max-h-8 max-w-[80%] object-contain [filter:brightness(0)]" /> : <span className="text-xs font-black text-black">{c.name.slice(0, 3).toUpperCase()}</span>}</span>
                  <span className={`px-1 text-center text-[10px] font-bold leading-tight line-clamp-1 ${active ? 'text-black' : 'text-black/50'}`}>{c.name}</span>
                </div>
              )
            }} />
          </div>
          <div className="border-r border-black/5">
            <div className="border-b border-black/5 py-2 text-center text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickDate}</div>
            <Wheel key={`${club?.slug}-${period}`} count={dateItems.length} rowH={66} visible={3} onIndex={(i) => setDateIdx(i)} render={(i, active) => {
              const d = dateItems[i]; if (!d) return null
              return (
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className={`text-[10px] font-black uppercase tracking-wide ${active ? 'text-black/50' : 'text-black/30'}`}>{d.top}</span>
                  <span className={`font-serif ${period === 'week' ? 'text-base' : 'text-2xl'} font-black ${active ? 'text-black' : 'text-black/70'}`}>{d.mid}</span>
                  <span className="text-[10px] font-black uppercase tracking-wide text-ibiza-green">{d.bottom}</span>
                </div>
              )
            }} />
          </div>
          <div className="relative">
            {ev ? (
              <Link href={ev.href} className="group block h-full w-full">
                <div className="relative h-full w-full overflow-hidden bg-neutral-900">
                  {ev.image ? <img key={ev.id} src={ev.image} alt={ev.eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  {ev.price > 0 && <span className="absolute right-2 top-2 rounded-md bg-ibiza-green px-2 py-0.5 text-[11px] font-black text-black">€{ev.price}</span>}
                  <div className="absolute inset-x-0 bottom-0 p-3"><div className="font-serif text-sm font-black leading-tight text-white line-clamp-2">{ev.eventName}</div></div>
                </div>
              </Link>
            ) : <div className="grid h-full place-items-center p-4 text-center text-xs font-semibold text-black/40">{L.none}</div>}
          </div>
        </div>
      </div>
      {ev && <InfoCta ev={ev} locale={locale} fmt={fmt} />}
    </div>
  )
}

// ── Full-screen agenda (horizontal strips) ────────────────────────────────────
function PickerRows({ events, locale, persistKey, full, onExpand }: { events: PickerEvent[]; locale: string; persistKey?: string; full?: boolean; onExpand?: () => void }) {
  const L = LABELS[locale] || LABELS.en
  const loc = DF[locale] || enUS
  const fmt = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }
  const { period, setPeriod, clubs, club, setClubIdx, dateItems, setDateIdx, ev, windowEvents, initialClubIdx, initialDateIdx } = usePickerData(events, locale, persistKey)
  // Only restore the saved date index on the very first mount; after the user interacts,
  // switching club/period resets the date wheel to the start.
  const ready = useRef(false)
  useEffect(() => { const t = setTimeout(() => { ready.current = true }, 500); return () => clearTimeout(t) }, [])
  const changePeriod = (p: Period) => { setPeriod(p); if (ready.current) setDateIdx(0) }

  if (clubs.length === 0) return <div className="p-10 text-center text-sm font-semibold text-black/40">{L.none}</div>

  return (
    <div className="w-full">
      <PeriodTabs period={period} setPeriod={changePeriod} locale={locale} />

      {/* Desktop: two compact strips stacked on the left, event image beside them. Mobile: stacked. */}
      <div className="md:grid md:grid-cols-[1fr_1.15fr] md:items-stretch md:gap-4">
        {/* Left column — the two strips */}
        <div className="flex flex-col gap-3">
          {/* Clubs strip */}
          <div className="rounded-3xl border border-black/10 bg-white p-2 shadow-sm">
            <div className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickClub}</div>
            <WheelH count={clubs.length} itemW={118} itemH={88} initialIndex={initialClubIdx} onIndex={(i) => { setClubIdx(i); if (ready.current) setDateIdx(0) }} render={(i, active) => {
              const c = clubs[i]
              return (
                <div className="flex flex-col items-center gap-1">
                  <span className="grid h-10 w-full place-items-center">{c.logo ? <img src={c.logo} alt="" className="max-h-9 max-w-[85%] object-contain [filter:brightness(0)]" /> : <span className="text-sm font-black text-black">{c.name.slice(0, 3).toUpperCase()}</span>}</span>
                  <span className={`px-1 text-center text-[11px] font-bold leading-tight line-clamp-1 ${active ? 'text-black' : 'text-black/45'}`}>{c.name}</span>
                </div>
              )
            }} />
          </div>
          {/* Dates strip */}
          <div className="rounded-3xl border border-black/10 bg-white p-2 shadow-sm">
            <div className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickDate}</div>
            <WheelH key={`${club?.slug}-${period}`} count={dateItems.length} itemW={period === 'week' ? 118 : 88} itemH={88} initialIndex={ready.current ? 0 : initialDateIdx} onIndex={(i) => setDateIdx(i)} render={(i, active) => {
              const d = dateItems[i]; if (!d) return null
              return (
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className={`text-[11px] font-black uppercase tracking-wide ${active ? 'text-black/50' : 'text-black/30'}`}>{d.top}</span>
                  <span className={`font-serif ${period === 'week' ? 'text-xl' : 'text-3xl'} font-black ${active ? 'text-black' : 'text-black/60'}`}>{d.mid}</span>
                  <span className="text-[11px] font-black uppercase tracking-wide text-ibiza-green">{d.bottom}</span>
                </div>
              )
            }} />
          </div>
        </div>

        {/* Right column — event image / carousel */}
        <div className="mt-3 md:mt-0">
          {windowEvents.length > 0 ? (
            <div className="relative h-full">
              <div className="hide-scrollbar -mx-1 flex h-full snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
                {windowEvents.map(e => (
                  <Link key={e.id} href={e.href} className="group block w-[86%] shrink-0 snap-center overflow-hidden rounded-3xl border border-black/10 shadow-lg sm:w-[72%] md:w-full">
                    <div className="relative aspect-[16/10] w-full bg-neutral-900 sm:aspect-[16/8] md:aspect-auto md:h-full md:min-h-[220px]">
                      {e.image ? <img src={e.image} alt={e.eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      {e.price > 0 && <span className="absolute right-3 top-3 rounded-lg bg-ibiza-green px-3 py-1 text-sm font-black text-black">€{e.price}</span>}
                      <div className="absolute inset-x-0 bottom-0 p-5 pr-16">
                        <div className="font-serif text-2xl font-black leading-tight text-white line-clamp-2 md:text-3xl">{e.eventName}</div>
                        <div className="mt-1 text-sm font-semibold text-white/75">{e.clubName} · <span className="capitalize">{fmt(e.date, 'EEEE d MMMM')}</span></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {onExpand && (
                <button type="button" onClick={onExpand} aria-label={L.openCal} className="absolute bottom-4 right-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-ibiza-green text-black shadow-lg transition-transform hover:scale-110">
                  <Maximize2 size={20} />
                </button>
              )}
            </div>
          ) : <div className="grid h-full min-h-[200px] place-items-center rounded-3xl border border-black/10 text-sm font-semibold text-black/40">{L.none}</div>}
        </div>
      </div>

      {/* Book CTA for the focused event */}
      {windowEvents.length > 0 && ev && (
        <Link href={ev.href} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-ibiza-green px-6 py-4 font-serif text-lg font-black uppercase tracking-wide text-black shadow-md transition-all hover:brightness-95">
          <Ticket size={20} /> {L.book}{ev.price > 0 ? ` · €${ev.price}` : ''}
        </Link>
      )}

      {/* Full view only: all events grouped per day */}
      {windowEvents.length > 0 && full && period !== 'day' && (
        <div className="mt-6">
          <WindowList events={windowEvents} period={period} locale={locale} fmt={fmt} />
        </div>
      )}
    </div>
  )
}

// ── Public component: compact picker + "Open calendar" full-screen ────────────
export function EventPickerWheel({ events, locale = 'nl', className = '', storeKey = 'agenda' }: { events: PickerEvent[]; locale?: string; className?: string; storeKey?: string }) {
  const L = LABELS[locale] || LABELS.en
  const fullKey = `epw:${storeKey}:full`
  const [full, setFull] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Restore the open agenda after navigating to an event and pressing back
  useEffect(() => {
    setMounted(true)
    try { if (sessionStorage.getItem(fullKey) === '1') setFull(true) } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const open = () => { setFull(true); try { sessionStorage.setItem(fullKey, '1') } catch {} }
  const close = () => { setFull(false); try { sessionStorage.removeItem(fullKey) } catch {} }

  useEffect(() => {
    if (!full) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [full])

  return (
    <section className={`w-full ${className}`}>
      {/* Bright-green glowing button — sits right under the "Score your tickets" kicker */}
      <button onClick={open} className="cal-cta mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-ibiza-green px-6 py-4 font-serif text-lg font-black uppercase tracking-wide text-black shadow-lg transition-transform hover:scale-[1.01]">
        <CalendarDays size={20} /> {L.openCal}
      </button>

      {/* Inline calendar — same complex layout as the full view, with an expand arrow */}
      <PickerRows events={events} locale={locale} persistKey={storeKey} onExpand={open} />

      {mounted && full && createPortal(
        <div className="fixed inset-0 z-[300] flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="font-serif text-xl font-black text-black md:text-2xl">Ibiza Calendar</h2>
            <button onClick={close} aria-label="Close" className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2.5 text-sm font-black uppercase tracking-wide text-black hover:bg-black/10"><X size={18} /> {L.close}</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="mx-auto w-full max-w-3xl">
              <PickerRows events={events} locale={locale} persistKey={storeKey} full />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
