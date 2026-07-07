'use client'

import { useEffect, useRef } from 'react'

// Resting state of the hero's white area — the tagline, framed by a black arc
// just above the five selectors that mirrors the arc coming down from the video,
// so the whole thing flows together. The category image preview lives in
// HomePreviewSheet (a fixed slide-up panel with a matching oval top).
export function HomePreviewStage({
  headline,
  subline,
}: {
  headline: string
  subline: string
}) {
  // The black arc gradually fades out as you scroll down — updated directly on the
  // DOM via rAF so it never triggers a React re-render (keeps scrolling smooth).
  const arcRef = useRef<SVGSVGElement>(null)
  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      if (arcRef.current) arcRef.current.style.opacity = String(Math.max(0, Math.min(1, 1 - window.scrollY / 240)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 text-center" style={{ paddingTop: '1vh', paddingBottom: 92 }}>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Hairline separator */}
        <span className="mb-4 block h-px w-10 bg-black/20" />

        {/* Headline — centered, two lines, uppercase */}
        <h2 className="max-w-[12em] font-serif text-[1.42rem] font-black uppercase leading-[1.05] text-black sm:text-[1.66rem] md:text-[2.13rem]">
          {headline}
        </h2>

        {/* Subtitle — centered, pitch black */}
        <p className="mt-3 max-w-lg text-[0.96rem] font-bold leading-snug text-black sm:text-[1.05rem] md:text-[1.18rem]">
          {subline}
        </p>

        {/* Hairline separator */}
        <span className="mt-4 block h-px w-10 bg-black/20" />
      </div>

      {/* Black arc just above the five selectors — same shape as the video arc,
          peaking in the middle so it flows into the dock */}
      <svg
        ref={arcRef}
        className="pointer-events-none absolute inset-x-0 z-0 w-full"
        style={{ bottom: 22, height: 'clamp(26px, 5vh, 52px)' }}
        viewBox="0 0 400 44"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,44 L0,24 Q200,-6 400,24 L400,44 Z" fill="#000000" />
      </svg>
    </div>
  )
}
