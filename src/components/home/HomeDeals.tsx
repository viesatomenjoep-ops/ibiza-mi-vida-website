'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

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

const SECTION_TITLE: Record<string, string> = {
  nl: 'Deals of the Day', en: 'Deals of the Day', de: 'Deals of the Day', es: 'Deals of the Day', fr: 'Deals of the Day',
}
const SECTION_SUB: Record<string, string> = {
  nl: 'De beste deals van vandaag — sleep of wacht, ze wisselen vanzelf.',
  en: "Today's best deals — swipe, or wait and they rotate.",
  de: 'Die besten Deals von heute — wische oder warte, sie wechseln von selbst.',
  es: 'Las mejores ofertas de hoy — desliza o espera, van rotando.',
  fr: "Les meilleures offres du jour — glisse, ou attends, elles défilent.",
}
const CAT_TITLE: Record<string, Record<string, string>> = {
  clubs: { nl: 'Club Tickets Ibiza', en: 'Club Tickets Ibiza', de: 'Club Tickets Ibiza', es: 'Club Tickets Ibiza', fr: 'Club Tickets Ibiza' },
  water: { nl: 'Op het water', en: 'On the water', de: 'Auf dem Wasser', es: 'En el agua', fr: "Sur l'eau" },
  land: { nl: 'Op het land', en: 'On land', de: 'An Land', es: 'En tierra', fr: 'Sur terre' },
  boats: { nl: 'Private boats', en: 'Private boats', de: 'Private Boote', es: 'Barcos privados', fr: 'Bateaux privés' },
}
const TICKETS: Record<string, string> = { nl: 'Bekijk', en: 'View', de: 'Ansehen', es: 'Ver', fr: 'Voir' }

function DealTile({ d, locale }: { d: Deal; locale: string }) {
  const inner = (
    <>
      {/* Full image, shown in its entirety on a dark stage */}
      <div className="relative w-full overflow-hidden bg-neutral-950" style={{ aspectRatio: '4 / 3' }}>
        {d.image ? <img src={d.image} alt={d.title} className="absolute inset-0 h-full w-full object-contain" /> : null}
        {d.price > 0 && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-black text-black shadow-lg">€{d.price}{d.priceLabel || ''}</span>}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white backdrop-blur-sm transition-colors group-hover:bg-ibiza-green group-hover:text-black">{TICKETS[locale] || TICKETS.en} <ChevronRight size={13} /></span>
      </div>
      {/* Red info panel — event name + venue + date */}
      <div className="flex flex-col gap-1.5 px-4 py-3.5" style={{ backgroundColor: '#E14D68' }}>
        <div className="line-clamp-2 font-serif text-base font-black leading-tight text-white md:text-lg">{d.title}</div>
        <div className="flex items-center justify-between gap-3">
          {d.sub ? <span className="line-clamp-1 text-xs font-semibold text-white/85">{d.sub}</span> : <span />}
          <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-white">{d.dateLabel}</span>
        </div>
      </div>
    </>
  )
  const cls = 'group flex flex-col shrink-0 basis-[86%] snap-center overflow-hidden rounded-3xl border border-black/10 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl sm:basis-[58%] lg:basis-[42%]'
  if (d.ext) return <a data-tile href={d.ext} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  return <Link data-tile href={d.href || '#'} className={cls}>{inner}</Link>
}

function DealsRow({ items, locale, dir = 1 }: { items: Deal[]; locale: string; dir?: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const pausedUntil = useRef(0)
  const lastVibe = useRef(0)
  const buzz = () => { const n = Date.now(); if (n - lastVibe.current > 80) { lastVibe.current = n; try { (navigator as any).vibrate?.(5) } catch {} } }

  // Manual only — the rows no longer auto-scroll. `dir` just sets the initial
  // resting position so right-to-left rows start at their far end.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (dir === -1) el.scrollLeft = el.scrollWidth
  }, [items.length, dir])

  // Mouse only — on touch we let the browser handle it (horizontal swipe scrolls the
  // strip, vertical swipe scrolls the PAGE), so a thumb on a tile never traps the scroll.
  const onDown = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; const el = ref.current; if (!el) return; drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }; pausedUntil.current = Date.now() + 12000 }
  const onMove = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; const el = ref.current; if (!el || !drag.current.active) return; const dx = e.clientX - drag.current.startX; if (Math.abs(dx) > 4) drag.current.moved = true; el.scrollLeft = drag.current.startLeft - dx }
  const onUp = () => { drag.current.active = false; setTimeout(() => { drag.current.moved = false }, 0) }
  const onClickCapture = (e: React.MouseEvent) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation() } }

  return (
    <div
      ref={ref}
      className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 md:cursor-grab md:active:cursor-grabbing"
      style={{ touchAction: 'pan-x pan-y' }}
      onTouchMove={buzz}
      onPointerDown={onDown}
      onPointerMove={(e) => { onMove(e); if (drag.current.moved) buzz() }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
      onClickCapture={onClickCapture}
    >
      {items.map(d => <DealTile key={d.id} d={d} locale={locale} />)}
    </div>
  )
}

export function HomeDeals({ deals, locale = 'nl' }: { deals: DealsData; locale: string }) {
  const rows: { key: keyof DealsData; items: Deal[]; dir: 1 | -1 }[] = ([
    { key: 'clubs', items: deals.clubs, dir: 1 },   // left → right
    { key: 'water', items: deals.water, dir: -1 },  // right → left
    { key: 'land', items: deals.land, dir: 1 },     // left → right
    { key: 'boats', items: deals.boats, dir: -1 },  // right → left
  ] as const).filter(r => r.items && r.items.length > 0) as any

  if (rows.length === 0) return null

  return (
    <section id="deals" className="scroll-mt-24 bg-white px-4 py-6 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex flex-col items-center text-center">
          <h2 className="font-serif text-[1.625rem] font-black leading-none tracking-tight text-neutral-900">{SECTION_TITLE[locale] || SECTION_TITLE.en}</h2>
          <p className="mt-1.5 max-w-md text-sm font-medium text-neutral-500">{SECTION_SUB[locale] || SECTION_SUB.en}</p>
        </div>

        <div className="flex flex-col gap-8">
          {rows.map(({ key, items, dir }, ri) => (
            <Reveal key={key} delay={ri * 120}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="shrink-0 font-serif text-xl font-black tracking-tight text-neutral-900">{CAT_TITLE[key][locale] || CAT_TITLE[key].en}</h3>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <DealsRow items={items} locale={locale} dir={dir} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
