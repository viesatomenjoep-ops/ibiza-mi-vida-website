'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { optImg } from '@/lib/img'

export interface WereldKaart {
  /** Waar deze kaart heen gaat. */
  href: string
  /** Afbeelding uit de feed — nooit stock. */
  image: string
  /** Voorleesnaam. */
  alt: string
}

/**
 * Eén van de vier werelden, als sectie op de homepage.
 *
 * ── Waarom dit een gedeeld component is ───────────────────────────────────
 * De vier werelden krijgen elk zo'n blok en ze moeten er identiek uitzien:
 * hetzelfde beeldformaat, dezelfde afstanden, dezelfde knop. Twee keer
 * hetzelfde met de hand opschrijven is twee keer een kans dat ze uit elkaar
 * gaan lopen zodra er iets verandert.
 *
 * ── Het beeld ─────────────────────────────────────────────────────────────
 * Een waaier van drie kaarten uit de feed: de middelste vooraan en recht, de
 * buren gedraaid erachter. Geen stockfoto's — wat er staat is wat er te koop
 * is, en het schuift vanzelf mee met de agenda. Elke kaart is zelf een link.
 *
 * ── Mobiel ────────────────────────────────────────────────────────────────
 * Onder de md-grens staat de waaier boven de tekst en is alles gecentreerd;
 * daarboven twee kolommen met de tekst links uitgelijnd. De waaier is
 * absoluut gepositioneerd in een vak met vaste hoogte, zodat de gedraaide
 * buren nooit de sectie eronder in duwen.
 */
export function HomeWorld({
  nummer,
  kicker,
  titel,
  tekst,
  knop,
  href,
  kaarten,
  id,
  className = 'bg-neutral-50',
}: {
  nummer: string
  kicker: string
  titel: string
  tekst: string
  knop: string
  href: string
  kaarten: WereldKaart[]
  id?: string
  className?: string
}) {
  if (kaarten.length === 0) return null

  return (
    <section id={id} className={`scroll-mt-[var(--nav-h)] py-12 text-neutral-900 md:py-20 ${className}`}>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto flex h-56 w-full max-w-md items-center justify-center sm:h-72 md:h-96">
          {kaarten.slice(0, 3).map((k, i) => {
            const stand = [
              'z-10 rotate-0 scale-100',
              '-rotate-6 -translate-x-[38%] scale-90',
              'rotate-6 translate-x-[38%] scale-90',
            ][i]
            return (
              <Link
                key={k.href + i}
                href={k.href}
                aria-label={k.alt}
                className={`absolute aspect-[4/5] h-full overflow-hidden rounded-3xl shadow-[0_16px_40px_-20px_rgba(0,0,0,.45)] transition-transform duration-300 hover:z-20 hover:scale-105 ${stand}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optImg(k.image, 480)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </Link>
            )
          })}
        </div>

        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ibiza-green">{kicker}</p>
          <div className="mt-2 flex items-baseline justify-center gap-3 md:justify-start md:gap-4">
            <span className="font-serif text-4xl font-black text-black/10 md:text-6xl">{nummer}</span>
            <h2 className="font-serif text-2xl font-black tracking-tight text-neutral-900 md:text-4xl">{titel}</h2>
          </div>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600 md:mx-0 md:mt-4 md:text-lg">
            {tekst}
          </p>
          <Link
            href={href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-serif text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-ibiza-green md:mt-7 md:px-7 md:py-3.5 md:text-xs"
          >
            {knop}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
