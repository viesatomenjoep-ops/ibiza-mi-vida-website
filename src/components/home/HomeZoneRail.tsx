'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { optImg } from '@/lib/img'
import { addDays, dayPickerParts, fmtShortDate, monthOnlyLabel, monthYearLabel } from '@/lib/date-label'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  from: T('Vanaf:', 'From:', 'Ab:', 'Desde:', 'À partir de :'),
  onRequest: T('Op aanvraag', 'On request', 'Auf Anfrage', 'A consultar', 'Sur demande'),
  featured: T('Uitgelicht', 'Featured', 'Empfohlen', 'Destacado', 'À la une'),
  previous: T('Vorige', 'Previous', 'Zurück', 'Anterior', 'Précédent'),
  next: T('Volgende', 'Next', 'Weiter', 'Siguiente', 'Suivant'),
  empty: T(
    'Niets op deze dag — probeer een andere.',
    'Nothing on this day — try another.',
    'An diesem Tag nichts geplant — versuch einen anderen Tag.',
    'Nada este día — prueba con otro.',
    "Rien ce jour-là — essayez un autre jour.",
  ),
}

export interface ZoneCardData {
  href: string
  image: string
  title: string
  venue: string
  /** Alleen tonen als de feed dit echt levert; anders rendert de kaart geen tijdregel. */
  time?: string
  tag: string
  /** Prijs al opgemaakt met valuta, bijv. "€70". Leeg → "Op aanvraag" i.p.v. een verzonnen getal. */
  price?: string
}

export interface ZoneDay {
  /** ISO yyyy-mm-dd */
  iso: string
  items: ZoneCardData[]
}

interface HomeZoneRailProps {
  id: string
  locale?: string
  bg: string
  accent: string
  /**
   * Tekstkleur bovenop `accent` -- knoplabel, actieve dag in de kiezer.
   *
   * Standaard wit, want dat klopte voor alle accenten die de site tot nu toe
   * had. Met het Pantone-palet niet meer: Sun Glare (#D9E64B) heeft een
   * relatieve luminantie van ongeveer 0,77, dus wit erop komt uit rond 1,3:1
   * -- praktisch onleesbaar. Die zone geeft hier Darkest Hour mee.
   */
  accentInk?: string
  kickerColor: string
  /** Radiale gloed over de sectie: positie + kleur op .12–.28 dekking. */
  glow: { x: string; y: string; color: string }
  dark?: boolean
  /** Zones 2–4 overlappen de vorige als een afgeronde sheet; de eerste zone niet. */
  roundedTop?: boolean
  kicker: string
  title: string
  ctaLabel: string
  ctaHref: string
  days: ZoneDay[]
  /**
   * Haalt de zeven dagen op die op `fromISO` beginnen.
   *
   * Zonder deze functie blijft de kiezer bij de week die de server meestuurde;
   * mét kun je vooruit bladeren. De zone levert hem aan in plaats van dat de
   * rail zelf ophaalt, omdat elke wereld zijn eigen vorm heeft: de vloot kent
   * geen agenda, en land en water komen uit dezelfde feed maar worden per event
   * gescheiden. De zone weet dat; de rail hoeft het niet te weten.
   */
  loadWeek?: (fromISO: string) => Promise<ZoneDay[]>
}

/** Sleept met de muis/pen; touch behoudt de eigen momentum + snap van het OS. */
function useDragScroll(ref: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false
    let moved = false
    let startX = 0
    let startLeft = 0
    let pointerId: number | null = null

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      down = true
      moved = false
      startX = e.clientX
      startLeft = el.scrollLeft
      pointerId = e.pointerId
      el.style.cursor = 'grabbing'
      el.style.scrollSnapType = 'none'
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) {
        moved = true
        if (pointerId != null) { try { el.setPointerCapture(pointerId) } catch { /* noop */ } }
      }
      el.scrollLeft = startLeft - dx
    }
    const end = () => {
      if (!down) return
      down = false
      el.style.cursor = 'grab'
      el.style.scrollSnapType = 'x mandatory'
      if (pointerId != null) { try { el.releasePointerCapture(pointerId) } catch { /* noop */ } }
      pointerId = null
    }
    // Een sleep die net een link raakte mag die link niet ook nog volgen.
    const onClickCapture = (e: MouseEvent) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false }
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
    el.addEventListener('pointerleave', end)
    el.addEventListener('click', onClickCapture, true)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
      el.removeEventListener('pointerleave', end)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [ref])
}

/**
 * min-w-0 + truncate op het label: dit staat naast de prijs op één regel, en
 * een lang label ("Privéboot", "Op het water") duwde die prijs anders de kaart
 * uit. Het bolletje zelf mag nooit meekrimpen, vandaar shrink-0 -- een
 * samengeknepen stip leest als een streepje.
 */
function TagDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] font-semibold">
      <span aria-hidden className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      <span className="truncate">{label}</span>
    </span>
  )
}

/**
 * "Vanaf:" boven het bedrag in plaats van ernaast.
 *
 * Naast elkaar was het te breed voor de tekstkolom van een kaart (op de
 * smalste kaart ~132px): met "Privéboot" links en "Vanaf: €1.200" rechts
 * paste het bij 19 van de 27 kaarten niet, waardoor de prijs naar een tweede
 * regel zakte -- bij de andere 8 niet. Dat gaf een rij kaarten die er om en
 * om anders uitzag.
 *
 * Gestapeld is het blok net zo breed als het bedrag zelf, dus past het overal,
 * en zien alle kaarten er hetzelfde uit. shrink-0 omdat de prijs het enige op
 * de kaart is dat niet mag inkorten -- een afgekapte "€1.2…" is erger dan geen
 * prijs. Het label ernaast kort wel in.
 */
function PriceTag({ price, locale, size }: { price?: string; locale: string; size: 'lg' | 'sm' }) {
  return (
    <span className="flex shrink-0 flex-col items-end whitespace-nowrap leading-none">
      {price && (
        <span className={`mb-0.5 text-[10px] ${size === 'lg' ? 'text-white/70' : 'text-black/55'}`}>
          {t(L.from, locale)}
        </span>
      )}
      <span className={`font-display font-extrabold leading-none ${size === 'lg' ? 'text-[26px]' : 'text-[19px]'}`}>
        {price || t(L.onRequest, locale)}
      </span>
    </span>
  )
}

