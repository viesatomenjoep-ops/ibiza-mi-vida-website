'use client'

import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import type { ScreenProps } from '../MobileApp'
import { EventCard, shortDate } from '../EventCard'

const FILTERS = [
  { key: 'all', slugs: null },
  { key: 'clubbing', slugs: ['clubbing'] },
  { key: 'water', slugs: ['boat', 'formentera-day-trip'] },
  { key: 'land', slugs: ['activities'] },
] as const

const FILTER_LABEL: Record<string, Record<string, string>> = {
  all: { nl: 'Alles', en: 'All', de: 'Alle', es: 'Todo', fr: 'Tout' },
  clubbing: { nl: 'Clubs', en: 'Clubs', de: 'Clubs', es: 'Clubs', fr: 'Clubs' },
  water: { nl: 'Op het water', en: 'On the water', de: 'Auf dem Wasser', es: 'En el agua', fr: "Sur l'eau" },
  land: { nl: 'Op het land', en: 'On land', de: 'An Land', es: 'En tierra', fr: 'Sur terre' },
}

/** Events tab: the full feed, grouped per day, with a category filter row. */
export function EventsScreen({ events, t, locale, openEvent }: ScreenProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')

  const grouped = useMemo(() => {
    const slugs = FILTERS.find(f => f.key === filter)?.slugs
    const filtered = slugs ? events.filter(e => slugs.includes(e.venueTypeSlug as never)) : events
    const byDay = new Map<string, typeof events>()
    for (const e of filtered) {
      const arr = byDay.get(e.date) || []
      arr.push(e)
      byDay.set(e.date, arr)
    }
    return Array.from(byDay.entries()).slice(0, 21) // 3 weeks of days max per render
  }, [events, filter])

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="px-4">
      {/* Filter chips */}
      <div
        className="sticky top-0 z-30 -mx-4 border-b border-white/[0.06] bg-obsidian/85 px-4 backdrop-blur-xl"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map(f => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-wide outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100 ${
                  active ? 'bg-gold text-white shadow-lg shadow-gold/25' : 'bg-white/[0.06] text-white/50 hover:text-white/80'
                }`}
              >
                {(FILTER_LABEL[f.key] || {})[locale] || FILTER_LABEL[f.key].en}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day groups */}
      {grouped.map(([day, list]) => (
        <section key={day} className="pt-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-black text-white">
              <CalendarDays size={16} className="text-gold-soft" />
              {day === todayStr ? t.today : shortDate(day, locale)}
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/35">
              {list.length} {t.events}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {list.map(e => (
              <EventCard key={e.id} event={e} t={t} locale={locale} onOpen={openEvent} />
            ))}
          </div>
        </section>
      ))}

      {grouped.length === 0 && (
        <p className="mt-8 rounded-3xl border border-white/[0.07] bg-obsidian-card p-10 text-center text-[14px] font-semibold text-white/40">
          {t.noEvents}
        </p>
      )}
    </div>
  )
}
