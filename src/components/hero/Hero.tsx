import Image from 'next/image'
import { SearchWidget } from './SearchWidget'

interface HeroProps {
  title: string
  subtitle: string
  backgroundImage: string
  showSearch?: boolean
  eyebrow?: string
  minHeight?: string
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  showSearch = false,
  eyebrow,
  minHeight = 'min-h-screen',
}: HeroProps) {
  return (
    <section
      className={`relative flex ${minHeight} flex-col items-center justify-center overflow-hidden`}
      aria-label="Hero section"
    >
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={85}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/40 to-midnight/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 pb-12 pt-32 text-center md:px-8 md:pt-36">
        {eyebrow && (
          <span className="inline-block rounded-full border border-teal/50 bg-teal/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-teal">
            {eyebrow}
          </span>
        )}

        <h1 className="font-serif text-5xl font-light leading-tight text-soft-white text-balance md:text-6xl lg:text-7xl xl:text-8xl">
          {title}
        </h1>

        <p className="max-w-2xl font-sans text-base leading-relaxed text-soft-white/80 md:text-lg lg:text-xl">
          {subtitle}
        </p>

        {showSearch && (
          <div className="mt-4 w-full max-w-3xl">
            <SearchWidget />
          </div>
        )}
      </div>

      {/* Bottom gradient for smooth section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-soft-white to-transparent" />
    </section>
  )
}
