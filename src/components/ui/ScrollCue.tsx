'use client'

import { ChevronDown } from 'lucide-react'

/**
 * A light, bouncing red down-chevron that hints "scroll down" — shown just above
 * the date once a day is picked (and above an event's dates when there are more).
 * Red matches the homepage Club Tickets tile (#E14D68).
 */
export function ScrollCue({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden>
      <ChevronDown size={30} strokeWidth={2.5} className="animate-bounce" style={{ color: '#E14D68', filter: 'drop-shadow(0 2px 6px rgba(225,77,104,0.35))' }} />
    </div>
  )
}
