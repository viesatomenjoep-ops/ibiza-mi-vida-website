import type { Locale } from './seo'

// ── Beach clubs, sunbeds and VIP beds on Ibiza (5 locales) ────────────────
// A sibling of ./sailing-routes.ts and ./page-faq.ts, bound by the same
// factual guardrails — with one extra constraint that matters more here than
// anywhere else on the site: every entry below is a REAL third-party business
// that we do not own and do not speak for.
//
// HARD RULES for this file:
//  1. No prices, no bed or bali-bed rates, no minimum spends, no opening or
//     closing hours, no season dates, no phone numbers, no booking URLs. Those
//     change every season and a stale number here becomes a wrong number an
//     answer engine repeats.
//  2. No links to a club's own site. If a URL is not known with certainty it
//     is better to name the place and describe it than to send someone to a
//     dead or wrong domain. We therefore link none of them.
//  3. Never claim we can book someone's bed. We are not their reseller. The
//     honest framing, used consistently below: we help you plan the day and
//     advise on where fits, and a bed is reserved with the club itself.
//  4. Nothing is ever described as free.
//  5. No club is called "the best". Which one suits depends on the day, the
//     wind and who you are with, and the copy says so.
//
// What IS safe and is what the descriptions lean on: which beach a place sits
// on, which way that beach faces and therefore which wind ruins it, whether
// you need a car, whether the shore is sand or rock, whether the spot is loud
// or quiet, and how busy the island gets in August. Geography and character
// are stable; commercial detail is not.
//
// Every entry carries one honest limitation, in the spirit of the sailing
// routes. Do not edit those out.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export type BeachClub = {
  id: string
  /** Business name — a proper noun, not translated. */
  name: string
  /** The beach or cove it sits on — a proper noun, not translated. */
  beach: string
  /** What kind of day it suits. */
  suits: T
  /** What the place is and what it is known for. */
  blurb: T
  /** One honest limitation: crowding, access, wind, season. */
  note: T
}

export type BeachArea = {
  id: string
  /** Area heading. */
  title: T
  /** Character of the area as a whole. */
  intro: T
  clubs: BeachClub[]
}

export const BEACH_HEADING: T = L(
  'Beachclubs en ligbedden op Ibiza, per gebied',
  'Beach clubs and sunbeds in Ibiza, area by area',
  'Beachclubs und Liegen auf Ibiza, nach Gebieten',
  'Beach clubs y hamacas en Ibiza, zona por zona',
  'Beach clubs et transats à Ibiza, zone par zone',
)

export const BEACH_INTRO: T = L(
  'Een dag op een ligbed is voor veel mensen het echte Ibiza, en de vraag is nooit welke beachclub de beste is maar welke bij jouw dag past. Een strand dat bij noordenwind onbruikbaar is, ligt bij zuidenwind spiegelglad; een club waar het om vier uur ’s middags vol staat met muziek, is om elf uur ’s ochtends een rustige plek. Hieronder staan de bekendste adressen van het eiland gegroepeerd per gebied, met wat voor dag ze passen en waar je rekening mee moet houden.',
  'A day on a sunbed is the real Ibiza for a lot of people, and the question is never which beach club is best but which one fits the day you want. A beach that is unusable in a northerly is glassy in a southerly; a club that is packed and loud at four in the afternoon is a quiet spot at eleven in the morning. Below are the island’s best-known addresses grouped by area, with the kind of day each suits and what to take into account.',
  'Ein Tag auf einer Liege ist für viele das eigentliche Ibiza, und die Frage ist nie, welcher Beachclub der beste ist, sondern welcher zu deinem Tag passt. Ein Strand, der bei Nordwind unbrauchbar ist, liegt bei Südwind spiegelglatt; ein Club, der um vier Uhr nachmittags voll und laut ist, ist um elf Uhr morgens ein ruhiger Ort. Unten stehen die bekanntesten Adressen der Insel nach Gebieten, mit dem Tag, zu dem sie passen, und dem, was zu bedenken ist.',
  'Un día en una hamaca es el Ibiza de verdad para mucha gente, y la pregunta nunca es qué beach club es el mejor, sino cuál encaja con el día que quieres. Una playa inutilizable con viento del norte está como un plato con viento del sur; un club lleno y ruidoso a las cuatro de la tarde es un sitio tranquilo a las once de la mañana. Abajo están las direcciones más conocidas de la isla agrupadas por zona, con el tipo de día que encaja y lo que conviene tener en cuenta.',
  'Une journée sur un transat, c’est le vrai Ibiza pour beaucoup, et la question n’est jamais quel beach club est le meilleur mais lequel correspond à votre journée. Une plage inutilisable par vent de nord est d’huile par vent de sud ; un club bondé et sonore à seize heures est un endroit calme à onze heures du matin. Voici les adresses les plus connues de l’île, regroupées par zone, avec le type de journée auquel chacune convient et ce qu’il faut anticiper.',
)

