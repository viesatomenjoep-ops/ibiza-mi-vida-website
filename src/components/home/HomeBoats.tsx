'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FLEET } from '@/data/fleet'
import { optImg } from '@/lib/img'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('Private Boat Rental', 'Private Boat Rental', 'Private Boat Rental', 'Private Boat Rental', 'Private Boat Rental'),
  tekst: T(
    '94 boten met live beschikbaarheid — van dagboot tot superjacht.',
    '94 boats with live availability — from day boat to superyacht.',
    '94 Boote mit Live-Verfügbarkeit — vom Tagesboot bis zur Superyacht.',
    '94 barcos con disponibilidad en vivo — de lancha a superyate.',
    '94 bateaux avec disponibilité en direct — du day-boat au superyacht.',
  ),
  knop: T('Bekijk de vloot', 'See the fleet', 'Flotte ansehen', 'Ver la flota', 'Voir la flotte'),
}

/**
 * Wereld 02 — Private Boat Rental, als collage met een cirkel in het midden.
 *
 * ── De testopzet ──────────────────────────────────────────────────────────
 * Dit is de proefronde voor een nieuwe sectievorm: vier gelijke fototegels in
 * een licht verspringend raster, met in het midden een cirkel in het groen
 * van deze wereld waarin kicker, titel en knop staan. Bevalt het, dan krijgen
 * de andere werelden dezelfde vorm.
 *
 * ── De carrousel ──────────────────────────────────────────────────────────
 * De tegels tonen boten uit de eigen vloot, gesorteerd van goedkoop naar
 * duur. Elke paar tellen schuift het venster één boot op, zodat alle vier de
 * tegels doordraaien — van de sloep van 680 tot het superjacht. Elke tegel is
 * een link naar de vlootpagina.
 *
 * Dezelfde zuinigheidsregels als elke bewegende sectie hier: hij staat stil
 * bij prefers-reduced-motion, buiten beeld, in een achtergrondtabblad en
 * zolang je hem aanwijst. De hoek van de vier posities staat vast; alleen
 * welke foto waar staat wisselt, dus er is geen laag-voor-laag herberekening.
 */
export function HomeBoats({ locale = 'nl', base }: { locale?: string; base: string }) {
  // Goedkoop → duur, alleen boten met beeld. Twaalf stuks is genoeg om te
  // blijven draaien zonder dat het rondje ooit twee keer dezelfde toont.
  const boten = [...FLEET]
    .filter(b => b.image && b.price?.low)
    .sort((a, b) => a.price.low - b.price.low)
    .filter((b, i, a) => a.findIndex(x => x.image === b.image) === i)
    .slice(0, 12)

  const [start, setStart] = useState(0)
  const [stil, setStil] = useState(false)
  const wrap = useRef<HTMLElement>(null)
  const inBeeld = useRef(true)
  // Hover pauzeert; via een ref zodat de interval niet herstart bij elke
  // muisbeweging.
  const stilRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const el = wrap.current
    let io: IntersectionObserver | undefined
    if (el && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(es => { inBeeld.current = es.some(e => e.isIntersecting) })
      io.observe(el)
    }
    const timer = setInterval(() => {
      if (!document.hidden && inBeeld.current && !stilRef.current) setStart(s => (s + 1) % boten.length)
    }, 3200)
    return () => { clearInterval(timer); io?.disconnect() }
  }, [boten.length])

  useEffect(() => { stilRef.current = stil }, [stil])

  if (boten.length < 4) return null
  const zichtbaar = [0, 1, 2, 3].map(i => boten[(start + i) % boten.length])

  // Vier gelijke tegels, licht verspringend — de collagevorm uit het
  // voorbeeld, zonder dat er ooit een tegel groter is dan een andere.
  const versprong = ['mt-6', 'mb-6', 'mb-6', 'mt-6']

  return (
    <section
      ref={wrap}
      id="zone-water"
      className="scroll-mt-[var(--nav-h)] bg-white py-12 text-neutral-900 md:py-20"
      onPointerEnter={() => setStil(true)}
      onPointerLeave={() => setStil(false)}
    >
      <div className="relative mx-auto w-full max-w-4xl px-4">
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {zichtbaar.map((b, i) => (
            <Link
              key={b.slug}
              href={`${base}/private-boat-charters`}
              aria-label={b.name ? `${b.model} ${b.name}` : b.model}
              className={`boot-tegel relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100 shadow-[0_14px_34px_-22px_rgba(0,0,0,.5)] ${versprong[i]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={b.image}
                src={optImg(b.image, 640)}
                alt=""
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="boot-tegel-img h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                €{b.price.low.toLocaleString('nl-NL')}
              </span>
            </Link>
          ))}
        </div>

        {/* De cirkel: het groen van deze wereld, met alles wat de bezoeker
            moet weten. Boven de tegels, altijd exact in het midden. */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="pointer-events-auto flex aspect-square w-[62%] max-w-[300px] flex-col items-center justify-center rounded-full bg-[#0E7C66] p-6 text-center text-white shadow-[0_24px_60px_-24px_rgba(14,124,102,.75)] sm:w-[52%] md:p-8">
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/70 md:text-[10px]">{t(L.kicker, locale)}</p>
            <h2 className="mt-1 font-serif text-lg font-black leading-tight tracking-tight md:text-2xl">
              {t(L.titel, locale)}
            </h2>
            <p className="mt-1.5 hidden text-[12px] leading-snug text-white/85 sm:block md:text-sm">{t(L.tekst, locale)}</p>
            <Link
              href={`${base}/private-boat-charters`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-900 transition-transform hover:scale-105 md:mt-4 md:px-5 md:py-2.5 md:text-[11px]"
            >
              {t(L.knop, locale)}
              <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
