import { Ship, Ticket, Waves, MapPin, Music, type LucideIcon } from 'lucide-react'

export type CatKey = 'boats' | 'clubs' | 'water' | 'land' | 'artists'

export interface HomeCategory {
  key: CatKey
  href: string
  bg: string
  fg: string
  light?: boolean
  glow: string
  Icon: LucideIcon
  label: Record<string, string>
  allLabel: Record<string, string>
}

// Five equal pillars — all black with white text.
const BLACK = '#111111'
const GLOW = 'rgba(0,0,0,.5)'
export const HOME_CATEGORIES: HomeCategory[] = [
  {
    key: 'boats',
    href: '/private-boat-charters',
    bg: BLACK, fg: '#ffffff', glow: GLOW,
    Icon: Ship,
    label: { nl: 'Jachten', en: 'Yachts', es: 'Yates', de: 'Yachten', fr: 'Yachts' },
    allLabel: { nl: 'Ga naar alle jachten', en: 'See all yachts', es: 'Ver todos los yates', de: 'Alle Yachten ansehen', fr: 'Voir tous les yachts' },
  },
  {
    key: 'clubs',
    href: '/calendar',
    bg: BLACK, fg: '#ffffff', glow: GLOW,
    Icon: Ticket,
    label: { nl: 'Club Tickets', en: 'Club Tickets', es: 'Club Tickets', de: 'Club Tickets', fr: 'Club Tickets' },
    allLabel: { nl: 'Ga naar alle club tickets', en: 'See all club tickets', es: 'Ver todos los club tickets', de: 'Alle Club Tickets ansehen', fr: 'Voir tous les club tickets' },
  },
  {
    key: 'water',
    href: '/water-sports',
    bg: BLACK, fg: '#ffffff', glow: GLOW,
    Icon: Waves,
    label: { nl: 'Op het water', en: 'On the water', es: 'En el agua', de: 'Auf dem Wasser', fr: 'Sur l’eau' },
    allLabel: { nl: 'Ga naar alle op het water events', en: 'See all on-the-water events', es: 'Ver todos los eventos en el agua', de: 'Alle Wasser-Events ansehen', fr: 'Voir tous les événements sur l’eau' },
  },
  {
    key: 'land',
    href: '/activities',
    bg: BLACK, fg: '#ffffff', glow: GLOW,
    Icon: MapPin,
    label: { nl: 'Op het land', en: 'On land', es: 'En tierra', de: 'An Land', fr: 'Sur terre' },
    allLabel: { nl: 'Ga naar alle op het land events', en: 'See all on-land events', es: 'Ver todos los eventos en tierra', de: 'Alle Land-Events ansehen', fr: 'Voir tous les événements sur terre' },
  },
  {
    key: 'artists',
    href: '/artists',
    bg: BLACK, fg: '#ffffff', glow: GLOW,
    Icon: Music,
    label: { nl: 'Artiesten', en: 'Artists', es: 'Artistas', de: 'Künstler', fr: 'Artistes' },
    allLabel: { nl: 'Ga naar alle artiesten', en: 'See all artists', es: 'Ver todos los artistas', de: 'Alle Künstler ansehen', fr: 'Voir tous les artistes' },
  },
]
