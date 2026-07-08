'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, ExternalLink, X } from 'lucide-react'
import { VENUE_SPOTS, IBIZA_ISLAND_PATH } from '@/data/venue-coordinates'

type Venue = { slug: string; name: string; whitelogo?: string; picture?: string }

const TXT: Record<string, { title: string; sub: string; view: string; maps: string }> = {
  nl: { title: 'Clubs op de kaart', sub: 'Tik op een club voor de locatie', view: 'Bekijk club', maps: 'Open in Maps' },
  en: { title: 'Clubs on the map', sub: 'Tap a club to see the location', view: 'View club', maps: 'Open in Maps' },
  es: { title: 'Clubs en el mapa', sub: 'Toca un club para ver la ubicación', view: 'Ver club', maps: 'Abrir en Maps' },
  de: { title: 'Clubs auf der Karte', sub: 'Tippe auf einen Club für den Standort', view: 'Club ansehen', maps: 'In Maps öffnen' },
  fr: { title: 'Clubs sur la carte', sub: 'Touche un club pour voir le lieu', view: 'Voir le club', maps: 'Ouvrir dans Maps' },
}

export function HomeVenueMap({ venues, base, locale = 'nl' }: { venues: Venue[]; base: string; locale?: string }) {
  const T = TXT[locale] || TXT.en
  const bySlug = new Map(venues.map(v => [v.slug, v]))
  const spots = Object.entries(VENUE_SPOTS)
    .map(([slug, s]) => ({ slug, ...s, venue: bySlug.get(slug) }))
    .filter((x): x is typeof x & { venue: Venue } => !!x.venue)

  const [sel, setSel] = useState<string | null>(null)
  const active = spots.find(s => s.slug === sel) || null

  if (spots.length === 0) return null

  return (
    <section className="w-full bg-neutral-100 px-4 pt-6 pb-2">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4 flex flex-col items-center text-center">
          <h2 className="font-serif text-[1.625rem] font-black uppercase leading-none tracking-tight text-neutral-900">{T.title}</h2>
          <p className="mt-1.5 text-sm font-medium text-neutral-500">{T.sub}</p>
        </div>

        {/* Black & white Ibiza map with logo markers */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm" style={{ aspectRatio: '5 / 4' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d={IBIZA_ISLAND_PATH} fill="#E9E7E4" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
          </svg>

          {spots.map(sp => {
            const on = sp.slug === sel
            const logo = sp.venue.whitelogo || sp.venue.picture
            return (
              <button
                key={sp.slug}
                type="button"
                onClick={() => setSel(on ? null : sp.slug)}
                aria-label={sp.venue.name}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
              >
                <span className={`grid h-9 w-9 place-items-center overflow-hidden rounded-full border bg-white shadow-md transition-transform md:h-11 md:w-11 ${on ? 'scale-110 border-transparent ring-2 ring-ibiza-green' : 'border-black/10 group-hover:scale-105'}`}>
                  {logo
                    ? <img src={logo} alt="" className="max-h-5 max-w-[74%] object-contain [filter:grayscale(1)_brightness(0)] md:max-h-6" loading="lazy" />
                    : <span className="text-[9px] font-black text-black">{sp.venue.name.slice(0, 3).toUpperCase()}</span>}
                </span>
              </button>
            )
          })}
        </div>

        {/* Info card — shows the address on click */}
        {active && (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10 bg-neutral-50">
              {(active.venue.whitelogo || active.venue.picture)
                ? <img src={active.venue.whitelogo || active.venue.picture} alt="" className="max-h-7 max-w-[80%] object-contain [filter:grayscale(1)_brightness(0)]" />
                : null}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-serif text-base font-black uppercase tracking-tight text-neutral-900">{active.venue.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                <MapPin size={13} className="shrink-0 text-neutral-400" /> {active.area}, Ibiza
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Link href={`${base}/club-tickets/${active.slug}`} className="rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-white">{T.view}</Link>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.venue.name + ' Ibiza')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-800"
              >
                {T.maps} <ExternalLink size={11} />
              </a>
            </div>
            <button type="button" onClick={() => setSel(null)} aria-label="Close" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
