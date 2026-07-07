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

// Five equal pillars — brand palette: blue, red, white, green, black.
export const HOME_CATEGORIES: HomeCategory[] = [
  {
    key: 'boats',
    href: '/private-boat-charters',
    bg: '#00A3FF', fg: '#ffffff', glow: 'rgba(0,163,255,.45)',
    Icon: Ship,
    label: { nl: 'Private Boats', en: 'Private Boats', es: 'Private Boats', de: 'Private Boats', fr: 'Private Boats' },
    allLabel: { nl: 'Ga naar alle private boats', en: 'See all private boats', es: 'Ver todos los private boats', de: 'Alle Private Boats ansehen', fr: 'Voir tous les private boats' },
  },
  {
    key: 'clubs',
    href: '/calendar',
    bg: '#E14D68', fg: '#ffffff', glow: 'rgba(225,77,104,.45)',
    Icon: Ticket,
    label: { nl: 'Club Tickets', en: 'Club Tickets', es: 'Club Tickets', de: 'Club Tickets', fr: 'Club Tickets' },
    allLabel: { nl: 'Ga naar alle club tickets', en: 'See all club tickets', es: 'Ver todos los club tickets', de: 'Alle Club Tickets ansehen', fr: 'Voir tous les club tickets' },
  },
  {
    key: 'water',
    href: '/water-sports',
    bg: '#ffffff', fg: '#0b0b0b', light: true, glow: 'rgba(0,0,0,.18)',
    Icon: Waves,
    label: { nl: 'Op het water', en: 'On the water', es: 'En el agua', de: 'Auf dem Wasser', fr: 'Sur l’eau' },
    allLabel: { nl: 'Ga naar alle op het water events', en: 'See all on-the-water events', es: 'Ver todos los eventos en el agua', de: 'Alle Wasser-Events ansehen', fr: 'Voir tous les événements sur l’eau' },
  },
  {
    key: 'land',
    href: '/activities',
    bg: '#14FF00', fg: '#0b0b0b', glow: 'rgba(20,255,0,.4)',
    Icon: MapPin,
    label: { nl: 'Op het land', en: 'On land', es: 'En tierra', de: 'An Land', fr: 'Sur terre' },
    allLabel: { nl: 'Ga naar alle op het land events', en: 'See all on-land events', es: 'Ver todos los eventos en tierra', de: 'Alle Land-Events ansehen', fr: 'Voir tous les événements sur terre' },
  },
  {
    key: 'artists',
    href: '/artists',
    bg: '#111111', fg: '#ffffff', glow: 'rgba(0,0,0,.5)',
    Icon: Music,
    label: { nl: 'Artiesten', en: 'Artists', es: 'Artistas', de: 'Künstler', fr: 'Artistes' },
    allLabel: { nl: 'Ga naar alle artiesten', en: 'See all artists', es: 'Ver todos los artistas', de: 'Alle Künstler ansehen', fr: 'Voir tous les artistes' },
  },
]
