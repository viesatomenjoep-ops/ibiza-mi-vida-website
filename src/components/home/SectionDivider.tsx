'use client'

import { useEffect, useRef } from 'react'

/**
 * De gekleurde scheidingsbalk tussen twee secties van de homepage.
 *
 * Hiervoor hielden vier warme sectietinten (bone, zand, klei) de secties uit
 * elkaar. Die zijn eruit: beige leest op wit als een vuiltje, niet als een
 * keuze. De secties zijn nu wit en de kleur zit in deze balk -- en dat werkt
 * beter dan een tint kón werken, want op een balk staat geen tekst en mag de
 * kleur dus verzadigd zijn. Een sectieachtergrond moet altijd leesbaar
 * blijven en komt daarom nooit verder dan bijna-wit.
 *
 * De vorm: bovenaan een kaarsrechte lijn, onderaan een golf die in de
 * volgende sectie druipt. De rechte kant draagt de structuur, de golf de
 * beweging.
 *
 * Over de animatie -- zie ook de toelichting bij `.section-divider` in
 * globals.css. Er beweegt uitsluitend een `transform`, de animatie staat
 * standaard stil en loopt alleen terwijl de balk in beeld is. Dat is geen
 * overdreven voorzichtigheid: deze site is eerder vastgelopen op precies dit
 * patroon (een rAF-lus in de Navbar, twee marquees die per frame een
 * transform schreven, ook twee schermen omhoog gescrold). Zestien van deze
 * balken die alle zestien altijd draaien zou dezelfde fout zijn.
 */

/**
 * De golf als vlak dat van bóvenaf gevuld is: rechte kant op y=0, golvende
 * onderrand rond y=70. Het pad loopt tot 2880 terwijl het venster 1440 breed
 * is, en één periode ís 1440 -- daardoor is de stand na `translateX(-1440)`
 * gelijk aan de stand bij 0 en herhaalt de lus zonder zichtbare sprong.
 *
 * Een vlak dat van ónderaf gevuld is (`L2880,160 L0,160 Z`) zou hier een
 * witte strook laten tussen de rechte bovenrand en de golf.
 */
const WAVE =
  'M0,70 C240,20 480,20 720,70 C960,120 1200,120 1440,70 ' +
  'C1680,20 1920,20 2160,70 C2400,120 2640,120 2880,70 ' +
  'L2880,0 L0,0 Z'

export interface SectionDividerProps {
  /**
   * De accentkleur. Een CSS-variabele uit het sunset-palet
   * (`var(--accent-coral)` enzovoort) of een kale kleurwaarde.
   */
  accent: string
  /** Staat de balk tegen een donker vel in plaats van tegen wit? */
  onDark?: boolean
  /** Spiegelt de golf, zodat twee balken naast elkaar niet identiek zijn. */
  flip?: boolean
  className?: string
}

export function SectionDivider({ accent, onDark = false, flip = false, className = '' }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Geen animatie om te beheren als de bezoeker er geen wil. Dan blijft
    // data-run weg en zet de CSS de animatie op `none`.
    const stil = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (stil?.matches) return

    let inBeeld = false
    const pas = () => {
      // Tabblad op de achtergrond telt als "niemand kijkt": de browser mag
      // de animatie dan al throttelen, maar niet elke browser doet dat voor
      // compositor-animaties.
      if (inBeeld && document.visibilityState === 'visible') el.setAttribute('data-run', '1')
      else el.removeAttribute('data-run')
    }

    const io = new IntersectionObserver(
      (entries) => {
        inBeeld = entries[0]?.isIntersecting ?? false
        pas()
      },
      // Een marge eromheen zodat de golf al loopt vóór hij in beeld schuift
      // en je hem niet ziet "aanspringen".
      { rootMargin: '120px 0px' },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', pas)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', pas)
    }
  }, [])

  return (
    <div
      ref={ref}
      // aria-hidden en geen `role`: dit is decoratie. Een screenreader die
      // hier "afbeelding" roept tussen elke twee secties maakt de pagina
      // onbruikbaar in plaats van mooier.
      aria-hidden
      className={`section-divider${onDark ? ' on-dark' : ''}${className ? ` ${className}` : ''}`}
    >
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" focusable="false">
        <g transform={flip ? 'translate(1440,0) scale(-1,1)' : undefined}>
          {/* Twee lagen van hetzelfde pad. Allebei gevuld vanaf de bovenrand,
              dus de bovenkant is één effen balk; alleen de ónderranden lopen
              uit elkaar, en dáár ontstaat het gelaagde, vloeibare beeld. De
              achterste laag is halfdoorzichtig en zie je alleen waar de
              voorste is teruggeweken. */}
          {/* De kleur gaat als inline CSS mee en niet als `fill`-attribuut.
              Een presentatie-attribuut met `var()` erin (fill="var(--x)")
              werkt in Chrome, maar WebKit is daar jarenlang wisselvallig in
              geweest -- en waar het faalt valt de vulling terug op zwart,
              dus dan staat er een zwarte balk op wit in plaats van koraal.
              Een inline `style` met var() is overal ondersteund. Het publiek
              van deze site is grotendeels iOS; dit is geen hypothetisch
              risico. */}
          <g className="sd-layer sd-back" style={{ fill: accent }}>
            <path d={WAVE} />
          </g>
          <g className="sd-layer sd-front" style={{ fill: accent }}>
            <path d={WAVE} transform="translate(0,-16)" />
          </g>
        </g>
      </svg>
    </div>
  )
}
