'use client'

import Link from 'next/link'
import { AgendaIcon, ClubsIcon, BoatsIcon, DealsIcon, AppIcon } from '@/components/ui/icons/QuickJumpIcons'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

const L = (nl: string, en: string, de: string, es: string, fr: string): Record<string, string> => ({ nl, en, de, es, fr })

const TITLE = L('Snel naar', 'Quick jump', 'Schnell zu', 'Ir a', 'Accès rapide')

// `size` is set per tile rather than globally: WhatsApp's mark is solid where
// the rest of the set is stroked, and a solid glyph reads optically larger at
// the same box. Dropping it 4px lines its weight up with its neighbours.
const TILES = [
  { key: 'agenda', icon: AgendaIcon, size: 26, path: '/calendar', label: L('Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda') },
  { key: 'clubs', icon: ClubsIcon, size: 26, path: '/clubs', label: L('Clubs', 'Clubs', 'Clubs', 'Clubs', 'Clubs') },
  { key: 'boats', icon: BoatsIcon, size: 26, path: '/private-boat-charters', label: L('Boten', 'Boats', 'Boote', 'Barcos', 'Bateaux') },
  { key: 'guestlist', icon: DealsIcon, size: 26, path: '/guestlist', label: L('Package Deals', 'Package Deals', 'Package Deals', 'Package Deals', 'Package Deals') },
  { key: 'concierge', icon: WhatsAppIcon, size: 22, path: 'https://wa.me/33666528412', label: L('Concierge', 'Concierge', 'Concierge', 'Concierge', 'Concierge'), external: true },
  { key: 'app', icon: AppIcon, size: 26, path: '/m', label: L('App', 'App', 'App', 'App', 'App') },
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
        {TILES.map(({ key, icon: Icon, size, path, label, ...rest }) => {
          const external = 'external' in rest && rest.external
          const content = (
            <>
              {/* No tinted chip behind the glyph. Six identical filled squares
                  competed with each other and added nothing a user could act
                  on; the tile itself is already the tap target. Letting the
                  icon sit directly on the card gives it room to be legible. */}
              <span className="grid h-8 place-items-center text-app-accent transition-colors group-active:text-app-accent-soft">
                <Icon size={size} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wide text-black/70">{t(label)}</span>
            </>
          )
          const cls =
            'group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-black/[0.06] bg-black/[0.02] py-4 text-center transition-colors active:scale-95'
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
