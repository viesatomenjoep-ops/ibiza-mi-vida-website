/**
 * Bootverhuurgids (nl) — de inhoud van de vroegere pillar /boot-huren-ibiza.
 *
 * Die pagina is samengevoegd met /boats: één URL draagt nu het hele
 * bootaanbod, met deze gids onderaan. De oude URL's (vijf talen) doen een 308
 * naar /{locale}/boats, zodat inkomende links en de zoekmachine-index
 * meeverhuizen in plaats van te 404'en.
 *
 * Wat er anders is dan op de losse pagina: de hero is een H2 (de pagina heeft
 * al een H1), er is geen eigen breadcrumb meer (die van /boats geldt), en het
 * Product-schema wijst naar 'boats'. De copy zelf is ongewijzigd.
 */
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { type Locale } from '@/lib/seo'


const LOCALE: Locale = 'nl'
const PAGE_KEY = 'boot-huren-ibiza'

/**
 * Nederlandse pillar voor bootverhuur. Geen vertaling van de Engelse pagina.
 *
 * De zoektermen verschillen wezenlijk: een Nederlander zoekt op "boot huren
 * ibiza zonder vaarbewijs", niet op een vertaling van "boat rental". Belangrijker
 * nog is dat het vaarbewijs-verhaal in Nederlandstalige artikelen structureel
 * fout staat — men verwart het Nederlandse Vaarbewijs I met de Spaanse regels.
 * Die correctie is de reden dat deze pagina bestaat en staat daarom bovenaan.
 *
 * Toon: jij-vorm, stellig, geen uitroeptekens. Zelfde register als de bestaande
 * NL-FAQ in src/lib/page-faq.ts.
 */

const skipper = RENTAL_PRICES.boatWithSkipper.amount
const zonder = RENTAL_PRICES.boatNoLicence.amount



const FAQS: Faq[] = [
  {
    q: 'Kan ik een boot huren op Ibiza zonder vaarbewijs?',
    a: 'Ja, binnen duidelijke grenzen. De Spaanse regels laten iedereen van 18 jaar en ouder varen op een boot van maximaal 15 pk met een romp onder de zes meter, zonder vaarbewijs en zonder ervaring. Je krijgt vooraf een instructie en een vaargebied waar je binnen moet blijven — meestal het stuk kust rond je vertrekhaven. Alles wat groter of krachtiger is, vraagt wél een erkend vaarbewijs, en daar valt niet mee te onderhandelen.',
  },
  {
    q: 'Geldt mijn Nederlandse Vaarbewijs I op Ibiza?',
    a: 'Niet automatisch voor elke categorie. Spanje erkent buitenlandse vaarbewijzen per bootcategorie, en dat pakt vaker beperkend uit dan Nederlanders verwachten: een papier dat op de Randmeren volstaat, dekt niet vanzelf een motorjacht op zee. Stuur ons een foto van je vaarbewijs en de boot waar je naar kijkt, dan checken we de combinatie vóórdat je een datum vastlegt.',
  },
  {
    q: 'Wat kost een boot huren op Ibiza?',
    a: 'Dat hangt van drie dingen af: de grootte van de boot, of er een schipper meevaart, en de datum. Een boot zonder vaarbewijs voor vier tot zes personen is de goedkoopste manier om het water op te komen; een dagcharter met schipper de duurste. Brandstof wordt vrijwel altijd apart afgerekend op verbruik — dat verrast mensen meer dan de huurprijs zelf. App ons je datum en groepsgrootte, dan krijg je het tarief van de boten die die dag echt vrij zijn.',
  },
  {
    q: 'Moet ik een borg betalen?',
    a: 'Ja, op vrijwel elke boot. De borg wordt geblokkeerd op de creditcard van de hoofdhuurder en vrijgegeven zodra de boot onbeschadigd terug is, meestal binnen een paar dagen. Het bedrag schaalt mee met de waarde van de boot. Neem een échte creditcard mee: een debitcard of een kaart op naam van je partner wordt bij de meeste bases geweigerd, en dan sta je voor niets op de steiger.',
  },
  {
    q: 'Hoeveel personen mogen er mee?',
    a: 'Het certificaat op de boot bepaalt dat, niet de ruimte aan dek. Boten zonder vaarbewijs zijn meestal gecertificeerd voor vier tot zes personen, middelgrote motorboten voor acht tot twaalf. Bij sommige certificaten telt de schipper mee in dat aantal en bij andere niet. Geef bij je aanvraag het échte aantal door, kinderen meegerekend — met negen man op een boot voor acht blijft er iemand achter.',
  },
  {
    q: 'Is de brandstof inbegrepen?',
    a: 'Bijna nooit. De standaard op het eiland is dat je de boot vol meekrijgt en vol terugbrengt, of achteraf het verbruik afrekent. Hoeveel je verstookt hangt sterker af van hoe je vaart dan van hoe ver je gaat: voor anker in een baai kost niets, vol gas naar Formentera en terug kost flink. Vraag naar de tankinhoud en het verbruik als je het vooraf wilt kunnen begroten.',
  },
  {
    q: 'Wat gebeurt er als het weer omslaat?',
    a: 'De tramuntana uit het noorden bepaalt hier vaker de dag dan regen. Is het te ruig, dan annuleert de basis of de schipper en krijg je een nieuwe datum of je geld terug — die beslissing ligt bij hen, niet bij jou. Op twijfelachtige dagen wordt meestal de route aangepast in plaats van de datum: als het noorden dichtligt, is het zuiden en westen vaak prima te doen.',
  },
  {
    q: 'Wanneer kun je het beste een boot huren?',
    a: 'Juni tot en met augustus is hoogseizoen: warmst water, betrouwbaarste weer, hoogste prijzen, en de bekende baaien zitten rond het middaguur vol. Mei, september en begin oktober zijn de betere koop — in september is het water nog warm, zijn de boten goedkoper en is Cala Comte om elf uur nog niet vol. Doordeweeks is in elke maand goedkoper en rustiger dan in het weekend.',
  },
]

