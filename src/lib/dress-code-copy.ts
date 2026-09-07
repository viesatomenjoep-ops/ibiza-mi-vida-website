import type { Locale } from '@/lib/seo'

/**
 * Dresscode-gids, in vijf talen.
 *
 * ── Waarom één bestand en niet vijf pagina's ──────────────────────────────
 * De keywordpillars op deze site zijn per taal apart geschreven, omdat daar een
 * eigen invalshoek achter zit: de Nederlandse vaarbewijspagina bestaat omdat de
 * Nederlandse regel aan lengte hangt en de Spaanse aan vermogen. Dat is een
 * echt verschil in wat de lezer meebrengt.
 *
 * Hier is dat er niet. Een deurbeleid is een deurbeleid: dezelfde vier dingen
 * worden geweigerd, of je nu uit Rotterdam of uit Lyon komt. Vijf keer
 * dezelfde structuur uitschrijven zou vijf plekken opleveren waar een
 * correctie vergeten kan worden — en dat is precies hoe een pagina in één taal
 * stil iets anders gaat beweren dan in de andere vier.
 *
 * Dus: één structuur, vijf keer de tekst. Wat per taal wél verschilt is de
 * toon en de voorbeelden waar dat helpt; wat nooit verschilt zijn de feiten.
 *
 * ── De harde regel die deze tekst draagt ──────────────────────────────────
 * Geen enkel clubspecifiek deurbeleid staat hier als harde regel. Dat wisselt
 * per avond en per portier, en een stellige claim daarover is een belofte die
 * wij aan de deur niet waar kunnen maken. Wat er staat is het patroon, met de
 * uitzonderingen erbij, en de zin dat een deur een mens is.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface NamedCopy {
  name: T
  body: T
}

/** Titel voor het zoekresultaat. De layout plakt ' | Ibiza mi vida' erachter (16 tekens). */
export const META_TITLE: T = L(
  'Ibiza dresscode 2026 — wat mag wel en niet',
  'Ibiza Club Dress Code 2026',
  'Ibiza Dresscode 2026 — was geht rein',
  'Código de vestimenta Ibiza 2026',
  'Dress code clubs Ibiza 2026',
)

/**
 * Snippet, 140-160 tekens.
 *
 * Alle vijf openen met de weigerlijst in plaats van met "wat trek je aan": dat
 * is het antwoord waar iemand naar zoekt, en het is het enige deel dat
 * concreet is.
 */
export const META_DESC: T = L(
  'Wat je aan de deur van een Ibiza-club geweigerd krijgt: strandkleding, voetbalshirts en slippers. Sneakers mogen overal, een colbert hoeft niet.',
  'What actually gets you refused at an Ibiza club door: beachwear, football shirts and flip-flops. Trainers are fine, nobody needs a jacket. Plus the exceptions.',
  'Was dich an einer Ibiza-Clubtür abweisen lässt: Strandkleidung, Fußballtrikots und Flipflops. Sneaker gehen überall, ein Sakko braucht niemand.',
  'Lo que te deja fuera de un club de Ibiza: ropa de playa, camisetas de fútbol y chanclas. Las zapatillas valen y nadie necesita chaqueta. Y las excepciones.',
  "Ce qui vous fait refuser à l'entrée d'un club à Ibiza : tenue de plage, maillots de foot et tongs. Les baskets passent, la veste est inutile.",
)

export const OG_DESC: T = L(
  'Wat er aan de deur geweigerd wordt, en wat echt niet uitmaakt.',
  'What gets refused at the door, and what genuinely does not matter.',
  'Was an der Tür abgewiesen wird — und was wirklich egal ist.',
  'Lo que rechazan en la puerta y lo que de verdad da igual.',
  "Ce qui est refusé à l'entrée, et ce qui n'a aucune importance.",
)

export const CRUMB_NIGHTLIFE: T = L('Uitgaan op Ibiza', 'Ibiza nightlife', 'Ibiza Nachtleben', 'Vida nocturna en Ibiza', 'Vie nocturne à Ibiza')
export const CRUMB_SELF: T = L('Dresscode', 'Dress code', 'Dresscode', 'Vestimenta', 'Dress code')

export const H1: T = L(
  'Ibiza dresscode 2026',
  'Ibiza Club Dress Code 2026',
  'Ibiza Dresscode 2026',
  'Código de vestimenta en Ibiza 2026',
  'Dress code des clubs à Ibiza 2026',
)

/** Antwoord-eerst: de weigerlijst staat in de eerste zin, met het aantal erbij. */
export const LEAD_1: T = L(
  'De meeste clubs op Ibiza hebben geen kledingvoorschrift — ze hebben een weigerlijst, en die is vier dingen lang: strandkleding, voetbalshirts, slippers en hemdjes. Sneakers worden bij élke grote club geaccepteerd, korte broeken bij de meeste, en een colbert of overhemd met kraag hoeft niemand aan. De zorg waarmee mensen aankomen is bijna altijd de verkeerde zorg.',
  'Most Ibiza clubs have no formal dress code — they have a refusal list, and it is four items long: beachwear, football shirts, flip-flops and vests. Trainers are accepted at every major club on the island, shorts at most of them, and nobody needs a jacket or a collar. The worry people arrive with is almost always the wrong worry.',
  'Die meisten Clubs auf Ibiza haben keine Kleiderordnung — sie haben eine Abweisliste, und die ist vier Punkte lang: Strandkleidung, Fußballtrikots, Flipflops und ärmellose Shirts. Sneaker werden in jedem großen Club akzeptiert, kurze Hosen in den meisten, und ein Sakko oder Hemd mit Kragen braucht niemand. Die Sorge, mit der Leute ankommen, ist fast immer die falsche.',
  'La mayoría de los clubs de Ibiza no tienen código de vestimenta — tienen una lista de rechazo, y es de cuatro cosas: ropa de playa, camisetas de fútbol, chanclas y camisetas sin mangas. Las zapatillas se aceptan en todos los clubs grandes, los pantalones cortos en casi todos, y nadie necesita americana ni camisa con cuello. La preocupación con la que llega la gente casi nunca es la correcta.',
  "La plupart des clubs d'Ibiza n'ont pas de dress code — ils ont une liste de refus, et elle tient en quatre points : tenue de plage, maillots de foot, tongs et débardeurs. Les baskets sont acceptées dans tous les grands clubs, le short dans la plupart, et personne n'a besoin d'une veste ni d'un col. L'inquiétude avec laquelle les gens arrivent n'est presque jamais la bonne.",
)

