'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarDays, Music, Sailboat, ListChecks, MessageCircle, Smartphone } from 'lucide-react'
import { Map3D } from '@/components/map/Map3D'
import type { MapPlace } from '@/data/ibiza-map-clubs'

const L = (nl: string, en: string, de: string, es: string, fr: string): Record<string, string> => ({ nl, en, de, es, fr })

const TITLE = L('Snel naar', 'Quick jump', 'Schnell zu', 'Ir a', 'Accès rapide')
const MAP_TITLE = L('Ontdek Ibiza', 'Discover Ibiza', 'Entdecke Ibiza', 'Descubre Ibiza', 'Découvrez Ibiza')
const TAP_HINT = L('Tik een club aan om te navigeren', 'Tap a club to jump straight there', 'Tippe einen Club an', 'Toca un club para ir directo', 'Touchez un club pour y accéder')

const TILES = [
  { key: 'agenda', icon: CalendarDays, path: '/calendar', label: L('Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda') },
  { key: 'clubs', icon: Music, path: '/clubs', label: L('Clubs', 'Clubs', 'Clubs', 'Clubs', 'Clubs') },
  { key: 'boats', icon: Sailboat, path: '/private-boat-charters', label: L('Boten', 'Boats', 'Boote', 'Barcos', 'Bateaux') },
  { key: 'guestlist', icon: ListChecks, path: '/guestlist', label: L('Guestlist', 'Guestlist', 'Guestlist', 'Guestlist', 'Guestlist') },
  { key: 'concierge', icon: MessageCircle, path: 'https://wa.me/33666528412', label: L('Concierge', 'Concierge', 'Concierge', 'Concierge', 'Concierge'), external: true },
  { key: 'app', icon: Smartphone, path: '/m', label: L('App', 'App', 'App', 'App', 'App') },
] as const

/**
 * Mobile-only hybrid strip: a row of app-style icon tiles (jump straight to
 * the most-used sections, or the full /m app) plus the real 3D map — sitting
 * directly under the hero, above the normal page content. Desktop keeps the
 * regular browsing flow untouched (hidden via md:hidden).
 */
export function HomeMobileAppStrip({ locale = 'nl' }: { locale?: string }) {
  const router = useRouter()
  const base = `/${locale}`
  const t = (m: Record<string, string>) => m[locale] || m.en

  // md:hidden only hides this visually on desktop — the section still mounts
  // in the DOM there. Map3D spins up a full WebGL/MapLibre instance and
  // fetches satellite+terrain tiles, so gate its actual mount on a real
  // viewport check (matching Tailwind's md breakpoint) instead of relying on
  // CSS alone, or desktop visitors would pay that cost for a hidden map.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const onSelectPlace = (place: MapPlace) => {
    if (place.slug) router.push(`${base}/club-tickets/${place.slug}`)
  }

  return (
    <section className="block border-b border-black/5 bg-white px-4 pb-8 pt-6 md:hidden">
      {/* App-style tile grid */}
      <h2 className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-black/40">{t(TITLE)}</h2>
      <div className="grid grid-cols-3 gap-3">
        {TILES.map(({ key, icon: Icon, path, label, ...rest }) => {
          const external = 'external' in rest && rest.external
          const content = (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-app-accent/10 text-app-accent transition-colors group-hover:bg-app-accent group-hover:text-white">
                <Icon size={19} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wide text-black/70">{t(label)}</span>
            </>
          )
          const cls =
            'group flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-black/[0.02] py-4 text-center transition-colors active:scale-95'
          // /m is its own root (not locale-prefixed, see middleware.ts) — every
          // other tile is a normal locale-prefixed site route.
          const href = external ? path : path === '/m' ? path : `${base}${path}`
          return external ? (
            <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
              {content}
            </a>
          ) : (
            <Link key={key} href={href} className={cls}>
              {content}
            </Link>
          )
        })}
      </div>

      {/* 3D map — only actually mounted on a confirmed mobile viewport (see isMobile above) */}
      <div className="mt-7">
        <h2 className="mb-1 font-serif text-xl font-black text-black">{t(MAP_TITLE)}</h2>
        <p className="mb-3 text-[12px] text-black/45">{t(TAP_HINT)}</p>
        {isMobile && <Map3D height="52vh" onSelectPlace={onSelectPlace} locale={locale} />}
      </div>
    </section>
  )
}
