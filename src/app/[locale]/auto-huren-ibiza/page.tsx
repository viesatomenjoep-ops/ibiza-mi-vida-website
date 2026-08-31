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

export const revalidate = 3600

const LOCALE: Locale = 'nl'
const PAGE_KEY = 'auto-huren-ibiza'
const perDag = RENTAL_PRICES.carPerDay.amount

/**
 * Nederlandse pillar voor autohuur. Partner: Wiber, via Awin.
 *
 * Geschreven voor NL/BE-bezoekers en niet vertaald uit het Engels. Het verschil
 * zit niet alleen in de taal: Nederlanders en Belgen komen met een specifieke
 * zorg — de "all-in prijs" die bij de balie ineens oploopt — omdat dat op
 * Spaanse vliegvelden vaak genoeg gebeurt. Die zorg is het onderwerp van de
 * pagina, niet een detail erin.
 *
 * Toon: jij-vorm, energiek maar eerlijk. Alle uitgaande boekingslinks lopen via
 * <AffiliateLink>, dus rel="sponsored" is structureel.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Auto huren op Ibiza: all-in tarief',
    description:
      'Auto huren op Ibiza bij Wiber: all-in tarief, kantoor op vijf minuten van de luchthaven met gratis shuttle. Voorwaarden, borg en leeftijdstoeslag.',
    alternates: localizedAlternates('car-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Auto huren op Ibiza: all-in tarief',
      description: 'Auto huren op Ibiza bij Wiber: all-in tarief, vijf minuten van de luchthaven, gratis shuttle.',
      locale: 'nl_NL',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Auto huren op Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Auto huren Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Kan ik een auto huren op Ibiza Airport?',
    a: 'Je haalt hem op vijf minuten rijden op, niet in de terminal. Het kantoor van Wiber zit aan de Ctra. Aeropuerto op km 5 in Sant Josep, en er rijdt een gratis shuttle vanaf aankomst. Dat klinkt als een nadeel en is het in augustus juist niet: de balies in de terminal zijn na een reeks avondvluchten regelmatig een uur wachten, buiten het vliegveld gaat het sneller.',
  },
  {
    q: 'Wat betekent all-inclusive precies?',
    a: 'Dat de prijs die je krijgt de prijs is die je betaalt: de verzekering zit in het tarief in plaats van dat hij aan de balie wordt verkocht, en er wordt niet met een brandstofborg gespeeld. Het betekent niet dat er nooit iets bij kan komen — schade buiten de dekking, een kwijtgeraakte sleutel of tanken nadat je hem leeg inlevert blijven voor jou. Het verschil met een goedkope lokprijs is dat er niets bij komt puur omdat je aan de balie nee zei.',
  },
  {
    q: 'Kan ik op mijn 21e een auto huren op Ibiza?',
    a: 'Ja. De minimumleeftijd is 21 jaar en je rijbewijs moet minstens 12 maanden geldig zijn. Bestuurders van 21 tot en met 24 betalen een toeslag voor jonge bestuurders van €9 per dag, en die zit níét in het all-in tarief: die komt er bovenop. Vanaf 25 jaar vervalt de toeslag.',
  },
  {
    q: 'Heb ik een creditcard nodig?',
    a: 'Ja, op naam van de hoofdbestuurder. Dit is verreweg de meest voorkomende reden dat mensen bij een Spaanse balie worden weggestuurd: een debitcard of een kaart op naam van je partner wordt niet geaccepteerd, hoe redelijk je het ook brengt. De borg wordt geblokkeerd, niet afgeschreven, en vrijgegeven als de auto terug is.',
  },
  {
    q: 'Is een cabrio het waard op Ibiza?',
    a: 'Voor de kustwegen echt wel — de rit van Sant Josep naar Cala d’Hort met het dak open is waar mensen er een boeken. Voor een week boodschappen en luchthavenritten niet: je betaalt meer, je kofferbak is kleiner en een open auto op een strandparkeerplaats moet je elke keer helemaal leeghalen. Boek hem voor het rijden, niet voor de hele week.',
  },
  {
    q: 'Heb ik echt een auto nodig op Ibiza?',
    a: 'Zit je in Ibiza-stad of San Antonio en ga je daar niet weg, dan niet: bussen en taxi’s volstaan. Wil je naar Cala Salada, Cala d’Hort, het noorden rond Sant Joan of welke baai dan ook aan het eind van een onverharde weg, dan wel. Dat is precies waar mensen na afloop over praten, en er rijdt geen bus naartoe.',
  },
  {
    q: 'Hoe zit het met parkeren?',
    a: 'Reken erop, want in augustus bepaalt het je dag. In Ibiza-stad parkeer je ondergronds en betaal je ervoor; gratis plek op straat is er in het seizoen nauwelijks. San Antonio is makkelijker richting de baai. De parkeerplaatsen bij Comte en Bassa zitten halverwege de ochtend vol: vóór tienen of na vieren is de hele truc.',
  },
  {
    q: 'Mag ik met een huurauto over onverharde wegen?',
    a: 'Over de aangeharkte zandwegen naar bijvoorbeeld Cala Salada rijdt iedereen, en dat gaat prima. Op het ruwere spul verder noordelijk: lees eerst je voorwaarden, want de meeste contracten sluiten schade buiten verharde wegen uit, en een doorboord carter op een rotsachtig pad is dan voor jouw rekening. Is het plan echt afgelegen baaien, neem dan de 4x4 in plaats van de goedkoopste economy.',
  },
]

export default function AutoHurenIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Auto huren op Ibiza',
          description:
            'All-in autohuur op Ibiza via Wiber Rent a Car, vijf minuten van Ibiza Airport met gratis shuttle en contactloos ophalen.',
          brand: 'Wiber Rent a Car',
          price: perDag,
          path: 'auto-huren-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Auto huren op Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Wij boeken autohuur op Ibiza via Wiber Rent a Car: all-in tarief met de verzekering erin, een
              kantoor op vijf minuten van de luchthaven aan de Ctra. Aeropuerto km 5 in Sant Josep, een
              gratis shuttle vanaf de terminal en contactloos ophalen.
              {perDag ? ` Tarieven beginnen bij €${perDag} per dag.` : ''} Minimumleeftijd 21 jaar, met een
              toeslag van €9 per dag voor bestuurders van 21 tot en met 24.
            </p>
            <p className="mt-4">
              De reden om hier een auto te hebben is niet het ritje van het vliegveld. Het zijn Cala Salada,
              Cala d&apos;Hort en de noordkust — de delen van het eiland waar geen bus komt.
            </p>
          </>
        }
      />

      <PriceTable
        heading="Wat kost een huurauto op Ibiza?"
        locale={LOCALE}
        caption="Vanafprijzen per categorie"
        intro="Vanafprijzen per dag, all-in. In juli en augustus lopen de tarieven stevig op en zijn de goedkope categorieën het eerst weg — het verschil tussen in april en in juli boeken is groter dan het verschil tussen de categorieën."
        rows={[
          { label: 'Economy', note: 'Twee volwassenen, handbagage, parkeren in de stad', amount: RENTAL_PRICES.carPerDay.amount, unit: RENTAL_PRICES.carPerDay.unit.nl },
          { label: 'Compact', note: 'Vier volwassenen met echte koffers', amount: null, unit: RENTAL_PRICES.carPerDay.unit.nl },
          { label: 'Cabrio', note: 'Twee personen, kleine kofferbak, kustwegen', amount: null, unit: RENTAL_PRICES.carPerDay.unit.nl },
          { label: 'SUV / 4x4', note: 'Onverharde wegen en afgelegen baaien', amount: null, unit: RENTAL_PRICES.carPerDay.unit.nl },
        ]}
      />

      <ItemGrid
        heading="De voorwaarden, meteen op tafel"
        columns={2}
        intro="Niets hiervan is ongebruikelijk voor Spanje, maar je wilt het weten vóór je landt in plaats van bij de balie om elf uur ’s avonds."
        items={[
          { name: 'Leeftijd en rijbewijs', body: 'Minimaal 21 jaar, rijbewijs minstens 12 maanden in bezit. Van 21 tot en met 24 geldt een toeslag voor jonge bestuurders van €9 per dag bovenop het tarief. Vanaf 25 geen toeslag.' },
          { name: 'Creditcard en borg', body: 'Een creditcard op naam van de hoofdbestuurder is verplicht. De borg wordt geblokkeerd, niet afgeschreven, en vrijgegeven na inlevering. Een debitcard of een kaart van iemand anders uit het gezelschap wordt geweigerd — hier gaat het het vaakst mis.' },
          { name: 'Wat de verzekering dekt', body: 'De dekking zit in het all-in tarief in plaats van dat hij aan de balie wordt verkocht. Alles dekt hij niet: schade buiten verharde wegen, een kwijtgeraakte sleutel of het interieur na een nat weekend vallen erbuiten. Vraag naar het eigen risico en waardoor de dekking vervalt.' },
          { name: 'Tanken en inleveren', body: 'Vol mee, vol terug. Laten volgooien door de verhuurder wordt afgerekend tegen een tarief waar je niet blij van wordt, en het tankstation het dichtst bij het vliegveld weet precies waarom je daar om zeven uur ’s ochtends staat.' },
        ]}
      />

      <ProseSection
        heading="Waarom je hier een auto wilt"
        paragraphs={[
          'Het eiland is klein genoeg dat alles dichtbij lijkt op de kaart, en in de praktijk traag genoeg dat het dat niet is. Dertig kilometer dwars over het eiland is in augustus een uur, en de laatste twee kilometer zijn vaak een zandweg. Dat is het argument voor de auto in één zin: de baaien die de moeite waard zijn, zijn precies de baaien waar de bus niet komt.',
          'Cala Salada is het duidelijkste voorbeeld. Die ligt aan het eind van een smalle weg ten noorden van San Antonio met een klein parkeerterrein dat om tien uur vol zit, en de wandeling vanaf de overloop is lang genoeg dat de meeste mensen afhaken. Cala d’Hort, met uitzicht op Es Vedrà, is hetzelfde verhaal aan de andere kant van het eiland. Allebei twintig minuten van een hoofdweg, en geen van beide met een bruikbare busverbinding.',
          'Gaat het plan over de ruwere paden in het noorden — de baaien rond Sant Joan, of die je vindt door ergens onaangekondigd af te slaan — neem dan de 4x4 in plaats van de goedkoopste economy. Niet omdat een kleine auto het niet haalt, maar omdat de meeste huurcontracten schade buiten verharde wegen uitsluiten, en een gescheurd carter op een rotspad een rekening is die niemand begroot.',
          'Parkeren wordt onderschat. In Ibiza-stad parkeer je in augustus ondergronds en betaal je, of je blijft rondjes rijden. Bij de westkust-stranden: vóór tienen of na vieren. Plan je dag daaromheen en de auto is de beste beslissing van de reis; negeer het en je zoekt de hele vakantie naar een plek.',
        ]}
      />

      <TrustBlock
        heading="Boeken via Wiber"
        locale={LOCALE}
        intro="Wiber Rent a Car is onze autoverhuurpartner op het eiland. We boeken via hen omdat het all-in tarief ook bij de balie standhoudt, en dat geldt niet voor elke goedkope lokprijs op Ibiza Airport."
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Bekijk beschikbaarheid bij Wiber"
        points={[
          { title: 'Vijf minuten van de luchthaven', body: 'Het kantoor zit aan de Ctra. Aeropuerto km 5 in Sant Josep, met een gratis shuttle vanaf de terminal. Buiten het vliegveld dus, maar in het hoogseizoen sneller dan de rij binnen na een reeks avondaankomsten.' },
          { title: 'Contactloos ophalen', body: 'Het papierwerk is rond voordat je aankomt, dus ophalen is een sleuteloverdracht in plaats van een afspraak aan een balie. Dat scheelt het verschil tussen twintig minuten en een uur na een late landing.' },
          { title: 'All-in betekent dat de prijs blijft staan', body: 'De verzekering zit in het tarief. Niemand verkoopt je aan de balie alsnog een dekking omdat je online nee zei — precies het mechanisme achter de meeste "de prijs was ineens dubbel"-verhalen van Spaanse vliegvelden.' },
          { title: 'Wat wij doen', body: 'Wij boeken het met je via WhatsApp en blijven bereikbaar zolang je de auto hebt. Gaat er iets mis bij de balie, dan heb je een lokaal nummer in plaats van een callcenter.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Gerelateerde pagina's"
        locale={LOCALE}
        links={[
          { label: 'Boot huren op Ibiza', href: 'boot-huren-ibiza', body: 'De baaien waar je niet naartoe kunt rijden, langs de andere kant benaderd.' },
          { label: 'Auto & scooter huren', href: 'car-scooter-rental', body: 'De bestaande pagina met scooters en quads erbij.' },
          { label: 'Ibiza tips', href: 'tips', body: 'Baaien, parkeren en wanneer je het beste komt.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="auto huren op Ibiza" />
    </>
  )
}
