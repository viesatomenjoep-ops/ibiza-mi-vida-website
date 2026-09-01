import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { FaqAccordion } from '@/components/hub/FaqAccordion'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { GuestlistSignup } from '@/components/guestlist/GuestlistSignup'
import { AuthorByline } from '@/components/seo/AuthorByline'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const T2 = (nl: string, en: string, de: string, es: string, fr: string): Record<Locale, string> => ({ nl, en, de, es, fr })
  const MTITLE = T2('Ibiza guestlist via WhatsApp', 'Ibiza Club Guestlist', 'Ibiza Gästeliste per WhatsApp', 'Lista de invitados en Ibiza', 'Guestlist des clubs à Ibiza')
  const MDESC = T2(
    'Op de gastenlijst van een Ibiza-club: wat het echt betekent, wat het per club en per avond verschilt, en hoe Simon je naam gratis via WhatsApp op de lijst zet.',
    'On the guestlist at an Ibiza club: what it actually means, how it differs per club and night, and how Simon puts your name on the list free over WhatsApp.',
    'Auf der Gästeliste eines Ibiza-Clubs: was das wirklich heißt, wie es je Club und Abend variiert, und wie Simon deinen Namen gratis per WhatsApp einträgt.',
    'En la lista de un club de Ibiza: qué significa realmente, cómo varía por club y noche, y cómo Simon pone tu nombre en la lista gratis por WhatsApp.',
    'Sur la guestlist d’un club à Ibiza : ce que cela signifie vraiment, ce qui varie selon le club et le soir, et comment Simon vous inscrit par WhatsApp.',
  )
  return pageMetadata({ locale: l, path: 'guestlist', title: MTITLE[l], description: MDESC[l] })
}

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

/**
 * Kop van de pagina: één onderwerp, en dat is de gastenlijst.
 *
 * De H1 was 'Ibiza package deals & guestlist' met daarboven de kicker 'VIP
 * Package Deals'. Twee bezwaren, en het tweede is het echte:
 *
 *  1. Het woord waarop deze pagina gevonden wordt — guestlist — stond
 *     achteraan, achter een term die vooral intern gebruikt wordt.
 *  2. Een kop die twee dingen aankondigt, gaat over geen van beide. Voor een
 *     antwoordmachine die moet bepalen waar deze pagina hét antwoord op is, is
 *     "package deals én guestlist" precies zo bruikbaar als "van alles".
 *
 * Package deals zijn daarna hélemaal van deze pagina af: ze hebben een eigen
 * route (/package-deals) met eigen kop, eigen FAQ en eigen schema. Wat hier
 * blijft staan is de doorverwijzing onderaan, want de pakketten zijn nog steeds
 * wat je aangeboden krijgt als de lijst vol zit.
 *
 * "Ibiza" blijft staan. De vraag was om er enkel "Guestlist" van te maken, maar
 * kaal is dat geen onderwerp waar een model iets mee kan: guestlists bestaan in
 * elke stad. "Ibiza guestlist" is de entiteit waar naar gezocht wordt, en het
 * weglaten van de plaats zou juist kosten wat deze wijziging moet opleveren.
 *
 * De kicker herhaalt de kop niet maar vult hem aan met de twee feiten die de
 * meeste twijfel wegnemen: het kost niets en het loopt via WhatsApp. Allebei
 * gedekt door ANSWER hieronder, dus geen belofte die nergens op steunt.
 */
// Beide kanten kwamen los van elkaar op dezelfde versmalling uit; de
// toelichting hierboven komt van master, de titelvarianten hieronder van
// deze branch omdat ES en FR daar de zoekterm in de eigen taal dragen.
const KICKER: T = L('Gratis aanmelden via WhatsApp', 'Free sign-up via WhatsApp', 'Kostenlos anmelden per WhatsApp', 'Apúntate gratis por WhatsApp', 'Inscription gratuite via WhatsApp')
const TITLE: T = L('Ibiza guestlist', 'Ibiza club guestlist', 'Ibiza Gästeliste', 'Lista de invitados Ibiza', 'Guestlist des clubs à Ibiza')
const INTRO: T = L(
  'Naar binnen bij de beste clubs van Ibiza — zonder rij, zonder gedoe. Simon zet je naam op de lijst via WhatsApp en vertelt je vooraf precies wat er die avond geldt.',
  'Get into Ibiza’s best clubs — no queue, no hassle. Simon puts your name on the list via WhatsApp and tells you beforehand exactly what applies that night.',
  'Rein in die besten Clubs Ibizas — ohne Schlange, ohne Stress. Simon setzt deinen Namen per WhatsApp auf die Liste und sagt dir vorher genau, was an dem Abend gilt.',
  'Entra en los mejores clubs de Ibiza — sin cola, sin complicaciones. Simon pone tu nombre en la lista por WhatsApp y te dice antes exactamente qué aplica esa noche.',
  'Entrez dans les meilleurs clubs d’Ibiza — sans file, sans stress. Simon met votre nom sur la liste via WhatsApp et vous précise à l’avance ce qui s’applique ce soir-là.',
)

