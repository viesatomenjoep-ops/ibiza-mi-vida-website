'use client'

import React from 'react'
import Image from 'next/image'
import {
  Calendar, MapPin, ExternalLink, Ticket, CheckCircle2, Lock, Clock, Music, Info,
  Sparkles, Navigation, AlertCircle, Utensils, Anchor, Waves, Check,
} from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import type { CTEventDate, CTEvent } from '@/lib/clubtickets'
import { stripHtml } from '@/lib/html-utils'
import { parseCTDescription } from '@/lib/ct-description'
import { VenueLocationMap } from '@/components/ui/VenueLocationMap'

interface Props {
  selectedDateObj: CTEventDate
  allEventDates: CTEventDate[]
  fullEvent?: CTEvent
  locale: string
}

// ── i18n for the section labels ───────────────────────────────────────────────
const SEC_I18N: Record<string, {
  lineup: string; times: string; about: string; important: string;
  doors: string; closes: string; itinerary: string; book: string;
  standard: string; standardNote: string; bookOn: string; secure: string;
  instant: string; official: string; noFees: string;
}> = {
  en: { lineup: 'Line-up', times: 'Times', about: 'About this event', important: 'Important information', doors: 'Doors open', closes: 'Closes', itinerary: 'Itinerary', book: 'Book your ticket', standard: 'Standard entry', standardNote: 'Official general admission', bookOn: 'Checkout', secure: 'Secure payment via ClubTickets', instant: 'Instant ticket delivery', official: 'Official partner guarantee', noFees: 'No hidden booking fees' },
  nl: { lineup: 'Line-up', times: 'Tijden', about: 'Over dit event', important: 'Belangrijke informatie', doors: 'Deuren open', closes: 'Sluit', itinerary: 'Routebeschrijving', book: 'Boek je ticket', standard: 'Standaard toegang', standardNote: 'Officiële algemene toegang', bookOn: 'Afrekenen', secure: 'Veilig betalen via ClubTickets', instant: 'Directe ticketlevering', official: 'Officiële partnergarantie', noFees: 'Geen verborgen kosten' },
  de: { lineup: 'Line-up', times: 'Zeiten', about: 'Über dieses Event', important: 'Wichtige Informationen', doors: 'Einlass', closes: 'Ende', itinerary: 'Routenverlauf', book: 'Ticket buchen', standard: 'Standard-Eintritt', standardNote: 'Offizieller allgemeiner Eintritt', bookOn: 'Zur Kasse', secure: 'Sichere Zahlung über ClubTickets', instant: 'Sofortige Ticketzustellung', official: 'Offizielle Partnergarantie', noFees: 'Keine versteckten Gebühren' },
  es: { lineup: 'Line-up', times: 'Horarios', about: 'Sobre este evento', important: 'Información importante', doors: 'Apertura', closes: 'Cierre', itinerary: 'Itinerario', book: 'Reserva tu entrada', standard: 'Entrada estándar', standardNote: 'Admisión general oficial', bookOn: 'Finalizar compra', secure: 'Pago seguro con ClubTickets', instant: 'Entrega instantánea de entradas', official: 'Garantía de socio oficial', noFees: 'Sin gastos ocultos' },
  fr: { lineup: 'Line-up', times: 'Horaires', about: 'À propos de cet événement', important: 'Informations importantes', doors: 'Ouverture', closes: 'Fermeture', itinerary: 'Itinéraire', book: 'Réservez votre billet', standard: 'Entrée standard', standardNote: 'Admission générale officielle', bookOn: 'Commander', secure: 'Paiement sécurisé via ClubTickets', instant: 'Livraison instantanée des billets', official: 'Garantie partenaire officiel', noFees: 'Aucun frais caché' },
}

