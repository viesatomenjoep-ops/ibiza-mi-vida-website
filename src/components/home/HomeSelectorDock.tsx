'use client'

import Link from 'next/link'
import { Ship, Ticket, Waves, MapPin, Music } from 'lucide-react'

type Tile = {
  key: string
  href: string
  bg: string
  fg: string
  light?: boolean
  glow: string
  Icon: typeof Ship
  label: Record<string, string>
}

// Five equal pillars — brand palette: blue, red, white, green, black.
const TILES: Tile[] = [
  {
    key: 'boats',
    href: '/private-boat-charters',
    bg: '#00A3FF', fg: '#ffffff', glow: 'rgba(0,163,255,.45)',
    Icon: Ship,
    label: { nl: 'Private Boats', en: 'Private Boats', es: 'Private Boats', de: 'Private Boats', fr: 'Private Boats' },
  },
  {
    key: 'clubs',
    href: '/calendar',
    bg: '#E14D68', fg: '#ffffff', glow: 'rgba(225,77,104,.45)',
    Icon: Ticket,
    label: { nl: 'Club Tickets', en: 'Club Tickets', es: 'Club Tickets', de: 'Club Tickets', fr: 'Club Tickets' },
  },
  {
    key: 'water',
    href: '/water-sports',
    bg: '#ffffff', fg: '#0b0b0b', light: true, glow: 'rgba(0,0,0,.18)',
    Icon: Waves,
    label: { nl: 'Op het water', en: 'On the water', es: 'En el agua', de: 'Auf dem Wasser', fr: 'Sur l’eau' },
  },
  {
    key: 'land',
    href: '/activities',
    bg: '#14FF00', fg: '#0b0b0b', glow: 'rgba(20,255,0,.4)',
    Icon: MapPin,
    label: { nl: 'Op het land', en: 'On land', es: 'En tierra', de: 'An Land', fr: 'Sur terre' },
  },
  {
    key: 'artists',
    href: '/artists',
    bg: '#111111', fg: '#ffffff', glow: 'rgba(0,0,0,.5)',
    Icon: Music,
    label: { nl: 'Artiesten', en: 'Artists', es: 'Artistas', de: 'Künstler', fr: 'Artistes' },
  },
]

export function HomeSelectorDock({ base, locale }: { base: string; locale: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-black/10 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.14)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-4xl px-2 pt-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        <div className="grid grid-cols-5 gap-1.5">
          {TILES.map(t => {
            const Icon = t.Icon
            return (
              <Link
                key={t.key}
                href={`${base}${t.href}`}
                className={`hdock-tile group flex h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center ${t.light ? 'hdock-tile--light border border-black/10' : ''}`}
                style={{ backgroundColor: t.bg, color: t.fg, boxShadow: `0 6px 18px -6px ${t.glow}` }}
              >
                <Icon size={18} strokeWidth={2.4} className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="w-full truncate font-serif text-[10px] font-black uppercase leading-tight tracking-tight sm:text-[11px]">
                  {t.label[locale] || t.label.en}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