export const LEAD_2: T = L(
  'Twee uitzonderingen zijn echt: de dinner-showzalen handhaven wél een kledingvoorschrift, en de historische clubs in de stad kleden zich netter dan de rest van het eiland. Alles op deze pagina is het patroon en geen belofte — een deur is een mens, en die beslist op de avond zelf.',
  'Two exceptions are real: the dinner-show venues enforce an actual dress code, and the historic clubs in town dress up more than the rest of the island. Everything else on this page is the pattern, not a promise — a door is a person, and they decide on the night.',
  'Zwei Ausnahmen sind echt: Die Dinner-Show-Locations setzen eine tatsächliche Kleiderordnung durch, und die historischen Clubs in der Stadt kleiden sich feiner als der Rest der Insel. Alles andere hier ist das Muster, kein Versprechen — eine Tür ist ein Mensch, und der entscheidet am Abend selbst.',
  'Dos excepciones son reales: los locales de cena-espectáculo sí aplican un código de vestimenta, y los clubs históricos del centro visten más arreglados que el resto de la isla. Todo lo demás en esta página es el patrón, no una promesa — una puerta es una persona, y decide esa noche.',
  "Deux exceptions sont réelles : les établissements dîner-spectacle appliquent un vrai dress code, et les clubs historiques du centre s'habillent plus que le reste de l'île. Tout le reste de cette page est le schéma, pas une promesse — une porte, c'est quelqu'un, et il décide le soir même.",
)

export const H_REFUSED: T = L(
  'Wat er écht geweigerd wordt',
  'What actually gets refused',
  'Was tatsächlich abgewiesen wird',
  'Lo que de verdad rechazan',
  'Ce qui est réellement refusé',
)
export const INTRO_REFUSED: T = L(
  'Korte lijst, en hij is bij elke grote club ongeveer hetzelfde. Geldt geen van deze vier voor jou, dan is kleding niet wat je aan de deur tegenhoudt.',
  'Short list, and it is broadly the same at every major club. If none of these apply to you, clothing is not what will stop you at the door.',
  'Kurze Liste, und sie ist in jedem großen Club ungefähr gleich. Trifft nichts davon auf dich zu, dann ist Kleidung nicht das, was dich an der Tür aufhält.',
  'Lista corta, y es prácticamente la misma en todos los clubs grandes. Si nada de esto te aplica, la ropa no es lo que te va a frenar en la puerta.',
  "Liste courte, et à peu près la même dans tous les grands clubs. Si rien de tout cela ne vous concerne, ce n'est pas la tenue qui vous bloquera à l'entrée.",
)

export const REFUSED: NamedCopy[] = [
  {
    name: L('Strandkleding en zwemkleding', 'Beachwear and swimwear', 'Strand- und Badekleidung', 'Ropa de playa y bañador', 'Tenue de plage et maillot de bain'),
    body: L(
      'De meest voorkomende reden dat iemand wordt geweigerd, omdat het de meest voorkomende manier van aankomen is: rechtstreeks van een beachclub zonder omkleden. Bikinitopjes, boardshorts en sarongs lezen aan een deur om middernacht als strand, hoe goed ze er ook uitzien.',
      'The most common reason someone gets turned away, because it is the most common way to arrive: straight from a beach club without changing. Bikini tops, board shorts and sarongs read as beach at a midnight door no matter how good they look.',
      'Der häufigste Grund für eine Abweisung, weil es die häufigste Art der Ankunft ist: direkt vom Beachclub, ohne sich umzuziehen. Bikinioberteile, Boardshorts und Sarongs lesen sich an einer Tür um Mitternacht als Strand, egal wie gut sie aussehen.',
      'El motivo más común de rechazo, porque es la forma más común de llegar: directo de un beach club sin cambiarse. Tops de bikini, bañadores tipo short y pareos se leen como playa en una puerta a medianoche, por bien que queden.',
      "La raison de refus la plus fréquente, parce que c'est la façon la plus fréquente d'arriver : directement d'un beach club sans se changer. Hauts de bikini, boardshorts et paréos se lisent comme la plage à une porte à minuit, aussi bien coupés soient-ils.",
    ),
  },
  {
    name: L('Voetbalshirts', 'Football shirts', 'Fußballtrikots', 'Camisetas de fútbol', 'Maillots de foot'),
    body: L(
      'Vrijwel overal geweigerd, en het verrast mensen omdat het willekeurig voelt. Het gaat niet om de club waar je voor bent — het is een blanco regel aan de meeste Ibiza-deuren, en uitleggen helpt niet.',
      'Refused almost everywhere, and it catches people out because it feels arbitrary. It is not about the team — it is a blanket rule at most Ibiza doors, and no amount of explaining will move it.',
      'Fast überall abgewiesen, und es überrascht die Leute, weil es willkürlich wirkt. Es geht nicht um den Verein — es ist eine pauschale Regel an den meisten Türen auf Ibiza, und Erklären bringt nichts.',
      'Rechazadas casi en todas partes, y pilla a la gente porque parece arbitrario. No es por el equipo — es una norma general en casi todas las puertas de Ibiza, y explicarlo no sirve de nada.',
      "Refusés presque partout, et ça surprend parce que ça paraît arbitraire. Ce n'est pas une question d'équipe — c'est une règle générale à la plupart des portes d'Ibiza, et argumenter ne change rien.",
    ),
  },
  {
    name: L('Slippers en badslippers', 'Flip-flops and sliders', 'Flipflops und Badelatschen', 'Chanclas y sandalias de piscina', 'Tongs et claquettes'),
    body: L(
      'Strandschoeisel is de duidelijkste grens op het eiland. Sneakers mogen, laarzen mogen, hakken mogen. Alles waarmee je het zand op zou lopen niet, en dat geldt ook voor de dure designerversie.',
      'Beach footwear is the clearest line on the island. Trainers are fine, boots are fine, heels are fine. Anything you would wear onto sand is not, and this includes the expensive designer version.',
      'Strandschuhe sind die klarste Grenze der Insel. Sneaker gehen, Stiefel gehen, Absätze gehen. Alles, womit du in den Sand laufen würdest, nicht — auch die teure Designerversion nicht.',
      'El calzado de playa es la línea más clara de la isla. Zapatillas sí, botas sí, tacones sí. Cualquier cosa con la que pisarías la arena no, y eso incluye la versión cara de diseño.',
      "Les chaussures de plage sont la limite la plus nette de l'île. Baskets d'accord, bottes d'accord, talons d'accord. Tout ce avec quoi vous marcheriez sur le sable, non — y compris la version de créateur.",
    ),
  },
  {
    name: L('Hemdjes en blote bovenlijven', 'Vests and bare chests', 'Ärmellose Shirts und freie Oberkörper', 'Camisetas sin mangas y torso desnudo', 'Débardeurs et torses nus'),
    body: L(
      'Mouwloze shirts bij mannen worden bij de meeste grotere zalen geweigerd. Neem een T-shirt mee voor de deur, ook al overleeft het het eerste uur binnen niet.',
      'Sleeveless tops on men are refused at most of the bigger rooms. Bring a T-shirt for the door even if it does not survive the first hour inside.',
      'Ärmellose Oberteile bei Männern werden in den meisten größeren Räumen abgewiesen. Nimm ein T-Shirt für die Tür mit, auch wenn es die erste Stunde drinnen nicht übersteht.',
      'Las camisetas sin mangas en hombres se rechazan en casi todas las salas grandes. Lleva una camiseta para la puerta, aunque no sobreviva a la primera hora dentro.',
      "Les hauts sans manches pour les hommes sont refusés dans la plupart des grandes salles. Prenez un t-shirt pour l'entrée, même s'il ne survit pas à la première heure.",
    ),
  },
]

