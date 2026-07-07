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
    </div>
  )
}
