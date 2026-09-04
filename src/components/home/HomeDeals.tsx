'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { optImg } from '@/lib/img'

export interface Deal {
  id: string
  title: string
  sub: string
  image: string
  price: number
  priceLabel?: string   // e.g. "/dag" for boats
  dateLabel: string
  href?: string         // internal route
  ext?: string          // external (ClubTickets affLink)
}

export interface DealsData {
  clubs: Deal[]
  water: Deal[]
  land: Deal[]
  boats: Deal[]
}

const CAT_TITLE: Record<string, Record<string, string>> = {
  clubs: { nl: 'Club Tickets Ibiza', en: 'Club Tickets Ibiza', de: 'Club Tickets Ibiza', es: 'Club Tickets Ibiza', fr: 'Club Tickets Ibiza' },
  water: { nl: 'Op het water', en: 'On the water', de: 'Auf dem Wasser', es: 'En el agua', fr: "Sur l'eau" },
  land: { nl: 'Op het land', en: 'On land', de: 'An Land', es: 'En tierra', fr: 'Sur terre' },
  boats: { nl: 'Private boats', en: 'Private boats', de: 'Private Boote', es: 'Barcos privados', fr: 'Bateaux privés' },
}
// Ticket-stub divider with a small Ibiza Mi Vida logo badge on each side.
function TicketDivider({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`ticket-divider ${light ? 'ticket-divider--light' : ''} ${className}`}>
      <span className="tk-line" />
    </div>
  )
}

// ── Cover-flow tile: a full event photo with name + venue + date at the bottom ──
function DealTile({ d }: { d: Deal }) {
  const inner = (
    <>
      {d.image ? <img src={optImg(d.image, 500)} loading="lazy" alt={d.title} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-neutral-800" />}
      <span className="deal-sweep pointer-events-none absolute inset-0 z-[5]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      {d.price > 0 && <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-ibiza-green px-3.5 py-1 text-sm font-black text-white shadow-lg">€{d.price}{d.priceLabel || ''}</span>}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <div className="line-clamp-2 font-serif text-lg font-black leading-tight text-white drop-shadow">{d.title}</div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          {d.sub ? <span className="line-clamp-1 text-xs font-semibold text-white/85">{d.sub}</span> : <span />}
          <span className="shrink-0 rounded-full bg-ibiza-green px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">{d.dateLabel}</span>
        </div>
      </div>
    </>
  )
  const cls = 'deal-card group relative block shrink-0 basis-[92%] snap-center overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-xl sm:basis-[70%] lg:basis-[35%]'
  // Geen will-change: dat hield élke tegel permanent op een eigen compositorlaag
  // (zie de Reveal-regel in CLAUDE.md). De transform tijdens scrollen promoveert
  // de laag vanzelf zolang hij beweegt.
  const style = { aspectRatio: '3 / 4' }
  if (d.ext) return <a data-tile href={d.ext} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{inner}</a>
  return <Link data-tile href={d.href || '#'} className={cls} style={style}>{inner}</Link>
}

function DealsRow({ items }: { items: Deal[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })

  // Cover-flow — the centre tile is upright & full-size; side tiles shrink, dim
  // and tilt in perspective. Updated on scroll via rAF (no re-renders).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const mid = rect.left + rect.width / 2
      el.querySelectorAll<HTMLElement>('[data-tile]').forEach(t => {
        const tr = t.getBoundingClientRect()
        const d = Math.max(-1.3, Math.min(1.3, (tr.left + tr.width / 2 - mid) / rect.width))
        const ad = Math.abs(d)
        const scale = 1 - Math.min(0.26, ad * 0.42)
        t.style.transform = `perspective(1100px) rotateY(${-d * 26}deg) scale(${scale})`
        t.style.opacity = String(1 - Math.min(0.5, ad * 0.7))
        t.style.zIndex = String(100 - Math.round(ad * 100))
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const t0 = setTimeout(update, 60)
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); clearTimeout(t0); if (raf) cancelAnimationFrame(raf) }
  }, [items.length])

  // Mouse drag (desktop); touch uses native scroll with momentum.
  const onDown = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; const el = ref.current; if (!el) return; drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false } }
  const onMove = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; const el = ref.current; if (!el || !drag.current.active) return; const dx = e.clientX - drag.current.startX; if (Math.abs(dx) > 4) drag.current.moved = true; el.scrollLeft = drag.current.startLeft - dx }
  const onUp = () => { drag.current.active = false; setTimeout(() => { drag.current.moved = false }, 0) }
  const onClickCapture = (e: React.MouseEvent) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation() } }

  return (
    <div
      ref={ref}
      className="hide-scrollbar flex snap-x snap-proximity items-center gap-4 overflow-x-auto px-[5%] pb-4 pt-2 md:cursor-grab md:active:cursor-grabbing"
      style={{ touchAction: 'pan-x pan-y', perspective: '1100px' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
      onClickCapture={onClickCapture}
    >
      {items.map(d => <DealTile key={d.id} d={d} />)}
    </div>
  )
}

export function HomeDeals({ deals, locale = 'nl', onDark = false, slider }: { deals: DealsData; locale: string; onDark?: boolean; slider?: ReactNode }) {
  const rows: { key: keyof DealsData; items: Deal[]; dir: 1 | -1 }[] = ([
    { key: 'clubs', items: deals.clubs, dir: 1 },   // Club Tickets Ibiza
    { key: 'boats', items: deals.boats, dir: -1 },  // Private boats
    { key: 'land', items: deals.land, dir: 1 },     // Op het land
    { key: 'water', items: deals.water, dir: -1 },  // Op het water (bottom)
  ] as const).filter(r => r.items && r.items.length > 0) as any

  if (rows.length === 0) return null

  return (
    <section id="deals" className="scroll-mt-[calc(var(--nav-h)+12px)] px-4 pt-3 pb-8 md:pt-4 md:pb-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Ticket-stub divider at the top of the deals area */}
        <TicketDivider className="mb-6" light={!onDark} />

        {/* Live slider (logos only) */}
        {slider && <div className="mb-10 md:mb-14">{slider}</div>}

        <div className="flex flex-col gap-8">
          {rows.map(({ key, items }, ri) => (
            <Reveal key={key} delay={ri * 120}>
              {/* Ticket-stub divider between the category sections */}
              {ri > 0 && <TicketDivider className="mb-6" light={!onDark} />}
              <div className="mb-3 flex items-center justify-center gap-3">
                <span className={`h-px w-8 ${onDark ? 'bg-white/25' : 'bg-black/15'}`} />
                <h3 className={`shrink-0 text-center font-serif text-3xl font-black tracking-tight ${onDark ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]' : 'text-neutral-900'}`}>{CAT_TITLE[key][locale] || CAT_TITLE[key].en}</h3>
                <span className={`h-px w-8 ${onDark ? 'bg-white/25' : 'bg-black/15'}`} />
              </div>
              <DealsRow items={items} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
