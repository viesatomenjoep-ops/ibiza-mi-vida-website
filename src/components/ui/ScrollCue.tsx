'use client'

import { ChevronDown } from 'lucide-react'

/**
 * A light, bouncing red down-chevron that hints "scroll down" — shown just above
 * the date once a day is picked (and above an event's dates when there are more).
 * Oranje volgt het accent van de Events & Tickets-sectie (Pantone Exuberant
 * Orange). Puur decoratief -- er staat geen tekst op, dus de felle bladkleur
 * kan hier onverdund.
 */
export function ScrollCue({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden>
      <ChevronDown size={30} strokeWidth={2.5} className="animate-bounce" style={{ color: 'var(--pantone-orange)', filter: 'drop-shadow(0 2px 6px rgba(232,96,60,0.35))' }} />
    </div>
  )
}
