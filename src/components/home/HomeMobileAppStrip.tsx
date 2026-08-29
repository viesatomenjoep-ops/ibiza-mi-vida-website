'use client'

import Link from 'next/link'
import { CalendarDays, Music, Sailboat, ListChecks, MessageCircle, Smartphone } from 'lucide-react'

const L = (nl: string, en: string, de: string, es: string, fr: string): Record<string, string> => ({ nl, en, de, es, fr })

const TITLE = L('Snel naar', 'Quick jump', 'Schnell zu', 'Ir a', 'Accès rapide')

const TILES = [
  { key: 'agenda', icon: CalendarDays, path: '/calendar', label: L('Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda') },
  { key: 'clubs', icon: Music, path: '/clubs', label: L('Clubs', 'Clubs', 'Clubs', 'Clubs', 'Clubs') },
  { key: 'boats', icon: Sailboat, path: '/private-boat-charters', label: L('Boten', 'Boats', 'Boote', 'Barcos', 'Bateaux') },
  { key: 'guestlist', icon: ListChecks, path: '/guestlist', label: L('Guestlist', 'Guestlist', 'Guestlist', 'Guestlist', 'Guestlist') },
  { key: 'concierge', icon: MessageCircle, path: 'https://wa.me/33666528412', label: L('Concierge', 'Concierge', 'Concierge', 'Concierge', 'Concierge'), external: true },
  { key: 'app', icon: Smartphone, path: '/m', label: L('App', 'App', 'App', 'App', 'App') },
] as const

/**
 * Mobile-only quick-jump strip: a row of app-style icon tiles into the
 * most-used sections (or the full /m app), sitting directly under the hero.
 * Desktop keeps the regular browsing flow untouched (hidden via md:hidden).
 *
 * The 3D MapLibre map used to live here too; it was pulled after it proved
 * unreliable on real phones (see Map3D.tsx — WebGL + satellite/terrain tiles
 * is a heavy ask on mobile GPUs, and a map that intermittently fails is worse
 * on a homepage than no map at all). Map3D itself still exists and is used in
 * the /m app's Map tab, where a venue list sits underneath it as a fallback.
 */
export function HomeMobileAppStrip({ locale = 'nl' }: { locale?: string }) {
  const base = `/${locale}`
  const t = (m: Record<string, string>) => m[locale] || m.en

  return (
    <section className="block border-b border-black/5 bg-white px-4 pb-8 pt-6 md:hidden">
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
    </section>
  )
}
