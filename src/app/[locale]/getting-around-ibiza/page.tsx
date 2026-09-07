import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { MAP_CLUBS } from '@/data/ibiza-map-clubs'
import { venuePagePublished } from '@/lib/pending-venues'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'getting-around-ibiza'

/**
 * De week ná de aankomst. /ibiza-airport-transfer gaat over het uur na de
 * landing; deze pagina over de zes dagen erna, en dat is een andere vraag met
 * een ander antwoord.
 *
 * Net als de luchthavenpagina staan hier GEEN tarieven en GEEN lijnnummers:
 * taxiritten hebben seizoens- en nachttoeslagen, de buslijnen naar de stranden
 * rijden alleen in het seizoen, en een getal dat hier hardgecodeerd staat is
 * binnen één seizoen onwaar en blijft dan jaren staan. Afstanden en reistijden
 * zijn wél stabiel, dus die staan er wel.
 *
 * De ontbrekende cijfers staan als [[VERIFY]] in docs/seo/NIGHT-REPORT.md.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Getting Around Ibiza — Bus, Taxi or Car',
    description:
      'How to get around Ibiza: when a hire car pays for itself, when the bus is enough, and why the ride home at six in the morning decides your whole plan.',
    alternates: localizedAlternates('getting-around', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Getting Around Ibiza — Bus, Taxi or Car',
      description: 'Distances, options, and the ride home at six in the morning.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Getting around Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Getting around Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Do I need a car in Ibiza?',
    a: 'It depends on one thing: whether you will leave your resort more than twice a day. Staying in Playa d\'en Bossa or Ibiza Town and clubbing every night, a car is a parking problem you are paying for. Staying in the north, in Santa Eulalia, or anywhere you want to reach the west-coast beaches from, a car is cheaper than the taxis it replaces within about two days.',
  },
  {
    q: 'How big is Ibiza and how long does it take to cross?',
    a: 'Small enough that nothing is more than about 45 minutes away, and big enough that the difference matters at six in the morning. Ibiza Town to San Antonio is roughly half an hour, the airport to Ibiza Town about fifteen to twenty minutes, and the north coast from either town is around 40 to 45 minutes on slower roads.',
  },
  {
    q: 'Are there buses in Ibiza?',
    a: 'Yes, and they are genuinely useful for the main routes between Ibiza Town, San Antonio, Santa Eulalia and the airport, with extra seasonal routes to the busier beaches in summer. Line numbers and timetables change between seasons, so check the current schedule rather than an old blog. The thing that matters for a night out is the last departure, not the fare.',
  },
  {
    q: 'How do I get home from a club at six in the morning?',
    a: 'Decide before you go out. Taxis at closing time are a queue rather than a given, especially at the clubs that sit on a road between towns rather than in one. The reliable options are a pre-booked return, a discobus service running your night, or a designated driver. Improvising at six in the morning is the expensive version and it happens to somebody in every group.',
  },
  {
    q: 'Can I use Uber or Bolt in Ibiza?',
    a: 'Do not build a plan around it. Ride-hailing coverage on the island is limited and seasonal, and it is not a substitute for the taxi rank or a booked transfer the way it is in a mainland city. Where having a car waiting actually matters — a late arrival, a club on a road location — book it in advance instead of assuming an app will answer.',
  },
  {
    q: 'Should I rent a scooter or a quad?',
    a: 'A scooter is cheap, parks anywhere and is genuinely pleasant on the coast roads in daylight. It also puts you on a road shared with hire cars driven by people who arrived that morning, at night, possibly after a long day in the sun. Most of the island is fine to drive; the argument against a scooter here is other people, not the roads.',
  },
  {
    q: 'What about getting to Formentera?',
    a: 'By sea only — Formentera has no airport, and the fast ferry from Ibiza takes roughly thirty minutes. That makes it a day trip rather than a detour, and it is one of the few journeys here where the boat is the transport rather than the activity. Our Formentera ferry page covers the operators and crossings.',
  },
  {
    q: 'Is parking difficult in Ibiza?',
    a: 'In Ibiza Town and San Antonio on a summer evening, yes, and near the harbour it is its own project. Beaches vary: the popular west-coast bays fill by late morning in August. This is the real cost of a hire car and it is rarely the one people budget for — not the rental rate, the twenty minutes at each end.',
  },
]

const OPTIONS = [
  {
    name: 'Hire car',
    body:
      'Best value the moment you plan to leave your resort regularly, and the only option that makes the north coast, the west-coast bays and a road-location club practical on the same trip. Break-even against taxis arrives at roughly two return journeys a day. The cost nobody budgets for is parking.',
  },
  {
    name: 'Taxi',
    body:
      'Fine for short hops and the default from the airport rank. Metered with supplements that vary by time and luggage. The weakness is volume: closing time at a big club, or a bank of evening landings, turns a five-minute wait into forty.',
  },
  {
    name: 'Bus',
    body:
      'Genuinely useful between Ibiza Town, San Antonio, Santa Eulalia and the airport, with seasonal beach routes in summer. Cheap and reliable in daylight. Check the last departure before you rely on it for an evening — that is the number that matters, not the fare.',
  },
  {
    name: 'Pre-booked transfer',
    body:
      'A driver with your name at a price agreed in advance. Worth it for a group, a late landing, or the ride back from a club that sits on a road rather than in a town. This is what Simon arranges over WhatsApp.',
  },
  {
    name: 'Scooter',
    body:
      'Cheap, parks anywhere, and a good way to see the coast roads in daylight. The argument against it is the other traffic at night rather than the roads themselves.',
  },
  {
    name: 'Boat',
    body:
      'Not a joke on this island. A charter reaches bays that the roads do not, and the Formentera crossing is thirty minutes by fast ferry against no road at all. For a day out on the west coast it is often the better route.',
  },
]

/**
 * "Ibiza zonder auto" — beantwoord met de ligging van de clubs zelf.
 *
 * Het is een eigen zoekopdracht, en overal wordt hij beantwoord met een mening
 * ("je hebt echt een auto nodig") of met het tegenovergestelde, afhankelijk van
 * wat de schrijver verhuurt. Wij hebben de gegevens: onze eigen kaartdata weet
 * per club in welk gebied hij staat. Daaruit volgt het echte antwoord — het
 * hangt niet af van hoe avontuurlijk je bent maar van wáár je slaapt, en dat is
 * te tellen.
 *
 * De tellingen komen uit MAP_CLUBS en niet uit deze tekst. Verhuist een club of
 * komt er een bij, dan schuiven de getallen mee.
 *
 * Bewust geen buslijnnummers of vertrektijden: die wisselen per seizoen, de FAQ
 * hieronder zegt dat ook, en een verouderd lijnnummer is precies het soort
 * detail waarop iemand om zes uur 's ochtends strandt.
 */
