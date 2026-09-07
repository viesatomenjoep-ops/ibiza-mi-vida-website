import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { Proof } from '@/components/hub/Proof'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'de'
const PAGE_KEY = 'boot-mieten-ibiza-ohne-fuehrerschein'
const preis = RENTAL_PRICES.boatNoLicence.amount

/**
 * Deutsche Variante. Keine Übersetzung der englischen.
 *
 * Der Aufhänger ist eine Falle, in die nur deutschsprachige Gäste tappen
 * können: 15 PS ist auch in Deutschland die Grenze für führerscheinfreies
 * Fahren. Die Zahl kommt einem also bekannt vor — und genau deshalb liest man
 * über die anderen drei Bedingungen hinweg, die es zu Hause nicht gibt: Rumpf
 * unter sechs Metern, Fahrer ab 18 mit Ausweis, und ein vereinbartes
 * Fahrtgebiet, das man nach dem Briefing nicht verlässt.
 *
 * Wer die deutsche Regel eins zu eins überträgt, bucht ein Boot, das er nicht
 * fahren darf, oder verlässt das Gebiet und ist ohne Versicherung unterwegs.
 *
 * Die vier Bedingungen sind spanisches Recht, keine Hausregel, und das steht
 * auch so da.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boot mieten Ibiza ohne Führerschein',
    description:
      'Boot mieten auf Ibiza ohne Führerschein: maximal 15 PS, Rumpf unter sechs Metern, Fahrer ab 18 und ein vereinbartes Fahrtgebiet. Was damit wirklich geht.',
    alternates: localizedAlternates('boat-no-licence', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Boot mieten Ibiza ohne Führerschein',
      description: '15 PS kennst du aus Deutschland — die anderen drei Bedingungen nicht.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Boot mieten Ibiza ohne Führerschein' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza auf dem Wasser', path: 'boats' },
  { name: 'Ohne Führerschein' },
]

const FAQS: Faq[] = [
  { q: 'Gilt die deutsche 15-PS-Regel auf Ibiza genauso?', a: 'Die Zahl ja, der Rest nicht — und das ist die Stolperfalle. In Deutschland reicht die Leistungsgrenze aus. In Spanien kommen drei Bedingungen dazu, die es zu Hause nicht gibt: der Rumpf muss unter sechs Metern bleiben, der Fahrer muss 18 sein und sich ausweisen, und es gibt ein vereinbartes Fahrtgebiet, das man nicht verlässt. Wer die deutsche Regel eins zu eins überträgt, bucht schnell ein Boot, das er hier nicht fahren darf.' },
  { q: 'Kann ich auf Ibiza wirklich ganz ohne Schein ein Boot mieten?', a: 'Ja, innerhalb einer festen Grenze. Die spanischen Regeln erlauben jedem ab 18 Jahren, ein Boot mit maximal 15 PS und einem Rumpf unter sechs Metern zu fahren, ohne Schein und ohne nachgewiesene Erfahrung. Vorher gibt es ein Briefing und ein Fahrtgebiet, in dem man bleibt. Alles Stärkere oder Längere verlangt einen anerkannten Schein, und kein Vermieter kann darauf verzichten.' },
  { q: 'Wie viel sind 15 PS in der Praxis?', a: 'Genug, um ein kleines Boot mit vier bis sechs Personen im Schritt- bis Jogging-Tempo über das Wasser zu bewegen, und nicht genug zum Gleiten oder gegen Wind anzukommen. Denk daran als Möglichkeit, in zwanzig Minuten die nächste Bucht zu erreichen, nicht als Möglichkeit, die Insel zu umrunden. Wer ein Speedboot erwartet, wird enttäuscht; wer ein schwimmendes Picknick erwartet, nicht.' },
  { q: 'Wohin darf ich fahren?', a: 'In das Gebiet, das die Basis vor der Abfahrt auf einer Karte markiert, normalerweise der Küstenabschnitt um deinen Starthafen. Von San Antonio aus deckt das üblicherweise die Bucht und die Buchten südlich Richtung Cala Bassa und Cala Comte ab. Die Überfahrt nach Formentera gehört nicht dazu — das ist offenes Wasser und braucht ein anderes Boot und realistisch einen Skipper.' },
  { q: 'Was kostet das?', a: 'Führerscheinfreie Boote sind der günstigste Weg aufs Wasser auf Ibiza und kosten weniger als jeder Charter mit Skipper. Kraftstoff wird nach Verbrauch separat abgerechnet, und bei 15 PS ist das wirklich wenig. Der Tarif bewegt sich mit der Saison, also schick uns dein Datum und die Gruppengröße für die aktuelle Zahl.' },
  { q: 'Wie viele Personen passen an Bord?', a: 'Vier bis sechs, festgelegt durch das Zertifikat des Bootes und nicht durch den Platz an Deck. Gib bei der Anfrage die echte Personenzahl an, Kinder eingeschlossen — zu siebt bei einem Zertifikat für sechs anzukommen heißt, dass jemand am Steg bleibt.' },
  { q: 'Brauche ich Erfahrung?', a: 'Nein, und die meisten, die damit rausfahren, haben keine. Das Briefing behandelt Starten, Stoppen, Steuern, Ankern und was zu tun ist, wenn der Motor ausgeht, und die Boote sind bewusst langsam und gutmütig. Wer ein Auto rückwärts einparken kann, kommt hiermit zurecht.' },
]

export default function BootMietenOhneFuehrerscheinPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Boot mieten auf Ibiza ohne Führerschein',
        description: 'Boot mieten auf Ibiza ohne Führerschein: bis 15 PS, Rumpf unter sechs Metern, Fahrer ab 18 Jahren.',
        brand: 'Click&Boat', price: preis, path: 'boot-mieten-ibiza-ohne-fuehrerschein',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boot mieten auf Ibiza ohne Führerschein"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Auf Ibiza darfst du ganz ohne Schein fahren, solange vier Bedingungen eingehalten werden:
            maximal 15 PS, ein Rumpf unter sechs Metern, ein Fahrer ab 18 Jahren und ein vereinbartes
            Fahrtgebiet, in dem du nach dem Sicherheitsbriefing bleibst.
            {preis ? ` Boote ab ${preis} € pro Tag.` : ''} Die 15 PS kennst du aus Deutschland — die
            anderen drei Bedingungen gibt es dort nicht.
          </p>
        }
      />

      <ItemGrid
        heading="Die vier Regeln, vollständig"
        columns={2}
        intro="Das sind gesetzliche Grenzen und keine Hausregeln. Ein Vermieter, der anbietet, eine davon zu dehnen, bietet an, dich außerhalb deines Versicherungsschutzes zu setzen."
        items={[
          { name: 'Maximal 15 PS', body: 'Die Leistungsgrenze für führerscheinfreies Fahren. Diese Zahl entscheidet alles Weitere am Tag: langsam, stabil und bestens geeignet, um zwischen nahen Buchten zu pendeln.' },
          { name: 'Rumpf unter sechs Metern', body: 'Länge zählt genauso wie Leistung. Ein Boot kann unter 15 PS liegen und trotzdem einen Schein verlangen, wenn der Rumpf zu lang ist — deshalb ist die Flotte dafür klein und speziell.' },
          { name: 'Fahrer ab 18', body: 'Wer am Steuer steht, muss 18 sein und sich ausweisen. Mitfahrer dürfen jedes Alter haben, in einer passenden Schwimmweste. Nur der Fahrer unterschreibt.' },
          { name: 'Ein festes Fahrtgebiet', body: 'Beim Briefing auf einer Karte markiert, meist die Küste um deinen Starthafen. Es zu verlassen lässt den Versicherungsschutz entfallen, und die Küstenwache kontrolliert hier tatsächlich.' },
        ]}
      />

      <PriceTable
        heading="Was es kostet"
        locale={LOCALE}
        caption="Einstiegspreis für ein führerscheinfreies Boot"
        intro="Pro Boot, pro Tag, geteilt durch vier bis sechs Personen. Kraftstoff kommt dazu, und der Verbrauch bei 15 PS ist bescheiden."
        rows={[{ label: 'Boot ohne Führerschein', note: '4–6 Personen, max. 15 PS', amount: preis, unit: RENTAL_PRICES.boatNoLicence.unit.de }]}
      />

      <ItemGrid
        heading="Wohin man realistisch kommt"
        intro="Erreichbare Ziele mit 15 PS ab San Antonio, wo die meisten führerscheinfreien Boote liegen."
        items={[
          { name: 'Cala Bassa', body: 'Zwanzig bis dreißig Minuten die Küste hinunter, geschützt und sandig. Der übliche erste Stopp und der einzige, der mit Kindern an Bord wirklich funktioniert.' },
          { name: 'Cala Comte', body: 'Etwas weiter südlich, flach und türkis. An einem ruhigen Tag machbar; sieh dir die Vorhersage an, denn der Rückweg gegen den Wind dauert mit 15 PS lange.' },
          { name: 'Die Bucht von San Antonio', body: 'Die Bucht selbst ist die Rückfalloption und kein Trostpreis: flaches Wasser, einfaches Ankern, und nah genug, um zum Mittagessen zurückzufahren.' },
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Führerscheinfreie Boote auf Click&amp;Boat ansehen
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Weiterlesen" locale={LOCALE} links={[
        { label: 'Boot mieten auf Ibiza', href: 'boats', body: 'Die Pillar-Seite: alle drei Wege aufs Wasser, mit Preisen und Marinas.' },
        { label: 'Boot mieten mit Skipper', href: 'boot-mieten-ibiza-mit-skipper', body: 'Wenn jemand anderes fährt — und warum das oft die günstigere Entscheidung ist.' },
        { label: 'Jetski mieten auf Ibiza', href: 'jetski-mieten-ibiza', body: 'Die schnellere, kürzere Variante, mit eigenen Führerscheinregeln.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="Boot mieten auf Ibiza ohne Führerschein" />
    </>
  )
}
