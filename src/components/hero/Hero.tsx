import Image from 'next/image'
import { SearchWidget } from './SearchWidget'

interface HeroProps {
  title: string
  subtitle: string
  backgroundImage: string
  searchComponent?: React.ReactNode
  eyebrow?: string
  minHeight?: string
  overlayClassName?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  searchComponent,
  eyebrow,
  minHeight = 'min-h-screen',
  overlayClassName = 'bg-gradient-to-b from-velvet-obsidian/60 via-velvet-obsidian/40 to-velvet-obsidian/70',
  titleClassName = 'text-ibiza-sand',
  subtitleClassName = 'text-ibiza-sand/90',
}: HeroProps) {
  return (
    <section
      className={`relative flex ${minHeight} flex-col items-center justify-center overflow-hidden`}
      aria-label="Hero section"
    >
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={85}
      />

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClassName}`} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 pb-12 pt-32 text-center md:px-8 md:pt-36">
        {eyebrow && (
          <span className="inline-block rounded-full border border-rustic-terracotta/50 bg-rustic-terracotta/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">
            {eyebrow}
          </span>
        )}

        <h1 className={`font-serif text-5xl font-light leading-tight text-balance md:text-6xl lg:text-7xl xl:text-8xl ${titleClassName}`}>
          {title}
        </h1>

        <p className={`max-w-3xl font-sans text-lg leading-relaxed md:text-xl lg:text-2xl drop-shadow-sm ${subtitleClassName}`}>
          {subtitle}
        </p>

        {searchComponent && (
          <div className="mt-8 w-full max-w-5xl">
            {searchComponent}
          </div>
        )}
      </div>

      {/* Bottom gradient for smooth section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ibiza-sand to-transparent" />
    </section>
  )
}
