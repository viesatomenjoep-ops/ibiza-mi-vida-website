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
    <div className="flex h-full w-full flex-col px-6 md:px-10" style={{ paddingBottom: 92 }}>
      {/* Ibiza Mi Vida — centered, in the middle of the upper space */}
      <div className="flex flex-1 items-center justify-center">
        <span className="font-serif text-[1.625rem] font-black leading-none tracking-tight text-neutral-900">
          Ibiza Mi Vida
        </span>
      </div>

      {/* Headline + subtitle — left aligned, pushed toward the tiles */}
      <div className="w-full text-left">
        <h2 className="max-w-[10em] font-serif text-[1.7rem] font-black leading-[1.04] text-black sm:text-[2rem] md:text-[2.6rem]">
          {headline}
        </h2>
        <p className="mt-3 max-w-lg text-[1.05rem] font-bold leading-snug text-black/70 sm:text-[1.15rem] md:text-[1.3rem]">
          {subline}
        </p>
      </div>
    </div>
  )
}
