'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { DealsData } from '@/components/home/HomeDeals'

// ── The 4 category showcases (was the 01–04 sticky stacked cards) ──────
type CatKey = 'clubs' | 'boats' | 'land' | 'water'

const CONTENT: Record<CatKey, { href: string; title: Record<string, string>; text: Record<string, string> }> = {
  clubs: {
    href: 'club-tickets',
    title: { nl: 'Club Tickets Ibiza', en: 'Club Tickets Ibiza', es: 'Club Tickets Ibiza', de: 'Club Tickets Ibiza', fr: 'Club Tickets Ibiza' },
    text: {
      nl: 'De heetste clubnachten van het eiland — Hï, UNVRS, Pacha, Amnesia, DC-10 en meer. Reserveer je tickets voor de grootste dj’s van de zomer.',
      en: 'The island’s hottest club nights — Hï, UNVRS, Pacha, Amnesia, DC-10 and more. Book tickets for the biggest DJs of the summer.',
      es: 'Las mejores noches de club de la isla — Hï, UNVRS, Pacha, Amnesia, DC-10 y más. Reserva entradas para los mayores DJs del verano.',
      de: 'Die heißesten Clubnächte der Insel — Hï, UNVRS, Pacha, Amnesia, DC-10 und mehr. Sichere dir Tickets für die größten DJs des Sommers.',
      fr: 'Les meilleures nuits de club de l’île — Hï, UNVRS, Pacha, Amnesia, DC-10 et plus. Réserve tes billets pour les plus grands DJs de l’été.',
    },
  },
  boats: {
    href: 'private-boat-charters',
    title: { nl: 'Private Boats', en: 'Private Boats', es: 'Barcos privados', de: 'Private Boote', fr: 'Bateaux privés' },
    text: {
      nl: 'Huur je eigen jacht of catamaran. Vaar langs Es Vedrà, anker in verborgen baaien en beleef Ibiza vanaf het water.',
      en: 'Charter your own yacht or catamaran. Cruise past Es Vedrà, anchor in hidden coves and experience Ibiza from the water.',
      es: 'Alquila tu propio yate o catamarán. Navega junto a Es Vedrà, fondea en calas escondidas y vive Ibiza desde el agua.',
      de: 'Chartere deine eigene Yacht oder Katamaran. Segle an Es Vedrà vorbei, ankere in versteckten Buchten und erlebe Ibiza vom Wasser aus.',
      fr: 'Louez votre propre yacht ou catamaran. Longez Es Vedrà, mouillez dans des criques cachées et vivez Ibiza depuis l’eau.',
    },
  },
  land: {
    href: 'activities',
    title: { nl: 'Op het land', en: 'On land', es: 'En tierra', de: 'An Land', fr: 'Sur terre' },
    text: {
      nl: 'Buggy-tours, quads, jetski en excursies. Ontdek het ruige binnenland en de mooiste verborgen plekjes van het eiland.',
      en: 'Buggy tours, quads, jet skis and excursions. Discover the rugged interior and the island’s most beautiful hidden spots.',
      es: 'Tours en buggy, quads, motos de agua y excursiones. Descubre el interior salvaje y los rincones más bonitos de la isla.',
      de: 'Buggy-Touren, Quads, Jetskis und Ausflüge. Entdecke das raue Hinterland und die schönsten versteckten Orte der Insel.',
      fr: 'Tours en buggy, quads, jet-skis et excursions. Découvre l’arrière-pays sauvage et les plus beaux coins cachés de l’île.',
    },
  },
  water: {
    href: 'water-sports',
    title: { nl: 'Op het water', en: 'On the water', es: 'En el agua', de: 'Auf dem Wasser', fr: "Sur l'eau" },
    text: {
      nl: 'Boottochten, sunset cruises en watersport. Van Formentera-trips tot parasailing — alles op en rond de zee.',
      en: 'Boat trips, sunset cruises and water sports. From Formentera trips to parasailing — everything on and around the sea.',
      es: 'Excursiones en barco, cruceros al atardecer y deportes acuáticos. De viajes a Formentera al parasailing — todo en el mar.',
      de: 'Bootstouren, Sunset-Cruises und Wassersport. Von Formentera-Trips bis Parasailing — alles auf und rund ums Meer.',
      fr: 'Excursions en bateau, croisières au coucher du soleil et sports nautiques. Des sorties à Formentera au parachute ascensionnel.',
    },
  },
}

const ORDER: CatKey[] = ['clubs', 'boats', 'land', 'water']
const CTA: Record<string, string> = { nl: 'Bekijk alles', en: 'View all', es: 'Ver todo', de: 'Alles ansehen', fr: 'Tout voir' }
const KICKER: Record<string, string> = {
  nl: 'Alles op één eiland', en: 'Everything on one island', es: 'Todo en una isla', de: 'Alles auf einer Insel', fr: 'Tout sur une île',
}