/**
 * Plain factual explainer, placed directly under the H1 and ahead of the
 * marketing line.
 *
 * "How does the Ibiza guestlist work" is asked constantly and answered badly
 * almost everywhere, usually with a flat "it's free entry" that is not true.
 * This paragraph is the honest version, written to be quoted verbatim: it
 * names the three things being on a list can actually mean, says plainly that
 * which one applies is not fixed, and states that a guestlist never guarantees
 * entry. An answer engine repeating this in full still says something correct,
 * which is the whole test.
 */
const ANSWER: T = L(
  'De gastenlijst van een club op Ibiza is een namenlijst bij de deur. Erop staan kan drie dingen betekenen: vrije entree tot een bepaald tijdstip, een lagere deurprijs, of een snellere rij. Welke van de drie geldt hangt af van de club, de avond en de line-up, en ligt niet vast — dat wordt per aanvraag bevestigd. Aanmelden via Ibiza Mi Vida is gratis en loopt via WhatsApp: je stuurt de club, de datum en met hoeveel jullie zijn, en Simon bevestigt wat er voor die specifieke avond geldt, meestal binnen een uur. Een gastenlijst is nooit een garantie op toegang; is hij vol of biedt de club hem die avond niet aan, dan blijft een package deal of een gewoon ticket over.',
  'The guestlist at an Ibiza club is a name list held at the door. Being on it can mean one of three things: free entry before a certain time, a reduced door price, or a faster queue. Which of the three applies depends on the club, the night and the line-up, and it is not fixed — it is confirmed per request. Signing up through Ibiza Mi Vida is free and runs over WhatsApp: you send the club, the date and how many people, and Simon confirms what applies for that specific night, usually within the hour. A guestlist is never a guarantee of entry; when it is full, or the club is not offering one that night, a package deal or a normal ticket is the alternative.',
  'Die Gästeliste eines Clubs auf Ibiza ist eine Namensliste an der Tür. Darauf zu stehen kann dreierlei bedeuten: freier Eintritt bis zu einer bestimmten Uhrzeit, ein reduzierter Türpreis oder eine schnellere Schlange. Was davon gilt, hängt vom Club, vom Abend und vom Line-up ab und steht nicht fest — es wird pro Anfrage bestätigt. Die Anmeldung über Ibiza Mi Vida ist kostenlos und läuft per WhatsApp: du schickst Club, Datum und Personenzahl, und Simon bestätigt, was für diesen Abend gilt, meist innerhalb einer Stunde. Eine Gästeliste ist nie eine Garantie auf Einlass; ist sie voll oder bietet der Club an dem Abend keine an, bleiben ein Package Deal oder ein normales Ticket.',
  'La guestlist de un club en Ibiza es una lista de nombres en la puerta. Estar en ella puede significar tres cosas: entrada libre hasta cierta hora, un precio de puerta reducido o una cola más rápida. Cuál de las tres aplica depende del club, la noche y el cartel, y no es fijo: se confirma en cada solicitud. Apuntarse con Ibiza Mi Vida es gratis y va por WhatsApp: envías el club, la fecha y cuántos sois, y Simon confirma lo que aplica esa noche concreta, normalmente en menos de una hora. Una guestlist nunca garantiza la entrada; si está llena o el club no la ofrece esa noche, quedan un package deal o una entrada normal.',
  "La guestlist d'un club à Ibiza est une liste de noms tenue à l'entrée. Y figurer peut signifier trois choses : entrée libre avant une certaine heure, un prix d'entrée réduit, ou une file plus rapide. Laquelle des trois s'applique dépend du club, de la soirée et du line-up, et ce n'est pas figé : c'est confirmé à chaque demande. S'inscrire via Ibiza Mi Vida est gratuit et se fait par WhatsApp : vous envoyez le club, la date et le nombre de personnes, et Simon confirme ce qui s'applique pour cette soirée précise, généralement dans l'heure. Une guestlist ne garantit jamais l'entrée ; si elle est pleine ou que le club n'en propose pas ce soir-là, il reste un package deal ou un billet classique.",
)

const PKG_Q: T = L(
  'Met een groep? Bekijk de package deals',
  'Coming as a group? See the package deals',
  'Als Gruppe unterwegs? Sieh dir die Package Deals an',
  '¿Venís en grupo? Mira los package deals',
  'En groupe ? Voyez les package deals',
)
const PKG_LINK: T = L('Naar package deals', 'Go to package deals', 'Zu den Package Deals', 'Ir a package deals', 'Vers les package deals')

const TWO_WAYS: T = L(
  'Twee manieren om binnen te komen',
  'Two ways to get in',
  'Zwei Wege hineinzukommen',
  'Dos maneras de entrar',
  'Deux façons d’entrer',
)