export function HomeZoneRail({
  id,
  locale = 'nl',
  bg,
  accent,
  accentInk = '#fff',
  kickerColor,
  glow,
  dark = false,
  roundedTop = false,
  kicker,
  title,
  ctaLabel,
  ctaHref,
  days: eersteWeek,
  loadWeek,
}: HomeZoneRailProps) {
  /**
   * Alle weken die we tot nu toe hebben, achter elkaar. De server levert de
   * eerste zeven dagen; elke volgende week wordt er bij het doorbladeren
   * achteraan geplakt en blijft daarna staan, zodat heen en weer bladeren geen
   * tweede verzoek kost.
   */
  const [alleDagen, setAlleDagen] = useState<ZoneDay[]>(eersteWeek)
  const [week, setWeek] = useState(0)
  const [laadt, setLaadt] = useState(false)
  const [selected, setSelected] = useState(0)
  const railRef = useRef<HTMLDivElement>(null)
  useDragScroll(railRef)

  const days = alleDagen.slice(week * 7, week * 7 + 7)

  const gaNaarWeek = async (richting: 1 | -1) => {
    const doel = week + richting
    if (doel < 0) return
    const nodig = (doel + 1) * 7
    if (nodig > alleDagen.length) {
      if (!loadWeek || laadt) return
      const start = alleDagen[alleDagen.length - 1]?.iso
      if (!start) return
      setLaadt(true)
      try {
        const erbij = await loadWeek(addDays(start, 1))
        if (!erbij.length) return
        setAlleDagen(d => [...d, ...erbij])
      } catch {
        // Netwerk weg of de route geeft een fout: dan blijft de kiezer gewoon
        // op de week staan waar hij was. Een half geladen week tonen is erger
        // dan niet bladeren.
        return
      } finally {
        setLaadt(false)
      }
    }
    setWeek(doel)
    setSelected(0)
    railRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }

  const day = days[selected] || days[0]
  // Eén lijst, één kaartvorm. `featured`/`rest` stonden hier toen de eerste
  // kaart een ander formaat had dan de rest; dat onderscheid is weg.
  const items = day?.items || []

  const scrollByCard = (dir: 1 | -1) => {
    const el = railRef.current
    if (!el) return
    const card = (el.children[1] || el.firstElementChild) as HTMLElement | null
    const w = card ? card.getBoundingClientRect().width + 16 : 400
    el.scrollBy({ left: dir * w * (el.clientWidth > 900 ? 2 : 1), behavior: 'smooth' })
  }

  const pickDay = (i: number) => {
    setSelected(i)
    railRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }

  const day0 = days[0]?.iso
  const day6 = days[days.length - 1]?.iso
  const monthLabel = day0 && day6
    ? (monthOnlyLabel(day0, locale) === monthOnlyLabel(day6, locale)
      ? monthYearLabel(day0, locale)
      : `${monthOnlyLabel(day0, locale)} – ${monthYearLabel(day6, locale)}`)
    : ''

  const captionMuted = dark ? 'rgba(255,255,255,.55)' : 'rgba(20,20,20,.5)'
  const arrowBorder = dark ? 'rgba(255,255,255,.25)' : 'rgba(20,20,20,.15)'
  const arrowBg = dark ? 'rgba(255,255,255,.08)' : '#fff'
  const arrowColor = dark ? '#fff' : '#141414'

  return (
    <section
      id={id}
      className="scroll-mt-[var(--nav-h)]"
      style={{
        position: 'relative',
        background: bg,
        color: dark ? '#fff' : '#141414',
        padding: '72px 0 88px',
        ...(roundedTop
          ? { borderRadius: '48px 48px 0 0', marginTop: '-48px', boxShadow: `0 -18px 40px -30px rgba(0,0,0,${dark ? '.35' : '.25'})` }
          : {}),
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
          background: `radial-gradient(60% 50% at ${glow.x} ${glow.y}, ${glow.color}, transparent 70%)`,
        }}
      />

      {/* Kop: alleen de categorienaam, zodat het beeld eronder meteen in
          zicht komt. De omschrijvende zin ("Elke clubnacht van het seizoen,
          met live prijzen en line-ups...") stond hier en is eruit: die duwde
          bij alle vier de werelden het beeld een halve schermhoogte naar
          beneden, terwijl de kaarten eronder in een oogopslag laten zien
          waar de sectie over gaat. */}
      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-[720px] text-center">
          <span className="block font-sans text-[11px] font-extrabold uppercase tracking-[0.26em]" style={{ color: kickerColor }}>
            {kicker}
          </span>
          <h2 className="mt-3 font-display text-[clamp(34px,5vw,52px)] font-black leading-[1.02] tracking-[-0.02em]">
            {title}
          </h2>
        </div>
      </div>

      <div
        ref={railRef}
        data-rail={id}
        className="relative mt-7 flex cursor-grab gap-4 overflow-x-auto pb-6 pt-2 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [overscroll-behavior-x:contain] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: 'max(24px,calc((100vw - 1132px)/2))', paddingRight: 'max(24px,calc((100vw - 1132px)/2))', scrollPaddingLeft: 'max(24px,calc((100vw - 1132px)/2))' }}
      >
        {items.length === 0 ? (
          <div
            className="flex min-h-[160px] w-full max-w-[560px] flex-none items-center justify-center rounded-[22px] px-6 text-center text-sm"
            style={{
              background: dark ? 'rgba(255,255,255,.06)' : 'rgba(20,20,20,.05)',
              color: dark ? 'rgba(255,255,255,.7)' : 'rgba(20,20,20,.55)',
            }}
          >
            {t(L.empty, locale)}
          </div>
        ) : (
          /* Eén kaartvorm voor alles, op verzoek: het volle beeld met de tekst
             eroverheen. Er waren er twee -- de eerste kaart groot met beeld en
             overlay, de rest klein met een duimnagel van 118px links en de
             tekst ernaast. Die twee vormen naast elkaar in dezelfde rij lazen
             als twee verschillende soorten aanbod terwijl het gewoon dezelfde
             lijst is. Nu dragen alle kaarten hetzelfde formaat; alleen de
             eerste houdt het label "uitgelicht". */
          items.map((c, i) => (
            <a
              key={c.href + i}
              href={c.href}
              draggable={false}
              className="group relative flex min-h-[232px] w-[clamp(300px,88vw,560px)] flex-none flex-col justify-end overflow-hidden rounded-[22px] bg-[#141414] p-5 text-white shadow-[0_24px_50px_-24px_rgba(0,0,0,.6)] transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] [animation:imvHomeZoneFade_.5s_ease_both] hover:-translate-y-1"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={optImg(c.image, 720)}
                alt=""
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]"
              />
              {/* Het verloop draagt de leesbaarheid van de tekst eronder. Bijna
                  doorzichtig aan de bovenkant zodat het beeld heel blijft, en
                  stevig onderin waar de titel en de prijs staan. */}
              <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.05) 25%,rgba(0,0,0,.8) 100%)' }} />
              <span
                className="absolute left-3.5 top-3.5 rounded-full px-3 py-2 font-sans text-xs font-bold leading-none"
                style={{ background: accent, color: accentInk }}
              >
                {fmtShortDate(day.iso, locale)}
              </span>
              {i === 0 && (
                <span className="absolute right-4 top-[18px] font-sans text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/85">
                  {t(L.featured, locale)}
                </span>
              )}
              <div className="relative flex flex-col gap-1.5">
                <strong className="font-display text-[clamp(22px,3vw,30px)] font-extrabold leading-[1.08] tracking-[-0.02em]" style={{ textWrap: 'balance' as any }}>
                  {c.title}
                </strong>
                {(c.venue || c.time) && (
                  <span className="text-sm text-white/80">
                    {c.venue}{c.venue && c.time ? ' \u00b7 ' : ''}{c.time}
                  </span>
                )}
                <span className="mt-2 flex items-end justify-between gap-2">
                  <TagDot color={accent} label={c.tag} />
                  <PriceTag price={c.price} locale={locale} size="lg" />
                </span>
              </div>
            </a>
          ))
        )}
      </div>

      {/* De rest van de informatie -- dagkiezer, bladerpijlen en de knop naar
          de volledige agenda -- staat ONDER de kaarten. Boven de kaarten
          stond eerst een kop, een zin, een knop, een maandbalk en zeven
          dagknoppen: op een telefoon ruim een schermhoogte voordat je ook
          maar een beeld zag. */}
      <div className="relative mx-auto mt-10 max-w-[1180px] px-6">
        <div className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-5">
          {/* Bladerpijlen van de kaartrail. Stonden naast de dagkiezer; nu
              direct onder de kaarten die ze bedienen, want daar hoort een
              knop die de rij naar links of rechts schuift. */}
          <div className="flex gap-3">
            <button
              type="button"
              aria-label={t(L.previous, locale)}
              onClick={() => scrollByCard(-1)}
              className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] transition-colors duration-200 md:h-14 md:w-14"
              style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} aria-hidden />
            </button>
            <button
              type="button"
              aria-label={t(L.next, locale)}
              onClick={() => scrollByCard(1)}
              className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] transition-colors duration-200 md:h-14 md:w-14"
              style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} aria-hidden />
            </button>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => gaNaarWeek(-1)}
              disabled={week === 0}
              aria-label={t(L.previous, locale)}
              className="grid h-14 w-14 flex-none place-items-center rounded-full border-[1.5px] transition-opacity duration-200 disabled:opacity-30 md:h-16 md:w-16"
              style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' } }}
              onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
            >
              <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} aria-hidden />
            </button>
            {/* Maand en jaar vullend groot: dit is de kop van de kiezer en
                stond op 11px, kleiner dan de dagen eronder. */}
            <span className="font-display text-[clamp(20px,5.5vw,34px)] font-black uppercase tracking-[0.04em]" style={{ color: dark ? '#fff' : '#141414' }}>
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() => gaNaarWeek(1)}
              disabled={laadt || !loadWeek}
              aria-label={t(L.next, locale)}
              aria-busy={laadt || undefined}
              className="grid h-14 w-14 flex-none place-items-center rounded-full border-[1.5px] transition-opacity duration-200 disabled:opacity-30 md:h-16 md:w-16"
              style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' } }}
              onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
            >
              {laadt
                ? <Loader2 className="h-6 w-6 animate-spin md:h-7 md:w-7" strokeWidth={2.5} aria-hidden />
                : <ChevronRight className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} aria-hidden />}
            </button>
          </div>

          {/* Vierkante dagtegels over de volle breedte, ongeveer twee keer zo
              groot als de ovalen die hier stonden. aspect-square houdt ze
              vierkant op elk scherm; de rij vult de kolom, dus op een
              telefoon zijn ze zo breed als een zevende van het scherm en op
              desktop zo breed als een zevende van 860px. */}
          <div className="grid w-full grid-cols-7 gap-1.5 sm:gap-2.5 md:gap-3">
            {days.map((d, i) => {
              const on = i === selected
              const { day: num, weekday } = dayPickerParts(d.iso, locale)
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => pickDay(i)}
                  aria-pressed={on}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-0.5 rounded-2xl border transition-colors duration-200"
                  style={{
                    borderColor: on ? accent : (dark ? 'rgba(255,255,255,.18)' : 'rgba(20,20,20,.1)'),
                    background: on ? accent : (dark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.7)'),
                    color: on ? accentInk : (dark ? '#fff' : '#141414'),
                    boxShadow: on ? `0 10px 24px -14px ${accent}` : 'none',
                  }}
                >
                  <span className="font-display text-[clamp(18px,5.4vw,32px)] font-black leading-none tracking-[0.01em]">{num}</span>
                  <span className="font-sans text-[clamp(9px,2.4vw,13px)] font-semibold uppercase leading-none tracking-[0.06em] opacity-75">{weekday}</span>
                </button>
              )
            })}
          </div>

          <a
            href={ctaHref}
            className="mt-2 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full px-[22px] py-3.5 font-sans text-xs font-extrabold uppercase tracking-[0.18em] transition-colors duration-200"
            style={{ background: accent, color: accentInk, boxShadow: `0 18px 40px -18px ${accent}cc` }}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = accentInk }}
          >
            {ctaLabel} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
