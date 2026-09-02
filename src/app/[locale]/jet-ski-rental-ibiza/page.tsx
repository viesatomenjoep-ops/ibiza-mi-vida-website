import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ChoiceCards, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'jet-ski-rental-ibiza'

/**
 * Jet ski spoke, hanging off the boat-rental pillar.
 *
 * The legal position is the single most searched thing about jet skis here and
 * the most often got wrong, so it sits in the opening paragraph rather than in
 * the FAQ: in Spain you need a licence to take a jet ski out alone, or you go
 * on a guided tour where the guide's qualification covers the group. Every
 * claim on this page stays on that side of the line — we do not tell anyone
 * they can ride unaccompanied without a licence, because they cannot.
 */

const price30 = RENTAL_PRICES.jetSki30.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jet Ski Rental in Ibiza',
    description:
      'Jet ski rental in Ibiza from San Antonio in 30-minute slots. Ride alone with a licence, or join a guided tour without one. Ages, routes and timing.',
    alternates: localizedAlternates('jet-ski-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Jet Ski Rental in Ibiza',
      description:
        'Jet ski rental in Ibiza from San Antonio, in 30-minute slots. Guided tours need no licence; riding alone does.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Jet ski rental in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza by boat', path: 'boats' },
  { name: 'Jet ski rental Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Do I need a licence to ride a jet ski in Ibiza?',
    a: 'To take one out on your own, yes — Spanish law requires a recognised personal watercraft or boat licence, and the rental base will ask to see it. Without a licence you can still ride, but only on a guided tour: a qualified guide leads the group and their licence covers everyone in it. That is the whole difference, and any operator telling you otherwise is putting you on the water illegally.',
  },
  {
    q: 'How much is 30 minutes on a jet ski in Ibiza?',
    a: 'Thirty minutes is the standard slot and the usual entry price on the island. What moves the figure is the machine and the format: a guided tour costs more than the same half hour riding on your own, because a guide and a second craft are in the water with you. Peak weeks in July and August sit at the top of the range. Message us with your date and we come back with the rate for that day.',
  },
  {
    q: 'Can two people share one jet ski?',
    a: 'Yes, on the two- and three-seat machines that make up most of the rental fleet here, and it is the cheaper way to do it for a couple. Only one of you drives — the licence or the guide requirement attaches to whoever is at the controls. Bases apply a combined weight limit, so a pair of adults on a small two-seater is sometimes refused.',
  },
  {
    q: 'What is the minimum age?',
    a: 'You must be 18 to drive. Passengers can be younger, but each base sets its own floor for who may ride pillion — often around 6 or 8, and always in a lifejacket sized for them. Bring ID for the driver: a booking in one name and a different person at the controls is where problems start.',
  },
  {
    q: 'What should I bring?',
    a: 'A swimsuit you do not mind soaking, a towel, and sunglasses with a strap or none at all. Sun cream goes on before you leave and will still wash off. Leave your phone on shore unless it is in a sealed floating case — every base has a box of drowned phones. The lifejacket is provided and wearing it is not optional.',
  },
  {
    q: 'What time of day is best?',
    a: 'Morning. The sea off San Antonio is flattest before about noon, and the afternoon sea breeze builds a short chop that makes a half hour harder work than it sounds. Late afternoon has the better light if you are there for photographs, but you will be riding into more swell. Book the earliest slot you can stand in July and August.',
  },
]

