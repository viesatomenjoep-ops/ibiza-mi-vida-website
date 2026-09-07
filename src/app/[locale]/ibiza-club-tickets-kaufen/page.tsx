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

const LOCALE: Locale = 'de'
const PAGE_KEY = 'ibiza-club-tickets-kaufen'

/**
 * Deutsche Pillar-Seite für Clubtickets. Keine Übersetzung der englischen Seite.
 *
 * Der Unterschied liegt nicht in der Sprache, sondern in der Frage. Die
 * deutschsprachige Suche lautet "Ibiza Tickets kaufen wie am besten" — also
 * nicht "was kostet das", sondern "wann und wo kaufe ich richtig". Entsprechend
 * steht hier die Planung im Mittelpunkt: welche Nächte wirklich ausverkaufen,
 * warum derselbe Ticketpreis im August höher ist als im April, und was die
 * Reihenfolge Flug/Ticket damit zu tun hat.
 *
 * Die englische Fassung beantwortet primär "was kostet es", die niederländische
 * "ist das seriös". Alle drei stimmen — aber wer sie auf eine Seite packt,
 * beantwortet keine davon gut.
 *
 * Preisspannen sind der beobachtbare Markt, nicht unser Tarif: wir verkaufen
 * als Partner über ClubTickets weiter, und eine Saison dynamischer Preise macht
 * "unseren Preis" zu einer Zusage, die wir nicht halten könnten.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza Club Tickets 2026 kaufen',
    description:
      'Ibiza Tickets 2026 richtig kaufen: 20–30 € unter der Woche, 50–125 €+ für Headliner bei UNVRS, Hï und Ushuaïa. Und welche Nächte wirklich ausverkaufen.',
    alternates: localizedAlternates('club-tickets-hub', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza Club Tickets 2026 kaufen',
      description: 'Wann und wo man Ibiza-Clubtickets richtig kauft — und welche Nächte ausverkaufen.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza Club Tickets' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza Club Tickets' },
]

const FAQS: Faq[] = [
  {
    q: 'Wann sollte man Ibiza-Tickets kaufen?',
    a: 'Für die Nächte, die zählen: zusammen mit dem Flug. Openings im Mai, Closings Ende September und Oktober sowie jeder Samstag im August mit einem großen Namen verkaufen sich tatsächlich aus. Ein Dienstag im Juni in der Regel nicht. Die Preise sind außerdem dynamisch — dasselbe Ticket kostet in der letzten Woche mehr als im April, und die günstigste Kategorie ist zuerst weg.',
  },
  {
    q: 'Was kosten Clubtickets auf Ibiza?',
    a: 'Zwei verschiedene Welten. Eine kleinere Nacht unter der Woche liegt bei etwa 20 bis 30 €. Ein Headliner bei UNVRS, Hï Ibiza oder Ushuaïa kostet 50 bis 125 € und darüber, je nach Act und Vorlauf. Das ist der beobachtbare Markt, nicht unser Tarif: wir sind Wiederverkäufer und veröffentlichen deshalb keine eigene Preisliste für eine Saison mit dynamischen Preisen.',
  },
  {
    q: 'Online kaufen oder an der Abendkasse?',
    a: 'Online, aus zwei Gründen, die beide nichts mit dem Preis zu tun haben. Du hast garantierten Einlass an einem Abend, der ausverkaufen kann, und zahlst den offiziellen Tarif statt dessen, was ein Schlepper vor der Tür aufruft. Die Abendkasse ist nicht verlässlich günstiger, und an einem vollen Abend ist die Tür schlicht zu.',
  },
  {
    q: 'Ist das offiziell oder Weiterverkauf?',
    a: 'Offiziell. Wir sind angeschlossener Partner von ClubTickets, das direkt für die Clubs verkauft. Du kaufst also kein gebrauchtes Ticket von einer Privatperson — ein weiterverkaufter QR-Code kann bereits gescannt sein, und dann stehst du draußen. Umgekehrt heißt das auch: günstiger als der Club selbst sind wir nie.',
  },
  {
    q: 'Wie ist der Dresscode?',
    a: 'Lockerer als erwartet, und strenger als angenommen im oberen Bereich. Strandkleidung, Fußballtrikots und Flip-Flops werden an den großen Clubs abgewiesen. Sneaker gehen überall, ein Sakko braucht niemand. Ushuaïa ist ein Tagesclub am Pool und kleidet sich entsprechend; Hï und UNVRS nach Mitternacht eher Ausgehkleidung.',
  },
  {
    q: 'Wann öffnen und schließen die Clubs?',
    a: 'Später als anderswo. Die Nachtclubs öffnen gegen Mitternacht und laufen bis etwa sechs Uhr früh, der Hauptact meist zwischen zwei und drei. Ushuaïa ist die Ausnahme und läuft bei Tageslicht, etwa vom späten Nachmittag bis gegen Mitternacht. Wer um zwölf bei Hï steht, sieht ein Warm-up im leeren Raum.',
  },
  {
    q: 'Kann ich Tickets für andere kaufen?',
    a: 'Ja. Tickets laufen auf einen Namen, werden an der Tür aber in den meisten Sälen als QR-Code gescannt — für eine Gruppe zu kaufen ist normal, und eine Person kann alle verwalten. Wo ein Club den Namen tatsächlich gegen den Ausweis prüft, sagen wir das vor dem Kauf und nicht danach.',
  },
  {
    q: 'Was ist im Ticketpreis enthalten?',
    a: 'Der Eintritt, sonst nichts. Getränke werden drinnen gekauft und sind teuer — das ist der Teil des Budgets, den man unterschätzt, nicht das Ticket. Tischservice, Getränkepakete und Gästeliste sind separate Dinge; wie die wirklich funktionieren, steht auf der Guestlist-Seite.',
  },
  {
    q: 'Gibt es eine Altersgrenze?',
    a: 'Achtzehn, und sie wird an der Tür jedes großen Clubs mit einem physischen Lichtbildausweis kontrolliert. Ein Foto des Passes auf dem Handy wird in den meisten Häusern nicht akzeptiert. Nimm das Dokument selbst mit — das ist spanisches Recht und keine Clubregel, es gibt also keinen Ermessensspielraum.',
  },
]

const CLUBS = [
  {
    name: 'UNVRS',
    body:
      'Der neueste und größte Saal der Insel, gebaut für Shows in einer Größe, für die man früher ein Stadion brauchte. Große Namen und große Preise — hier liegen die Tickets ab 125 €.',
  },
  {
    name: 'Hï Ibiza',
    body:
      'Playa d’en Bossa, seit Jahren ganz oben in den weltweiten Clublisten, mit zwei Hauptsälen, die am selben Abend Unterschiedliches spielen. Die sichere Wahl, wenn du nur einen Abend hast.',
  },
  {
    name: 'Ushuaïa',
    body:
      'Der Open-Air-Club und der einzige große Saal, der bei Tageslicht läuft. Vom späten Nachmittag bis gegen Mitternacht, am Pool, das Publikum früh in Badekleidung und später in Ausgehkleidung.',
  },
  {
    name: 'Pacha',
    body:
      'Der älteste, in Ibiza-Stadt, und kleiner als die Arenen oben. Lohnt sich wegen des Raums selbst, nicht nur wegen des Line-ups — näher kommt man dem Ursprung des Clubbings hier nicht.',
  },
  {
    name: 'Amnesia',
    body:
      'An der Straße nach San Antonio, mit Terrace und Club Room parallel. Historisch die härtere Seite der Insel und der Club mit den stärksten Opening- und Closing-Partys.',
  },
]

export default function IbizaClubTicketsKaufenPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza Club Tickets 2026 kaufen"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Rechne mit 20 bis 30 € für eine kleinere Nacht unter der Woche und 50 bis 125 € oder mehr
              für einen Headliner bei UNVRS, Hï Ibiza oder Ushuaïa. Die wichtigere Frage ist aber nicht
              was, sondern wann: die Preise sind über die Saison dynamisch, und die Nächte, auf die es
              ankommt, verkaufen wirklich aus.
            </p>
            <p className="mt-4">
              Praktisch heißt das: Ticket zusammen mit dem Flug buchen, nicht nach der Landung. Wir
              verkaufen als angeschlossener Partner von ClubTickets, das direkt für die Clubs arbeitet —
              günstiger als der Club selbst sind wir nie, dafür ist der Einlass sicher.
            </p>
          </>
        }
      >
        <div className="mt-7">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Diese Woche ansehen
          </AffiliateLink>
        </div>
      </HubHero>

      <PriceTable
        heading="Was ein Abend kostet"
        locale={LOCALE}
        caption="Übliche Ticketpreise nach Art des Abends"
        intro="Beobachtete Marktspannen, nur Eintritt, nicht unsere Preisliste. Getränke kommen dazu und dorthin geht das Budget tatsächlich."
        rows={[
          { label: 'Unter der Woche, kleinere Nacht', note: 'Residents, außerhalb der Hochsaison', amount: 20, unit: 'ab, pro Person' },
          { label: 'Wochenende, etablierter Abend', note: 'Amnesia, Pacha, Ushuaïa', amount: 40, unit: 'ab, pro Person' },
          { label: 'Headliner', note: 'UNVRS, Hï, große Buchungen bei Ushuaïa', amount: 50, unit: 'ab, bis über 125 €' },
        ]}
      />

      <ItemGrid
        heading="Die Clubs"
        intro="Fünf Säle decken das meiste ab, wofür man herkommt. Es sind wirklich verschiedene Abende, keine fünf Varianten desselben."
        items={CLUBS}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Termine ansehen und Tickets kaufen
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Weiterlesen"
        locale={LOCALE}
        links={[
          { label: 'Gästeliste und VIP-Tische', href: 'guestlist', body: 'Was Guestlist hier wirklich bedeutet — und was nicht.' },
          { label: 'Ibiza Clubkalender', href: 'calendar', body: 'Jeder datierte Abend auf der Insel, nach Tag.' },
          { label: 'Was ein Abend kostet', href: 'ibiza-prices', body: 'Gemessene Preise pro Club, aus unserem eigenen Kalender.' },
          { label: 'Wann Ibiza schließt', href: 'ibiza-season', body: 'Die letzte geplante Nacht pro Club, aus dem Kalender gelesen.' },
          { label: 'Boat Party auf Ibiza', href: 'boat-party', body: 'Die Tagesversion, bevor der Clubabend beginnt.' },
          { label: 'Mietwagen auf Ibiza', href: 'mietwagen-ibiza', body: 'Nach Amnesia und zurück, ohne Taxi-Aufschlag um sechs.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Ibiza Club Tickets" />
    </>
  )
}