// Static fallbacks so every card always has a photo, even without deals data.
const FALLBACK_IMG: Record<CatKey, string> = {
  clubs: '/foto-club.png',
  boats: '/foto-boot.png',
  land: '/foto-kalender.png',
  water: '/foto-boot.png',
}

function calculateGap(width: number) {
  const minWidth = 640
  const maxWidth = 1024
  const minGap = 40
  const maxGap = 76
  if (width <= minWidth) return minGap
  if (width >= maxWidth) return maxGap
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
}

/**
 * Circular category showcase — replaces the 01–04 sticky stacked cards.
 * Three photos fan out in 3D (left / centre / right) and rotate through the
 * four categories; the text side animates word-by-word with the active card.
 */
export function HomeCategoryCarousel({ deals, base = '/nl', locale = 'nl' }: { deals?: DealsData; base?: string; locale?: string }) {
  const imageFor: Record<CatKey, string> = {
    clubs: deals?.clubs?.[0]?.image || FALLBACK_IMG.clubs,
    boats: deals?.boats?.[0]?.image || FALLBACK_IMG.boats,
    land: deals?.land?.[0]?.image || FALLBACK_IMG.land,
    water: deals?.water?.[0]?.image || FALLBACK_IMG.water,
  }

  const items = useMemo(() => ORDER.map((key, i) => ({
    key,
    num: String(i + 1).padStart(2, '0'),
    href: `${base}/${CONTENT[key].href}`,
    title: CONTENT[key].title[locale] || CONTENT[key].title.en,
    text: CONTENT[key].text[locale] || CONTENT[key].text.en,
    image: imageFor[key],
  })), [base, locale, deals]) // eslint-disable-line react-hooks/exhaustive-deps

  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(800)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const count = items.length
  const active = items[activeIndex]

  useEffect(() => {
    const handleResize = () => {
      if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Autoplay — stops permanently on first manual interaction.
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % count)
    }, 5000)
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [count])

  const stopAutoplay = () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  const handleNext = useCallback(() => { setActiveIndex(prev => (prev + 1) % count); stopAutoplay() }, [count])
  const handlePrev = useCallback(() => { setActiveIndex(prev => (prev - 1 + count) % count); stopAutoplay() }, [count])

  // 3D fan positions: centre card front, neighbours tucked behind left/right.
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth)
    const maxStickUp = gap * 0.8
    const isActive = index === activeIndex
    const isLeft = (activeIndex - 1 + count) % count === index
    const isRight = (activeIndex + 1) % count === index
    const t = 'all 0.8s cubic-bezier(.4,2,.3,1)'
    if (isActive) return { zIndex: 3, opacity: 1, pointerEvents: 'auto', transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)', transition: t }
    if (isLeft) return { zIndex: 2, opacity: 1, pointerEvents: 'none', transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`, transition: t }
    if (isRight) return { zIndex: 2, opacity: 1, pointerEvents: 'none', transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`, transition: t }
    return { zIndex: 1, opacity: 0, pointerEvents: 'none', transition: t }
  }

  return (
    <section className="w-full bg-neutral-100 px-4 py-8 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-20">

        {/* Photo fan — smaller on mobile so the whole card fits one comfortable screen-scroll */}
        <div ref={imageContainerRef} className="relative h-48 w-full sm:h-72 md:h-96" style={{ perspective: '1000px' }}>
          {items.map((item, index) => (
            <Image
              key={item.key}
              src={item.image}
              alt={item.title}
              fill
              draggable={false}
              sizes="(max-width: 768px) 90vw, 500px"
              className="rounded-2xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.2)] md:rounded-3xl"
              style={getImageStyle(index)}
            />
          ))}
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-between">
          {/* Keyed remount replays the entry animation on every rotation.
              (AnimatePresence mode="wait" froze under React StrictMode.) */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold md:text-[11px] md:tracking-[0.28em]">
                {KICKER[locale] || KICKER.en}
              </span>
              <div className="mt-1.5 flex items-baseline gap-2.5 md:mt-2 md:gap-4">
                <span className="font-serif text-3xl font-black text-black/10 md:text-6xl">{active.num}</span>
                <h2 className="font-serif text-xl font-black tracking-tight text-neutral-900 md:text-4xl">
                  {active.title}
                </h2>
              </div>
              <motion.p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600 md:mt-4 md:text-lg">
                {active.text.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut', delay: 0.02 * i }}
                    style={{ display: 'inline-block' }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
              <Link
                href={active.href}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 font-serif text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-gold md:mt-6 md:px-7 md:py-3.5 md:text-xs"
              >
                {CTA[locale] || CTA.en} <ArrowRight size={14} />
              </Link>
          </motion.div>

          {/* Arrows */}
          <div className="mt-4 flex gap-3 md:mt-10 md:gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous category"
              className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-gold md:h-11 md:w-11"
            >
              <ArrowLeft size={16} className="md:hidden" />
              <ArrowLeft size={20} className="hidden md:block" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next category"
              className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-gold md:h-11 md:w-11"
            >
              <ArrowRight size={16} className="md:hidden" />
              <ArrowRight size={20} className="hidden md:block" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
