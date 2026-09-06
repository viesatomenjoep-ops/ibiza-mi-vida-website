'use client'

import { useEffect, useRef, useState } from 'react'

const KICKER: Record<string, string> = {
  nl: 'Ibiza in beweging', en: 'Ibiza in motion', de: 'Ibiza in Bewegung',
  es: 'Ibiza en movimiento', fr: 'Ibiza en mouvement',
}
const PLAY: Record<string, string> = {
  nl: 'Video afspelen', en: 'Play video', de: 'Video abspielen',
  es: 'Reproducir vídeo', fr: 'Lire la vidéo',
}

/**
 * De Vimeo-film: een jacht voor de kust van Ibiza.
 *
 * ── Waar hij staat ────────────────────────────────────────────────────────
 * Onderaan Private Boat Charters, onder de Click&Boat-advertentie. Hij stond
 * eerst direct onder de hero op de homepage, maar daar deed hij weinig: een
 * bezoeker die net binnenkomt weet nog niet wat hij zoekt en scrollt door. Bij
 * iemand die de hele bootpagina heeft doorgelezen is een jacht in beeld precies
 * het laatste zetje. Vandaar ook de verhuizing uit components/home.
 *
 * ── Waarom hier geen kale <iframe> staat ──────────────────────────────────
 * De embedcode van Vimeo laadt bij het openen van de pagina hun speler, hun
 * scripts en hun cookies -- ook bij iemand die de video nooit aanraakt. Dat is
 * een derde partij in het laadpad van elke bezoeker, voor iets wat de meesten
 * niet afspelen.
 *
 * Dus: eerst alleen de poster van Vimeo (één afbeelding, van hun CDN) met een
 * afspeelknop erop. Pas als je erop tikt komt de iframe in de DOM, met
 * `autoplay=1` zodat die tik meteen de start is en niet een tweede knop
 * oplevert. De poster wordt bovendien pas opgehaald als de sectie in de buurt
 * van het scherm komt -- onderaan een lange pagina scheelt dat bij de meeste
 * bezoekers een verzoek naar Vimeo dat nooit nodig was.
 */
export function VimeoFilm({
  id,
  hash,
  locale = 'nl',
  title = 'Ibiza Mi Vida',
}: {
  /** Vimeo-video-id, bijvoorbeeld 352653740. */
  id: string
  /** De `h=`-parameter van een niet-openbare video. */
  hash?: string
  locale?: string
  title?: string
}) {
  const [speelt, setSpeelt] = useState(false)
  const [dichtbij, setDichtbij] = useState(false)
  const wrap = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setDichtbij(true); return }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some(e => e.isIntersecting)) { setDichtbij(true); io.disconnect() } },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const q = new URLSearchParams({
    ...(hash ? { h: hash } : {}),
    autoplay: '1',
    title: '0',
    byline: '0',
    portrait: '0',
    dnt: '1', // Vimeo mag hier niets bijhouden
  }).toString()

  return (
    <section ref={wrap} className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-gold">
          {KICKER[locale] || KICKER.en}
        </p>
        <div className="relative aspect-video overflow-hidden rounded-3xl bg-neutral-900 shadow-[0_24px_60px_-40px_rgba(0,0,0,.8)]">
          {speelt ? (
            <iframe
              title={title}
              src={`https://player.vimeo.com/video/${id}?${q}`}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setSpeelt(true)}
              aria-label={PLAY[locale] || PLAY.en}
              className="group absolute inset-0 h-full w-full"
            >
              {dichtbij && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://vumbnail.com/${id}.jpg`}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <span aria-hidden className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/15" />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-xl transition-transform group-hover:scale-110 md:h-20 md:w-20"
              >
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 md:h-8 md:w-8" fill="#0D0509">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
