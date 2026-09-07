import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'ibiza-club-dress-code'

/**
 * Dresscode — de vraag die op elke clubpagina in de FAQ staat en nergens een
 * eigen antwoord had.
 *
 * Bewust geen lijst per club met "smart casual" erachter. Die formulering zegt
 * niets en is precies wat elke andere pagina op internet erover schrijft. Wat
 * mensen willen weten is wat er wél wordt geweigerd, en dat is een korte,
 * concrete lijst die op het hele eiland ongeveer hetzelfde is — met twee
 * uitzonderingen die er echt uit springen.
 *
 * Geen enkel clubspecifiek deurbeleid staat hier als harde regel: dat wisselt
 * per avond en per portier, en een stellige claim daarover is een belofte die
 * wij aan de deur niet waar kunnen maken. Wat er staat is het patroon, met de
 * uitzonderingen erbij.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza Club Dress Code 2026',
    description:
      'What actually gets you refused at an Ibiza club door: beachwear, football shirts and flip-flops. Trainers are fine, nobody needs a jacket. Plus the exceptions.',
    alternates: localizedAlternates('dress-code', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza Club Dress Code 2026',
      description: 'What gets refused at the door, and what genuinely does not matter.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza club dress code' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza nightlife', path: 'ibiza-nightlife' },
  { name: 'Dress code' },
]

const FAQS: Faq[] = [
  {
    q: 'What is the dress code for Ibiza clubs?',
    a: 'There is no formal dress code at most Ibiza clubs, but there is a refusal list and it is short: beachwear, swimwear, football shirts, vests and flip-flops. Everything else is broadly fine. Trainers are accepted everywhere, shorts are accepted at most venues, and nobody needs a jacket or a collar. The clubs care far more about how you arrive than what you are wearing.',
  },
  {
    q: 'Can I wear trainers to an Ibiza club?',
    a: 'Yes, at every major club on the island, and most of the room will be in them. This is the single most common worry and the least justified one. What matters is that they are shoes rather than beach footwear — trainers in, flip-flops and sliders out. If anything, trainers are the sensible choice for six hours on a dancefloor.',
  },
  {
    q: 'Can I wear shorts to an Ibiza club?',
    a: 'At most venues yes, especially the open-air and daytime ones where the room is dressed for heat anyway. The dinner-show venues are where shorts start being a problem, and a smarter room like the historic clubs in town reads them as under-dressed even when the door lets them through. If you only pack one option for a smarter night, make it trousers.',
  },
  {
    q: 'Do Ibiza clubs turn people away?',
    a: 'Yes, and clothing is rarely the real reason. The overwhelming majority of refusals are for arriving too drunk, arriving in a large single-sex group with no ticket, or arriving after a guestlist cut-off and arguing about it. Clothing refusals happen mostly to people who came straight from the beach and did not change.',
  },
  {
    q: 'Is there a dress code at the beach clubs?',
    a: 'Effectively the opposite one. Beach clubs run in daylight and swimwear is the point, with a cover-up for the restaurant area. The thing to plan is the handover: if a beach-club afternoon rolls into a club night, you need somewhere to change, because what works at four in the afternoon is exactly what gets refused at midnight.',
  },
  {
    q: 'What should women wear to an Ibiza club?',
    a: 'Whatever you would wear to a good night out at home, with one adjustment: you will be standing and dancing for five or six hours in a warm room, so footwear matters more than the outfit. Heels are common and trainers are equally accepted. The refusal list is the same for everyone — beachwear and flip-flops — and there is no expectation of anything formal.',
  },
  {
    q: 'Do I need to bring ID as well?',
    a: 'Yes, and it is the one thing people actually get turned away for. Eighteen is the minimum age and it is checked with physical photo ID at the door of every major club, regardless of your ticket, table or place on a list. A photo of your passport on your phone is not accepted at most venues. Bring the physical document.',
  },
]

const REFUSED = [
  {
    name: 'Beachwear and swimwear',
    body:
      'The most common reason someone gets turned away, because it is the most common way to arrive: straight from a beach club without changing. Bikini tops, board shorts and sarongs read as beach at a midnight door no matter how good they look.',
  },
  {
    name: 'Football shirts',
    body:
      'Refused almost everywhere, and it catches people out because it feels arbitrary. It is not about the team — it is a blanket rule at most Ibiza doors, and no amount of explaining will move it.',
  },
  {
    name: 'Flip-flops and sliders',
    body:
      'Beach footwear is the clearest line on the island. Trainers are fine, boots are fine, heels are fine. Anything you would wear onto sand is not, and this includes the expensive designer version.',
  },
  {
    name: 'Vests and bare chests',
    body:
      'Sleeveless tops on men are refused at most of the bigger rooms. Bring a T-shirt for the door even if it does not survive the first hour inside.',
  },
]

const EXCEPTIONS = [
  {
    name: 'Dinner-show venues',
    body:
      'These are the one genuine exception on the island: a real dress code, enforced, because it is a restaurant and a show rather than a dancefloor. Trousers and proper shoes. If a night includes one of these, it decides what you pack.',
  },
  {
    name: 'Daytime open-air venues',
    body:
      'The relaxed end. These run in daylight and the crowd is in swimwear early and going-out clothes later, in the same venue on the same ticket. Bring something to change into rather than choosing one or the other.',
  },
  {
    name: 'The historic town clubs',
    body:
      'Smarter than the rest of the island, and the difference is real rather than posted. Nobody needs a jacket, but the room dresses up and arriving straight from the beach is the most common reason people are turned away there.',
  },
]

export default function IbizaClubDressCodePage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza Club Dress Code 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Most Ibiza clubs have no formal dress code — they have a refusal list, and it is four items
              long: beachwear, football shirts, flip-flops and vests. Trainers are accepted at every major
              club on the island, shorts at most of them, and nobody needs a jacket or a collar. The
              worry people arrive with is almost always the wrong worry.
            </p>
            <p className="mt-4">
              Two exceptions are real: the dinner-show venues enforce an actual dress code, and the
              historic clubs in town dress up more than the rest of the island. Everything else on this
              page is the pattern, not a promise — a door is a person, and they decide on the night.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="What actually gets refused"
        intro="Short list, and it is broadly the same at every major club. If none of these apply to you, clothing is not what will stop you at the door."
        items={REFUSED}
        columns={2}
      />

      <ItemGrid
        heading="The exceptions worth packing for"
        intro="Three venue types where the general rule above does not hold."
        items={EXCEPTIONS}
      />

      <ProseSection
        heading="The thing people actually get refused for"
        paragraphs={[
          'Clothing is a small share of Ibiza door refusals. The large share is arriving too drunk, and it happens because the island’s schedule invites it: a beach club from midday, sunset drinks, dinner at ten, and a club door at one in the morning is thirteen hours of drinking before anyone has looked at you. Doors at the major clubs are good at spotting it and have no incentive to gamble.',
          'Second on the list is arriving after a guestlist cut-off and arguing. Nearly every list has a time, it varies per club and per night, and after it you pay the normal door price — that is the deal rather than a negotiation. The people who get turned away are the ones who treat it as one.',
          'Third is a large single-sex group with no tickets turning up together at two in the morning. Split up, buy in advance, or arrive earlier. None of that is written anywhere, and all of it is true.',
          'So the useful version of "what should I wear" is: change out of your beach clothes, put on shoes, and pace the day. That covers more refusals than any outfit choice.',
        ]}
      />

      <WhatsAppCta
        locale={LOCALE}
        heading="Not sure about a specific night?"
        body="Door policies shift with the night and the promoter, and a general rule is not the same as knowing what happens on your date. Send Simon the club and the date and he will tell you what applies — including when the honest answer is that it does not matter."
        prefill="Hi Simon, quick question about the dress code for — "
      />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Ibiza nightlife guide', href: 'ibiza-nightlife', body: 'How the whole night fits together, from beach club to six in the morning.' },
          { label: 'Ibiza club tickets 2026', href: 'ibiza-club-tickets', body: 'What entry costs, and when nights sell out.' },
          { label: 'Ibiza guestlist', href: 'guestlist', body: 'Cut-off times, and what a list actually gets you.' },
          { label: 'All clubs', href: 'clubs', body: 'Every venue we cover, each with its own programme.' },
          { label: 'Ibiza beach clubs', href: 'beach-clubs', body: 'Where the afternoon happens, and where you need to change.' },
          { label: 'Getting around Ibiza', href: 'getting-around-ibiza', body: 'And how to get home at six.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Ibiza club dress codes" />
    </>
  )
}
