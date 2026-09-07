import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
const LOCALE: Locale = 'de'
const PAGE_KEY = 'mietwagen-ibiza-flughafen'
const proTag = RENTAL_PRICES.carPerDay.amount

/**
 * Deutsche Variante. Keine Übersetzung der englischen.
 *
 * Aufhänger ist die Gegenintuition: eine Station AUSSERHALB des Flughafens ist
 * im August schneller als der Schalter in der Halle. Deutschsprachige Gäste
 * planen die Anreise durch und sortieren Angebote nach "Schalter im Terminal"
 * als Qualitätsmerkmal — hier ist genau das der langsamere Weg, weil dort drei
 * gleichzeitig gelandete Flüge in einer Schlange stehen.
 *
 * Die englische Seite erwähnt es in einem Nebensatz. Hier ist es der Grund,
 * warum die Seite existiert.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mietwagen Flughafen Ibiza (IBZ)',
    description:
      'Mietwagen am Flughafen Ibiza abholen: Wiber-Station fünf Minuten entfernt, kostenloser Shuttle, kontaktlose Übergabe — im August schneller als der Terminal.',
    alternates: localizedAlternates('car-rental-airport', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Mietwagen Flughafen Ibiza (IBZ)',
      description: 'Warum die Station außerhalb des Terminals im August die schnellere ist.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Mietwagen Flughafen Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Mietwagen Ibiza', path: 'mietwagen-ibiza' },
  { name: 'Flughafen' },
]

const FAQS: Faq[] = [
  { q: 'Ist der Schalter im Terminal?', a: 'Bei Wiber nicht, und das ist der Punkt. Die Station liegt fünf Minuten entfernt an der Ctra. Aeropuerto bei km 5 in Sant Josep, erreichbar mit einem kostenlosen Shuttle. Das klingt nach einem Nachteil und ist im August das Gegenteil: die Stationen außerhalb arbeiten die Übergaben zügiger ab als die Schlange in der Halle, wenn drei Flüge gleichzeitig gelandet sind.' },
  { q: 'Wo finde ich den Shuttle?', a: 'Draußen vor der Ankunft, an der Shuttle-Haltestelle und nicht am Taxistand. Die Fahrt zur Station dauert etwa fünf Minuten. Schick uns deine Flugnummer, dann weiß die Station, wann du landest — das zählt vor allem bei den späten Abendflügen.' },
  { q: 'Was passiert bei Flugverspätung?', a: 'Gib die Flugnummer bei der Buchung an, dann erledigt sich eine Verspätung von selbst: die Station verfolgt die Ankunft und nicht die gebuchte Uhrzeit. Probleme macht nur eine Umbuchung, von der niemand weiß — melde dich also, wenn du den Flug wechselst.' },
  { q: 'Was muss ich zur Abholung mitbringen?', a: 'Eine Kreditkarte auf den Namen des Hauptfahrers, den Führerschein selbst und einen Lichtbildausweis. Alle drei, jedes Mal. Die Kreditkarte ist der Punkt, an dem es hakt: eine Debitkarte oder die Karte des Partners wird abgelehnt, und um Mitternacht am Schalter gibt es dafür keine Lösung.' },
  { q: 'Wie lange dauert die Abholung?', a: 'Mit kontaktloser Übergabe ist der Papierkram vor deiner Ankunft erledigt, es ist also eine Schlüsselübergabe und kein Schaltertermin — meist unter fünfzehn Minuten inklusive Shuttle. Der Vergleich, der zählt, ist eine Terminalschlange im August, und die läuft regelmäßig über eine Stunde.' },
  { q: 'Kann ich außerhalb der Öffnungszeiten zurückgeben?', a: 'Frag bei der Buchung, denn es hängt vom Datum und der Rückgabezeit ab statt pauschal ja oder nein zu sein. Frühe Abflüge sind der Normalfall und werden üblicherweise organisiert. Was du nicht tun darfst: es annehmen und die Schlüssel irgendwo hinterlegen — ein nicht zurückgegebenes Auto bleibt deine Verantwortung.' },
  { q: 'Welche Bedingungen gelten?', a: 'Mindestalter 21, Führerschein seit mindestens 12 Monaten, 9 € Jungfahrerzuschlag pro Tag für 21- bis 24-Jährige, und eine Kreditkarte auf den Namen des Hauptfahrers. Die Versicherung ist im Preis enthalten, es wird also am Schalter nichts nachverkauft.' },
]

export default function MietwagenFlughafenPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Mietwagen am Flughafen Ibiza',
        description: 'All-inclusive-Mietwagen, abgeholt fünf Minuten vom Flughafen Ibiza, mit kostenlosem Shuttle und kontaktloser Übergabe.',
        brand: 'Wiber Rent a Car', price: proTag, path: 'mietwagen-ibiza-flughafen',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Mietwagen am Flughafen Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Abgeholt wird fünf Minuten vom Terminal entfernt, nicht darin: die Wiber-Station liegt an der
            Ctra. Aeropuerto km 5 in Sant Josep, mit kostenlosem Shuttle ab Ankunft und kontaktloser
            Übergabe.
            {proTag ? ` Tarife ab ${proTag} € pro Tag, all-inclusive.` : ''} Das klingt umständlicher als
            ein Schalter in der Halle und ist in der Hochsaison verlässlich schneller — dort stehen drei
            gleichzeitig gelandete Flüge in einer Schlange.
          </p>
        }
      />

      <ItemGrid
        heading="Die Abholung, Schritt für Schritt"
        columns={2}
        items={[
          { name: '1. Flugnummer schicken', body: 'Bei der Buchung, nicht am Tag selbst. Die Station verfolgt die Ankunft, eine Verspätung wird also aufgefangen, ohne dass du vom Gepäckband aus anrufen musst.' },
          { name: '2. Shuttle finden', body: 'Draußen vor der Ankunft an der Shuttle-Haltestelle, nicht am Taxistand. Rund fünf Minuten zur Station bei km 5.' },
          { name: '3. Schlüssel übernehmen', body: 'Der Papierkram ist vorab erledigt. Kreditkarte auf den Namen des Hauptfahrers, Führerschein und Lichtbildausweis — alle drei, jedes Mal.' },
          { name: '4. Auto vorher umrunden', body: 'Einmal herumgehen und fotografieren, was schon markiert ist. Zwei Minuten hier sind die günstigste Versicherung überhaupt, bei jeder Vermietung weltweit.' },
        ]}
      />

      <ProseSection
        heading="Warum außerhalb schneller ist"
        paragraphs={[
          'Ein Schalter im Terminal wirkt wie das bessere Angebot, und im März ist er das auch. Im August nicht. Die Ankunftshalle in Ibiza nimmt abends mehrere Flüge gleichzeitig auf, alle Schalter bedienen dieselbe Schlange, und die Übergabe dauert dort genauso lange wie sonst — nur mit vierzig Leuten davor.',
          'Eine Station fünf Minuten weiter bedient dieselben Gäste verteilt über den Abend, weil der Shuttle sie in kleinen Gruppen bringt. Dazu kommt die kontaktlose Übergabe: der Papierkram ist erledigt, bevor du landest, es bleibt der Schlüssel und ein Blick auf das Auto.',
          'Der einzige Fall, in dem das nicht aufgeht, ist eine Ankunft mitten in der Nacht ohne Vorankündigung. Deshalb steht die Flugnummer oben an erster Stelle.',
        ]}
      />

      <TrustBlock
        heading="Buchen über Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Verfügbarkeit am Flughafen prüfen"
        points={[
          { title: 'Kostenloser Shuttle', body: 'Vom Terminal zur Station bei km 5, inklusive. Kein Taxi, keine Zusatzkosten.' },
          { title: 'All-inclusive-Tarif', body: 'Die Versicherung ist im Preis, es wird dir nach einem langen Flug also nichts am Schalter verkauft.' },
          { title: 'Kontaktlose Übergabe', body: 'Papierkram vor der Ankunft erledigt. Der Schritt, der aus einer Stunde fünfzehn Minuten macht.' },
          { title: 'Ein Ansprechpartner vor Ort', body: 'Wenn an der Station etwas schiefgeht, schreibst du uns — kein Callcenter in einem anderen Land.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Weiterlesen" locale={LOCALE} links={[
        { label: 'Mietwagen auf Ibiza', href: 'mietwagen-ibiza', body: 'Die Pillar-Seite: Bedingungen, Kategorien und warum sich ein Auto hier lohnt.' },
        { label: 'Cabrio mieten auf Ibiza', href: 'cabrio-mieten-ibiza', body: 'Die Küstenstraßen, für die es sich wirklich lohnt.' },
        { label: 'Boot mieten auf Ibiza', href: 'boats', body: 'Wohin du fährst, und was du dort machst.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="Mietwagen am Flughafen Ibiza" />
    </>
  )
}
