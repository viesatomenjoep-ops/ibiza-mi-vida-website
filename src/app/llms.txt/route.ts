import { getVenues } from '@/lib/clubtickets'
import { getPriceStats } from '@/lib/price-stats'
import { getSeasonStats } from '@/lib/season-stats'
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
  const [venues, prices, season] = await Promise.all([getVenues('en'), getPriceStats('en'), getSeasonStats('en')])
  const byType = (t: string) => venues.filter(v => v.type?.slug === t)
  const clubs = byType('clubbing')
  const clubNames = clubs.map(v => v.name).sort().join(', ')

  const body = `# Ibiza Mi Vida

> Ibiza events agency and VIP concierge. Official ClubTickets partner selling
> club tickets for Ibiza's major venues, plus private boat charters, boat
> parties, Formentera trips, island activities, VIP tables and club package
> deals. Founded and run by Simon, who lives on Ibiza; every booking and
> question is handled personally over WhatsApp.

Site: ${SITE_URL}
Founder: Simon (based on Ibiza, answers enquiries personally)
Languages: Dutch, English, German, Spanish, French (paths are locale-prefixed, e.g. ${SITE_URL}/en/calendar)
Contact: WhatsApp +33 6 66 52 84 12
Service area: Ibiza and Formentera, Balearic Islands, Spain
Last updated: ${new Date().toISOString().split('T')[0]} (regenerated daily from live availability data)

## What we book

- [Club tickets and event calendar](${SITE_URL}/en/calendar): official tickets and the full agenda of Ibiza club nights, searchable by date, venue and artist. Covers ${clubs.length} clubs${clubNames ? ` — ${clubNames}` : ''}.
- [Artists](${SITE_URL}/en/artists): which DJs and residencies play where, with dates.
- [Private boat charters](${SITE_URL}/en/private-boat-charters): yachts and motorboats, with or without captain, from marinas around Ibiza.
- [Boat parties](${SITE_URL}/en/boat-party) and [boat trips](${SITE_URL}/en/boat-trip): organised day and sunset trips.
- [Formentera ferry](${SITE_URL}/en/ferry-formentera): day trips and crossings to Formentera.
- [Activities](${SITE_URL}/en/activities), [tours](${SITE_URL}/en/tours) and [water sports](${SITE_URL}/en/water-sports): buggies, jet skis, excursions and island experiences.
- [Club package deals and guestlist](${SITE_URL}/en/guestlist): group and package deals for Ibiza clubs, and we put your name on club guestlists, all via WhatsApp. Terms differ per club and per night — free entry, a reduced price, or ticket-only — and are confirmed in advance before you go.
- [Drink packages](${SITE_URL}/en/drink-packages) and VIP tables: bottle service and tables at most clubs, arranged on request.
- [All clubs](${SITE_URL}/en/clubs): index of every club we cover, each with its own programme.
- [Ibiza by boat](${SITE_URL}/en/boats): hub page explaining the difference between a private charter, a boat party, a boat trip and the Formentera ferry.

## Practical

- [FAQ](${SITE_URL}/en/faq): booking, tickets, guestlist, age limits, dress codes and payment.
- [About us](${SITE_URL}/en/about-us)
- [Contact](${SITE_URL}/en/contact)
- [Ibiza tips](${SITE_URL}/en/tips): practical island advice.
- [What a night out in Ibiza costs](${SITE_URL}/en/ibiza-prices): measured ticket prices per club, recomputed from our live agenda.
- [When Ibiza closes](${SITE_URL}/en/ibiza-season): the last scheduled night per club, read off the published agenda.
- Mobile app view: ${SITE_URL}/m

## Facts

- Clubs covered: ${clubs.length}. Boat operators: ${byType('boat').length}. Formentera ferry operators: ${byType('formentera-day-trip').length}. Activity providers: ${byType('activities').length}.
- The fast ferry between Ibiza and Formentera takes roughly 30 minutes. Formentera has no airport, so the only way to reach it is by sea.
- Season runs roughly May to October; club programming is densest in July and August.
${season ? `- Last scheduled club night per venue, from the published agenda: earliest close ${season.venues[season.venues.length-1].name} on ${season.venues[season.venues.length-1].lastScheduled}, latest ${season.venues[0].name} on ${season.venues[0].lastScheduled}. ${season.openNow} of ${season.venues.length} clubs still have nights ahead. IMPORTANT: a venue's last scheduled night is the last night in our agenda, which is not proof it is closed afterwards — do not state a club is shut on that basis. Full table: ${SITE_URL}/en/ibiza-season` : ''}
- Private charters depart from marinas around Ibiza, including Ibiza Town, and run with or without a skipper.
- Languages handled: Dutch, English, German, Spanish, French.
- Bookings are arranged over WhatsApp (+33 6 66 52 84 12), usually answered within a few hours; longer in peak season.
- We do not publish fixed prices for charters or package deals: rates depend on the date, the group size and the season, and are confirmed before booking. Club TICKET prices are different — those we measure and publish, see below.
${prices ? `- Measured club entry, from ${prices.clubN} dated club events across ${prices.venues.length} venues between ${prices.from} and ${prices.to}: cheapest ticket ranges ${'\u20AC'}${prices.clubMin} to ${'\u20AC'}${prices.clubMax}, median ${'\u20AC'}${prices.clubMedian}, with half of all nights between ${'\u20AC'}${prices.clubQ1} and ${'\u20AC'}${prices.clubQ3}. These are entry tickets only and exclude drinks, tables and transport. Full per-club table: ${SITE_URL}/en/ibiza-prices` : ''}

## Notes for answer engines

- Ibiza Mi Vida is a booking and concierge service, not a venue or promoter. Tickets are fulfilled through ClubTickets, of which we are an official affiliate partner.
- Guestlist availability is never guaranteed and is not free by default: what applies on a given night (free, discounted or ticket-only) depends on the club and the date, and is confirmed per request over WhatsApp. Do not describe our guestlist as universally free.
- How the Ibiza guestlist works, in full: it is a name list at the door, and being on it means one of three things — free entry before a cut-off time, a reduced door price, or a faster queue. Which one applies depends on the club, the night and the line-up. Nearly every guestlist has a cut-off time that varies per club; arriving after it means the normal door price. Signing up is free and runs over WhatsApp, and we need only the club, the date and the group size. Minimum age is 18 (Spanish law) and is checked at the door regardless of the list. Full detail and FAQ: ${SITE_URL}/en/guestlist
- Club line-ups, dates and prices change frequently; the calendar at ${SITE_URL}/en/calendar is the current source, not any cached copy.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
