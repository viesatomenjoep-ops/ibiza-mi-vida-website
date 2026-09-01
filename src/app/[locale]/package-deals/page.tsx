import type { Metadata } from 'next'
import Link from 'next/link'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { PackageDealPicker } from '@/components/guestlist/PackageDealPicker'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { contentUpdated } from '@/lib/content-dates'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600
const PAGE_KEY = 'package-deals'

/**
 * Club package deals, split off from /guestlist.
 *
 * The two lived on one page under the heading "Ibiza package deals & club
 * guestlist", which is two commercial queries sharing one URL. They are not
 * the same product and people do not search for them the same way: "ibiza
 * package deal" is somebody organising a group's night and comparing what a
 * bundle includes, "ibiza guestlist" is somebody who wants their name at a
 * door and mostly does not know what that involves. One page answering both
 * ranks properly for neither, and an answer engine asked either question got a
 * page that spent half its words on the other thing.
 *
 * Each page now owns one intent, one H1, one FAQ set and one schema block, and
 * they link to each other so a reader who picked the wrong one lands right in a
 * click.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Voor groepen', 'For groups', 'Für Gruppen', 'Para grupos', 'Pour les groupes')

const TITLE: T = L(
  'Ibiza package deals voor groepen',
  'Ibiza Club Package Deals',
  'Ibiza Package Deals für Gruppen',
  'Package deals de clubs en Ibiza',
  'Package deals clubs à Ibiza',
)

const H1: T = L(
  'Package deals voor Ibiza-clubs',
  'Ibiza Club Package Deals',
  'Package Deals für Ibiza-Clubs',
  'Package deals para clubs de Ibiza',
  'Package deals pour les clubs d’Ibiza',
)

/** Answer-first: what it is, in the first lines, before any selling. */
const ANSWER: T = L(
  'Een package deal is één pakket voor je hele groep in plaats van losse tickets: entree voor iedereen, en afhankelijk van de club en de avond vaak ook drank, een tafel of vervoer. Wat er precies in zit verschilt per club en per datum — daarom noemen we hier geen vast bedrag, maar bevestigen we het pakket voordat je betaalt.',
  'A package deal is one bundle for your whole group instead of separate tickets: entry for everyone, and depending on the club and the night often drinks, a table or transport as well. What is included differs per club and per date — which is why there is no fixed figure here, and why we confirm the package before you pay.',
  'Ein Package Deal ist ein Paket für die ganze Gruppe statt Einzeltickets: Eintritt für alle und je nach Club und Abend oft auch Getränke, ein Tisch oder Transport. Was enthalten ist, unterscheidet sich pro Club und Datum — deshalb steht hier kein fester Betrag, und wir bestätigen das Paket vor der Zahlung.',
  'Un package deal es un paquete para todo el grupo en lugar de entradas sueltas: entrada para todos y, según el club y la noche, a menudo copas, mesa o transporte. Lo incluido varía por club y por fecha — por eso no damos una cifra fija aquí y confirmamos el paquete antes de pagar.',
  'Un package deal, c’est une formule pour tout le groupe au lieu de billets séparés : l’entrée pour chacun et, selon le club et la soirée, souvent les boissons, une table ou le transport. Le contenu varie selon le club et la date — d’où l’absence de montant fixe ici, et la confirmation avant paiement.',
)

const PICK_TITLE: T = L(
  'Stel je pakket samen',
  'Build your package',
  'Stell dein Paket zusammen',
  'Crea tu paquete',
  'Composez votre formule',
)

const CTA_Q: T = L(
  'Met hoeveel zijn jullie?',
  'How many of you are there?',
  'Wie viele seid ihr?',
  '¿Cuántos sois?',
  'Vous êtes combien ?',
)

const CTA_BTN: T = L(
  'Vraag een pakket aan',
  'Ask for a package',
  'Paket anfragen',
  'Pedir un paquete',
  'Demander une formule',
)

const OTHER: T = L(
  'Zoek je alleen de gastenlijst?',
  'Just looking for the guestlist?',
  'Suchst du nur die Gästeliste?',
  '¿Solo buscas la lista?',
  'Vous cherchez seulement la guestlist ?',
)

