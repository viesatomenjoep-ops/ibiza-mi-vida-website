'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { format, parseISO, isValid, startOfDay } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { Ticket, Music, ChevronRight, CalendarDays, X } from 'lucide-react'

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
  view: string; none: string; open: string; book: string; pickClub: string; pickDate: string
}> = {
  en: { day: 'Day', week: 'Week', month: 'Month', from: 'From', lineup: 'Line-up', view: 'View event', none: 'No events', open: 'Open calendar', book: 'View & book', pickClub: 'Club', pickDate: 'Date' },
  nl: { day: 'Dag', week: 'Week', month: 'Maand', from: 'Vanaf', lineup: 'Line-up', view: 'Bekijk event', none: 'Geen events', open: 'Open agenda', book: 'Bekijk & boek', pickClub: 'Club', pickDate: 'Datum' },
  de: { day: 'Tag', week: 'Woche', month: 'Monat', from: 'Ab', lineup: 'Line-up', view: 'Event ansehen', none: 'Keine Events', open: 'Kalender öffnen', book: 'Ansehen & buchen', pickClub: 'Club', pickDate: 'Datum' },
  es: { day: 'Día', week: 'Semana', month: 'Mes', from: 'Desde', lineup: 'Line-up', view: 'Ver evento', none: 'Sin eventos', open: 'Abrir calendario', book: 'Ver y reservar', pickClub: 'Club', pickDate: 'Fecha' },
  fr: { day: 'Jour', week: 'Semaine', month: 'Mois', from: 'Dès', lineup: 'Line-up', view: 'Voir', none: 'Aucun événement', open: 'Ouvrir le calendrier', book: 'Voir & réserver', pickClub: 'Club', pickDate: 'Date' },
}

