'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { FLEET } from '@/data/fleet'
import type { PickerEvent } from '@/lib/picker-event'
import { optImg } from '@/lib/img'

/**
 * 3D-ringcarrousel: zes kaarten op een onzichtbare cilinder die traag
 * ronddraait. Elke kaart staat op rotateY(i × 60°) translateZ(r), in een
 * podium met perspective 1300px; de ring draait in 26 s lineair en oneindig.
 * Drie ringen — boten, excursies, events — achter tabs, één tegelijk in beeld.
 *
 * ── Wat dit een verantwoorde animatie maakt ────────────────────────────────
 * De site is eerder vastgelopen op werk-per-frame dat nooit stopt, en een
 * oneindige animatie is precies dat. Daarom:
 *  - de rotatie is puur CSS `transform` op één element (compositor-only,
 *    geen JavaScript per frame, geen layout);
 *  - alleen de actieve ring staat in de DOM als zichtbaar; de andere twee
 *    hebben `hidden` (display:none), en een display:none-element animeert
 *    niet — dus altijd hooguit één ring die draait;
 *  - een IntersectionObserver pauzeert de ring zodra hij uit beeld is, en
 *    `visibilitychange` zodra het tabblad naar de achtergrond gaat;
 *  - hover en focus-within pauzeren, zodat je kunt klikken op wat je ziet;
 *  - bij prefers-reduced-motion is er géén ring: dezelfde zes kaarten liggen
 *    dan als een horizontale scroll-rail (zie globals.css).
 *  - `backface-visibility: hidden`: kaarten die met hun rug naar je staan
 *    worden niet getekend — de helft minder overdraw, en geen gespiegelde
 *    tekst achter de voorste kaarten.
 *
 * ── Inhoud ────────────────────────────────────────────────────────────────
 * Alle drie de ringen staan in de server-HTML (crawlers zonder JS zien
 * achttien kaarten met naam, plaats en link); alleen welke ring zichtbaar is
 * wisselt client-side. Selectie is deterministisch — geen Math.random(),
 * want dat is een hydration-mismatch.
 */

/**
 * De vier groepen uit het hoofdmenu, in dezelfde volgorde.
 *
 * Stond eerder op boats/trips/events — drie namen die nergens anders op de
 * site voorkwamen. Wie het menu opent ziet Events & Tickets, Op het Water,
 * Beleef het Eiland en Insider; dezelfde woorden op dezelfde plek in dezelfde
 * volgorde schelen de bezoeker het werk om twee indelingen te leren.
 */
type Kind = 'events' | 'water' | 'island' | 'insider'

export interface RingItem {
  key: string
  href: string
  image: string
  imageSet?: string
  kicker: string
  title: string
  meta?: string
}

