'use client'

import { Ticket } from 'lucide-react'
import { ctLink, type CtSurface } from '@/lib/ct-link'
import { getAiSource } from '@/lib/attribution'

// Allow-list: `from` comes off the URL, so it is untrusted input and must never
// be reflected into an outbound link unchecked.
const ALLOWED_FROM = new Set(['homepage-tonight', 'homepage-featured', 'homepage-deals', 'calendar', 'venue', 'artist', 'agenda', 'app'])

/**
 * Afrekenknop: rechtstreeks naar ClubTickets.
 *
 * ── Waarom de tussenstap eruit is ─────────────────────────────────────────
 * Hier stond een bevestigingsvenster ("Klaar om af te rekenen?") tussen de
 * knop en de winkel. Dat is een extra klik op precies het moment dat iemand
 * besloten heeft te kopen, en het vertelde niets wat de knop zelf niet al zei.
 * Elke tussenstap op een koopmoment kost conversie, en dit was er een zonder
 * tegenprestatie.
 *
 * Wat de bezoeker verliest is de waarschuwing dat hij de site verlaat. Dat is
 * hier acceptabel: de link opent in een nieuw tabblad, dus de site blijft
 * gewoon openstaan en je kunt terug zonder je plek kwijt te raken.
 *
 * ── Waarom een button en geen anchor ──────────────────────────────────────
 * De URL kan pas op kliktijd worden opgebouwd: `from` komt uit
 * window.location en de AI-bron uit sessionStorage, en die kan de server geen
 * van beide zien. Als href tijdens render zou dat op elke ticketknop een
 * hydration-mismatch geven. window.open() in een directe klikafhandelaar geldt
 * als gebruikersgebaar, dus popupblokkers grijpen niet in.
 *
 * `noopener` staat erbij omdat de geopende pagina anders via window.opener aan
 * dit tabblad kan komen. Bewust geen `noreferrer`: dat zou de verwijzende
 * header strippen, en die wil je bij een affiliatepartner niet weggooien.
 */
export function EventCheckoutButton({ affLink, locale = 'nl', label, variant = 'full' }: {
  affLink?: string; locale?: string; label: string; variant?: 'full' | 'pill'
}) {
  const go = () => {
    if (!affLink) return
    // `?from=` is set by internal links (e.g. the homepage "tonight" rail) so
    // the surface that actually started the journey survives the hop through
    // this page instead of everything collapsing into 'event'.
    const from = new URLSearchParams(window.location.search).get('from')
    const surface = (from && ALLOWED_FROM.has(from) ? from : 'event') as CtSurface
    window.open(ctLink(affLink, locale, surface, undefined, getAiSource()), '_blank', 'noopener')
  }

  const cls = variant === 'pill'
    ? 'inline-flex items-center gap-2.5 rounded-2xl border border-black/10 bg-black/5 px-5 py-3 font-serif font-black uppercase text-black shadow-sm transition-colors hover:bg-white'
    : 'flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-black/5 p-4 font-serif text-lg font-black uppercase text-black shadow-md transition-colors hover:bg-white md:p-5 md:text-xl'

  return (
    <button onClick={go} className={cls}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ibiza-green text-white"><Ticket size={18} /></span>
      {label}
    </button>
  )
}
