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

  // ── 3. Ses Salines & Es Cavallet ────────────────────────────────────────
  {
    id: 'ses-salines',
    title: L(
      'Ses Salines en Es Cavallet',
      'Ses Salines and Es Cavallet',
      'Ses Salines und Es Cavallet',
      'Ses Salines y Es Cavallet',
      'Ses Salines et Es Cavallet',
    ),
    intro: L(
      'De vlakke zuidpunt van het eiland, met lage duinen, dennen tot bijna aan het water en daarachter de oude zoutpannen. Het gebied is beschermd natuurgebied, wat betekent dat er niet bijgebouwd wordt en dat het strand er nog uitziet zoals dertig jaar geleden. Es Cavallet ligt om de hoek en is losser en rustiger dan Salines zelf.',
      'The flat southern tip of the island: low dunes, pines standing almost on the sand and, behind them, the old salt pans. The area is a protected nature reserve, which means nothing new gets built and the beach still looks much as it did thirty years ago. Es Cavallet lies around the corner and is looser and quieter than Salines itself.',
      'Die flache Südspitze der Insel: niedrige Dünen, Kiefern fast bis ans Wasser und dahinter die alten Salinen. Das Gebiet ist Naturschutzgebiet — es wird nichts dazugebaut, und der Strand sieht noch aus wie vor dreißig Jahren. Es Cavallet liegt um die Ecke und ist entspannter und ruhiger als Salines selbst.',
      'La punta sur y llana de la isla: dunas bajas, pinos casi sobre la arena y, detrás, las viejas salinas. La zona es espacio natural protegido, lo que significa que no se construye más y que la playa sigue pareciéndose a la de hace treinta años. Es Cavallet queda a la vuelta y es más suelta y tranquila que Salines.',
      'La pointe sud et plate de l’île : dunes basses, pins presque sur le sable et, derrière, les anciens marais salants. La zone est un espace naturel protégé : on n’y construit plus, et la plage ressemble encore à celle d’il y a trente ans. Es Cavallet est juste à côté, plus décontractée et plus calme que Salines.',
    ),
    clubs: [
      {
        id: 'sa-trinxa',
        name: 'Sa Trinxa',
        beach: 'Ses Salines',
        suits: L(
          'Wie het oude, ongepolijste Ibiza zoekt en geen bediening aan tafel nodig heeft om gelukkig te zijn.',
          'Anyone chasing the older, unpolished Ibiza who does not need table service to be happy.',
          'Alle, die das alte, ungeschliffene Ibiza suchen und keinen Tischservice brauchen, um zufrieden zu sein.',
          'Quien busca el Ibiza antiguo y sin pulir y no necesita servicio de mesa para estar a gusto.',
          'Ceux qui cherchent l’Ibiza d’avant, non policée, et n’ont pas besoin d’un service à table pour être heureux.',
        ),
        blurb: L(
          'Aan het uiterste eind van Ses Salines, een strandbar die eerder een instituut dan een beachclub is: een houten hut, muziek die al decennia bij de plek hoort en publiek dat op het zand ligt in plaats van op een bali-bed. Het is het tegenovergestelde van de witte parasolrijen elders.',
          'At the far end of Ses Salines, a beach bar that is more an institution than a beach club: a wooden shack, music that has belonged to the place for decades and a crowd lying on the sand rather than on a bali bed. It is the opposite of the white parasol rows elsewhere.',
          'Am äußersten Ende von Ses Salines eine Strandbar, die eher Institution als Beachclub ist: eine Holzhütte, Musik, die seit Jahrzehnten dazugehört, und Publikum, das im Sand liegt statt auf einem Bali-Bett. Das Gegenteil der weißen Schirmreihen anderswo.',
          'Al final de Ses Salines, un chiringuito que es más institución que beach club: una caseta de madera, música que lleva décadas siendo parte del sitio y gente tumbada en la arena en vez de en una cama balinesa. Lo contrario de las hileras de sombrillas blancas.',
          'À l’extrémité de Ses Salines, un bar de plage plus institution que beach club : une cabane en bois, une musique qui appartient au lieu depuis des décennies, et un public allongé sur le sable plutôt que sur un lit balinais. L’inverse des rangées de parasols blancs.',
        ),
        note: L(
          'Je loopt er een flink stuk naartoe over het strand vanaf de dichtstbijzijnde parkeerplek, en die plek is in het hoogseizoen ver weg. Wie zon mijdt: er is weinig natuurlijke schaduw op dat deel van het strand.',
          'It is a decent walk along the beach from the nearest parking, and in high season that parking is a long way back. If you avoid sun: there is little natural shade on that stretch.',
          'Vom nächsten Parkplatz läuft man ein ordentliches Stück am Strand entlang, und in der Hochsaison liegt dieser Parkplatz weit zurück. Wer Sonne meidet: Auf diesem Abschnitt gibt es kaum natürlichen Schatten.',
          'Hay un buen paseo por la playa desde el aparcamiento más cercano, y en temporada alta ese aparcamiento queda lejos. Si evitas el sol: en ese tramo hay poca sombra natural.',
          'Il faut marcher un bon moment sur la plage depuis le parking le plus proche, et en haute saison ce parking est loin. Si vous fuyez le soleil : il y a peu d’ombre naturelle sur ce tronçon.',
        ),
      },
      {
        id: 'jockey-club',
        name: 'Jockey Club',
        beach: 'Ses Salines',
        suits: L(
          'Een klassieke stranddag met eten en een bed, in een decor dat weinig veranderd is.',
          'A classic beach day with food and a bed, in a setting that has changed little.',
          'Einen klassischen Strandtag mit Essen und Liege, in einer Kulisse, die sich kaum verändert hat.',
          'Un día de playa clásico con comida y hamaca, en un decorado que ha cambiado poco.',
          'Une journée de plage classique avec repas et transat, dans un décor peu changé.',
        ),
        blurb: L(
          'Een van de vaste adressen midden op Ses Salines: bedden en parasols op het zand, een keuken die het strand al lang bedient en een sfeer die eerder gemoedelijk dan mondain is. De dennen achter het strand geven het geheel iets landelijks.',
          'One of the fixtures in the middle of Ses Salines: beds and parasols on the sand, a kitchen that has served this beach for a long time and an atmosphere that is easy-going rather than glossy. The pines behind the beach lend the whole thing something rural.',
          'Eine der festen Adressen mitten an der Ses Salines: Liegen und Schirme im Sand, eine Küche, die diesen Strand seit Langem versorgt, und eine Stimmung, die eher gemütlich als mondän ist. Die Kiefern hinter dem Strand geben dem Ganzen etwas Ländliches.',
          'Una de las direcciones fijas en mitad de Ses Salines: hamacas y sombrillas en la arena, una cocina que lleva mucho sirviendo a esta playa y un ambiente más campechano que mundano. Los pinos de detrás le dan un aire rural.',
          'L’une des adresses installées au milieu de Ses Salines : transats et parasols sur le sable, une cuisine qui sert cette plage depuis longtemps et une ambiance plus bon enfant que mondaine. Les pins à l’arrière donnent un côté champêtre.',
        ),
        note: L(
          'Ses Salines heeft één toegangsweg en een beperkt aantal parkeerplaatsen; in juli en augustus staat die weg midden op de dag vast. Vroeg komen of een taxi nemen scheelt meer dan welke reservering ook.',
          'Ses Salines has one access road and a limited number of parking spaces; in July and August that road jams in the middle of the day. Coming early or taking a taxi helps more than any reservation.',
          'Ses Salines hat eine Zufahrt und begrenzte Parkplätze; im Juli und August steht diese Straße mittags. Früh kommen oder ein Taxi nehmen bringt mehr als jede Reservierung.',
          'Ses Salines tiene un solo acceso y plazas de aparcamiento limitadas; en julio y agosto esa carretera se colapsa a mediodía. Llegar temprano o ir en taxi ayuda más que cualquier reserva.',
          'Ses Salines n’a qu’une route d’accès et peu de places ; en juillet et août, cette route est bloquée en milieu de journée. Venir tôt ou prendre un taxi aide plus que n’importe quelle réservation.',
        ),
      },
      {
        id: 'experimental-beach',
        name: 'Experimental Beach',
        beach: 'Cap des Falcó',
        suits: L(
          'Zonsondergang met een drankje, en stellen die de dag laat willen laten eindigen zonder de drukte van Bossa.',
          'Sunset with a drink, and couples who want to end the day late without the crush of Bossa.',
          'Sonnenuntergang mit einem Drink, und Paare, die den Tag spät ausklingen lassen wollen — ohne das Gedränge der Bossa.',
          'Puesta de sol con una copa, y parejas que quieren terminar el día tarde sin el agobio de Bossa.',
          'Un coucher de soleil avec un verre, et des couples qui veulent finir la journée tard sans la cohue de Bossa.',
        ),
        blurb: L(
          'Even voorbij Ses Salines, aan een open, kale baai die naar het westen kijkt — daardoor is dit een van de weinige plekken aan de zuidkant waar de zon echt in zee zakt. Losse ligbedden op de grond, veel hout en doek, en meer aandacht voor de cocktail dan voor de dj.',
          'Just past Ses Salines, on an open, bare bay facing west — which makes it one of the few spots on the south side where the sun genuinely drops into the sea. Loose beds on the ground, a lot of wood and canvas, and more attention paid to the cocktail than to the DJ.',
          'Kurz hinter Ses Salines, an einer offenen, kargen Bucht nach Westen — dadurch einer der wenigen Orte im Süden, an denen die Sonne wirklich ins Meer sinkt. Lose Liegen am Boden, viel Holz und Stoff, und mehr Aufmerksamkeit für den Cocktail als für den DJ.',
          'Justo pasada Ses Salines, en una cala abierta y desnuda que mira al oeste — de ahí que sea uno de los pocos sitios del sur donde el sol se hunde de verdad en el mar. Hamacas sueltas en el suelo, mucha madera y lona, y más atención al cóctel que al dj.',
          'Juste après Ses Salines, sur une baie ouverte et nue orientée à l’ouest — l’un des rares endroits du sud où le soleil tombe vraiment dans la mer. Des transats posés au sol, beaucoup de bois et de toile, et plus d’attention au cocktail qu’au DJ.',
        ),
        note: L(
          'De laatste stukken weg zijn onverhard en stoffig; met een lage huurauto rijd je er voorzichtig. De baai is open naar het westen, dus bij westenwind staat er golfslag en waait het zand.',
          'The final stretch of road is unpaved and dusty; in a low hire car you drive it carefully. The bay is open to the west, so in a westerly there is chop and the sand blows.',
          'Die letzten Straßenstücke sind unbefestigt und staubig; mit einem tiefergelegten Mietwagen fährt man vorsichtig. Die Bucht ist nach Westen offen — bei Westwind gibt es Wellen und der Sand fliegt.',
          'El último tramo de carretera es de tierra y polvoriento; con un coche de alquiler bajo se conduce con cuidado. La cala está abierta al oeste, así que con viento de poniente hay marejadilla y vuela la arena.',
          'La fin de la route n’est pas goudronnée et est poussiéreuse ; avec une voiture de location basse, roulez doucement. La baie est ouverte à l’ouest : par vent d’ouest, il y a du clapot et le sable vole.',
        ),
      },
      {
        id: 'chiringuito-blue',
        name: 'Chiringuito Blue',
        beach: 'Es Cavallet',
        suits: L(
          'Een ontspannen dag zonder poeha, en iedereen die zich prettig voelt op een tolerant, gemengd strand.',
          'A relaxed day with no fuss, and anyone comfortable on a tolerant, mixed beach.',
          'Einen entspannten Tag ohne Getue, und alle, die sich an einem toleranten, gemischten Strand wohlfühlen.',
          'Un día relajado y sin postureo, y cualquiera que se sienta cómodo en una playa tolerante y mixta.',
          'Une journée détendue et sans chichis, et quiconque est à l’aise sur une plage tolérante et mixte.',
        ),
        blurb: L(
          'Aan Es Cavallet, het strand achter de duinen dat al lang bekendstaat als het meest vrije en meest gemengde van het eiland — met een groot en zichtbaar lhbtq-publiek. De strandtent zelf is eenvoudig: bedden, schaduw, iets te eten en zee die er ondiep en helder is.',
          'On Es Cavallet, the beach behind the dunes long known as the island’s freest and most mixed — with a large and visible LGBTQ crowd. The beach place itself is simple: beds, shade, something to eat and a sea that is shallow and clear here.',
          'An der Es Cavallet, dem Strand hinter den Dünen, der seit Langem als der freieste und gemischteste der Insel gilt — mit großem, sichtbarem LGBTQ-Publikum. Der Strandbetrieb selbst ist schlicht: Liegen, Schatten, etwas zu essen und ein Meer, das hier flach und klar ist.',
          'En Es Cavallet, la playa detrás de las dunas conocida desde hace mucho como la más libre y mixta de la isla — con un público LGTBQ amplio y visible. El chiringuito en sí es sencillo: hamacas, sombra, algo de comer y un mar que aquí es poco profundo y claro.',
          'Sur Es Cavallet, la plage derrière les dunes, connue de longue date comme la plus libre et la plus mixte de l’île — avec un public LGBTQ nombreux et visible. L’établissement lui-même est simple : transats, ombre, de quoi manger et une mer peu profonde et claire.',
        ),
        note: L(
          'Es Cavallet ligt open naar het oosten en zuidoosten; bij oostenwind staat er golfslag en waait het zand over de bedden. Naaktrecreatie is op delen van dit strand gewoon — geen probleem, maar het is goed dat je het weet als je met familie komt.',
          'Es Cavallet is open to the east and southeast; in an easterly there is chop and the sand blows across the beds. Nudity is normal on parts of this beach — no issue at all, but worth knowing if you are coming with family.',
          'Es Cavallet ist nach Osten und Südosten offen; bei Ostwind gibt es Wellen und der Sand weht über die Liegen. FKK ist auf Teilen dieses Strandes normal — kein Problem, aber gut zu wissen, wenn du mit Familie kommst.',
          'Es Cavallet está abierta al este y al sureste; con levante hay marejadilla y la arena vuela sobre las hamacas. El nudismo es habitual en partes de esta playa — ningún problema, pero conviene saberlo si vienes en familia.',
          'Es Cavallet est ouverte à l’est et au sud-est ; par vent d’est, il y a du clapot et le sable vole sur les transats. Le naturisme est courant sur une partie de la plage — aucun souci, mais bon à savoir si vous venez en famille.',
        ),
      },
    ],
  },

  // ── 4. West coast: Cala Bassa, Cala Comte, Cala Tarida ──────────────────
  {
    id: 'west-coast',
    title: L(
      'Westkust: Cala Bassa, Cala Comte en Cala Tarida',
      'West coast: Cala Bassa, Cala Comte and Cala Tarida',
      'Westküste: Cala Bassa, Cala Comte und Cala Tarida',
      'Costa oeste: Cala Bassa, Cala Comte y Cala Tarida',
      'Côte ouest : Cala Bassa, Cala Comte et Cala Tarida',
    ),
    intro: L(
      'De kant van het eiland met het lichtste water en de beste zonsondergangen. De baaien zijn kleiner dan in het zuiden en liggen tussen rotspunten, waardoor het water er beschut en helder is. Alles ligt hier op rijafstand van Sant Antoni; zonder auto of taxi is dit gebied lastig te doen.',
      'The side of the island with the palest water and the best sunsets. The coves are smaller than in the south and sit between rocky points, which keeps the water sheltered and clear. Everything here is a drive from Sant Antoni; without a car or a taxi this area is awkward to reach.',
      'Die Inselseite mit dem hellsten Wasser und den besten Sonnenuntergängen. Die Buchten sind kleiner als im Süden und liegen zwischen Felsspitzen, was das Wasser geschützt und klar hält. Alles liegt hier eine Fahrt von Sant Antoni entfernt; ohne Auto oder Taxi ist dieses Gebiet mühsam.',
      'El lado de la isla con el agua más clara y las mejores puestas de sol. Las calas son más pequeñas que en el sur y quedan entre puntas de roca, lo que mantiene el agua resguardada y transparente. Todo está aquí a un trayecto en coche de Sant Antoni; sin coche o taxi la zona es incómoda.',
      'Le côté de l’île à l’eau la plus claire et aux meilleurs couchers de soleil. Les criques sont plus petites qu’au sud et logées entre des pointes rocheuses, ce qui garde l’eau abritée et limpide. Tout se trouve à une route de Sant Antoni ; sans voiture ni taxi, la zone est peu pratique.',
    ),
    clubs: [
      {
        id: 'cala-bassa-beach-club',
        name: 'Cala Bassa Beach Club',
        beach: 'Cala Bassa',
        suits: L(
          'Een hele dag met een gemengd gezelschap: gezinnen, vrienden en wie wil eten, zwemmen en blijven.',
          'A full day with a mixed group: families, friends and anyone who wants to eat, swim and stay put.',
          'Einen ganzen Tag mit gemischter Gesellschaft: Familien, Freunde und alle, die essen, schwimmen und bleiben wollen.',
          'Un día entero con grupo mixto: familias, amigos y quien quiera comer, bañarse y quedarse.',
          'Une journée entière en groupe mixte : familles, amis et tous ceux qui veulent manger, nager et rester.',
        ),
        blurb: L(
          'Het grote, breed opgezette adres van de westkust — vaak kortweg CBbC genoemd. Het beslaat een flink deel van een beschutte zandbaai met dennen tot aan het strand, en combineert bedden op het zand met verschillende eetgelegenheden en een tuin achter het strand. Door de omvang lukt het hier vaker om ergens plek te vinden dan bij de kleinere baaien.',
          'The large, broadly laid-out address of the west coast — often shortened to CBbC. It occupies a good part of a sheltered sandy bay with pines running down to the beach, and combines beds on the sand with several places to eat and a garden set back from the shore. Its sheer size means finding a spot works out here more often than in the smaller coves.',
          'Die große, weitläufig angelegte Adresse der Westküste — oft kurz CBbC. Sie nimmt einen guten Teil einer geschützten Sandbucht mit Kiefern bis an den Strand ein und verbindet Liegen im Sand mit mehreren Essgelegenheiten und einem Garten hinter dem Strand. Durch die Größe findet man hier öfter einen Platz als in den kleineren Buchten.',
          'La dirección grande y de trazado amplio de la costa oeste — a menudo abreviada como CBbC. Ocupa buena parte de una cala de arena resguardada con pinos hasta la playa, y combina hamacas en la arena con varios sitios para comer y un jardín detrás. Por tamaño, aquí es más fácil encontrar sitio que en las calas pequeñas.',
          'La grande adresse, largement dimensionnée, de la côte ouest — souvent abrégée CBbC. Elle occupe une bonne partie d’une baie de sable abritée bordée de pins et combine transats sur le sable, plusieurs points de restauration et un jardin en retrait. Sa taille fait qu’on y trouve plus souvent de la place que dans les petites criques.',
        ),
        note: L(
          'Precies omdat het bekend is, staat de parkeerplaats in augustus vroeg vol en is de aanrijroute smal. In het laagseizoen is de baai prachtig en stil, maar draait er veel minder — kom dan voor het strand, niet voor de faciliteiten.',
          'Precisely because it is well known, the car park fills early in August and the approach road is narrow. In low season the bay is beautiful and quiet but far less is running — come then for the beach, not for the facilities.',
          'Gerade weil es bekannt ist, ist der Parkplatz im August früh voll und die Zufahrt schmal. In der Nebensaison ist die Bucht wunderschön und still, aber es läuft deutlich weniger — komm dann für den Strand, nicht für die Einrichtungen.',
          'Precisamente por conocido, el aparcamiento se llena pronto en agosto y el acceso es estrecho. En temporada baja la cala es preciosa y tranquila, pero funciona mucho menos: ven entonces por la playa, no por los servicios.',
          'Justement parce qu’il est connu, le parking se remplit tôt en août et la route d’accès est étroite. En basse saison la baie est magnifique et calme mais bien moins de choses tournent — venez alors pour la plage, pas pour les services.',
        ),
      },
      {
        id: 'sunset-ashram',
        name: 'Sunset Ashram',
        beach: 'Cala Comte',
        suits: L(
          'Late middag tot na zonsondergang, met een groep die van uitzicht en muziek houdt.',
          'Late afternoon through to after sunset, with a group that likes a view and music.',
          'Später Nachmittag bis nach Sonnenuntergang, mit einer Gruppe, die Aussicht und Musik mag.',
          'De media tarde hasta después del atardecer, con un grupo al que le gusta la vista y la música.',
          'De la fin d’après-midi jusqu’après le coucher du soleil, avec un groupe qui aime la vue et la musique.',
        ),
        blurb: L(
          'Op de rotsen boven Cala Comte, kijkend over de eilandjes voor de kust — het uitzicht waarvoor mensen speciaal naar deze kant van het eiland rijden. Beneden zwem je in het lichtste water van Ibiza, boven eet en drink je met de zon recht voor je.',
          'On the rocks above Cala Comte, looking out over the small islands offshore — the view people drive to this side of the island for. Below you swim in the palest water on Ibiza; above you eat and drink with the sun straight ahead.',
          'Auf den Felsen über der Cala Comte, mit Blick auf die vorgelagerten Inselchen — die Aussicht, für die Leute eigens auf diese Inselseite fahren. Unten schwimmt man im hellsten Wasser Ibizas, oben isst und trinkt man mit der Sonne direkt vor sich.',
          'Sobre las rocas de Cala Comte, mirando a los islotes de enfrente — la vista por la que la gente conduce hasta este lado de la isla. Abajo te bañas en el agua más clara de Ibiza; arriba comes y bebes con el sol de frente.',
          'Sur les rochers au-dessus de Cala Comte, face aux îlots du large — la vue pour laquelle on traverse l’île. En bas, on nage dans l’eau la plus claire d’Ibiza ; en haut, on mange et on boit avec le soleil en face.',
        ),
        note: L(
          'Op zonsondergang loopt heel Cala Comte vol en is de parkeerplaats het probleem, niet de tafel. Het is bovendien een rots- en trappenplek: met een kinderwagen of slecht ter been is dit geen makkelijke keuze.',
          'At sunset the whole of Cala Comte fills up and the car park, not the table, is the problem. It is also a rock-and-steps spot: with a pushchair or unsteady legs this is not an easy choice.',
          'Zum Sonnenuntergang füllt sich die gesamte Cala Comte, und das Problem ist der Parkplatz, nicht der Tisch. Zudem ist es ein Fels- und Treppenort: mit Kinderwagen oder unsicherem Gang keine leichte Wahl.',
          'Al atardecer se llena toda Cala Comte y el problema es el aparcamiento, no la mesa. Además es un sitio de roca y escaleras: con carrito o poca movilidad no es una elección fácil.',
          'Au coucher du soleil, toute Cala Comte se remplit et le problème est le parking, pas la table. C’est aussi un lieu de rochers et d’escaliers : avec une poussette ou peu de mobilité, ce n’est pas un choix facile.',
        ),
      },
      {
        id: 'cotton-beach-club',
        name: 'Cotton Beach Club',
        beach: 'Cala Tarida',
        suits: L(
          'Een rustige, verzorgde dag aan de westkust zonder de drukte van Comte, en een lange lunch met uitzicht.',
          'A calm, polished day on the west coast without the Comte crowds, and a long lunch with a view.',
          'Einen ruhigen, gepflegten Tag an der Westküste ohne den Trubel der Comte, und ein langes Mittagessen mit Aussicht.',
          'Un día tranquilo y cuidado en la costa oeste sin el gentío de Comte, y una comida larga con vistas.',
          'Une journée calme et soignée sur la côte ouest sans la foule de Comte, et un long déjeuner avec vue.',
        ),
        blurb: L(
          'Boven Cala Tarida, met terrassen die aflopen richting zee en bedden rond het zwembad in plaats van op het zand. Het is een van de rustiger opties van deze kant: uitzicht en bediening, zonder dat de dag in een feest overgaat.',
          'Above Cala Tarida, with terraces stepping down towards the sea and beds around the pool rather than on the sand. It is one of the calmer options on this side: view and service, without the day turning into a party.',
          'Oberhalb der Cala Tarida, mit Terrassen, die zum Meer hin abfallen, und Liegen am Pool statt im Sand. Eine der ruhigeren Optionen dieser Seite: Aussicht und Service, ohne dass der Tag in eine Party kippt.',
          'Sobre Cala Tarida, con terrazas que bajan hacia el mar y hamacas alrededor de la piscina en vez de en la arena. Es de las opciones más tranquilas de este lado: vistas y servicio, sin que el día acabe en fiesta.',
          'Au-dessus de Cala Tarida, avec des terrasses qui descendent vers la mer et des transats autour de la piscine plutôt que sur le sable. L’une des options les plus calmes de ce côté : vue et service, sans que la journée vire à la fête.',
        ),
        note: L(
          'Je ligt hier niet met je voeten in het zand — wie per se een strandbed wil, moet naar beneden naar de baai zelf. En Cala Tarida ligt afgelegen: reken op rijden en op smalle wegen in het donker terug.',
          'You are not lying with your feet in the sand here — anyone set on a bed on the beach has to go down to the cove itself. And Cala Tarida is remote: expect to drive, and narrow roads on the way back in the dark.',
          'Man liegt hier nicht mit den Füßen im Sand — wer unbedingt eine Liege am Strand will, muss hinunter in die Bucht. Und die Cala Tarida liegt abgelegen: Rechne mit Fahren und schmalen Straßen auf dem Rückweg im Dunkeln.',
          'Aquí no te tumbas con los pies en la arena — quien quiera hamaca en la playa tiene que bajar a la cala. Y Cala Tarida queda apartada: cuenta con conducir y con carreteras estrechas de vuelta de noche.',
          'On n’a pas les pieds dans le sable ici — qui tient à un transat sur la plage doit descendre dans la crique. Et Cala Tarida est isolée : prévoyez de conduire, et des routes étroites au retour de nuit.',
        ),
      },
    ],
  },

  // ── 5. Talamanca ────────────────────────────────────────────────────────
  {
    id: 'talamanca',
    title: L('Talamanca', 'Talamanca', 'Talamanca', 'Talamanca', 'Talamanca'),
    intro: L(
      'De baai direct naast Ibiza-stad, over het water gezien vanaf de haven. Het strand is breed en het water ondiep, waardoor dit het meest praktische gebied is voor wie zonder auto zit: je loopt of vaart er vanuit de stad naartoe. Talamanca is minder spectaculair dan de westkust en juist daarom vaak rustiger.',
      'The bay immediately next to Ibiza Town, seen across the water from the harbour. The beach is wide and the water shallow, which makes this the most practical area for anyone without a car: you can walk or take the water taxi from town. Talamanca is less spectacular than the west coast and, for exactly that reason, often calmer.',
      'Die Bucht direkt neben Ibiza-Stadt, vom Hafen aus über das Wasser zu sehen. Der Strand ist breit und das Wasser flach — das praktischste Gebiet für alle ohne Auto: Man geht zu Fuß oder nimmt das Wassertaxi aus der Stadt. Talamanca ist weniger spektakulär als die Westküste und gerade deshalb oft ruhiger.',
      'La bahía justo al lado de Ibiza ciudad, al otro lado del agua desde el puerto. La playa es ancha y el agua poco profunda, lo que la convierte en la zona más práctica para quien no tiene coche: se llega andando o en taxi acuático desde la ciudad. Talamanca es menos espectacular que la costa oeste y por eso mismo suele estar más tranquila.',
      'La baie juste à côté d’Ibiza-ville, visible depuis le port de l’autre côté de l’eau. La plage est large et l’eau peu profonde, ce qui en fait la zone la plus pratique sans voiture : on y va à pied ou en taxi-bateau depuis la ville. Talamanca est moins spectaculaire que la côte ouest et, pour cette raison même, souvent plus calme.',
    ),
    clubs: [
      {
        id: 'nassau-tanit',
        name: 'Nassau Tanit Beach Club',
        beach: 'Talamanca',
        suits: L(
          'Een halve dag strand vlak bij de stad, en iedereen die geen auto heeft of geen zin heeft om te rijden.',
          'Half a day at the beach close to town, and anyone without a car or without the appetite to drive.',
          'Einen halben Strandtag nah an der Stadt, und alle ohne Auto oder ohne Lust zu fahren.',
          'Media jornada de playa cerca de la ciudad, y cualquiera sin coche o sin ganas de conducir.',
          'Une demi-journée de plage près de la ville, et tous ceux sans voiture ou sans envie de conduire.',
        ),
        blurb: L(
          'Bedden en parasols op het brede zand van Talamanca, met de skyline van Dalt Vila aan de overkant van de baai. Rustiger en huiselijker dan de zusterlocatie op Bossa, en makkelijk te combineren met een middag in Ibiza-stad.',
          'Beds and parasols on the broad sand of Talamanca, with the Dalt Vila skyline across the bay. Quieter and more domestic than the sister location on Bossa, and easy to combine with an afternoon in Ibiza Town.',
          'Liegen und Schirme im breiten Sand von Talamanca, mit der Silhouette von Dalt Vila auf der anderen Seite der Bucht. Ruhiger und häuslicher als der Schwesterbetrieb an der Bossa und gut mit einem Nachmittag in Ibiza-Stadt zu verbinden.',
          'Hamacas y sombrillas sobre la arena ancha de Talamanca, con la silueta de Dalt Vila al otro lado de la bahía. Más tranquilo y doméstico que su hermano de Bossa, y fácil de combinar con una tarde en Ibiza ciudad.',
          'Transats et parasols sur le large sable de Talamanca, avec la silhouette de Dalt Vila de l’autre côté de la baie. Plus calme et plus familial que l’adresse sœur de Bossa, et facile à combiner avec un après-midi à Ibiza-ville.',
        ),
        note: L(
          'De baai ligt open naar het oosten en vangt daardoor de ochtendwind; bij oostenwind is het water hier troebeler dan aan de westkant van het eiland. Voor de allermooiste zee is dit niet de kant om te zijn — voor gemak wel.',
          'The bay is open to the east and catches the morning wind; in an easterly the water here is murkier than on the island’s west side. For the most beautiful sea this is not the side to be on — for convenience it is.',
          'Die Bucht ist nach Osten offen und fängt den Morgenwind; bei Ostwind ist das Wasser hier trüber als an der Westseite der Insel. Für das schönste Meer ist das nicht die richtige Seite — für Bequemlichkeit schon.',
          'La bahía está abierta al este y coge el viento de la mañana; con levante el agua aquí está más turbia que en el oeste de la isla. Para el mar más bonito este no es el lado — para la comodidad sí.',
          'La baie est ouverte à l’est et prend le vent du matin ; par vent d’est, l’eau y est plus trouble que sur la côte ouest. Pour la plus belle mer, ce n’est pas le bon côté — pour la commodité, si.',
        ),
      },
    ],
  },

  // ── 6. Santa Eulària and the east ───────────────────────────────────────
  {
    id: 'santa-eularia',
    title: L(
      'Santa Eulària en de oostkust',
      'Santa Eulària and the east coast',
      'Santa Eulària und die Ostküste',
      'Santa Eulària y la costa este',
      'Santa Eulària et la côte est',
    ),
    intro: L(
      'De kalmste en groenste kant van het eiland, met kleine baaien tussen de pijnbomen en een tempo dat merkbaar lager ligt. Dit is het gebied waar gezinnen en stellen naartoe gaan, en waar de beachclubs eerder om eten en uitzicht draaien dan om een dj-booth. De zon komt hier op boven zee en gaat achter je onder, dus voor zonsondergang moet je naar de andere kant.',
      'The calmest and greenest side of the island, with small coves between the pines and a noticeably lower tempo. This is where families and couples go, and where the beach clubs revolve around food and a view rather than a DJ booth. The sun rises over the sea here and sets behind you, so for sunset you have to cross to the other side.',
      'Die ruhigste und grünste Inselseite, mit kleinen Buchten zwischen den Pinien und spürbar niedrigerem Tempo. Hierher fahren Familien und Paare, und die Beachclubs drehen sich eher um Essen und Aussicht als um eine DJ-Booth. Die Sonne geht hier über dem Meer auf und hinter einem unter — für den Sonnenuntergang muss man auf die andere Seite.',
      'El lado más calmado y verde de la isla, con calas pequeñas entre pinos y un ritmo bastante más bajo. Aquí van familias y parejas, y los beach clubs giran más en torno a la comida y las vistas que a una cabina de dj. El sol sale aquí sobre el mar y se pone a tu espalda: para el atardecer hay que cruzar al otro lado.',
      'Le côté le plus calme et le plus vert de l’île, avec de petites criques entre les pins et un rythme nettement plus lent. C’est là que vont les familles et les couples, et les beach clubs y tournent autour de la table et de la vue plutôt que d’une cabine DJ. Le soleil s’y lève sur la mer et se couche derrière vous : pour le coucher, il faut passer de l’autre côté.',
    ),
    clubs: [
      {
        id: 'nikki-beach',
        name: 'Nikki Beach Ibiza',
        beach: 'Santa Eulària',
        suits: L(
          'Een zondagse lange lunch die in de middag oploopt, en groepen die iets te vieren hebben.',
          'A long Sunday-style lunch that builds through the afternoon, and groups with something to celebrate.',
          'Ein langes sonntägliches Mittagessen, das sich über den Nachmittag steigert, und Gruppen mit etwas zu feiern.',
          'Una comida larga de domingo que va subiendo por la tarde, y grupos con algo que celebrar.',
          'Un long déjeuner dominical qui monte l’après-midi, et des groupes qui ont quelque chose à fêter.',
        ),
        blurb: L(
          'De Ibiza-vestiging van een internationaal merk, aan het water bij Santa Eulària. Wit, zwembad, bedden en een middag die van eten naar muziek beweegt — het meest uitgesproken feestadres van deze rustige kant van het eiland.',
          'The Ibiza outpost of an international brand, on the water at Santa Eulària. White, a pool, beds and an afternoon that moves from food towards music — the most explicitly party-minded address on this quiet side of the island.',
          'Der Ibiza-Ableger einer internationalen Marke, am Wasser bei Santa Eulària. Weiß, Pool, Liegen und ein Nachmittag, der vom Essen zur Musik wandert — die ausgeprägteste Partyadresse dieser ruhigen Inselseite.',
          'La sede ibicenca de una marca internacional, junto al agua en Santa Eulària. Blanco, piscina, hamacas y una tarde que pasa de la comida a la música — la dirección más claramente festiva de este lado tranquilo de la isla.',
          'L’antenne ibizenque d’une marque internationale, au bord de l’eau à Santa Eulària. Du blanc, une piscine, des transats et un après-midi qui passe du repas à la musique — l’adresse la plus franchement festive de ce côté calme de l’île.',
        ),
        note: L(
          'Het is geen strandbed op zand maar een clubterrein aan zee — wie een klassieke stranddag wil, zoekt beter een baai verderop. En vanaf Sant Antoni of de westkant is dit een flinke rit.',
          'This is not a bed on sand but a club site by the sea — anyone after a classic beach day is better off in a cove further along. And from Sant Antoni or the west side it is a long drive.',
          'Das ist keine Liege im Sand, sondern ein Clubgelände am Meer — wer einen klassischen Strandtag will, sucht besser eine Bucht weiter. Und von Sant Antoni oder der Westseite ist es eine lange Fahrt.',
          'No es una hamaca sobre arena sino un recinto de club junto al mar — quien quiera un día de playa clásico está mejor en una cala más allá. Y desde Sant Antoni o el oeste es un buen trayecto.',
          'Ce n’est pas un transat sur le sable mais un site de club au bord de l’eau — pour une journée de plage classique, mieux vaut une crique plus loin. Et depuis Sant Antoni ou l’ouest, la route est longue.',
        ),
      },
      {
        id: 'amante',
        name: 'Amante Ibiza',
        beach: 'Cala Sol d’en Serra',
        suits: L(
          'Stellen, een verjaardag of een dag waarop het uitzicht belangrijker is dan het zwembad.',
          'Couples, a birthday, or a day where the view matters more than the pool.',
          'Paare, einen Geburtstag oder einen Tag, an dem die Aussicht wichtiger ist als der Pool.',
          'Parejas, un cumpleaños o un día en que la vista importa más que la piscina.',
          'Les couples, un anniversaire, ou une journée où la vue compte plus que la piscine.',
        ),
        blurb: L(
          'Op de klif boven een kiezelbaai even ten zuiden van Santa Eulària, met een terras dat recht over zee kijkt en trappen naar het water beneden. Rustig, groen en meer een restaurant met bedden dan een beachclub met een keuken.',
          'On the cliff above a pebble cove just south of Santa Eulària, with a terrace looking straight out to sea and steps down to the water. Quiet, green, and more a restaurant with beds than a beach club with a kitchen.',
          'Auf der Klippe über einer Kiesbucht kurz südlich von Santa Eulària, mit einer Terrasse direkt aufs Meer und Treppen hinunter zum Wasser. Ruhig, grün — eher ein Restaurant mit Liegen als ein Beachclub mit Küche.',
          'Sobre el acantilado de una cala de cantos justo al sur de Santa Eulària, con una terraza mirando de frente al mar y escaleras hasta el agua. Tranquilo, verde y más un restaurante con hamacas que un beach club con cocina.',
          'Sur la falaise au-dessus d’une crique de galets juste au sud de Santa Eulària, avec une terrasse plein mer et des escaliers descendant à l’eau. Calme, vert, et plus un restaurant avec transats qu’un beach club avec cuisine.',
        ),
        note: L(
          'Tussen het terras en het water zit een stevige trap, en beneden liggen kiezels in plaats van zand. Wie slecht ter been is of met een baby komt, moet dat meewegen.',
          'There is a substantial staircase between the terrace and the water, and below it pebbles rather than sand. Anyone unsteady on their feet or travelling with a baby should factor that in.',
          'Zwischen Terrasse und Wasser liegt eine ordentliche Treppe, und unten Kiesel statt Sand. Wer nicht gut zu Fuß ist oder mit Baby kommt, sollte das einrechnen.',
          'Entre la terraza y el agua hay una escalera considerable, y abajo cantos en vez de arena. Quien tenga poca movilidad o venga con un bebé debería tenerlo en cuenta.',
          'Un escalier conséquent sépare la terrasse de l’eau, et en bas ce sont des galets, pas du sable. À prendre en compte si vous marchez mal ou voyagez avec un bébé.',
        ),
      },
      {
        id: 'aiyanna',
        name: 'Aiyanna Ibiza',
        beach: 'Cala Nova',
        suits: L(
          'Een ontspannen lunch met vrienden, en wie de oostkust wil zonder dat het formeel wordt.',
          'A relaxed lunch with friends, and anyone who wants the east coast without it turning formal.',
          'Ein entspanntes Mittagessen mit Freunden, und alle, die die Ostküste ohne Förmlichkeit wollen.',
          'Una comida relajada con amigos, y quien quiera la costa este sin que se vuelva formal.',
          'Un déjeuner détendu entre amis, et ceux qui veulent la côte est sans que cela devienne guindé.',
        ),
        blurb: L(
          'Boven Cala Nova, in een open, licht gebouw tussen het groen met uitzicht op de baai. De toon is losjes en mediterraan: lange tafels, veel schaduw en een dag die vanzelf uitloopt.',
          'Above Cala Nova, in an open, light building set among the greenery with a view over the bay. The tone is loose and Mediterranean: long tables, plenty of shade and a day that runs over of its own accord.',
          'Oberhalb der Cala Nova, in einem offenen, hellen Bau im Grünen mit Blick auf die Bucht. Der Ton ist locker und mediterran: lange Tische, viel Schatten und ein Tag, der von selbst länger wird.',
          'Sobre Cala Nova, en un edificio abierto y luminoso entre el verde con vistas a la cala. El tono es suelto y mediterráneo: mesas largas, mucha sombra y un día que se alarga solo.',
          'Au-dessus de Cala Nova, dans un bâtiment ouvert et clair posé dans la verdure, face à la baie. Le ton est décontracté et méditerranéen : grandes tablées, beaucoup d’ombre et une journée qui s’étire d’elle-même.',
        ),
        note: L(
          'Cala Nova ligt open naar het noordoosten en heeft daardoor vaker golfslag dan de baaien in het zuiden — leuk voor surfers, minder voor kleine kinderen. Buiten het seizoen is deze hele kust stil.',
          'Cala Nova is open to the northeast and therefore gets waves more often than the southern coves — good for surfers, less so for small children. Out of season this whole coast falls quiet.',
          'Die Cala Nova ist nach Nordosten offen und hat deshalb häufiger Wellen als die Buchten im Süden — gut für Surfer, weniger für kleine Kinder. Außerhalb der Saison wird diese ganze Küste still.',
          'Cala Nova está abierta al noreste y por eso tiene oleaje más a menudo que las calas del sur — bien para surfistas, menos para niños pequeños. Fuera de temporada toda esta costa se queda en silencio.',
          'Cala Nova est ouverte au nord-est et connaît donc plus souvent des vagues que les criques du sud — bien pour les surfeurs, moins pour les jeunes enfants. Hors saison, toute cette côte se tait.',
        ),
      },
      {
        id: 'atzaro-beach',
        name: 'Atzaró Beach',
        beach: 'Cala Nova',
        suits: L(
          'Een hele dag op één plek, met eten, schaduw en een bed vlak bij het water.',
          'A full day in one place, with food, shade and a bed close to the water.',
          'Einen ganzen Tag an einem Ort, mit Essen, Schatten und einer Liege nah am Wasser.',
          'Un día entero en un solo sitio, con comida, sombra y hamaca cerca del agua.',
          'Une journée entière au même endroit, avec repas, ombre et transat près de l’eau.',
        ),
        blurb: L(
          'Op het zand van Cala Nova, met veel hout, doek en beplanting en een duidelijke agrarische inslag — dezelfde signatuur als het bekende landgoed in het binnenland waar de naam vandaan komt. Rustiger dan de meeste beachclubs, zonder soberder te zijn.',
          'On the sand at Cala Nova, with a lot of wood, canvas and planting and a distinctly agricultural streak — the same signature as the well-known inland estate the name comes from. Calmer than most beach clubs without being any plainer.',
          'Im Sand der Cala Nova, mit viel Holz, Stoff und Bepflanzung und einer deutlich agrarischen Note — dieselbe Handschrift wie das bekannte Landgut im Inselinneren, von dem der Name stammt. Ruhiger als die meisten Beachclubs, ohne schlichter zu sein.',
          'Sobre la arena de Cala Nova, con mucha madera, lona y vegetación y un aire claramente agrícola — la misma firma que la conocida finca del interior de la que viene el nombre. Más tranquilo que la mayoría de beach clubs sin ser más austero.',
          'Sur le sable de Cala Nova, avec beaucoup de bois, de toile et de végétation et une nette veine agricole — la même signature que le domaine bien connu de l’intérieur dont vient le nom. Plus calme que la plupart des beach clubs sans être plus austère.',
        ),
        note: L(
          'De baai is klein en de bedden zijn dus beperkt in aantal; in augustus is dit geen plek waar je zomaar binnenloopt. Kom je van de zuidkant, dan is het een rit van een halfuur of meer over binnenwegen.',
          'The cove is small and the number of beds correspondingly limited; in August this is not a place you simply walk into. Coming from the south side, it is a half-hour drive or more on back roads.',
          'Die Bucht ist klein und die Zahl der Liegen entsprechend begrenzt; im August spaziert man hier nicht einfach hinein. Von der Südseite ist es eine halbe Stunde oder mehr über Landstraßen.',
          'La cala es pequeña y las hamacas, por tanto, limitadas; en agosto no es un sitio al que se entre sin más. Desde el sur son media hora o más por carreteras secundarias.',
          'La crique est petite et le nombre de transats limité en conséquence ; en août, on n’y entre pas comme ça. Depuis le sud, comptez une demi-heure ou plus par des routes secondaires.',
        ),
      },
    ],
  },

  // ── 7. Sant Antoni and the north ────────────────────────────────────────
  {
    id: 'sant-antoni-north',
    title: L(
      'Sant Antoni en het noorden',
      'Sant Antoni and the north',
      'Sant Antoni und der Norden',
      'Sant Antoni y el norte',
      'Sant Antoni et le nord',
    ),
    intro: L(
      'Sant Antoni kijkt uit op het westen en heeft daarmee de zonsondergang in eigen bezit; het noorden daarachter is ruiger, leger en groener, met baaien tussen de heuvels waar het een stuk stiller is. Twee heel verschillende werelden op korte afstand van elkaar.',
      'Sant Antoni faces west and therefore owns the sunset; the north behind it is rougher, emptier and greener, with coves between the hills where things are markedly quieter. Two very different worlds a short distance apart.',
      'Sant Antoni schaut nach Westen und besitzt damit den Sonnenuntergang; der Norden dahinter ist rauer, leerer und grüner, mit Buchten zwischen den Hügeln, in denen es deutlich stiller ist. Zwei sehr verschiedene Welten dicht beieinander.',
      'Sant Antoni mira al oeste y por eso se queda con la puesta de sol; el norte que hay detrás es más bravo, más vacío y más verde, con calas entre colinas donde todo está mucho más callado. Dos mundos muy distintos a poca distancia.',
      'Sant Antoni est orientée à l’ouest et détient donc le coucher de soleil ; le nord derrière est plus rude, plus vide et plus vert, avec des criques entre les collines nettement plus silencieuses. Deux mondes très différents à courte distance.',
    ),
    clubs: [
      {
        id: 'o-beach',
        name: 'O Beach Ibiza',
        beach: 'Sant Antoni (baai / bay)',
        suits: L(
          'Groepen die overdag willen feesten, vrijgezellenfeesten en wie het zwembad boven de zee verkiest.',
          'Groups who want to party in daylight, stag and hen groups, and anyone who prefers the pool to the sea.',
          'Gruppen, die tagsüber feiern wollen, Junggesellenabschiede und alle, die den Pool dem Meer vorziehen.',
          'Grupos que quieren fiesta de día, despedidas y quien prefiera la piscina al mar.',
          'Les groupes qui veulent faire la fête en journée, les enterrements de vie de garçon, et ceux qui préfèrent la piscine à la mer.',
        ),
        blurb: L(
          'Een daytime poolclub aan de baai van Sant Antoni, met dansers, dj’s en bedden rond het zwembad. Het is uitdrukkelijk een feest bij daglicht en niet een strandclub: de zee ligt er wel, maar de dag draait om het zwembad.',
          'A daytime pool club on the bay at Sant Antoni, with dancers, DJs and beds around the pool. It is explicitly a party in daylight rather than a beach club: the sea is right there, but the day revolves around the pool.',
          'Ein Daytime-Poolclub an der Bucht von Sant Antoni, mit Tänzern, DJs und Liegen rund um den Pool. Ausdrücklich eine Party bei Tageslicht und kein Strandclub: Das Meer ist da, aber der Tag dreht sich um den Pool.',
          'Un pool club diurno en la bahía de Sant Antoni, con bailarines, djs y hamacas alrededor de la piscina. Es explícitamente una fiesta a la luz del día y no un club de playa: el mar está ahí, pero el día gira en torno a la piscina.',
          'Un pool club de jour sur la baie de Sant Antoni, avec danseurs, DJ et transats autour de la piscine. C’est explicitement une fête en plein jour, pas un club de plage : la mer est là, mais la journée tourne autour du bassin.',
        ),
        note: L(
          'Niets voor wie rust zoekt, en niet bedoeld voor kinderen. Toegang en bedden lopen via de club zelf en de voorwaarden verschillen per dag — wij kunnen je erover adviseren, maar niet voor je reserveren.',
          'Not for anyone after peace, and not intended for children. Entry and beds go through the club itself and terms differ by day — we can advise you about it, but we do not reserve it for you.',
          'Nichts für alle, die Ruhe suchen, und nicht für Kinder gedacht. Eintritt und Liegen laufen über den Club selbst, und die Bedingungen unterscheiden sich je nach Tag — wir können beraten, aber nicht für dich reservieren.',
          'No es para quien busca calma, ni está pensado para niños. La entrada y las hamacas van por el propio club y las condiciones cambian según el día — podemos asesorarte, pero no reservar por ti.',
          'Rien pour qui cherche le calme, et pas destiné aux enfants. L’entrée et les transats passent par le club lui-même et les conditions varient selon le jour — nous pouvons conseiller, pas réserver à votre place.',
        ),
      },
      {
        id: 'elements',
        name: 'Elements Ibiza',
        beach: 'Benirràs',
        suits: L(
          'Een langzame dag in het noorden, met zwemmen, eten en zonsondergang op dezelfde plek.',
          'A slow day in the north, with swimming, food and sunset all in one place.',
          'Einen langsamen Tag im Norden, mit Schwimmen, Essen und Sonnenuntergang am selben Ort.',
          'Un día lento en el norte, con baño, comida y atardecer en el mismo sitio.',
          'Une journée lente dans le nord, avec baignade, repas et coucher de soleil au même endroit.',
        ),
        blurb: L(
          'Aan Benirràs, de baai in het noorden die bekendstaat om de trommelaars bij zonsondergang en om de rotspunt in zee waar iedereen naar kijkt. Een eenvoudige, kleurrijke plek met bedden op het zand en eten dat bij het strand past in plaats van bij een restaurant.',
          'On Benirràs, the northern bay known for the drummers at sunset and for the rock stack offshore that everyone looks at. A simple, colourful place with beds on the sand and food that belongs to a beach rather than to a restaurant.',
          'An der Benirràs, der Bucht im Norden, bekannt für die Trommler bei Sonnenuntergang und die Felsnadel im Meer, auf die alle schauen. Ein einfacher, farbiger Ort mit Liegen im Sand und Essen, das zum Strand gehört und nicht zu einem Restaurant.',
          'En Benirràs, la cala del norte conocida por los tambores al atardecer y por el peñón en el mar al que todo el mundo mira. Un sitio sencillo y colorido con hamacas en la arena y comida de playa más que de restaurante.',
          'Sur Benirràs, la baie du nord connue pour ses percussions au coucher du soleil et pour le rocher au large que tout le monde regarde. Un lieu simple et coloré, transats sur le sable et cuisine de plage plutôt que de restaurant.',
        ),
        note: L(
          'Benirràs ligt open naar het noorden: bij Tramuntana staat er kort golfslag en is de baai onaangenaam. De toegangsweg is smal en bochtig en er is weinig parkeerruimte — op zondag bij zonsondergang komt half het eiland hier, dus vroeg zijn is het hele verschil.',
          'Benirràs is open to the north: in a Tramuntana there is short chop and the bay turns unpleasant. The access road is narrow and winding with little parking — on a Sunday at sunset half the island comes here, so being early is the whole difference.',
          'Benirràs ist nach Norden offen: Bei Tramuntana steht kurze Welle und die Bucht wird ungemütlich. Die Zufahrt ist schmal und kurvig, Parkraum knapp — sonntags zum Sonnenuntergang kommt die halbe Insel hierher, früh da sein macht den ganzen Unterschied.',
          'Benirràs está abierta al norte: con tramuntana entra un oleaje corto y la cala se vuelve incómoda. El acceso es estrecho y con curvas y hay poco aparcamiento — el domingo al atardecer viene media isla, así que llegar pronto lo cambia todo.',
          'Benirràs est ouverte au nord : par tramontane, un clapot court s’installe et la baie devient désagréable. La route d’accès est étroite et sinueuse, avec peu de stationnement — le dimanche au coucher du soleil, la moitié de l’île y vient : arriver tôt change tout.',
        ),
      },
    ],
  },
]

/** Flat list, used for the ItemList schema and any "all clubs" counting. */
export const ALL_BEACH_CLUBS: BeachClub[] = BEACH_AREAS.flatMap((a) => a.clubs)