export default function JetSkiRentalIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Jet ski rental in Ibiza',
          description:
            'Jet ski rental from San Antonio, Ibiza, in 30-minute slots. Guided tours require no licence; riding unaccompanied does.',
          price: price30,
          path: 'jet-ski-rental-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Jet Ski Rental in Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Jet skis go out from San Antonio in 30-minute slots, which is the standard unit here and long
              enough to cover the bay and back.
              {price30 ? ` Prices start at €${price30} for 30 minutes.` : ''} The rule that decides your
              booking is legal, not commercial: in Spain you need a licence to ride alone, or you join a
              guided tour, where the guide's qualification covers the whole group and you need nothing.
            </p>
            <p className="mt-4">
              Most visitors take the guided option, and it is the better one for a first time out anyway —
              you get shown where the depth changes and where you are not allowed to open the throttle.
            </p>
          </>
        }
      />

      <ChoiceCards
        heading="Guided tour or free ride"
        locale={LOCALE}
        cards={[
          {
            title: 'Guided tour',
            meta: 'No licence needed · guide leads the group',
            body:
              'A qualified guide rides with you and their licence covers the group. You follow a set route, usually along the San Antonio coast towards the sunset cliffs. The only legal way to ride here without a licence of your own.',
            href: 'boats',
            cta: 'Ask about tours',
          },
          {
            title: 'Free ride',
            meta: 'Licence required · your own route inside a set zone',
            body:
              'Show a valid personal watercraft or boat licence and you take the machine out yourself, inside a marked area the base defines. More freedom, and you set the pace instead of following one.',
            href: 'boats',
            cta: 'What licences count',
          },
          {
            title: 'Two up',
            meta: 'One driver · passenger from about 6–8',
            body:
              'Two- and three-seat machines take a passenger, which halves the cost per person. Only the driver needs the licence or the guide. Bases apply a combined weight limit, so check when you book.',
            href: 'boat-party',
            cta: 'Group options',
          },
        ]}
      />

      <PriceTable
        heading="What a jet ski costs in Ibiza"
        locale={LOCALE}
        caption="Starting prices for jet ski rental"
        intro="Thirty minutes is the standard slot. Guided tours cost more than the same time riding alone, because a guide and a second machine go out with you. July and August sit at the top of the range."
        rows={[
          {
            label: 'Jet ski, 30 minutes',
            note: 'Standard slot, one machine',
            amount: RENTAL_PRICES.jetSki30.amount,
            unit: RENTAL_PRICES.jetSki30.unit.en,
          },
        ]}
      />

      <ItemGrid
        heading="Where you ride"
        intro="Everything leaves from San Antonio bay. The routes below are what the guided tours actually cover; a free ride stays inside a marked zone the base shows you on a chart before you go."
        columns={2}
        items={[
          {
            name: 'San Antonio bay',
            body:
              'The sheltered water you start in, and where the briefing happens. Flat in the morning, choppier once the afternoon breeze fills in. Speed is restricted close to the beaches and the base will tell you exactly where the line is.',
          },
          {
            name: 'Cala Bassa and Cala Comte',
            body:
              'South along the coast, past the headlands towards the two big west-coast beaches. The standard longer tour. You look at the coves from the water rather than landing — jet skis are not welcome on the swimming lines.',
          },
          {
            name: 'The sunset cliffs',
            body:
              'North-west of the bay, where the coast turns to rock. The best stretch for photographs and the reason the late slots sell out. More exposed, so it is the first route dropped when the wind gets up.',
          },
          {
            name: 'Towards Es Vedrà',
            body:
              'Only on longer guided tours, and only in settled conditions. It is a serious run down the west coast in open water, not a half-hour hop, and no base will send an unaccompanied first-timer that way.',
          },
        ]}
      />

      <TrustBlock
        heading="Before you book"
        locale={LOCALE}
        intro="Three things decide whether a jet ski booking goes smoothly, and all of them are settled before you arrive at the pontoon rather than on the day."
        points={[
          {
            title: 'The licence question',
            body:
              'Sort it when you book, not at the base. If nobody in your group holds a personal watercraft or boat licence, you need the guided format — there is no third option, and turning up hoping to talk your way onto a free ride wastes the slot.',
          },
          {
            title: 'Deposit and ID',
            body:
              'A deposit is held on a credit card in the driver\'s name and released after the machine comes back undamaged. Bring the physical card and photo ID. The driver named on the booking has to be the person who signs.',
          },
          {
            title: 'Weather',
            body:
              'Jet ski slots are cancelled more often than boats, because a small craft feels a chop a hull does not. Cancellations for weather come with a new slot or a refund, and the call is the base\'s.',
          },
          {
            title: 'What we do',
            body:
              'We check which bases have your slot free on the date you want, in the format your group can legally use, and answer over WhatsApp. If your group cannot ride the way you are picturing, we say so before you pay.',
          },
        ]}
      />

      <ProseSection
        heading="What we would tell a friend"
        paragraphs={[
          'Book the first slot of the morning. The difference between nine and three in the afternoon is not the price, it is whether you spend half an hour skimming flat water or slamming through a metre of wind chop. Everyone who books the afternoon slot in August learns this once.',
          'Half an hour is genuinely enough for a first time. It sounds short, and it is not: holding on at speed uses muscles you do not normally use, and most people are ready to stop at around twenty-five minutes. Book the shorter slot, and add a second one if you loved it.',
          'Do not bring the phone. If the shot matters, ask whether the guide carries a camera — most do — because the alternative is a phone in a pocket that is underwater within ten minutes.',
        ]}
      />

      <Proof locale={LOCALE} />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          {
            label: 'Boat rental in Ibiza',
            href: 'boats',
            body: 'The pillar page: with a skipper, with your own licence, or licence-free up to 15 hp.',
          },
          {
            label: 'Boat parties in Ibiza',
            href: 'boat-party',
            body: 'The other way to spend a day on the water, with a DJ and a crowd instead of a throttle.',
          },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="jet ski rental in Ibiza" />
    </>
  )
}
