import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import {
  HubHero,
  ItemGrid,
  PriceTable,
  ProseSection,
  Breadcrumbs,
  type Crumb,
  type PriceRow,
  type NamedItem,
} from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { VehicleCards } from '@/components/hub/VehicleCards'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates, pathFor } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { getAirportZonePrices, getPartnerVehicles } from '@/lib/partner-api'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'vip-transfer'

/**
 * VIP-transfer met chauffeur — de commerciële pagina.
 *
 * ── Waarom deze naast /ibiza-airport-transfer staat ───────────────────────
 * Die gids beantwoordt "hoe kom ik van het vliegveld naar mijn hotel" en noemt
 * bewust geen tarieven. Deze pagina beantwoordt "ik wil een privéauto met
 * chauffeur boeken" en draagt wél prijzen. Twee vragen, twee URL's. Omdat dat
 * dicht bij elkaar ligt, is de gids in dezelfde wijziging hertiteld naar zijn
 * smallere intentie — anders staan er twee eigen URL's op dezelfde zoekopdracht
 * en kiest Google er één, meestal niet degene die je wilde.
 *
 * ── Waarom hier geen enkel bedrag hardgecodeerd staat ─────────────────────
 * Alle prijzen komen live van het partnerplatform. Ligt dat eruit, of is er nog
 * geen partner aangesloten, dan komt er een lege lijst terug en verdwijnt de
 * tabel — samen met het Offer-blok in de structured data, want PriceTable en
 * SchemaMarkup lezen dezelfde nulls. Een vanaf-prijs in de lead verschijnt
 * alleen als er echt een goedgekeurd tarief tegenover staat. Dat is dezelfde
 * regel als in rental-prices.ts: liever geen getal dan een verzonnen getal.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza VIP Transfer with a Private Driver',
    description:
      // 140-160 tekens, en de titel onder de 44: staticMetadata plakt er
      // ' | Ibiza mi vida' achter en fitTitle kapt op 60 af. npm run check:onpage
      // ving dit meteen — de eerste versie werd live afgekapt op '…Airport Pi…'.
      'Private VIP transfers on Ibiza: a Mercedes V-Class with driver at a fixed price per zone, flight tracking and a meet-and-greet inside arrivals.',
    alternates: localizedAlternates('vip-transfer', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza VIP Transfer with a Private Driver',
      description:
        'Mercedes V-Class with driver, a fixed price per zone, flight tracking and meet-and-greet at Ibiza airport arrivals.',
      url: pathFor('vip-transfer', LOCALE),
    },
  }
}

const FAQS: Faq[] = [
  {
    q: 'What is the difference between a VIP transfer and a taxi?',
    a: 'A taxi runs on the meter and you queue for it at arrivals. A VIP transfer is booked in advance at a fixed price per zone, the driver tracks your flight, and he waits inside the terminal with your name. If your flight lands two hours late the car is still there — that is the part you are actually paying for in August.',
  },
  {
    q: 'Which vehicle will I get?',
    a: 'The standard car is a Mercedes V-Class: seven seats, five large cases, air conditioning that copes with an Ibiza afternoon, and enough room that four adults with luggage are not negotiating over the boot. Larger groups are quoted per vehicle, not per person.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'For July and August, as soon as you have your flight number. The island has a fixed number of licensed vehicles and the late-evening arrival slots go first. Outside high season a day or two is usually enough.',
  },
  {
    q: 'What happens if my flight is delayed?',
    a: 'The driver follows the flight, not the clock. Waiting time inside the tracked delay is included; the surcharge only starts if you are held up after landing, and that is the one number you will be told before it applies.',
  },
  {
    q: 'Can I be picked up somewhere other than the airport?',
    a: 'Yes. The fixed prices below are the airport routes because that is what most people ask for, but hotel-to-club, marina and villa pickups are quoted the same way — a price per vehicle, before you book.',
  },
  {
    q: 'Are child seats available?',
    a: 'Yes, and they must be requested when booking rather than mentioned to the driver on arrival. Spanish law requires an appropriate restraint for children under 135 cm, and a driver who does not have one cannot legally take you.',
  },
  {
    q: 'Who actually drives the car?',
    a: 'A licensed local operator, not Ibiza mi vida. We list vetted partners with their own VTC or taxi licence, and only vehicles they have published themselves appear here. The transport contract is with them.',
  },
  {
    q: 'How do I pay?',
    a: 'For now: on the day, to the driver, or by bank transfer in advance for larger bookings. Card payment through the site is being added — until it is, nobody will ask you for card details by email or WhatsApp.',
  },
]

const INCLUDED: NamedItem[] = [
  {
    name: 'Flight tracking',
    body: 'The pickup time follows your actual landing time. You do not need to warn anyone that you are late, and you are not charged for a delay you did not cause.',
  },
  {
    name: 'Meet and greet',
    body: 'The driver waits in the arrivals hall with your name, not in the car park. In August that difference is roughly twenty minutes of walking with luggage.',
  },
  {
    name: 'Fixed price per vehicle',
    body: 'The price is per car, not per passenger, and it is the price you were quoted — no meter, no night rate that appears at the end, no airport supplement on top.',
  },
]

export default async function Page() {
  // Beide roepen dezelfde getagde fetch aan; Next dedupliceert dat binnen één
  // render, dus dit is één netwerkverzoek per soort, geen twee.
  const [zonePrices, vehicles] = await Promise.all([
    getAirportZonePrices(),
    getPartnerVehicles(),
  ])

  const rows: PriceRow[] = zonePrices.map(p => ({
    label: `Ibiza Airport → ${p.to?.name ?? p.from?.name ?? 'Ibiza'}`,
    amount: p.price_eur,
    unit: 'per vehicle, one way',
    note: p.bidirectional ? 'Same price in the other direction' : undefined,
  }))

  const cheapest = rows.length ? Math.min(...rows.map(r => r.amount ?? Infinity)) : null
  const fromPrice = Number.isFinite(cheapest) ? (cheapest as number) : null

  // Eén array voor het zichtbare kruimelpad én de BreadcrumbList: markup die
  // een pad beschrijft dat de pagina niet toont, is precies de mismatch die de
  // structured-data-richtlijnen verbieden. De laatste kruimel is de huidige
  // pagina en draagt daarom geen pad.
  const crumbs: Crumb[] = [
    { name: 'Home', path: `/${LOCALE}` },
    { name: 'VIP transfers' },
  ]

  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={crumbs}
        faqs={FAQS.map(f => ({ q: f.q, a: f.a }))}
        product={{
          name: 'Ibiza VIP transfer with private chauffeur',
          description:
            'Private transfer on Ibiza in a Mercedes V-Class with driver, at a fixed price per zone.',
          // null wanneer er geen bevestigd tarief is: dan laat SchemaMarkup het
          // Offer-blok weg in plaats van een prijs te beloven die er niet is.
          price: fromPrice,
          path: pathFor('vip-transfer', LOCALE),
        }}
      />

      <Breadcrumbs items={crumbs} locale={LOCALE} />

      <HubHero
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        h1="Ibiza VIP Transfers with a Private Chauffeur"
        lead={
          <p>
            {fromPrice !== null ? (
              <>
                A private Mercedes V-Class with driver from Ibiza airport costs{' '}
                <strong>from €{fromPrice} per vehicle</strong>, one way, fixed before you
                book.
              </>
            ) : (
              <>
                A private Mercedes V-Class with driver, at a fixed price per zone agreed
                before you book.
              </>
            )}{' '}
            The driver tracks your flight and meets you inside arrivals, so a delayed
            landing costs you nothing and there is no taxi queue at two in the morning.
            Up to seven passengers and five large cases per car.
          </p>
        }
      />

      {rows.length > 0 && (
        <PriceTable
          locale={LOCALE}
          heading="Fixed prices from Ibiza airport"
          intro="Per vehicle, one way, including luggage. A night surcharge applies between midnight and 07:00 and is shown before you confirm — never added afterwards."
          caption="Fixed transfer prices per zone from Ibiza airport"
          rows={rows}
        />
      )}

      <ItemGrid
        heading="What the fixed price includes"
        items={INCLUDED}
        columns={3}
      />

      <VehicleCards
        heading="The cars"
        intro="Published by the operator themselves, with their own photos. Only vehicles from vetted partners with a valid licence appear here."
        vehicles={vehicles.slice(0, 6)}
      />

      <ProseSection
        heading="Why a transfer costs more than the meter says"
        paragraphs={[
          'A metered taxi from the airport to Playa d’en Bossa is cheaper than a fixed-price transfer, and anyone comparing the two numbers should know that. What the meter does not include is a car that is already waiting when your flight lands at 01:40, a driver who knows which villa gate actually opens, and a price that cannot move because traffic did.',
          'In July and August the taxi queue at arrivals regularly runs past forty minutes, and the island caps how many licences exist — so it is not a queue that resolves by waiting a little longer. If you are travelling with children, luggage or a group that has to stay together, the fixed price buys certainty rather than a car.',
        ]}
      />

      <WhatsAppCta
        locale={LOCALE}
        heading="Book, or ask first"
        body="Simon lives on the island and arranges the transfer with the operator directly. Send your flight number and where you are staying, and you get a fixed price back — not a quote form."
        prefill="Hi Simon, I would like a VIP transfer on Ibiza. My flight number is …"
      />

      <FaqAccordion locale={LOCALE} faqs={FAQS} heading="VIP transfers on Ibiza — your questions" />

      <AuthorByline locale={LOCALE} topic="VIP transfers on Ibiza" />
    </>
  )
}
