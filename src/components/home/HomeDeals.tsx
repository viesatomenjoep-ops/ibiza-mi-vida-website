'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

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
  clubs: { nl: 'Clubs Ibiza', en: 'Ibiza Clubs', de: 'Ibiza Clubs', es: 'Clubs Ibiza', fr: 'Clubs Ibiza' },
  water: { nl: 'Op het water', en: 'On the water', de: 'Auf dem Wasser', es: 'En el agua', fr: "Sur l'eau" },
  land: { nl: 'Op het land', en: 'On land', de: 'An Land', es: 'En tierra', fr: 'Sur terre' },
  boats: { nl: 'Private boats', en: 'Private boats', de: 'Private Boote', es: 'Barcos privados', fr: 'Bateaux privés' },
}
const TICKETS: Record<string, string> = { nl: 'Bekijk', en: 'View', de: 'Ansehen', es: 'Ver', fr: 'Voir' }

function DealTile({ d, locale }: { d: Deal; locale: string }) {
  const inner = (
    <>
      {/* Left half — the event photo (uniform cut for every tile) */}
      <div className="relative h-full w-[55%] shrink-0 bg-neutral-900">
        {d.image ? <img src={d.image} alt={d.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
      </div>
      {/* Right half — smaller red panel: price top-right, info, subtle "View" */}
      <div className="flex w-[45%] flex-col justify-between p-2.5" style={{ backgroundColor: '#E14D68' }}>
        {d.price > 0 ? <span className="self-end rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-black">€{d.price}{d.priceLabel || ''}</span> : <span className="h-4" />}
        <div className="min-w-0">
          <div className="line-clamp-2 font-serif text-[12px] font-black leading-tight text-white">{d.title}</div>
          <div className="mt-0.5 line-clamp-1 text-[9px] font-bold uppercase tracking-wide text-white/80">{d.dateLabel}</div>
        </div>
        <span className="inline-flex items-center gap-1 self-start rounded-full border border-white/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white transition-colors group-hover:bg-white group-hover:text-[#E14D68]">{TICKETS[locale] || TICKETS.en} <ChevronRight size={10} /></span>
      </div>
    </>
  )
  const cls = 'group flex h-28 shrink-0 basis-[47%] snap-start overflow-hidden rounded-2xl border border-black/10 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl sm:h-32 sm:basis-[31%] lg:basis-[23%]'
  if (d.ext) return <a data-tile href={d.ext} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  return <Link data-tile href={d.href || '#'} className={cls}>{inner}</Link>
}

function DealsRow({ items, locale, dir = 1 }: { items: Deal[]; locale: string; dir?: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const pausedUntil = useRef(0)

  // Auto-advance ~2.7s (3× faster). `dir` sets the travel direction per row; loops at the edge.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (dir === -1) el.scrollLeft = el.scrollWidth // start rtl rows at the end
    let iv: any
    // Stagger each row's start so they don't all move in lock-step
    const startDelay = Math.floor(Math.random() * 2200)
    const startTimer = setTimeout(() => {
      iv = setInterval(() => {
        if (Date.now() < pausedUntil.current) return
        const tile = el.querySelector('[data-tile]') as HTMLElement | null
        const step = (tile ? tile.offsetWidth + 16 : el.clientWidth * 0.5) * dir
        if (dir === 1 && el.scrollLeft + el.clientWidth + 6 >= el.scrollWidth) el.scrollTo({ left: 0, behavior: 'smooth' })
        else if (dir === -1 && el.scrollLeft <= 6) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
        else el.scrollBy({ left: step, behavior: 'smooth' })
      }, 2700)
    }, startDelay)
    return () => { clearTimeout(startTimer); clearInterval(iv) }
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
      onPointerDown={onDown}
      onPointerMove={onMove}
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
    <section className="bg-white px-4 py-6 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5">
          <h2 className="font-serif text-xl font-black tracking-tight text-neutral-900">{SECTION_TITLE[locale] || SECTION_TITLE.en}</h2>
          <p className="mt-1 text-sm font-medium text-neutral-500">{SECTION_SUB[locale] || SECTION_SUB.en}</p>
        </div>

        <div className="flex flex-col gap-8">
          {rows.map(({ key, items, dir }) => (
            <div key={key}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="shrink-0 font-serif text-xl font-black tracking-tight text-neutral-900">{CAT_TITLE[key][locale] || CAT_TITLE[key].en}</h3>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <DealsRow items={items} locale={locale} dir={dir} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
