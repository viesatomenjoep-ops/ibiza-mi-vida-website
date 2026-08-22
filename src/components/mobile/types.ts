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
  venueLogo: string
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

export type SheetState =
  | { kind: 'event'; event: AppEvent }
  | { kind: 'venue'; venue: AppVenue }
  | { kind: 'datePicker' }
  | null

export type TabId = 'agenda' | 'events' | 'search' | 'map' | 'guestlist'
export type AgendaView = 'calendar' | 'explore' | 'upcoming'
