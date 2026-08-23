'use client'

import { useMemo, useState } from 'react'
import { Sun, Moon, ChevronRight } from 'lucide-react'
import type { ScreenProps } from '../MobileApp'
import type { AppVenue } from '../types'
import { optImg } from '@/lib/img'
import { Map3D } from '@/components/map/Map3D'
import type { MapPlace } from '@/data/ibiza-map-clubs'

type Filter = 'all' | 'day' | 'night'

const ALL_LABEL: Record<string, string> = { nl: 'Alles', en: 'All', de: 'Alle', es: 'Todo', fr: 'Tout' }

/** Map tab: the real 3D Ibiza map (terrain + satellite, see Map3D) up top, day/night club list below. */
export function MapScreen({ venues, t, locale, openVenue }: ScreenProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const clubs = useMemo(
    () => venues.filter(v => v.typeSlug === 'clubbing').sort((a, b) => a.name.localeCompare(b.name)),
    [venues],
  )
  const list = clubs.filter(v => filter === 'all' || (filter === 'day' ? v.isDayClub : !v.isDayClub))

  // 3D map markers use a curated coordinate set (data/ibiza-map-clubs.ts) keyed
  // by slug — tapping one opens the matching live venue sheet when we have one.
  const onSelectPlace = (place: MapPlace) => {
    const venue = place.slug ? venues.find(v => v.slug === place.slug) : undefined
    if (venue) openVenue(venue)
  }

  return (
    <div>
      <div className="px-4 pt-4">
        <Map3D height="46vh" onSelectPlace={onSelectPlace} locale={locale} />
      </div>

      {/* Day/night filter */}
      <div className="mt-5 flex justify-center gap-2 px-4">
        {(['all', 'day', 'night'] as Filter[]).map(f => {
          const active = filter === f
          const label = f === 'all' ? (ALL_LABEL[locale] || ALL_LABEL.en) : f === 'day' ? t.dayClubs : t.nightClubs
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100 ${
                active ? 'bg-app-accent text-white shadow-lg shadow-app-accent/25' : 'bg-white/[0.06] text-white/50 hover:text-white/80'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Venue list */}
      <div className="flex flex-col gap-2.5 px-4 pb-4 pt-4">
        {list.map(v => {
          const img = v.whitelogo || v.picture || v.cover
          return (
            <button
              key={v.slug}
              type="button"
              onClick={() => openVenue(v)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-obsidian-card p-3 text-left outline-none transition-all motion-reduce:transition-none hover:border-white/20 focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-[0.985] motion-reduce:active:scale-100"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1.5">
                {img ? (
                  <img src={optImg(img, 96)} loading="lazy" decoding="async" alt="" className="max-h-full max-w-full object-contain brightness-0" />
                ) : (
                  <span className="font-display text-base font-black text-obsidian">{v.name.slice(0, 2)}</span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[16px] font-extrabold text-white">{v.name}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-white/45">
                  {v.isDayClub ? <Sun size={12} className="text-app-accent-soft" /> : <Moon size={12} className="text-app-accent-soft" />}
                  {v.isDayClub ? t.dayClub : t.nightClub}
                </span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-white/25 transition-transform motion-reduce:transition-none group-hover:translate-x-0.5 group-hover:text-white/60" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
