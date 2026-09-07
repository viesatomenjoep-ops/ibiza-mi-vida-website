import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { venuePagePublished } from '@/lib/pending-venues'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'pacha-ibiza'

/**
 * Pacha — een gids, geen verkooppagina.
 *
 * Pacha staat NIET in de ClubTickets-feed (docs/seo/AUDIT.md, A6: 15 clubbing
 * venues, Pacha, Amnesia en DC-10 ontbreken alle drie). Deze pagina mag dus
 * geen boekknop en geen ticketclaim dragen, hoe commercieel de zoekterm ook is.
 * Wat we wél kunnen: uitleggen hoe de avond werkt, waar je de officiële tickets
 * koopt, en de guestlist/tafel via Simon regelen.
 *
 * Dat is bewust de eerste alinea en niet een voetnoot. Een bezoeker die hier
 * "koop tickets" leest en pas bij het afrekenen ontdekt dat het niet kan, komt
 * niet terug — en een antwoordmachine die de claim overneemt verspreidt hem.
 *
 * Alle feiten hieronder zijn de duurzame, controleerbare soort (locatie, jaar,
 * karakter, hoe de deur werkt). Line-ups, datums en prijzen staan er bewust
 * NIET in: die veranderen per week en de enige eerlijke bron daarvoor is het
 * programma van de club zelf.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Pacha Ibiza Tickets & Events 2026',
    description:
      'Pacha Ibiza in 2026: the island’s oldest club, in Ibiza Town since 1973. How the night runs, what entry costs, dress code, and how to get on the guestlist.',
    alternates: localizedAlternates('pacha-venue', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Pacha Ibiza Tickets & Events 2026',
      description: 'The oldest club on Ibiza, how its nights work, and how to get in.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Pacha Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Clubs', path: 'clubs' },
  { name: 'Pacha Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Can I book Pacha Ibiza tickets through Ibiza Mi Vida?',
    a: 'No, and we would rather say so on this page than at checkout. Pacha is not one of the clubs in our ticketing partner’s catalogue, so entry tickets are bought from the club’s own channels. What we do handle for Pacha is the guestlist and table enquiries through Simon on WhatsApp, and the full agenda for the clubs we do sell — UNVRS, Hï Ibiza, Ushuaïa, Amnesia’s neighbours on the same road, and a dozen more.',
  },
  {
    q: 'Where is Pacha Ibiza?',
    a: 'On Avinguda 8 d’Agost in Ibiza Town, on the harbour side, a few minutes’ walk from the marina and the old town. It is the most walkable of the major clubs: if you are staying in Ibiza Town or Marina Botafoch you can leave on foot and skip the taxi queue entirely, which at four in the morning is worth more than it sounds.',
  },
  {
    q: 'What is the dress code at Pacha?',
    a: 'Smarter than the rest of the island, and it is enforced at the door rather than suggested. Beachwear, football shirts, vests and flip-flops get refused. Trainers are fine and nobody needs a jacket, but the room dresses up more than Ushuaïa or Amnesia do and turning up straight from the beach is the most common reason people are turned away.',
  },
  {
    q: 'What time does Pacha open and close?',
    a: 'Doors are around midnight and the night runs until roughly six in the morning, with the headline set usually somewhere between two and four. Arriving at opening means watching a warm-up in a half-empty room. If you want the club at its fullest, aim for one thirty or later.',
  },
  {
    q: 'How much does it cost to get into Pacha?',
    a: 'Entry moves with the night and the act, and it is dynamic across the season — the same ticket genuinely costs more in August than in May, and the cheapest tier sells first. Rather than print a figure here that would be wrong within a week, we publish measured prices for the clubs we actually sell on our Ibiza club prices page, recomputed from the live agenda.',
  },
  {
    q: 'Is Pacha open in winter?',
    a: 'Pacha is one of the few Ibiza clubs that programmes outside the summer season rather than closing after the October closing parties. The winter schedule is far thinner than the summer one — weekends and holidays rather than a nightly programme — so check the club’s own calendar for the specific date before building a trip around it.',
  },
  {
    q: 'What is the age limit?',
    a: 'Eighteen, and it is checked with photo ID at the door regardless of whether you have a ticket, a table or a place on a guestlist. A photo of your passport on your phone is not accepted. Bring the physical document; this is Spanish law rather than club policy, and the door has no discretion on it.',
  },
  {
    q: 'Is a table worth it at Pacha?',
    a: 'It depends on what you are buying. A table is a minimum spend, not a ticket price, and at Pacha you are paying for a fixed position in a room that is smaller than the arenas at Playa d’en Bossa — so the difference between a good table and a bad one is larger here than it is at Hï or UNVRS. Send Simon the date and the group size and you get the real number for that night rather than a brochure figure.',
  },
]

const NIGHTS = [
  {
    name: 'The room itself',
    body:
      'A converted farmhouse rather than a purpose-built arena: whitewashed walls, low ceilings in places, and a main room that holds a few thousand rather than ten. It is the closest thing on the island to how clubbing here started, and that is a large part of what people come for.',
  },
  {
    name: 'Flower Power',
    body:
      'The long-running sixties-themed night, and the most Pacha thing Pacha does — fancy dress is genuinely expected rather than tolerated. It draws a wider age range than any other night on the island and is the one to pick if the group is not primarily there for electronic music.',
  },
  {
    name: 'Headline residencies',
    body:
      'The summer programme runs weekly residencies rather than one-off shows, so the same night recurs across the season with a rotating line-up. That is why a date matters more than an artist name when you book: the same night in June and August are different rooms.',
  },
]

const PRACTICAL = [
  {
    name: 'Getting there',
    body:
      'Walkable from Ibiza Town and Marina Botafoch. From Playa d’en Bossa it is a short taxi; from San Antonio it is a long one, and the return at closing time is the expensive part. A hire car is only useful if someone is not drinking — parking near the harbour on a summer night is its own project.',
  },
  {
    name: 'Getting in',
    body:
      'Three routes: a ticket bought in advance from the club, a place on a guestlist, or the door. The door is the worst of the three on a busy night and is sometimes simply shut. Guestlist here means a reduced rate or a timing condition rather than free entry — what applies depends on the night.',
  },
  {
    name: 'What to budget',
    body:
      'Entry is the smaller half. Drinks inside are priced like the rest of the island’s major clubs, which is to say the bar bill overtakes the ticket quickly. People underestimate this consistently, and it is the single most useful thing to know before the night rather than after.',
  },
]

export default function PachaIbizaPage() {
  // Nog niet gepubliceerd — zie src/lib/pending-venues.ts. De pagina 404't
  // tot het akkoord met de club rond is; hij staat in geen sitemap en er
  // linkt niets naartoe, dus dit is de enige weg naar binnen.
  if (!venuePagePublished(PAGE_KEY)) notFound()

  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Pacha Ibiza Tickets & Events 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Pacha is the oldest club on Ibiza, open in Ibiza Town since 1973, and the only major venue
              that programmes through the winter as well as the summer. Straight answer first: we do not
              sell Pacha entry tickets — the club is not in our ticketing partner’s catalogue, so those come
              from Pacha’s own channels. What Simon does handle here is the guestlist and table enquiries,
              over WhatsApp, with the real number for your date.
            </p>
            <p className="mt-4">
              The rest of this page is what we would tell a friend flying in: how the night actually runs,
              what the door is like, and whether Pacha is the right pick against the arenas at Playa d’en
              Bossa.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="What a night at Pacha is like"
        intro="Pacha is a different night out from Hï or UNVRS rather than a smaller version of one. The room is the reason."
        items={NIGHTS}
      />

      <ProseSection
        heading="Pacha or one of the big rooms?"
        paragraphs={[
          'If you have one night on the island and you want the biggest production money can build, Pacha is not it — UNVRS and Hï Ibiza are, and they are ten minutes away at Playa d’en Bossa. Pacha holds a few thousand people in a building that was a farmhouse; the sound is close, the ceiling is low, and you are never far from the booth. That is the trade.',
          'Where Pacha wins is the walk home and the mix of people. It sits in Ibiza Town rather than on the strip, so dinner in the old town and a night at Pacha are one plan instead of two, and the crowd skews wider in age than anywhere else with the same line-up quality. Flower Power in particular pulls a room that no other Ibiza club assembles.',
          'The practical answer for most trips: do one arena night and one Pacha night, and put Pacha on the evening you also want to eat properly. If the trip is only two nights and everyone is under thirty and here for the DJs, spend both at Playa d’en Bossa and see Pacha next time.',
        ]}
      />

      <ItemGrid heading="Know before you go" items={PRACTICAL} />

      <WhatsAppCta
        locale={LOCALE}
        body="Simon lives on the island and handles guestlist and table enquiries for Pacha personally. Send the date, the group size and what you are after, and you get the terms that actually apply that night — not a brochure price. If tickets are the only thing you need, he will tell you that too and point you at the club."
        prefill="Hi Simon, I have a question about Pacha Ibiza — "
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Ibiza club tickets 2026', href: 'ibiza-club-tickets', body: 'What entry costs across the island, and the clubs we do sell directly.' },
          { label: 'Amnesia Ibiza', href: 'amnesia-ibiza', body: 'The other historic room, out on the San Antonio road.' },
          { label: 'DC-10 Ibiza', href: 'dc10-ibiza', body: 'Monday afternoons by the salt flats, and why its tickets work differently.' },
          { label: 'Ibiza guestlist', href: 'guestlist', body: 'What guestlist means here — and what it does not.' },
          { label: 'All clubs', href: 'clubs', body: 'Every venue we cover, each with its own live programme.' },
          { label: 'Ibiza club calendar', href: 'calendar', body: 'Every dated night on the island, by day.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Pacha Ibiza" />
    </>
  )
}