export const BEACH_HOW_IT_WORKS: T = L(
  'Hoe het in de praktijk werkt: bedden en bali-bedden worden gereserveerd bij de club zelf, niet bij ons — het zijn eigen bedrijven met eigen voorwaarden, en wat een dag kost verschilt per club, per plek op het strand en per moment in het seizoen. Wat wij wél doen is de dag met je uitdenken: welk gebied past bij de wind van die dag, waar je met kinderen beter zit dan met een vrijgezellengroep, hoe je er komt zonder een uur naar een parkeerplaats te zoeken, en hoe je het combineert met een boot, een transfer of een avond in de club. Vraag het ons via WhatsApp; we zeggen ook eerlijk wanneer een plek niet bij je plan past.',
  'How it works in practice: beds and bali beds are reserved with the club itself, not with us — they are independent businesses with their own terms, and what a day costs varies by club, by where on the sand you sit and by the point in the season. What we do is think the day through with you: which area suits that day’s wind, where you are better off with children than with a stag group, how to get there without spending an hour hunting for parking, and how to fit it around a boat, a transfer or a night out. Ask us on WhatsApp — and we will say plainly when a place does not fit your plan.',
  'Wie es in der Praxis läuft: Liegen und Bali-Betten werden beim Club selbst reserviert, nicht bei uns — es sind eigenständige Betriebe mit eigenen Bedingungen, und was ein Tag kostet, unterscheidet sich je nach Club, Platz am Strand und Zeitpunkt der Saison. Was wir tun: den Tag mit dir durchdenken — welches Gebiet zum Wind des Tages passt, wo du mit Kindern besser aufgehoben bist als mit einer Junggesellengruppe, wie du hinkommst, ohne eine Stunde nach einem Parkplatz zu suchen, und wie sich das mit Boot, Transfer oder Clubabend verbinden lässt. Frag uns per WhatsApp — wir sagen auch ehrlich, wenn ein Ort nicht zu deinem Plan passt.',
  'Cómo funciona en la práctica: las hamacas y camas balinesas se reservan en el propio club, no con nosotros — son negocios independientes con sus propias condiciones, y lo que cuesta un día varía según el club, el sitio en la arena y el momento de la temporada. Lo que sí hacemos es pensar el día contigo: qué zona encaja con el viento de esa jornada, dónde estás mejor con niños que con una despedida, cómo llegar sin pasar una hora buscando aparcamiento y cómo combinarlo con un barco, un traslado o una noche de club. Pregúntanos por WhatsApp — y te diremos con franqueza cuándo un sitio no encaja con tu plan.',
  'Comment cela se passe concrètement : les transats et lits balinais se réservent auprès du club lui-même, pas chez nous — ce sont des entreprises indépendantes avec leurs propres conditions, et le coût d’une journée varie selon le club, l’emplacement sur le sable et le moment de la saison. Ce que nous faisons : penser la journée avec vous — quelle zone convient au vent du jour, où vous serez mieux avec des enfants qu’avec un enterrement de vie de garçon, comment y aller sans passer une heure à chercher une place, et comment l’articuler avec un bateau, un transfert ou une soirée. Demandez-nous sur WhatsApp — et nous vous dirons franchement quand un endroit ne colle pas à votre plan.',
)