// ── Reusable iOS-style wheel ──────────────────────────────────────────────────
function Wheel({ count, rowH, visible, onIndex, render }: {
  count: number
  rowH: number
  visible: number
  onIndex?: (i: number) => void
  render: (i: number, active: boolean) => React.ReactNode
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
    const centerY = el.scrollTop + H / 2
    let near = 0, nd = Infinity
    for (let i = 0; i < count; i++) {
      const row = rowRefs.current[i]
      if (!row) continue
      const rc = PAD + i * rowH + rowH / 2
      const d = (rc - centerY) / rowH
      const ad = Math.abs(d)
      row.style.transform = `scale(${Math.max(0.68, 1 - ad * 0.13).toFixed(3)}) rotateX(${Math.max(-60, Math.min(60, -d * 22)).toFixed(1)}deg)`
      row.style.opacity = Math.max(0.22, 1 - ad * 0.3).toFixed(3)
      if (ad < nd) { nd = ad; near = i }
    }
    if (near !== last.current) {
      last.current = near
      setAct(near)
      onIndex?.(near)
    }
  }, [count, rowH, H, PAD, onIndex])

  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(apply) }
  useEffect(() => { last.current = -1; requestAnimationFrame(apply) }, [count, apply])

  return (
    <div className="relative select-none" style={{ height: H }}>
      <div className="pointer-events-none absolute inset-x-1 z-0 rounded-2xl border-2 border-ibiza-green/70 bg-ibiza-green/5" style={{ top: PAD, height: rowH }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white to-transparent" style={{ height: PAD }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white to-transparent" style={{ height: PAD }} />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="hide-scrollbar h-full overflow-y-auto"
        style={{ scrollSnapType: 'y mandatory', perspective: '900px', paddingTop: PAD, paddingBottom: PAD }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { rowRefs.current[i] = el }}
            className="flex items-center justify-center px-1"
            style={{ height: rowH, scrollSnapAlign: 'center', transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
          >
            {render(i, i === act)}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── The three-wheel picker body (used compact + full-screen) ──────────────────
function PickerBody({ events, locale, big }: { events: PickerEvent[]; locale: string; big?: boolean }) {
  const L = LABELS[locale] || LABELS.en
  const loc = DF[locale] || enUS
  const todayStr = useMemo(() => format(startOfDay(new Date()), 'yyyy-MM-dd'), [])
  const [period, setPeriod] = useState<Period>('week')
  const [clubIdx, setClubIdx] = useState(0)
  const [dateIdx, setDateIdx] = useState(0)

  const fmt = (iso: string, p: string) => { try { const d = parseISO(iso); return isValid(d) ? format(d, p, { locale: loc }) : '' } catch { return '' } }

  const clubs = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; logo?: string }>()
    events.filter(e => e.date >= todayStr).forEach(e => { if (!map.has(e.clubSlug)) map.set(e.clubSlug, { slug: e.clubSlug, name: e.clubName, logo: e.clubLogo }) })
    return Array.from(map.values())
  }, [events, todayStr])

  const club = clubs[Math.min(clubIdx, clubs.length - 1)]

  const clubDates = useMemo(() => {
    if (!club) return [] as PickerEvent[]
    const all = events.filter(e => e.clubSlug === club.slug && e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date))
    const off = period === 'day' ? 0 : period === 'week' ? 6 : 31
    const end = format(startOfDay(new Date(Date.now() + off * 86400000)), 'yyyy-MM-dd')
    const win = all.filter(e => e.date <= end)
    return win.length ? win : all
  }, [events, club, period, todayStr])

  const ev = clubDates[Math.min(dateIdx, clubDates.length - 1)]

  const clubRow = big ? 92 : 66
  const dateRow = big ? 92 : 66
  const vis = big ? 5 : 3

  if (clubs.length === 0) return <div className="p-10 text-center text-sm font-semibold text-black/40">{L.none}</div>

  return (
    <div className="w-full">
      {/* Day / Week / Month */}
      <div className="mb-4 flex justify-center">
        <div className="inline-flex rounded-full bg-black/5 p-1">
          {(['day', 'week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all md:px-5 md:text-sm ${period === p ? 'bg-ibiza-green text-black shadow-sm' : 'text-black/50 hover:text-black'}`}
            >{L[p]}</button>
          ))}
        </div>
      </div>

      {/* 3 columns: club wheel | date wheel | reactive event */}
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">
        <div className="grid grid-cols-[1fr_1fr_1.5fr] items-stretch">
          {/* Club wheel */}
          <div className="border-r border-black/5">
            <div className="border-b border-black/5 py-2 text-center text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickClub}</div>
            <Wheel
              count={clubs.length}
              rowH={clubRow}
              visible={vis}
              onIndex={(i) => { setClubIdx(i); setDateIdx(0) }}
              render={(i, active) => {
                const c = clubs[i]
                return (
                  <div className="flex flex-col items-center gap-1">
                    <span className="grid h-9 w-full place-items-center">
                      {c.logo ? <img src={c.logo} alt="" className="max-h-8 max-w-[80%] object-contain [filter:brightness(0)]" /> : <span className="text-xs font-black text-black">{c.name.slice(0, 3).toUpperCase()}</span>}
                    </span>
                    <span className={`px-1 text-center text-[10px] font-bold leading-tight ${active ? 'text-black' : 'text-black/50'} line-clamp-1`}>{c.name}</span>
                  </div>
                )
              }}
            />
          </div>

          {/* Date wheel — remounts (key) when club or period changes */}
          <div className="border-r border-black/5">
            <div className="border-b border-black/5 py-2 text-center text-[10px] font-black uppercase tracking-widest text-black/35">{L.pickDate}</div>
            <Wheel
              key={`${club?.slug}-${period}`}
              count={clubDates.length}
              rowH={dateRow}
              visible={vis}
              onIndex={(i) => setDateIdx(i)}
              render={(i, active) => {
                const d = clubDates[i]
                if (!d) return null
                return (
                  <div className="flex flex-col items-center justify-center leading-none">
                    <span className={`text-[10px] font-black uppercase tracking-wide ${active ? 'text-black/50' : 'text-black/30'}`}>{fmt(d.date, 'EEE')}</span>
                    <span className={`font-serif font-black ${active ? 'text-black' : 'text-black/70'} ${big ? 'text-3xl' : 'text-2xl'}`}>{fmt(d.date, 'd')}</span>
                    <span className="text-[10px] font-black uppercase tracking-wide text-ibiza-green">{fmt(d.date, 'MMM')}</span>
                  </div>
                )
              }}
            />
          </div>

          {/* Reactive event image + price */}
          <div className="relative">
            {ev ? (
              <Link href={ev.href} className="group block h-full w-full">
                <div className="relative h-full w-full overflow-hidden bg-neutral-900">
                  {ev.image ? <img key={ev.id} src={ev.image} alt={ev.eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  {ev.price > 0 && <span className="absolute right-2 top-2 rounded-md bg-ibiza-green px-2 py-0.5 text-[11px] font-black text-black">€{ev.price}</span>}
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className={`font-serif font-black leading-tight text-white line-clamp-2 ${big ? 'text-lg' : 'text-sm'}`}>{ev.eventName}</div>
                    <div className="mt-0.5 truncate text-[11px] font-semibold text-white/70 capitalize">{fmt(ev.date, 'EEEE d MMMM')}</div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="grid h-full place-items-center p-4 text-center text-xs font-semibold text-black/40">{L.none}</div>
            )}
          </div>
        </div>
      </div>

      {/* Reactive info + CTA */}
      {ev && (
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
      )}
    </div>
  )
}

// ── Public component: compact picker + "Open calendar" full-screen ────────────
export function EventPickerWheel({ events, locale = 'nl', className = '' }: { events: PickerEvent[]; locale?: string; className?: string }) {
  const L = LABELS[locale] || LABELS.en
  const [full, setFull] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (!full) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [full])

  return (
    <section className={`w-full ${className}`}>
      <PickerBody events={events} locale={locale} />

      <button
        onClick={() => setFull(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-ibiza-green bg-ibiza-green/10 px-6 py-4 font-serif text-lg font-black uppercase tracking-wide text-black transition-colors hover:bg-ibiza-green/20"
      >
        <CalendarDays size={20} /> {L.open}
      </button>

      {mounted && full && createPortal(
        <div className="fixed inset-0 z-[300] flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="font-serif text-xl font-black text-black md:text-2xl">Ibiza Calendar</h2>
            <button onClick={() => setFull(false)} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full bg-black/5 text-black hover:bg-black/10"><X size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="mx-auto w-full max-w-2xl">
              <PickerBody events={events} locale={locale} big />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