/**
 * De clubs die we mogen noemen.
 *
 * `pending-venues.ts` is de enige plek die zegt welke clubs nog achter een
 * afspraak zitten. Die drie hier weglaten is geen cosmetiek: hun eigen pagina's
 * 404'en met opzet, en ze in nieuwe tekst opvoeren wekt precies de indruk die
 * we tot het akkoord niet willen wekken. Zodra de vlag omgaat, verschijnen ze
 * hier vanzelf en schuiven de tellingen mee.
 */
const KAART = MAP_CLUBS.filter((c) => !c.slug || venuePagePublished(c.slug))

const clubsIn = (...gebieden: string[]) =>
  KAART.filter((c) => gebieden.some((g) => c.area.toLowerCase().startsWith(g.toLowerCase())))

const SAN_ANTONIO = clubsIn('San Antonio')
const BOSSA = clubsIn("Playa d'en Bossa")
const STAD = clubsIn('Ibiza-Stad', 'Marina Botafoch')
const RIT_NODIG = KAART.filter(
  (c) => ![...SAN_ANTONIO, ...BOSSA, ...STAD].includes(c),
)
const noem = (lijst: typeof KAART) => lijst.map((c) => c.name).join(', ')

const CARLESS = [
  {
    name: `San Antonio — ${SAN_ANTONIO.length} clubs in the same town`,
    body:
      `${noem(SAN_ANTONIO)} are all in San Antonio or on the bay, so from a hotel in the centre the night is a walk. This is also the side with the sunset spots and the most daytime bus connections. The trade is the distance to the big rooms on the other side of the island — a journey you make twice in a night.`,
  },
  {
    name: `Playa d'en Bossa — ${BOSSA.length} clubs on one strip`,
    body:
      `${noem(BOSSA)} sit on the same strip, with the beach clubs that fill the afternoon on the same stretch of sand. Sleep on that strip and the night ends in a walk rather than a negotiation, and the airport is fifteen minutes away. You are then staying in the nightlife rather than near it.`,
  },
  {
    name: `Ibiza Town — ${STAD.length} clubs, plus everything that is not one`,
    body:
      `${noem(STAD)} are on this side of the harbour, though how far you walk depends on exactly where you sleep — Marina Botafoch is across the water from the old town. This is also where most bus routes meet, and where a rainy day is still a day.`,
  },
  {
    name: 'What you do need a ride for',
    body:
      RIT_NODIG.length
        ? `${noem(RIT_NODIG)} are in none of the places you stay — inland, or on a road between villages. For those nights, arrange the way back before you go out: a booked transfer, a discobus running your night, or a driver who is not drinking. The same applies by day to the west-coast bays and the north.`
        : 'The west-coast bays and the north of the island remain the argument for a car: buses run there in summer, but not at the hour you want to come back.',
  },
]

