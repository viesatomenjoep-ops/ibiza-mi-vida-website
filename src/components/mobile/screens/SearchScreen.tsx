'use client'

import { useMemo, useState } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'
import type { ScreenProps } from '../MobileApp'
import { EventCard } from '../EventCard'
import { LazyList } from '../LazyList'

/** Search tab: instant filter over events (name / venue / lineup) + trending fallback. */
export function SearchScreen({ events, t, locale, openEvent }: ScreenProps) {
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return null
    return events
      .filter(e =>
        e.name.toLowerCase().includes(needle) ||
        e.venueName.toLowerCase().includes(needle) ||
        e.lineUp.toLowerCase().includes(needle),
      )
      .slice(0, 30)
  }, [events, q])

  // Trending = the priciest headline event per distinct name in the next 2 weeks.
  const trending = useMemo(() => {
    const horizon = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
    const seen = new Set<string>()
    return events
      .filter(e => e.date <= horizon && e.cover)
      .sort((a, b) => b.price - a.price)
      .filter(e => (seen.has(e.name) ? false : (seen.add(e.name), true)))
      .slice(0, 10)
  }, [events])

  return (
    <div className="px-4">
      {/* Search field */}
      <div
        className="sticky top-0 z-30 -mx-4 border-b border-white/[0.06] bg-obsidian/85 px-4 backdrop-blur-xl"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="relative py-3">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            enterKeyHint="search"
            className="w-full rounded-full border border-white/10 bg-obsidian-card py-3.5 pl-11 pr-11 text-[15px] font-medium text-white outline-none transition-colors motion-reduce:transition-none placeholder:text-white/30 hover:border-white/20 focus:border-gold-soft focus-visible:ring-2 focus-visible:ring-gold/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label={t.clearSearch}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/40 outline-none transition-colors motion-reduce:transition-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-gold-soft"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {results === null ? (
        <>
          <h2 className="mb-3 mt-5 flex items-center gap-2 font-display text-xl font-black text-white">
            <TrendingUp size={18} className="text-gold-soft" /> {t.trendingEvents}
          </h2>
          <div className="flex flex-col gap-3">
            {trending.map(e => (
              <EventCard key={e.id} event={e} t={t} locale={locale} onOpen={openEvent} />
            ))}
          </div>
        </>
      ) : results.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-white/[0.07] bg-obsidian-card p-10 text-center text-[14px] font-semibold text-white/40">
          {t.noResults}
        </p>
      ) : (
        <div key={q} className="mt-5 flex flex-col gap-3">
          <LazyList initial={10} step={10}>
            {results.map((e, i) => (
              <EventCard key={e.id} event={e} t={t} locale={locale} onOpen={openEvent} eager={i < 4} />
            ))}
          </LazyList>
        </div>
      )}
    </div>
  )
}