const WHY_TITLE: T = L('Waarom via Ibiza Mi Vida?', 'Why through Ibiza Mi Vida?', 'Warum über Ibiza Mi Vida?', '¿Por qué con Ibiza Mi Vida?', 'Pourquoi via Ibiza Mi Vida ?')
const WHY: { title: T; text: T }[] = [
  {
    title: L('Het beste aanbod van de avond', 'The best deal for the night', 'Das beste Angebot des Abends', 'La mejor oferta de la noche', 'La meilleure offre du soir'),
    text: L(
      'Vrije entree, korting of alleen tickets — dat verschilt per club en avond. Simon laat je via WhatsApp precies weten wat er voor jouw avond geldt.',
      'Free entry, a discount or tickets-only — it depends on the club and the night. Simon tells you via WhatsApp exactly what applies to your night.',
      'Freier Eintritt, Rabatt oder nur mit Ticket — das hängt vom Club und Abend ab. Simon sagt dir per WhatsApp genau, was für deinen Abend gilt.',
      'Entrada libre, descuento o solo con entrada — depende del club y la noche. Simon te dice por WhatsApp exactamente qué aplica esa noche.',
      'Entrée libre, réduction ou billet uniquement — cela dépend du club et de la soirée. Simon vous dit par WhatsApp exactement ce qui s’applique à votre soirée.',
    ),
  },
  {
    title: L('Sla de rij over', 'Skip the queue', 'Überspringe die Schlange', 'Sáltate la cola', 'Évitez la file'),
    text: L(
      'Gastenlijst betekent meestal een eigen ingang of snellere entree — meer dansen, minder wachten.',
      'Guestlist usually means a dedicated entrance or faster entry — more dancing, less waiting.',
      'Gästeliste heißt meist eigener Eingang oder schnellerer Einlass — mehr Tanzen, weniger Warten.',
      'La lista suele significar entrada propia o acceso más rápido — más baile, menos espera.',
      'La guestlist signifie souvent une entrée dédiée ou un accès plus rapide — plus de danse, moins d’attente.',
    ),
  },
  {
    title: L('Lokaal geregeld', 'Arranged locally', 'Lokal organisiert', 'Gestionado en la isla', 'Organisé sur place'),
    text: L(
      'Ons team woont op Ibiza en kent de promotors persoonlijk. Jouw naam staat écht op de lijst.',
      'Our team lives on Ibiza and knows the promoters personally. Your name is really on the list.',
      'Unser Team lebt auf Ibiza und kennt die Promoter persönlich. Dein Name steht wirklich auf der Liste.',
      'Nuestro equipo vive en Ibiza y conoce a los promotores en persona. Tu nombre está de verdad en la lista.',
      'Notre équipe vit à Ibiza et connaît personnellement les promoteurs. Votre nom est vraiment sur la liste.',
    ),
  },
  {
    title: L('Binnen een uur antwoord', 'Reply within the hour', 'Antwort innerhalb einer Stunde', 'Respuesta en una hora', 'Réponse dans l’heure'),
    text: L(
      'Stuur een appje en je hoort vrijwel altijd binnen een uur of het gelukt is — ook ’s avonds.',
      'Send a message and you almost always hear back within the hour — evenings included.',
      'Schick eine Nachricht und du hörst fast immer innerhalb einer Stunde zurück — auch abends.',
      'Envía un mensaje y casi siempre tendrás respuesta en una hora — también por la noche.',
      'Envoyez un message et vous aurez presque toujours une réponse dans l’heure — même le soir.',
    ),
  },
]

const RULES_TITLE: T = L('De spelregels', 'The ground rules', 'Die Spielregeln', 'Las reglas del juego', 'Les règles du jeu')
const RULES: T[] = [
  L(
    'Meld je uiterlijk op de dag zelf vóór 20:00 aan — hoe eerder, hoe groter de kans.',
    'Sign up no later than 8 PM on the day itself — the earlier, the better your chances.',
    'Melde dich spätestens am selben Tag bis 20 Uhr an — je früher, desto besser die Chancen.',
    'Apúntate como muy tarde el mismo día antes de las 20:00 — cuanto antes, más posibilidades.',
    'Inscrivez-vous au plus tard le jour même avant 20 h — plus tôt, plus de chances.',
  ),
  L(
    'Minimumleeftijd 18 jaar; neem een geldig legitimatiebewijs mee, dit wordt aan de deur gecontroleerd.',
    'Minimum age 18; bring valid photo ID, it is checked at the door.',
    'Mindestalter 18 Jahre; bring einen gültigen Ausweis mit, er wird am Eingang kontrolliert.',
    'Edad mínima 18 años; lleva un documento de identidad válido, lo comprueban en la puerta.',
    'Âge minimum 18 ans ; apportez une pièce d’identité valide, elle est contrôlée à l’entrée.',
  ),
  L(
    'Wees op tijd: gastenlijst-entree geldt meestal tot een bepaald tijdstip — Simon vertelt je hoe laat.',
    'Be on time: guestlist entry usually applies until a set hour — Simon tells you what time.',
    'Sei pünktlich: Der Gästelisten-Einlass gilt meist bis zu einer bestimmten Uhrzeit — Simon sagt dir, bis wann.',
    'Llega a tiempo: la entrada por lista suele valer hasta cierta hora — Simon te dice hasta cuándo.',
    'Soyez à l’heure : l’entrée guestlist vaut généralement jusqu’à une heure donnée — Simon vous précise laquelle.',
  ),
  L(
    'Nette-casual kleding: geen zwemkleding of voetbalshirts. De deur beslist altijd.',
    'Smart-casual dress: no swimwear or football shirts. The door always has the final say.',
    'Smart-Casual-Kleidung: keine Badekleidung oder Fußballtrikots. Die Tür entscheidet immer.',
    'Vestimenta smart-casual: nada de bañadores ni camisetas de fútbol. La puerta siempre decide.',
    'Tenue smart-casual : pas de maillot de bain ni de maillot de foot. La porte a toujours le dernier mot.',
  ),
  L(
    'Niet elke avond heeft een gastenlijst — grote headliner-nachten zijn vaak alleen met ticket. Vraag het ons gewoon.',
    'Not every night has a guestlist — big headliner nights are often ticket-only. Just ask us.',
    'Nicht jede Nacht hat eine Gästeliste — große Headliner-Nächte sind oft nur mit Ticket. Frag uns einfach.',
    'No todas las noches hay lista — las noches de grandes cabezas de cartel suelen ser solo con entrada. Pregúntanos.',
    'Toutes les soirées n’ont pas de guestlist — les grandes soirées à têtes d’affiche sont souvent sur billet uniquement. Demandez-nous.',
  ),
]

