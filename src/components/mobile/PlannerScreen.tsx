'use client'

import { useMemo, useState, useRef } from 'react'
import { X, Calendar, Gem, Layers, MessageCircle, Heart, ArrowLeftCircle } from 'lucide-react'
import type { AppEvent, PlannerMode } from './types'
import type { AppLabels } from './i18n'
import { EventCard, shortDate } from './EventCard'
import { optImg } from '@/lib/img'
import { waLink, WA_BOOKINGS } from './config'
import { addDaysISO, todayISO } from './dateUtils'

const MODES: { id: PlannerMode; icon: typeof Calendar; labelKey: 'modePlanner' | 'modeSurprise' | 'modeSwipe' }[] = [
  { id: 'planner', icon: Calendar, labelKey: 'modePlanner' },
  { id: 'surprise', icon: Gem, labelKey: 'modeSurprise' },
  { id: 'swipe', icon: Layers, labelKey: 'modeSwipe' },
]

/**
 * Full-screen trip-planner overlay (not a half sheet — this is a multi-step
 * flow, so it gets its own header + back control). Three modes, switched via
 * a segmented control: a real day-by-day Itinerary builder, a one-tap
 * Concierge-picks reveal, and a Tinder-style Shortlist swiper.
 */
export function PlannerScreen({
  events,
  t,
  locale,
  onClose,
  onOpenEvent,
  onPickDate,
}: {
  events: AppEvent[]
  t: AppLabels
  locale: string
  onClose: () => void
  onOpenEvent: (e: AppEvent) => void
  /** Opens the shared date-picker sheet; resolves with the chosen ISO date. */
  onPickDate: (opts: { selected?: string; min?: string; max?: string }) => Promise<string | null>
}) {
  const [mode, setMode] = useState<PlannerMode>('planner')

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-obsidian" role="dialog" aria-modal="true" aria-label={t.plannerTitle}>
      {/* Header */}
      <div
        className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 py-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.back}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/70 outline-none transition-colors motion-reduce:transition-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100"
        >
          <ArrowLeftCircle size={18} />
        </button>
        <img src="/logo-white.png" alt="" className="h-5 w-5 shrink-0 object-contain opacity-90" />
        <h1 className="truncate font-display text-[15px] font-black uppercase tracking-wide text-white">{t.plannerTitle}</h1>
      </div>

      {/* Mode switcher */}
      <div role="tablist" aria-label="Planner mode" className="flex shrink-0 gap-2 border-b border-white/[0.06] px-4 py-3">
        {MODES.map(({ id, icon: Icon, labelKey }) => {
          const active = mode === id
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setMode(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-[11px] font-extrabold uppercase tracking-wide outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100 ${
                active ? 'bg-gold text-white shadow-lg shadow-gold/25' : 'bg-white/[0.05] text-white/45 hover:text-white/80'
              }`}
            >
              <Icon size={14} /> {t[labelKey]}
            </button>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5" style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>
        {mode === 'planner' && <ItineraryMode events={events} t={t} locale={locale} onOpenEvent={onOpenEvent} onPickDate={onPickDate} />}
        {mode === 'surprise' && <SurpriseMode events={events} t={t} locale={locale} onOpenEvent={onOpenEvent} />}
        {mode === 'swipe' && <SwipeMode events={events} t={t} locale={locale} />}
      </div>
    </div>
  )
}

// ── Mode 1: Itinerary ────────────────────────────────────────────────────

function ItineraryMode({
  events, t, locale, onOpenEvent, onPickDate,
}: {
  events: AppEvent[]
  t: AppLabels
  locale: string
  onOpenEvent: (e: AppEvent) => void
  onPickDate: (opts: { selected?: string; min?: string; max?: string }) => Promise<string | null>
}) {
  const today = todayISO()
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(addDaysISO(today, 3))
  const [built, setBuilt] = useState(false)

  const days = useMemo(() => {
    const out: string[] = []
    let d = from
    let guard = 0
    while (d <= to && guard < 30) { out.push(d); d = addDaysISO(d, 1); guard++ }
    return out
  }, [from, to])

  const pickFor = (iso: string): AppEvent | undefined => {
    const dayEvents = events.filter(e => e.date === iso)
    return dayEvents.sort((a, b) => {
      const ca = a.venueTypeSlug === 'clubbing' ? 0 : 1
      const cb = b.venueTypeSlug === 'clubbing' ? 0 : 1
      return ca !== cb ? ca - cb : b.price - a.price
    })[0]
  }

  const pickFrom = async () => {
    const iso = await onPickDate({ selected: from, min: today })
    if (iso) { setFrom(iso); if (iso > to) setTo(iso); setBuilt(false) }
  }
  const pickTo = async () => {
    const iso = await onPickDate({ selected: to, min: from })
    if (iso) { setTo(iso); setBuilt(false) }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-white/[0.07] bg-obsidian-card p-4">
        <h2 className="mb-3 font-display text-[14px] font-extrabold uppercase tracking-wider text-white/50">{t.plannerDates}</h2>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={pickFrom} className="flex flex-col items-start gap-0.5 rounded-xl border border-white/10 px-3 py-2.5 text-left outline-none transition-colors motion-reduce:transition-none hover:border-white/25 focus-visible:ring-2 focus-visible:ring-gold-soft">
            <span className="text-[10px] font-bold uppercase tracking-wide text-white/40">{t.plannerFrom}</span>
            <span className="font-display text-[15px] font-extrabold text-white">{shortDate(from, locale)}</span>
          </button>
          <button type="button" onClick={pickTo} className="flex flex-col items-start gap-0.5 rounded-xl border border-white/10 px-3 py-2.5 text-left outline-none transition-colors motion-reduce:transition-none hover:border-white/25 focus-visible:ring-2 focus-visible:ring-gold-soft">
            <span className="text-[10px] font-bold uppercase tracking-wide text-white/40">{t.plannerTo}</span>
            <span className="font-display text-[15px] font-extrabold text-white">{shortDate(to, locale)}</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setBuilt(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-gold/25 outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] motion-reduce:active:scale-100"
        >
          {t.buildItinerary}
        </button>
      </div>

      {built && (
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-black text-white">{t.yourItinerary}</h2>
          {days.map(iso => {
            const pick = pickFor(iso)
            return (
              <div key={iso}>
                <span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-white/40">{shortDate(iso, locale)}</span>
                {pick ? (
                  <EventCard event={pick} t={t} locale={locale} onOpen={onOpenEvent} eager />
                ) : (
                  <p className="rounded-2xl border border-white/[0.06] bg-obsidian-card p-4 text-[13px] font-semibold text-white/35">
                    {t.noPicksForDay}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Mode 2: Concierge picks ("surprise me", renamed) ────────────────────

function SurpriseMode({ events, t, locale, onOpenEvent }: { events: AppEvent[]; t: AppLabels; locale: string; onOpenEvent: (e: AppEvent) => void }) {
  const [pick, setPick] = useState<AppEvent | null>(null)

  const reveal = () => {
    const pool = events.filter(e => e.cover && e.venueTypeSlug === 'clubbing').slice(0, 60)
    const source = pool.length ? pool : events
    setPick(source[Math.floor(Math.random() * source.length)] || null)
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-4 text-center">
      <Gem size={28} className="text-gold-soft" />
      <p className="max-w-[32ch] text-[14px] leading-relaxed text-white/60">{t.surpriseIntro}</p>

      {pick && (
        <div className="w-full overflow-hidden rounded-3xl border border-gold/25 bg-obsidian-card text-left">
          {pick.cover && <img src={optImg(pick.cover, 640)} alt="" className="h-44 w-full object-cover" />}
          <div className="p-4">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gold-soft">{t.conciergesPick}</span>
            <h3 className="font-display text-xl font-black text-white">{pick.name}</h3>
            <p className="mt-1 text-[13px] font-semibold text-white/55">{pick.venueName} · {shortDate(pick.date, locale)}</p>
            <button
              type="button"
              onClick={() => onOpenEvent(pick)}
              className="mt-3 w-full rounded-full bg-gold px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-white outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] motion-reduce:active:scale-100"
            >
              {t.tickets}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={reveal}
        className="w-full rounded-full border border-gold/40 bg-gold/10 px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-gold-soft outline-none transition-colors motion-reduce:transition-none hover:bg-gold/20 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-[0.97] motion-reduce:active:scale-100"
      >
        {pick ? t.anotherPick : t.revealPick}
      </button>
    </div>
  )
}

// ── Mode 3: Shortlist ("swipe mode", renamed) ────────────────────────────

function SwipeMode({ events, t, locale }: { events: AppEvent[]; t: AppLabels; locale: string }) {
  const stack = useMemo(
    () => events.filter(e => e.cover).slice(0, 24),
    [events],
  )
  const [index, setIndex] = useState(0)
  const [saved, setSaved] = useState<AppEvent[]>([])
  const [dragX, setDragX] = useState(0)
  const startX = useRef<number | null>(null)

  const current = stack[index]
  const done = index >= stack.length

  const decide = (like: boolean) => {
    if (!current) return
    if (like) setSaved(s => [...s, current])
    setDragX(0)
    setIndex(i => i + 1)
  }

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX }
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return
    setDragX(e.touches[0].clientX - startX.current)
  }
  const onTouchEnd = () => {
    if (dragX > 90) decide(true)
    else if (dragX < -90) decide(false)
    else setDragX(0)
    startX.current = null
  }

  if (done) {
    const msg = saved.length
      ? `Hi Ibiza Mi Vida! My shortlist: ${saved.map(s => `${s.name} (${s.venueName}, ${s.date})`).join(' | ')}`
      : `Hi Ibiza Mi Vida! I'd like help planning my Ibiza nights.`
    return (
      <div className="flex flex-col items-center gap-5 pt-8 text-center">
        <Layers size={28} className="text-gold-soft" />
        <div>
          <h3 className="font-display text-xl font-black text-white">{t.swipeDone}</h3>
          <p className="mt-1 max-w-[32ch] text-[13px] leading-relaxed text-white/55">{t.swipeDoneBody}</p>
        </div>
        {saved.length > 0 && (
          <span className="rounded-full bg-white/[0.06] px-4 py-1.5 text-[12px] font-bold text-white/70">
            {saved.length} {t.shortlistCount}
          </span>
        )}
        <a
          href={waLink(WA_BOOKINGS, msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-gold/25 outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] motion-reduce:active:scale-100"
        >
          <MessageCircle size={16} /> {t.sendShortlist}
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-center text-[13px] text-white/50">{t.swipeIntro}</p>

      <div className="relative h-[420px] w-full max-w-xs">
        {[stack[index + 1], current].filter(Boolean).map((e, layerIdx) => {
          const isTop = layerIdx === 1
          const rotate = isTop ? dragX / 14 : 0
          return (
            <div
              key={e!.id}
              onTouchStart={isTop ? onTouchStart : undefined}
              onTouchMove={isTop ? onTouchMove : undefined}
              onTouchEnd={isTop ? onTouchEnd : undefined}
              style={{
                transform: isTop ? `translateX(${dragX}px) rotate(${rotate}deg)` : 'scale(0.96) translateY(10px)',
                transition: isTop && dragX === 0 ? 'transform 200ms' : undefined,
                touchAction: 'pan-y',
              }}
              className={`absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-obsidian-card shadow-2xl ${isTop ? 'z-10' : 'z-0 opacity-60'}`}
            >
              <img src={optImg(e!.cover, 640)} alt="" className="h-2/3 w-full object-cover" draggable={false} />
              <div className="p-4">
                <h3 className="font-display text-lg font-black leading-tight text-white">{e!.name}</h3>
                <p className="mt-1 text-[12px] font-semibold text-white/55">{e!.venueName} · {shortDate(e!.date, locale)}</p>
              </div>
              {isTop && dragX > 40 && <span className="absolute right-4 top-4 rounded-lg border-2 border-gold-soft px-2 py-1 text-[11px] font-black uppercase text-gold-soft">{t.save}</span>}
              {isTop && dragX < -40 && <span className="absolute left-4 top-4 rounded-lg border-2 border-white/40 px-2 py-1 text-[11px] font-black uppercase text-white/60">{t.skip}</span>}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => decide(false)}
          aria-label={t.skip}
          className="grid h-14 w-14 place-items-center rounded-full border border-white/15 text-white/60 outline-none transition-colors motion-reduce:transition-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-90 motion-reduce:active:scale-100"
        >
          <X size={22} />
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          aria-label={t.save}
          className="grid h-14 w-14 place-items-center rounded-full bg-gold text-white shadow-lg shadow-gold/25 outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-90 motion-reduce:active:scale-100"
        >
          <Heart size={22} />
        </button>
      </div>
    </div>
  )
}