interface FeedItem {
  id: string | number
  name?: string
  prices?: string
  ct_events?: { name?: string; slug?: string; cover?: string; logo?: string }
  ct_venues?: { name?: string; slug?: string; basePath?: string }
}

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en
const L = {
  kicker: T('Ibiza in beeld', 'Ibiza in pictures', 'Ibiza in Bildern', 'Ibiza en imágenes', 'Ibiza en images'),
  heading: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  events: T('Events & Tickets', 'Events & Tickets', 'Events & Tickets', 'Eventos y entradas', 'Événements & billets'),
  water: T('Op het Water', 'On the Water', 'Auf dem Wasser', 'En el agua', 'Sur l’eau'),
  island: T('Beleef het Eiland', 'Experience the Island', 'Die Insel erleben', 'Vive la isla', 'Vivez l’île'),
  insider: T('Insider', 'Insider', 'Insider', 'Insider', 'Insider'),
  allBoats: T('Alle boten', 'All boats', 'Alle Boote', 'Todos los barcos', 'Tous les bateaux'),
  from: T('vanaf', 'from', 'ab', 'desde', 'dès'),
  perDay: T('/ dag', '/ day', '/ Tag', '/ día', '/ jour'),
}
const nf = (n: number, l: string) =>
  n.toLocaleString(({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as L5)[l] || 'en-GB')

/** Zes boten: de twee duurste, twee uit het midden, de twee goedkoopste, om en om. */
/**
 * Alle bestemmingen zijn nu routes binnen de site, geen bestanden meer.
 * De bootkaarten wezen naar /api/dossier — een PDF, dus een doodlopende steeg
 * vanuit een carrousel die bedoeld is om je de site ín te trekken. Ze gaan nu
 * naar de vlootpagina, waar de filters, de live beschikbaarheid en het dossier
 * allemaal staan. De <a>-tak blijft voor het geval er ooit weer een bestand in
 * de ring komt.
 */
function RingLink({ href, children }: { href: string; children: React.ReactNode }) {
  const props = { className: 'ring-link group', draggable: false as const }
  return href.startsWith('/api/')
    ? <a href={href} {...props}>{children}</a>
    : <Link href={href} {...props}>{children}</Link>
}

function boatItems(locale: string, base: string): RingItem[] {
  const opPrijs = [...FLEET].sort((a, b) => b.price.high - a.price.high)
  const mid = Math.floor(opPrijs.length / 2)
  const keuze = [opPrijs[0], opPrijs[opPrijs.length - 1], opPrijs[mid], opPrijs[1], opPrijs[opPrijs.length - 2], opPrijs[mid + 1]].filter(Boolean)
  return keuze.slice(0, 6).map(b => ({
    key: b.slug,
    href: `${base}/private-boat-charters`,
    image: b.image,
    imageSet: b.imageSet,
    kicker: b.marina,
    title: b.name ? `${b.model} ${b.name}` : b.model,
    meta: `${t(L.from, locale)} €${nf(b.price.low, locale)} ${t(L.perDay, locale)}`,
  }))
}

/**
 * Excursies uit de dagenlijst, gesplitst op waar ze horen.
 *
 * De feed bevat boottochten, ferry's naar Formentera én activiteiten op het
 * land door elkaar. In het menu staan die in twee verschillende groepen, dus
 * hier ook: `waterPaths` bepaalt wat op het water hoort, de rest is eiland.
 * Zo levert een klik op "Op het Water" geen buggytour op.
 */
const WATER_PATHS = ['boat-trip', 'boat-party', 'ferry-formentera', 'private-boat-charters', 'shuttle-ferry']

function tripItems(days: { items: FeedItem[] }[], base: string, groep: 'water' | 'island'): RingItem[] {
  const out: RingItem[] = []
  const seen = new Set<string>()
  for (const d of days) {
    for (const it of d.items || []) {
      const slug = it.ct_events?.slug || ''
      const venue = it.ct_venues?.slug || ''
      const path = it.ct_venues?.basePath || 'boat-trip'
      const opWater = WATER_PATHS.includes(path)
      if (groep === 'water' ? !opWater : opWater) continue
      if (!slug || !venue || seen.has(slug)) continue
      const img = it.ct_events?.cover || it.ct_events?.logo || ''
      if (!img) continue
      seen.add(slug)
      out.push({
        key: slug,
        href: `${base}/${it.ct_venues?.basePath || 'boat-trip'}/${venue}/${slug}`,
        image: optImg(img, 640),
        imageSet: `${optImg(img, 384)} 384w, ${optImg(img, 640)} 640w`,
        kicker: it.ct_venues?.name || '',
        title: it.ct_events?.name || it.name || '',
        meta: it.prices || undefined,
      })
      if (out.length === 6) return out
    }
  }
  return out
}

/** Zes unieke clubnachten, in de volgorde van de agenda (eerstvolgende eerst). */
function eventItems(events: PickerEvent[], locale: string): RingItem[] {
  const out: RingItem[] = []
  const seen = new Set<string>()
  for (const e of events) {
    if (!e.image || seen.has(e.eventSlug)) continue
    seen.add(e.eventSlug)
    out.push({
      key: e.eventSlug,
      href: e.href,
      image: optImg(e.image, 640),
      imageSet: `${optImg(e.image, 384)} 384w, ${optImg(e.image, 640)} 640w`,
      kicker: e.clubName,
      title: e.eventName,
      meta: e.price > 0 ? `${t(L.from, locale)} €${nf(e.price, locale)}` : undefined,
    })
    if (out.length === 6) break
  }
  return out
}

/**
 * De ring draait uit JavaScript in plaats van uit een CSS-animatie.
 *
 * ── Waarom die omzetting nodig was ────────────────────────────────────────
 * Een CSS-keyframe kun je niet slepen: hij bepaalt zelf elke frame de
 * transform en overschrijft alles wat jij ertussen zet. Om de ring met muis
 * of vinger te kunnen verdraaien moet de hoek dus in ons beheer zijn.
 *
 * De hoek staat in een ref en wordt per frame rechtstreeks op het element
 * geschreven, niet in state: state zou zestig keer per seconde een render
 * uitlokken voor een waarde die alleen in een transform terechtkomt.
 *
 * ── Altijd draaien ───────────────────────────────────────────────────────
 * Geen pauze bij hover en geen pauzeknop meer. Wat blijft is pauzeren buiten
 * beeld en bij een tabblad op de achtergrond — dat is geen ontwerpkeuze maar
 * zuinigheid: een ring die niemand ziet hoeft geen frames te tekenen. Tijdens
 * het slepen staat de automatische rotatie stil, anders vecht hij met je hand.
 *
 * `prefers-reduced-motion` blijft gerespecteerd: dan wordt het een platte
 * scroll-rail via CSS en laten we de hoek met rust.
 */
function Ring({ items, hidden, id }: { items: RingItem[]; hidden: boolean; id: string }) {
  const ringRef = useRef<HTMLUListElement>(null)
  const hoek = useRef(0)
  const sleep = useRef<{ actief: boolean; startX: number; startHoek: number; bewogen: boolean }>({
    actief: false, startX: 0, startHoek: 0, bewogen: false,
  })

  useEffect(() => {
    const el = ringRef.current
    if (!el || hidden) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let vorige = performance.now()
    const stap = (nu: number) => {
      const dt = Math.min(nu - vorige, 100) // na een tabwissel niet vooruitspringen
      vorige = nu
      if (!sleep.current.actief && !document.hidden) hoek.current += dt * 0.0138 // ~26s per omwenteling
      el.style.transform = `translateZ(calc(var(--ring-r) * -1)) rotateY(${hoek.current}deg)`
      raf = requestAnimationFrame(stap)
    }
    raf = requestAnimationFrame(stap)
    return () => cancelAnimationFrame(raf)
  }, [hidden])

  // Slepen met muis én vinger via pointer events: één implementatie voor
  // allebei. touch-action:pan-y in de CSS laat verticaal scrollen door, zodat
  // de pagina niet vastloopt als je over de ring veegt.
  const omlaag = (e: React.PointerEvent) => {
    sleep.current = { actief: true, startX: e.clientX, startHoek: hoek.current, bewogen: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const beweeg = (e: React.PointerEvent) => {
    if (!sleep.current.actief) return
    const dx = e.clientX - sleep.current.startX
    if (Math.abs(dx) > 4) sleep.current.bewogen = true
    hoek.current = sleep.current.startHoek + dx * 0.35
  }
  const omhoog = (e: React.PointerEvent) => {
    sleep.current.actief = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
  }
  // Een sleep mag geen klik worden: zonder dit opent elke veeg de kaart
  // waarop je toevallig begon.
  const opKlik = (e: React.MouseEvent) => {
    if (sleep.current.bewogen) { e.preventDefault(); e.stopPropagation() }
  }

  return (
    <div
      id={id}
      className="ring-stage"
      hidden={hidden}
      onPointerDown={omlaag}
      onPointerMove={beweeg}
      onPointerUp={omhoog}
      onPointerCancel={omhoog}
      onClickCapture={opKlik}
    >
      {/* Zijkanten dimmen naar de achtergrondkleur, zoals een ring in een
          etalage: de voorste kaart is scherp, wat wegdraait vervaagt. */}
      <div aria-hidden className="ring-fade ring-fade-l" />
      <div aria-hidden className="ring-fade ring-fade-r" />
      <ul ref={ringRef} className="ring" style={{ ['--n' as string]: items.length }}>
        {items.map((it, i) => (
          <li key={it.key} className="ring-card" style={{ ['--i' as string]: i }}>
            <RingLink href={it.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                srcSet={it.imageSet}
                sizes="(max-width: 767px) 156px, 280px"
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="ring-img"
              />
              <span aria-hidden className="ring-shade" />
              <span className="ring-text">
                <span className="ring-kicker">{it.kicker}</span>
                <span className="ring-title">{it.title}</span>
                {it.meta ? <span className="ring-meta">{it.meta}</span> : null}
              </span>
              <span aria-hidden className="ring-arrow">
                <ArrowUpRight size={14} />
              </span>
            </RingLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HomeRingCarousel({
  locale = 'nl',
  base,
  events,
  experienceDays,
}: {
  locale?: string
  base: string
  events: PickerEvent[]
  experienceDays: { date: string; items: FeedItem[] }[]
}) {
  // Vier groepen, zelfde namen en volgorde als het hoofdmenu. "Op het Water"
  // is de vloot plus de boottochten en ferry's; die horen bij elkaar en staan
  // in het menu ook onder één kop.
  const alle: { kind: Kind; label: string; items: RingItem[] }[] = [
    { kind: 'events', label: t(L.events, locale), items: eventItems(events, locale) },
    { kind: 'water', label: t(L.water, locale), items: [...boatItems(locale, base), ...tripItems(experienceDays, base, 'water')].slice(0, 6) },
    { kind: 'island', label: t(L.island, locale), items: tripItems(experienceDays, base, 'island') },
  ]
  // Een ring met minder dan drie kaarten is geen ring; die tab valt weg.
  const rings = alle.filter(r => r.items.length >= 3)

  const [active, setActive] = useState<Kind>(rings[0]?.kind ?? 'events')
  const wrap = useRef<HTMLElement>(null)
  const inView = useRef(true)

  if (!rings.length) return null

  return (
    <section
      ref={wrap}
      className="ring-section bg-white py-12 text-neutral-900 md:py-16"
      aria-label={t(L.heading, locale)}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{t(L.kicker, locale)}</p>
            <h2 className="mt-2 font-serif text-[26px] font-black leading-[1.1] tracking-tight md:text-4xl">{t(L.heading, locale)}</h2>
          </div>
          {/* Horizontaal veegbaar: vier categorieën met menu-namen passen niet
              naast een kop op een telefoon van 390px, en afkappen zou de
              laatste onbereikbaar maken. */}
          <div className="hide-scrollbar -mx-4 flex w-full items-center gap-2 overflow-x-auto px-4 md:mx-0 md:w-auto md:overflow-visible md:px-0" role="tablist" aria-label={t(L.heading, locale)}>
            {rings.map(r => (
              <button
                key={r.kind}
                type="button"
                role="tab"
                aria-selected={active === r.kind}
                aria-controls={`ring-${r.kind}`}
                onClick={() => setActive(r.kind)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ibiza-green focus-visible:ring-offset-2 ${
                  active === r.kind ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        {rings.map(r => (
          <div key={r.kind} role="tabpanel" hidden={active !== r.kind}>
            <Ring id={`ring-${r.kind}`} items={r.items} hidden={active !== r.kind} />
          </div>
        ))}
      </div>
    </section>
  )
}
