'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SocialBrandMark } from '@/components/home/SocialBrandMark'
import { getConsent, CONSENT_EVENT, type ConsentState } from '@/lib/consent'

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const HANDLE = 'ibizamivida'
const TIKTOK_URL = `https://www.tiktok.com/@${HANDLE}`

const KICKER: L = {
  nl: 'Zie het gebeuren',
  en: 'See it happen',
  es: 'Míralo en directo',
  de: 'Sieh es passieren',
  fr: 'Vois-le en vrai',
}
const HEAD: L = {
  nl: 'Ibiza op TikTok',
  en: 'Ibiza on TikTok',
  es: 'Ibiza en TikTok',
  de: 'Ibiza auf TikTok',
  fr: 'Ibiza sur TikTok',
}
const SUB: L = {
  nl: 'Clubnachten, boten en het eiland zoals het echt is — kort en van onszelf.',
  en: 'Club nights, boats and the island as it really is — short and shot by us.',
  es: 'Noches de club, barcos y la isla como es de verdad — cortos y nuestros.',
  de: 'Clubnächte, Boote und die Insel, wie sie wirklich ist — kurz und selbst gedreht.',
  fr: 'Nuits en club, bateaux et l’île telle qu’elle est — court et filmé par nous.',
}
const CTA: L = {
  nl: 'Volgen op TikTok',
  en: 'Follow on TikTok',
  es: 'Seguir en TikTok',
  de: 'Auf TikTok folgen',
  fr: 'Suivre sur TikTok',
}
/** Alleen zichtbaar zolang de bezoeker de keuze nog niet gemaakt heeft of weigerde. */
const GEEN_TOESTEMMING: L = {
  nl: 'De TikTok-feed laadt pas als je cookies van derden accepteert.',
  en: 'The TikTok feed only loads once you accept third-party cookies.',
  es: 'El feed de TikTok solo carga si aceptas cookies de terceros.',
  de: 'Der TikTok-Feed lädt erst, wenn du Cookies Dritter akzeptierst.',
  fr: 'Le fil TikTok ne charge qu’après acceptation des cookies tiers.',
}

/** Het officiële insluitscript van TikTok. Eén keer per pagina genoeg. */
const SCRIPT_SRC = 'https://www.tiktok.com/embed.js'

/**
 * De TikTok-feed, boven de Instagram-sectie.
 *
 * ── Waarom hier niet gewoon de plakcode van TikTok staat ──────────────────
 * De code die TikTok je geeft is een <blockquote> plus een <script async>. Dat
 * script laadt hun speler en zet identifiers op het apparaat van iedereen die
 * de pagina opent -- ook bij wie nooit naar beneden scrollt. Dat mag niet
 * zomaar: de cookiebanner van deze site belooft met zoveel woorden dat de
 * TikTok-feed pas laadt na toestemming, in alle vijf de talen. Deze component
 * houdt die belofte.
 *
 * Dus twee voorwaarden voordat er ook maar iets van TikTok wordt opgehaald:
 *
 *   1. `getConsent() === 'granted'`. Bij 'denied' of 'unset' blijft het een
 *      nette volgbanner met een regel uitleg -- dezelfde vorm die de
 *      Instagram-sectie aanhoudt als er geen feed geconfigureerd is.
 *   2. De sectie moet in de buurt van het scherm zijn. Hij staat onderaan de
 *      homepage; wie daar nooit komt hoeft geen verzoek naar TikTok te sturen.
 *
 * Verandert de keuze later (via de banner of de link in de footer), dan komt
 * dat binnen als CONSENT_EVENT en laadt de feed alsnog, zonder herladen.
 *
 * ── Waarom het script niet weer weggehaald wordt bij intrekken ────────────
 * Eenmaal geladen is een script niet terug te draaien door het <script>-element
 * te verwijderen. We halen daarom wél de insluiting uit beeld, maar de eerlijke
 * werking zit in het níét laden vooraf. Wie zijn toestemming intrekt en de
 * pagina herlaadt, krijgt niets meer van TikTok.
 */
export function HomeTikTok({ locale = 'nl' }: { locale?: string }) {
  const [toestemming, setToestemming] = useState<ConsentState>('unset')
  const [dichtbij, setDichtbij] = useState(false)
  const wrap = useRef<HTMLElement>(null)

  // Toestemming uitlezen na mount (localStorage bestaat niet op de server) en
  // meeluisteren of de bezoeker hem later alsnog geeft.
  useEffect(() => {
    setToestemming(getConsent())
    const luister = (e: Event) => {
      const d = (e as CustomEvent).detail
      setToestemming(d === 'granted' || d === 'denied' ? d : 'unset')
    }
    window.addEventListener(CONSENT_EVENT, luister)
    return () => window.removeEventListener(CONSENT_EVENT, luister)
  }, [])

  // Pas meten als de sectie in de buurt komt.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setDichtbij(true); return }
    const io = new IntersectionObserver(
      entries => { if (entries.some(e => e.isIntersecting)) { setDichtbij(true); io.disconnect() } },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const magLaden = toestemming === 'granted' && dichtbij

  // Het script van TikTok pas injecteren als aan beide voorwaarden is voldaan.
  useEffect(() => {
    if (!magLaden) return
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    document.body.appendChild(s)
  }, [magLaden])

  return (
    <section ref={wrap} className="border-t border-black/5 bg-white py-12 text-neutral-900 md:py-16">
      <Reveal className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center">
          <SocialBrandMark />
          <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            {t(KICKER, locale)}
          </span>
          <h2 className="mt-3 font-serif text-[1.625rem] font-black tracking-tight text-neutral-900 md:text-4xl">
            {t(HEAD, locale)}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
            {t(SUB, locale)}
          </p>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 font-serif text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-gold hover:text-neutral-900"
          >
            {/* Het merkteken van TikTok zit niet in lucide-react, dus als pad.
                Decoratief: de tekst ernaast zegt al waar je heen gaat. */}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
              <path d="M16.5 3c.3 2.1 1.5 3.5 3.5 3.7v2.4c-1.3.1-2.5-.3-3.6-1v6.3c0 3.4-2.5 5.6-5.5 5.6a5.5 5.5 0 0 1 0-11c.3 0 .6 0 .9.1v2.6a2.9 2.9 0 1 0 2 2.8V3h2.7Z" />
            </svg>
            {t(CTA, locale)}
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-semibold text-neutral-400 hover:text-gold"
          >
            @{HANDLE}
          </a>
        </div>

        {magLaden ? (
          <div className="mt-10 flex justify-center">
            {/* De opmaak die TikTok zelf voorschrijft. embed.js vervangt deze
                blockquote door de speler zodra hij binnen is; blijft hij weg,
                dan staat er nog steeds een werkende link naar het profiel. */}
            <blockquote
              className="tiktok-embed w-full"
              cite={TIKTOK_URL}
              data-unique-id={HANDLE}
              data-embed-type="creator"
              style={{ maxWidth: 780, minWidth: 288 }}
            >
              <section>
                <a target="_blank" rel="noopener noreferrer" href={`${TIKTOK_URL}?refer=creator_embed`}>
                  @{HANDLE}
                </a>
              </section>
            </blockquote>
          </div>
        ) : (
          <p className="mt-8 text-center text-xs text-neutral-400">
            {t(GEEN_TOESTEMMING, locale)}
          </p>
        )}
      </Reveal>
    </section>
  )
}
