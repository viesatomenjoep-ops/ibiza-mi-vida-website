import React from 'react'
import Image from 'next/image'

interface CategoryHeroProps {
  title: string
  subtitle: string
  searchComponent?: React.ReactNode
  eyebrow?: string
  minHeight?: string
  colorTheme?: 'teal' | 'gold' | 'rose' | 'indigo' | 'midnight'
  backgroundImage?: string
  backgroundOpacity?: number
}

export function CategoryHero({
  title,
  subtitle,
  searchComponent,
  eyebrow,
  minHeight = 'min-h-[30vh]',
  colorTheme = 'teal',
  backgroundImage = '/fotos/hero-pattern.png',
  backgroundOpacity = 0.3,
}: CategoryHeroProps) {
  
  // Dynamic color selection for the abstract shapes
  const themeColors = {
    teal: 'from-teal/20 via-teal/5 to-transparent',
    gold: 'from-gold/20 via-gold/5 to-transparent',
    rose: 'from-rose-500/20 via-rose-500/5 to-transparent',
    indigo: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
    midnight: 'from-midnight/10 via-midnight/5 to-transparent',
  }
  
  const accentColor = themeColors[colorTheme]
  const isHome = searchComponent != null

  return (
    <section
      className={`relative flex ${minHeight} flex-col items-center justify-center overflow-hidden ${isHome ? 'bg-midnight' : 'bg-midnight'} pt-24 pb-8 md:pt-28`}
      aria-label="Category Hero section"
    >
      {/* Background Image (if provided) */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover brightness-[0.35]"
          />
        </div>
      ) : (
        /* Abstract Design Patterns (only show if no background image) */
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Circle Top Right */}
          <div className={`absolute -top-[20%] -right-[10%] w-[50vw] max-w-[600px] aspect-square rounded-full bg-gradient-to-bl ${accentColor} blur-3xl opacity-70`} />
          
          {/* Medium Circle Bottom Left */}
          <div className={`absolute -bottom-[20%] -left-[10%] w-[40vw] max-w-[400px] aspect-square rounded-full bg-gradient-to-tr ${accentColor} blur-3xl opacity-60`} />
          
          {/* Small Accent Shape */}
          <div className="absolute top-[30%] left-[10%] w-[20vw] max-w-[200px] aspect-square rounded-full bg-sandstone/30 blur-2xl opacity-40 mix-blend-multiply" />
          
          {/* Grid Pattern Overlay for Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-3 px-4 text-center md:px-8">
        {eyebrow && (
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-white shadow-sm backdrop-blur-sm">
            {eyebrow}
          </span>
        )}

        <h1 className="font-serif text-3xl font-medium leading-tight text-balance md:text-5xl lg:text-6xl text-white drop-shadow-md">
          {title}
        </h1>

        <p className="max-w-2xl font-sans text-sm leading-relaxed md:text-lg text-white/90 font-medium bg-midnight/40 px-4 py-1 rounded-full backdrop-blur-sm">
          {subtitle}
        </p>

        {searchComponent && (
          <div className="mt-4 w-full max-w-5xl">
            {searchComponent}
          </div>
        )}
      </div>

    </section>
  )
}
