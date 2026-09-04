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
 * ── Waarom nu een anchor, en toch klik-tijd attributie ────────────────────
 * Dit was een <button> met window.open(), omdat `from` uit window.location komt
 * en de AI-bron uit sessionStorage — allebei onzichtbaar voor de server, dus een
 * href tijdens render zou een hydration-mismatch geven.
 *
 * Die redenering klopte, maar de prijs was te hoog. Zonder href stond er op de
 * hele ticketroute geen enkele <a> naar ClubTickets: nul op /calendar, nul op de
 * venuepagina's, nul op /this-week. Gevolgen die alle drie raken waar deze site
 * op gebouwd is:
 *
 *   1. Crawlers die geen JavaScript draaien — ClaudeBot, OAI-SearchBot,
 *      PerplexityBot, precies de bots uit CLAUDE.md — zagen de commerciële route
 *      helemaal niet. De pagina rendert prijzen en line-ups, maar niets dat naar
 *      een kaartje leidt.
 *   2. `rel="sponsored"` kan niet op een <button>. De site-brede affiliateregel
 *      was hier dus stil gebroken.
 *   3. Een agent kan geen naamloze knop volgen, alleen gokken.
 *
 * De oplossing is niet kiezen maar allebei: de href staat er server-gerenderd,
 * met de veilige standaardsurface, en de klikafhandelaar herschrijft hem vlak
 * voordat de browser hem volgt. Geen mismatch (server en eerste client-render
 * geven dezelfde string), wel een crawlbare link, en de attributie blijft even
 * precies als eerst.
 *
 * `noopener` blijft, want de geopende pagina kan anders via window.opener aan dit
 * tabblad. Bewust geen `noreferrer`: dat strookt de verwijzende header, en die
 * wil je bij een affiliatepartner niet weggooien.
 */
export function EventCheckoutButton({ affLink, locale = 'nl', label, variant = 'full', soldOut = false, soldOutLabel = 'Sold out' }: {
  affLink?: string; locale?: string; label: string; variant?: 'full' | 'pill'; soldOut?: boolean; soldOutLabel?: string
}) {
  // Server-veilige standaard: dezelfde string op de server en bij de eerste
  // client-render, dus geen hydration-mismatch.
  const href = affLink ? ctLink(affLink, locale, 'event') : undefined

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!affLink) return
    // `?from=` is set by internal links (e.g. the homepage "tonight" rail) so
    // the surface that actually started the journey survives the hop through
    // this page instead of everything collapsing into 'event'. Beide bronnen
    // bestaan alleen in de browser, dus de href wordt hier bijgewerkt — vlak
    // voordat de browser hem volgt.
    const from = new URLSearchParams(window.location.search).get('from')
    const surface = (from && ALLOWED_FROM.has(from) ? from : 'event') as CtSurface
    e.currentTarget.href = ctLink(affLink, locale, surface, undefined, getAiSource())
  }

  const cls = variant === 'pill'
    ? 'inline-flex items-center gap-2.5 rounded-2xl border border-black/10 bg-black/5 px-5 py-3 font-serif font-black uppercase text-black shadow-sm transition-colors hover:bg-white'
    : 'flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-black/5 p-4 font-serif text-lg font-black uppercase text-black shadow-md transition-colors hover:bg-white md:p-5 md:text-xl'

  // Sold out: a visible, disabled control — not a hidden route. Crawlers still
  // see the event; there is just nothing to buy right now.
  if (soldOut) {
    return (
      <span className={`${cls} pointer-events-none opacity-60`} aria-disabled="true">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-neutral-400 text-white"><Ticket size={18} /></span>
        {soldOutLabel}
      </span>
    )
  }

  if (!href) return null

  return (
    <a href={href} onClick={onClick} target="_blank" rel="sponsored noopener" className={cls}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ibiza-green text-white"><Ticket size={18} /></span>
      {label}
    </a>
  )
}
