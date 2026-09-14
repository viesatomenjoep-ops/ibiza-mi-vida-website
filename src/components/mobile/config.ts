// Single place for the app's outbound contact points.

/** Bookings / drinks-packages concierge (same number the cart drawer uses). */
export const WA_BOOKINGS = '34657639800'

/** Guestlist host (Simon) — same number as the site's guestlist page. */
export const WA_GUESTLIST = '34657639800'

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
