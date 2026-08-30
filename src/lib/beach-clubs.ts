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

export const BEACH_AREAS: BeachArea[] = [
  // ── 1. Playa d'en Bossa ─────────────────────────────────────────────────
  {
    id: 'playa-den-bossa',
    title: L(
      'Playa d’en Bossa',
      'Playa d’en Bossa',
      'Playa d’en Bossa',
      'Playa d’en Bossa',
      'Playa d’en Bossa',
    ),
    intro: L(
      'Het langste zandstrand van het eiland, vlak bij Ibiza-stad en op loopafstand van de grote clubs. Hier staan de meeste bedden per meter strand en hier hoor je overdag ook het meeste geluid: het is het gebied waar de dag en de nacht in elkaar overlopen. Het strand loopt langzaam af en het zand is fijn, wat het ondanks de drukte prettig maakt om in te zwemmen.',
      'The island’s longest sandy beach, close to Ibiza Town and within walking distance of the big clubs. This is where you will find the most beds per metre of sand and also the most sound during the day: it is the stretch where the day and the night run into each other. The beach shelves gently and the sand is fine, which keeps the swimming pleasant despite the crowds.',
      'Der längste Sandstrand der Insel, nah an Ibiza-Stadt und zu Fuß von den großen Clubs erreichbar. Hier stehen die meisten Liegen pro Strandmeter, und hier ist es tagsüber am lautesten: Es ist der Abschnitt, an dem Tag und Nacht ineinander übergehen. Der Strand fällt flach ab und der Sand ist fein, was das Schwimmen trotz Trubel angenehm macht.',
      'La playa de arena más larga de la isla, cerca de Ibiza ciudad y a pie de los grandes clubs. Aquí hay más hamacas por metro de arena que en ningún otro sitio y también más sonido durante el día: es el tramo donde el día y la noche se solapan. La playa baja poco a poco y la arena es fina, lo que hace agradable el baño pese al gentío.',
      'La plus longue plage de sable de l’île, proche d’Ibiza-ville et à pied des grands clubs. C’est là qu’il y a le plus de transats au mètre et aussi le plus de son en journée : c’est le secteur où le jour et la nuit se confondent. La plage descend en pente douce et le sable est fin, ce qui rend la baignade agréable malgré la foule.',
    ),
    clubs: [
      {
        id: 'beachouse',
        name: 'Beachouse Ibiza',
        beach: 'Playa d’en Bossa',
        suits: L(
          'Een lange, ontspannen dag met muziek op de achtergrond en eten aan tafel in plaats van op schoot.',
          'A long, relaxed day with music in the background and food at a table rather than on your lap.',
          'Einen langen, entspannten Tag mit Musik im Hintergrund und Essen am Tisch statt auf dem Schoß.',
          'Un día largo y relajado, con música de fondo y comida en mesa en vez de en el regazo.',
          'Une longue journée détendue, musique en fond et repas à table plutôt que sur les genoux.',
        ),
        blurb: L(
          'Een van de bekendste beachclubs van Bossa, met bedden op het zand, een restaurantgedeelte en dj’s die het tempo van de dag langzaam opvoeren. Minder schreeuwerig dan de poolclubs verderop en meer gericht op de hele dag doorbrengen.',
          'One of the best-known beach clubs on Bossa, with beds on the sand, a restaurant section and DJs who lift the tempo of the day gradually. Less shouty than the pool clubs further along and more about staying put for the whole day.',
          'Einer der bekanntesten Beachclubs an der Bossa, mit Liegen im Sand, einem Restaurantbereich und DJs, die das Tempo des Tages langsam anziehen. Weniger schrill als die Poolclubs weiter hinten und eher darauf ausgelegt, den ganzen Tag zu bleiben.',
          'Uno de los beach clubs más conocidos de Bossa, con hamacas en la arena, zona de restaurante y djs que suben el ritmo poco a poco. Menos estridente que los pool clubs de más allá y más pensado para pasar el día entero.',
          'L’un des beach clubs les plus connus de Bossa, avec transats sur le sable, une partie restaurant et des DJ qui montent le tempo progressivement. Moins criard que les pool clubs plus loin, et pensé pour rester la journée entière.',
        ),
        note: L(
          'In augustus is dit een van de eerste plekken die volloopt; wie na het middaguur aankomt zonder reservering, komt meestal niet meer op het zand terecht. Het is ook geen stille plek — kom hier niet voor rust.',
          'In August this is one of the first places to fill; arriving after midday without a reservation usually means not getting onto the sand at all. It is also not a quiet spot — do not come here for silence.',
          'Im August füllt sich das hier als eines der ersten Ziele; wer nach Mittag ohne Reservierung kommt, landet meist nicht mehr im Sand. Ruhig ist es hier ebenfalls nicht — komm nicht wegen der Stille.',
          'En agosto es de los primeros sitios que se llena; llegar pasado el mediodía sin reserva suele significar quedarse sin sitio en la arena. Tampoco es un sitio tranquilo: no vengas buscando silencio.',
          'En août, c’est l’un des premiers endroits complets ; arriver après midi sans réservation, c’est en général ne pas accéder au sable. Ce n’est pas non plus un lieu calme — n’y venez pas pour le silence.',
        ),
      },
      {
        id: 'nassau-beach-club',
        name: 'Nassau Beach Club',
        beach: 'Playa d’en Bossa',
        suits: L(
          'Een verzorgde dag met lunch, waar je in badkleding kunt zitten maar je ook netjes gekleed niet misstaat.',
          'A polished day with a proper lunch, where swimwear is fine but arriving dressed up does not feel out of place either.',
          'Einen gepflegten Tag mit Mittagessen, an dem Badekleidung passt, gutes Anziehen aber ebenso wenig auffällt.',
          'Un día cuidado con comida en condiciones, donde el bañador vale pero ir arreglado tampoco desentona.',
          'Une journée soignée avec un vrai déjeuner, où le maillot convient mais où être habillé ne détonne pas non plus.',
        ),
        blurb: L(
          'Een van de gevestigde namen van het strand, met witte parasols in strakke rijen, een serieuze keuken en bediening tot aan het bed. Het gaat hier meer om lang tafelen en langzaam indutten dan om dansen.',
          'One of the established names on this beach, with white parasols in neat rows, a serious kitchen and service that comes to the bed. It is more about a long lunch and slowly dozing off than about dancing.',
          'Einer der etablierten Namen des Strandes, mit weißen Sonnenschirmen in klaren Reihen, einer ernstzunehmenden Küche und Service bis an die Liege. Es geht eher um langes Essen und langsames Wegdösen als ums Tanzen.',
          'Uno de los nombres asentados de esta playa, con sombrillas blancas en filas limpias, cocina seria y servicio hasta la hamaca. Va más de sobremesa larga y siesta lenta que de bailar.',
          'L’un des noms installés de cette plage, parasols blancs en rangs nets, une vraie cuisine et un service jusqu’au transat. On y vient plus pour un long déjeuner et une sieste lente que pour danser.',
        ),
        note: L(
          'De eerste rij aan het water is beperkt en gaat in het hoogseizoen als eerste weg — achteraan zit je verder van het zicht en dichter bij de doorloop. Reserveren doe je bij de club zelf, niet bij ons.',
          'The front row at the water is limited and goes first in high season — further back you sit away from the view and closer to the walkway. Reserving is done with the club itself, not with us.',
          'Die erste Reihe am Wasser ist begrenzt und in der Hochsaison zuerst weg — weiter hinten sitzt man ohne Blick und näher am Durchgang. Reserviert wird beim Club selbst, nicht bei uns.',
          'La primera fila junto al agua es limitada y vuela en temporada alta — más atrás te quedas sin vistas y más cerca del paso. La reserva se hace en el propio club, no con nosotros.',
          'La première rangée au bord de l’eau est limitée et part en premier en haute saison — plus en arrière, on perd la vue et on gagne le passage. La réservation se fait auprès du club, pas chez nous.',
        ),
      },
      {
        id: 'bora-bora',
        name: 'Bora Bora Ibiza',
        beach: 'Playa d’en Bossa',
        suits: L(
          'Wie het strand vooral als sociale plek ziet en het niet erg vindt dat het er druk en luid is.',
          'Anyone who treats the beach mainly as a social space and does not mind it being busy and loud.',
          'Alle, die den Strand vor allem als sozialen Ort sehen und Trubel und Lautstärke nicht stören.',
          'Quien entiende la playa sobre todo como sitio social y no le molesta el bullicio ni el volumen.',
          'Ceux qui voient la plage d’abord comme un lieu social et que le monde et le volume ne dérangent pas.',
        ),
        blurb: L(
          'Het adres dat het strandfeest op Bossa in de eerste plaats bekend heeft gemaakt: muziek in de open lucht, mensen die van het zand naar de bar en terug bewegen, en een sfeer die eerder aan een middagfeest doet denken dan aan een ligbed.',
          'The address that made the beach party on Bossa famous in the first place: open-air music, people moving between the sand and the bar, and an atmosphere closer to an afternoon party than to a sunbed.',
          'Die Adresse, die die Strandparty an der Bossa überhaupt bekannt gemacht hat: Musik unter freiem Himmel, Leute zwischen Sand und Bar, eine Stimmung, die eher an eine Nachmittagsparty erinnert als an eine Liege.',
          'La dirección que puso de moda la fiesta de playa en Bossa: música al aire libre, gente moviéndose entre la arena y la barra, y un ambiente más de fiesta de tarde que de hamaca.',
          'L’adresse qui a fait connaître la fête de plage à Bossa : musique en plein air, va-et-vient entre le sable et le bar, et une ambiance plus proche d’une fête d’après-midi que d’un transat.',
        ),
        note: L(
          'Uitdrukkelijk niet de plek voor een rustige dag of voor jonge kinderen. Op piekdagen staat het er schouder aan schouder en is het volume niet iets waar je omheen kunt gaan zitten.',
          'Emphatically not the place for a quiet day or for young children. On peak days it is shoulder to shoulder and the volume is not something you can sit around.',
          'Ausdrücklich nicht der Ort für einen ruhigen Tag oder für kleine Kinder. An Spitzentagen steht man Schulter an Schulter, und der Lautstärke kann man nicht ausweichen.',
          'No es en absoluto el sitio para un día tranquilo ni para niños pequeños. En días punta se va hombro con hombro y el volumen no se esquiva sentándote más lejos.',
          'Clairement pas l’endroit pour une journée calme ni pour de jeunes enfants. Les jours de pointe, on est épaule contre épaule, et le volume ne se contourne pas.',
        ),
      },
      {
        id: 'sirocco',
        name: 'Sirocco Beach Ibiza',
        beach: 'Playa d’en Bossa',
        suits: L(
          'Een dag op Bossa met wat meer lucht om je heen, en groepen die willen eten en daarna blijven hangen.',
          'A day on Bossa with a bit more air around you, and groups who want to eat and then stay on.',
          'Einen Tag an der Bossa mit etwas mehr Luft um sich, und Gruppen, die essen und danach bleiben wollen.',
          'Un día en Bossa con algo más de aire alrededor, y grupos que quieren comer y luego quedarse.',
          'Une journée à Bossa avec un peu plus d’espace, et des groupes qui veulent déjeuner puis rester.',
        ),
        blurb: L(
          'Ligt aan het rustigere deel van Playa d’en Bossa, met bedden op het zand en een terras dat op zee uitkijkt. Het tempo is lager dan bij de bekendste namen van het strand, zonder dat er niets gebeurt.',
          'Sits on the calmer stretch of Playa d’en Bossa, with beds on the sand and a terrace looking out to sea. The tempo is lower than at the beach’s loudest names, without the place feeling dead.',
          'Liegt am ruhigeren Teil der Playa d’en Bossa, mit Liegen im Sand und einer Terrasse zum Meer. Das Tempo ist niedriger als bei den lautesten Namen des Strandes, ohne dass nichts los wäre.',
          'Está en el tramo más tranquilo de Playa d’en Bossa, con hamacas en la arena y una terraza mirando al mar. El ritmo es más bajo que en los nombres más ruidosos de la playa, sin que el sitio esté muerto.',
          'Situé sur la portion plus calme de Playa d’en Bossa, avec des transats sur le sable et une terrasse face à la mer. Le rythme est plus bas que chez les noms les plus bruyants de la plage, sans être éteint.',
        ),
        note: L(
          'Playa d’en Bossa is lang: “aan Bossa” kan een kwartier lopen door mul zand betekenen. Kijk vooraf op de kaart aan welke kant je uitkomt, zeker met bagage of kleine kinderen.',
          'Playa d’en Bossa is long: “on Bossa” can mean a fifteen-minute walk through soft sand. Check the map beforehand for which end you are arriving at, especially with bags or small children.',
          'Die Playa d’en Bossa ist lang: „an der Bossa“ kann eine Viertelstunde durch weichen Sand bedeuten. Schau vorher auf die Karte, an welchem Ende du ankommst — vor allem mit Gepäck oder kleinen Kindern.',
          'Playa d’en Bossa es larga: “en Bossa” puede significar un cuarto de hora andando por arena blanda. Mira antes el mapa para saber por qué extremo llegas, sobre todo con bultos o niños pequeños.',
          'Playa d’en Bossa est longue : « à Bossa » peut vouloir dire un quart d’heure de marche dans le sable mou. Vérifiez la carte pour savoir par quel bout vous arrivez, surtout avec des sacs ou de jeunes enfants.',
        ),
      },
    ],
  },

  // ── 2. Cala Jondal ──────────────────────────────────────────────────────
  {
    id: 'cala-jondal',
    title: L('Cala Jondal', 'Cala Jondal', 'Cala Jondal', 'Cala Jondal', 'Cala Jondal'),
    intro: L(
      'Een baai aan de zuidkust waar de kust uit kiezels bestaat in plaats van zand, met heuvels eromheen en boten voor de kust op anker. Het is het gebied dat de yachtcultuur van het eiland het duidelijkst laat zien: hier stap je uit een bijboot het strand op. Omdat de baai naar het zuiden ligt, is het er beschut wanneer het noorden onrustig is.',
      'A south-coast bay where the shore is pebbles rather than sand, hills around it and boats anchored offshore. It is the area that shows the island’s yacht culture most plainly: this is where people step off a tender straight onto the beach. Because the bay faces south, it stays sheltered when the north of the island is restless.',
      'Eine Bucht an der Südküste, deren Ufer aus Kieseln statt Sand besteht, mit Hügeln ringsum und Booten vor Anker. Hier zeigt sich die Yachtkultur der Insel am deutlichsten: Man steigt aus dem Beiboot direkt an den Strand. Weil die Bucht nach Süden liegt, bleibt sie geschützt, wenn der Norden unruhig ist.',
      'Una cala de la costa sur donde la orilla es de cantos rodados y no de arena, con colinas alrededor y barcos fondeados enfrente. Es la zona que mejor enseña la cultura náutica de la isla: aquí se baja de una auxiliar directamente a la playa. Como la cala mira al sur, queda resguardada cuando el norte está movido.',
      'Une baie de la côte sud où le rivage est de galets plutôt que de sable, entourée de collines, avec des bateaux au mouillage. C’est la zone qui montre le plus nettement la culture yacht de l’île : on débarque de l’annexe directement sur la plage. Orientée sud, la baie reste abritée quand le nord s’agite.',
    ),
    clubs: [
      {
        id: 'blue-marlin',
        name: 'Blue Marlin Ibiza',
        beach: 'Cala Jondal',
        suits: L(
          'Een dag die begint als lunch en eindigt als feest, en gezelschappen die van gezien worden houden.',
          'A day that starts as lunch and ends as a party, and groups who enjoy being seen.',
          'Einen Tag, der als Mittagessen beginnt und als Party endet, und Gruppen, die gesehen werden mögen.',
          'Un día que empieza como comida y acaba como fiesta, y grupos a los que les gusta dejarse ver.',
          'Une journée qui commence en déjeuner et finit en fête, et des groupes qui aiment être vus.',
        ),
        blurb: L(
          'De bekendste beachclub van de zuidkust en het beeld dat veel mensen van Ibiza bij dag hebben: bedden tot aan het water, dj’s die de middag oplopen, en een baai vol boten die er speciaal voor komen liggen.',
          'The best-known beach club on the south coast and the image many people hold of daytime Ibiza: beds down to the waterline, DJs building through the afternoon, and a bay full of boats that come specifically to lie there.',
          'Der bekannteste Beachclub der Südküste und das Bild, das viele von Ibiza bei Tag haben: Liegen bis ans Wasser, DJs, die den Nachmittag aufbauen, und eine Bucht voller Boote, die eigens dafür kommen.',
          'El beach club más conocido de la costa sur y la imagen que mucha gente tiene del Ibiza de día: hamacas hasta la orilla, djs que van subiendo la tarde y una cala llena de barcos que vienen justamente a eso.',
          'Le beach club le plus connu de la côte sud et l’image que beaucoup ont d’Ibiza en journée : transats jusqu’à l’eau, DJ qui font monter l’après-midi, et une baie pleine de bateaux venus exprès.',
        ),
        note: L(
          'Cala Jondal is een kiezelstrand, geen zandstrand — neem waterschoenen mee als je gevoelige voeten hebt. De weg erheen is smal en de parkeerruimte beperkt; in augustus is aankomen met de auto het lastigste deel van de dag.',
          'Cala Jondal is a pebble beach, not sand — bring water shoes if your feet are sensitive. The road in is narrow and parking is limited; in August getting there by car is the hardest part of the day.',
          'Die Cala Jondal ist ein Kiesstrand, kein Sandstrand — nimm Badeschuhe mit, wenn deine Füße empfindlich sind. Die Zufahrt ist schmal und der Parkraum knapp; im August ist die Anfahrt mit dem Auto der schwierigste Teil des Tages.',
          'Cala Jondal es playa de cantos, no de arena — lleva escarpines si tienes los pies sensibles. La carretera es estrecha y el aparcamiento limitado; en agosto llegar en coche es la parte más difícil del día.',
          'Cala Jondal est une plage de galets, pas de sable — prévoyez des chaussons si vous avez les pieds sensibles. La route est étroite et le stationnement limité ; en août, arriver en voiture est le plus dur de la journée.',
        ),
      },
      {
        id: 'tropicana',
        name: 'Tropicana Ibiza Beach Club',
        beach: 'Cala Jondal',
        suits: L(
          'Een lange lunch aan zee, stellen en gezinnen die dezelfde baai willen zonder het volume.',
          'A long lunch by the sea; couples and families who want the same bay without the volume.',
          'Ein langes Mittagessen am Meer; Paare und Familien, die dieselbe Bucht ohne Lautstärke wollen.',
          'Una comida larga junto al mar; parejas y familias que quieren la misma cala sin el volumen.',
          'Un long déjeuner au bord de l’eau ; couples et familles qui veulent la même baie sans le volume.',
        ),
        blurb: L(
          'Aan de andere kant van dezelfde baai, met een rustiger karakter: eten aan tafel met uitzicht op het water, bedden op de kiezels en veel minder nadruk op de dj. Wie Cala Jondal mooi vindt maar het feest niet zoekt, zit hier beter.',
          'On the other side of the same bay, with a calmer character: eating at a table over the water, beds on the pebbles and far less emphasis on the DJ. Anyone who loves Cala Jondal but is not after the party sits better here.',
          'Auf der anderen Seite derselben Bucht, ruhiger im Charakter: essen am Tisch über dem Wasser, Liegen auf den Kieseln und deutlich weniger DJ-Betonung. Wer die Cala Jondal mag, aber nicht die Party sucht, sitzt hier besser.',
          'Al otro lado de la misma cala, con un carácter más calmado: comer en mesa sobre el agua, hamacas sobre los cantos y mucho menos protagonismo del dj. Quien ama Cala Jondal pero no busca fiesta está mejor aquí.',
          'De l’autre côté de la même baie, d’un caractère plus calme : manger à table au-dessus de l’eau, transats sur les galets et bien moins de DJ. Ceux qui aiment Cala Jondal sans chercher la fête sont mieux ici.',
        ),
        note: L(
          'De baai deelt één toegangsweg met de rest van Cala Jondal, dus de parkeerdrukte is dezelfde. Buiten het hoogseizoen is het hier stil — mooi, maar reken er niet op dat alles draait.',
          'The bay shares one access road with the rest of Cala Jondal, so the parking crush is the same. Out of high season it is quiet here — lovely, but do not count on everything running.',
          'Die Bucht teilt sich eine Zufahrt mit dem Rest der Cala Jondal, der Parkdruck ist also derselbe. Außerhalb der Hochsaison ist es hier still — schön, aber verlass dich nicht darauf, dass alles läuft.',
          'La cala comparte un único acceso con el resto de Cala Jondal, así que el atasco de aparcamiento es el mismo. Fuera de temporada alta esto está en silencio: bonito, pero no cuentes con que todo funcione.',
          'La baie partage une seule route d’accès avec le reste de Cala Jondal : la pression sur le stationnement est identique. Hors haute saison, c’est silencieux — beau, mais ne comptez pas sur tout être ouvert.',
        ),
      },
    ],
  },
]
