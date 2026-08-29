/**
 * Shape of a single bookable event as passed from the server pages into the
 * client components that render event lists (HomeEventSlider, agenda pages).
 *
 * Previously declared inside EventPickerWheel.tsx — that calendar-modal
 * component was removed (it didn't work reliably), but the data shape it
 * defined is still the contract every event list uses, so it lives here now
 * with no component attached.
 */
export interface PickerEvent {
  id: string
  clubSlug: string
  clubName: string
  clubLogo?: string
  eventSlug: string
  eventName: string
  image?: string
  /** ISO yyyy-mm-dd */
  date: string
  price: number
  lineUp?: string
  href: string
  affLink?: string
}