const OTHER_LINK: T = L(
  'Naar de Ibiza guestlist',
  'Go to the Ibiza guestlist',
  'Zur Ibiza-Gästeliste',
  'Ir a la lista de Ibiza',
  'Vers la guestlist Ibiza',
)

const FAQS: Record<Locale, Faq[]> = {
  nl: [
    { q: 'Wat is een package deal precies?', a: 'Eén pakket voor je hele groep in plaats van losse tickets. Entree voor iedereen zit er altijd in; afhankelijk van de club en de avond komen daar drank, een tafel of vervoer bij. Je krijgt vooraf op een rij wat er in jouw pakket zit, per club en per datum.' },
    { q: 'Vanaf hoeveel personen is het interessant?', a: 'In de praktijk vanaf een stuk of vier. Daaronder is los boeken meestal net zo makkelijk. Hoe groter de groep, hoe meer een pakket oplevert — niet alleen in prijs, maar vooral doordat iedereen samen naar binnen gaat in plaats van dat de helft in de rij blijft staan.' },
    { q: 'Wat kost een package deal?', a: 'Dat hangt af van de club, de datum en de omvang van je groep, en het verschilt te veel om er hier een bedrag bij te zetten. Een headliner op zaterdag in augustus is een andere wereld dan een doordeweekse avond in juni. Stuur ons club, datum en aantal, dan krijg je het echte bedrag voor die avond.' },
    { q: 'Is een pakket hetzelfde als op de gastenlijst staan?', a: 'Nee. Een pakket is een geboekt geheel voor je groep, met entree en meestal meer. De gastenlijst is een naamlijst aan de deur en betekent per avond iets anders — soms gratis vóór een bepaald tijdstip, soms een lagere prijs. Wil je dat, kijk dan op onze guestlist-pagina.' },
    { q: 'Hoe boeken we het?', a: 'Via WhatsApp. Je stuurt de club, de datum en met hoeveel jullie zijn; wij checken wat er die avond mogelijk is en sturen het pakket terug met wat erin zit. Pas als je akkoord bent, wordt er iets vastgelegd.' },
    { q: 'Kan het nog kort van tevoren?', a: 'Vaak wel, maar de goede pakketten zijn dan weg. Voor openings, closings en de grote namen op zaterdag in augustus regel je het weken vooruit; voor een doordeweekse avond in juni volstaat een paar dagen. Vragen kost niets — we zeggen eerlijk of het nog kan.' },
  ],
  en: [
    { q: 'What exactly is a package deal?', a: 'One bundle for your whole group instead of separate tickets. Entry for everyone is always in it; depending on the club and the night, drinks, a table or transport come with it. You get the contents of your specific package listed before you commit, per club and per date.' },
    { q: 'From how many people is it worth it?', a: 'In practice from around four. Below that, booking separately is usually just as easy. The bigger the group the more a package returns — not only in price, but mostly because everyone goes in together rather than half of you staying in the queue.' },
    { q: 'What does a package deal cost?', a: 'It depends on the club, the date and the size of your group, and it varies too much to put a figure here. A headline Saturday in August is a different world from a midweek night in June. Send us the club, the date and the headcount and you get the real number for that night.' },
    { q: 'Is a package the same as being on the guestlist?', a: 'No. A package is a booked arrangement for your group, covering entry and usually more. A guestlist is a name list at the door and means something different each night — sometimes free before a certain time, sometimes a reduced price. If that is what you want, see our guestlist page.' },
    { q: 'How do we book it?', a: 'Over WhatsApp. You send the club, the date and how many of you there are; we check what is possible that night and send the package back with what it includes. Nothing is held until you agree to it.' },
    { q: 'Can we still arrange it last minute?', a: 'Often yes, but the good packages are gone by then. For openings, closings and the big Saturday names in August you want weeks; for a midweek night in June a few days is fine. Asking costs nothing — we will tell you honestly whether it is still possible.' },
  ],
  de: [
    { q: 'Was ist ein Package Deal genau?', a: 'Ein Paket für die ganze Gruppe statt Einzeltickets. Eintritt für alle ist immer dabei; je nach Club und Abend kommen Getränke, ein Tisch oder Transport dazu. Was in deinem Paket steckt, bekommst du vorher aufgelistet — pro Club und pro Datum.' },
    { q: 'Ab wie vielen Personen lohnt es sich?', a: 'In der Praxis ab etwa vier. Darunter ist einzeln buchen meist genauso einfach. Je größer die Gruppe, desto mehr bringt ein Paket — nicht nur beim Preis, vor allem weil alle zusammen reinkommen statt die Hälfte in der Schlange zu warten.' },
    { q: 'Was kostet ein Package Deal?', a: 'Das hängt von Club, Datum und Gruppengröße ab und schwankt zu stark für eine Zahl an dieser Stelle. Ein Samstag mit großem Namen im August ist eine andere Welt als ein Mittwoch im Juni. Schick uns Club, Datum und Personenzahl, dann bekommst du den echten Betrag.' },
    { q: 'Ist ein Paket dasselbe wie die Gästeliste?', a: 'Nein. Ein Paket ist eine gebuchte Sache für deine Gruppe, mit Eintritt und meist mehr. Die Gästeliste ist eine Namensliste an der Tür und bedeutet jeden Abend etwas anderes — mal frei vor einer bestimmten Zeit, mal ein reduzierter Preis. Dafür gibt es unsere Gästelisten-Seite.' },
    { q: 'Wie buchen wir das?', a: 'Per WhatsApp. Du schickst Club, Datum und Personenzahl; wir prüfen, was an dem Abend geht, und schicken das Paket mit Inhalt zurück. Festgehalten wird erst, wenn du zustimmst.' },
    { q: 'Geht das auch kurzfristig?', a: 'Oft ja, aber die guten Pakete sind dann weg. Für Openings, Closings und die großen Samstage im August rechnest du in Wochen; für einen Mittwoch im Juni reichen ein paar Tage. Fragen kostet nichts — wir sagen ehrlich, ob es noch geht.' },
  ],
  es: [
    { q: '¿Qué es exactamente un package deal?', a: 'Un paquete para todo el grupo en lugar de entradas sueltas. La entrada para todos siempre está incluida; según el club y la noche se añaden copas, mesa o transporte. Antes de comprometerte te detallamos qué lleva tu paquete concreto, por club y por fecha.' },
    { q: '¿A partir de cuántas personas compensa?', a: 'En la práctica a partir de cuatro. Por debajo, reservar por separado suele ser igual de fácil. Cuanto mayor el grupo, más aporta un paquete — no solo en precio, sino sobre todo porque entráis todos juntos en vez de quedaros la mitad en la cola.' },
    { q: '¿Cuánto cuesta un package deal?', a: 'Depende del club, la fecha y el tamaño del grupo, y varía demasiado para poner una cifra aquí. Un sábado con un nombre grande en agosto no tiene nada que ver con un miércoles de junio. Mándanos club, fecha y número de personas y te damos el importe real.' },
    { q: '¿Un paquete es lo mismo que estar en lista?', a: 'No. Un paquete es algo reservado para tu grupo, con entrada y normalmente más. La lista es un listado de nombres en la puerta y cada noche significa algo distinto — a veces gratis antes de cierta hora, a veces precio reducido. Para eso tenemos la página de lista.' },
    { q: '¿Cómo lo reservamos?', a: 'Por WhatsApp. Nos mandas el club, la fecha y cuántos sois; comprobamos qué es posible esa noche y te devolvemos el paquete con lo que incluye. No se bloquea nada hasta que digas que sí.' },
    { q: '¿Se puede a última hora?', a: 'A menudo sí, pero los buenos paquetes ya no están. Para openings, closings y los sábados grandes de agosto cuentas en semanas; para un miércoles de junio bastan unos días. Preguntar no cuesta nada y te diremos con franqueza si aún es viable.' },
  ],
  fr: [
    { q: 'Qu’est-ce qu’un package deal exactement ?', a: 'Une formule pour tout le groupe au lieu de billets séparés. L’entrée pour chacun est toujours comprise ; selon le club et la soirée s’y ajoutent les boissons, une table ou le transport. Le contenu de votre formule vous est détaillé avant tout engagement, par club et par date.' },
    { q: 'À partir de combien de personnes est-ce intéressant ?', a: 'En pratique à partir de quatre environ. En dessous, réserver séparément est aussi simple. Plus le groupe est grand, plus une formule rapporte — pas seulement sur le prix, surtout parce que tout le monde entre ensemble au lieu que la moitié reste dans la file.' },
    { q: 'Combien coûte un package deal ?', a: 'Cela dépend du club, de la date et de la taille du groupe, et cela varie trop pour afficher un montant ici. Un samedi de gros nom en août n’a rien à voir avec un mercredi de juin. Envoyez-nous le club, la date et le nombre de personnes et vous aurez le vrai montant.' },
    { q: 'Une formule, est-ce la même chose que la guestlist ?', a: 'Non. Une formule est un ensemble réservé pour votre groupe, avec l’entrée et généralement davantage. La guestlist est une liste de noms à la porte, et elle signifie autre chose chaque soir — parfois gratuit avant une certaine heure, parfois un tarif réduit. Voyez notre page guestlist.' },
    { q: 'Comment réserve-t-on ?', a: 'Par WhatsApp. Vous envoyez le club, la date et votre nombre ; nous vérifions ce qui est possible ce soir-là et renvoyons la formule avec son contenu. Rien n’est bloqué avant votre accord.' },
    { q: 'Peut-on s’y prendre au dernier moment ?', a: 'Souvent oui, mais les bonnes formules sont alors parties. Pour les openings, closings et les grands samedis d’août, comptez en semaines ; pour un mercredi de juin, quelques jours suffisent. Demander ne coûte rien et nous vous dirons franchement si c’est encore jouable.' },
  ],
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const DESC: T = L(
    'Package deals voor Ibiza-clubs: één pakket voor je groep, met entree en vaak drank of tafel. Wij regelen het via WhatsApp en bevestigen wat die avond geldt.',
    'Club package deals in Ibiza: one bundle for the whole group, covering entry and often drinks or a table. We arrange it over WhatsApp and confirm what applies.',
    'Package Deals für Ibiza-Clubs: ein Paket für die ganze Gruppe, mit Eintritt und oft Getränken oder Tisch. Wir regeln es per WhatsApp und bestätigen, was gilt.',
    'Package deals de clubs en Ibiza: un paquete para todo el grupo, con entrada y a menudo copas o mesa. Lo gestionamos por WhatsApp y confirmamos qué aplica.',
    'Package deals pour les clubs d’Ibiza : une formule pour le groupe, entrée et souvent boissons ou table. Nous organisons par WhatsApp et confirmons les règles.',
  )
  return pageMetadata({ locale: l, path: 'package-deals', title: TITLE[l], description: DESC[l] })
}