const CLUBS_TITLE: T = L('De clubs die we aanbieden', 'The clubs we cover', 'Die Clubs, die wir anbieten', 'Los clubs que ofrecemos', 'Les clubs que nous proposons')
const CLUBS_SUB: T = L(
  'Tik op een club voor het volledige programma en de tickets.',
  'Tap a club for the full programme and tickets.',
  'Tippe auf einen Club für das volle Programm und Tickets.',
  'Toca un club para ver todo el programa y las entradas.',
  'Touchez un club pour voir tout le programme et les billets.',
)

const EVENTS_TITLE: T = L('Aankomende events', 'Upcoming events', 'Kommende Events', 'Próximos eventos', 'Événements à venir')

const CTA_Q: T = L('Wil je een package deal?', 'Want a package deal?', 'Willst du einen Package Deal?', '¿Quieres un package deal?', 'Vous voulez un package deal ?')
const CTA_SUB: T = L(
  'App Simon met de club, de datum en met hoeveel je komt — hij regelt de rest.',
  'Message Simon with the club, the date and your group size — he arranges the rest.',
  'Schreib Simon den Club, das Datum und eure Gruppengröße — er regelt den Rest.',
  'Escribe a Simon con el club, la fecha y cuántos sois — él se encarga del resto.',
  'Écrivez à Simon le club, la date et la taille de votre groupe — il s’occupe du reste.',
)
const CTA_BTN: T = L('WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon', 'WhatsApp Simon')
const WA_PREFILL: T = L(
  'Hoi Simon! Ik zoek een package deal. Club: … Datum: … Aantal personen: …',
  'Hi Simon! I’m looking for a package deal. Club: … Date: … Group size: …',
  'Hallo Simon! Ich suche einen Package Deal. Club: … Datum: … Personen: …',
  '¡Hola Simon! Busco un package deal. Club: … Fecha: … Personas: …',
  'Salut Simon ! Je cherche un package deal. Club : … Date : … Personnes : …',
)

