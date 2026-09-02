'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cloudinaryVideo, optimizeCloudinaryVideo, cloudinaryVideoPoster, MEDIA } from '@/lib/cloudinary'

// Background clips that play one after another, looping (first clip always first).
//
// These are served from our Cloudinary cloud (instant, adaptive delivery). To
// override, set NEXT_PUBLIC_HOME_HERO_VIDEOS to a comma-separated list of
// Cloudinary public ids or full delivery URLs.
function resolveSources(): string[] {
  const configured = process.env.NEXT_PUBLIC_HOME_HERO_VIDEOS
  const ids = configured
    ? configured.split(',').map((s) => s.trim()).filter(Boolean)
    : [...MEDIA.homeHero]
  return ids.map((entry) =>
    entry.startsWith('http') ? optimizeCloudinaryVideo(entry) : cloudinaryVideo(entry),
  )
}

const VIDEOS = resolveSources()
const POSTERS = VIDEOS.map((src) => cloudinaryVideoPoster(src))
// Per-clip framing — clip one sits ~30% higher (crops a bit off the top).
const POSITIONS = ['center 96%', 'center', 'center']

/**
 * Achtergrondvideo van de homepage.
 *
 * ── Waarom dit meer is dan <video autoplay muted> ─────────────────────────
 * Deze clip is decoratie, geen speler. De bezoeker mag er nooit een
 * afspeelknop, een spoelbalk of een 10-seconden-terugknop op zien: dat is
 * de systeem-UI van iOS die tevoorschijn komt zodra de browser de video níet
 * als achtergrond behandelt, en er staat dan een halfdoorzichtige play-knop
 * midden over de kop "Jouw exclusieve sleutel tot Ibiza" heen.
 *
 * Precies dat gebeurde in de in-app browser van TikTok. Drie dingen samen:
 *
 *  1. React zet `muted` als attribuut, en Safari kijkt bij het beoordelen van
 *     autoplay naar de DOM-property. Bij een element dat pas ná de eerste
 *     render een src krijgt (zie `armed` hieronder) kan die property nog vals
 *     staan, en dan is het voor de browser een video mét geluid — die mag
 *     niet uit zichzelf starten. Vandaar dat we muted/defaultMuted hier ook
 *     imperatief zetten, vóór de eerste play()-poging.
 *  2. `playsInline` alleen is niet genoeg in oudere WKWebViews; die kijken
 *     naar het `webkit-playsinline`-attribuut. Zonder dat gaat de video op
 *     iOS naar de volledige schermspeler mét bedieningsknoppen.
 *  3. Sommige in-app browsers (TikTok is er één) weigeren de eerste play()
 *     hoe dan ook tot de gebruiker íets aanraakt.
 *
 * Voor geval 3 luisteren we eenmalig naar de eerste aanraking of scroll en
 * proberen het dan opnieuw. Lukt het daarna nog steeds niet, dan geven we het
 * op en tonen we de poster als gewone afbeelding. Een stilstaand beeld is een
 * prima achtergrond; een dode video met een play-knop eroverheen is dat niet.
 *
 * De video vangt bovendien geen kliks meer op (pointer-events: none). Een tik
 * op de achtergrond hoorde de volgende clip te starten, maar in de praktijk
 * opende iOS daarmee zijn eigen bedieningsbalk. De knop "Bekijk de agenda"
 * ligt eroverheen en werkt gewoon.
 */
export function HomeHeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  const [i, setI] = useState(0)
  // PERF: the first clip is ~3.3MB — by far the heaviest thing on the page. With
  // `preload="auto"` it raced the hero text, fonts and above-the-fold images for
  // bandwidth on mobile. We paint the poster immediately and only attach the
  // video source once the page has finished loading, so the clip uses leftover
  // bandwidth instead of competing with the LCP.
  const [armed, setArmed] = useState(false)
  // Autoplay definitief geweigerd: terugvallen op het stilstaande beeld.
  const [opgegeven, setOpgegeven] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const next = () => setI(p => (p + 1) % VIDEOS.length)

  useEffect(() => {
    // Respect a user's data-saver / reduced-motion preference: no clip at all.
    const conn = (navigator as any).connection
    if (conn?.saveData) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const arm = () => setArmed(true)
    if (document.readyState === 'complete') {
      const idle = (window as any).requestIdleCallback
      const id = idle ? idle(arm, { timeout: 2000 }) : window.setTimeout(arm, 400)
      return () => (idle ? (window as any).cancelIdleCallback?.(id) : clearTimeout(id))
    }
    window.addEventListener('load', arm, { once: true })
    return () => window.removeEventListener('load', arm)
  }, [])

  // Zorg dat het element in de ogen van de browser echt stom en stil is. Dit
  // moet op de property, niet op het attribuut, en het moet voor elke
  // play()-poging gebeuren — ook na het wisselen van clip.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = true
    el.defaultMuted = true
    el.volume = 0
  }, [i, armed])

  // Eerste aanraking of scroll: nog één poging voor de browsers die de
  // allereerste play() zonder gebruikersgebaar weigeren.
  useEffect(() => {
    if (!armed) return
    let klaar = false
    const nogEens = () => {
      const el = videoRef.current
      if (klaar || !el) return
      el.muted = true
      el.play().then(() => { klaar = true; setOpgegeven(false) }).catch(() => {})
    }
    const opties = { passive: true } as AddEventListenerOptions
    window.addEventListener('touchstart', nogEens, opties)
    window.addEventListener('pointerdown', nogEens, opties)
    window.addEventListener('scroll', nogEens, opties)
    return () => {
      window.removeEventListener('touchstart', nogEens)
      window.removeEventListener('pointerdown', nogEens)
      window.removeEventListener('scroll', nogEens)
    }
  }, [armed])

  // Poster als gewone afbeelding: geen enkele kans op systeemknoppen.
  if (opgegeven) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={POSTERS[i]}
        alt=""
        aria-hidden="true"
        className={className}
        style={{ ...style, objectPosition: POSITIONS[i], pointerEvents: 'none' }}
      />
    )
  }

  return (
    <video
      key={VIDEOS[i]}
      ref={videoRef}
      src={armed ? VIDEOS[i] : undefined}
      poster={POSTERS[i]}
      autoPlay
      muted
      loop={false}
      playsInline
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      // Oudere WKWebViews (waaronder die van TikTok) kijken naar deze twee en
      // niet naar playsInline; zonder deze schakelt iOS over op de speler met
      // bedieningsknoppen.
      webkit-playsinline="true"
      x5-playsinline="true"
      preload="none"
      tabIndex={-1}
      aria-hidden="true"
      onEnded={next}
      onLoadedMetadata={(e) => { e.currentTarget.muted = true; e.currentTarget.playbackRate = 0.66 }}
      onCanPlay={(e) => {
        const el = e.currentTarget
        el.muted = true
        el.playbackRate = 0.66
        el.play().then(() => setOpgegeven(false)).catch(() => setOpgegeven(true))
      }}
      className={className}
      // Geen kliks: een tik hierop opende de bedieningsbalk van iOS.
      style={{ ...style, objectPosition: POSITIONS[i], pointerEvents: 'none' }}
    />
  )
}