export const H_EXCEPTIONS: T = L(
  'De uitzonderingen waar je voor inpakt',
  'The exceptions worth packing for',
  'Die Ausnahmen, für die du packst',
  'Las excepciones por las que sí vale la pena hacer maleta',
  'Les exceptions qui valent la peine de prévoir',
)
export const INTRO_EXCEPTIONS: T = L(
  'Drie soorten zalen waar de regel hierboven niet opgaat.',
  'Three venue types where the general rule above does not hold.',
  'Drei Arten von Locations, bei denen die Regel oben nicht gilt.',
  'Tres tipos de local donde la regla de arriba no aplica.',
  "Trois types d'établissements où la règle ci-dessus ne tient pas.",
)

export const EXCEPTIONS: NamedCopy[] = [
  {
    name: L('Dinner-showzalen', 'Dinner-show venues', 'Dinner-Show-Locations', 'Locales de cena-espectáculo', 'Établissements dîner-spectacle'),
    body: L(
      'Dit is de enige echte uitzondering op het eiland: een kledingvoorschrift dat bestaat én wordt gehandhaafd, omdat het een restaurant met een show is en geen dansvloer. Lange broek en nette schoenen. Zit zo’n avond in je week, dan bepaalt die wat je inpakt.',
      'These are the one genuine exception on the island: a real dress code, enforced, because it is a restaurant and a show rather than a dancefloor. Trousers and proper shoes. If a night includes one of these, it decides what you pack.',
      'Das ist die einzige echte Ausnahme auf der Insel: eine tatsächliche Kleiderordnung, die durchgesetzt wird, weil es ein Restaurant mit Show ist und keine Tanzfläche. Lange Hose und richtige Schuhe. Steht so ein Abend an, bestimmt er, was du einpackst.',
      'Es la única excepción real de la isla: un código de vestimenta que existe y se aplica, porque es un restaurante con espectáculo y no una pista de baile. Pantalón largo y zapato cerrado. Si tu semana incluye una noche así, es la que decide qué metes en la maleta.',
      "C'est la seule vraie exception de l'île : un dress code réel, appliqué, parce que c'est un restaurant avec spectacle et pas une piste. Pantalon et vraies chaussures. Si votre semaine en comprend un, c'est lui qui décide de la valise.",
    ),
  },
  {
    name: L('Open-air zalen overdag', 'Daytime open-air venues', 'Open-Air-Locations am Tag', 'Locales al aire libre de día', 'Établissements en plein air, de jour'),
    body: L(
      'Het losse einde. Deze draaien bij daglicht en het publiek is vroeg in zwemkleding en later in uitgaanskleren — dezelfde zaal, hetzelfde ticket. Neem iets mee om je om te kleden in plaats van tussen de twee te kiezen.',
      'The relaxed end. These run in daylight and the crowd is in swimwear early and going-out clothes later, in the same venue on the same ticket. Bring something to change into rather than choosing one or the other.',
      'Das entspannte Ende. Die laufen bei Tageslicht, und das Publikum ist früh in Badekleidung und später in Ausgehklamotten — gleiche Location, gleiches Ticket. Nimm etwas zum Umziehen mit, statt dich für eins zu entscheiden.',
      'El extremo relajado. Funcionan de día y el público va en bañador temprano y con ropa de salir más tarde, en el mismo local y con la misma entrada. Lleva algo para cambiarte en vez de elegir entre las dos cosas.',
      "Le versant détendu. Ils tournent en plein jour et le public est en maillot tôt puis en tenue de sortie plus tard, même lieu, même billet. Prévoyez de quoi vous changer plutôt que de choisir l'un ou l'autre.",
    ),
  },
  {
    name: L('De historische clubs in de stad', 'The historic town clubs', 'Die historischen Clubs in der Stadt', 'Los clubs históricos del centro', 'Les clubs historiques du centre'),
    body: L(
      'Netter dan de rest van het eiland, en dat verschil is echt in plaats van opgeschreven. Een colbert hoeft niet, maar de zaal kleedt zich op, en rechtstreeks van het strand komen is daar de meest voorkomende reden dat mensen worden geweigerd.',
      'Smarter than the rest of the island, and the difference is real rather than posted. Nobody needs a jacket, but the room dresses up and arriving straight from the beach is the most common reason people are turned away there.',
      'Schicker als der Rest der Insel, und der Unterschied ist echt statt ausgeschildert. Ein Sakko braucht niemand, aber der Raum macht sich fein, und direkt vom Strand zu kommen ist dort der häufigste Abweisungsgrund.',
      'Más arreglados que el resto de la isla, y la diferencia es real, no está escrita en ningún sitio. Nadie necesita americana, pero la sala se viste, y llegar directo de la playa es allí el motivo de rechazo más frecuente.',
      "Plus habillés que le reste de l'île, et la différence est réelle plutôt qu'affichée. Personne n'a besoin d'une veste, mais la salle se met sur son trente-et-un, et arriver directement de la plage y est le motif de refus le plus courant.",
    ),
  },
]

