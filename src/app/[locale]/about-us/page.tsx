import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { staticMetadata } from '@/lib/seo-pages'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, SITE_NAME, type Locale } from '@/lib/seo'
import { FOUNDER, FOUNDER_ID, founderNode } from '@/lib/team'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { breadcrumbListSchema, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { ReviewSchema } from '@/components/seo/ReviewSchema'
import { GoogleReviews } from '@/components/reviews/GoogleReviews'
import { Reveal } from '@/components/ui/Reveal'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'about-us')
}

/**
 * About page.
 *
 * Replaces 1,022 lines of unedited Relume boilerplate — placeholder "Tagline"
 * headings, lorem copy, a second fake navbar and a CloudFront demo logo — that
 * was live AND listed in the sitemap, so Google was being explicitly asked to
 * index it. For a business site that is close to worst case: the About page is
 * one of the things quality raters look at to decide whether a company is real.
 *
 * Written for E-E-A-T, so it does two things a marketing page normally will
 * not: it names a person, and it lists what we do not promise. The limitations
 * section is deliberate and deliberately prominent — stating what can go wrong
 * is the strongest trust signal available, and no competitor writes it.
 *
 * Every claim is one we can stand behind. No founding year, no headcount, no
 * "10,000 happy customers", no awards — none of that has been confirmed.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Over ons', 'About us', 'Über uns', 'Sobre nosotros', 'À propos')
const TITLE: T = L(
  'Wie er achter Ibiza Mi Vida zit',
  'The people behind Ibiza Mi Vida',
  'Wer hinter Ibiza Mi Vida steckt',
  'Quiénes están detrás de Ibiza Mi Vida',
  'Qui se cache derrière Ibiza Mi Vida',
)
const INTRO: T = L(
  'Ibiza Mi Vida is geen callcenter en geen anoniem boekingsplatform. Het is Simon, die op Ibiza woont en elke aanvraag zelf beantwoordt via WhatsApp — of het nu gaat om een privéboot, een ferryticket naar Formentera, clubtickets of een package deal voor je groep.',
  'Ibiza Mi Vida is not a call centre and not an anonymous booking platform. It is Simon, who lives on Ibiza and answers every request himself over WhatsApp — whether that is a private boat, a ferry ticket to Formentera, club tickets or a package deal for your group.',
  'Ibiza Mi Vida ist kein Callcenter und keine anonyme Buchungsplattform. Es ist Simon, der auf Ibiza lebt und jede Anfrage selbst per WhatsApp beantwortet — ob Privatboot, Fährticket nach Formentera, Club-Tickets oder ein Package Deal für deine Gruppe.',
  'Ibiza Mi Vida no es un call center ni una plataforma de reservas anónima. Es Simon, que vive en Ibiza y responde personalmente cada solicitud por WhatsApp — ya sea un barco privado, un billete de ferry a Formentera, entradas de club o un package deal para tu grupo.',
  'Ibiza Mi Vida n’est ni un centre d’appels ni une plateforme de réservation anonyme. C’est Simon, qui vit à Ibiza et répond lui-même à chaque demande via WhatsApp — bateau privé, billet de ferry pour Formentera, entrées en club ou package deal pour votre groupe.',
)

const HOW_TITLE: T = L('Hoe we werken', 'How we work', 'Wie wir arbeiten', 'Cómo trabajamos', 'Comment nous travaillons')
const HOW: { t: T; d: T }[] = [
  {
    t: L('Alles loopt via WhatsApp', 'Everything runs over WhatsApp', 'Alles läuft über WhatsApp', 'Todo va por WhatsApp', 'Tout passe par WhatsApp'),
    d: L(
      'Geen formulier dat in een inbox verdwijnt. Je stuurt een bericht en krijgt antwoord van een mens die weet wat er die avond speelt. Meestal binnen een paar uur, in het hoogseizoen soms later.',
      'No form that disappears into an inbox. You send a message and get a reply from a person who knows what is on that night. Usually within a few hours, sometimes later in peak season.',
      'Kein Formular, das in einem Postfach verschwindet. Du schickst eine Nachricht und bekommst Antwort von einem Menschen, der weiß, was an dem Abend läuft. Meist innerhalb weniger Stunden, in der Hochsaison manchmal später.',
      'Nada de formularios que se pierden en una bandeja de entrada. Escribes y te responde una persona que sabe qué hay esa noche. Normalmente en unas horas, a veces más tarde en temporada alta.',
      'Pas de formulaire qui disparaît dans une boîte mail. Vous envoyez un message et une personne qui sait ce qui se passe ce soir-là vous répond. Généralement en quelques heures, parfois plus tard en haute saison.',
    ),
  },
  {
    t: L('We zitten op het eiland', 'We are on the island', 'Wir sind auf der Insel', 'Estamos en la isla', 'Nous sommes sur l’île'),
    d: L(
      'Dat klinkt als een detail, maar het is het verschil tussen een route van een kaart en iemand die weet welke baai bij noordenwind onbruikbaar is, welke marina op zaterdag vastloopt en welke deur je op welk tijdstip binnenlaat.',
      'That sounds like a detail, but it is the difference between a route off a map and someone who knows which cove is unusable in a north wind, which marina jams on a Saturday, and which door lets you in at what time.',
      'Das klingt nach einem Detail, ist aber der Unterschied zwischen einer Route von der Karte und jemandem, der weiß, welche Bucht bei Nordwind unbrauchbar ist, welche Marina samstags dicht ist und welche Tür wann einlässt.',
      'Suena a detalle, pero es la diferencia entre una ruta sacada de un mapa y alguien que sabe qué cala es inservible con viento del norte, qué marina se colapsa un sábado y qué puerta te deja entrar a qué hora.',
      'Cela semble anodin, mais c’est la différence entre un itinéraire tiré d’une carte et quelqu’un qui sait quelle crique est inutilisable par vent du nord, quelle marina sature le samedi et quelle porte vous laisse entrer à quelle heure.',
    ),
  },
  {
    t: L('Officiële tickets, geen doorverkoop', 'Official tickets, not resale', 'Offizielle Tickets, kein Weiterverkauf', 'Entradas oficiales, no reventa', 'Billets officiels, pas de revente'),
    d: L(
      'Clubtickets lopen via onze officiële ticketpartner ClubTickets. Je betaalt de officiële prijs — wij verkopen geen tickets door met een opslag erbovenop.',
      'Club tickets go through our official ticket partner, ClubTickets. You pay the official price — we do not resell tickets at a mark-up.',
      'Club-Tickets laufen über unseren offiziellen Ticketpartner ClubTickets. Du zahlst den offiziellen Preis — wir verkaufen keine Tickets mit Aufschlag weiter.',
      'Las entradas de club van a través de nuestro socio oficial, ClubTickets. Pagas el precio oficial — no revendemos entradas con recargo.',
      'Les billets de club passent par notre partenaire officiel, ClubTickets. Vous payez le prix officiel — nous ne revendons pas de billets avec majoration.',
    ),
  },
  {
    t: L('Vijf talen', 'Five languages', 'Fünf Sprachen', 'Cinco idiomas', 'Cinq langues'),
    d: L(
      'Nederlands, Engels, Duits, Spaans en Frans — de hele site én het contact zelf. Je hoeft je vakantie niet in je tweede taal te regelen.',
      'Dutch, English, German, Spanish and French — across the whole site and in the conversation itself. You do not have to arrange your holiday in your second language.',
      'Niederländisch, Englisch, Deutsch, Spanisch und Französisch — auf der ganzen Seite und im Gespräch selbst. Du musst deinen Urlaub nicht in deiner Zweitsprache organisieren.',
      'Neerlandés, inglés, alemán, español y francés — en toda la web y en la conversación. No tienes que organizar tus vacaciones en tu segundo idioma.',
      'Néerlandais, anglais, allemand, espagnol et français — sur tout le site et dans la conversation. Vous n’avez pas à organiser vos vacances dans votre deuxième langue.',
    ),
  },
]

const HONEST_TITLE: T = L(
  'Wat we niet beloven',
  'What we do not promise',
  'Was wir nicht versprechen',
  'Lo que no prometemos',
  'Ce que nous ne promettons pas',
)
const HONEST_INTRO: T = L(
  'De meeste Ibiza-sites zeggen alleen wat je wilt horen. Dit zijn de dingen die wij níet garanderen, zodat je niet voor verrassingen komt te staan.',
  'Most Ibiza sites only tell you what you want to hear. These are the things we do not guarantee, so nothing catches you out.',
  'Die meisten Ibiza-Seiten sagen dir nur, was du hören willst. Das sind die Dinge, die wir nicht garantieren — damit dich nichts überrascht.',
  'La mayoría de las webs de Ibiza solo te cuentan lo que quieres oír. Estas son las cosas que no garantizamos, para que nada te pille por sorpresa.',
  'La plupart des sites sur Ibiza ne disent que ce que vous voulez entendre. Voici ce que nous ne garantissons pas, pour éviter les mauvaises surprises.',
)
const HONEST: T[] = [
  L(
    'Gratis entree is geen standaard. Wat er per avond geldt — vrije entree, korting of alleen tickets — verschilt per club, per dag en per week. We zeggen vooraf wat er voor jouw datum geldt, en soms is het antwoord: koop gewoon een ticket.',
    'Free entry is not a default. What applies on a given night — free entry, a reduced rate or ticket-only — differs per club, per day and per week. We tell you in advance what applies to your date, and sometimes the answer is: just buy a ticket.',
    'Freier Eintritt ist kein Standard. Was an einem Abend gilt — freier Eintritt, ermäßigter Preis oder nur mit Ticket — hängt vom Club, vom Tag und von der Woche ab. Wir sagen vorher, was für dein Datum gilt — manchmal lautet die Antwort: kauf einfach ein Ticket.',
    'La entrada libre no es lo normal. Lo que aplica cada noche — entrada libre, precio reducido o solo con entrada — varía según el club, el día y la semana. Te decimos por adelantado qué aplica a tu fecha, y a veces la respuesta es: compra una entrada.',
    'L’entrée gratuite n’est pas la règle. Ce qui s’applique un soir donné — entrée libre, tarif réduit ou billet uniquement — varie selon le club, le jour et la semaine. Nous vous disons à l’avance ce qui vaut pour votre date, et parfois la réponse est : achetez simplement un billet.',
  ),
  L(
    'Het weer wint altijd. Bij harde wind gaat een boottocht niet door of varen we een andere route. Dat zeggen we liever eerlijk dan dat je een dag op zee hebt die niet leuk is.',
    'The weather always wins. In strong wind a boat trip does not go ahead, or we sail a different route. We would rather say so than have you spend an unpleasant day at sea.',
    'Das Wetter gewinnt immer. Bei starkem Wind fällt eine Bootstour aus oder wir fahren eine andere Route. Das sagen wir lieber ehrlich, als dass du einen unangenehmen Tag auf See hast.',
    'El tiempo siempre gana. Con viento fuerte una salida en barco no se hace, o navegamos otra ruta. Preferimos decirlo antes de que pases un día desagradable en el mar.',
    'La météo gagne toujours. Par vent fort, une sortie en bateau n’a pas lieu ou nous changeons d’itinéraire. Nous préférons le dire plutôt que de vous faire passer une mauvaise journée en mer.',
  ),
  L(
    'De deur beslist. Wij zetten je op de lijst, maar de club bepaalt uiteindelijk wie er binnenkomt. Kleding, leeftijd en groepssamenstelling spelen mee, en daar gaan wij niet over.',
    'The door decides. We put you on the list, but the club ultimately decides who comes in. Dress, age and the make-up of your group all matter, and that is not ours to overrule.',
    'Die Tür entscheidet. Wir setzen dich auf die Liste, aber der Club entscheidet am Ende, wer reinkommt. Kleidung, Alter und Gruppenzusammensetzung spielen eine Rolle — darüber bestimmen wir nicht.',
    'La puerta decide. Te ponemos en la lista, pero el club decide al final quién entra. La ropa, la edad y la composición del grupo cuentan, y eso no depende de nosotros.',
    'La porte décide. Nous vous inscrivons sur la liste, mais le club décide au final qui entre. La tenue, l’âge et la composition du groupe comptent, et cela ne dépend pas de nous.',
  ),
  L(
    'We noemen geen prijs die we niet kunnen waarmaken. Tarieven voor boten en package deals hangen af van de datum, de groep en het seizoen. Daarom staan ze niet als vast bedrag op de site, maar bevestigen we ze in het gesprek.',
    'We do not quote a price we cannot honour. Rates for boats and package deals depend on the date, the group and the season. That is why they are not printed as fixed figures on the site — we confirm them in the conversation.',
    'Wir nennen keinen Preis, den wir nicht halten können. Preise für Boote und Package Deals hängen von Datum, Gruppe und Saison ab. Deshalb stehen sie nicht als Festbetrag auf der Seite, sondern werden im Gespräch bestätigt.',
    'No damos un precio que no podamos cumplir. Las tarifas de barcos y package deals dependen de la fecha, el grupo y la temporada. Por eso no aparecen como importes fijos en la web, sino que se confirman en la conversación.',
    'Nous n’annonçons pas un prix que nous ne pouvons pas tenir. Les tarifs des bateaux et des package deals dépendent de la date, du groupe et de la saison. C’est pourquoi ils ne figurent pas comme montants fixes sur le site : nous les confirmons dans la conversation.',
  ),
]

const CTA_TITLE: T = L('Even sparren over je trip?', 'Want to talk through your trip?', 'Lust, deinen Trip durchzusprechen?', '¿Hablamos de tu viaje?', 'Envie d’en parler ?')
const CTA_BTN: T = L('WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon')
const CTA_PREFILL: T = L(
  'Hoi Simon! Ik wil graag even sparren over mijn Ibiza-trip.',
  'Hi Simon! I’d like to talk through my Ibiza trip.',
  'Hallo Simon! Ich würde gern meinen Ibiza-Trip durchsprechen.',
  '¡Hola Simon! Me gustaría comentar mi viaje a Ibiza.',
  'Salut Simon ! J’aimerais discuter de mon séjour à Ibiza.',
)
const CONTACT_LINK: T = L('Alle contactgegevens', 'All contact details', 'Alle Kontaktdaten', 'Todos los datos de contacto', 'Toutes les coordonnées')

export default function AboutUsPage({ params }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const base = `/${l}`
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(CTA_PREFILL[l])}`

  // AboutPage tied to the existing Organization, with Simon as founder. The
  // Person is declared once here and referenced by @id everywhere else, so
  // search engines merge them into one entity instead of several Simons.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      founderNode(),
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/${l}/about-us#page`,
        url: `${SITE_URL}/${l}/about-us`,
        name: TITLE[l],
        description: INTRO[l],
        inLanguage: l,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        founder: { '@id': FOUNDER_ID },
        employee: { '@id': FOUNDER_ID },
        knowsLanguage: FOUNDER.languageTags,
        areaServed: [
          { '@type': 'Place', name: 'Ibiza, Spain' },
          { '@type': 'Place', name: 'Formentera, Spain' },
        ],
      },
      breadcrumbListSchema([{ name: homeLabel(l), path: '' }, { name: TITLE[l] }], l),
    ],
  }

  return (
    <main className="bg-white text-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="mx-auto max-w-3xl px-4 pb-12 pt-[calc(var(--nav-h)+48px)] text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-tight md:text-6xl">{TITLE[l]}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600">{INTRO[l]}</p>
      </section>

      {/* Founder card — the page's core E-E-A-T signal. */}
      <section className="mx-auto max-w-3xl px-4 pb-14">
        <Reveal className="flex flex-col gap-5 rounded-3xl border border-black/10 bg-neutral-50 p-7 sm:flex-row md:p-9">
          <span
            aria-hidden
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gold font-serif text-2xl font-black text-white"
          >
            S
          </span>
          <div>
            <h2 className="font-serif text-2xl font-black leading-tight">{FOUNDER.name}</h2>
            <p className="mt-0.5 text-sm font-bold text-gold">{FOUNDER.role[l]}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{FOUNDER.bio[l]}</p>
            <p className="mt-3 text-xs text-black/60">{FOUNDER.languages.join(' · ')}</p>
          </div>
        </Reveal>
      </section>

      {/* Live Google reviews. Renders nothing — no placeholder, no sample — until
          the Business Profile is verified and the Places env vars are set. */}
      <GoogleReviews locale={l} />
      <ReviewSchema />

      <section className="mx-auto max-w-5xl px-4 pb-14">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="shrink-0 font-serif text-2xl font-black tracking-tight md:text-3xl">{HOW_TITLE[l]}</h2>
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HOW.map((h, i) => (
              <div key={i} className="rounded-[22px] border border-black/8 bg-white p-6 transition-colors hover:border-gold/50">
                <h3 className="font-serif text-lg font-black leading-tight">{h.t[l]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{h.d[l]}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* The honesty section. Deliberately prominent, not buried near the footer. */}
      <section className="border-y border-black/5 bg-neutral-50 py-14">
        <Reveal className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{HONEST_TITLE[l]}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{HONEST_INTRO[l]}</p>
          <ul className="mt-7 space-y-4">
            {HONEST.map((h, i) => (
              <li key={i} className="flex gap-3.5">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <p className="text-[15px] leading-relaxed text-neutral-700">{h[l]}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{CTA_TITLE[l]}</h2>
        <div className="mt-7 flex flex-col items-center gap-4">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03]"
          >
            <MessageCircle size={20} strokeWidth={2.5} />
            {CTA_BTN[l]}
          </a>
          <Link href={`${base}/contact`} className="text-xs font-black uppercase tracking-widest text-gold hover:underline">
            {CONTACT_LINK[l]} →
          </Link>
        </div>
      </section>
    </main>
  )
}
