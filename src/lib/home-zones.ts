/**
 * De vier werelden van de homepage, als één bron voor id + accentkleur + naam.
 *
 * Stond eerder als losse `ZONES`-array binnen HomePageClient.tsx, met een
 * kleurstip die alleen dáár gebruikt werd. Nu de sticky categorienav er ook
 * naar leest (dezelfde vier namen, dezelfde volgorde, dezelfde ankers) is één
 * bron nodig — twee kopieën van dezelfde vier zones is precies hoe een naam of
 * een anker tussen de heropills en de sticky balk uit elkaar gaat lopen.
 */
export interface HomeZoneDef {
  id: string
  /** Accentkleur van deze wereld — dezelfde als de bies in het hoofdmenu. */
  accent: string
  naam: Record<string, string>
}

export const HOME_ZONES: HomeZoneDef[] = [
  { id: 'zone-events', accent: '#ECC5C6', naam: { nl: 'Events & Tickets', en: 'Events & Tickets', de: 'Events & Tickets', es: 'Eventos y entradas', fr: 'Événements & billets' } },
  { id: 'zone-water', accent: '#8A9DB1', naam: { nl: 'Private Boat Rental', en: 'Private Boat Rental', de: 'Private Boat Rental', es: 'Private Boat Rental', fr: 'Private Boat Rental' } },
  { id: 'zone-island', accent: '#F5E9E7', naam: { nl: 'On the land activities', en: 'On the land activities', de: 'On the land activities', es: 'On the land activities', fr: 'On the land activities' } },
  { id: 'zone-wateract', accent: '#C1C0C2', naam: { nl: 'On the water activities', en: 'On the water activities', de: 'On the water activities', es: 'On the water activities', fr: 'On the water activities' } },
]