/** Pick a fitting icon for a CT section title (multilingual keyword match). */
function sectionIcon(title: string) {
  const t = title.toLowerCase()
  if (/includ|inclu|inbegrep|enthalt|incluso/.test(t)) return Sparkles
  if (/meeting|point|punto|treffpunkt|ontmoet|rendez|encuentro|lieu/.test(t)) return MapPin
  if (/check|depart|salida|abfahrt|vertrek|départ|return|regres|retour|rückkehr/.test(t)) return Clock
  if (/itinerar|route|ruta|verlauf/.test(t)) return Navigation
  if (/ticket|tipo|type|typ|billet|entrada/.test(t)) return Ticket
  if (/import|belangrijk|wichtig|importante/.test(t)) return AlertCircle
  if (/food|lunch|comida|essen|eten|repas|drink|bar|beverage/.test(t)) return Utensils
  if (/boat|barco|boot|bateau|schiff|cruise|sail|navega/.test(t)) return Anchor
  if (/swim|beach|playa|strand|plage|water|agua/.test(t)) return Waves
  return Check
}

/** Turn the requirements HTML into clean bullet lines. */
function parseImportant(html?: string): string[] {
  if (!html) return []
  return html
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(l => stripHtml(l).replace(/^[-•·]\s*/, '').replace(/\[\s*\]/g, '').trim())
    .filter(l => l.length > 1 && !/^-+$/.test(l) && l.toUpperCase() !== 'IMPORTANT:' && l.toUpperCase() !== 'IMPORTANT')
}

function formatLineUp(lineUp?: string): string[] {
  if (!lineUp) return []
  let text = lineUp.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  text = text.replace(/(\s*-\s*)+/g, ', ')
  return text.split(',').map(a => a.trim()).filter(Boolean)
}

