'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { format, parseISO, isValid, startOfDay } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { Ticket, Music, ChevronRight } from 'lucide-react'

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
}

type Period = 'day' | 'week' | 'month'

const DF: Record<string, any> = { nl, en: enUS, de, es, fr }

const LABELS: Record<string, {
  day: string; week: string; month: string; all: string; from: string;
  lineup: string; view: string; none: string; title: string
}> = {
  en: { day: 'Day', week: 'Week', month: 'Month', all: 'All clubs', from: 'From', lineup: 'Line-up', view: 'View event', none: 'No events in this range — showing all upcoming.', title: 'Spin to your night' },
  nl: { day: 'Dag', week: 'Week', month: 'Maand', all: 'Alle clubs', from: 'Vanaf', lineup: 'Line-up', view: 'Bekijk event', none: 'Geen events in dit bereik — alle komende worden getoond.', title: 'Draai naar jouw avond' },
  de: { day: 'Tag', week: 'Woche', month: 'Monat', all: 'Alle Clubs', from: 'Ab', lineup: 'Line-up', view: 'Event ansehen', none: 'Keine Events in diesem Zeitraum — alle kommenden werden gezeigt.', title: 'Dreh zu deiner Nacht' },
  es: { day: 'Día', week: 'Semana', month: 'Mes', all: 'Todos los clubs', from: 'Desde', lineup: 'Line-up', view: 'Ver evento', none: 'No hay eventos en este rango — mostrando todos los próximos.', title: 'Gira hacia tu noche' },
  fr: { day: 'Jour', week: 'Semaine', month: 'Mois', all: 'Tous les clubs', from: 'Dès', lineup: 'Line-up', view: 'Voir l’événement', none: 'Aucun événement dans cette plage — affichage de tous les prochains.', title: 'Tourne vers ta nuit' },
}

const ROW = 82          // px per row
const VISIBLE = 5       // odd → a true centre row
const VH = ROW * VISIBLE
const PAD = VH / 2 - ROW / 2

