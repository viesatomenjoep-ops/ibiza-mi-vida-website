'use client'

// Resting state of the hero's white area — the Ibiza Mi Vida tagline on a
// styled backdrop: concentric arcs rising from the bottom (echoing the video's
// light arcs), faint brand-colour hairlines and dots. The category image
// preview lives in HomePreviewSheet (a fixed slide-up panel).
export function HomePreviewStage({
  headline,
  subline,
}: {
  headline: string
  subline: string
}) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 text-center" style={{ paddingBottom: 92 }}>
      {/* Decorative backdrop */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="hps-glow" cx="50%" cy="88%" r="75%">
            <stop offset="0%" stopColor="#14C800" stopOpacity="0.06" />
            <stop offset="55%" stopColor="#14C800" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="400" height="320" fill="url(#hps-glow)" />
        {/* Concentric arcs rising from the bottom centre */}
        <g fill="none" strokeWidth="1">
          <circle cx="200" cy="378" r="150" stroke="#000000" strokeOpacity="0.05" />
          <circle cx="200" cy="378" r="205" stroke="#E14D68" strokeOpacity="0.11" />
          <circle cx="200" cy="378" r="262" stroke="#00A3FF" strokeOpacity="0.09" />
          <circle cx="200" cy="378" r="320" stroke="#14C800" strokeOpacity="0.10" />
          <circle cx="200" cy="378" r="378" stroke="#000000" strokeOpacity="0.04" />
        </g>
        {/* Fine floating dots */}
        <circle cx="52" cy="58" r="2.4" fill="#14C800" fillOpacity="0.5" />
        <circle cx="352" cy="80" r="2" fill="#E14D68" fillOpacity="0.5" />
        <circle cx="330" cy="250" r="2.4" fill="#00A3FF" fillOpacity="0.45" />
        <circle cx="70" cy="232" r="1.8" fill="#000000" fillOpacity="0.25" />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Hairline separator */}
        <span className="mb-4 block h-px w-10 bg-black/20" />

        {/* Ibiza Mi Vida — centered, uppercase, thin weight */}
        <span className="font-serif text-[2.73rem] font-light uppercase leading-none tracking-tight text-neutral-900">
          Ibiza Mi Vida
        </span>

        {/* Headline — centered, two lines, uppercase */}
        <h2 className="mt-3.5 max-w-[12em] font-serif text-[2.03rem] font-black uppercase leading-[1.05] text-black sm:text-[2.37rem] md:text-[3.04rem]">
          {headline}
        </h2>

        {/* Subtitle — centered */}
        <p className="mt-3 max-w-lg text-[1.37rem] font-bold leading-snug text-black/70 sm:text-[1.5rem] md:text-[1.69rem]">
          {subline}
        </p>

        {/* Hairline separator */}
        <span className="mt-4 block h-px w-10 bg-black/20" />
      </div>
    </div>
  )
}
