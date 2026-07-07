'use client'

// Resting state of the hero's white area — the Ibiza Mi Vida tagline.
// The category image preview now lives in HomePreviewSheet (a fixed slide-up
// panel) so it works anywhere on the page, not just at the top.
export function HomePreviewStage({
  headline,
  subline,
}: {
  headline: string
  subline: string
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center" style={{ paddingBottom: 92 }}>
      <span className="font-serif text-[1.625rem] font-black leading-none tracking-tight text-neutral-900">
        Ibiza Mi Vida
      </span>
      <h2 className="mt-2.5 max-w-3xl font-serif text-[2.25rem] font-black leading-[1.05] text-black sm:text-[2.7rem] md:text-[3.5rem]">
        {headline}
      </h2>
      <p className="mt-3.5 max-w-2xl text-[1.2rem] font-bold leading-snug text-black/70 sm:text-[1.3rem] md:text-[1.5rem]">
        {subline}
      </p>
    </div>
  )
}