export const BEACH_CLOSING_NOTE: T = L(
  'Nog een paar dingen die niemand je vertelt. In augustus zijn de bekendste bedden er halverwege de ochtend al uit, en “we kijken wel” betekent in de praktijk een handdoek op het zand. Veel van deze plekken liggen aan het eind van een smalle weg met beperkte parkeerruimte, dus reken op een auto of een taxi en op zoeken. Buiten het hoogseizoen is het eiland stil: een deel van deze adressen draait dan beperkt of helemaal niet, en het strand is er niet minder mooi om. En de wind bepaalt meer dan de recensies — bij stevige noordenwind is de noordkust rauw en zit je aan de zuidkant beter, en andersom.',
  'A few things nobody tells you. In August the best-known beds are gone by mid-morning, and “we’ll see when we get there” means a towel on the sand. Many of these places sit at the end of a narrow road with limited parking, so plan on a car or a taxi and on searching for a space. Outside high season the island goes quiet: some of these addresses run on reduced days or not at all, and the beach is no less beautiful for it. And the wind decides more than the reviews do — in a firm northerly the north coast is rough and you are better off on the south side, and the other way round.',
  'Ein paar Dinge, die dir niemand sagt. Im August sind die bekanntesten Liegen am Vormittag vergeben, und „wir schauen mal“ heißt in der Praxis Handtuch auf Sand. Viele dieser Orte liegen am Ende einer schmalen Straße mit wenig Parkraum — rechne mit Auto oder Taxi und mit Suchen. Außerhalb der Hochsaison wird die Insel still: Ein Teil dieser Adressen läuft dann eingeschränkt oder gar nicht, und der Strand ist deshalb nicht weniger schön. Und der Wind entscheidet mehr als die Bewertungen — bei kräftigem Nordwind ist die Nordküste rau und die Südseite die bessere Wahl, und umgekehrt.',
  'Un par de cosas que nadie te cuenta. En agosto las hamacas más conocidas se agotan a media mañana, y “ya veremos” significa en la práctica toalla sobre la arena. Muchos de estos sitios están al final de una carretera estrecha con aparcamiento limitado: cuenta con coche o taxi y con dar vueltas. Fuera de temporada alta la isla se queda en silencio: parte de estas direcciones funcionan con horario reducido o no abren, y la playa no es menos bonita por ello. Y el viento decide más que las reseñas — con viento fuerte del norte la costa norte está picada y se está mejor en el sur, y al revés.',
  'Quelques vérités que personne ne dit. En août, les transats les plus connus sont partis en milieu de matinée, et « on verra sur place » signifie serviette sur le sable. Beaucoup de ces endroits sont au bout d’une route étroite avec peu de stationnement : prévoyez une voiture ou un taxi, et du temps pour chercher. Hors haute saison l’île se tait : une partie de ces adresses tourne au ralenti ou pas du tout, et la plage n’en est pas moins belle. Et le vent décide plus que les avis — par fort vent de nord la côte nord est agitée et le sud vaut mieux, et inversement.',
)

export const BEACH_LABELS = {
  beach: L('Strand', 'Beach', 'Strand', 'Playa', 'Plage'),
  suits: L('Past bij', 'Who it suits', 'Passt zu', 'Para quién es', 'Pour qui'),
  note: L('Eerlijk erbij', 'Honest note', 'Ehrlich dazu', 'Con honestidad', 'En toute franchise'),
}

export const BEACH_CTA = {
  heading: L(
    'Welke beachclub past bij jullie dag?',
    'Which beach club fits your day?',
    'Welcher Beachclub passt zu eurem Tag?',
    '¿Qué beach club encaja con vuestro día?',
    'Quel beach club correspond à votre journée ?',
  ),
  body: L(
    'Stuur ons wanneer je er bent, met hoeveel jullie zijn en wat voor dag je zoekt — rustig, met kinderen, of juist muziek en gezelschap. Wij denken mee over gebied, tijdstip en vervoer, en zeggen erbij wanneer iets in augustus kansloos is. Het bed zelf reserveer je bij de club; wij helpen je de dag kloppend te krijgen.',
    'Tell us when you are here, how many of you there are and what kind of day you want — quiet, with children, or music and company. We think through the area, the timing and how you get there, and we say so when something is hopeless in August. The bed itself you reserve with the club; we help you make the day work.',
    'Schreib uns, wann du da bist, mit wie vielen ihr seid und was für einen Tag du suchst — ruhig, mit Kindern oder mit Musik und Gesellschaft. Wir denken über Gebiet, Zeitpunkt und Anfahrt mit und sagen dazu, wenn etwas im August aussichtslos ist. Die Liege reservierst du beim Club; wir helfen, den Tag stimmig zu machen.',
    'Cuéntanos cuándo estás, cuántos sois y qué tipo de día buscas — tranquilo, con niños, o con música y ambiente. Pensamos contigo la zona, la hora y cómo llegar, y te decimos cuándo algo es inviable en agosto. La hamaca la reservas en el club; nosotros te ayudamos a que el día cuadre.',
    'Dites-nous quand vous êtes là, combien vous êtes et quelle journée vous cherchez — calme, avec des enfants, ou musique et ambiance. Nous réfléchissons à la zone, à l’horaire et au trajet, et nous disons quand quelque chose est ingérable en août. Le transat, vous le réservez au club ; nous, nous faisons tenir la journée.',
  ),
  button: L(
    'Plan je stranddag via WhatsApp',
    'Plan your beach day on WhatsApp',
    'Strandtag per WhatsApp planen',
    'Planifica tu día de playa por WhatsApp',
    'Organisez votre journée plage sur WhatsApp',
  ),
  prefill: L(
    'Hoi! Ik wil een stranddag op Ibiza plannen. Kunnen jullie meedenken over welke beachclub past?',
    'Hi! I would like to plan a beach day in Ibiza. Could you help me work out which beach club fits?',
    'Hallo! Ich möchte einen Strandtag auf Ibiza planen. Könnt ihr mir helfen, den passenden Beachclub zu finden?',
    '¡Hola! Quiero planear un día de playa en Ibiza. ¿Me ayudáis a ver qué beach club encaja?',
    'Bonjour ! Je souhaite organiser une journée plage à Ibiza. Pouvez-vous m’aider à choisir le beach club ?',
  ),
}