export const H_REAL: T = L(
  'Waar mensen écht voor geweigerd worden',
  'The thing people actually get refused for',
  'Wofür Leute wirklich abgewiesen werden',
  'Por lo que de verdad rechazan a la gente',
  'Ce pour quoi les gens sont vraiment refusés',
)

export const REAL_PARAGRAPHS: T[] = [
  L(
    'Kleding is een klein deel van de weigeringen aan Ibiza-deuren. Het grote deel is te dronken aankomen, en dat komt doordat het dagritme van het eiland ernaartoe werkt: een beachclub vanaf het middaguur, borrels bij zonsondergang, om tien uur eten en om één uur ’s nachts voor een deur staan is dertien uur drinken voordat iemand naar je gekeken heeft. Portiers bij de grote clubs zien het en hebben geen reden om te gokken.',
    'Clothing is a small share of Ibiza door refusals. The large share is arriving too drunk, and it happens because the island’s schedule invites it: a beach club from midday, sunset drinks, dinner at ten, and a club door at one in the morning is thirteen hours of drinking before anyone has looked at you. Doors at the major clubs are good at spotting it and have no incentive to gamble.',
    'Kleidung ist ein kleiner Teil der Abweisungen an Ibizas Türen. Der große Teil ist: zu betrunken ankommen. Das liegt am Tagesablauf der Insel — Beachclub ab mittags, Sundowner, um zehn essen und um eins vor einer Tür stehen sind dreizehn Stunden Trinken, bevor dich überhaupt jemand angeschaut hat. Die Türen der großen Clubs erkennen das und haben keinen Grund zu pokern.',
    'La ropa es una parte pequeña de los rechazos en las puertas de Ibiza. La parte grande es llegar demasiado bebido, y pasa porque el horario de la isla lo invita: beach club desde mediodía, copas al atardecer, cenar a las diez y plantarte en una puerta a la una de la madrugada son trece horas bebiendo antes de que nadie te haya mirado. Las puertas de los clubs grandes lo detectan y no tienen ningún incentivo para arriesgarse.',
    "La tenue représente une petite part des refus aux portes d'Ibiza. La grande part, c'est arriver trop ivre, et cela tient au rythme de l'île : beach club dès midi, apéro au coucher du soleil, dîner à dix heures et une porte de club à une heure du matin, cela fait treize heures à boire avant que quiconque vous ait regardé. Les portiers des grands clubs le repèrent et n'ont aucun intérêt à parier.",
  ),
  L(
    'Op de tweede plaats: na de sluitingstijd van de gastenlijst aankomen en erover in discussie gaan. Bijna elke lijst heeft een tijdstip, dat verschilt per club en per avond, en daarna geldt de gewone deurprijs — dat is de afspraak en geen onderhandeling. Wie hem wél zo behandelt, staat buiten.',
    'Second on the list is arriving after a guestlist cut-off and arguing. Nearly every list has a time, it varies per club and per night, and after it you pay the normal door price — that is the deal rather than a negotiation. The people who get turned away are the ones who treat it as one.',
    'An zweiter Stelle: nach dem Gästelisten-Schluss ankommen und darüber diskutieren. Fast jede Liste hat eine Uhrzeit, sie ist je Club und Abend verschieden, und danach gilt der normale Türpreis — das ist die Abmachung, keine Verhandlung. Abgewiesen werden die, die sie als eine behandeln.',
    'En segundo lugar: llegar después de la hora límite de la lista y ponerse a discutir. Casi toda lista tiene una hora, varía según el club y la noche, y a partir de ahí se paga el precio normal de puerta — es el acuerdo, no una negociación. A quien la trata como tal es a quien dejan fuera.',
    "En deuxième : arriver après l'heure limite de la guestlist et discuter. Presque toutes les listes ont une heure, elle varie selon le club et la soirée, et après, c'est le tarif normal — c'est l'accord, pas une négociation. Ceux qu'on refuse sont ceux qui la prennent pour telle.",
  ),
  L(
    'Op de derde plaats: een grote groep van hetzelfde geslacht die om twee uur ’s nachts zonder tickets samen komt aanzetten. Splits op, koop vooraf, of kom eerder. Niets daarvan staat ergens opgeschreven, en alles ervan klopt.',
    'Third is a large single-sex group with no tickets turning up together at two in the morning. Split up, buy in advance, or arrive earlier. None of that is written anywhere, and all of it is true.',
    'An dritter Stelle: eine große gleichgeschlechtliche Gruppe, die um zwei Uhr nachts ohne Tickets zusammen auftaucht. Teilt euch auf, kauft vorher, oder kommt früher. Nichts davon steht irgendwo geschrieben, und alles davon stimmt.',
    'En tercer lugar: un grupo grande del mismo sexo que aparece junto a las dos de la madrugada sin entradas. Separaos, comprad con antelación o llegad antes. Nada de eso está escrito en ninguna parte, y todo es cierto.',
    "En troisième : un grand groupe non mixte qui débarque ensemble à deux heures du matin sans billets. Séparez-vous, achetez à l'avance, ou arrivez plus tôt. Rien de tout cela n'est écrit nulle part, et tout est vrai.",
  ),
  L(
    'De bruikbare versie van "wat moet ik aan" is dus: trek je strandkleren uit, doe schoenen aan, en verdeel de dag. Dat dekt meer weigeringen af dan welke kledingkeuze ook.',
    'So the useful version of "what should I wear" is: change out of your beach clothes, put on shoes, and pace the day. That covers more refusals than any outfit choice.',
    'Die brauchbare Version von "was soll ich anziehen" lautet also: zieh die Strandsachen aus, zieh Schuhe an, und teil dir den Tag ein. Das deckt mehr Abweisungen ab als jede Outfitfrage.',
    'Así que la versión útil de "qué me pongo" es: quítate la ropa de playa, ponte zapatos y dosifica el día. Eso cubre más rechazos que cualquier elección de vestuario.',
    "La version utile de « qu'est-ce que je mets » est donc : quittez la tenue de plage, mettez des chaussures, et gérez votre journée. Cela couvre plus de refus que n'importe quel choix de tenue.",
  ),
]

