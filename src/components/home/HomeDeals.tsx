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
      <div className="relative bg-neutral-900">
        {d.image ? <img src={d.image} alt={d.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
      </div>
      <div className="relative flex flex-col justify-center gap-1 border-l-2 border-dashed border-white/40 p-3" style={{ backgroundColor: '#E14D68' }}>
        <div className="text-[10px] font-black uppercase tracking-widest text-white/80">{d.dateLabel}</div>
        <div className="line-clamp-2 font-serif text-sm font-black leading-tight text-white">{d.title}</div>
        <div className="line-clamp-1 text-[11px] font-semibold text-white/75">{d.sub}</div>
        {d.price > 0 && <span className="mt-1 w-fit rounded-full bg-white px-2.5 py-0.5 text-sm font-black text-black">€{d.price}{d.priceLabel || ''}</span>}
        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-white">{TICKETS[locale] || TICKETS.en} <ChevronRight size={12} /></span>
      </div>
    </>
  )
  const cls = 'group grid shrink-0 basis-[47%] snap-start grid-cols-2 overflow-hidden rounded-2xl border border-black/10 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl [&>div:first-child]:aspect-square'
  if (d.ext) return <a data-tile href={d.ext} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  return <Link data-tile href={d.href || '#'} className={cls}>{inner}</Link>
}

function DealsRow({ items, locale }: { items: Deal[]; locale: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const pausedUntil = useRef(0)

  // Auto-advance every 8s (loops back to the start), pauses briefly after interaction
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const iv = setInterval(() => {
      if (Date.now() < pausedUntil.current) return
      const tile = el.querySelector('[data-tile]') as HTMLElement | null
      const step = tile ? tile.offsetWidth + 16 : el.clientWidth * 0.5
      if (el.scrollLeft + el.clientWidth + 6 >= el.scrollWidth) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: step, behavior: 'smooth' })
    }, 8000)
    return () => clearInterval(iv)
  }, [items.length])

  const onDown = (e: React.PointerEvent) => { const el = ref.current; if (!el) return; drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }; pausedUntil.current = Date.now() + 12000 }
  const onMove = (e: React.PointerEvent) => { const el = ref.current; if (!el || !drag.current.active) return; const dx = e.clientX - drag.current.startX; if (Math.abs(dx) > 4) drag.current.moved = true; el.scrollLeft = drag.current.startLeft - dx }
  const onUp = () => { drag.current.active = false; setTimeout(() => { drag.current.moved = false }, 0) }
  const onClickCapture = (e: React.MouseEvent) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation() } }

  return (
    <div
      ref={ref}
      className="hide-scrollbar -mx-1 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 active:cursor-grabbing"
      style={{ touchAction: 'pan-x' }}
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
  const rows: { key: keyof DealsData; items: Deal[] }[] = ([
    { key: 'clubs', items: deals.clubs },
    { key: 'water', items: deals.water },
    { key: 'land', items: deals.land },
    { key: 'boats', items: deals.boats },
  ] as const).filter(r => r.items && r.items.length > 0) as any

  if (rows.length === 0) return null

  return (
    <section className="bg-white px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">Ibiza mi vida</div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">{SECTION_TITLE[locale] || SECTION_TITLE.en}</h2>
          <p className="mt-1 text-sm font-medium text-neutral-500">{SECTION_SUB[locale] || SECTION_SUB.en}</p>
        </div>

        <div className="flex flex-col gap-8">
          {rows.map(({ key, items }) => (
            <div key={key}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="shrink-0 font-serif text-xl font-black tracking-tight text-neutral-900">{CAT_TITLE[key][locale] || CAT_TITLE[key].en}</h3>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <DealsRow items={items} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
