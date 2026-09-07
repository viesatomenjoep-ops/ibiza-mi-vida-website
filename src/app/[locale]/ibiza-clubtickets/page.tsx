import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { ctBrowseLink } from '@/lib/ct-link'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'nl'
const PAGE_KEY = 'ibiza-clubtickets'

/**
 * Nederlandse pillar voor clubtickets. Geen vertaling van de Engelse pagina.
 *
 * Het verschil zit niet in de taal maar in de zorg. Een Nederlander of Belg die
 * hierop zoekt heeft meestal één specifieke vraag: is dit een betrouwbare
 * verkoper, of koop ik straks een ticket dat aan de deur niet scant. Dat komt
 * ergens vandaan — de doorverkoopmarkt rond Ibiza is groot en er wordt veel
 * gerommeld — en het is dus het onderwerp van deze pagina in plaats van een
 * detail erin.
 *
 * De Engelse versie draait om iets anders: daar is de vraag vooral "wat kost
 * het en wanneer is het uitverkocht". Beide zijn waar, maar wie ze allebei op
 * één pagina zet, beantwoordt geen van beide goed.
 *
 * Prijsranges zijn de waarneembare markt, niet ons tarief: we zijn
 * wederverkoper via ClubTickets, en een seizoen lang dynamische prijzen maakt
 * "onze prijs" een toezegging die we niet kunnen houden.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza clubtickets 2026 — wat het kost',
    description:
      'Clubtickets Ibiza 2026: €20–30 doordeweeks, €50–125+ voor een headliner bij UNVRS, Hï of Ushuaïa. Officieel verkooppunt van ClubTickets, geen doorverkoop.',
    alternates: localizedAlternates('club-tickets-hub', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza clubtickets 2026 — wat het kost',
      description: 'Wat een clubticket op Ibiza kost, en hoe je zeker weet dat het klopt.',
      locale: 'nl_NL',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza clubtickets' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza clubtickets' },
]

const FAQS: Faq[] = [
  {
    q: 'Zijn deze tickets echt, of is dit doorverkoop?',
    a: 'Officieel. Wij zijn aangesloten partner van ClubTickets, dat rechtstreeks voor de clubs verkoopt — je koopt dus geen tweedehands ticket van een onbekende. Dat is het verschil dat aan de deur telt: een doorverkochte QR-code kan al gescand zijn, en dan sta je buiten met een betaalbewijs dat niemand iets kan schelen. Dit onderscheid is ook de reden dat wij nooit goedkoper zijn dan de club zelf.',
  },
  {
    q: 'Wat kost een clubticket op Ibiza?',
    a: 'Twee verschillende werelden. Een kleinere doordeweekse avond kost ongeveer €20 tot €30. Een headliner bij UNVRS, Hï Ibiza of Ushuaïa loopt van €50 tot €125 en hoger, afhankelijk van de artiest en hoe kort van tevoren je koopt. De prijs is dynamisch: hetzelfde ticket kost in de laatste week écht meer dan in april, en de goedkoopste categorie is als eerste weg.',
  },
  {
    q: 'Moet ik vooraf boeken of kan het aan de deur?',
    a: 'Vooraf, en dat heeft niets met de prijs te maken. Je hebt gegarandeerd toegang op een avond die uitverkocht kan raken, en je betaalt het officiële tarief in plaats van wat een ronselaar buiten noemt. Aan de deur is niet betrouwbaar goedkoper, en op een drukke avond is de deur simpelweg dicht.',
  },
  {
    q: 'Welke avonden raken echt uitverkocht?',
    a: 'De openingsfeesten eind april en mei, de closings eind september en oktober, en elke zaterdag in augustus met een grote naam. Een willekeurige dinsdag in juni meestal niet. Bouw je je reis om één specifieke avond, koop dat ticket dan wanneer je de vlucht boekt — niet wanneer je landt.',
  },
  {
    q: 'Wat is de dresscode?',
    a: 'Minder streng dan mensen denken, en strenger dan mensen aannemen aan de bovenkant. Strandkleding, voetbalshirts en slippers worden bij de grote clubs geweigerd. Sneakers kunnen overal en niemand heeft een colbert nodig. Ushuaïa is een dagclub bij het zwembad en kleedt zich daarnaar; Hï en UNVRS na middernacht neigen naar uitgaanskleding.',
  },
  {
    q: 'Hoe laat gaan de clubs open en dicht?',
    a: 'Later dan je gewend bent. De nachtclubs openen rond middernacht en gaan door tot een uur of zes, met de hoofdact vaak om twee of drie uur. Ushuaïa is de uitzondering en draait overdag, ruwweg van laat in de middag tot rond middernacht. Om twaalf uur bij Hï staan betekent een warming-up in een lege zaal kijken.',
  },
  {
    q: 'Kan ik tickets voor iemand anders kopen?',
    a: 'Ja. Tickets staan op naam maar worden in de meeste zalen als QR-code gescand, dus voor een groep kopen is normaal en één persoon kan ze allemaal beheren. Waar een club de naam wél tegen een ID controleert, zeggen we dat vóór je koopt in plaats van erna.',
  },
  {
    q: 'Wat zit er bij de ticketprijs in?',
    a: 'Toegang, en verder niets. Drankjes koop je binnen en die zijn duur — dat is het deel van het budget dat mensen onderschatten, niet het ticket. Tafelservice, drankpakketten en gastenlijst zijn aparte dingen; op de guestlist-pagina staat hoe die echt werken.',
  },
  {
    q: 'Is er een leeftijdsgrens?',
    a: 'Achttien, en het wordt bij elke grote club aan de deur met een fysiek identiteitsbewijs gecontroleerd. Een foto van je paspoort op je telefoon wordt bij de meeste zalen niet geaccepteerd. Neem het document zelf mee — dit is Spaanse wet, geen clubbeleid, dus er valt niet over te praten.',
  },
]

const CLUBS = [
  {
    name: 'UNVRS',
    body:
      'De nieuwste en grootste zaal van het eiland, gebouwd voor het formaat show waar je vroeger een stadion voor nodig had. Grote namen en grote prijzen: hier zitten de tickets van €125 en hoger.',
  },
  {
    name: 'Hï Ibiza',
    body:
      'Playa d’en Bossa, al jaren bovenaan de wereldlijsten, met twee hoofdzalen die op dezelfde avond een ander geluid draaien. De veilige keuze als je maar één avond uitgaat.',
  },
  {
    name: 'Ushuaïa',
    body:
      'De openluchtclub, en de enige grote zaal die overdag draait. Laat in de middag tot rond middernacht, bij het zwembad, met een publiek dat vroeg in zwemkleding staat en later in uitgaanskleding.',
  },
  {
    name: 'Pacha',
    body:
      'De oudste, in Ibiza-stad, en kleiner dan de arena’s hierboven. De moeite waard om de zaal zelf, niet alleen om de line-up — dit komt het dichtst bij hoe uitgaan hier ooit begon.',
  },
  {
    name: 'Amnesia',
    body:
      'Aan de weg naar San Antonio, met de Terrace en de Club Room naast elkaar. Historisch de hardere kant van het eiland, en de club met de sterkste openings- en closingfeesten.',
  },
]

export default function IbizaClubticketsPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza clubtickets 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Reken op €20 tot €30 voor een kleinere doordeweekse avond en €50 tot €125 of meer voor een
              headliner bij UNVRS, Hï Ibiza of Ushuaïa. Wij verkopen als aangesloten partner van
              ClubTickets, dat rechtstreeks voor de clubs werkt — geen doorverkoop, dus geen QR-code die
              aan de deur al gescand blijkt.
            </p>
            <p className="mt-4">
              Dat is ook meteen de eerlijke kant ervan: goedkoper dan de club zelf zijn we nooit. Wat je
              wél krijgt is zekerheid, en iemand op het eiland die opneemt als er iets misgaat.
            </p>
          </>
        }
      >
        <div className="mt-7">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Bekijk wat er deze week speelt
          </AffiliateLink>
        </div>
      </HubHero>

      <PriceTable
        heading="Wat een avond uit kost"
        locale={LOCALE}
        caption="Gangbare ticketprijzen per soort avond"
        intro="Waargenomen marktprijzen voor alleen de entree, niet ons tarief. Drankjes komen daar bovenop en daar gaat het budget echt heen."
        rows={[
          { label: 'Doordeweeks, kleinere avond', note: 'Residents, buiten het hoogseizoen', amount: 20, unit: 'vanaf, per persoon' },
          { label: 'Weekend, gevestigde avond', note: 'Amnesia, Pacha, Ushuaïa', amount: 40, unit: 'vanaf, per persoon' },
          { label: 'Headliner', note: 'UNVRS, Hï, grote boekingen bij Ushuaïa', amount: 50, unit: 'vanaf, oplopend tot €125+' },
        ]}
      />

      <ItemGrid
        heading="De clubs"
        intro="Vijf zalen dekken het meeste waar mensen voor komen. Het zijn echt verschillende avonden, geen vijf versies van dezelfde."
        items={CLUBS}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Bekijk data en koop tickets
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Verder lezen"
        locale={LOCALE}
        links={[
          { label: 'Gastenlijst en VIP-tafels', href: 'guestlist', body: 'Wat guestlist hier echt betekent, en wat een tafel kost.' },
          { label: 'Ibiza clubagenda', href: 'calendar', body: 'Elke gedateerde avond op het eiland, per dag.' },
          { label: 'Wat een avond uit kost', href: 'ibiza-prices', body: 'Gemeten prijzen per club, uit onze eigen agenda.' },
          { label: 'Boat party op Ibiza', href: 'boat-party', body: 'De versie overdag, voordat de clubavond begint.' },
          { label: 'Auto huren op Ibiza', href: 'auto-huren-ibiza', body: 'Naar Amnesia en terug zonder taxi-piekprijs.' },
          { label: 'Wanneer sluit Ibiza', href: 'ibiza-season', body: 'De laatste geplande avond per club, uit de agenda.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Ibiza clubtickets" />
    </>
  )
}
