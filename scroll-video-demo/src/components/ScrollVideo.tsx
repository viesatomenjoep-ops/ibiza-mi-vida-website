'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const FRAME_COUNT = 193
const FRAME_PATH = (i: number) =>
  `/scroll-frames/frame_${String(i).padStart(4, '0')}.webp`

// Hoeveel schermhoogtes je moet scrollen om de hele video af te spelen.
// Hoger = trager/langzamer scrubben. 4 is een prettige, filmische snelheid.
const SCROLL_HEIGHT_VH = 400

type Caption = {
  /** Op welk deel van de scroll deze tekst verschijnt (0 = start, 1 = eind) */
  at: number
  title: string
  subtitle?: string
}

const CAPTIONS: Caption[] = [
  { at: 0.02, title: 'Je landt op Ibiza', subtitle: 'Het begint zodra je uitstapt' },
  { at: 0.4, title: 'Onderweg', subtitle: 'De weg naar je bestemming' },
  { at: 0.78, title: 'Aangekomen', subtitle: 'Infinity pool, uitzicht over zee' },
]

export function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const rafRef = useRef<number | null>(null)
  const currentFrameRef = useRef(0)

  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)

  /** Tekent een frame op de canvas, schaalt als 'cover' zodat het scherm altijd vol is */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[index]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cssW = canvas.clientWidth
    const cssH = canvas.clientHeight

    // Canvas resolutie alleen bijwerken als het echt veranderd is (voorkomt flikkering)
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cssW, cssH)

    // object-fit: cover berekening
    const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    const x = (cssW - w) / 2
    const y = (cssH - h) / 2

    ctx.drawImage(img, x, y, w, h)
  }, [])

  /* ---- Frames vooraf inladen ---- */
  useEffect(() => {
    let cancelled = false
    let count = 0

    const images: HTMLImageElement[] = new Array(FRAME_COUNT)

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i + 1)
      img.decoding = 'async'

      img.onload = () => {
        if (cancelled) return
        count++
        setLoaded(count)

        // Zodra het eerste frame binnen is, meteen tonen (geen zwart scherm)
        if (i === 0) {
          setReady(true)
          requestAnimationFrame(() => drawFrame(0))
        }
      }
      img.onerror = () => {
        if (cancelled) return
        count++
        setLoaded(count)
      }

      images[i] = img
    }

    imagesRef.current = images

    return () => {
      cancelled = true
    }
  }, [drawFrame])

  /* ---- Scroll koppelen aan frame ---- */
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null

        const el = containerRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const scrollable = el.offsetHeight - window.innerHeight

        // 0 = bovenaan de sectie, 1 = onderaan
        const raw = scrollable > 0 ? -rect.top / scrollable : 0
        const p = Math.min(Math.max(raw, 0), 1)

        setProgress(p)

        const frame = Math.min(
          FRAME_COUNT - 1,
          Math.round(p * (FRAME_COUNT - 1))
        )

        if (frame !== currentFrameRef.current) {
          currentFrameRef.current = frame
          drawFrame(frame)
        }
      })
    }

    const onResize = () => drawFrame(currentFrameRef.current)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll() // meteen goed zetten bij laden

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [drawFrame])

  const loadPercent = Math.round((loaded / FRAME_COUNT) * 100)

  return (
    <div
      ref={containerRef}
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      className="relative w-full"
    >
      {/* Sticky viewport: blijft staan terwijl je door de sectie scrollt */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: 'block' }}
        />

        {/* Donkere vignette voor leesbaarheid van tekst */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Bijschriften die in- en uitfaden op basis van scrollpositie */}
        {CAPTIONS.map((cap, i) => {
          // Fade-venster rond het 'at'-punt
          const distance = Math.abs(progress - cap.at)
          const opacity = Math.max(0, 1 - distance / 0.12)
          const translateY = (1 - opacity) * 24

          return (
            <div
              key={i}
              className="pointer-events-none absolute inset-x-0 bottom-[18%] flex flex-col items-center px-6 text-center"
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                transition: 'opacity 120ms linear',
              }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl">
                {cap.title}
              </h2>
              {cap.subtitle && (
                <p className="mt-3 max-w-xl text-base text-white/80 drop-shadow md:text-lg">
                  {cap.subtitle}
                </p>
              )}
            </div>
          )
        })}

        {/* Voortgangsbalk */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
          <div
            className="h-full bg-white/70"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Scroll-hint, verdwijnt zodra je begint */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-2"
          style={{
            opacity: Math.max(0, 1 - progress * 10),
            transition: 'opacity 200ms linear',
          }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/70">
            Scroll
          </span>
          <div className="h-8 w-[1px] animate-pulse bg-white/50" />
        </div>

        {/* Laad-indicator */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-sm tracking-widest text-white/60">
                {loadPercent}%
              </div>
              <div className="mt-3 h-[2px] w-40 overflow-hidden bg-white/15">
                <div
                  className="h-full bg-white/70 transition-[width] duration-200"
                  style={{ width: `${loadPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
