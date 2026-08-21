'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { format, parseISO, isValid, startOfDay, startOfWeek, addDays, endOfMonth, startOfMonth, addMonths } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { Ticket, Music, ChevronRight, ChevronLeft, CalendarDays, X, Maximize2, Share2 } from 'lucide-react'
import { ScrollCue } from '@/components/ui/ScrollCue'
import { ctLink } from '@/lib/ct-link'
import { optImg } from '@/lib/img'

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

// Light haptic tick on wheel snap (Android/where supported; silently no-ops elsewhere)
const haptic = () => { try { if (typeof navigator !== 'undefined' && (navigator as any).vibrate) (navigator as any).vibrate(7) } catch {} }

// ── Vertical iOS-style wheel (compact) ────────────────────────────────────────
function Wheel({ count, rowH, visible, onIndex, render, initialIndex = 0, jumpTo }: {
  count: number; rowH: number; visible: number; onIndex?: (i: number) => void; render: (i: number, active: boolean) => React.ReactNode; initialIndex?: number; jumpTo?: number | null
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
    if (near !== last.current) { const first = last.current === -1; last.current = near; setAct(near); onIndex?.(near); if (!first) haptic() }
  }, [count, rowH, onIndex])

  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(apply) }
  useEffect(() => { last.current = -1; requestAnimationFrame(apply) }, [count, apply])
  useEffect(() => {
    const el = scrollRef.current
    if (el && initialIndex > 0 && initialIndex < count) { el.scrollTop = initialIndex * rowH; last.current = -1; requestAnimationFrame(apply) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Deeplink / programmatic jump
  useEffect(() => {
    const el = scrollRef.current
    if (el && jumpTo != null && jumpTo >= 0 && jumpTo < count) { el.scrollTop = jumpTo * rowH; last.current = -1; requestAnimationFrame(apply) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpTo])

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
    if (near !== last.current) { const first = last.current === -1; last.current = near; setAct(near); onIndex?.(near); if (!first) haptic() }
  }, [count, itemW, onIndex])

  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(apply) }
  useEffect(() => { last.current = -1; requestAnimationFrame(apply) }, [count, apply])
  useEffect(() => {
    const el = scrollRef.current
    if (el && initialIndex > 0 && initialIndex < count) { el.scrollLeft = initialIndex * itemW; last.current = -1; requestAnimationFrame(apply) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Re-render once the container is actually laid out (fixes empty wheels inside the modal/portal)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const rerun = () => { last.current = -1; requestAnimationFrame(apply) }
    const ro = new ResizeObserver(rerun)
    ro.observe(el)
    const timers = [40, 140, 320].map(ms => setTimeout(rerun, ms))
    return () => { ro.disconnect(); timers.forEach(clearTimeout) }
  }, [apply])

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

// ── Top-anchored wheel: the active item sits near the TOP (big), items below shrink
//    and fade away toward the bottom. Used for the date step of the planner. ─────────
function TopWheel({ count, rowH, height, onIndex, render, initialIndex = 0 }: {
  count: number; rowH: number; height: number; onIndex?: (i: number) => void; render: (i: number, active: boolean) => React.ReactNode; initialIndex?: number
}) {
  const ANCHOR = rowH * 0.85              // where the active row is centred (near the top)
  const padTop = ANCHOR - rowH / 2
  const padBottom = height - ANCHOR - rowH / 2
  const scrollRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const raf = useRef(0)
  const last = useRef(-1)
  const [act, setAct] = useState(0)

  const apply = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const s = el.scrollTop / rowH
    const near = Math.max(0, Math.min(count - 1, Math.round(s)))
    for (let i = 0; i < count; i++) {
      const row = rowRefs.current[i]
      if (!row) continue
      const d = i - s                     // 0 = at anchor, >0 below, <0 above
      let scale: number, opacity: number
      if (d < 0) { scale = Math.max(0.5, 1 + d * 0.12); opacity = Math.max(0, 1 + d * 1.5) }        // above → shrink + fade out fast
      else { scale = Math.max(0.5, 1.32 - d * 0.3); opacity = Math.max(0.12, 1 - d * 0.24) }         // below → big to small, fading
      row.style.transform = `scale(${scale.toFixed(3)})`
      row.style.opacity = opacity.toFixed(3)
      row.style.zIndex = String(500 - Math.round(Math.abs(d) * 10))
    }
    if (near !== last.current) { const first = last.current === -1; last.current = near; setAct(near); onIndex?.(near); if (!first) haptic() }
  }, [count, rowH, onIndex])

  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(apply) }
  useEffect(() => { last.current = -1; requestAnimationFrame(apply) }, [count, apply])
  useEffect(() => {
    const el = scrollRef.current
    if (el && initialIndex > 0 && initialIndex < count) { el.scrollTop = initialIndex * rowH; last.current = -1; requestAnimationFrame(apply) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative select-none" style={{ height }}>
      {/* green selection band near the TOP (right under the tabs) */}
      <div className="pointer-events-none absolute inset-x-1 z-0 rounded-2xl border-2 border-ibiza-green/70 bg-ibiza-green/5" style={{ top: padTop, height: rowH }} />
      {/* items vanish downward */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white via-white/85 to-transparent" style={{ height: rowH * 1.8 }} />
      <div ref={scrollRef} onScroll={onScroll} className="hide-scrollbar h-full overflow-y-auto" style={{ scrollSnapType: 'y mandatory', scrollPaddingTop: padTop, paddingTop: padTop, paddingBottom: padBottom }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} ref={(el) => { rowRefs.current[i] = el }} className="flex items-center justify-center px-1" style={{ height: rowH, scrollSnapAlign: 'start', transformOrigin: 'center center', willChange: 'transform, opacity' }}>
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
    <div className="mb-3">
      <div className="flex w-full rounded-full bg-black/5 p-1">
        {(['day', 'week', 'month'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`flex-1 rounded-full px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all md:text-sm ${period === p ? 'bg-ibiza-green text-black shadow-sm' : 'text-black/50 hover:text-black'}`}>{L[p]}</button>
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
        {e.image ? <img src={optImg(e.image, 500)} loading="lazy" alt={e.eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
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

// ── Compact picker (vertical columns) — iPhone-style CLUB | DATE | EVENT slider ─
export function PickerColumns({ events, locale }: { events: PickerEvent[]; locale: string }) {
  const L = LABELS[locale] || LABELS.en
  const loc = DF[locale] || enUS
  const fmt = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }
  const { period, setPeriod, clubs, club, setClubIdx, dateItems, setDateIdx, ev } = usePickerData(events, locale)

  if (clubs.length === 0) return <div className="p-10 text-center text-sm font-semibold text-black/40">{L.none}</div>

  return (
    <div className="w-full">
      <PeriodTabs period={period} setPeriod={setPeriod} locale={locale} />
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">
        <div className="grid grid-cols-[1fr_1fr_2fr] items-stretch">
          <div className="border-r border-black/5">
            <div className="border-b border-black/5 py-2 text-center text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickClub}</div>
            <Wheel count={clubs.length} rowH={66} visible={3} onIndex={(i) => { setClubIdx(i); setDateIdx(0) }} render={(i, active) => {
              const c = clubs[i]
              return (
                <div className="flex flex-col items-center gap-1">
                  <span className="grid h-9 w-full place-items-center">{c.logo ? <img src={optImg(c.logo, 120)} loading="lazy" alt="" className="max-h-8 max-w-[80%] object-contain [filter:brightness(0)]" /> : <span className="text-xs font-black text-black">{c.name.slice(0, 3).toUpperCase()}</span>}</span>
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
                  {ev.image ? <img key={ev.id} src={optImg(ev.image, 500)} loading="lazy" alt={ev.eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
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

// ── Homepage upcoming picker: big horizontal club selector + vertical EVENT|DATE|PRICE lift ─
export function HomeUpcomingPicker({ events, locale = 'nl' }: { events: PickerEvent[]; locale: string }) {
  const L = LABELS[locale] || LABELS.en
  const loc = DF[locale] || enUS
  const fmt = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }
  const { period, setPeriod, clubs, club, initialClubIdx, setClubIdx, dateItems, setDateIdx } = usePickerData(events, locale)

  if (clubs.length === 0) return null

  return (
    <div className="w-full">
      {/* Big horizontal club selector — swipe to pick a club */}
      <div className="mb-3 rounded-3xl border border-black/10 bg-white p-2 shadow-sm">
        <div className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickClub}</div>
        <WheelH count={clubs.length} itemW={150} itemH={122} initialIndex={initialClubIdx} onIndex={(i) => { setClubIdx(i); setDateIdx(0) }} render={(i, active) => {
          const c = clubs[i]
          return (
            <div className="flex flex-col items-center gap-2">
              <span className="grid h-14 w-full place-items-center">{c.logo ? <img src={optImg(c.logo, 120)} loading="lazy" alt="" className="max-h-12 max-w-[85%] object-contain [filter:brightness(0)]" /> : <span className="text-base font-black text-black">{c.name.slice(0, 3).toUpperCase()}</span>}</span>
              <span className={`px-1 text-center text-xs font-bold leading-tight line-clamp-1 ${active ? 'text-black' : 'text-black/45'}`}>{c.name}</span>
            </div>
          )
        }} />
      </div>

      <PeriodTabs period={period} setPeriod={setPeriod} locale={locale} />

      {/* Vertical synchronized wheel — CLUB | DATE (narrow) | EVENT (2×, promo image + name + price) */}
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">
        <div className="grid grid-cols-[0.85fr_0.85fr_2.4fr] gap-2 border-b border-black/5 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-black/35">
          <span className="text-center">{L.pickClub}</span><span className="text-center">{L.pickDate}</span><span className="pl-1">Event</span>
        </div>
        {dateItems.length > 0 ? (
          <Wheel key={`${club?.slug}-${period}`} count={dateItems.length} rowH={80} visible={5} onIndex={(i) => setDateIdx(i)} render={(i, active) => {
            const d = dateItems[i]; if (!d) return null
            const e = d.ev
            return (
              <Link href={e.href} className="grid w-full grid-cols-[0.85fr_0.85fr_2.4fr] items-center gap-2 px-3">
                {/* Club */}
                <span className="grid h-full place-items-center">
                  {e.clubLogo ? <img src={optImg(e.clubLogo, 120)} loading="lazy" alt="" className="max-h-8 max-w-full object-contain [filter:brightness(0)]" /> : <span className="text-[10px] font-black text-black/70">{e.clubName.slice(0, 3).toUpperCase()}</span>}
                </span>
                {/* Date (small) */}
                <span className="flex flex-col items-center justify-center leading-none">
                  <span className="text-[9px] font-black uppercase tracking-wide text-black/40">{d.top}</span>
                  <span className={`font-serif text-base font-black ${active ? 'text-black' : 'text-black/60'}`}>{d.mid}</span>
                  <span className="text-[9px] font-black uppercase tracking-wide text-ibiza-green">{d.bottom}</span>
                </span>
                {/* Event (big) — promo image + name/artist + price */}
                <span className="relative h-[62px] w-full overflow-hidden rounded-xl bg-neutral-900">
                  {e.image ? <img src={optImg(e.image, 500)} loading="lazy" alt={e.eventName} className="h-full w-full object-cover" /> : null}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  {e.price > 0 && <span className="absolute right-1.5 top-1.5 rounded bg-ibiza-green px-1.5 py-0.5 text-[10px] font-black text-black">€{e.price}</span>}
                  <span className="absolute inset-x-0 bottom-0 p-1.5">
                    <span className="line-clamp-2 font-serif text-[11px] font-black leading-tight text-white">{e.eventName}</span>
                  </span>
                </span>
              </Link>
            )
          }} />
        ) : <div className="p-8 text-center text-sm font-semibold text-black/40">{L.none}</div>}
      </div>
    </div>
  )
}

// ── Homepage full-screen stepped planner: Club → Datum → Events ───────────────
const PLANNER_TXT: Record<string, {
  s1: string; s2: string; s3: string; nextDate: string; nextEvents: string; back: string;
  club: string; date: string; events: string; none: string; swipeClub: string; swipeDate: string; pickPeriod: string; startOver: string;
  flexible: string; allEvents: string; share: string; shared: string;
}> = {
  nl: { s1: 'Kies je club', s2: 'Wanneer ben je op Ibiza?', s3: 'Jouw events', nextDate: 'Kies je datum', nextEvents: 'Bekijk de events', back: 'Terug', club: 'Club', date: 'Datum', events: 'Events', none: 'Geen events in deze periode', swipeClub: 'Swipe om je club te kiezen', swipeDate: 'Swipe om je moment te kiezen', pickPeriod: 'Dag · Week · Maand', startOver: 'Opnieuw', flexible: 'Ik weet het nog niet — toon alles', allEvents: 'Alle events', share: 'Deel', shared: 'Link gekopieerd' },
  en: { s1: 'Pick your club', s2: 'When are you in Ibiza?', s3: 'Your events', nextDate: 'Pick your date', nextEvents: 'View the events', back: 'Back', club: 'Club', date: 'Date', events: 'Events', none: 'No events in this period', swipeClub: 'Swipe to pick your club', swipeDate: 'Swipe to pick your moment', pickPeriod: 'Day · Week · Month', startOver: 'Start over', flexible: "Not sure yet — show everything", allEvents: 'All events', share: 'Share', shared: 'Link copied' },
  de: { s1: 'Wähle deinen Club', s2: 'Wann bist du auf Ibiza?', s3: 'Deine Events', nextDate: 'Datum wählen', nextEvents: 'Events ansehen', back: 'Zurück', club: 'Club', date: 'Datum', events: 'Events', none: 'Keine Events in diesem Zeitraum', swipeClub: 'Wische, um deinen Club zu wählen', swipeDate: 'Wische, um deinen Moment zu wählen', pickPeriod: 'Tag · Woche · Monat', startOver: 'Neu starten', flexible: 'Noch unsicher — alles zeigen', allEvents: 'Alle Events', share: 'Teilen', shared: 'Link kopiert' },
  es: { s1: 'Elige tu club', s2: '¿Cuándo estás en Ibiza?', s3: 'Tus eventos', nextDate: 'Elige tu fecha', nextEvents: 'Ver los eventos', back: 'Atrás', club: 'Club', date: 'Fecha', events: 'Eventos', none: 'No hay eventos en este periodo', swipeClub: 'Desliza para elegir tu club', swipeDate: 'Desliza para elegir tu momento', pickPeriod: 'Día · Semana · Mes', startOver: 'Empezar de nuevo', flexible: 'Aún no lo sé — mostrar todo', allEvents: 'Todos los eventos', share: 'Compartir', shared: 'Enlace copiado' },
  fr: { s1: 'Choisis ton club', s2: 'Quand es-tu à Ibiza ?', s3: 'Tes événements', nextDate: 'Choisir ta date', nextEvents: 'Voir les événements', back: 'Retour', club: 'Club', date: 'Date', events: 'Événements', none: 'Aucun événement sur cette période', swipeClub: 'Glisse pour choisir ton club', swipeDate: 'Glisse pour choisir ton moment', pickPeriod: 'Jour · Semaine · Mois', startOver: 'Recommencer', flexible: "Pas encore sûr — tout afficher", allEvents: 'Tous les événements', share: 'Partager', shared: 'Lien copié' },
}

// ── Per-event checkout button ─────────────────────────────────────────────────
// The visitor has already explicitly chosen the club and the date in the planner
// flow, so checkout goes STRAIGHT to ClubTickets for that date — no extra
// confirmation dialog in between.
function PlannerCheckout({ e, locale }: { e: PickerEvent; locale: string }) {
  const T = ({
    nl: { checkout: 'Afrekenen' },
    en: { checkout: 'Checkout' },
    de: { checkout: 'Bezahlen' },
    es: { checkout: 'Pagar' },
    fr: { checkout: 'Payer' },
  } as Record<string, { checkout: string }>)[locale] || { checkout: 'Checkout' }
  const go = () => { const url = e.affLink ? ctLink(e.affLink, locale) : e.href; if (typeof window !== 'undefined') window.open(url, '_blank') }
  return (
    <button type="button" onClick={go} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ibiza-green px-4 py-2 text-[11px] font-black uppercase tracking-wide text-black transition-all hover:brightness-95">
      {T.checkout}{e.price > 0 ? ` · €${e.price}` : ''} <Ticket size={13} />
    </button>
  )
}

export function HomePlanner({ events, locale = 'nl', persistKey = 'homeplanner', syncUrl = false, variant = 'club' }: { events: PickerEvent[]; locale: string; persistKey?: string; syncUrl?: boolean; variant?: 'club' | 'company' }) {
  const L = LABELS[locale] || LABELS.en
  const T = PLANNER_TXT[locale] || PLANNER_TXT.en
  const isCompany = variant === 'company'
  const ENT = ({
    nl: { chip: 'Aanbieder', all: 'Alle aanbieders · Ibiza', tap: 'Tik op een aanbieder om te openen' },
    en: { chip: 'Company', all: 'All companies · Ibiza', tap: 'Tap a company to open it' },
    de: { chip: 'Anbieter', all: 'Alle Anbieter · Ibiza', tap: 'Tippe auf einen Anbieter' },
    es: { chip: 'Compañía', all: 'Todas las compañías · Ibiza', tap: 'Toca una compañía para abrirla' },
    fr: { chip: 'Compagnie', all: 'Toutes les compagnies · Ibiza', tap: 'Touche une compagnie pour l’ouvrir' },
  } as Record<string, { chip: string; all: string; tap: string }>)[locale] || { chip: 'Company', all: 'All companies · Ibiza', tap: 'Tap a company to open it' }
  const CT = ({
    nl: { allClubs: 'Alle clubs · Ibiza', tap: 'Tik op een club om te openen' },
    en: { allClubs: 'All clubs · Ibiza', tap: 'Tap a club to open it' },
    de: { allClubs: 'Alle Clubs · Ibiza', tap: 'Tippe auf einen Club' },
    es: { allClubs: 'Todos los clubs · Ibiza', tap: 'Toca un club para abrirlo' },
    fr: { allClubs: 'Tous les clubs · Ibiza', tap: 'Touche un club pour l’ouvrir' },
  } as Record<string, { allClubs: string; tap: string }>)[locale] || { allClubs: 'All clubs · Ibiza', tap: 'Tap a club to open it' }
  const entChip = isCompany ? ENT.chip : T.club
  const allTitle = isCompany ? ENT.all : CT.allClubs
  const tapText = isCompany ? ENT.tap : CT.tap
  const loc = DF[locale] || enUS
  const fmt = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }
  const todayStr = useMemo(() => format(startOfDay(new Date()), 'yyyy-MM-dd'), [])
  const { period, setPeriod, clubs, club, clubIdx, setClubIdx, dateItems, dateIdx, setDateIdx, dateItem, windowEvents, initialClubIdx } = usePickerData(events, locale, persistKey)
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [flexible, setFlexible] = useState(false)
  const [clubJump, setClubJump] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const ready = useRef(false)
  useEffect(() => { const t = setTimeout(() => { ready.current = true }, 500); return () => clearTimeout(t) }, [])

  // Auto-advance: after the user settles on a NEW choice, glide to the next step
  const advRef = useRef<any>(null)
  const clubBase = useRef(clubIdx)
  const dateBase = useRef(dateIdx)
  useEffect(() => { clearTimeout(advRef.current); if (step === 0) { clubBase.current = clubIdx; setFlexible(false) } if (step === 1) dateBase.current = dateIdx /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [step])
  useEffect(() => () => clearTimeout(advRef.current), [])
  const scheduleAdvance = (to: 1 | 2, delay: number) => { clearTimeout(advRef.current); advRef.current = setTimeout(() => setStep(s => (s === to - 1 ? to : s)), delay) }

  // Events per club / per date window → count badges
  const clubCounts = useMemo(() => {
    const m: Record<string, number> = {}
    events.filter(e => e.date >= todayStr).forEach(e => { m[e.clubSlug] = (m[e.clubSlug] || 0) + 1 })
    return m
  }, [events, todayStr])
  // A representative photo per club/operator (first upcoming event image) → tile backdrop
  const clubImageBySlug = useMemo(() => {
    const m: Record<string, string> = {}
    events.filter(e => e.date >= todayStr).forEach(e => { if (!m[e.clubSlug] && e.image) m[e.clubSlug] = e.image })
    return m
  }, [events, todayStr])
  const dateCounts = useMemo(() => {
    const m: Record<string, number> = {}
    if (club) dateItems.forEach(d => { m[d.key] = events.filter(e => e.clubSlug === club.slug && e.date >= d.start && e.date <= d.end).length })
    return m
  }, [dateItems, club, events])

  // "I'm flexible" → every upcoming event for the club
  const clubAll = useMemo(() => (club ? events.filter(e => e.clubSlug === club.slug && e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)) : []), [events, club, todayStr])

  // ── Calendar (multi-date select) + shopping cart ────────────────────────────
  const CAL = ({
    nl: { pickTitle: 'Kies je datum(s)', pickSub: 'Tik of sleep over meerdere dagen', month: 'Hele maand', clearSel: 'Wissen', confirm: 'Bevestig', days: 'dagen', day: 'dag', open: 'Open', add: 'In mandje', added: 'Toegevoegd', cart: 'Mandje', tickets: 'Naar tickets', cartNote: 'Elk event reken je af bij ClubTickets', allEvents: 'Toon alle events', chosen: 'Gekozen' },
    en: { pickTitle: 'Pick your date(s)', pickSub: 'Tap or drag across several days', month: 'Whole month', clearSel: 'Clear', confirm: 'Confirm', days: 'days', day: 'day', open: 'Open', add: 'Add', added: 'Added', cart: 'Cart', tickets: 'Get tickets', cartNote: 'Each event is checked out on ClubTickets', allEvents: 'Show all events', chosen: 'Chosen' },
    de: { pickTitle: 'Wähle dein(e) Datum', pickSub: 'Tippe oder ziehe über mehrere Tage', month: 'Ganzer Monat', clearSel: 'Löschen', confirm: 'Bestätigen', days: 'Tage', day: 'Tag', open: 'Öffnen', add: 'Hinzufügen', added: 'Hinzugefügt', cart: 'Warenkorb', tickets: 'Tickets', cartNote: 'Jedes Event wird bei ClubTickets bezahlt', allEvents: 'Alle Events zeigen', chosen: 'Gewählt' },
    es: { pickTitle: 'Elige tu(s) fecha(s)', pickSub: 'Toca o desliza por varios días', month: 'Mes entero', clearSel: 'Borrar', confirm: 'Confirmar', days: 'días', day: 'día', open: 'Abrir', add: 'Añadir', added: 'Añadido', cart: 'Cesta', tickets: 'Entradas', cartNote: 'Cada evento se paga en ClubTickets', allEvents: 'Ver todos los eventos', chosen: 'Elegido' },
    fr: { pickTitle: 'Choisis ta/tes date(s)', pickSub: 'Touche ou glisse sur plusieurs jours', month: 'Tout le mois', clearSel: 'Effacer', confirm: 'Confirmer', days: 'jours', day: 'jour', open: 'Ouvrir', add: 'Ajouter', added: 'Ajouté', cart: 'Panier', tickets: 'Billets', cartNote: 'Chaque événement se règle sur ClubTickets', allEvents: 'Voir tous les événements', chosen: 'Choisi' },
  } as Record<string, any>)[locale] || {} as any

  // The DATE is always picked first (before club/operator), so the calendar draws
  // from every upcoming event in the category.
  const allUpcoming = useMemo(() => events.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)), [events, todayStr])
  const dateSource = allUpcoming

  // Step order everywhere: Date → Club/Company → Events
  const order = ['date', 'entity', 'events'] as ('entity' | 'date' | 'events')[]
  const panel = order[step]
  const goNext = () => setStep(s => Math.min(2, (s + 1)) as 0 | 1 | 2)
  const goPrev = () => setStep(s => Math.max(0, (s - 1)) as 0 | 1 | 2)
  const [entityAll, setEntityAll] = useState(false)

  const clubDateSet = useMemo(() => { const s = new Set<string>(); dateSource.forEach(e => s.add(e.date)); return s }, [dateSource])
  const clubDateCounts = useMemo(() => { const m: Record<string, number> = {}; dateSource.forEach(e => { m[e.date] = (m[e.date] || 0) + 1 }); return m }, [dateSource])
  const firstEventMonth = useMemo(() => (dateSource[0] ? dateSource[0].date.slice(0, 7) : todayStr.slice(0, 7)), [dateSource, todayStr])
  const lastEventMonth = useMemo(() => (dateSource.length ? dateSource[dateSource.length - 1].date.slice(0, 7) : firstEventMonth), [dateSource, firstEventMonth])

  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])
  const [monthAnchor, setMonthAnchor] = useState<string>(firstEventMonth)
  const toggleClub = (slug: string) => setSelectedClubs(prev => (prev.includes(slug) ? prev.filter(x => x !== slug) : [...prev, slug]))

  // Clubs / operators that actually have an event on the chosen dates
  const entityList = useMemo(() => {
    if (selectedDates.length === 0) return clubs
    const slugs = new Set(events.filter(e => selectedDates.includes(e.date)).map(e => e.clubSlug))
    return clubs.filter(c => slugs.has(c.slug))
  }, [clubs, selectedDates, events])
  // Drop any picked club that no longer has an event on the (new) chosen dates
  useEffect(() => {
    setSelectedClubs(prev => { const ok = new Set(entityList.map(c => c.slug)); const next = prev.filter(s => ok.has(s)); return next.length === prev.length ? prev : next })
  }, [entityList])
  const entCount = (slug: string) => (selectedDates.length ? events.filter(e => e.clubSlug === slug && selectedDates.includes(e.date)).length : (clubCounts[slug] || 0))
  const clubSummary = entityAll ? T.allEvents : (selectedClubs.length === 1 ? (clubs.find(c => c.slug === selectedClubs[0])?.name || '') : `${selectedClubs.length} ${CAL.chosen.toLowerCase()}`)

  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) => fmt(format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), 'yyyy-MM-dd'), 'EEEEEE')), [locale])
  const monthCells = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(parseISO(monthAnchor + '-01')), { weekStartsOn: 1 })
    return Array.from({ length: 42 }, (_, i) => format(addDays(gridStart, i), 'yyyy-MM-dd'))
  }, [monthAnchor])
  const shiftMonth = (dir: number) => setMonthAnchor(format(addMonths(parseISO(monthAnchor + '-01'), dir), 'yyyy-MM'))
  const toggleDate = (iso: string) => setSelectedDates(prev => (prev.includes(iso) ? prev.filter(x => x !== iso) : [...prev, iso].sort()))
  const selectWholeMonth = () => setSelectedDates(prev => Array.from(new Set([...prev, ...dateSource.filter(e => e.date.slice(0, 7) === monthAnchor).map(e => e.date)])).sort())

  // Drag-to-select: swipe across days to grab a whole range in one motion
  const eventDatesArr = useMemo(() => Array.from(clubDateSet).sort(), [clubDateSet])
  const dragState = useRef<{ active: boolean; anchor: string; add: boolean; base: string[] }>({ active: false, anchor: '', add: true, base: [] })
  const rangeDays = (a: string, b: string) => { const lo = a < b ? a : b; const hi = a < b ? b : a; return eventDatesArr.filter(d => d >= lo && d <= hi) }
  const applyDrag = (iso: string) => {
    const st = dragState.current; if (!st.active) return
    const set = new Set(st.base); const rng = rangeDays(st.anchor, iso)
    if (st.add) rng.forEach(d => set.add(d)); else rng.forEach(d => set.delete(d))
    setSelectedDates(Array.from(set).sort())
  }
  const startDrag = (iso: string) => {
    const add = !selectedDates.includes(iso)
    dragState.current = { active: true, anchor: iso, add, base: selectedDates }
    const set = new Set(selectedDates); if (add) set.add(iso); else set.delete(iso)
    setSelectedDates(Array.from(set).sort())
  }
  const endDrag = () => { dragState.current.active = false }

  const resultEvents = useMemo(() => {
    let base = allUpcoming
    if (!entityAll && selectedClubs.length) base = base.filter(e => selectedClubs.includes(e.clubSlug))
    if (!flexible && selectedDates.length) base = base.filter(e => selectedDates.includes(e.date))
    return [...base].sort((a, b) => a.date.localeCompare(b.date))
  }, [entityAll, allUpcoming, selectedClubs, flexible, selectedDates])
  const resultGroups = useMemo(() => {
    const g: { date: string; items: PickerEvent[] }[] = []
    resultEvents.forEach(e => { const f = g.find(x => x.date === e.date); if (f) f.items.push(e); else g.push({ date: e.date, items: [e] }) })
    return g
  }, [resultEvents])


  // ── Deeplink: read once, then keep the URL in sync (write-only, no navigation) ──
  const urlDone = useRef(false)
  useEffect(() => {
    if (!syncUrl || urlDone.current || typeof window === 'undefined' || clubs.length === 0) return
    urlDone.current = true
    const q = new URLSearchParams(window.location.search)
    const cs = q.get('club'); if (cs) { const idx = clubs.findIndex(c => c.slug === cs); if (idx >= 0) { setClubIdx(idx); setClubJump(idx) } }
    const pr = q.get('period'); if (pr === 'day' || pr === 'week' || pr === 'month') setPeriod(pr)
    const st = Number(q.get('step')); if (st >= 0 && st <= 2) setStep(st as 0 | 1 | 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncUrl, clubs])
  useEffect(() => {
    if (!syncUrl || typeof window === 'undefined' || !urlDone.current) return
    const p = new URLSearchParams(window.location.search)
    if (club) p.set('club', club.slug); p.set('period', period); p.set('step', String(step))
    window.history.replaceState(null, '', `${window.location.pathname}?${p.toString()}`)
  }, [syncUrl, club, period, step])

  const share = async () => {
    if (typeof window === 'undefined') return
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {}
  }

  if (clubs.length === 0) return null

  const dateLabel = dateItem ? `${dateItem.top} ${dateItem.mid} ${dateItem.bottom}`.trim() : ''
  const bg = step === 0 ? (clubAll[0]?.image) : (resultEvents[0]?.image || clubAll[0]?.image)

  const StepChip = ({ i, label, value, done }: { i: 0 | 1 | 2; label: string; value?: string; done: boolean }) => (
    <button
      type="button"
      onClick={() => { if (i <= step) setStep(i) }}
      disabled={i > step}
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-left transition-all ${step === i ? 'border-ibiza-green bg-ibiza-green/10' : done ? 'border-black/10 bg-white' : 'border-black/5 bg-black/[0.02] opacity-50'}`}
    >
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black ${step === i ? 'bg-ibiza-green text-black' : done ? 'bg-black text-white' : 'bg-black/10 text-black/40'}`}>{i + 1}</span>
      <span className="min-w-0">
        <span className="block text-[9px] font-black uppercase tracking-widest text-black/40">{label}</span>
        <span className="block truncate text-xs font-black text-black">{value || '—'}</span>
      </span>
    </button>
  )

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-xl">
      {/* Ambient blurred backdrop — makes each step feel alive */}
      {bg && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <img src={optImg(bg, 800)} loading="lazy" alt="" className="h-full w-full scale-125 object-cover opacity-[0.12] blur-2xl" />
          <div className="absolute inset-0 bg-white/40" />
        </div>
      )}

      {/* Progress header */}
      <div className="relative z-10 flex items-center gap-2 border-b border-black/5 bg-white/70 p-3 backdrop-blur-sm">
        {order.map((p, i) => {
          const label = p === 'entity' ? entChip : p === 'date' ? T.date : T.events
          const datesVal = flexible || selectedDates.length === 0 ? T.allEvents : `${selectedDates.length} ${selectedDates.length === 1 ? CAL.day : CAL.days}`
          const value = step > i
            ? (p === 'entity' ? clubSummary : p === 'date' ? datesVal : undefined)
            : (p === 'events' && step === i ? String(resultEvents.length) : undefined)
          return <StepChip key={p} i={i as 0 | 1 | 2} label={label} value={value} done={step > i} />
        })}
      </div>

      {/* ── ENTITY: all clubs / companies at a glance, tap to open ── */}
      {panel === 'entity' && (
        <div className="relative z-10 flex flex-col">
          <div className="px-5 pt-5 text-center">
            <h3 className="font-serif text-2xl font-black text-black md:text-3xl">{allTitle}</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-black/40">{tapText}</p>
          </div>
          <div className="max-h-[40svh] overflow-y-auto px-3 py-4">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {entityList.map(c => {
                const cnt = entCount(c.slug)
                const sel = selectedClubs.includes(c.slug)
                const img = clubImageBySlug[c.slug]
                const tap = () => { const idx = clubs.findIndex(x => x.slug === c.slug); setClubIdx(idx >= 0 ? idx : 0); setEntityAll(false); toggleClub(c.slug) }
                if (isCompany) {
                  // Photo tile: activity image as the backdrop, name + count on top
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={tap}
                      className={`group relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl border bg-neutral-900 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${sel ? 'border-ibiza-green ring-2 ring-ibiza-green' : 'border-black/10'}`}
                    >
                      {img && <img src={optImg(img, 500)} loading="lazy" alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />
                      <span className="relative z-10 flex w-full flex-col items-start gap-1 p-3">
                        {c.logo && <img src={optImg(c.logo, 120)} loading="lazy" alt="" className="mb-0.5 max-h-6 max-w-[60%] object-contain brightness-0 invert" />}
                        <span className="line-clamp-2 text-sm font-black leading-tight text-white drop-shadow">{c.name}</span>
                        {cnt > 0 && <span className="rounded-full bg-ibiza-green px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">{cnt} {T.events.toLowerCase()}</span>}
                      </span>
                    </button>
                  )
                }
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={tap}
                    className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-ibiza-green hover:shadow-md ${sel ? 'border-ibiza-green bg-ibiza-green/10' : 'border-black/10 bg-white'}`}
                  >
                    <span className="grid h-12 w-full place-items-center">
                      {c.logo ? <img src={optImg(c.logo, 120)} loading="lazy" alt={c.name} className="max-h-11 max-w-[80%] object-contain [filter:brightness(0)] transition-transform group-hover:scale-105" /> : <span className="text-lg font-black text-black">{c.name.slice(0, 3).toUpperCase()}</span>}
                    </span>
                    <span className="line-clamp-1 text-center text-xs font-bold leading-tight text-black">{c.name}</span>
                    {cnt > 0 && <span className="rounded-full bg-ibiza-green/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">{cnt} {T.events.toLowerCase()}</span>}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2 px-4 py-3">
            <button type="button" onClick={() => { setEntityAll(true); goNext() }} className="text-[11px] font-black uppercase tracking-wide text-black/45 underline decoration-black/20 underline-offset-4 transition-colors hover:text-ibiza-green">{allTitle.replace(' · Ibiza', '')}</button>
            <div className="flex gap-2">
              <button type="button" onClick={goPrev} className="flex shrink-0 items-center justify-center gap-1 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-colors hover:bg-black/5">
                <ChevronLeft size={15} /> {T.back}
              </button>
              <button type="button" onClick={() => { setEntityAll(false); goNext() }} disabled={selectedClubs.length === 0} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ibiza-green px-5 py-2.5 font-serif text-sm font-black uppercase tracking-wide text-black shadow-md transition-all hover:brightness-95 disabled:opacity-40">
                {CAL.confirm}{selectedClubs.length > 0 ? ` · ${selectedClubs.length}` : ''} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DATE — compact calendar, tap or drag to multi-select ── */}
      {panel === 'date' && (
        <div className="relative z-10 flex flex-col">
          <div className="px-5 pt-3 text-center">
            <h3 className="font-serif text-xl font-black text-black md:text-2xl">{CAL.pickTitle}</h3>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-black/40">{CAL.pickSub}</p>
          </div>

          <div className="mx-auto w-full max-w-[400px] px-4">
            {/* month navigator */}
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => shiftMonth(-1)} disabled={monthAnchor <= firstEventMonth} className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronLeft size={17} /></button>
              <span className="font-serif text-base font-black capitalize text-black md:text-lg">{fmt(monthAnchor + '-01', 'MMMM yyyy')}</span>
              <button type="button" onClick={() => shiftMonth(1)} disabled={monthAnchor >= lastEventMonth} className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronRight size={17} /></button>
            </div>

            {/* weekday header */}
            <div className="grid grid-cols-7 gap-1 pt-2 text-center text-[10px] font-black uppercase tracking-wide text-black/40">
              {weekdays.map((w, i) => <span key={i}>{w}</span>)}
            </div>
            {/* day grid — tap a day, or drag across days to grab a range */}
            <div
              className="grid grid-cols-7 gap-1 pt-1 select-none"
              style={{ touchAction: 'none' }}
              onPointerDown={e => { try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) } catch {} }}
              onPointerMove={e => { if (!dragState.current.active) return; const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null; const iso = el?.closest('[data-iso]')?.getAttribute('data-iso'); if (iso) applyDrag(iso) }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
            >
              {monthCells.map((iso, idx) => {
                const inMonth = iso.slice(0, 7) === monthAnchor
                const has = clubDateSet.has(iso)
                const sel = selectedDates.includes(iso)
                const past = iso < todayStr
                return (
                  <button
                    key={idx}
                    type="button"
                    data-iso={iso}
                    disabled={!has || past}
                    onPointerDown={e => { if (has && !past) { e.preventDefault(); startDrag(iso) } }}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm font-black transition-colors ${sel ? 'bg-ibiza-green text-black ring-2 ring-ibiza-green' : has && !past ? 'bg-black/[0.05] text-black' : 'text-black/20'} ${!inMonth ? 'opacity-40' : ''}`}
                  >
                    {Number(iso.slice(8, 10))}
                    {has && !past && !sel && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-ibiza-green" />}
                  </button>
                )
              })}
            </div>

            {/* quick actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button type="button" onClick={selectWholeMonth} className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-black transition-colors hover:bg-ibiza-green">{CAL.month}</button>
              {selectedDates.length > 0 && <button type="button" onClick={() => setSelectedDates([])} className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-black/60 transition-colors hover:bg-black/5">{CAL.clearSel} ({selectedDates.length})</button>}
              <button type="button" onClick={() => { setFlexible(true); setEntityAll(true); setStep(2) }} className="ml-auto text-[10px] font-black uppercase tracking-wide text-black/45 underline decoration-black/20 underline-offset-4 transition-colors hover:text-ibiza-green">{CAL.allEvents}</button>
            </div>
          </div>

          {/* footer — 30% smaller buttons, always in view */}
          <div className="flex gap-2 px-4 py-3">
            {step > 0 && (
              <button type="button" onClick={() => { setSelectedDates([]); goPrev() }} className="flex shrink-0 items-center justify-center gap-1 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-colors hover:bg-black/5">
                <ChevronLeft size={15} /> {T.back}
              </button>
            )}
            <button type="button" onClick={() => { setFlexible(false); goNext() }} disabled={selectedDates.length === 0} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ibiza-green px-5 py-2.5 font-serif text-sm font-black uppercase tracking-wide text-black shadow-md transition-all hover:brightness-95 disabled:opacity-40">
              {CAL.confirm}{selectedDates.length > 0 ? ` · ${selectedDates.length} ${selectedDates.length === 1 ? CAL.day : CAL.days}` : ''} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── EVENTS — date-ordered, each with Open + checkout ── */}
      {panel === 'events' && (
        <div className="relative z-10 flex flex-col">
          <div className="relative px-5 pt-6 text-center">
            <h3 className="font-serif text-2xl font-black text-black md:text-3xl">{clubSummary}</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-black/40">{flexible || selectedDates.length === 0 ? T.allEvents : `${selectedDates.length} ${selectedDates.length === 1 ? CAL.day : CAL.days} ${CAL.chosen.toLowerCase()}`}</p>
            <button type="button" onClick={share} className="absolute right-4 top-5 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-black transition-colors hover:bg-ibiza-green">
              <Share2 size={13} /> {copied ? T.shared : T.share}
            </button>
          </div>
          {/* Scroll-down cue — you have a selection of events to browse */}
          {resultGroups.length > 0 && <ScrollCue className="mt-1" />}
          <div className="max-h-[46svh] space-y-4 overflow-y-auto p-4 md:max-h-[58svh]">
            {resultGroups.length > 0 ? resultGroups.map(g => (
              <div key={g.date}>
                <div className="mb-2 text-xs font-black uppercase tracking-widest capitalize text-black/50">{fmt(g.date, 'EEEE d MMMM')}</div>
                <div className="flex flex-col gap-3">
                  {g.items.map(e => (
                    <div key={e.id} className="flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-md">
                      <div className="relative aspect-[16/9] w-full bg-neutral-900 md:aspect-auto md:h-40 lg:h-44">
                        {e.image ? <img src={optImg(e.image, 500)} loading="lazy" alt={e.eventName} className="h-full w-full object-cover" /> : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        {e.clubLogo && <span className="absolute left-2.5 top-2.5 grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-white/90 p-1"><img src={optImg(e.clubLogo, 120)} loading="lazy" alt="" className="max-h-full max-w-full object-contain [filter:brightness(0)]" /></span>}
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <div className="line-clamp-2 font-serif text-lg font-black leading-tight text-white">{e.eventName}</div>
                          {e.lineUp && <div className="line-clamp-1 text-[11px] font-semibold text-white/70">{e.lineUp}</div>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-3">
                        <div className="min-w-0">
                          {e.price > 0 && <div className="font-serif text-lg font-black leading-none text-black">€{e.price}</div>}
                          <Link href={e.href} className="mt-1 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wide text-ibiza-green underline decoration-ibiza-green/40 underline-offset-2 hover:decoration-ibiza-green">{CAL.open} <ChevronRight size={11} /></Link>
                        </div>
                        <PlannerCheckout e={e} locale={locale} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )) : <div className="grid h-full min-h-[160px] place-items-center rounded-3xl border border-black/10 text-center text-sm font-semibold text-black/40">{T.none}</div>}
          </div>

          <div className="flex gap-2 p-4 pt-2">
            <button type="button" onClick={() => { setEntityAll(false); goPrev() }} className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-black/5">
              <ChevronLeft size={18} /> {T.back}
            </button>
            <button type="button" onClick={() => { setStep(0); setClubIdx(0); setSelectedDates([]); setSelectedClubs([]); setFlexible(false); setEntityAll(false) }} className="flex shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-black uppercase tracking-wide text-black/60 transition-colors hover:bg-black/5">
              {T.startOver}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── "Open the calendar" button → full-screen stepped planner (with Exit) ──────
export function HomeCalendarLauncher({ events, locale = 'nl', persistKey = 'homeplanner', variant = 'club', compact = false }: { events: PickerEvent[]; locale: string; persistKey?: string; variant?: 'club' | 'company'; compact?: boolean }) {
  const L = LABELS[locale] || LABELS.en
  const agendaLabel = ({ nl: 'Agenda', en: 'Agenda', de: 'Kalender', es: 'Agenda', fr: 'Agenda' } as Record<string, string>)[locale] || 'Agenda'
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (events.length === 0) return null

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-sm transition-all hover:bg-black/85"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ibiza-green" /> {agendaLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto flex w-full max-w-[150px] items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-ibiza-green px-3 py-1.5 font-serif text-[11px] font-black uppercase tracking-wide text-black shadow-md transition-all hover:brightness-95"
        >
          <CalendarDays size={13} /> {L.openCal}
        </button>
      )}

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[300] flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5 md:px-6 md:py-4">
            <span className="font-serif text-lg font-black uppercase tracking-wide text-black md:text-2xl">Ibiza Calendar</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={L.close} className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-black/10">
              <X size={18} /> {L.close}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-3xl">
              <HomePlanner events={events} locale={locale} persistKey={persistKey} variant={variant} syncUrl />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
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
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-stretch md:gap-4">
        {/* Left column — the two strips */}
        <div className="flex min-w-0 flex-col gap-2.5">
          {/* Clubs strip */}
          <div className="rounded-3xl border border-black/10 bg-white p-2 shadow-sm">
            <div className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickClub}</div>
            <WheelH count={clubs.length} itemW={118} itemH={88} initialIndex={initialClubIdx} onIndex={(i) => { setClubIdx(i); if (ready.current) setDateIdx(0) }} render={(i, active) => {
              const c = clubs[i]
              return (
                <div className="flex flex-col items-center gap-1">
                  <span className="grid h-10 w-full place-items-center">{c.logo ? <img src={optImg(c.logo, 120)} loading="lazy" alt="" className="max-h-9 max-w-[85%] object-contain [filter:brightness(0)]" /> : <span className="text-sm font-black text-black">{c.name.slice(0, 3).toUpperCase()}</span>}</span>
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
        <div className="mt-3 min-w-0 md:mt-0">
          {windowEvents.length > 0 ? (
            <div className="relative h-full">
              <div className="hide-scrollbar -mx-1 flex h-full snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
                {windowEvents.map(e => (
                  <Link key={e.id} href={e.href} className="group block w-[86%] shrink-0 snap-center overflow-hidden rounded-3xl border border-black/10 shadow-lg sm:w-[72%] md:w-full">
                    <div className="relative aspect-[16/7] w-full bg-neutral-900 sm:aspect-[16/8] md:aspect-auto md:h-full md:min-h-[300px] lg:min-h-[360px]">
                      {e.image ? <img src={optImg(e.image, 500)} loading="lazy" alt={e.eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
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
        <Link href={ev.href} className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-ibiza-green px-7 py-4 font-serif text-xl font-black uppercase tracking-wide text-black shadow-md transition-all hover:brightness-95">
          <Ticket size={22} /> {L.book}{ev.price > 0 ? ` · €${ev.price}` : ''}
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

// ── Desktop agenda: week bar + carousel, day/month drill, cards grid, remembered ─
function DesktopAgenda({ events, locale, persistKey }: { events: PickerEvent[]; locale: string; persistKey?: string }) {
  const loc = DF[locale] || enUS
  const fmt = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }
  const TXT = ({
    en: { whole: 'Whole week', view: 'View this event', month: 'Month', week: 'Week', none: 'No events', from: 'From', wk: 'Week' },
    nl: { whole: 'Hele week', view: 'Bekijk dit event', month: 'Maand', week: 'Week', none: 'Geen events', from: 'Vanaf', wk: 'Week' },
    de: { whole: 'Ganze Woche', view: 'Event ansehen', month: 'Monat', week: 'Woche', none: 'Keine Events', from: 'Ab', wk: 'Woche' },
    es: { whole: 'Semana completa', view: 'Ver este evento', month: 'Mes', week: 'Semana', none: 'Sin eventos', from: 'Desde', wk: 'Semana' },
    fr: { whole: 'Toute la semaine', view: 'Voir cet événement', month: 'Mois', week: 'Semaine', none: 'Aucun événement', from: 'Dès', wk: 'Semaine' },
  } as Record<string, any>)[locale] || {} as any

  const monday = (d: Date) => startOfWeek(d, { weekStartsOn: 1 })
  const todayStr = useMemo(() => format(startOfDay(new Date()), 'yyyy-MM-dd'), [])

  const upcoming = useMemo(
    () => events.filter(e => /^\d{4}-\d{2}-\d{2}/.test(e.date) && e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)),
    [events, todayStr]
  )
  const firstMondayStr = useMemo(() => upcoming.length ? format(monday(parseISO(upcoming[0].date)), 'yyyy-MM-dd') : format(monday(new Date()), 'yyyy-MM-dd'), [upcoming])
  const lastMondayStr = useMemo(() => upcoming.length ? format(monday(parseISO(upcoming[upcoming.length - 1].date)), 'yyyy-MM-dd') : firstMondayStr, [upcoming, firstMondayStr])

  const saved = useRef<{ view?: 'week' | 'month'; weekStart?: string; selectedDay?: string | null; monthAnchor?: string }>(
    (() => { if (persistKey && typeof window !== 'undefined') { try { return JSON.parse(sessionStorage.getItem('epwD:' + persistKey) || '{}') } catch { return {} } } return {} })()
  ).current

  const [view, setView] = useState<'week' | 'month'>(saved.view || 'week')
  const [weekStart, setWeekStart] = useState<string>(saved.weekStart || firstMondayStr)
  const [selectedDay, setSelectedDay] = useState<string | null>(saved.selectedDay ?? null)
  const [monthAnchor, setMonthAnchor] = useState<string>(saved.monthAnchor || (saved.weekStart || firstMondayStr).slice(0, 7))

  useEffect(() => {
    if (persistKey && typeof window !== 'undefined') {
      try { sessionStorage.setItem('epwD:' + persistKey, JSON.stringify({ view, weekStart, selectedDay, monthAnchor })) } catch {}
    }
  }, [persistKey, view, weekStart, selectedDay, monthAnchor])

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => format(addDays(parseISO(weekStart), i), 'yyyy-MM-dd')), [weekStart])
  const weekEndStr = weekDays[6]
  const countForDay = (ds: string) => upcoming.filter(e => e.date === ds).length

  const windowEvents = useMemo(() => {
    if (selectedDay) return upcoming.filter(e => e.date === selectedDay)
    return upcoming.filter(e => e.date >= weekStart && e.date <= weekEndStr)
  }, [upcoming, selectedDay, weekStart, weekEndStr])

  // Month view → weeks (Mon–Sun) overlapping the anchored month
  const monthWeeks = useMemo(() => {
    const m0 = startOfMonth(parseISO(monthAnchor + '-01'))
    const mEnd = endOfMonth(m0)
    const out: { start: string; end: string; count: number }[] = []
    let cur = monday(m0)
    while (cur <= mEnd) {
      const s = format(cur, 'yyyy-MM-dd'); const e = format(addDays(cur, 6), 'yyyy-MM-dd')
      out.push({ start: s, end: e, count: upcoming.filter(ev => ev.date >= s && ev.date <= e).length })
      cur = addDays(cur, 7)
    }
    return out
  }, [monthAnchor, upcoming])

  const shiftWeek = (dir: number) => {
    const next = format(addDays(parseISO(weekStart), dir * 7), 'yyyy-MM-dd')
    if (next < firstMondayStr || next > lastMondayStr) return
    setWeekStart(next); setSelectedDay(null)
  }
  const shiftMonth = (dir: number) => {
    setMonthAnchor(format(addMonths(parseISO(monthAnchor + '-01'), dir), 'yyyy-MM'))
  }
  const openWeek = (s: string) => { setWeekStart(s); setSelectedDay(null); setView('week') }

  return (
    <div className="w-full">
      {/* View toggle */}
      <div className="mb-5 flex items-center justify-center gap-2">
        <div className="inline-flex rounded-full bg-black/5 p-1">
          <button onClick={() => setView('week')} className={`rounded-full px-6 py-2.5 text-sm font-black uppercase tracking-wider transition-all ${view === 'week' ? 'bg-ibiza-green text-black shadow-sm' : 'text-black/50 hover:text-black'}`}>{TXT.week}</button>
          <button onClick={() => setView('month')} className={`rounded-full px-6 py-2.5 text-sm font-black uppercase tracking-wider transition-all ${view === 'month' ? 'bg-ibiza-green text-black shadow-sm' : 'text-black/50 hover:text-black'}`}>{TXT.month}</button>
        </div>
      </div>

      {view === 'week' ? (
        <>
          {/* Week carousel bar: Mon–Sun */}
          <div className="mb-6 flex items-center gap-3">
            <button onClick={() => shiftWeek(-1)} disabled={weekStart <= firstMondayStr} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronLeft size={22} /></button>
            <div className="grid flex-1 grid-cols-8 gap-2">
              <button onClick={() => setSelectedDay(null)} className={`flex flex-col items-center justify-center rounded-2xl border px-2 py-3 transition-all ${!selectedDay ? 'border-ibiza-green bg-ibiza-green text-black' : 'border-black/10 bg-white text-black/60 hover:border-black/30'}`}>
                <span className="text-[10px] font-black uppercase tracking-wide">{TXT.whole}</span>
                <span className="font-serif text-lg font-black leading-none">{fmt(weekStart, 'd')}–{fmt(weekEndStr, 'd')}</span>
                <span className="text-[10px] font-black uppercase text-ibiza-green">{fmt(weekEndStr, 'MMM')}</span>
              </button>
              {weekDays.map(ds => {
                const on = selectedDay === ds; const cnt = countForDay(ds); const past = ds < todayStr
                return (
                  <button key={ds} disabled={past} onClick={() => setSelectedDay(on ? null : ds)} className={`flex flex-col items-center justify-center rounded-2xl border px-2 py-3 transition-all ${on ? 'border-ibiza-green bg-ibiza-green text-black' : past ? 'cursor-not-allowed border-black/5 text-black/25' : 'border-black/10 bg-white text-black hover:border-black/30'}`}>
                    <span className="text-[10px] font-black uppercase tracking-wide text-black/50">{fmt(ds, 'EEE')}</span>
                    <span className="font-serif text-xl font-black leading-none">{fmt(ds, 'd')}</span>
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full ${cnt > 0 ? (on ? 'bg-black' : 'bg-ibiza-green') : 'bg-transparent'}`} />
                  </button>
                )
              })}
            </div>
            <button onClick={() => shiftWeek(1)} disabled={weekStart >= lastMondayStr} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronRight size={22} /></button>
          </div>

          {/* Cards grid — all clubs stacked */}
          {windowEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {windowEvents.map(e => <AgendaCard key={e.id} e={e} fmt={fmt} view={TXT.view} />)}
            </div>
          ) : <div className="grid h-40 place-items-center rounded-3xl border border-black/10 text-sm font-semibold text-black/40">{TXT.none}</div>}
        </>
      ) : (
        <>
          {/* Month carousel */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <button onClick={() => shiftMonth(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-colors hover:bg-ibiza-green"><ChevronLeft size={22} /></button>
            <div className="min-w-[220px] text-center font-serif text-2xl font-black capitalize text-black">{fmt(monthAnchor + '-01', 'MMMM yyyy')}</div>
            <button onClick={() => shiftMonth(1)} className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-colors hover:bg-ibiza-green"><ChevronRight size={22} /></button>
          </div>
          {/* Week blocks (Mon–Sun) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monthWeeks.map((w, i) => (
              <button key={w.start} onClick={() => openWeek(w.start)} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-5 text-left shadow-sm transition-all hover:border-ibiza-green hover:shadow-md">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-ibiza-green">{TXT.wk} {i + 1}</div>
                  <div className="mt-1 font-serif text-xl font-black capitalize text-black">{fmt(w.start, 'd MMM')} – {fmt(w.end, 'd MMM')}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-serif text-3xl font-black text-black">{w.count}</span>
                  <span className="text-[10px] font-black uppercase tracking-wide text-black/40">events</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function AgendaCard({ e, fmt, view }: { e: PickerEvent; fmt: (iso: string, p: string) => string; view: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full bg-neutral-900">
        {e.image ? <img src={optImg(e.image, 500)} loading="lazy" alt={e.eventName} className="h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        {e.price > 0 && <span className="absolute right-2.5 top-2.5 rounded-lg bg-ibiza-green px-2.5 py-0.5 text-sm font-black text-black">€{e.price}</span>}
        {e.clubLogo && <span className="absolute left-2.5 top-2.5 grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white/90 p-1"><img src={optImg(e.clubLogo, 120)} loading="lazy" alt="" className="max-h-full max-w-full object-contain [filter:brightness(0)]" /></span>}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="font-serif text-lg font-black leading-tight text-white line-clamp-2">{e.eventName}</div>
          <div className="text-xs font-semibold text-white/75">{e.clubName} · <span className="capitalize">{fmt(e.date, 'EEE d MMM')}</span></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        {e.lineUp ? <div className="flex items-start gap-1.5 text-xs font-semibold leading-snug text-black/60 line-clamp-2"><Music size={13} className="mt-0.5 shrink-0 text-ibiza-green" /> {e.lineUp}</div> : <div className="text-xs text-black/30">—</div>}
        <Link href={e.href} className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-ibiza-green px-4 py-2.5 font-serif text-sm font-black uppercase tracking-wide text-black transition-all hover:brightness-95">
          <Ticket size={16} /> {view}{e.price > 0 ? ` · €${e.price}` : ''}
        </Link>
      </div>
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
      {/* Bright-green glowing button — the only thing shown on the page; opens the full calendar */}
      <button onClick={open} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-ibiza-green px-5 py-3 font-serif text-base font-black uppercase tracking-wide text-black shadow-md transition-transform hover:scale-[1.01]">
        <CalendarDays size={17} /> {L.openCal}
      </button>

      {mounted && full && createPortal(
        <div className="fixed inset-0 z-[300] flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5 md:px-5 md:py-4">
            <h2 className="font-serif text-lg font-black text-black md:text-2xl">Ibiza Calendar</h2>
            <button onClick={close} aria-label="Close" className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3.5 py-2 text-sm font-black uppercase tracking-wide text-black hover:bg-black/10"><X size={18} /> {L.close}</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-3xl md:max-w-7xl">
              <div className="hidden md:block">
                <DesktopAgenda events={events} locale={locale} persistKey={storeKey} />
              </div>
              <div className="md:hidden">
                <PickerRows events={events} locale={locale} persistKey={storeKey} full />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