const GL_FAQS: { q: T; a: T }[] = [
  {
    q: L('Is de gastenlijst gratis?', 'Is the guestlist free?', 'Ist die Gästeliste kostenlos?', '¿La guestlist es gratis?', 'La guestlist est-elle gratuite ?'),
    a: L(
      'Aanmelden is altijd gratis. Vrije entree is niet gegarandeerd: sommige clubs geven op bepaalde avonden vrije toegang tot een bepaald tijdstip, andere geven korting, en op drukke avonden met een grote naam is het vaak alleen met ticket. Wij zeggen je vooraf welke van de drie voor jouw avond geldt, zodat je niet voor een verrassing bij de deur staat.',
      'Signing up is always free. Free entry is not guaranteed: some clubs give free access up to a certain time on certain nights, others give a discount, and on busy nights with a big name it is often ticket-only. We tell you beforehand which of the three applies to your night, so there is no surprise at the door.',
      'Die Anmeldung ist immer kostenlos. Freier Eintritt ist nicht garantiert: manche Clubs gewähren an bestimmten Abenden freien Zutritt bis zu einer Uhrzeit, andere einen Rabatt, und an vollen Abenden mit großem Namen geht es oft nur mit Ticket. Wir sagen dir vorher, was für deinen Abend gilt, damit es an der Tür keine Überraschung gibt.',
      'Apuntarse siempre es gratis. La entrada libre no está garantizada: algunos clubs dan acceso gratuito hasta cierta hora en ciertas noches, otros dan descuento, y en noches fuertes con un nombre grande suele ser solo con entrada. Te decimos antes cuál de las tres aplica a tu noche, para que no haya sorpresas en la puerta.',
      "S'inscrire est toujours gratuit. L'entrée libre n'est pas garantie : certains clubs offrent l'accès gratuit jusqu'à une certaine heure certains soirs, d'autres une réduction, et lors des grosses soirées c'est souvent billet obligatoire. Nous vous disons à l'avance laquelle des trois s'applique, pour éviter toute surprise à l'entrée.",
    ),
  },
  {
    q: L('Tot hoe laat geldt de gastenlijst?', 'Until what time is the guestlist valid?', 'Bis wann gilt die Gästeliste?', '¿Hasta qué hora vale la guestlist?', "Jusqu'à quelle heure la guestlist est-elle valable ?"),
    a: L(
      'Bijna elke gastenlijst heeft een sluitingstijd, en die verschilt sterk per club en per avond. Wij noemen het exacte tijdstip in de bevestiging die je via WhatsApp krijgt. Kom je later, dan geldt de gewone deurprijs — daarom is het tijdstip het eerste wat je van ons hoort.',
      'Almost every guestlist has a cut-off time, and it varies a lot by club and by night. We give you the exact time in the confirmation you get over WhatsApp. Arrive later and the normal door price applies — which is why the time is the first thing we tell you.',
      'Fast jede Gästeliste hat eine Schlusszeit, und die ist je nach Club und Abend sehr unterschiedlich. Wir nennen dir die genaue Uhrzeit in der Bestätigung per WhatsApp. Kommst du später, gilt der normale Türpreis — deshalb ist die Uhrzeit das Erste, was du von uns hörst.',
      'Casi toda guestlist tiene una hora límite, y varía mucho según el club y la noche. Te damos la hora exacta en la confirmación por WhatsApp. Si llegas más tarde se aplica el precio normal de puerta — por eso la hora es lo primero que te decimos.',
      "Presque toutes les guestlists ont une heure limite, très variable selon le club et la soirée. Nous vous donnons l'heure exacte dans la confirmation WhatsApp. Si vous arrivez plus tard, le tarif normal s'applique — c'est pourquoi l'heure est la première chose que nous vous indiquons.",
    ),
  },
  {
    q: L('Wat is het verschil tussen de gastenlijst en een package deal?', 'What is the difference between the guestlist and a package deal?', 'Was ist der Unterschied zwischen Gästeliste und Package Deal?', '¿Qué diferencia hay entre la guestlist y un package deal?', 'Quelle est la différence entre la guestlist et un package deal ?'),
    a: L(
      'De gastenlijst regelt alleen je entree en is afhankelijk van wat de club die avond toestaat. Een package deal is een vast pakket dat je vooraf vastlegt — entree gecombineerd met bijvoorbeeld drankjes, een tafel of vervoer — en dus zeker is. Weet je precies wanneer je gaat en met hoeveel, dan is een package deal betrouwbaarder; ben je flexibel, dan is de gastenlijst het goedkoopst.',
      'The guestlist covers your entry only, and depends on what the club allows that night. A package deal is a fixed bundle you lock in beforehand — entry combined with, say, drinks, a table or transport — so it is certain. If you know exactly when you are going and with how many, a package deal is more reliable; if you are flexible, the guestlist is the cheapest route.',
      'Die Gästeliste regelt nur deinen Eintritt und hängt davon ab, was der Club an dem Abend zulässt. Ein Package Deal ist ein festes Paket, das du vorher buchst — Eintritt kombiniert mit etwa Getränken, einem Tisch oder Transport — und damit sicher. Weißt du genau, wann und mit wie vielen du kommst, ist ein Package Deal verlässlicher; bist du flexibel, ist die Gästeliste der günstigste Weg.',
      'La guestlist cubre solo tu entrada y depende de lo que el club permita esa noche. Un package deal es un paquete cerrado que fijas antes — entrada combinada con copas, mesa o transporte, por ejemplo — y por tanto es seguro. Si sabes exactamente cuándo vas y cuántos sois, el package deal es más fiable; si eres flexible, la guestlist sale más barata.',
      "La guestlist ne couvre que votre entrée et dépend de ce que le club autorise ce soir-là. Un package deal est un forfait fixé à l'avance — entrée combinée à des boissons, une table ou un transport — donc garanti. Si vous savez exactement quand vous venez et à combien, le package deal est plus fiable ; si vous êtes flexible, la guestlist est la voie la moins chère.",
    ),
  },
  {
    q: L('Voor welke clubs kunnen jullie me op de lijst zetten?', 'Which clubs can you put me on the list for?', 'Für welche Clubs könnt ihr mich auf die Liste setzen?', '¿Para qué clubs podéis apuntarme?', 'Pour quels clubs pouvez-vous m’inscrire ?'),
    a: L(
      'Voor de clubs die je in onze agenda ziet staan. Niet elke club werkt elke avond met een gastenlijst, en sommige doen het alleen buiten de topavonden. Noem in je bericht de club die je op het oog hebt; kan het daar die avond niet, dan zeggen we dat meteen en stellen we een alternatief voor in plaats van je aan het lijntje te houden.',
      'For the clubs you see in our agenda. Not every club runs a guestlist every night, and some only outside their biggest nights. Name the club you have in mind in your message; if it is not possible there that night we say so straight away and suggest an alternative rather than leaving you hanging.',
      'Für die Clubs, die du in unserem Kalender siehst. Nicht jeder Club führt jeden Abend eine Gästeliste, und manche nur außerhalb ihrer größten Nächte. Nenn in deiner Nachricht den Club, den du im Kopf hast; geht es dort an dem Abend nicht, sagen wir das sofort und schlagen eine Alternative vor, statt dich hinzuhalten.',
      'Para los clubs que ves en nuestra agenda. No todos los clubs llevan guestlist cada noche, y algunos solo fuera de sus noches fuertes. Menciona en tu mensaje el club que tienes en mente; si esa noche no es posible te lo decimos al momento y proponemos una alternativa en vez de dejarte esperando.',
      "Pour les clubs que vous voyez dans notre agenda. Tous les clubs ne tiennent pas une guestlist chaque soir, et certains seulement en dehors de leurs grosses soirées. Indiquez le club que vous visez ; si ce n'est pas possible ce soir-là, nous le disons tout de suite et proposons une alternative plutôt que de vous faire attendre.",
    ),
  },
  {
    q: L('Wat hebben jullie van mij nodig?', 'What do you need from me?', 'Was braucht ihr von mir?', '¿Qué necesitáis de mí?', 'De quoi avez-vous besoin ?'),
    a: L(
      'Drie dingen: de club, de datum en met hoeveel personen je komt. Namen van de hele groep zijn meestal niet nodig — één naam volstaat vaak voor de hele boeking. Vraagt een club om meer, dan horen we dat van je in hetzelfde gesprek.',
      'Three things: the club, the date and how many of you are coming. Names for the whole group are usually not needed — one name often covers the whole booking. If a club asks for more, we come back to you in the same conversation.',
      'Drei Dinge: den Club, das Datum und mit wie vielen ihr kommt. Namen der ganzen Gruppe sind meist nicht nötig — ein Name deckt oft die ganze Buchung ab. Fragt ein Club nach mehr, melden wir uns im selben Gespräch.',
      'Tres cosas: el club, la fecha y cuántos venís. Normalmente no hacen falta los nombres de todo el grupo — con uno suele bastar para toda la reserva. Si un club pide más, te lo decimos en la misma conversación.',
      "Trois choses : le club, la date et le nombre de personnes. Les noms de tout le groupe ne sont généralement pas nécessaires — un seul nom suffit souvent. Si un club en demande plus, nous revenons vers vous dans la même conversation.",
    ),
  },
  {
    q: L('Kan ik me op de dag zelf nog aanmelden?', 'Can I still sign up on the day itself?', 'Kann ich mich noch am selben Tag anmelden?', '¿Puedo apuntarme el mismo día?', 'Puis-je m’inscrire le jour même ?'),
    a: L(
      'Vaak wel. Lijsten sluiten meestal in de loop van de avond, dus hoe eerder je appt hoe groter de kans. Last minute proberen we het altijd nog — en lukt het niet, dan zeggen we dat eerlijk in plaats van je op goed geluk te laten komen.',
      'Often yes. Lists usually close during the evening, so the earlier you message the better the odds. Last minute we will always still try — and if it does not work we tell you honestly rather than letting you turn up on the off chance.',
      'Oft ja. Listen schließen meist im Lauf des Abends, je früher du schreibst, desto besser die Chance. Last Minute versuchen wir es immer noch — und klappt es nicht, sagen wir das ehrlich, statt dich auf gut Glück kommen zu lassen.',
      'A menudo sí. Las listas suelen cerrarse a lo largo de la noche, así que cuanto antes escribas, mejor. A última hora siempre lo intentamos — y si no sale, te lo decimos claramente en vez de dejar que vayas a probar suerte.',
      "Souvent oui. Les listes ferment généralement au cours de la soirée : plus tôt vous écrivez, meilleures sont les chances. En dernière minute nous essayons toujours — et si cela ne marche pas, nous le disons franchement plutôt que de vous laisser tenter votre chance.",
    ),
  },
  {
    q: L('Wat is de minimumleeftijd?', 'What is the minimum age?', 'Was ist das Mindestalter?', '¿Cuál es la edad mínima?', "Quel est l'âge minimum ?"),
    a: L(
      'Achttien. Dat is de wettelijke leeftijd in Spanje en clubs op Ibiza controleren daar bij de deur op, ook als je op de lijst staat. Neem een paspoort of ID mee; een rijbewijs wordt niet overal geaccepteerd.',
      'Eighteen. That is the legal age in Spain and Ibiza clubs check it at the door, guestlist or not. Bring a passport or ID card; a driving licence is not accepted everywhere.',
      'Achtzehn. Das ist das gesetzliche Alter in Spanien, und Clubs auf Ibiza kontrollieren an der Tür, auch mit Gästeliste. Nimm Pass oder Personalausweis mit; ein Führerschein wird nicht überall akzeptiert.',
      'Dieciocho. Es la edad legal en España y los clubs de Ibiza lo comprueban en la puerta, estés en lista o no. Lleva pasaporte o DNI; el carné de conducir no se acepta en todas partes.',
      "Dix-huit ans. C'est l'âge légal en Espagne et les clubs d'Ibiza le vérifient à l'entrée, guestlist ou non. Prenez un passeport ou une carte d'identité ; le permis de conduire n'est pas accepté partout.",
    ),
  },
  {
    q: L('Wat kost het om op de gastenlijst te staan?', 'What does it cost to be on the guestlist?', 'Was kostet es, auf der Gästeliste zu stehen?', '¿Cuánto cuesta estar en la lista?', 'Combien coûte le fait d’être sur la guestlist ?'),
    a: L(
      'Aanmelden via ons kost niets. Wat er die avond geldt — vrije entree, korting of alleen tickets — verschilt per club en per dag; Simon vertelt je dat vooraf via WhatsApp.',
      'Signing up through us costs nothing. What applies on the night — free entry, a discount or tickets-only — varies by club and by day; Simon tells you beforehand via WhatsApp.',
      'Die Anmeldung über uns kostet nichts. Was an dem Abend gilt — freier Eintritt, Rabatt oder nur mit Ticket — hängt vom Club und Tag ab; Simon sagt dir das vorher per WhatsApp.',
      'Apuntarse con nosotros no cuesta nada. Lo que aplica esa noche — entrada libre, descuento o solo con entrada — varía según el club y el día; Simon te lo dice antes por WhatsApp.',
      'S’inscrire via nous ne coûte rien. Ce qui s’applique ce soir-là — entrée libre, réduction ou billet uniquement — varie selon le club et le jour ; Simon vous le précise à l’avance via WhatsApp.',
    ),
  },
  {
    q: L('Hoe snel weet ik of het gelukt is?', 'How fast do I know if it worked?', 'Wie schnell weiß ich Bescheid?', '¿Cuándo sabré si está confirmado?', 'Quand saurai-je si c’est confirmé ?'),
    a: L(
      'Vrijwel altijd binnen een uur via WhatsApp, ook ’s avonds en in het weekend.',
      'Almost always within the hour via WhatsApp, evenings and weekends included.',
      'Fast immer innerhalb einer Stunde per WhatsApp, auch abends und am Wochenende.',
      'Casi siempre en menos de una hora por WhatsApp, también por la noche y el fin de semana.',
      'Presque toujours dans l’heure via WhatsApp, soirs et week-ends compris.',
    ),
  },
  {
    q: L('Kan ik met een grote groep komen?', 'Can I come with a big group?', 'Geht das auch mit einer großen Gruppe?', '¿Puedo venir con un grupo grande?', 'Puis-je venir en grand groupe ?'),
    a: L(
      'Ja — geef het aantal door in je bericht. Voor grote groepen of speciale avonden denken we ook mee over VIP-tafels.',
      'Yes — mention the group size in your message. For big groups or special nights we can also arrange VIP tables.',
      'Ja — nenn die Gruppengröße in deiner Nachricht. Für große Gruppen oder besondere Nächte organisieren wir auch VIP-Tische.',
      'Sí — indica cuántos sois en tu mensaje. Para grupos grandes o noches especiales también gestionamos mesas VIP.',
      'Oui — indiquez la taille du groupe dans votre message. Pour les grands groupes ou soirées spéciales, nous organisons aussi des tables VIP.',
    ),
  },
]