// ── reusable collapsed accordion (light "Deals of the Day" style) ──────────────
function Accordion({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <details className="group rounded-2xl border border-black/10 bg-black/5 p-4 shadow-md transition-colors open:border-ibiza-green/40 open:bg-white md:p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-black text-black marker:content-[''] [&::-webkit-details-marker]:hidden [&::marker]:content-[''] md:text-xl">
        <span className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ibiza-green text-black">{icon}</span>
          {title}
        </span>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/15 text-xl font-light leading-none text-ibiza-green transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}

export function EventCheckoutClient({ selectedDateObj, allEventDates, fullEvent, locale }: Props) {
  const S = SEC_I18N[locale] || SEC_I18N.en

  // date-fns format uses bundled locale data → identical on server & client (no hydration mismatch)
  const DF_LOC: Record<string, any> = { nl, en: enUS, de, es, fr }
  let dateFormatted = ''
  try {
    if (selectedDateObj?.date) {
      const d = parseISO(String(selectedDateObj.date))
      if (isValid(d)) dateFormatted = format(d, 'EEEE d MMMM yyyy', { locale: DF_LOC[locale] || enUS })
    }
  } catch (err) {
    console.error('Invalid date format:', selectedDateObj?.date, err)
  }

  // Parse price (guard against NaN / non-finite → would break €{...}.toFixed)
  let priceNum = 50
  const rawPrice = (selectedDateObj as any)?.prices
  if (rawPrice !== null && rawPrice !== undefined) {
    if (typeof rawPrice === 'number') {
      priceNum = rawPrice
    } else if (typeof rawPrice === 'string') {
      const match = rawPrice.match(/\d+([.,]\d+)?/)
      if (match) priceNum = parseFloat(match[0].replace(',', '.'))
    }
  }
  if (!Number.isFinite(priceNum)) priceNum = 50

  // Only pass a valid absolute/relative URL to next/image — a malformed src throws a
  // client-side exception that crashes the whole page.
  const rawImg = ((selectedDateObj as any)?.image || (selectedDateObj as any)?.eventCover || '').toString().trim()
  const imageUrl = /^(https?:\/\/|\/)\S+$/.test(rawImg) ? rawImg : '/hi-ibiza-2026/FB_IMG_1779623220486.jpg'

  // Parsers are wrapped so malformed API HTML can never crash the render.
  let artists: string[] = []
  let desc: ReturnType<typeof parseCTDescription> = { hasStructure: false, intro: [], chips: [], sections: [], itinerary: [] }
  let important: string[] = []
  try { artists = formatLineUp(selectedDateObj.lineUp) } catch { artists = [] }
  try { desc = parseCTDescription(fullEvent?.description) } catch { /* keep empty */ }
  try { important = parseImportant(fullEvent?.requirements) } catch { important = [] }
  const hasAbout = desc.intro.length > 0 || desc.chips.length > 0 || desc.sections.length > 0 || desc.itinerary.length > 0
  const startAt = (fullEvent as any)?.startAt
  const endAt = (fullEvent as any)?.endAt

  const handleCheckout = () => {
    window.open(selectedDateObj.affLink, '_blank')
  }

  return (
    <div className="theme-monaco-vip min-h-screen bg-neutral-50 pb-28 text-black">
      {/* Hero Section — full-bleed, flush against the navbar */}
      <div className="relative h-[46vh] w-full overflow-hidden rounded-b-[28px] bg-neutral-900 md:h-[58vh]">
        <Image src={imageUrl} alt={selectedDateObj.eventName || ''} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 w-full p-6 md:p-12">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-4">
            <h1 className="font-serif text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
              {selectedDateObj.eventName}
            </h1>
            <div className="flex flex-wrap gap-3 font-semibold text-white">
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-4 py-2 backdrop-blur-md">
                <Calendar size={18} className="text-ibiza-green" /> <span className="capitalize">{dateFormatted}</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-4 py-2 backdrop-blur-md">
                <MapPin size={18} className="text-ibiza-green" /> {selectedDateObj.venueName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Checkout button directly under the event image */}
      <div className="mx-auto max-w-7xl px-4 mt-6 md:mt-8">
        <button
          onClick={handleCheckout}
          className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-black/5 p-4 font-serif text-lg font-black uppercase text-black shadow-md transition-colors hover:bg-white md:p-5 md:text-xl"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ibiza-green text-black"><Ticket size={18} /></span>
          {S.bookOn} · €{priceNum.toFixed(2)}
        </button>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-8 px-4 md:mt-10 lg:grid-cols-3 lg:gap-12">

        {/* Left Column: Details (all collapsed by default) */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Line-up */}
          {artists.length > 0 && (
            <Accordion icon={<Music size={22} />} title={S.lineup}>
              <div className="flex flex-wrap gap-2.5">
                {artists.map((a, i) => (
                  <span key={i} className="rounded-full bg-black/5 px-4 py-2 text-base font-semibold text-black ring-1 ring-black/10">{a}</span>
                ))}
              </div>
            </Accordion>
          )}

          {/* Times */}
          {(startAt || endAt) && (
            <Accordion icon={<Clock size={22} />} title={S.times}>
              <div className="flex flex-wrap gap-3">
                {startAt && (
                  <div className="flex flex-col rounded-2xl border border-black/10 bg-black/5 px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/50">{S.doors}</span>
                    <span className="text-3xl font-black text-black">{startAt}</span>
                  </div>
                )}
                {endAt && (
                  <div className="flex flex-col rounded-2xl border border-black/10 bg-black/5 px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/50">{S.closes}</span>
                    <span className="text-3xl font-black text-black">{endAt}</span>
                  </div>
                )}
              </div>
            </Accordion>
          )}

          {/* About this event — structured, large & readable */}
          {hasAbout && (
            <Accordion icon={<Info size={22} />} title={S.about}>
              {/* Quick-fact chips */}
              {desc.chips.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2.5">
                  {desc.chips.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-ibiza-green/15 px-3.5 py-1.5 text-sm font-bold text-black ring-1 ring-ibiza-green/40">
                      <Sparkles size={14} className="text-ibiza-green" /> {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Intro — large, readable */}
              {desc.intro.length > 0 && (
                <div className="flex flex-col gap-4">
                  {desc.intro.map((p, i) => <p key={i} className="text-lg md:text-xl font-medium leading-relaxed text-black">{p}</p>)}
                </div>
              )}

              {/* Section cards */}
              {desc.sections.length > 0 && (
                <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {desc.sections.map((s, i) => {
                    const Icon = sectionIcon(s.title)
                    return (
                      <div key={i} className="rounded-2xl border border-black/10 bg-black/5 p-5">
                        <div className="mb-3 flex items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ibiza-green/15 text-ibiza-green">
                            <Icon size={17} />
                          </span>
                          <h3 className="font-serif text-lg font-black text-black">{s.title}</h3>
                        </div>
                        <ul className="flex flex-col gap-2">
                          {s.items.map((it, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-lg font-medium leading-snug text-black">
                              <Check size={18} className="mt-0.5 shrink-0 text-ibiza-green" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Itinerary timeline */}
              {desc.itinerary.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-5 flex items-center gap-2 font-serif text-xl font-black text-black">
                    <Navigation size={20} className="text-ibiza-green" /> {S.itinerary}
                  </h3>
                  <ol className="relative flex flex-col gap-6 pl-2">
                    <span className="absolute bottom-2 left-[14px] top-2 w-0.5 bg-ibiza-green/40" aria-hidden />
                    {desc.itinerary.map((stop, i) => (
                      <li key={i} className="relative flex gap-4 pl-8">
                        <span className="absolute left-0 top-0.5 grid h-7 w-7 place-items-center rounded-full border-2 border-ibiza-green bg-neutral-50 text-[11px] font-black text-black">
                          {i + 1}
                        </span>
                        <div className="flex flex-col">
                          {stop.time && (
                            <span className="mb-0.5 inline-flex w-fit items-center gap-1 rounded-md bg-ibiza-green/20 px-2 py-0.5 text-xs font-bold text-ibiza-green">
                              <Clock size={12} /> {stop.time}
                            </span>
                          )}
                          <span className="text-lg font-bold text-black">{stop.title}</span>
                          {stop.sub && <span className="text-base leading-snug text-black">{stop.sub}</span>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Accordion>
          )}

          {/* Important information */}
          {important.length > 0 && (
            <Accordion icon={<AlertCircle size={22} />} title={S.important} tint>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {important.map((req, idx) => {
                  const r = req.toLowerCase()
                  let icon = <CheckCircle2 className="h-5 w-5 text-ibiza-green" />
                  if (r.includes('duration') || r.includes('time')) icon = <Clock className="h-5 w-5 text-ibiza-green" />
                  else if (r.includes('driver') || r.includes('license') || r.includes('age') || r.includes('years')) icon = <Lock className="h-5 w-5 text-ibiza-green" />
                  else if (r.includes('booking') || r.includes('people') || r.includes('min')) icon = <Ticket className="h-5 w-5 text-ibiza-green" />
                  return (
                    <div key={idx} className="flex items-start gap-3 rounded-2xl border border-black/10 bg-black/5 p-4">
                      <div className="mt-0.5 shrink-0">{icon}</div>
                      <span className="text-base font-semibold leading-snug text-black">{req.replace(/^[-•]\s*/, '')}</span>
                    </div>
                  )
                })}
              </div>
            </Accordion>
          )}

          {/* Venue location map */}
          {selectedDateObj.venueName && (
            <VenueLocationMap venueName={selectedDateObj.venueName} locale={locale} />
          )}
        </div>

        {/* Right Column: Checkout Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-black/10 bg-black/5 p-7 shadow-xl md:p-8">
            <h3 className="mb-6 font-serif text-2xl font-black text-black md:text-3xl">{S.book}</h3>

            <div className="mb-6 flex flex-col rounded-2xl border-2 border-ibiza-green bg-ibiza-green/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-black md:text-xl">{S.standard}</span>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-black/60">{S.standardNote}</span>
                </div>
                <span className="whitespace-nowrap text-2xl font-black text-black md:text-3xl">€{priceNum.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-black/5 p-4 font-serif text-lg font-black uppercase text-black shadow-md transition-colors hover:bg-white md:p-5 md:text-xl"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ibiza-green text-black"><Ticket size={18} /></span>
              {S.bookOn} · €{priceNum.toFixed(2)}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-black/50">
              <Lock size={12} /> {S.secure}
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm font-semibold text-black/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> {S.instant}
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-black/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> {S.official}
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-black/70">
                <CheckCircle2 size={18} className="text-ibiza-green" /> {S.noFees}
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
