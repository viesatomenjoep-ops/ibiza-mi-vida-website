'use client'

// Resting state of the hero's white area.
//  · "Ibiza Mi Vida" stays centered in the middle.
//  · The headline is left-aligned across two lines, 25% smaller.
//  · Headline + subtitle sit lower, closer to the selector tiles.
// The category image preview lives in HomePreviewSheet (a fixed slide-up panel).
export function HomePreviewStage({
  headline,
  subline,
}: {
  headline: string
  subline: string
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center md:px-10" style={{ paddingBottom: 92 }}>
      {/* Ibiza Mi Vida — centered, uppercase, 30% larger */}
      <span className="font-serif text-[2.1rem] font-black uppercase leading-none tracking-tight text-neutral-900">
        Ibiza Mi Vida
      </span>

      {/* Headline — centered, two lines, uppercase, 30% larger */}
      <h2 className="mt-3.5 max-w-[12em] font-serif text-[1.56rem] font-black uppercase leading-[1.05] text-black sm:text-[1.82rem] md:text-[2.34rem]">
        {headline}
      </h2>

      {/* Subtitle — unchanged, centered */}
      <p className="mt-3 max-w-lg text-[1.05rem] font-bold leading-snug text-black/70 sm:text-[1.15rem] md:text-[1.3rem]">
        {subline}
      </p>
    </div>
  )
}