export default function PackageDealsPage({ params: { locale } }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const faqs = FAQS[l]
  const HOME: T = L('Home', 'Home', 'Startseite', 'Inicio', 'Accueil')

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SchemaMarkup
        locale={l}
        faqs={faqs}
        breadcrumbs={[{ name: HOME[l], path: '' }, { name: TITLE[l] }]}
      />

      <section className="px-4 pb-12 pt-[calc(var(--nav-h)+40px)] text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h1 className="mt-3 break-words font-serif text-4xl font-black tracking-tight text-neutral-900 md:text-6xl">
          {H1[l]}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-left text-[16px] leading-relaxed text-neutral-700 md:text-center">
          {ANSWER[l]}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <span className="font-serif text-sm font-black uppercase tracking-widest text-neutral-900">{CTA_Q[l]}</span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-4 font-serif text-[13px] font-black uppercase tracking-widest text-white outline-none transition-colors hover:bg-gold-soft hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            {CTA_BTN[l]}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="mb-6 font-serif text-2xl font-black tracking-tight md:text-3xl">{PICK_TITLE[l]}</h2>
        <PackageDealPicker locale={locale} />
      </section>

      {/* Cross-link: somebody who wanted the other thing is one click away. */}
      <section className="border-t border-black/5 bg-neutral-50 py-10">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-base font-bold text-neutral-900">{OTHER[l]}</p>
          <Link
            href={`/${l}/guestlist`}
            className="rounded-full text-[15px] font-semibold text-neutral-900 underline underline-offset-4 outline-none transition-colors hover:text-gold focus-visible:ring-2 focus-visible:ring-gold"
          >
            {OTHER_LINK[l]} →
          </Link>
        </div>
      </section>

      <FaqAccordion faqs={faqs} locale={l} />
      <AuthorByline locale={l} topic="Ibiza club package deals" />
    </div>
  )
}