export function EventPickerWheel({ events, locale = 'nl', className = '' }: { events: PickerEvent[]; locale?: string; className?: string }) {
  const L = LABELS[locale] || LABELS.en
  const loc = DF[locale] || enUS
  const [period, setPeriod] = useState<Period>('week')
  const [club, setClub] = useState<string | null>(null)
  const [active, setActive] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const rafRef = useRef<number>(0)

  const todayStr = useMemo(() => format(startOfDay(new Date()), 'yyyy-MM-dd'), [])

  // Unique clubs (for the top filter strip)
  const clubs = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; logo?: string }>()
    events.forEach(e => { if (!map.has(e.clubSlug)) map.set(e.clubSlug, { slug: e.clubSlug, name: e.clubName, logo: e.clubLogo }) })
    return Array.from(map.values())
  }, [events])

  // Filter by period window + club, sorted by date; fall back to all-upcoming if empty
  const list = useMemo(() => {
    const upcoming = events
      .filter(e => /^\d{4}-\d{2}-\d{2}/.test(e.date) && e.date >= todayStr)
      .filter(e => !club || e.clubSlug === club)
      .sort((a, b) => a.date.localeCompare(b.date))
    const endOffset = period === 'day' ? 0 : period === 'week' ? 6 : 31
    const end = format(startOfDay(new Date(Date.now() + endOffset * 86400000)), 'yyyy-MM-dd')
    const windowed = upcoming.filter(e => e.date <= end)
    return windowed.length ? windowed : upcoming
  }, [events, club, period, todayStr])

  // Reset scroll + active when the list changes
  useEffect(() => {
    setActive(0)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    requestAnimationFrame(() => applyWheel())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list])

  const applyWheel = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const centerY = el.scrollTop + VH / 2
    let nearest = 0
    let nearestDist = Infinity
    for (let i = 0; i < list.length; i++) {
      const row = rowRefs.current[i]
      if (!row) continue
      const rowCenter = PAD + i * ROW + ROW / 2
      const d = (rowCenter - centerY) / ROW
      const ad = Math.abs(d)
      const scale = Math.max(0.72, 1 - ad * 0.13)
      const opacity = Math.max(0.25, 1 - ad * 0.26)
      const rot = Math.max(-58, Math.min(58, -d * 20))
      row.style.transform = `translateZ(0) scale(${scale.toFixed(3)}) rotateX(${rot.toFixed(1)}deg)`
      row.style.opacity = opacity.toFixed(3)
      row.style.zIndex = String(100 - Math.round(ad))
      if (ad < nearestDist) { nearestDist = ad; nearest = i }
    }
    setActive(prev => (prev !== nearest ? nearest : prev))
  }, [list.length])

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(applyWheel)
  }, [applyWheel])

  useEffect(() => { applyWheel() }, [applyWheel])

  const activeEvent = list[active]

  const fmtDate = (iso: string, pattern: string) => {
    try { const d = parseISO(iso); return isValid(d) ? format(d, pattern, { locale: loc }) : '' } catch { return '' }
  }

  return (
    <section className={`w-full ${className}`}>
      {/* Club filter strip */}
      {clubs.length > 1 && (
        <div className="hide-scrollbar -mx-4 mb-5 flex gap-3 overflow-x-auto px-4 pb-1">
          <button
            onClick={() => setClub(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${!club ? 'bg-black text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
          >
            {L.all}
          </button>
          {clubs.map(c => (
            <button
              key={c.slug}
              onClick={() => setClub(c.slug === club ? null : c.slug)}
              className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 transition-colors ${club === c.slug ? 'border-ibiza-green bg-ibiza-green/10' : 'border-black/10 bg-white hover:border-black/25'}`}
            >
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-black/5">
                {c.logo ? <img src={c.logo} alt="" className="h-full w-full object-contain p-1 [filter:brightness(0)]" /> : null}
              </span>
              <span className="whitespace-nowrap text-xs font-bold text-black">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Day / Week / Month selector */}
      <div className="mb-5 inline-flex rounded-full bg-black/5 p-1">
        {(['day', 'week', 'month'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-5 py-2 text-sm font-black uppercase tracking-wider transition-all ${period === p ? 'bg-ibiza-green text-black shadow-sm' : 'text-black/50 hover:text-black'}`}
          >
            {L[p]}
          </button>
        ))}
      </div>

      {/* The 3-column iOS-style picker */}
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">
        {/* Column headers */}
        <div className="grid grid-cols-[70px_92px_1fr] items-center gap-2 border-b border-black/5 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-black/35">
          <span className="text-center">Club</span>
          <span className="text-center">Datum</span>
          <span className="pl-2">Event</span>
        </div>

        {list.length === 0 ? (
          <div className="p-10 text-center text-sm font-semibold text-black/40">{L.none}</div>
        ) : (
          <div className="relative" style={{ height: VH }}>
            {/* Centre selection band */}
            <div
              className="pointer-events-none absolute inset-x-2 z-0 rounded-2xl border-2 border-ibiza-green/70 bg-ibiza-green/5"
              style={{ top: PAD, height: ROW }}
            />
            {/* Top/bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white to-transparent" />

            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="hide-scrollbar h-full overflow-y-auto"
              style={{ scrollSnapType: 'y mandatory', perspective: '900px', paddingTop: PAD, paddingBottom: PAD }}
            >
              {list.map((e, i) => (
                <Link
                  href={e.href}
                  key={e.id}
                  ref={(el) => { rowRefs.current[i] = el }}
                  className="grid grid-cols-[70px_92px_1fr] items-center gap-2 px-3"
                  style={{ height: ROW, scrollSnapAlign: 'center', transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
                >
                  {/* Col 1 — club logo */}
                  <span className="grid h-12 w-full place-items-center">
                    {e.clubLogo
                      ? <img src={e.clubLogo} alt={e.clubName} className="max-h-10 max-w-full object-contain [filter:brightness(0)]" />
                      : <span className="text-[10px] font-black text-black/60">{e.clubName.slice(0, 3).toUpperCase()}</span>}
                  </span>
                  {/* Col 2 — date */}
                  <span className="flex flex-col items-center justify-center leading-none">
                    <span className="text-[10px] font-black uppercase tracking-wide text-black/40">{fmtDate(e.date, 'EEE')}</span>
                    <span className="font-serif text-2xl font-black text-black">{fmtDate(e.date, 'd')}</span>
                    <span className="text-[10px] font-black uppercase tracking-wide text-ibiza-green">{fmtDate(e.date, 'MMM')}</span>
                  </span>
                  {/* Col 3 — event image + price */}
                  <span className="relative h-[64px] w-full overflow-hidden rounded-xl bg-neutral-900">
                    {e.image ? <img src={e.image} alt={e.eventName} className="h-full w-full object-cover" /> : null}
                    <span className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pr-16 font-serif text-sm font-black leading-tight text-white line-clamp-2">{e.eventName}</span>
                    {e.price > 0 && (
                      <span className="absolute right-2 top-2 rounded-md bg-ibiza-green px-2 py-0.5 text-[11px] font-black text-black">€{e.price}</span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info strip — artist / line-up / date / price of the centred event */}
      {activeEvent && (
        <Link
          href={activeEvent.href}
          className="group mt-5 flex items-center gap-4 rounded-2xl border border-black/10 bg-black/5 p-4 transition-colors hover:bg-white"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ibiza-green text-black"><Ticket size={20} /></span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-lg font-black text-black md:text-xl">{activeEvent.eventName}</h3>
            <p className="truncate text-sm font-semibold text-black/60">
              {activeEvent.clubName} · <span className="capitalize">{fmtDate(activeEvent.date, 'EEEE d MMMM')}</span>
            </p>
            {activeEvent.lineUp && (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-semibold text-black/50">
                <Music size={13} className="shrink-0 text-ibiza-green" /> {activeEvent.lineUp}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end">
            {activeEvent.price > 0 && (
              <>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">{L.from}</span>
                <span className="font-serif text-xl font-black text-black">€{activeEvent.price}</span>
              </>
            )}
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-ibiza-green">
              {L.view} <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      )}
    </section>
  )
}
