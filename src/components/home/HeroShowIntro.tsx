'use client'

import { useEffect, useState } from 'react'

// Three lines that type in one after another, on a loop — like a show intro.
const LINES: Record<string, string[]> = {
  nl: [
    'Jouw exclusieve sleutel tot Ibiza.',
    'Van privéjachten tot de beste clubs en unieke activiteiten.',
    'Boek jouw ultieme eilandervaring op één platform.',
  ],
  en: [
    'Your exclusive key to Ibiza.',
    'From private yachts to the best clubs and unique activities.',
    'Book your ultimate island experience on one platform.',
  ],
  es: [
    'Tu llave exclusiva a Ibiza.',
    'Desde yates privados hasta los mejores clubs y actividades únicas.',
    'Reserva tu experiencia isleña definitiva en una sola plataforma.',
  ],
  de: [
    'Dein exklusiver Schlüssel zu Ibiza.',
    'Von Privatyachten bis zu den besten Clubs und einzigartigen Aktivitäten.',
    'Buche dein ultimatives Inselerlebnis auf einer Plattform.',
  ],
  fr: [
    'Votre clé exclusive pour Ibiza.',
    'Des yachts privés aux meilleurs clubs et activités uniques.',
    'Réservez votre expérience insulaire ultime sur une seule plateforme.',
  ],
}

export function HeroShowIntro({ locale = 'nl' }: { locale?: string }) {
  const lines = LINES[locale] || LINES.en
  const [i, setI] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const line = lines[i] ?? ''
    setText('')
    let ci = 0
    const type = () => {
      if (cancelled) return
      ci++
      setText(line.slice(0, ci))
      if (ci < line.length) timers.push(setTimeout(type, 95))
      else timers.push(setTimeout(() => { if (!cancelled) setI(p => (p + 1) % lines.length) }, 1700))
    }
    timers.push(setTimeout(type, 350))
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [i, lines])

  return (
    <div className="flex min-h-[3.4em] w-full max-w-3xl items-center justify-center">
      <h2
        key={i}
        className="hero-line-in font-serif font-black uppercase leading-[1.06] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]"
        style={{ fontSize: 'clamp(2rem, 6.4vw, 3.8rem)' }}
      >
        {text || ' '}
        <span className="hero-caret2" aria-hidden>|</span>
      </h2>
    </div>
  )
}
