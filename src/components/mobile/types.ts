// Serialized, client-safe shapes for the /m app shell. The server page maps the
// full JSON dataset down to exactly what the screens render — keeps the RSC
// payload small (hundreds of events, a dozen fields each, nothing nested).

export interface AppEvent {
  id: string
  /** yyyy-MM-dd */
  date: string
  /** HH:mm if the source date carried a time, else undefined — never invented */
  time?: string
  name: string
  venueName: string
  venueSlug: string
  venueTypeSlug: string
  cover: string
  /** lowest advertised price in €, 0 = unknown ("from" pricing) */
  price: number
  lineUp: string
  affLink: string
}

export interface AppVenue {
  slug: string
  name: string
  typeSlug: string
  isDayClub: boolean
  whitelogo: string
  cover: string
  picture: string
  activeEvents: number
}

export interface AppArtist {
  slug: string
  name: string
  image: string
  venueName: string
  href: string
}

export interface AppBoat {
  slug: string
  name: string
  model: string
  image: string
  marina: string
  pax: number
  priceFrom: number
}

export type SheetState =
  | { kind: 'event'; event: AppEvent }
  | { kind: 'venue'; venue: AppVenue }
  | { kind: 'artist'; artist: AppArtist }
  | { kind: 'boat'; boat: AppBoat }
  | { kind: 'datePicker'; onPick: (iso: string) => void; selected?: string; min?: string; max?: string }
  | null

/** Bottom-nav tabs — 6 total, rendered as two rows of 3 (see BottomNav). */
export type TabId = 'agenda' | 'events' | 'boats' | 'search' | 'map' | 'guestlist'
export type AgendaView = 'calendar' | 'explore' | 'upcoming'

/** The trip-planner's three modes, reached via a banner CTA (not a nav icon). */
export type PlannerMode = 'planner' | 'surprise' | 'swipe'
