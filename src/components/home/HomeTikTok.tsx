'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { getConsent, CONSENT_EVENT } from '@/lib/consent'

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const HANDLE = 'ibizamivida'
const TIKTOK_URL = `https://www.tiktok.com/@${HANDLE}`

const KICKER: L = {
  nl: 'Zie het gebeuren', en: 'See it happen', es: 'Míralo en directo',
  de: 'Sieh es passieren', fr: 'Voyez-le en vrai',
}
const HEAD: L = {
  nl: 'Ibiza in beeld', en: 'Ibiza on video', es: 'Ibiza en vídeo',
  de: 'Ibiza im Video', fr: 'Ibiza en vidéo',
}
const SUB: L = {
  nl: 'Clubnachten, boten en het eiland zoals het er echt uitziet.',
  en: 'Club nights, boats and the island as it actually looks.',
  es: 'Noches de club, barcos y la isla tal y como es.',
  de: 'Clubnächte, Boote und die Insel, wie sie wirklich aussieht.',
  fr: "Nuits en club, bateaux et l'île telle qu'elle est vraiment.",
}
const CTA: L = {
  nl: 'Volgen op TikTok', en: 'Follow on TikTok', es: 'Seguir en TikTok',
  de: 'Auf TikTok folgen', fr: 'Suivre sur TikTok',
}

/** TikTok's eigen glyph, inline — bespaart een verzoek en erft currentColor. */
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .52.04.76.12v-3.2a5.86 5.86 0 0 0-.76-.05A5.78 5.78 0 0 0 4.08 15.4a5.78 5.78 0 0 0 5.78 5.78 5.78 5.78 0 0 0 5.78-5.78V9.01a7.35 7.35 0 0 0 4.29 1.37V7.3a4.29 4.29 0 0 1-3.33-1.48Z" />
    </svg>
  )
}

/**
 * TikTok-profiel, pas geladen als het in beeld komt.
 *
 * ── Waarom lui en niet gewoon het script in de pagina ─────────────────────
 * TikTok's embed.js haalt een iframe met videothumbnails op. Dat is zwaar, en
 * deze sectie staat ver onder de vouw: de meeste bezoekers zien hem nooit.
 * Het script onvoorwaardelijk laden betekent dat iedereen ervoor betaalt in
 * laadtijd terwijl een fractie het ziet — en op deze site is er echt werk
 * gestoken in hoe snel de hero verschijnt.
 *
 * Dus: een IntersectionObserver injecteert het script pas wanneer de sectie in
 * beeld komt, en daarna nooit meer (`loaded` blijft true). Wie hier nooit
 * scrollt, downloadt niets.
 *
 * ── Wat er staat als het niet laadt ───────────────────────────────────────
 * Een echte volgknop, altijd, ongeacht of het script het doet. TikTok blokkeert
 * geregeld geautomatiseerde verzoeken en embeds vallen weleens uit; dan houd je
 * hier een werkende link over in plaats van een leeg vak. De blockquote zelf
 * bevat ook een gewone link naar het profiel, dus zonder JavaScript blijft er
 * iets klikbaars staan.
 *
 * ── Privacy ───────────────────────────────────────────────────────────────
 * TikTok's embed zet identifiers, dus hij laadt alleen na toestemming. Twee
 * voorwaarden dus, en allebei nodig: de bezoeker moet ja gezegd hebben én de
 * sectie moet in beeld komen. Zonder toestemming blijft de volgknop staan en
 * wordt er niets van tiktok.com opgehaald.
 */
export function HomeTikTok({ locale = 'nl' }: { locale?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const sync = () => setAllowed(getConsent() === 'granted')
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || loaded || !allowed) return
    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return
        io.disconnect()
        setLoaded(true)
        // Eén keer per pagina, ook als er ooit twee embeds op staan.
        if (document.querySelector('script[src*="tiktok.com/embed.js"]')) return
        const s = document.createElement('script')
        s.src = 'https://www.tiktok.com/embed.js'
        s.async = true
        document.body.appendChild(s)
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loaded, allowed])

  return (
    <section className="border-t border-black/5 bg-white py-12 text-neutral-900 md:py-16">
      <Reveal className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
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
            <TikTokIcon />
            {t(CTA, locale)}
          </a>

          <div ref={ref} className="mt-8 w-full max-w-[780px]">
            {loaded && (
              <blockquote
                className="tiktok-embed"
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
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