export function BoatRentalGuide() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        faqs={FAQS}
        product={{
          name: 'Boot huren op Ibiza',
          description:
            'Boot huren op Ibiza met schipper, met eigen vaarbewijs of zonder vaarbewijs tot 15 pk, vanuit San Antonio, Santa Eulària, Ibiza-stad en Marina Botafoch.',
          brand: 'Click&Boat',
          price: skipper,
          path: 'boats',
        }}
      />

      <HubHero
        as="h2"
        h1="Boot huren op Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Je huurt op Ibiza op drie manieren een boot: met een schipper die vaart, met je eigen
              vaarbewijs, of zonder vaarbewijs op een boot van maximaal 15 pk als je 18 of ouder bent.
              {skipper ? ` Een dagcharter met schipper begint bij €${skipper}.` : ''}
              {zonder ? ` Boten zonder vaarbewijs beginnen bij €${zonder}.` : ''} Hoogseizoen is juni tot
              en met augustus; doordeweeks is goedkoper en zijn de baaien leger dan in het weekend.
            </p>
            <p className="mt-4">
              De boten vertrekken vanuit vier jachthavens, en welke je kiest bepaalt je dag sterker dan de
              boot zelf.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="Met of zonder vaarbewijs — wat mag je?"
        columns={3}
        intro="Dit is Spaanse wetgeving, geen huisregel van een verhuurder. Wie je iets anders belooft, zet je buiten je verzekering."
        items={[
          {
            name: 'Zonder vaarbewijs',
            body:
              'Maximaal 15 pk, romp onder de zes meter, bestuurder 18 jaar of ouder, en een vaargebied dat je vooraf op de kaart krijgt aangewezen. Geen ervaring nodig: de instructie behandelt starten, stoppen, sturen en ankeren. Reken op de baaien in de buurt, niet op de oversteek naar Formentera.',
          },
          {
            name: 'Met eigen vaarbewijs',
            body:
              'Dan gaat de hele vloot open: grotere rompen, echte actieradius, en Formentera wordt haalbaar. Let op dat Spanje buitenlandse papieren per categorie erkent — je Vaarbewijs I dekt niet vanzelf elk motorjacht. Neem het originele document mee, een foto is niet genoeg.',
          },
          {
            name: 'Met schipper',
            body:
              'Op de meeste grotere motorjachten en vrijwel alle catamarans is dit sowieso verplicht, ongeacht wat jij op zak hebt. Op de rest is het meestal gewoon de betere keuze.',
          },
        ]}
      />

      <PriceTable
        heading="Wat kost een boot huren op Ibiza?"
        locale={LOCALE}
        caption="Vanafprijzen per boottype"
        intro="Vanafprijzen per boot per dag. Brandstof komt er vrijwel overal apart bij, op verbruik — vraag naar tankinhoud en verbruik als je het vooraf wilt begroten."
        rows={[
          {
            label: 'Boot zonder vaarbewijs',
            note: '4–6 personen, max 15 pk',
            amount: RENTAL_PRICES.boatNoLicence.amount,
            unit: RENTAL_PRICES.boatNoLicence.unit.nl,
          },
          {
            label: 'Motorboot, je vaart zelf',
            note: 'Vaarbewijs vereist',
            amount: RENTAL_PRICES.boatWithLicence.amount,
            unit: RENTAL_PRICES.boatWithLicence.unit.nl,
          },
          {
            label: 'Dagcharter met schipper',
            note: 'Schipper zit in het tarief',
            amount: RENTAL_PRICES.boatWithSkipper.amount,
            unit: RENTAL_PRICES.boatWithSkipper.unit.nl,
          },
        ]}
      />

      <ProseSection
        heading="Boot huren met schipper"
        paragraphs={[
          'Op de meeste grotere boten is een schipper verplicht, en op de rest is het meestal de betere keuze. Niet omdat varen moeilijk is, maar vanwege de routekeuze: Ibiza heeft een loefzijde en een lijzijde die per dag wisselen, en een schipper die hier werkt weet bij het ontbijt al welke baaien om twee uur ’s middags zwembaar zijn. Dat zoek je zelf niet op.',
          'Het tweede is ankeren. Weten waar de grond houdt in welke baai leer je niet van een kaart, en het is het grootste praktische verschil tussen een dag met en een dag zonder schipper.',
          'Engels spreken vrijwel alle schippers, Spaans sowieso. Nederlands, Duits en Frans bestaan maar op minder boten, dus die wens beperkt de vloot in plaats van dat het geld kost. Geef het door bij je aanvraag, niet achteraf.',
        ]}
      />

      <ItemGrid
        heading="Waar vertrekken de boten?"
        columns={2}
        intro="Vier vertrekpunten, elk gericht op een ander stuk kust. Kies de haven die het dichtst ligt bij wat je wilt zien — een uur rondvaren om het eiland is een uur niet zwemmen."
        items={[
          {
            name: 'San Antonio',
            body:
              'De westkust-basis, en het kortste stuk naar Cala Bassa, Cala Comte en Cala Salada. Ook de drukste: vertrek in juli en augustus vóór tienen, anders sta je in de rij bij de tanksteiger en kom je aan in een volle baai.',
          },
          {
            name: 'Santa Eulària',
            body:
              'Rustiger haven aan de oostkust, het dichtst bij de noordoostelijke baaien en Es Canar. De betere keuze als San Antonio je te chaotisch is en je de dag liever zonder drukte begint.',
          },
          {
            name: 'Ibiza-stad',
            body:
              'Recht naar Formentera en de zuidkust, met Talamanca en Ses Salines binnen bereik. Handig als je in de stad zit en geen taxi dwars over het eiland wilt nemen.',
          },
          {
            name: 'Marina Botafoch',
            body:
              'Hier liggen de grotere boten, aan de overkant van het water van de oude stad. Dezelfde toegang tot Formentera als Ibiza-stad, met meer ruimte op de steiger als je met een grote groep tegelijk inscheept.',
          },
        ]}
      />

      <ItemGrid
        heading="Waar vaar je naartoe?"
        intro="Vijf routes dekken zo’n beetje wat een dag op het water hier is. Alles behalve Formentera werkt prima vanuit San Antonio."
        items={[
          { name: 'Cala Bassa', body: 'Breed, zandig, beschut en twintig minuten van San Antonio. De makkelijke eerste stop, en de enige die goed werkt met kinderen aan boord. Anker voor het strand in plaats van te vechten om een plek dicht bij de kant.' },
          { name: 'Cala Comte', body: 'De baai die iedereen fotografeert, en terecht: ondiep turquoise water over zand met de eilandjes ervoor. In de zomer om twaalf uur vol, dus ga vroeg of kom na vieren als de dagjesmensen weg zijn.' },
          { name: 'Cala Salada', body: 'Ten noorden van San Antonio, kleiner en omzoomd door dennen. De weg ernaartoe is slecht, en juist daarom blijft het er rustiger dan in de baaien waar je makkelijk naartoe rijdt.' },
          { name: 'Es Vedrà', body: 'De rots voor de zuidwestkust, en de enige stop die om kijken gaat in plaats van om zwemmen. Op zijn mooist laat in de middag met de zon erachter. Check de wind: daar buiten sta je onbeschut.' },
          { name: 'Formentera', body: 'De hele dag: oversteken naar Ses Illetes en de zandbanken, lunchen, terug. Vraagt een boot met bereik en in de praktijk een schipper. Geen plan voor een boot van 15 pk zonder vaarbewijs, wat de kaart ook suggereert.' },
        ]}
      />

      <TrustBlock
        heading="Bij wie boek je eigenlijk?"
        locale={LOCALE}
        intro="Wij zijn een lokaal team op Ibiza. De boten zelf komen via Click&Boat, het grootste botenverhuurplatform van Europa met meer dan 55.000 boten — daarom vinden we meestal nog iets vrij op een datum die volgeboekt oogt."
        partner="Click&Boat"
        partnerHref={CLICKANDBOAT_URL}
        partnerCta="Bekijk beschikbaarheid op Click&Boat"
        points={[
          { title: 'Verzekering', body: 'Elke boot is door de eigenaar of exploitant verzekerd; dat is een voorwaarde om vermeld te mogen staan. WA-dekking is standaard. Wat verschilt is het eigen risico, en dát is het getal om naar te vragen voordat je tekent.' },
          { title: 'De borg', body: 'Geblokkeerd op de creditcard van de hoofdhuurder, vrijgegeven zodra de boot onbeschadigd terug is. Het bedrag schaalt mee met de waarde van de boot en je hoort het vooraf. Neem een echte creditcard mee — een debitcard wordt bij de meeste bases geweigerd.' },
          { title: 'Wat wij doen', body: 'Wij koppelen je datum, groepsgrootte en taal aan de boten die er die dag echt zijn, en antwoorden via WhatsApp in plaats van een ticketformulier. Past een boot niet bij wat je beschreef, dan zeggen we dat.' },
          { title: 'Annuleren', body: 'Weerannuleringen worden bepaald door de basis of de schipper, niet door jou, en leveren een nieuwe datum of je geld terug op. Voorwaarden voor bedenken verschillen per boot; vraag ons om het beleid van die specifieke boot voordat je vastlegt.' },
        ]}
      />

      <ProseSection
        heading="Wat we een vriend zouden zeggen"
        paragraphs={[
          'Plan de boot om het weer heen, niet andersom. De tramuntana blaast uit het noorden en legt die kant van het eiland dagenlang plat, terwijl het zuiden en westen prima blijven. Een schipper draait de route gewoon om; vaar je zelf, vraag het die ochtend bij de basis en wees bereid je plan te wijzigen.',
          'Vertrek vroeg. Niet voor de zonsopgang, maar voor je ankerplek. Cala Comte en Cala Bassa zitten in juli en augustus rond het middaguur vol, en het verschil tussen tien uur en één uur aankomen is of je vanaf de boot zwemt of rondjes vaart op zoek naar ruimte.',
          'Neem meer water en meer schaduw mee dan je denkt nodig te hebben. Vrijwel elke boot onder de tien meter heeft geen van beide, en zes uur mediterrane zon zonder bimini is de meest voorkomende manier om een dag op het water te verpesten.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Gerelateerde pagina's"
        locale={LOCALE}
        links={[
          { label: 'Auto huren op Ibiza', href: 'auto-huren-ibiza', body: 'Hoe je bij de jachthaven komt, en bij de baaien waar geen boot je brengt.' },
          { label: 'Boat party op Ibiza', href: 'boat-party', body: 'De georganiseerde variant: een ticket, een dj en een groep, in plaats van een boot voor jezelf.' },
          { label: 'Privécharters', href: 'private-boat-charters', body: 'Grotere jachten en catamarans, met of zonder schipper.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="boot huren op Ibiza" />
    </>
  )
}
