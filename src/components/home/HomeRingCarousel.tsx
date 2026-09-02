'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { FLEET, dossierHref } from '@/data/fleet'
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

type Kind = 'boats' | 'trips' | 'events'

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
  heading: T('Boten, excursies en events', 'Boats, trips and events', 'Boote, Ausflüge und Events', 'Barcos, excursiones y eventos', 'Bateaux, excursions et événements'),
  boats: T('Boten', 'Boats', 'Boote', 'Barcos', 'Bateaux'),
  trips: T('Excursies', 'Trips', 'Ausflüge', 'Excursiones', 'Excursions'),
  events: T('Events', 'Events', 'Events', 'Eventos', 'Événements'),
  from: T('vanaf', 'from', 'ab', 'desde', 'dès'),
  perDay: T('/ dag', '/ day', '/ Tag', '/ día', '/ jour'),
  pause: T('Pauzeer de carrousel', 'Pause the carousel', 'Karussell anhalten', 'Pausar el carrusel', 'Mettre en pause'),
  play: T('Laat de carrousel draaien', 'Play the carousel', 'Karussell abspielen', 'Reproducir el carrusel', 'Lancer le carrousel'),
}
const nf = (n: number, l: string) =>
  n.toLocaleString(({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as L5)[l] || 'en-GB')

/** Zes boten: de twee duurste, twee uit het midden, de twee goedkoopste, om en om. */
/**
 * De ring bevat twee soorten bestemmingen: routes (events, excursies) en één
 * bestand (het bootdossier, een PDF onder /api/dossier). Een <Link> doet
 * client-side navigatie en dat kan een bestand niet — dus dat wordt een gewone
 * <a>. De rest houdt de snelle overgang die next/link geeft.
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
    href: dossierHref(b.slug),
    image: b.image,
    imageSet: b.imageSet,
    kicker: b.marina,
    title: b.name ? `${b.model} ${b.name}` : b.model,
    meta: `${t(L.from, locale)} €${nf(b.price.low, locale)} ${t(L.perDay, locale)}`,
  }))
}

/** Zes unieke excursies uit de dagenlijst van de homepage. */
function tripItems(days: { items: FeedItem[] }[], base: string): RingItem[] {
  const out: RingItem[] = []
  const seen = new Set<string>()
  for (const d of days) {
    for (const it of d.items || []) {
      const slug = it.ct_events?.slug || ''
      const venue = it.ct_venues?.slug || ''
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

function Ring({ items, hidden, id }: { items: RingItem[]; hidden: boolean; id: string }) {
  return (
    <div id={id} className="ring-stage" hidden={hidden}>
      {/* Zijkanten dimmen naar de achtergrondkleur, zoals een ring in een
          etalage: de voorste kaart is scherp, wat wegdraait vervaagt. */}
      <div aria-hidden className="ring-fade ring-fade-l" />
      <div aria-hidden className="ring-fade ring-fade-r" />
      <ul className="ring" style={{ ['--n' as string]: items.length }}>
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
  const alle: { kind: Kind; label: string; items: RingItem[] }[] = [
    { kind: 'boats', label: t(L.boats, locale), items: boatItems(locale, base) },
    { kind: 'trips', label: t(L.trips, locale), items: tripItems(experienceDays, base) },
    { kind: 'events', label: t(L.events, locale), items: eventItems(events, locale) },
  ]
  // Een ring met minder dan drie kaarten is geen ring; die tab valt weg.
  const rings = alle.filter(r => r.items.length >= 3)

  const [active, setActive] = useState<Kind>(rings[0]?.kind ?? 'boats')
  const [paused, setPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const wrap = useRef<HTMLElement>(null)
  const inView = useRef(true)

  // Pauzeren buiten beeld en bij een tabblad op de achtergrond: een ring die
  // niemand ziet hoeft niet te draaien.
  useEffect(() => {
    const el = wrap.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const apply = () => setPaused(document.hidden || !inView.current)
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; apply() }, { threshold: 0.05 })
    io.observe(el)
    document.addEventListener('visibilitychange', apply)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', apply) }
  }, [])

  if (!rings.length) return null

  return (
    <section
      ref={wrap}
      className="ring-section bg-white py-12 text-neutral-900 md:py-16"
      data-paused={paused || userPaused ? '' : undefined}
      aria-label={t(L.heading, locale)}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{t(L.kicker, locale)}</p>
            <h2 className="mt-2 font-serif text-[26px] font-black leading-[1.1] tracking-tight md:text-4xl">{t(L.heading, locale)}</h2>
          </div>
          <div className="flex items-center gap-2" role="tablist" aria-label={t(L.heading, locale)}>
            {rings.map(r => (
              <button
                key={r.kind}
                type="button"
                role="tab"
                aria-selected={active === r.kind}
                aria-controls={`ring-${r.kind}`}
                onClick={() => setActive(r.kind)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ibiza-green focus-visible:ring-offset-2 ${
                  active === r.kind ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {r.label}
              </button>
            ))}
            {/* Pauzeknop: bewegende inhoud die langer dan vijf seconden duurt
                hoort te stoppen te zijn (WCAG 2.2.2), niet alleen via hover. */}
            <button
              type="button"
              onClick={() => setUserPaused(p => !p)}
              aria-pressed={userPaused}
              aria-label={userPaused ? t(L.play, locale) : t(L.pause, locale)}
              className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-700 outline-none transition-colors hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-ibiza-green focus-visible:ring-offset-2"
            >
              {userPaused ? (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 2l7 4-7 4z" fill="currentColor" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" /></svg>
              )}
            </button>
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
