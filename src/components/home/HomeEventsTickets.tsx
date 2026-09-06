'use client'

import type { PickerEvent } from '@/lib/picker-event'
import { HomeWorld, type WereldKaart } from './HomeWorld'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('Events & Tickets', 'Events & Tickets', 'Events & Tickets', 'Eventos y entradas', 'Événements & billets'),
  tekst: T(
    'Elke clubnacht van het seizoen, met live prijzen en line-ups. Kies je avond en reken direct af via ClubTickets.',
    'Every club night of the season, with live prices and line-ups. Pick your night and check out via ClubTickets.',
    'Jede Clubnacht der Saison, mit Live-Preisen und Line-ups. Wähl deinen Abend und buche direkt über ClubTickets.',
    'Cada noche de club de la temporada, con precios y line-ups en vivo. Elige tu noche y reserva vía ClubTickets.',
    'Chaque soirée club de la saison, avec prix et line-ups en direct. Choisissez votre soirée et réservez via ClubTickets.',
  ),
  knop: T('Bekijk de clubagenda', 'See the club calendar', 'Zum Clubkalender', 'Ver la agenda de clubs', "Voir l'agenda des clubs"),
}

/**
 * Wereld 01: Events & Tickets. Hier landt de rode knop uit de hero.
 *
 * De waaier toont de flyers van de drie eerstvolgende clubavonden uit de
 * feed, dus de sectie kan niet verouderen: schuift de agenda, dan schuift de
 * waaier mee.
 */
export function HomeEventsTickets({
  events,
  locale = 'nl',
  base,
}: {
  events: PickerEvent[]
  locale?: string
  base: string
}) {
  const kaarten: WereldKaart[] = []
  const gezien = new Set<string>()
  for (const e of events) {
    if (!e.image || gezien.has(e.eventSlug)) continue
    gezien.add(e.eventSlug)
    kaarten.push({ href: e.href, image: e.image, alt: e.eventName })
    if (kaarten.length === 3) break
  }

  return (
    <HomeWorld
      id="zone-events"
      nummer="01"
      kicker={t(L.kicker, locale)}
      titel={t(L.titel, locale)}
      tekst={t(L.tekst, locale)}
      knop={t(L.knop, locale)}
      href={`${base}/calendar`}
      kaarten={kaarten}
    />
  )
}
