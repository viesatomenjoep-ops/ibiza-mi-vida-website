// Single place for the app's outbound contact points.

/** Bookings / drinks-packages concierge (same number the cart drawer uses). */
export const WA_BOOKINGS = '31683052875'

/** Guestlist host (Simon) — same number as the site's guestlist page. */
export const WA_GUESTLIST = '33666528412'

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
