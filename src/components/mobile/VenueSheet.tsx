'use client'

import { Sun, Moon, CalendarDays } from 'lucide-react'
import type { AppEvent, AppVenue } from './types'
import type { AppLabels } from './i18n'
import { optImg } from '@/lib/img'
import { EventCard } from './EventCard'

/** Venue detail sheet: identity header + its upcoming events (UNVRS-style). */
export function VenueSheet({
  venue: v,
  events,
  t,
  locale,
  onPickEvent,
}: {
  venue: AppVenue
  events: AppEvent[]
  t: AppLabels
  locale: string
  onPickEvent: (e: AppEvent) => void
}) {
  const upcoming = events.slice(0, 12)
  const img = v.whitelogo || v.picture || v.cover

  return (
    <div className="flex flex-col gap-5 pt-1">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
          {img ? (
            <img src={optImg(img, 128)} alt="" className="max-h-full max-w-full object-contain brightness-0" />
          ) : (
            <span className="font-display text-xl font-black text-obsidian">{v.name.slice(0, 2)}</span>
          )}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-display text-2xl font-black text-white">{v.name}</h2>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white/60">
            {v.isDayClub ? <Sun size={11} className="text-gold-soft" /> : <Moon size={11} className="text-gold-soft" />}
            {v.isDayClub ? t.dayClub : t.nightClub}
          </span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-display text-[15px] font-extrabold uppercase tracking-wider text-white/50">
          <CalendarDays size={15} className="text-gold-soft" /> {t.upcomingAt}
        </h3>
        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-white/[0.07] bg-obsidian-card p-6 text-center text-[14px] font-semibold text-white/40">
            {t.noEvents}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map(e => (
              <EventCard key={e.id} event={e} t={t} locale={locale} onOpen={onPickEvent} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