export default async function GuestlistPage({ params }: { params: { locale: string } }) {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const base = `/${locale}`
  const waHref = `https://wa.me/33666528412?text=${encodeURIComponent(WA_PREFILL[locale])}`

  const venues = await getVenues(locale)
  const clubs = venues.filter(v => v.type?.slug === 'clubbing')

  const todayStr = new Date().toISOString().split('T')[0]
  const clubSlugs = new Set(clubs.map(c => c.slug))
  const allDates = await getAllDates(locale)
  const upcoming = allDates
    .filter(d => d.venueSlug && clubSlugs.has(d.venueSlug) && d.date >= todayStr)
    .slice(0, 9)

  const faqs = GL_FAQS.map(f => ({ q: f.q[locale], a: f.a[locale] }))

  const waButton = (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-black shadow-lg transition-all hover:brightness-95"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15L2.1 21.7l4.8-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .4-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.3.1 1.6.8 1.9.9.3.2.5.2.5.4.1.1.1.7-.1 1.3z"/></svg>
      {CTA_BTN[locale]}
    </a>
  )

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <FaqJsonLd faqs={faqs} />
      <ServiceSchema
        name={SERVICE_COPY.guestlist.name[locale]}
        description={SERVICE_COPY.guestlist.description[locale]}
        serviceType={SERVICE_COPY.guestlist.serviceType}
        path={`${locale}/guestlist`}
       pageKey="guestlist" />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: homeLabel(locale), path: '' },
          { name: TITLE[locale] },
        ]}
      />

      {/* ── Hero ── */}
      <section className="pt-[calc(var(--nav-h)+40px)] pb-12 px-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[locale]}</p>
        <h1 className="mt-3 break-words font-serif text-4xl md:text-6xl font-black tracking-tight text-neutral-900">{TITLE[locale]}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-700">{ANSWER[locale]}</p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-500">{INTRO[locale]}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <span className="font-serif text-sm font-black uppercase tracking-widest text-neutral-900">{CTA_Q[locale]}</span>
          {waButton}
        </div>
      </section>

      {/* ── Package / group deal picker ── */}
      {/* Two distinct routes, side by side. A package deal bundles a group's
          night; a guestlist puts your name on one club's list for one evening.
          The rename to "Package Deals" had swallowed the second one, even
          though "guestlist" is the term people actually search for — so it now
          has its own heading, its own form and the word in visible copy rather
          than only in the title tag and schema. */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Reveal>
          <h2 className="mb-6 font-serif text-2xl font-black tracking-tight md:text-3xl">
            {TWO_WAYS[locale]}
          </h2>
          <GuestlistSignup locale={locale} />
          {/* Package deals hebben hun eigen pagina; wie hier verkeerd landde is
              met één klik waar hij moet zijn. */}
          <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-black/10 bg-neutral-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-base font-bold text-neutral-900">{PKG_Q[locale]}</p>
            <Link
              href={`/${locale}/package-deals`}
              className="rounded-full text-[15px] font-semibold text-neutral-900 underline underline-offset-4 outline-none transition-colors hover:text-gold focus-visible:ring-2 focus-visible:ring-gold"
            >
              {PKG_LINK[locale]} →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Why guestlist ── */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="shrink-0 font-serif text-2xl md:text-3xl font-black tracking-tight">{WHY_TITLE[locale]}</h2>
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <div key={i} className="rounded-[22px] border border-black/8 bg-neutral-50 p-6 transition-all hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-gold/12 font-serif text-sm font-black text-gold ring-1 ring-gold/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-lg font-black leading-tight">{w.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{w.text[locale]}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── The rules ── */}
      <section className="bg-neutral-50 border-y border-black/5 py-14">
        <Reveal className="mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-center font-serif text-2xl md:text-3xl font-black tracking-tight">{RULES_TITLE[locale]}</h2>
          <ul className="flex flex-col gap-3">
            {RULES.map((r, i) => (
              <li key={i} className="flex items-start gap-3.5 rounded-2xl border border-black/8 bg-white p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-black text-white">✓</span>
                <span className="text-[15px] leading-relaxed text-neutral-700">{r[locale]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── Club logos ── */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="mb-2 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-black tracking-tight">{CLUBS_TITLE[locale]}</h2>
            <p className="mt-2 text-sm text-neutral-500">{CLUBS_SUB[locale]}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {clubs.map(club => (
              <Link
                key={club.slug}
                href={`${base}/club-tickets/${club.slug}`}
                className="group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-neutral-900 p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {club.cover || club.picture ? (
                  <Image
                    src={club.cover || club.picture}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover opacity-30 transition-opacity group-hover:opacity-45"
                  />
                ) : null}
                {club.whitelogo ? (
                  <Image
                    src={club.whitelogo}
                    alt={club.name}
                    width={160}
                    height={48}
                    className="relative max-h-12 w-auto max-w-[80%] object-contain"
                  />
                ) : (
                  <span className="relative text-center font-serif text-sm font-black uppercase tracking-wide text-white">{club.name}</span>
                )}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Upcoming events ── */}
      {upcoming.length > 0 && (
        <section className="bg-neutral-50 border-y border-black/5 py-14">
          <Reveal className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="shrink-0 font-serif text-2xl md:text-3xl font-black tracking-tight">{EVENTS_TITLE[locale]}</h2>
              <span className="h-px flex-1 bg-black/10" />
              <Link href={`${base}/calendar`} className="shrink-0 text-xs font-black uppercase tracking-widest text-gold hover:underline">
                {({ nl: 'Volledige agenda', en: 'Full calendar', de: 'Ganzer Kalender', es: 'Agenda completa', fr: 'Agenda complet' } as Record<string, string>)[locale]} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((d) => {
                const image = d.eventCover || d.eventLogo || d.venueCover
                return (
                  <Link
                    key={`${d.id}-${d.eventSlug}`}
                    href={`${base}/club-tickets/${d.venueSlug}/${d.eventSlug}`}
                    className="group flex items-center gap-4 rounded-[22px] border border-black/8 bg-white p-3.5 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-200">
                      {image && <Image src={image} alt={d.eventName || d.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gold">
                        {new Date(d.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                      </span>
                      <h3 className="truncate font-serif text-base font-black leading-tight text-neutral-900">{d.eventName || d.name}</h3>
                      <p className="truncate text-xs font-semibold text-neutral-500">{d.venueName}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── FAQ ──
          Deze tien vragen stonden alleen in de JSON-LD en nergens op de pagina.
          Dat is twee dingen tegelijk fout. Google's beleid voor FAQ-markup eist
          dat de vragen zichtbaar op de pagina staan — markup zonder zichtbare
          tegenhanger wordt genegeerd en kan een handmatige maatregel opleveren.
          En het weggeven van tien geschreven antwoorden is zonde: dit is precies
          het soort zelfstandig citeerbare tekst waar een antwoordmachine uit put.
          Dezelfde array voedt nu het schema én de pagina, dus ze kunnen niet meer
          uit elkaar lopen. */}
      <FaqAccordion faqs={faqs} locale={locale} />

      {/* ── Big closing CTA ── */}
      <AuthorByline locale={locale} topic="Ibiza club guestlist" />

      <section className="relative overflow-hidden bg-obsidian py-16 md:py-20 text-center text-white">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight">{CTA_Q[locale]}</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65">{CTA_SUB[locale]}</p>
          <div className="mt-8">{waButton}</div>
        </div>
      </section>
    </div>
  )
}