export const CTA_HEADING: T = L(
  'Twijfel je over een specifieke avond?',
  'Not sure about a specific night?',
  'Unsicher wegen eines bestimmten Abends?',
  '¿Dudas sobre una noche concreta?',
  'Un doute sur une soirée précise ?',
)
export const CTA_BODY: T = L(
  'Deurbeleid schuift mee met de avond en de promotor, en een algemene regel is niet hetzelfde als weten wat er op jouw datum geldt. Stuur Simon de club en de datum, dan zegt hij wat er die avond speelt — ook als het eerlijke antwoord is dat het niet uitmaakt.',
  'Door policies shift with the night and the promoter, and a general rule is not the same as knowing what happens on your date. Send Simon the club and the date and he will tell you what applies — including when the honest answer is that it does not matter.',
  'Türpolitik verschiebt sich mit dem Abend und dem Promoter, und eine allgemeine Regel ist nicht dasselbe wie zu wissen, was an deinem Datum gilt. Schick Simon Club und Datum, dann sagt er dir, was gilt — auch wenn die ehrliche Antwort ist, dass es egal ist.',
  'La política de puerta cambia con la noche y el promotor, y una regla general no es lo mismo que saber qué pasa en tu fecha. Manda a Simon el club y la fecha y te dirá qué aplica — también cuando la respuesta honesta es que da igual.',
  "La politique de porte bouge selon la soirée et le promoteur, et une règle générale n'équivaut pas à savoir ce qui se passe à votre date. Envoyez le club et la date à Simon : il vous dira ce qui s'applique — y compris quand la réponse honnête est que cela n'a pas d'importance.",
)
export const CTA_PREFILL: T = L(
  'Hoi Simon, korte vraag over de dresscode voor — ',
  'Hi Simon, quick question about the dress code for — ',
  'Hallo Simon, kurze Frage zum Dresscode für — ',
  'Hola Simon, una pregunta rápida sobre la vestimenta para — ',
  'Salut Simon, petite question sur le dress code pour — ',
)

