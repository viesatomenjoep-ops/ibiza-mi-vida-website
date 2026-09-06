'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { optImg } from '@/lib/img'

export interface CollageKaart {
  href: string
  image: string
  alt: string
  /** Rechtsonder op de tegel, bijvoorbeeld een vanafprijs. */
  badge?: string
}

/**
 * Vier gelijke fototegels met een gekleurde cirkel in het midden.
 *
 * ── Waarom dit gedeeld is ─────────────────────────────────────────────────
 * Deze vorm draait nu voor twee werelden (de vloot en de wateractiviteiten)
 * en straks mogelijk voor alle vier. Twee keer hetzelfde met de hand
 * opschrijven is twee keer een kans dat ze uit elkaar gaan lopen zodra er
 * iets aan de vorm verandert.
 *
 * ── De carrousel ──────────────────────────────────────────────────────────
 * De tegels tonen een venster van vier op een langere lijst. Elke paar
 * tellen schuift dat venster één op, zodat alles langskomt. Stil bij
 * prefers-reduced-motion, buiten beeld, in een achtergrondtabblad en zolang
 * je hem aanwijst — een animatie die niemand ziet hoeft geen frames te
 * tekenen.
 *
 * ── De cirkel die meeschaalt ──────────────────────────────────────────────
 * Terwijl de sectie door beeld komt groeit de cirkel van 82% naar 100% en
 * weer terug. Dat gebeurt op één transform op één element, uit een
 * rAF-lus die alleen loopt zolang de sectie in beeld is: geen layout per
 * frame, geen scroll-luisteraar die de hele pagina laat haperen. Bij
 * prefers-reduced-motion blijft hij gewoon stil op ware grootte staan.
 */
export function HomeCircleCollage({
  id,
  kaarten,
  titel,
  kicker,
  tekst,
  knop,
  href,
  kleur,
  schaduw,
  className = 'bg-white',
}: {
  id?: string
  kaarten: CollageKaart[]
  titel: string
  kicker: string
  tekst: string
  knop: string
  href: string
  /** Achtergrond van de cirkel — de kleur van deze wereld. */
  kleur: string
  /** Slagschaduw onder de cirkel, in dezelfde kleur. */
  schaduw: string
  className?: string
}) {
  const [start, setStart] = useState(0)
  const wrap = useRef<HTMLElement>(null)
  const cirkel = useRef<HTMLDivElement>(null)
  const inBeeld = useRef(false)
  const stil = useRef(false)

  // Doorschuiven van het venster van vier.
  useEffect(() => {
    if (kaarten.length <= 4) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => {
      if (!document.hidden && inBeeld.current && !stil.current) {
        setStart(s => (s + 1) % kaarten.length)
      }
    }, 3200)
    return () => clearInterval(timer)
  }, [kaarten.length])

  // Zichtbaarheid + de meeschalende cirkel.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const traag = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    const teken = () => {
      const c = cirkel.current
      if (c && inBeeld.current) {
        const r = el.getBoundingClientRect()
        // 0 als de sectie net binnenkomt of net weggaat, 1 als hij midden in
        // beeld staat. Een halve sinus dus: klein, groot, weer klein.
        const midden = r.top + r.height / 2
        const afstand = Math.abs(midden - window.innerHeight / 2)
        const bereik = (window.innerHeight + r.height) / 2
        const nabij = Math.max(0, 1 - afstand / bereik)
        c.style.transform = `scale(${(0.82 + nabij * 0.18).toFixed(3)})`
      }
      raf = requestAnimationFrame(teken)
    }

    // Eén keer meteen rekenen. De waarnemer meldt zich pas bij de volgende
    // frame, en tot dat moment stond de cirkel op ware grootte om daarna
    // ineens naar 0,82 te springen — een zichtbare hik bij het binnenkomen.
    const meetNu = () => {
      const c = cirkel.current
      if (!c) return
      const r = el.getBoundingClientRect()
      const afstand = Math.abs(r.top + r.height / 2 - window.innerHeight / 2)
      const bereik = (window.innerHeight + r.height) / 2
      const nabij = Math.max(0, 1 - afstand / bereik)
      c.style.transform = `scale(${(0.82 + nabij * 0.18).toFixed(3)})`
    }
    meetNu()

    const io = new IntersectionObserver(entries => {
      inBeeld.current = entries.some(e => e.isIntersecting)
      if (inBeeld.current) meetNu()
      if (inBeeld.current && !traag && !raf) raf = requestAnimationFrame(teken)
      if (!inBeeld.current && raf) { cancelAnimationFrame(raf); raf = 0 }
    }, { rootMargin: '200px 0px' })
    io.observe(el)

    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf) }
  }, [])

  if (kaarten.length < 4) return null
  const zichtbaar = [0, 1, 2, 3].map(i => kaarten[(start + i) % kaarten.length])

  return (
    <section
      ref={wrap}
      id={id}
      className={`scroll-mt-[var(--nav-h)] py-12 text-neutral-900 md:py-20 ${className}`}
      onPointerEnter={() => { stil.current = true }}
      onPointerLeave={() => { stil.current = false }}
    >
      <div className="relative mx-auto w-full max-w-4xl px-4">
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {zichtbaar.map((k, i) => (
            <Link
              key={k.href + i}
              href={k.href}
              aria-label={k.alt}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100 shadow-[0_14px_34px_-22px_rgba(0,0,0,.5)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={k.image}
                src={optImg(k.image, 640)}
                alt=""
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="boot-tegel-img h-full w-full object-cover"
              />
              {k.badge && (
                <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                  {k.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            ref={cirkel}
            className="pointer-events-auto flex aspect-square w-[34%] max-w-[168px] flex-col items-center justify-center rounded-full p-3 text-center text-white will-change-transform md:max-w-[200px] md:p-4"
            style={{ background: kleur, boxShadow: `0 20px 48px -20px ${schaduw}` }}
          >
            <h2 className="font-serif text-[13px] font-black leading-[1.15] tracking-tight md:text-base">{titel}</h2>
            <Link
              href={href}
              aria-label={knop}
              className="mt-2 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-neutral-900 transition-transform hover:scale-105 md:mt-2.5 md:px-4 md:py-2 md:text-[10px] md:tracking-widest"
            >
              {knop}
              <ArrowRight size={11} aria-hidden className="hidden md:block" />
            </Link>
          </div>
        </div>

        <div className="mt-5 text-center md:mt-7">
          <p className="text-[10px] font-black uppercase tracking-[0.26em] md:text-[11px]" style={{ color: kleur }}>{kicker}</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">{tekst}</p>
        </div>
      </div>
    </section>
  )
}
