import React from 'react'
import Image from 'next/image'

interface CategoryHeroProps {
  title: string
  subtitle: string
  searchComponent?: React.ReactNode
  eyebrow?: string
  minHeight?: string
  colorTheme?: 'rustic-terracotta' | 'gold' | 'rose' | 'indigo' | 'velvet-obsidian'
  backgroundImage?: string
  backgroundOpacity?: number
  videoUrl?: string
}

export function CategoryHero({
  title,
  subtitle,
  searchComponent,
  eyebrow,
  minHeight = 'min-h-[300px]',
  colorTheme = 'rustic-terracotta',
  backgroundImage = '/fotos/hero-pattern.jpg',
  backgroundOpacity = 0.3,
  videoUrl = 'https://res.cloudinary.com/daj1lyfgk/video/upload/q_auto,f_auto,so_30,du_30/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4'
}: CategoryHeroProps) {
  
  // Dynamic color selection for the abstract shapes
  const themeColors = {
    'rustic-terracotta': 'from-rustic-terracotta/20 via-rustic-terracotta/5 to-transparent',
    gold: 'from-gold/20 via-gold/5 to-transparent',
    rose: 'from-rose-500/20 via-rose-500/5 to-transparent',
    indigo: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
    'velvet-obsidian': 'from-velvet-obsidian/10 via-velvet-obsidian/5 to-transparent',
  }
  
  const accentColor = themeColors[colorTheme]
  const isHome = searchComponent != null

  return (
    <section
      className={`relative flex ${minHeight} w-full flex-col items-center justify-center text-center pt-24 md:pt-32 pb-16 md:pb-20`}
      aria-label="Category Hero section"
    >
      {/* Background Video for all categories */}
      <div className="fixed inset-0 z-[-1] bg-black overflow-hidden">
        {videoUrl ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-90 scale-[1.15]" 
            src={videoUrl} 
          />
        ) : (
          <Image src={backgroundImage} alt={title} fill className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        {/* Top gradient to protect navbar text */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          {eyebrow && (
            <h2 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white/90 mb-3 md:mb-4 drop-shadow-md">
              {eyebrow}
            </h2>
          )}

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-4 drop-shadow-xl max-w-4xl text-balance">
            {title}
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto font-light tracking-wide mb-8 md:mb-10 leading-relaxed drop-shadow-md px-2">
            {subtitle}
          </p>

          {searchComponent && (
            <div className="mt-2 w-full max-w-5xl">
              {searchComponent}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