export const FAQS: { q: T; a: T }[] = [
  {
    q: L('Wat is de dresscode voor clubs op Ibiza?', 'What is the dress code for Ibiza clubs?', 'Was ist der Dresscode für Clubs auf Ibiza?', '¿Cuál es el código de vestimenta de los clubs de Ibiza?', 'Quel est le dress code des clubs à Ibiza ?'),
    a: L(
      'De meeste Ibiza-clubs hebben geen formeel kledingvoorschrift, maar wel een weigerlijst, en die is kort: strandkleding, zwemkleding, voetbalshirts, hemdjes en slippers. Al het andere mag breed genomen. Sneakers worden overal geaccepteerd, korte broeken bij de meeste zalen, en niemand heeft een colbert of kraag nodig. De clubs letten veel meer op hóé je aankomt dan op wat je aanhebt.',
      'There is no formal dress code at most Ibiza clubs, but there is a refusal list and it is short: beachwear, swimwear, football shirts, vests and flip-flops. Everything else is broadly fine. Trainers are accepted everywhere, shorts are accepted at most venues, and nobody needs a jacket or a collar. The clubs care far more about how you arrive than what you are wearing.',
      'Die meisten Clubs auf Ibiza haben keine formelle Kleiderordnung, aber eine Abweisliste, und die ist kurz: Strandkleidung, Badekleidung, Fußballtrikots, ärmellose Shirts und Flipflops. Alles andere ist im Großen und Ganzen in Ordnung. Sneaker werden überall akzeptiert, kurze Hosen in den meisten Locations, und niemand braucht Sakko oder Kragen. Den Clubs ist viel wichtiger, wie du ankommst, als was du anhast.',
      'La mayoría de los clubs de Ibiza no tienen un código formal, pero sí una lista de rechazo, y es corta: ropa de playa, bañador, camisetas de fútbol, camisetas sin mangas y chanclas. Todo lo demás vale en general. Las zapatillas se aceptan en todas partes, los pantalones cortos en casi todos los locales, y nadie necesita americana ni cuello. A los clubs les importa mucho más cómo llegas que lo que llevas puesto.',
      "La plupart des clubs d'Ibiza n'ont pas de dress code formel, mais ils ont une liste de refus, et elle est courte : tenue de plage, maillot de bain, maillots de foot, débardeurs et tongs. Le reste passe globalement. Les baskets sont acceptées partout, le short dans la plupart des lieux, et personne n'a besoin de veste ni de col. Les clubs regardent bien plus comment vous arrivez que ce que vous portez.",
    ),
  },
  {
    q: L('Mag ik sneakers dragen in een Ibiza-club?', 'Can I wear trainers to an Ibiza club?', 'Darf ich Sneaker im Ibiza-Club tragen?', '¿Puedo llevar zapatillas a un club de Ibiza?', 'Puis-je porter des baskets en club à Ibiza ?'),
    a: L(
      'Ja, bij elke grote club op het eiland, en het grootste deel van de zaal staat erin. Dit is de meest gestelde zorg en de minst terechte. Het gaat erom dat het schoenen zijn en geen strandschoeisel — sneakers erin, slippers en badslippers eruit. Voor zes uur op een dansvloer zijn sneakers eerder de verstandige keuze.',
      'Yes, at every major club on the island, and most of the room will be in them. This is the single most common worry and the least justified one. What matters is that they are shoes rather than beach footwear — trainers in, flip-flops and sliders out. If anything, trainers are the sensible choice for six hours on a dancefloor.',
      'Ja, in jedem großen Club der Insel, und der Großteil des Raums trägt sie. Das ist die häufigste Sorge und die am wenigsten berechtigte. Wichtig ist, dass es Schuhe sind und keine Strandschuhe — Sneaker rein, Flipflops und Badelatschen raus. Für sechs Stunden auf der Tanzfläche sind Sneaker eher die vernünftige Wahl.',
      'Sí, en todos los clubs grandes de la isla, y la mayoría de la sala las lleva. Es la preocupación más común y la menos justificada. Lo que importa es que sean zapatos y no calzado de playa — zapatillas sí, chanclas no. Si acaso, las zapatillas son la opción sensata para seis horas de pista.',
      "Oui, dans tous les grands clubs de l'île, et la majorité de la salle en porte. C'est l'inquiétude la plus fréquente et la moins fondée. Ce qui compte, c'est que ce soient des chaussures et pas des chaussures de plage — baskets oui, tongs non. Pour six heures sur une piste, les baskets sont même le choix raisonnable.",
    ),
  },
  {
    q: L('Mag ik een korte broek dragen?', 'Can I wear shorts to an Ibiza club?', 'Darf ich kurze Hosen tragen?', '¿Puedo llevar pantalón corto?', 'Puis-je porter un short ?'),
    a: L(
      'Bij de meeste zalen wel, zeker bij de open-air en overdagse, waar de zaal toch al op hitte gekleed is. Bij de dinner-showzalen begint een korte broek een probleem te worden, en een nettere zaal als de historische clubs in de stad leest hem als ondergekleed, ook als de deur hem doorlaat. Neem je maar één optie mee voor een nettere avond, maak er dan een lange broek van.',
      'At most venues yes, especially the open-air and daytime ones where the room is dressed for heat anyway. The dinner-show venues are where shorts start being a problem, and a smarter room like the historic clubs in town reads them as under-dressed even when the door lets them through. If you only pack one option for a smarter night, make it trousers.',
      'In den meisten Locations ja, vor allem in den Open-Air- und Tages-Locations, wo der Raum ohnehin auf Hitze gekleidet ist. Bei den Dinner-Show-Locations wird die kurze Hose zum Problem, und ein schickerer Raum wie die historischen Clubs in der Stadt liest sie als underdressed, selbst wenn die Tür sie durchlässt. Packst du nur eine Option für einen schickeren Abend, dann eine lange Hose.',
      'En casi todos los locales sí, sobre todo en los de aire libre y de día, donde la sala va vestida para el calor de todas formas. En los de cena-espectáculo el pantalón corto empieza a ser un problema, y una sala más arreglada como los clubs históricos del centro lo lee como ir poco vestido, aunque la puerta lo deje pasar. Si solo llevas una opción para una noche más arreglada, que sea pantalón largo.',
      "Dans la plupart des lieux oui, surtout ceux en plein air et de jour, où la salle est de toute façon habillée pour la chaleur. C'est dans les dîners-spectacles que le short devient un problème, et une salle plus habillée comme les clubs historiques du centre le lit comme négligé, même si la porte le laisse passer. Si vous n'emportez qu'une option pour une soirée plus habillée, prenez un pantalon.",
    ),
  },
  {
    q: L('Weigeren Ibiza-clubs mensen?', 'Do Ibiza clubs turn people away?', 'Weisen Clubs auf Ibiza Leute ab?', '¿Los clubs de Ibiza rechazan gente?', 'Les clubs d’Ibiza refusent-ils des gens ?'),
    a: L(
      'Ja, en kleding is zelden de echte reden. Verreweg de meeste weigeringen zijn voor te dronken aankomen, met een grote groep van hetzelfde geslacht zonder ticket komen, of na een gastenlijst-sluitingstijd aankomen en erover discussiëren. Kledingweigeringen treffen vooral mensen die rechtstreeks van het strand kwamen en zich niet hebben omgekleed.',
      'Yes, and clothing is rarely the real reason. The overwhelming majority of refusals are for arriving too drunk, arriving in a large single-sex group with no ticket, or arriving after a guestlist cut-off and arguing about it. Clothing refusals happen mostly to people who came straight from the beach and did not change.',
      'Ja, und Kleidung ist selten der wahre Grund. Die überwiegende Mehrheit der Abweisungen betrifft: zu betrunken ankommen, als große gleichgeschlechtliche Gruppe ohne Ticket ankommen, oder nach dem Gästelisten-Schluss ankommen und darüber diskutieren. Kleidungsabweisungen treffen vor allem Leute, die direkt vom Strand kamen und sich nicht umgezogen haben.',
      'Sí, y la ropa rara vez es el motivo real. La inmensa mayoría de los rechazos son por llegar demasiado bebido, llegar en grupo grande del mismo sexo sin entrada, o llegar pasada la hora límite de la lista y discutirlo. Los rechazos por ropa le pasan sobre todo a quien viene directo de la playa sin cambiarse.',
      "Oui, et la tenue est rarement la vraie raison. L'immense majorité des refus concerne : arriver trop ivre, arriver en grand groupe non mixte sans billet, ou arriver après l'heure limite de la guestlist et discuter. Les refus pour tenue touchent surtout ceux qui viennent directement de la plage sans s'être changés.",
    ),
  },
  {
    q: L('Geldt er een dresscode bij de beachclubs?', 'Is there a dress code at the beach clubs?', 'Gibt es in den Beachclubs einen Dresscode?', '¿Hay código de vestimenta en los beach clubs?', 'Y a-t-il un dress code dans les beach clubs ?'),
    a: L(
      'Feitelijk het omgekeerde. Beachclubs draaien bij daglicht en zwemkleding is juist de bedoeling, met iets eroverheen voor het restaurantgedeelte. Wat je moet plannen is de overgang: rolt een beachclubmiddag door in een clubnacht, dan heb je een plek nodig om je om te kleden — want wat om vier uur ’s middags werkt is precies wat om middernacht geweigerd wordt.',
      'Effectively the opposite one. Beach clubs run in daylight and swimwear is the point, with a cover-up for the restaurant area. The thing to plan is the handover: if a beach-club afternoon rolls into a club night, you need somewhere to change, because what works at four in the afternoon is exactly what gets refused at midnight.',
      'Faktisch der umgekehrte. Beachclubs laufen bei Tageslicht, und Badekleidung ist genau der Punkt, mit etwas darüber für den Restaurantbereich. Zu planen ist der Übergang: Geht ein Beachclub-Nachmittag in eine Clubnacht über, brauchst du einen Ort zum Umziehen — denn was um vier Uhr nachmittags funktioniert, ist genau das, was um Mitternacht abgewiesen wird.',
      'En la práctica, el contrario. Los beach clubs funcionan de día y el bañador es justo lo que toca, con algo encima para la zona de restaurante. Lo que hay que planificar es el relevo: si una tarde de beach club sigue en una noche de club, necesitas dónde cambiarte, porque lo que funciona a las cuatro de la tarde es exactamente lo que rechazan a medianoche.',
      "En pratique, l'inverse. Les beach clubs tournent en plein jour et le maillot est précisément l'usage, avec quelque chose par-dessus pour la partie restaurant. Ce qu'il faut prévoir, c'est le passage : si un après-midi en beach club enchaîne sur une nuit en club, il vous faut un endroit pour vous changer — car ce qui marche à seize heures est exactement ce qui est refusé à minuit.",
    ),
  },
  {
    q: L('Wat trekken vrouwen aan naar een Ibiza-club?', 'What should women wear to an Ibiza club?', 'Was ziehen Frauen für einen Ibiza-Club an?', '¿Qué se ponen las mujeres para un club de Ibiza?', 'Que portent les femmes en club à Ibiza ?'),
    a: L(
      'Wat je thuis naar een goede avond uit zou dragen, met één aanpassing: je staat en danst vijf tot zes uur in een warme zaal, dus schoeisel telt zwaarder dan de outfit. Hakken zijn gebruikelijk en sneakers zijn even goed geaccepteerd. De weigerlijst is voor iedereen hetzelfde — strandkleding en slippers — en er wordt niets formeels verwacht.',
      'Whatever you would wear to a good night out at home, with one adjustment: you will be standing and dancing for five or six hours in a warm room, so footwear matters more than the outfit. Heels are common and trainers are equally accepted. The refusal list is the same for everyone — beachwear and flip-flops — and there is no expectation of anything formal.',
      'Was du zu Hause für einen guten Abend anziehen würdest, mit einer Anpassung: Du stehst und tanzt fünf bis sechs Stunden in einem warmen Raum, also zählen die Schuhe mehr als das Outfit. Absätze sind üblich und Sneaker genauso akzeptiert. Die Abweisliste ist für alle gleich — Strandkleidung und Flipflops — und formell wird nichts erwartet.',
      'Lo que te pondrías para una buena noche en casa, con un ajuste: vas a estar de pie y bailando cinco o seis horas en una sala calurosa, así que el calzado pesa más que el conjunto. Los tacones son habituales y las zapatillas se aceptan igual. La lista de rechazo es la misma para todos — ropa de playa y chanclas — y no se espera nada formal.',
      "Ce que vous porteriez pour une bonne soirée chez vous, avec un ajustement : vous serez debout à danser cinq ou six heures dans une salle chaude, donc les chaussures comptent plus que la tenue. Les talons sont courants et les baskets tout aussi acceptées. La liste de refus est la même pour tout le monde — tenue de plage et tongs — et rien de formel n'est attendu.",
    ),
  },
  {
    q: L('Moet ik ook een identiteitsbewijs meenemen?', 'Do I need to bring ID as well?', 'Muss ich auch einen Ausweis mitnehmen?', '¿Tengo que llevar también documento de identidad?', 'Dois-je aussi apporter une pièce d’identité ?'),
    a: L(
      'Ja, en dit is het enige waar mensen daadwerkelijk voor worden weggestuurd. Achttien is de minimumleeftijd en die wordt aan de deur van elke grote club gecontroleerd met een fysiek identiteitsbewijs, ongeacht je ticket, tafel of plek op een lijst. Een foto van je paspoort op je telefoon wordt bij de meeste zalen niet geaccepteerd. Neem het document zelf mee.',
      'Yes, and it is the one thing people actually get turned away for. Eighteen is the minimum age and it is checked with physical photo ID at the door of every major club, regardless of your ticket, table or place on a list. A photo of your passport on your phone is not accepted at most venues. Bring the physical document.',
      'Ja, und das ist das Einzige, wofür Leute tatsächlich weggeschickt werden. Achtzehn ist das Mindestalter, und es wird an der Tür jedes großen Clubs mit einem physischen Lichtbildausweis kontrolliert, unabhängig von Ticket, Tisch oder Listenplatz. Ein Foto des Passes auf dem Handy wird in den meisten Locations nicht akzeptiert. Nimm das Dokument selbst mit.',
      'Sí, y es lo único por lo que de verdad se queda gente fuera. Dieciocho es la edad mínima y se comprueba con documento físico con foto en la puerta de todos los clubs grandes, sin importar tu entrada, tu mesa o tu sitio en una lista. Una foto del pasaporte en el móvil no se acepta en casi ningún local. Lleva el documento.',
      "Oui, et c'est la seule chose pour laquelle des gens sont réellement refoulés. Dix-huit ans est l'âge minimum et il est vérifié avec une pièce d'identité physique à l'entrée de tous les grands clubs, quel que soit votre billet, votre table ou votre place sur une liste. Une photo du passeport sur le téléphone n'est pas acceptée dans la plupart des lieux. Apportez le document.",
    ),
  },
]

