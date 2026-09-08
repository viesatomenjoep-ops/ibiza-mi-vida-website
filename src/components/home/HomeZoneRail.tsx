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
  kickerColor: string
  /** Radiale gloed over de sectie: positie + kleur op .12–.28 dekking. */
  glow: { x: string; y: string; color: string }
  dark?: boolean
  /** Zones 2–4 overlappen de vorige als een afgeronde sheet; de eerste zone niet. */
  roundedTop?: boolean
  kicker: string
  title: string
  text: string
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

function TagDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
      <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

function PriceTag({ price, locale, size }: { price?: string; locale: string; size: 'lg' | 'sm' }) {
  return (
    <span className="whitespace-nowrap">
      <span className={size === 'lg' ? 'mr-1 text-[11px] text-white/70' : 'mr-1 text-[11px] text-black/60'}>
        {price ? t(L.from, locale) : ''}
      </span>
      <span className={`font-display ${size === 'lg' ? 'text-[26px] font-extrabold leading-none' : 'text-xl font-extrabold leading-none'}`}>
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
  kickerColor,
  glow,
  dark = false,
  roundedTop = false,
  kicker,
  title,
  text,
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
  const items = day?.items || []
  const featured = items[0]
  const rest = items.slice(1)

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

  const textMuted = dark ? 'rgba(255,255,255,.75)' : 'rgba(20,20,20,.7)'
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

      <div className="relative mx-auto max-w-[1180px] px-6">
        {/* Gecentreerd in plaats van "titel links, knop rechts". Die opzet
            werkte prima op een gewone laptop, maar op een breed bureaublad
            (1920px en breder) liet de 1180px-container zoveel lucht over dat
            de titel links bleef hangen en de knop ver rechts kwam te staan —
            het geheel oogde uit balans in plaats van gecentreerd, op elk
            scherm. Nu is het één kolom, in het midden, met een vaste
            leesbreedte: dezelfde vorm op een telefoon en op een ultrabreed
            beeldscherm. */}
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center">
          <div>
            <span className="block font-sans text-[11px] font-extrabold uppercase tracking-[0.26em]" style={{ color: kickerColor }}>
              {kicker}
            </span>
            <h2 className="mt-3.5 font-display text-[clamp(34px,5vw,52px)] font-black leading-[1.02] tracking-[-0.02em]">
              {title}
            </h2>
            <p className="mt-3.5 text-base leading-relaxed" style={{ color: textMuted, textWrap: 'pretty' as any }}>
              {text}
            </p>
          </div>
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full px-[22px] py-3.5 font-sans text-xs font-extrabold uppercase tracking-[0.18em] text-white transition-colors duration-200"
            style={{ background: accent, boxShadow: `0 18px 40px -18px ${accent}cc` }}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff' }}
          >
            {ctaLabel} <span aria-hidden>→</span>
          </a>
        </div>

        {/* justify-center i.p.v. justify-between: de dagkiezer (max 600px) en
            de kleine scrollpijlen ernaast lieten op een breed scherm dezelfde
            lucht vallen als de kop hierboven -- links de knoppen, dan een gat
            tot aan de rand. Nu staat het cluster als geheel in het midden,
            ongeacht hoe breed het scherm is. */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
          <div className="flex min-w-0 flex-col items-center gap-2.5 text-center" style={{ flexBasis: 300, maxWidth: 600 }}>
            {/* Maandlabel met weekpijlen. De kiezer toonde zeven dagen en daar
                hield het op: wie over twee weken op Ibiza is kon hier niet zien
                wat er dan speelt. Terug kan niet verder dan de eerste week --
                de feed bevat geen datums uit het verleden. */}
            {/* Was h-7 met een getypte '‹'/'›' als tekst: 28px en een
                lettertekenpijl die per browser en besturingssysteem anders
                weegt -- op de ene machine een dun streepje, op de andere
                vet en scheef uitgelijnd. Dezelfde Lucide-chevron als de
                scrollpijlen van de kaartrail hiernaast lost beide problemen
                tegelijk op: een SVG-icoon oogt overal identiek, en op
                dezelfde maat (44px) vallen de twee knoppenparen niet meer
                uit elkaar. */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => gaNaarWeek(-1)}
                disabled={week === 0}
                aria-label={t(L.previous, locale)}
                className="grid h-11 w-11 flex-none place-items-center rounded-full border-[1.5px] transition-opacity duration-200 disabled:opacity-30"
                style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' } }}
                onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
              >
                <ChevronLeft size={18} strokeWidth={2.5} aria-hidden />
              </button>
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: captionMuted }}>
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => gaNaarWeek(1)}
                disabled={laadt || !loadWeek}
                aria-label={t(L.next, locale)}
                aria-busy={laadt || undefined}
                className="grid h-11 w-11 flex-none place-items-center rounded-full border-[1.5px] transition-opacity duration-200 disabled:opacity-30"
                style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' } }}
                onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
              >
                {laadt
                  ? <Loader2 size={18} strokeWidth={2.5} className="animate-spin" aria-hidden />
                  : <ChevronRight size={18} strokeWidth={2.5} aria-hidden />}
              </button>
            </div>
            <div className="grid grid-cols-7 gap-[clamp(4px,1.5vw,10px)]">
              {days.map((d, i) => {
                const on = i === selected
                const { day: num, weekday } = dayPickerParts(d.iso, locale)
                return (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => pickDay(i)}
                    aria-pressed={on}
                    className="flex h-16 w-full flex-col items-center justify-center gap-[3px] rounded-2xl border transition-colors duration-200"
                    style={{
                      borderColor: on ? accent : (dark ? 'rgba(255,255,255,.18)' : 'rgba(20,20,20,.1)'),
                      background: on ? accent : (dark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.7)'),
                      color: on ? '#fff' : (dark ? '#fff' : '#141414'),
                      boxShadow: on ? `0 10px 24px -14px ${accent}` : 'none',
                    }}
                  >
                    <span className="font-display text-[clamp(15px,4.2vw,17px)] font-bold leading-[1.1] tracking-[0.01em]">{num}</span>
                    <span className="font-sans text-[clamp(9px,2.6vw,11px)] font-medium uppercase leading-[1.1] tracking-[0.06em] opacity-75">{weekday}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={t(L.previous, locale)}
              onClick={() => scrollByCard(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] transition-colors duration-200"
              style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
            >
              <ChevronLeft size={18} strokeWidth={2.5} aria-hidden />
            </button>
            <button
              type="button"
              aria-label={t(L.next, locale)}
              onClick={() => scrollByCard(1)}
              className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] transition-colors duration-200"
              style={{ borderColor: arrowBorder, background: arrowBg, color: arrowColor }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? '#fff' : '#141414'; e.currentTarget.style.color = dark ? '#141414' : '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = arrowBg; e.currentTarget.style.color = arrowColor }}
            >
              <ChevronRight size={18} strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        data-rail={id}
        className="relative mt-7 flex cursor-grab gap-4 overflow-x-auto pb-6 pt-2 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [overscroll-behavior-x:contain] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: 'max(24px,calc((100vw - 1132px)/2))', paddingRight: 'max(24px,calc((100vw - 1132px)/2))', scrollPaddingLeft: 'max(24px,calc((100vw - 1132px)/2))' }}
      >
        {!featured ? (
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
          <>
            <a
              href={featured.href}
              draggable={false}
              className="group relative flex min-h-[232px] w-[clamp(300px,88vw,560px)] flex-none flex-col justify-end overflow-hidden rounded-[22px] bg-[#141414] p-5 text-white shadow-[0_24px_50px_-24px_rgba(0,0,0,.6)] transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={optImg(featured.image, 720)}
                alt=""
                draggable={false}
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
              />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.05) 25%,rgba(0,0,0,.8) 100%)' }} />
              <span
                className="absolute left-3.5 top-3.5 rounded-full px-3 py-2 font-sans text-xs font-bold leading-none text-white"
                style={{ background: accent }}
              >
                {fmtShortDate(day.iso, locale)}
              </span>
              <span className="absolute right-4 top-[18px] font-sans text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/85">
                {t(L.featured, locale)}
              </span>
              <div className="relative flex flex-col gap-1.5">
                <strong className="font-display text-[clamp(22px,3vw,30px)] font-extrabold leading-[1.08] tracking-[-0.02em]" style={{ textWrap: 'balance' as any }}>
                  {featured.title}
                </strong>
                {(featured.venue || featured.time) && (
                  <span className="text-sm text-white/80">
                    {featured.venue}{featured.venue && featured.time ? ' · ' : ''}{featured.time}
                  </span>
                )}
                <span className="mt-2 flex items-baseline justify-between gap-2">
                  <TagDot color={accent} label={featured.tag} />
                  <PriceTag price={featured.price} locale={locale} size="lg" />
                </span>
              </div>
            </a>

            {rest.map((c, i) => (
              <a
                key={c.href + i}
                href={c.href}
                draggable={false}
                className="group grid w-[clamp(280px,82vw,392px)] flex-none grid-cols-[118px_minmax(0,1fr)] gap-3.5 rounded-[22px] bg-white p-2.5 text-[#141414] shadow-[0_14px_34px_-22px_rgba(0,0,0,.45)] transition-[transform,box-shadow] duration-[350ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] [animation:imvHomeZoneFade_.5s_ease_both] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(0,0,0,.5)]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative h-40 overflow-hidden rounded-[14px] bg-[#141414]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={optImg(c.image, 480)}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full select-none object-cover"
                  />
                  <span className="absolute left-2.5 top-2.5 whitespace-nowrap rounded-full bg-[#141414] px-2.5 py-[7px] font-sans text-xs font-semibold leading-none text-white">
                    {fmtShortDate(day.iso, locale)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-col py-1.5 pr-1.5">
                  <strong className="font-display text-[17px] font-bold leading-[1.2] tracking-[-0.01em]" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>
                    {c.title}
                  </strong>
                  {c.venue && (
                    <span className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-black/60">{c.venue}</span>
                  )}
                  {c.time && (
                    <span className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#141414]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                        <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
                      </svg>
                      {c.time}
                    </span>
                  )}
                  <span className="mt-auto flex items-baseline justify-between gap-2 pt-2.5">
                    <TagDot color={accent} label={c.tag} />
                    <PriceTag price={c.price} locale={locale} size="sm" />
                  </span>
                </div>
              </a>
            ))}
          </>
        )}
      </div>
    </section>
  )
}