export default function GettingAroundIbizaPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Getting Around Ibiza — Bus, Taxi, Car or Boat"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Ibiza is small — the airport to Ibiza Town is fifteen to twenty minutes, Ibiza Town to San
              Antonio about half an hour, and the north coast around 45 minutes from either. Whether you
              need a hire car comes down to one question: will you leave your resort more than twice a
              day? If yes, a car beats taxis within about two days. If you are on the strip and out every
              night, it is a parking problem you are paying for.
            </p>
            <p className="mt-4">
              We deliberately publish no fares or bus line numbers here. Both carry seasonal and night
              supplements and change between summers, and a stale number on a page like this is worse
              than none. Distances do not change, so those are here.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="Six ways around, and when each one wins"
        items={OPTIONS}
      />

      {/* "Ibiza zonder auto" als eigen kop, met de tellingen uit de kaartdata.
          Staat vóór "The ride home decides everything", want dat stuk is het
          vervolg op dit antwoord en niet andersom. */}
      <ItemGrid
        heading="Ibiza without a car — can you?"
        intro={`Yes, and on most trips it is the cheaper answer — but it is decided by where you sleep, not by how adventurous you are. Of the ${KAART.length} clubs on our island map, ${SAN_ANTONIO.length} sit in San Antonio, ${BOSSA.length} on the Playa d'en Bossa strip and ${STAD.length} on the Ibiza Town side of the harbour. Base yourself in one of those three and a real part of the week ends on foot. What a car buys is the rest of the island: the west-coast bays, the north, and the rooms that sit on a road rather than in a town.`}
        items={CARLESS}
        columns={2}
      />

      <ProseSection
        heading="The ride home decides everything"
        paragraphs={[
          'Every transport decision on this island is really a decision about six in the morning. In daylight everything works — the buses run, taxis are available, the roads are quiet enough. At closing time, several thousand people leave one building at once, and the ones who did not think about it beforehand are the ones still standing there forty minutes later.',
          'This matters most for the clubs that sit on a road between two towns rather than inside one. Those venues have parking and space, which is why they can run the rooms they do, but nothing around them is walkable and the taxi supply at six is finite. A pre-booked return, a discobus running your night, or one person who is not drinking are the three answers. All three are decisions to make in daylight.',
          'The corollary is that where you stay is a transport decision too. Playa d’en Bossa and Ibiza Town let you walk home from at least some of the big nights; San Antonio and everywhere else do not. That single fact changes the real cost of a week more than the difference between two hotels does.',
        ]}
      />

      <ProseSection
        heading="Driving here, honestly"
        paragraphs={[
          'The roads are good and the distances are short, so driving on Ibiza is easy in itself. What is not easy is August: the main routes between Ibiza Town, the airport and San Antonio carry a lot of traffic, and every third car is being driven by someone who collected it that morning and is navigating by phone.',
          'Parking is the real tax. Ibiza Town in the evening and San Antonio on the sunset strip are both projects, and the popular west-coast beaches fill by late morning in peak season. Budget twenty minutes at each end rather than treating the drive time as the journey.',
          'And the obvious one that still needs saying: a hire car and a club night are two plans that do not combine unless somebody has volunteered not to drink. The Spanish limit is lower than many visitors assume, checks do happen, and "it is a short drive" is exactly the reasoning that goes wrong here.',
        ]}
      />

      <WhatsAppCta
        locale={LOCALE}
        body="Send Simon where you are staying and what you want to do that week, and he will tell you whether you need a car at all — including when the answer is that you do not. He also arranges private transfers, and the return from a club at closing time is the one worth booking in advance."
        prefill="Hi Simon, question about getting around Ibiza — I'm staying in "
      />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Ibiza airport transfers', href: 'ibiza-airport-transfer', body: 'The first hour: taxi rank, bus, private transfer or hire car.' },
          { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'All-inclusive hire through Wiber, five minutes from the terminal.' },
          { label: 'Ibiza nightlife guide', href: 'ibiza-nightlife', body: 'How the night runs, and why the return journey matters.' },
          { label: 'Formentera ferry', href: 'ferry-formentera', body: 'Thirty minutes by sea, and the only way there.' },
          { label: 'Ibiza areas', href: 'locations', body: 'Where to base yourself, and what that costs in travel time.' },
          { label: 'Ibiza tips', href: 'tips', body: 'Practical island advice from the local team.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="getting around Ibiza" />
    </>
  )
}
