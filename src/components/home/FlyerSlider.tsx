'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface FlyerSliderProps {
  title: string
  subtitle?: string
  images: string[]
}

export function FlyerSlider({ title, subtitle, images }: FlyerSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener('resize', checkScrollability)
    return () => window.removeEventListener('resize', checkScrollability)
  }, [images])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount =
        direction === 'left' ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!images || images.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection className="px-4 md:px-8 mb-8 md:mb-10 flex items-end justify-between gap-6">
          <SectionHeader title={title} subtitle={subtitle} align="left" />

          {/* Desktop Navigation Arrows */}
          <div className="hidden shrink-0 gap-3 md:flex pb-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-velvet-obsidian/10 bg-white text-velvet-obsidian shadow-sm transition-all hover:border-velvet-obsidian/30 hover:bg-ibiza-sand disabled:opacity-40 disabled:hover:border-velvet-obsidian/10 disabled:hover:bg-white"
              aria-label="Previous events"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-velvet-obsidian/10 bg-white text-velvet-obsidian shadow-sm transition-all hover:border-velvet-obsidian/30 hover:bg-ibiza-sand disabled:opacity-40 disabled:hover:border-velvet-obsidian/10 disabled:hover:bg-white"
              aria-label="Next events"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </AnimatedSection>

        {/* Scroll Container */}
        <div className="relative w-full">
          <div
            ref={scrollRef}
            onScroll={checkScrollability}
            className="flex w-full snap-x snap-mandatory overflow-x-auto pb-8 pl-4 pr-4 md:pl-8 md:pr-8 hide-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* The gap handles spacing between cards */}
            <div className="flex gap-4 md:gap-6">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="group relative flex h-[420px] w-[280px] md:h-[500px] md:w-[320px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl bg-velvet-obsidian shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={src}
                      alt={`Flyer ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 320px"
                      priority={idx < 4}
                    />
                    {/* Gradient Overlay for luxury feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
