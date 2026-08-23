'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Flame, ArrowRight, MapPin } from 'lucide-react'
import type { AgendaView } from '../types'
import type { ScreenProps } from '../MobileApp'
import { TopTabs } from '../TopTabs'
import { MonthStrip } from '../MonthStrip'
import { ArtistRail } from '../ArtistRail'
import { LazyList } from '../LazyList'
import { EventCard, shortDate } from '../EventCard'
import { optImg } from '@/lib/img'
import { waLink, WA_BOOKINGS } from '../config'
import { weekdayShort } from '../i18n'
import { addDaysISO, monthKey, startOfMonthISO, todayISO } from '../dateUtils'

/**
 * Agenda tab. Three views behind sticky top tabs:
 *  - calendar: hero video band (first-load "home" screen) + month strip +
 *    14-day strip + events for the picked day
 *  - explore:  featured covers, artist rail, planner + concierge banners
 *  - upcoming: straight chronological feed
 */
export function AgendaScreen({
  events, t, locale, openEvent, openVenue, openArtist, artists, venues, view, setView, heroVideoSrc, heroVideoPoster, onOpenPlanner,
}: ScreenProps & { view: AgendaView; setView: (v: AgendaView) => void; onOpenPlanner: () => void }) {
  const todayStr = useMemo(() => todayISO(), [])
  const [monthAnchor, setMonthAnchor] = useState(todayStr)
  const days = useMemo(() => {
    // If the picked month is the current one, start from today; otherwise
    // from day 1 of that month — never show past days.
    const base = monthKey(monthAnchor) === monthKey(todayStr) ? todayStr : startOfMonthISO(monthAnchor)
    return Array.from({ length: 14 }, (_, i) => addDaysISO(base, i))
  }, [monthAnchor, todayStr])
  const [selectedDay, setSelectedDay] = useState(todayStr)

  const countByDay = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of events) m.set(e.date, (m.get(e.date) || 0) + 1)
    return m
  }, [events])

  // Clubs lead, then the rest — each group priciest-first.
  const dayEvents = useMemo(
    () =>
      events
        .filter(e => e.date === selectedDay)
        .sort((a, b) => {
          const ca = a.venueTypeSlug === 'clubbing' ? 0 : 1
          const cb = b.venueTypeSlug === 'clubbing' ? 0 : 1
          return ca !== cb ? ca - cb : b.price - a.price
        }),
    [events, selectedDay],
  )

  // Featured = first upcoming event per distinct event name that has a cover.
  const featured = useMemo(() => {
    const seen = new Set<string>()
    const out: typeof events = []
    for (const e of events) {
      if (!e.cover || seen.has(e.name)) continue
      seen.add(e.name)
      out.push(e)
      if (out.length >= 8) break
    }
    return out
  }, [events])

  const upcoming = useMemo(() => events.slice(0, 40), [events])

  // Keep the selected day chip in view when it changes
  const stripRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    stripRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${selectedDay}"]`)
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [selectedDay])

  const onPickMonth = (monthStartISO: string) => {
    setMonthAnchor(monthStartISO)
    const base = monthKey(monthStartISO) === monthKey(todayStr) ? todayStr : startOfMonthISO(monthStartISO)
    setSelectedDay(base)
  }

  return (
    <div>
      <TopTabs view={view} setView={setView} t={t} />

      {view === 'calendar' && (
        <div>
          {/* Hero video — the app's actual "home" moment, first thing seen */}
          {heroVideoSrc && (
            <div className="relative h-40 w-full overflow-hidden">
              <video
                autoPlay muted loop playsInline preload="metadata"
                poster={heroVideoPoster || undefined}
                src={heroVideoSrc}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-black/30" aria-hidden />
              <div className="absolute inset-x-4 bottom-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white/70">
                <MapPin size={12} className="text-gold-soft" /> Ibiza, {new Date().getFullYear()}
              </div>
            </div>
          )}

          <div className="px-4 pt-4">
            <MonthStrip activeMonth={monthAnchor} onPick={onPickMonth} locale={locale} />

            {/* 14-day strip */}
            <div ref={stripRef} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {days.map(d => {
                const active = d === selectedDay
                const has = (countByDay.get(d) || 0) > 0
                return (
                  <button
                    key={d}
                    data-day={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    aria-pressed={active}
                    className={`relative flex w-[64px] shrink-0 flex-col items-center gap-0.5 rounded-2xl border py-3 outline-none transition-all motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100 ${
                      active
                        ? 'border-gold bg-gold text-white shadow-lg shadow-gold/25'
                        : 'border-white/[0.07] bg-obsidian-card text-white/60 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wide opacity-80">
                      {d === todayStr ? t.today.slice(0, 3) : weekdayShort(locale, new Date(d + 'T12:00:00Z').getUTCDay())}
                    </span>
                    <span className="font-display text-xl font-black">{Number(d.slice(8, 10))}</span>
                    {has && <span className={`absolute bottom-1.5 h-1 w-1 rounded-full ${active ? 'bg-white' : 'bg-gold-soft'}`} aria-hidden />}
                  </button>
                )
              })}
            </div>

            {/* Day header */}
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="flex items-center gap-2 font-display text-xl font-black text-white">
                <Flame size={18} className="text-gold-soft" /> {t.popularEvents}
              </h2>
              <span className="text-[12px] font-bold uppercase tracking-wider text-white/35">
                {shortDate(selectedDay, locale)} · {dayEvents.length} {t.events}
              </span>
            </div>

            {/* Events for the day — mounted incrementally so a 58-event day
                doesn't fire 58 image requests and DOM nodes in one burst */}
            {dayEvents.length === 0 ? (
              <p className="rounded-3xl border border-white/[0.07] bg-obsidian-card p-10 text-center text-[14px] font-semibold text-white/40">
                {t.noEvents}
              </p>
            ) : (
              <div key={selectedDay} className="flex flex-col gap-3">
                <LazyList initial={8} step={12}>
                  {dayEvents.map((e, i) => (
                    <EventCard key={e.id} event={e} t={t} locale={locale} onOpen={openEvent} hero={i === 0} eager={i < 4} />
                  ))}
                </LazyList>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'explore' && (
        <div className="flex flex-col gap-6 px-4 pt-5">
          <div>
            <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-black text-white">
              <Flame size={18} className="text-gold-soft" /> {t.featuredEvents}
            </h2>
            {/* Cover-forward horizontal rail */}
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featured.map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => openEvent(e)}
                  className="group relative h-56 w-40 shrink-0 overflow-hidden rounded-3xl border border-white/[0.07] bg-obsidian-card text-left outline-none transition-all motion-reduce:transition-none hover:border-white/25 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-[0.97] motion-reduce:active:scale-100"
                >
                  <img src={optImg(e.cover, 384)} loading="lazy" decoding="async" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" aria-hidden />
                  {e.price > 0 && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-gold px-2 py-0.5 text-[11px] font-black text-white shadow">€{e.price}</span>
                  )}
                  <span className="absolute inset-x-3 bottom-3 flex flex-col gap-0.5">
                    <span className="line-clamp-2 font-display text-[15px] font-extrabold leading-tight text-white">{e.name}</span>
                    <span className="truncate text-[11px] font-bold uppercase tracking-wide text-white/55">
                      {e.venueName} · {shortDate(e.date, locale)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <ArtistRail artists={artists} t={t} onOpen={openArtist} />

          {/* Planner banner — the app's "build my trip" surface */}
          <button
            type="button"
            onClick={onOpenPlanner}
            className="group relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/20 via-obsidian-card to-obsidian-card p-6 text-left outline-none transition-all motion-reduce:transition-none hover:border-gold/50 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-[0.985] motion-reduce:active:scale-100"
          >
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-gold-soft">{t.tabAgenda}</span>
            <span className="block font-display text-2xl font-black leading-tight text-white">{t.plannerBanner}</span>
            <span className="mt-2 block max-w-[36ch] text-[13px] leading-relaxed text-white/60">{t.plannerBannerBody}</span>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-gold/25 transition-colors motion-reduce:transition-none group-hover:bg-gold-soft">
              {t.openPlanner} <ArrowRight size={15} />
            </span>
          </button>

          {/* Concierge banner */}
          <a
            href={waLink(WA_BOOKINGS, 'Hi Ibiza Mi Vida! I need your VIP concierge for my Ibiza trip.')}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-obsidian-card p-6 outline-none transition-all motion-reduce:transition-none hover:border-white/25 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-[0.985] motion-reduce:active:scale-100"
          >
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{t.brandName}</span>
            <span className="block font-display text-2xl font-black leading-tight text-white">{t.concierge}</span>
            <span className="mt-2 block max-w-[36ch] text-[13px] leading-relaxed text-white/60">{t.conciergeBody}</span>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wide text-white transition-colors motion-reduce:transition-none group-hover:bg-white/10">
              WhatsApp <ArrowRight size={15} />
            </span>
          </a>

          {/* Clubs rail */}
          <div className="pb-2">
            <h2 className="mb-3 font-display text-xl font-black text-white">{t.mapTitle}</h2>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {venues.filter(v => v.typeSlug === 'clubbing' && (v.whitelogo || v.picture)).slice(0, 12).map(v => (
                <button
                  key={v.slug}
                  type="button"
                  onClick={() => openVenue(v)}
                  className="flex w-24 shrink-0 flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-gold-soft rounded-2xl active:scale-95 motion-reduce:active:scale-100 transition-transform motion-reduce:transition-none"
                >
                  <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-white/[0.07] bg-white p-2.5">
                    <img src={optImg(v.whitelogo || v.picture, 128)} loading="lazy" decoding="async" alt="" className="max-h-full max-w-full object-contain brightness-0" />
                  </span>
                  <span className="w-full truncate text-center text-[11px] font-bold uppercase tracking-wide text-white/55">{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'upcoming' && (
        <div className="px-4 pt-5">
          <h2 className="mb-3 font-display text-xl font-black text-white">{t.viewUpcoming}</h2>
          <div className="flex flex-col gap-3">
            <LazyList initial={10} step={12}>
              {upcoming.map((e, i) => (
                <EventCard key={e.id} event={e} t={t} locale={locale} onOpen={openEvent} eager={i < 4} />
              ))}
            </LazyList>
          </div>
        </div>
      )}
    </div>
  )
}
