'use client'

import { ExternalLink } from 'lucide-react'
import { ctLink } from '@/lib/ct-link'
import { getAiSource } from '@/lib/attribution'

interface EventTicketSelectorProps {
  id: string
  title: string
  date: string
  priceStr: string
  image?: string
  affLink?: string
  locale?: string
  /** Live: every tier for this date is sold out — disable the button. */
  soldOut?: boolean
}

/**
 * Ticketknop: rechtstreeks naar ClubTickets.
 *
 * Hier stond hetzelfde bevestigingsvenster als in EventCheckoutButton — twee
 * losse kopieën van dezelfde vertraging op het koopmoment. Allebei weg: een
 * extra klik die niets toevoegt aan wat de knop zelf al zegt, kost alleen
 * conversie.
 *
 * De link opent in een nieuw tabblad, dus de site blijft openstaan en de
 * bezoeker raakt zijn plek niet kwijt — dat is wat de waarschuwing overbodig
 * maakt. `noopener` erbij, anders kan de geopende pagina via window.opener aan
 * dit tabblad komen; geen `noreferrer`, want de verwijzende header wil je bij
 * een affiliatepartner niet weggooien.
 *
 * Blijft een button en geen anchor: de URL wordt op kliktijd opgebouwd met de
 * AI-bron uit sessionStorage, die de server niet kan zien. Als href tijdens
 * render zou dat een hydration-mismatch geven.
 */
export function EventTicketSelector({ affLink, locale = 'nl', soldOut = false }: EventTicketSelectorProps) {
  const go = () => {
    if (!affLink || soldOut) return
    window.open(ctLink(affLink, locale, 'event', undefined, getAiSource()), '_blank', 'noopener')
  }

  return (
    <button
      onClick={go}
      disabled={soldOut}
      className={`bg-ibiza-green text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all whitespace-nowrap shadow-md flex items-center justify-center gap-2 ${
        soldOut ? 'cursor-not-allowed opacity-40' : 'hover:brightness-95 hover:scale-105'
      }`}
    >
      Tickets
      <ExternalLink size={16} />
    </button>
  )
}
