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

const LOCALE: Locale = 'de'
const PAGE_KEY = 'jetski-mieten-ibiza'
const preis30 = RENTAL_PRICES.jetSki30.amount

/**
 * Deutsche Jetski-Seite. Keine Übersetzung der englischen.
 *
 * Die englische Fassung erklärt, DASS man einen Schein braucht, um allein zu
 * fahren. Für deutschsprachige Gäste ist das selten die offene Frage — viele
 * haben einen Sportbootführerschein und wollen wissen, ob der hier zählt. Das
 * ist der Einstieg dieser Seite.
 *
 * Und genau dort liegt die Grenze dessen, was wir behaupten dürfen. Welche
 * ausländischen Papiere eine Vermietbasis akzeptiert, unterscheidet sich pro
 * Basis und ändert sich. Wir sagen also nicht "dein SBF gilt", sondern "schick
 * ihn, wir klären es vor der Buchung". Ein falsches Ja bedeutet hier jemanden,
 * der umsonst zum Steg fährt — oder schlimmer, illegal auf dem Wasser.
 *
 * Der rechtliche Kern ist überall gleich und steht im ersten Absatz: allein
 * fahren verlangt einen anerkannten Schein, sonst geführte Tour, wo die
 * Qualifikation des Guides die Gruppe abdeckt. Eine dritte Möglichkeit gibt es
 * nicht.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jetski mieten auf Ibiza',
    description:
      'Jetski mieten auf Ibiza ab San Antonio, in 30-Minuten-Slots. Allein fahren verlangt einen Schein, die geführte Tour nicht. Wir prüfen deine Papiere vorab.',
    alternates: localizedAlternates('jet-ski-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Jetski mieten auf Ibiza',
      description: 'Jetski ab San Antonio. Gilt dein Sportbootführerschein hier? Wir klären das vorab.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Jetski mieten auf Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza auf dem Wasser', path: 'boats' },
  { name: 'Jetski mieten Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Gilt mein Sportbootführerschein auf Ibiza?',
    a: 'Manchmal, und das ist keine Ausflucht. Spanien erkennt eine Reihe ausländischer Scheine an, aber welchen eine Vermietbasis in der Praxis akzeptiert, unterscheidet sich pro Basis und ändert sich. Schick uns ein Foto deiner Papiere zusammen mit dem Datum, dann fragen wir vor der Buchung nach. Wir sagen lieber vorher Nein, als dass du umsonst zum Steg fährst.',
  },
  {
    q: 'Brauche ich einen Führerschein, um auf Ibiza Jetski zu fahren?',
    a: 'Um allein zu fahren ja — das spanische Recht verlangt einen anerkannten Schein für Wassermotorräder oder Boote, und die Basis will ihn sehen. Ohne Schein kannst du trotzdem fahren, aber nur auf einer geführten Tour: ein qualifizierter Guide fährt mit und seine Papiere decken die ganze Gruppe ab. Das ist der ganze Unterschied, und wer etwas anderes behauptet, setzt dich illegal aufs Wasser.',
  },
  {
    q: 'Was kostet eine halbe Stunde Jetski auf Ibiza?',
    a: 'Dreißig Minuten sind der Standardslot und der übliche Einstiegspreis auf der Insel. Was die Zahl bewegt, sind Maschine und Format: eine geführte Tour kostet mehr als dieselbe halbe Stunde allein, weil ein Guide und eine zweite Maschine mit aufs Wasser gehen. Die Spitzenwochen im Juli und August liegen am oberen Rand. Schick dein Datum, du bekommst den Tarif für den Tag.',
  },
  {
    q: 'Können zwei Personen auf einen Jetski?',
    a: 'Ja, auf den Zwei- und Dreisitzern, die den Großteil der Mietflotte hier ausmachen, und für ein Paar ist das die günstigere Variante. Nur einer fährt — Schein oder Guide hängen an der Person an den Griffen. Die Basen setzen ein kombiniertes Gewichtslimit, zwei Erwachsene auf einem kleinen Zweisitzer werden also manchmal abgelehnt.',
  },
  {
    q: 'Welches Mindestalter gilt?',
    a: 'Achtzehn zum Fahren. Mitfahrer dürfen jünger sein, aber jede Basis setzt ihre eigene Untergrenze für den Sozius — oft etwa 6 oder 8 Jahre, und immer in einer passenden Schwimmweste. Bring einen Ausweis für den Fahrer mit: eine Buchung auf einen Namen und eine andere Person an den Griffen ist der Punkt, an dem es Ärger gibt.',
  },
  {
    q: 'Was soll ich mitbringen?',
    a: 'Badekleidung, die nass werden darf, ein Handtuch und eine Sonnenbrille mit Band oder gar keine. Sonnencreme kommt vorher drauf und geht trotzdem teilweise ab. Lass das Handy an Land, außer du hast eine dichte, schwimmfähige Hülle — jede Basis hat eine Kiste mit ertrunkenen Telefonen. Die Schwimmweste wird gestellt, und sie zu tragen ist nicht optional.',
  },
  {
    q: 'Welche Tageszeit ist die beste?',
    a: 'Der Vormittag. Das Meer vor San Antonio ist bis etwa zwölf am flachsten; danach baut die Seebrise eine kurze Welle auf, die eine halbe Stunde anstrengender macht, als es klingt. Der späte Nachmittag hat das bessere Licht für Fotos, dafür fährst du gegen mehr Dünung. Buche im Juli und August den frühesten Slot, den du schaffst.',
  },
]

export default function JetskiMietenIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Jetski mieten auf Ibiza',
          description:
            'Jetski mieten ab San Antonio, Ibiza, in 30-Minuten-Slots. Eine geführte Tour verlangt keinen Schein, allein fahren schon.',
          price: preis30,
          path: 'jetski-mieten-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Jetski mieten auf Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Jetskis starten in San Antonio in 30-Minuten-Slots — die Standardeinheit hier und lang genug
              für die Bucht und zurück.
              {preis30 ? ` Ab ${preis30} € für 30 Minuten.` : ''} Die Regel, die deine Buchung entscheidet,
              ist rechtlich und nicht kommerziell: In Spanien brauchst du einen Schein, um allein zu fahren,
              oder du gehst auf eine geführte Tour, bei der die Qualifikation des Guides die Gruppe abdeckt.
            </p>
            <p className="mt-4">
              Hast du einen Sportbootführerschein, lautet die eigentliche Frage, ob der hier akzeptiert
              wird — und das unterscheidet sich pro Basis. Schick ein Foto deiner Papiere, dann klären wir
              es vor der Buchung statt danach.
            </p>
          </>
        }
      />

      <ChoiceCards
        heading="Geführte Tour oder allein fahren"
        locale={LOCALE}
        cards={[
          {
            title: 'Geführte Tour',
            meta: 'Kein Schein nötig · Guide fährt mit',
            body:
              'Ein qualifizierter Guide fährt mit und seine Papiere decken die Gruppe ab. Ihr folgt einer festen Route, meist entlang der Küste von San Antonio Richtung Sonnenuntergangsklippen. Der einzige legale Weg, hier ohne eigenen Schein zu fahren.',
            href: 'boats',
            cta: 'Nach Touren fragen',
          },
          {
            title: 'Allein fahren',
            meta: 'Schein erforderlich · eigene Route in einer Zone',
            body:
              'Zeig einen gültigen Schein für Wassermotorräder oder Boote und du fährst selbst hinaus, innerhalb eines markierten Bereichs, den die Basis festlegt. Mehr Freiheit, und du bestimmst das Tempo.',
            href: 'boats',
            cta: 'Welche Scheine zählen',
          },
          {
            title: 'Zu zweit',
            meta: 'Ein Fahrer · Mitfahrer ab etwa 6–8',
            body:
              'Zwei- und Dreisitzer nehmen einen Mitfahrer mit, was die Kosten pro Person halbiert. Nur der Fahrer braucht Schein oder Guide. Es gilt ein kombiniertes Gewichtslimit, also bei der Buchung prüfen.',
            href: 'boat-party',
            cta: 'Optionen für Gruppen',
          },
        ]}
      />

      <PriceTable
        heading="Was ein Jetski auf Ibiza kostet"
        locale={LOCALE}
        caption="Einstiegspreise für Jetski-Vermietung"
        intro="Dreißig Minuten sind der Standardslot. Eine geführte Tour kostet mehr als dieselbe Zeit allein, weil ein Guide und eine zweite Maschine mitfahren. Juli und August liegen am oberen Rand."
        rows={[
          {
            label: 'Jetski, 30 Minuten',
            note: 'Standardslot, eine Maschine',
            amount: RENTAL_PRICES.jetSki30.amount,
            unit: RENTAL_PRICES.jetSki30.unit.de,
          },
        ]}
      />

      <ItemGrid
        heading="Wo du fährst"
        intro="Alles startet in der Bucht von San Antonio. Die Routen unten sind das, was die geführten Touren tatsächlich abfahren; wer allein fährt, bleibt in einer markierten Zone, die die Basis vorher auf einer Karte zeigt."
        columns={2}
        items={[
          {
            name: 'Die Bucht von San Antonio',
            body:
              'Das geschützte Wasser, in dem ihr startet und wo das Briefing stattfindet. Morgens flach, choppig sobald die Nachmittagsbrise einsetzt. Nahe den Stränden gilt eine Geschwindigkeitsbegrenzung, und die Basis sagt dir genau, wo die Linie liegt.',
          },
          {
            name: 'Cala Bassa und Cala Comte',
            body:
              'Südlich an der Küste entlang, um die Landzungen herum zu den beiden großen Weststränden. Die übliche längere Tour. Ihr seht die Buchten vom Wasser aus, statt anzulanden — Jetskis gehören nicht an die Schwimmleinen.',
          },
          {
            name: 'Die Sonnenuntergangsklippen',
            body:
              'Nordwestlich der Bucht, wo die Küste zu Fels wird. Der beste Abschnitt für Fotos und der Grund, warum die späten Slots ausverkaufen. Offeneres Wasser, also die erste Route, die bei auffrischendem Wind gestrichen wird.',
          },
          {
            name: 'Richtung Es Vedrà',
            body:
              'Nur auf längeren geführten Touren und nur bei ruhigen Bedingungen. Das ist eine ernsthafte Fahrt über offenes Wasser an der Westküste entlang, kein Halbstundenausflug, und keine Basis schickt einen unbegleiteten Anfänger dorthin.',
          },
        ]}
      />

      <TrustBlock
        heading="Vor der Buchung"
        locale={LOCALE}
        intro="Drei Dinge entscheiden, ob eine Jetski-Buchung glatt läuft, und alle drei klärt man vorher statt am Steg."
        points={[
          {
            title: 'Die Führerscheinfrage',
            body:
              'Kläre das bei der Buchung, nicht an der Basis. Hat niemand in eurer Gruppe einen anerkannten Schein, bleibt nur die geführte Form — eine dritte gibt es nicht, und aufzutauchen in der Hoffnung, sich hineinzureden, kostet den Slot. Unsicher wegen deines SBF: schick ihn uns.',
          },
          {
            title: 'Kaution und Ausweis',
            body:
              'Eine Kaution wird auf einer Kreditkarte im Namen des Fahrers geblockt und freigegeben, sobald die Maschine unbeschädigt zurück ist. Bring die physische Karte und einen Lichtbildausweis mit. Der in der Buchung genannte Fahrer muss auch derjenige sein, der unterschreibt.',
          },
          {
            title: 'Wetter',
            body:
              'Jetski-Slots werden häufiger abgesagt als Boote, weil eine kleine Maschine eine Welle spürt, die ein Rumpf nicht merkt. Eine wetterbedingte Absage bringt einen neuen Slot oder das Geld zurück, und die Entscheidung liegt bei der Basis.',
          },
          {
            title: 'Was wir machen',
            body:
              'Wir prüfen, welche Basen deinen Slot am gewünschten Datum frei haben, in der Form, die deine Gruppe rechtlich nutzen darf, und antworten über WhatsApp. Kann deine Gruppe nicht so fahren, wie du es dir vorstellst, sagen wir das vor der Zahlung.',
          },
        ]}
      />

      <ProseSection
        heading="Was wir einem Freund sagen würden"
        paragraphs={[
          'Buch den ersten Slot des Tages. Der Unterschied zwischen neun Uhr morgens und drei Uhr nachmittags ist nicht der Preis, sondern ob du eine halbe Stunde über flaches Wasser gleitest oder durch einen Meter Windwelle hämmerst. Wer im August den Nachmittagsslot bucht, lernt das einmal.',
          'Eine halbe Stunde reicht beim ersten Mal wirklich. Es klingt kurz und ist es nicht: sich bei Tempo festzuhalten beansprucht Muskeln, die man sonst nicht benutzt, und die meisten sind nach etwa fünfundzwanzig Minuten fertig. Buch den kurzen Slot und häng einen zweiten dran, wenn es gefallen hat.',
          'Lass das Handy liegen. Wenn das Foto zählt, frag, ob der Guide eine Kamera dabei hat — die meisten haben eine — denn die Alternative ist ein Telefon in einer Tasche, das nach zehn Minuten unter Wasser steht.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Weiterlesen"
        locale={LOCALE}
        links={[
          { label: 'Boot mieten auf Ibiza', href: 'boats', body: 'Die Pillar-Seite: mit Skipper, mit eigenem Schein oder führerscheinfrei bis 15 PS.' },
          { label: 'Boat Party auf Ibiza', href: 'boat-party', body: 'Die andere Art, einen Tag auf dem Wasser zu verbringen.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Jetski mieten auf Ibiza" />
    </>
  )
}
