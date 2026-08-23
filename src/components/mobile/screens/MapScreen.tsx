'use client'

import { useMemo, useState } from 'react'
import { Sun, Moon, ChevronRight } from 'lucide-react'
import type { ScreenProps } from '../MobileApp'
import type { AppVenue } from '../types'
import { optImg } from '@/lib/img'

/**
 * Stylized tactical map: a simplified Ibiza silhouette (SVG, offline, no map
 * SDK or API key) with glow pins projected from real venue coordinates for the
 * island's known clubs. Tapping a pin or a list row opens the venue sheet.
 * Coordinates are public knowledge; venues without a known location simply
 * appear in the list without a pin.
 */

// lat/lng → SVG x/y (viewBox 0 0 440 360, Ibiza bbox ~1.19–1.62E / 38.79–39.13N)
const px = (lat: number, lng: number) => ({
  x: Math.round((lng - 1.19) * 950 * 10) / 10,
  y: Math.round((39.13 - lat) * 1150 * 10) / 10,
})

// Known club locations keyed by a slug fragment.
const COORDS: [RegExp, { lat: number; lng: number }][] = [
  [/ushuaia/, { lat: 38.8843, lng: 1.4095 }],
  [/^hi-|hi-ibiza/, { lat: 38.8827, lng: 1.4113 }],
  [/pacha(?!.*destino)/, { lat: 38.9187, lng: 1.4472 }],
  [/amnesia/, { lat: 38.9482, lng: 1.4076 }],
  [/unvrs|privilege/, { lat: 38.9506, lng: 1.4062 }],
  [/dc-?10/, { lat: 38.8697, lng: 1.3966 }],
  [/eden/, { lat: 38.9789, lng: 1.301 }],
  [/paradis/, { lat: 38.9808, lng: 1.3025 }],
  [/o-beach/, { lat: 38.9843, lng: 1.3095 }],
  [/^lio|\blio\b/, { lat: 38.9179, lng: 1.4448 }],
  [/bambuku|bam-bu-ku/, { lat: 38.9885, lng: 1.3128 }],
  [/soleil/, { lat: 38.877, lng: 1.403 }],
  [/destino/, { lat: 38.9089, lng: 1.4531 }],
  [/cova-santa/, { lat: 38.9021, lng: 1.3554 }],
]

const coordsFor = (slug: string) => COORDS.find(([re]) => re.test(slug))?.[1]

// Simplified Ibiza coastline traced from ~20 real coastal points.
const IBIZA_PATH =
  'M313,23 L389,57 L380,115 L323,172 L266,241 L247,253 L199,287 L190,345 L152,322 L114,310 L48,310 ' +
  'L28,287 L28,253 L38,230 L95,184 L119,178 L104,172 L86,150 L95,126 L124,92 L238,46 Z'

type Filter = 'all' | 'day' | 'night'

const ALL_LABEL: Record<string, string> = { nl: 'Alles', en: 'All', de: 'Alle', es: 'Todo', fr: 'Tout' }

export function MapScreen({ venues, t, locale, openVenue }: ScreenProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const clubs = useMemo(
    () => venues.filter(v => v.typeSlug === 'clubbing').sort((a, b) => a.name.localeCompare(b.name)),
    [venues],
  )
  const matches = (v: AppVenue) =>
    filter === 'all' || (filter === 'day' ? v.isDayClub : !v.isDayClub)
  const list = clubs.filter(matches)

  const pins = useMemo(
    () =>
      clubs
        .map(v => ({ v, c: coordsFor(v.slug) }))
        .filter((p): p is { v: AppVenue; c: { lat: number; lng: number } } => !!p.c)
        .map(({ v, c }) => ({ v, ...px(c.lat, c.lng) })),
    [clubs],
  )

  return (
    <div>
      {/* Tactical island map */}
      <div className="relative border-b border-white/[0.06] bg-obsidian">
        <svg viewBox="0 0 440 360" className="mx-auto block w-full max-w-lg" role="img" aria-label="Ibiza">
          <defs>
            <pattern id="m-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0H0V28" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
            </pattern>
            <radialGradient id="m-glow" r="0.5">
              <stop offset="0%" stopColor="#5E87AC" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#5E87AC" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="440" height="360" fill="url(#m-grid)" />
          <path d={IBIZA_PATH} fill="#14161D" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" strokeLinejoin="round" />
          {pins.map(({ v, x, y }) => {
            const dimmed = !matches(v)
            return (
              <g
                key={v.slug}
                role="button"
                tabIndex={dimmed ? -1 : 0}
                aria-label={v.name}
                onClick={() => !dimmed && openVenue(v)}
                onKeyDown={e => { if (!dimmed && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openVenue(v) } }}
                className={dimmed ? 'opacity-25' : 'cursor-pointer outline-none focus-visible:opacity-100 [&:focus-visible>circle:first-of-type]:stroke-white'}
                style={{ transition: 'opacity 200ms' }}
              >
                <circle cx={x} cy={y} r="16" fill="url(#m-glow)" />
                <circle cx={x} cy={y} r="6" fill={v.isDayClub ? '#5E87AC' : '#3D6A96'} stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" />
              </g>
            )
          })}
        </svg>

        {/* Filter chips over the map */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {(['all', 'day', 'night'] as Filter[]).map(f => {
            const active = filter === f
            const label = f === 'all' ? (ALL_LABEL[locale] || ALL_LABEL.en) : f === 'day' ? t.dayClubs : t.nightClubs
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-md outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100 ${
                  active ? 'bg-gold text-white shadow-lg shadow-gold/30' : 'bg-obsidian/70 text-white/55 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Venue list */}
      <div className="flex flex-col gap-2.5 px-4 pt-4">
        {list.map(v => {
          const img = v.whitelogo || v.picture || v.cover
          return (
            <button
              key={v.slug}
              type="button"
              onClick={() => openVenue(v)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-obsidian-card p-3 text-left outline-none transition-all motion-reduce:transition-none hover:border-white/20 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-[0.985] motion-reduce:active:scale-100"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1.5">
                {img ? (
                  <img src={optImg(img, 96)} loading="lazy" alt="" className="max-h-full max-w-full object-contain brightness-0" />
                ) : (
                  <span className="font-display text-base font-black text-obsidian">{v.name.slice(0, 2)}</span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[16px] font-extrabold text-white">{v.name}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-white/45">
                  {v.isDayClub ? <Sun size={12} className="text-gold-soft" /> : <Moon size={12} className="text-gold-soft" />}
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
