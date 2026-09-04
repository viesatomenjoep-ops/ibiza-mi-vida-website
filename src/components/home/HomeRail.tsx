'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

const PREV: Record<string, string> = {
  nl: 'Vorige', en: 'Previous', de: 'Zurück', es: 'Anterior', fr: 'Précédent',
}
const NEXT: Record<string, string> = {
  nl: 'Volgende', en: 'Next', de: 'Weiter', es: 'Siguiente', fr: 'Suivant',
}

/**
 * Horizontale rail voor de uitgelichte stroken op de homepage.
 *
 * ── Waarom niet gewoon een raster ─────────────────────────────────────────
 * Het raster toonde drie kaarten per rij en dan hield het op. Op een drukke
 * zaterdag staan er zestien clubavonden en tweeënveertig activiteiten op het
 * eiland; je zag er drie, zonder enige aanwijzing dat er meer was. Alles
 * onder elkaar zetten is de andere kant op te ver: dan is de homepage één
 * lange lijst waar de rest van de pagina achter verdwijnt.
 *
 * Eén rij die je naar rechts schuift houdt de sectie even hoog als hij was en
 * geeft toegang tot alles wat er die dag is.
 *
 * ── Waarom dit de pagina niet zwaarder maakt ─────────────────────────────
 * Dat is de kern van de opdracht, dus expliciet:
 *
 *  1. Er staat altijd maar één dag in de DOM. De dagkiezer wisselt het paneel
 *     om; de andere zes dagen bestaan niet als elementen.
 *  2. De kaarten laden hun afbeelding met `loading="lazy"`. Anders dan bij de
 *     3D-ring werkt dat hier wél: dit is een gewone scroller, en de browser
 *     herbeoordeelt bij horizontaal scrollen netjes wat in beeld komt. Van
 *     tweeënveertig kaarten laden er dus drie een plaatje tot je schuift.
 *  3. Het scrollen zelf is native. Geen transform per frame, geen
 *     scroll-hijacking, geen bibliotheek. De enige luisteraar is een passieve
 *     scroll-handler die twee booleans bijhoudt (staan de pijlen aan), en die
 *     schrijft alleen state weg als er echt iets verandert -- anders zou elke
 *     scrollframe een render uitlokken.
 *  4. `scroll-snap-type: x proximity`, niet `mandatory`. Mandatory laat iOS de
 *     verticale scroll opeten zodra je vinger schuin over de rij gaat; dan
 *     loopt de pagina vast bij het langsvegen.
 *
 * De pijlen verschijnen alleen op een muisapparaat en alleen aan de kant waar
 * nog iets te halen valt. Op een telefoon veeg je gewoon.
 */
export function HomeRail({
  children,
  label,
  locale = 'nl',
}: {
  children: ReactNode
  /** Waar deze rij over gaat, voor schermlezers. */
  label: string
  locale?: string
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const [links, setLinks] = useState(false)
  const [rechts, setRechts] = useState(false)

  const meet = useCallback(() => {
    const el = railRef.current
    if (!el) return
    // Marge van 24 en niet van 0. De rij heeft px-4 aan binnenruimte, en
    // scroll-snap legt de eerste kaart tegen die rand aan: in ruststand staat
    // scrollLeft dus op 16, niet op 0. Met een kleinere marge stond de
    // linkerpijl meteen aan terwijl er links niets te halen viel.
    const kanLinks = el.scrollLeft > 24
    const kanRechts = el.scrollLeft + el.clientWidth < el.scrollWidth - 24
    // Alleen schrijven bij een echte verandering: anders is dit een render per
    // scrollframe voor twee booleans die meestal hetzelfde blijven.
    setLinks(prev => (prev === kanLinks ? prev : kanLinks))
    setRechts(prev => (prev === kanRechts ? prev : kanRechts))
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    meet()
    el.addEventListener('scroll', meet, { passive: true })
    window.addEventListener('resize', meet)
    return () => {
      el.removeEventListener('scroll', meet)
      window.removeEventListener('resize', meet)
    }
  }, [meet, children])

  const schuif = (richting: 1 | -1) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: richting * Math.max(280, el.clientWidth * 0.85), behavior: 'smooth' })
  }

  const knop =
    'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white text-neutral-900 shadow-lg transition hover:border-black md:grid'

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={PREV[locale] || PREV.en}
        onClick={() => schuif(-1)}
        className={`${knop} -left-3 ${links ? '' : 'pointer-events-none opacity-0'}`}
      >
        <span aria-hidden>‹</span>
      </button>
      <button
        type="button"
        aria-label={NEXT[locale] || NEXT.en}
        onClick={() => schuif(1)}
        className={`${knop} -right-3 ${rechts ? '' : 'pointer-events-none opacity-0'}`}
      >
        <span aria-hidden>›</span>
      </button>

      {/* Vervagende rand rechts: laat zien dat de rij doorloopt, zonder een
          halve kaart af te snijden om hetzelfde te zeggen. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent transition-opacity ${rechts ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        ref={railRef}
        role="group"
        aria-label={label}
        className="hide-scrollbar -mx-4 flex snap-x snap-proximity gap-4 overflow-x-auto px-4 pb-2"
      >
        {children}
      </div>
    </div>
  )
}
