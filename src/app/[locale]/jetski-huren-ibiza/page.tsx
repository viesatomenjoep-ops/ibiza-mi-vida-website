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

const LOCALE: Locale = 'nl'
const PAGE_KEY = 'jetski-huren-ibiza'
const prijs30 = RENTAL_PRICES.jetSki30.amount

/**
 * Nederlandse jetski-pagina. Geen vertaling van de Engelse.
 *
 * De Engelse versie legt uit dát je een vaarbewijs nodig hebt om alleen te
 * varen. Voor een Nederlander is dat niet de vraag — die heeft er vaak één, en
 * wil weten of díé hier telt. Dat is de invalshoek hier.
 *
 * En daar zit meteen de grens van wat we mogen beweren. Welke buitenlandse
 * papieren een verhuurbasis accepteert verschilt per basis en verandert; wij
 * zeggen dus niet "je Klein Vaarbewijs is geldig", we zeggen "stuur op, dan
 * checken we het vóór je boekt". Een verkeerd ja hier betekent iemand die voor
 * niets naar de steiger rijdt, of erger: illegaal op het water.
 *
 * De wettelijke kern is overal gelijk en staat in de eerste alinea: alleen
 * varen vraagt een erkend vaarbewijs, of je gaat mee op een begeleide tocht
 * waar de kwalificatie van de gids de hele groep dekt. Er is geen derde optie.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jetski huren op Ibiza',
    description:
      'Jetski huren op Ibiza vanaf San Antonio, in blokken van 30 minuten. Alleen varen vraagt een vaarbewijs; op een begeleide tocht niet. Wij checken je papieren.',
    alternates: localizedAlternates('jet-ski-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Jetski huren op Ibiza',
      description: 'Jetski huren vanaf San Antonio. Telt jouw vaarbewijs hier? Dat checken we voor je.',
      locale: 'nl_NL',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Jetski huren op Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza op het water', path: 'boats' },
  { name: 'Jetski huren Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Telt mijn Nederlandse of Belgische vaarbewijs op Ibiza?',
    a: 'Soms wel, en dat is geen ontwijkend antwoord. Spanje erkent een aantal buitenlandse vaarbewijzen, maar wélke een verhuurbasis in de praktijk accepteert verschilt per basis en verandert. Stuur ons een foto van je papieren met je datum erbij, dan vragen we het na vóór je boekt. Wij zeggen liever vooraf nee dan dat je voor niets naar de steiger rijdt.',
  },
  {
    q: 'Heb ik een vaarbewijs nodig om op Ibiza een jetski te huren?',
    a: 'Om alleen te varen wel — de Spaanse wet vraagt een erkend vaarbewijs voor waterscooters of boten, en de basis wil het zien. Zonder vaarbewijs kun je nog steeds varen, maar alleen op een begeleide tocht: een gekwalificeerde gids gaat mee en zijn papieren dekken de hele groep. Dat is het hele verschil, en een verhuurder die iets anders beweert zet je illegaal op het water.',
  },
  {
    q: 'Wat kost een halfuur jetski op Ibiza?',
    a: 'Dertig minuten is het standaardblok en het gangbare instaptarief. Wat het getal beweegt is de machine en de vorm: een begeleide tocht kost meer dan hetzelfde halfuur alleen varen, want er gaan een gids en een tweede machine mee het water op. De piekweken in juli en augustus zitten aan de bovenkant. Stuur je datum en je krijgt het tarief voor die dag.',
  },
  {
    q: 'Kunnen we met z’n tweeën op één jetski?',
    a: 'Ja, op de twee- en driezitters die het grootste deel van de verhuurvloot hier vormen, en voor een stel is dat de goedkoopste manier. Maar één van jullie stuurt — het vaarbewijs of de gids-eis hangt aan wie er aan de knoppen zit. Bases hanteren een gecombineerd gewichtsmaximum, dus twee volwassenen op een kleine tweezitter wordt soms geweigerd.',
  },
  {
    q: 'Wat is de minimumleeftijd?',
    a: 'Achttien om te sturen. Passagiers mogen jonger zijn, maar elke basis stelt zijn eigen ondergrens voor wie achterop mag — vaak rond de 6 of 8 jaar, en altijd in een zwemvest op maat. Neem een identiteitsbewijs mee voor de bestuurder: een boeking op de ene naam en iemand anders aan de knoppen is waar het misgaat.',
  },
  {
    q: 'Wat moet ik meenemen?',
    a: 'Zwemkleding die nat mag worden, een handdoek, en een zonnebril met bandje of helemaal geen. Zonnebrand smeer je vooraf en spoelt er alsnog deels af. Laat je telefoon aan wal, tenzij je een afgesloten drijvend hoesje hebt — elke basis heeft een doos met verdronken telefoons. Het zwemvest krijg je, en dragen is niet vrijblijvend.',
  },
  {
    q: 'Welk tijdstip is het beste?',
    a: 'De ochtend. De zee voor San Antonio is het vlakst tot een uur of twaalf; daarna bouwt de zeewind een korte golfslag op die een halfuur zwaarder werk maakt dan het klinkt. Laat in de middag is het licht mooier voor foto’s, maar vaar je tegen meer deining in. Boek in juli en augustus het vroegste blok dat je aankunt.',
  },
]

export default function JetskiHurenIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Jetski huren op Ibiza',
          description:
            'Jetski huren vanaf San Antonio, Ibiza, in blokken van 30 minuten. Een begeleide tocht vraagt geen vaarbewijs; alleen varen wel.',
          price: prijs30,
          path: 'jetski-huren-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Jetski huren op Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Jetski’s vertrekken vanaf San Antonio in blokken van 30 minuten — de standaardeenheid hier,
              en lang genoeg voor de baai en terug.
              {prijs30 ? ` Vanaf €${prijs30} voor 30 minuten.` : ''} De regel die je boeking bepaalt is
              wettelijk en niet commercieel: in Spanje heb je een vaarbewijs nodig om alleen te varen, of
              je gaat mee op een begeleide tocht, waar de kwalificatie van de gids de hele groep dekt.
            </p>
            <p className="mt-4">
              Heb je een Nederlands of Belgisch vaarbewijs, dan is de vraag of díé hier geaccepteerd wordt
              — en dat verschilt per basis. Stuur een foto van je papieren, dan zoeken we het uit vóór je
              boekt in plaats van erna.
            </p>
          </>
        }
      />

      <ChoiceCards
        heading="Begeleide tocht of zelf varen"
        locale={LOCALE}
        cards={[
          {
            title: 'Begeleide tocht',
            meta: 'Geen vaarbewijs nodig · gids gaat mee',
            body:
              'Een gekwalificeerde gids vaart mee en zijn papieren dekken de groep. Je volgt een vaste route, meestal langs de kust van San Antonio richting de zonsondergangkliffen. De enige legale manier om hier zonder eigen vaarbewijs te varen.',
            href: 'boats',
            cta: 'Vraag naar de tochten',
          },
          {
            title: 'Zelf varen',
            meta: 'Vaarbewijs vereist · eigen route binnen een zone',
            body:
              'Laat een geldig vaarbewijs voor waterscooters of boten zien en je gaat er zelf mee op uit, binnen een gemarkeerd gebied dat de basis aangeeft. Meer vrijheid, en je bepaalt zelf het tempo.',
            href: 'boats',
            cta: 'Welke papieren tellen',
          },
          {
            title: 'Met z’n tweeën',
            meta: 'Eén bestuurder · passagier vanaf ongeveer 6–8',
            body:
              'Twee- en driezitters nemen een passagier mee, wat de kosten per persoon halveert. Alleen de bestuurder heeft het vaarbewijs of de gids nodig. Er geldt een gecombineerd gewichtsmaximum, dus check dat bij het boeken.',
            href: 'boat-party',
            cta: 'Opties voor groepen',
          },
        ]}
      />

      <PriceTable
        heading="Wat een jetski op Ibiza kost"
        locale={LOCALE}
        caption="Instaptarieven voor jetskiverhuur"
        intro="Dertig minuten is het standaardblok. Een begeleide tocht kost meer dan dezelfde tijd alleen varen, omdat er een gids en een tweede machine meegaan. Juli en augustus zitten aan de bovenkant."
        rows={[
          {
            label: 'Jetski, 30 minuten',
            note: 'Standaardblok, één machine',
            amount: RENTAL_PRICES.jetSki30.amount,
            unit: RENTAL_PRICES.jetSki30.unit.nl,
          },
        ]}
      />

      <ItemGrid
        heading="Waar je vaart"
        intro="Alles vertrekt uit de baai van San Antonio. De routes hieronder zijn wat de begeleide tochten daadwerkelijk doen; wie zelf vaart blijft binnen een gemarkeerde zone die de basis vooraf op een kaart aanwijst."
        columns={2}
        items={[
          {
            name: 'De baai van San Antonio',
            body:
              'Het beschutte water waar je begint en waar de briefing is. ’s Ochtends vlak, later choppy zodra de middagwind doorzet. Vlak bij de stranden geldt een snelheidsbeperking en de basis vertelt je precies waar die grens ligt.',
          },
          {
            name: 'Cala Bassa en Cala Comte',
            body:
              'Zuidwaarts langs de kust, om de kapen heen naar de twee grote westkuststranden. De standaard langere tocht. Je bekijkt de baaien vanaf het water in plaats van aan te leggen — jetski’s horen niet bij de zwemlijnen.',
          },
          {
            name: 'De zonsondergangkliffen',
            body:
              'Ten noordwesten van de baai, waar de kust rots wordt. Het mooiste stuk voor foto’s en de reden dat de late blokken uitverkopen. Opener water, dus dit is de eerste route die vervalt als de wind aantrekt.',
          },
          {
            name: 'Richting Es Vedrà',
            body:
              'Alleen op langere begeleide tochten en alleen bij rustige omstandigheden. Dit is een serieuze tocht over open water langs de westkust, geen sprintje van een halfuur, en geen enkele basis stuurt een onbegeleide beginner die kant op.',
          },
        ]}
      />

      <TrustBlock
        heading="Voor je boekt"
        locale={LOCALE}
        intro="Drie dingen bepalen of een jetskiboeking soepel loopt, en alle drie regel je vooraf in plaats van op de steiger."
        points={[
          {
            title: 'De vaarbewijsvraag',
            body:
              'Regel dit bij het boeken, niet bij de basis. Heeft niemand in je groep een erkend vaarbewijs, dan is de begeleide vorm de enige optie — er is geen derde, en aankomen in de hoop je erin te praten kost je het blok. Twijfel je over je Nederlandse of Belgische papieren: stuur ze op.',
          },
          {
            title: 'Borg en identiteitsbewijs',
            body:
              'Er wordt een borg geblokkeerd op een creditcard op naam van de bestuurder, die vrijkomt zodra de machine onbeschadigd terug is. Neem de fysieke kaart en een identiteitsbewijs mee. De bestuurder op de boeking moet ook degene zijn die tekent.',
          },
          {
            title: 'Weer',
            body:
              'Jetskiblokken worden vaker afgezegd dan boten, omdat een kleine machine golfslag voelt die een romp niet merkt. Afzegging wegens weer levert een nieuw tijdslot of geld terug op, en de basis beslist.',
          },
          {
            title: 'Wat wij doen',
            body:
              'Wij kijken welke bases jouw tijdslot vrij hebben op de datum die je wil, in de vorm die je groep wettelijk mag gebruiken, en antwoorden via WhatsApp. Kan je groep niet varen zoals je het voor je ziet, dan zeggen we dat vóór je betaalt.',
          },
        ]}
      />

      <ProseSection
        heading="Wat we tegen een vriend zouden zeggen"
        paragraphs={[
          'Boek het eerste blok van de dag. Het verschil tussen negen uur ’s ochtends en drie uur ’s middags is niet de prijs, maar of je een halfuur over vlak water scheert of door een meter windgolf beukt. Wie in augustus het middagblok boekt, leert dat één keer.',
          'Een halfuur is echt genoeg voor de eerste keer. Het klinkt kort en dat is het niet: je houdt je vast op snelheid met spieren die je verder nooit gebruikt, en de meeste mensen zijn na een minuut of vijfentwintig wel klaar. Boek het korte blok en plak er een tweede aan als het bevalt.',
          'Laat de telefoon liggen. Gaat het je om de foto, vraag dan of de gids een camera meeneemt — de meesten doen dat — want het alternatief is een telefoon in een zak die binnen tien minuten onder water staat.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Verder lezen"
        locale={LOCALE}
        links={[
          { label: 'Boot huren op Ibiza', href: 'boats', body: 'De pillar: met schipper, met eigen vaarbewijs, of zonder tot 15 pk.' },
          { label: 'Boat party op Ibiza', href: 'boat-party', body: 'De andere manier om een dag op het water door te brengen.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="jetski huren op Ibiza" />
    </>
  )
}
