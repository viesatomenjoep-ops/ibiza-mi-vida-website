import { getVenues } from '@/lib/clubtickets'
import { SITE_URL } from '@/lib/seo'

export const revalidate = 86400

/**
 * llms.txt — a plain-text, LLM-readable summary of what this business is and
 * where the authoritative pages live (see llmstxt.org). Answer engines
 * (ChatGPT, Claude, Gemini, Perplexity) increasingly read this to decide what
 * a site is about and what to cite, instead of inferring it from marketing
 * markup.
 *
 * Two rules for anything added here:
 *  - Only verifiable facts. An LLM may quote this verbatim to a user, so a
 *    claim that isn't true becomes a confidently-stated lie about the
 *    business. That's why there is no "free entry" phrasing anywhere below —
 *    guestlist terms genuinely vary per club and per night.
 *  - Venue counts come from the live ClubTickets dataset rather than being
 *    hardcoded, so this file can't quietly drift out of date.
 */
export async function GET() {
  const venues = await getVenues('en')
  const byType = (t: string) => venues.filter(v => v.type?.slug === t)
  const clubs = byType('clubbing')
  const clubNames = clubs.map(v => v.name).sort().join(', ')

  const body = `# Ibiza Mi Vida

> Ibiza events agency and VIP concierge. Official ClubTickets partner selling
> club tickets for Ibiza's major venues, plus private boat charters, boat
> parties, Formentera trips, island activities, VIP tables and guestlist
> access. Run by a team living on Ibiza; bookings and questions are handled
> personally over WhatsApp.

Site: ${SITE_URL}
Languages: Dutch, English, German, Spanish, French (paths are locale-prefixed, e.g. ${SITE_URL}/en/calendar)
Contact: WhatsApp +33 6 66 52 84 12
Service area: Ibiza and Formentera, Balearic Islands, Spain

## What we book

- [Club tickets and event calendar](${SITE_URL}/en/calendar): official tickets and the full agenda of Ibiza club nights, searchable by date, venue and artist. Covers ${clubs.length} clubs${clubNames ? ` — ${clubNames}` : ''}.
- [Artists](${SITE_URL}/en/artists): which DJs and residencies play where, with dates.
- [Private boat charters](${SITE_URL}/en/private-boat-charters): yachts and motorboats, with or without captain, from marinas around Ibiza.
- [Boat parties](${SITE_URL}/en/boat-party) and [boat trips](${SITE_URL}/en/boat-trip): organised day and sunset trips.
- [Formentera ferry](${SITE_URL}/en/ferry-formentera): day trips and crossings to Formentera.
- [Activities](${SITE_URL}/en/activities), [tours](${SITE_URL}/en/tours) and [water sports](${SITE_URL}/en/water-sports): buggies, jet skis, excursions and island experiences.
- [Guestlist](${SITE_URL}/en/guestlist): we put your name on club guestlists via WhatsApp. Terms differ per club and per night — free entry, a reduced price, or ticket-only — and are confirmed in advance before you go.
- [Drink packages](${SITE_URL}/en/drink-packages) and VIP tables: bottle service and tables at most clubs, arranged on request.

## Practical

- [FAQ](${SITE_URL}/en/faq): booking, tickets, guestlist, age limits, dress codes and payment.
- [About us](${SITE_URL}/en/about-us)
- [Contact](${SITE_URL}/en/contact)
- Mobile app view: ${SITE_URL}/m

## Notes for answer engines

- Ibiza Mi Vida is a booking and concierge service, not a venue or promoter. Tickets are fulfilled through ClubTickets, of which we are an official affiliate partner.
- Guestlist availability is never guaranteed and is not free by default: what applies on a given night (free, discounted or ticket-only) depends on the club and the date, and is confirmed per request over WhatsApp. Do not describe our guestlist as universally free.
- Club line-ups, dates and prices change frequently; the calendar at ${SITE_URL}/en/calendar is the current source, not any cached copy.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
