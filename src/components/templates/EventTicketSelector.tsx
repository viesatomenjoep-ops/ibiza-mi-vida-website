'use client'

import { ExternalLink } from 'lucide-react'
import { ctLink, type CtSurface } from '@/lib/ct-link'
import { getAiSource } from '@/lib/attribution'
import { trackOutbound } from '@/lib/track-outbound'

// Allow-list: `from` komt van de URL en is dus onvertrouwde invoer — nooit
// ongecontroleerd in een uitgaande link reflecteren. Zelfde lijst als in
// EventCheckoutButton.
const ALLOWED_FROM = new Set(['homepage-tonight', 'homepage-featured', 'homepage-deals', 'calendar', 'venue', 'artist', 'agenda', 'app'])

interface EventTicketSelectorProps {
  id: string
  title: string
  date: string
  priceStr: string
  image?: string
  affLink?: string
  locale?: string
}

/**
 * Ticketknop in de datumkaart: rechtstreeks naar ClubTickets.
 *
 * ── Waarom dit geen <button> met window.open meer is ──────────────────────
 * Dit was de laatste plek op de ticketroute die nog `window.open(url, '_blank',
 * 'noopener')` deed, en dat is ook precies waar gemeld werd dat de knop niets
 * doet. Zodra je een derde argument meegeeft, vraagt `window.open` volgens de
 * specificatie om een POPUP-venster in plaats van een tabblad — en een popup is
 * wat browsers en blokkers tegenhouden. Er komt geen foutmelding: er gebeurt
 * niets. Op de telefoon en in Safari is dat het vaakst.
 *
 * Diezelfde knop brak ook de drie regels uit CLAUDE.md die op de afrekenknop
 * staan: `rel="sponsored"` kan niet op een <button>, een crawler zonder
 * JavaScript zag hier geen route naar een kaartje, en een agent kan een
 * naamloze knop niet volgen. EventCheckoutButton was hier al voor omgezet;
 * deze kopie is toen blijven staan.
 *
 * De oplossing is dezelfde als daar, en het is niet kiezen maar allebei: de
 * href staat er server-gerenderd met de veilige standaardsurface, en de
 * klikafhandelaar herschrijft hem vlak voordat de browser hem volgt. `from`
 * (uit de URL) en de AI-bron (uit sessionStorage) bestaan alleen in de
 * browser, dus zo blijft de attributie even precies zonder dat server en
 * eerste client-render uit elkaar lopen.
 *
 * `noopener` blijft — anders kan de geopende pagina via window.opener aan dit
 * tabblad. Bewust géén `noreferrer`: dat strookt de verwijzende header, en die
 * wil je bij een affiliatepartner niet weggooien.
 */
export function EventTicketSelector({ affLink, locale = 'nl', title, priceStr }: EventTicketSelectorProps) {
  // Server-veilige standaard: dezelfde string op de server en bij de eerste
  // client-render.
  const href = affLink ? ctLink(affLink, locale, 'event') : undefined

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!affLink) return
    const from = new URLSearchParams(window.location.search).get('from')
    const surface = (from && ALLOWED_FROM.has(from) ? from : 'event') as CtSurface
    e.currentTarget.href = ctLink(affLink, locale, surface, undefined, getAiSource())
    // Deze klik werd tot nu toe helemaal niet gemeten: window.open liep buiten
    // trackOutbound om, dus in GA4 bestond de belangrijkste klik van de
    // datumkaart niet.
    trackOutbound({
      partner: 'ClubTickets',
      surface,
      item: title,
      value: Number(String(priceStr).match(/\d+/)?.[0]) || undefined,
    })
  }

  // Geen link, geen knop: een knop die niets kan doen is erger dan geen knop.
  if (!href) return null

  return (
    <a
      href={href}
      onClick={onClick}
      target="_blank"
      rel="sponsored noopener"
      className="bg-ibiza-green text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:brightness-95 hover:scale-105 whitespace-nowrap shadow-md flex items-center justify-center gap-2"
    >
      Tickets
      <ExternalLink size={16} />
    </a>
  )
}