export const H_LINKS: T = L('Gerelateerde pagina’s', 'Related pages', 'Verwandte Seiten', 'Páginas relacionadas', 'Pages liées')

/**
 * Interne links als routesleutel, niet als slug.
 *
 * `InternalLinks` bouwt `/{locale}/{href}` en doet zelf geen vertaling, dus een
 * hardgecodeerde `ibiza-nightlife` zou op de Nederlandse pagina naar een 404
 * wijzen — de Nederlandse slug is `ibiza-uitgaan`. De pagina zoekt de juiste
 * slug op met `slugFor()`; hier staan alleen de sleutel en het label.
 */
export const LINKS: { key: string; localized: boolean; label: T; body: T }[] = [
  {
    key: 'nightlife-guide', localized: true,
    label: L('Uitgaansgids Ibiza', 'Ibiza nightlife guide', 'Ibiza Nachtleben-Guide', 'Guía de vida nocturna en Ibiza', 'Guide de la vie nocturne à Ibiza'),
    body: L('Hoe de hele avond in elkaar zit, van beachclub tot zes uur ’s ochtends.', 'How the whole night fits together, from beach club to six in the morning.', 'Wie der ganze Abend zusammenhängt, vom Beachclub bis sechs Uhr morgens.', 'Cómo encaja toda la noche, del beach club a las seis de la mañana.', "Comment la soirée s'articule, du beach club à six heures du matin."),
  },
  {
    key: 'club-tickets-hub', localized: true,
    label: L('Ibiza clubtickets 2026', 'Ibiza club tickets 2026', 'Ibiza Clubtickets 2026', 'Entradas discotecas Ibiza 2026', 'Billets clubs Ibiza 2026'),
    body: L('Wat entree kost, en wanneer avonden uitverkopen.', 'What entry costs, and when nights sell out.', 'Was der Eintritt kostet und wann Nächte ausverkauft sind.', 'Lo que cuesta la entrada y cuándo se agotan las noches.', "Le prix de l'entrée, et quand les soirées affichent complet."),
  },
  {
    key: 'guestlist', localized: false,
    label: L('Ibiza gastenlijst', 'Ibiza guestlist', 'Ibiza Gästeliste', 'Lista de invitados Ibiza', 'Guestlist Ibiza'),
    body: L('Sluitingstijden, en wat een lijstplek je echt oplevert.', 'Cut-off times, and what a list actually gets you.', 'Schlusszeiten, und was ein Listenplatz wirklich bringt.', 'Horas límite y lo que de verdad te da estar en lista.', "Heures limites, et ce qu'une place sur la liste apporte vraiment."),
  },
  {
    key: 'clubs', localized: false,
    label: L('Alle clubs', 'All clubs', 'Alle Clubs', 'Todos los clubs', 'Tous les clubs'),
    body: L('Elke zaal die wij dekken, met een eigen programma.', 'Every venue we cover, each with its own programme.', 'Jede Location, die wir abdecken, mit eigenem Programm.', 'Cada local que cubrimos, con su propio programa.', 'Chaque établissement que nous couvrons, avec son programme.'),
  },
  {
    key: 'beach-clubs', localized: false,
    label: L('Ibiza beachclubs', 'Ibiza beach clubs', 'Ibiza Beachclubs', 'Beach clubs de Ibiza', "Beach clubs d'Ibiza"),
    body: L('Waar de middag zich afspeelt, en waar je je moet omkleden.', 'Where the afternoon happens, and where you need to change.', 'Wo der Nachmittag stattfindet und wo du dich umziehen musst.', 'Dónde ocurre la tarde y dónde tienes que cambiarte.', "Où se passe l'après-midi, et où il faut se changer."),
  },
  {
    key: 'getting-around', localized: true,
    label: L('Vervoer op Ibiza', 'Getting around Ibiza', 'Fortbewegung auf Ibiza', 'Cómo moverse por Ibiza', 'Se déplacer à Ibiza'),
    body: L('En hoe je om zes uur ’s ochtends thuiskomt.', 'And how to get home at six.', 'Und wie du um sechs nach Hause kommst.', 'Y cómo volver a casa a las seis.', 'Et comment rentrer à six heures.'),
  },
]

export const BYLINE_TOPIC: T = L(
  'de dresscode van clubs op Ibiza',
  'Ibiza club dress codes',
  'Dresscodes der Clubs auf Ibiza',
  'la vestimenta en los clubs de Ibiza',
  'le dress code des clubs à Ibiza',
)
