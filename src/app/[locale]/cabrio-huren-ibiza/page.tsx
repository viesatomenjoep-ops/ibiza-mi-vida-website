import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
const LOCALE: Locale = 'nl'
const PAGE_KEY = 'cabrio-huren-ibiza'

/**
 * Nederlandse variant. Geen vertaling van de Engelse.
 *
 * De invalshoek is rekenen, want dat is wat een Nederlander of Belg bij deze
 * categorie doet. Een cabrio kost meer per dag, en de vraag is niet of het leuk
 * is maar of het die meerprijs waard is voor jouw week.
 *
 * Het eerlijke antwoord is: voor drie ritten wel, voor een week boodschappen
 * niet — en de twee dingen die dat bepalen staan nergens in een
 * categoriebeschrijving. Het dak ligt in de kofferbak, dus de opgegeven
 * bagageruimte is de dak-dicht-waarde. En een softtop is geen afsluitbare
 * kofferbak, dus de auto moet bij elke stop leeg.
 *
 * Wie dat vooraf weet boekt hem twee dagen en is blij. Wie het niet weet, boekt
 * hem een week en sleept zeven dagen lang koffers.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cabrio huren op Ibiza',
    description:
      'Cabrio huren op Ibiza: voor welke kustwegen het de meerprijs waard is, hoeveel bagage er echt in past, en waarom je hem niet vol kunt laten staan.',
    alternates: localizedAlternates('convertible-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Cabrio huren op Ibiza',
      description: 'Voor welke ritten een cabrio de meerprijs waard is — en voor welke week niet.',
      locale: 'nl_NL',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Cabrio huren op Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Auto huren Ibiza', path: 'auto-huren-ibiza' },
  { name: 'Cabrio' },
]

const FAQS: Faq[] = [
  { q: 'Is een cabrio op Ibiza de meerprijs waard?', a: 'Voor de kustwegen wel. De rit van Sant Josep naar Cala d’Hort en de noordweg richting Portinatx zijn met het dak open echt beter, en dat zijn de ritten die je onthoudt. Voor een week luchthavenritjes en supermarktbezoek niet: je betaalt meer voor een kleinere kofferbak en een auto die je bij elke stop moet leegruimen.' },
  { q: 'Hoeveel bagage past erin?', a: 'Minder dan je denkt, en met het dak open nog minder, want het dak ligt ín de kofferbak. Twee mensen met handbagage zit prima. Vier mensen met koffers niet, wat de categoriebeschrijving ook suggereert. Land je met z’n vieren, neem dan de compacte auto en huur de cabrio voor één dag.' },
  { q: 'Wat kost een cabrio tegenover een gewone auto?', a: 'Meer per dag dan een economy of compact, en het verschil loopt op in juli en augustus omdat de categorie als eerste uitverkoopt. De eerlijke manier om er een te boeken is voor de dagen dat je ook echt de kust op gaat, niet voor de hele week — al wint bij een kort tripje het gemak van één boeking meestal.' },
  { q: 'Kan ik spullen in de auto laten terwijl ik zwem?', a: 'Nee, en dit is de praktische adder die cabrioweken verpest. Een open auto op een strandparkeerplaats is een uitnodiging, en ook met het dak dicht is een softtop geen afsluitbare kofferbak. Het betekent dat je bij elke stop de auto leegruimt — prima op een rit, vervelend op een stranddag.' },
  { q: 'Is het niet te heet met het dak open?', a: 'Midden op een julimiddag eerlijk gezegd wel: je staat stil in het verkeer, in de volle zon, zonder schaduw. De uren waarop het dak open hoort zijn vroeg in de ochtend en vanaf een uur of zes — precies wanneer de kustwegen er ook het mooist bij liggen. Plan de rit dan en het klopt helemaal.' },
  { q: 'Moet ik hem verder vooruit boeken?', a: 'Ja. Cabrio’s zijn een klein deel van elke Ibiza-vloot en de eerste categorie die in de piekweken opraakt. In het voorjaar boeken voor augustus is normaal; in juli boeken voor augustus betekent meestal dat er niets meer is, tegen geen enkele prijs.' },
]

export default function CabrioHurenPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Cabrio huren op Ibiza',
        description: 'Cabrioverhuur op Ibiza voor de west- en noordkustwegen, all-in via Wiber Rent a Car.',
        brand: 'Wiber Rent a Car', price: null, path: 'cabrio-huren-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Cabrio huren op Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Een cabrio verdient zijn meerprijs op ongeveer drie wegen hier, en de mooiste is de twintig
            minuten van Sant Josep naar Cala d’Hort met Es Vedrà voor je uit. Hij kost meer per dag dan een
            compacte auto, er past merkbaar minder bagage in, en je kunt hem niet vol laten staan op een
            strandparkeerplaats. Boek hem voor het rijden, vroeg in de ochtend of na zessen — niet voor een
            week boodschappen.
          </p>
        }
      />

      <ItemGrid
        heading="De wegen waarvoor je het dak opendoet"
        intro="Drie ritten die de categorie rechtvaardigen, en één die dat niet doet."
        items={[
          { name: 'Sant Josep naar Cala d’Hort', body: 'De zuidwestelijke rit, dalend door dennen en terrassen met Es Vedrà die aan het eind de voorruit vult. De beste twintig minuten rijden van het eiland, en het mooist in het laatste uur licht.' },
          { name: 'De noordweg naar Portinatx', body: 'Langer, groener en leger, kronkelend door Sant Joan. Trager dan de kaart doet vermoeden en juist daarom beter. Deze doe je ’s ochtends, voor de hitte.' },
          { name: 'Ibiza-stad naar Santa Eulària', body: 'De makkelijke kustoptie, kort en beschaafd, prima voor een avond uit. Niet spectaculair, wel aangenaam met het dak open en zonder enige moeite.' },
          { name: 'Niet: de luchthavenweg', body: 'Recht, druk en heet, met vrijwel elk seizoen ergens werk aan de weg. Niemand heeft deze ooit met open dak in het augustusverkeer leuk gevonden.' },
        ]}
      />

      <PriceTable
        heading="Wat het kost"
        locale={LOCALE}
        caption="Instapprijs voor cabrioverhuur"
        intro="Hoger per dag dan een economy of compact, en de categorie raakt in de piekweken als eerste op. Vraag het cijfer voor jouw datums — het beweegt meer met het seizoen dan met het model."
        rows={[{ label: 'Cabrio', note: '2 volwassenen, kleine kofferbak, kustwegen', amount: null, unit: RENTAL_PRICES.carPerDay.unit.nl }]}
      />

      <ProseSection
        heading="De twee dingen die niemand erbij zegt"
        paragraphs={[
          'Het dak ligt in de kofferbak, dus de bagageruimte die bij de categorie staat is de waarde met het dak dicht. Twee mensen met handbagage zitten comfortabel; vier mensen met koffers passen er niet in, en dat om elf uur ’s avonds bij de balie ontdekken met een gezin dat staat te wachten, is een slechte avond.',
          'Het tweede is parkeren. Een softtop is geen afsluitbare kofferbak, en een open auto op een strandparkeerplaats is een uitnodiging. In de praktijk betekent het dat de auto bij elke stop leeg moet, wat op een rit een kleine ergernis is en op een stranddag een echt gedoe. Bestaat je week vooral uit stranden, huur de cabrio dan twee dagen en neem iets met een afsluitbare kofferbak voor de rest.',
        ]}
      />

      <TrustBlock
        heading="Boeken via Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Bekijk beschikbaarheid cabrio"
        points={[
          { title: 'Boek op tijd', body: 'Cabrio’s zijn een klein deel van elke Ibiza-vloot en de eerste categorie die voor juli en augustus uitverkoopt.' },
          { title: 'All-in tarief', body: 'Verzekering in de prijs, dus de meerprijs die je betaalt is voor de auto en niet voor dekking die aan de balie wordt bijverkocht.' },
          { title: 'Dezelfde voorwaarden', body: 'Minimumleeftijd 21, rijbewijs 12 maanden, €9 per dag toeslag voor bestuurders van 21 tot 24, creditcard op naam van de hoofdbestuurder.' },
          { title: 'Vijf minuten van de luchthaven', body: 'Hetzelfde kantoor en dezelfde gratis shuttle als elke andere categorie — Ctra. Aeropuerto km 5, Sant Josep.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Verder lezen" locale={LOCALE} links={[
        { label: 'Auto huren op Ibiza', href: 'auto-huren-ibiza', body: 'De pillar: alle categorieën, voorwaarden en parkeeradvies.' },
        { label: 'Auto huren bij de luchthaven', href: 'auto-huren-ibiza-luchthaven', body: 'Het ophalen, de shuttle en wat je doet na een late landing.' },
        { label: 'Boot huren op Ibiza', href: 'boats', body: 'Cala d’Hort vanaf het water in plaats van vanaf de kliffenweg.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="cabrio huren op Ibiza" />
    </>
  )
}
