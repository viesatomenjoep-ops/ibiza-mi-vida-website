'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PickerEvent } from '@/lib/picker-event'
import { optImg } from '@/lib/img'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('Events & Tickets', 'Events & Tickets', 'Events & Tickets', 'Eventos y entradas', 'Événements & billets'),
  tekst: T(
    'Elke clubnacht van het seizoen, met live prijzen en line-ups. Kies je avond en reken direct af via ClubTickets.',
    'Every club night of the season, with live prices and line-ups. Pick your night and check out via ClubTickets.',
    'Jede Clubnacht der Saison, mit Live-Preisen und Line-ups. Wähl deinen Abend und buche direkt über ClubTickets.',
    'Cada noche de club de la temporada, con precios y line-ups en vivo. Elige tu noche y reserva vía ClubTickets.',
    'Chaque soirée club de la saison, avec prix et line-ups en direct. Choisissez votre soirée et réservez via ClubTickets.',
  ),
  knop: T('Bekijk alles', 'See everything', 'Alles ansehen', 'Ver todo', 'Tout voir'),
}

/**
 * Sectie 01: Events & Tickets — de eerste van de vier werelden.
 *
 * De rode heroknop landt hier. Vormtaal is die van de categoriewaaier die er
 * al stond (beeld links, kicker, spooknummer, titel, zwarte pilknop), zodat
 * dit blok er meteen bij hoort; de andere drie werelden volgen in dezelfde
 * taal, één per ontwerpstap.
 *
 * Het beeld is geen stockfoto maar de flyers van de eerstvolgende avonden uit
 * de feed — drie kaarten in een waaier. Daardoor is de sectie nooit
 * verouderd: de agenda schuift, de waaier schuift mee.
 *
 * Mobiel eerst: onder de md-grens staat het beeld boven de tekst, de waaier
 * is dan een strook van drie naast elkaar zodat er geen scherm vol wit valt.
 */
export function HomeEventsTickets({
  events,
  locale = 'nl',
  base,
}: {
  events: PickerEvent[]
  locale?: string
  base: string
}) {
  // Drie unieke flyers van de eerstvolgende avonden.
  const flyers: PickerEvent[] = []
  const gezien = new Set<string>()
  for (const e of events) {
    if (!e.image || gezien.has(e.eventSlug)) continue
    gezien.add(e.eventSlug)
    flyers.push(e)
    if (flyers.length === 3) break
  }
  if (flyers.length === 0) return null

  return (
    <section id="zone-events" className="scroll-mt-[var(--nav-h)] bg-neutral-50 py-12 text-neutral-900 md:py-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-16">
        {/* Waaier van echte flyers. De middelste vooraan en recht, de buren
            iets gedraaid eronder — dezelfde taal als de categoriewaaier. */}
        <div className="relative mx-auto flex h-56 w-full max-w-md items-center justify-center sm:h-72 md:h-96">
          {flyers.map((e, i) => {
            const stand = [
              'z-10 rotate-0 scale-100',
              '-rotate-6 -translate-x-[38%] scale-90',
              'rotate-6 translate-x-[38%] scale-90',
            ][i]
            return (
              <Link
                key={e.eventSlug}
                href={e.href}
                aria-label={e.eventName}
                className={`absolute aspect-[4/5] h-full overflow-hidden rounded-3xl shadow-[0_16px_40px_-20px_rgba(0,0,0,.45)] transition-transform duration-300 hover:z-20 hover:scale-105 ${stand}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optImg(e.image, 480)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </Link>
            )
          })}
        </div>

        {/* Tekstzijde */}
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ibiza-green">{t(L.kicker, locale)}</p>
          <div className="mt-2 flex items-baseline justify-center gap-3 md:justify-start md:gap-4">
            <span className="font-serif text-4xl font-black text-black/10 md:text-6xl">01</span>
            <h2 className="font-serif text-2xl font-black tracking-tight text-neutral-900 md:text-4xl">
              {t(L.titel, locale)}
            </h2>
          </div>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600 md:mx-0 md:mt-4 md:text-lg">
            {t(L.tekst, locale)}
          </p>
          <Link
            href={`${base}/calendar`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-serif text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-ibiza-green md:mt-7 md:px-7 md:py-3.5 md:text-xs"
          >
            {t(L.knop, locale)}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
