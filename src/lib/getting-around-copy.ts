import type { Locale } from '@/lib/seo'

/**
 * "Hoe kom je rond op Ibiza" — in vijf talen.
 *
 * Zelfde opzet als dress-code-copy.ts en om dezelfde reden: afstanden,
 * reistijden en de vraag of je een auto nodig hebt zijn niet anders voor een
 * Duitser dan voor een Fransman. Eén structuur, vijf keer de tekst.
 *
 * ── Wat hier bewust ontbreekt ─────────────────────────────────────────────
 * Geen tarieven en geen buslijnnummers, in geen enkele taal. Taxiritten hebben
 * seizoens- en nachttoeslagen, de stranddiensten rijden alleen in het seizoen,
 * en een getal dat hier hardgecodeerd staat is binnen één zomer onwaar en
 * blijft dan jaren staan. Afstanden en reistijden zijn wél stabiel, dus die
 * staan er wel. De ontbrekende cijfers staan als [[VERIFY]] in
 * docs/seo/NIGHT-REPORT.md.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface NamedCopy { name: T; body: T }

export const META_TITLE: T = L(
  'Vervoer op Ibiza — bus, taxi of auto',
  'Getting Around Ibiza — Bus, Taxi or Car',
  'Fortbewegung auf Ibiza — Bus, Taxi, Auto',
  'Cómo moverse por Ibiza: bus, taxi o coche',
  'Se déplacer à Ibiza — bus, taxi ou voiture',
)

/** 140-160 tekens. */
export const META_DESC: T = L(
  'Vervoer op Ibiza: wanneer een huurauto zichzelf terugverdient, wanneer de bus genoeg is, en waarom de rit om zes uur ’s ochtends je hele plan bepaalt.',
  'How to get around Ibiza: when a hire car pays for itself, when the bus is enough, and why the ride home at six in the morning decides your whole plan.',
  'Unterwegs auf Ibiza: wann sich ein Mietwagen rechnet, wann der Bus reicht, und warum die Rückfahrt um sechs Uhr morgens den ganzen Plan bestimmt.',
  'Cómo moverse por Ibiza: cuándo compensa el coche de alquiler, cuándo basta el autobús y por qué la vuelta a casa a las seis de la mañana decide tu plan.',
  "Se déplacer à Ibiza : quand la voiture de location se rentabilise, quand le bus suffit, et pourquoi le retour à six heures décide de tout le plan.",
)

export const OG_DESC: T = L(
  'Afstanden, opties, en de rit naar huis om zes uur ’s ochtends.',
  'Distances, options, and the ride home at six in the morning.',
  'Entfernungen, Optionen und die Rückfahrt um sechs Uhr morgens.',
  'Distancias, opciones y la vuelta a casa a las seis de la mañana.',
  'Distances, options, et le retour à six heures du matin.',
)

export const CRUMB_SELF: T = L('Vervoer op Ibiza', 'Getting around Ibiza', 'Fortbewegung auf Ibiza', 'Cómo moverse por Ibiza', 'Se déplacer à Ibiza')

export const H1: T = L(
  'Vervoer op Ibiza — bus, taxi, auto of boot',
  'Getting Around Ibiza — Bus, Taxi, Car or Boat',
  'Fortbewegung auf Ibiza — Bus, Taxi, Auto oder Boot',
  'Cómo moverse por Ibiza: bus, taxi, coche o barco',
  'Se déplacer à Ibiza — bus, taxi, voiture ou bateau',
)

export const LEAD_1: T = L(
  'Ibiza is klein — van het vliegveld naar Ibiza-Stad is vijftien tot twintig minuten, Ibiza-Stad naar San Antonio ongeveer een half uur, en de noordkust vanaf beide zo’n 45 minuten. Of je een huurauto nodig hebt hangt af van één vraag: verlaat je je verblijf meer dan twee keer per dag? Zo ja, dan wint een auto het binnen ongeveer twee dagen van taxi’s. Zit je aan de strip en ga je elke avond uit, dan is het een parkeerprobleem waar je voor betaalt.',
  'Ibiza is small — the airport to Ibiza Town is fifteen to twenty minutes, Ibiza Town to San Antonio about half an hour, and the north coast around 45 minutes from either. Whether you need a hire car comes down to one question: will you leave your resort more than twice a day? If yes, a car beats taxis within about two days. If you are on the strip and out every night, it is a parking problem you are paying for.',
  'Ibiza ist klein — vom Flughafen nach Ibiza-Stadt sind es fünfzehn bis zwanzig Minuten, von Ibiza-Stadt nach San Antonio etwa eine halbe Stunde, und die Nordküste liegt von beiden rund 45 Minuten entfernt. Ob du einen Mietwagen brauchst, hängt an einer Frage: Verlässt du deine Unterkunft mehr als zweimal am Tag? Wenn ja, schlägt ein Auto die Taxis in etwa zwei Tagen. Wohnst du an der Strip und gehst jeden Abend aus, ist es ein Parkproblem, für das du bezahlst.',
  'Ibiza es pequeña — del aeropuerto a Ibiza ciudad hay quince o veinte minutos, de Ibiza a San Antonio media hora, y la costa norte queda a unos 45 minutos desde cualquiera de las dos. Si necesitas coche de alquiler depende de una pregunta: ¿vas a salir de tu alojamiento más de dos veces al día? Si es que sí, el coche gana a los taxis en unos dos días. Si estás en la strip y sales cada noche, es un problema de aparcamiento por el que pagas.',
  "Ibiza est petite — de l'aéroport à Ibiza-ville il faut quinze à vingt minutes, d'Ibiza à San Antonio une demi-heure environ, et la côte nord se trouve à quelque 45 minutes de l'une comme de l'autre. Savoir s'il vous faut une voiture tient à une question : quitterez-vous votre hébergement plus de deux fois par jour ? Si oui, la voiture bat les taxis en deux jours environ. Si vous logez sur la strip et sortez chaque soir, c'est un problème de stationnement que vous payez.",
)

export const LEAD_2: T = L(
  'We publiceren hier bewust geen tarieven en geen buslijnnummers. Allebei kennen ze seizoens- en nachttoeslagen en veranderen ze tussen zomers, en een verouderd getal op zo’n pagina is erger dan geen getal. Afstanden veranderen niet, dus die staan er wel.',
  'We deliberately publish no fares or bus line numbers here. Both carry seasonal and night supplements and change between summers, and a stale number on a page like this is worse than none. Distances do not change, so those are here.',
  'Wir veröffentlichen hier bewusst keine Tarife und keine Buslinien-Nummern. Beide haben Saison- und Nachtzuschläge und ändern sich von Sommer zu Sommer, und eine veraltete Zahl auf so einer Seite ist schlimmer als gar keine. Entfernungen ändern sich nicht, die stehen deshalb hier.',
  'A propósito no publicamos aquí tarifas ni números de línea de autobús. Ambos llevan suplementos de temporada y nocturnos y cambian de un verano a otro, y un dato caducado en una página así es peor que ninguno. Las distancias no cambian, así que esas sí están.',
  "Nous ne publions volontairement ici ni tarifs ni numéros de ligne de bus. Les deux comportent des suppléments saisonniers et de nuit et changent d'un été à l'autre, et un chiffre périmé sur une page comme celle-ci est pire que pas de chiffre. Les distances, elles, ne bougent pas : elles y sont.",
)

export const H_OPTIONS: T = L(
  'Zes manieren, en wanneer elk van ze wint',
  'Six ways around, and when each one wins',
  'Sechs Möglichkeiten, und wann welche gewinnt',
  'Seis formas de moverte, y cuándo gana cada una',
  'Six façons de circuler, et quand chacune gagne',
)

export const OPTIONS: NamedCopy[] = [
  {
    name: L('Huurauto', 'Hire car', 'Mietwagen', 'Coche de alquiler', 'Voiture de location'),
    body: L(
      'De beste keuze zodra je regelmatig van je verblijf weg wilt, en de enige optie waarmee de noordkust, de westkustbaaien en een club aan een weg in dezelfde reis passen. Het omslagpunt met taxi’s ligt rond twee retourritten per dag. De kostenpost waar niemand op rekent is parkeren.',
      'Best value the moment you plan to leave your resort regularly, and the only option that makes the north coast, the west-coast bays and a road-location club practical on the same trip. Break-even against taxis arrives at roughly two return journeys a day. The cost nobody budgets for is parking.',
      'Die beste Wahl, sobald du regelmäßig von deiner Unterkunft weg willst, und die einzige Option, mit der Nordküste, Westküstenbuchten und ein Club an einer Landstraße in dieselbe Reise passen. Der Break-even gegenüber Taxis liegt bei etwa zwei Hin- und Rückfahrten am Tag. Der Posten, mit dem niemand rechnet, ist das Parken.',
      'La mejor opción en cuanto pienses salir de tu alojamiento con frecuencia, y la única que hace que la costa norte, las calas del oeste y un club a pie de carretera quepan en el mismo viaje. El punto de equilibrio frente al taxi llega hacia los dos trayectos de ida y vuelta al día. El gasto que nadie presupuesta es el aparcamiento.',
      "Le meilleur rapport dès que vous comptez quitter régulièrement votre hébergement, et la seule option qui rend praticables la côte nord, les criques de l'ouest et un club en bord de route dans le même séjour. Le seuil de rentabilité face aux taxis arrive vers deux allers-retours par jour. Le coût que personne ne budgète, c'est le stationnement.",
    ),
  },
  {
    name: L('Taxi', 'Taxi', 'Taxi', 'Taxi', 'Taxi'),
    body: L(
      'Prima voor korte ritten en de standaardkeuze vanaf de standplaats bij aankomst. Op de meter, met toeslagen die per tijdstip en bagage verschillen. De zwakke plek is drukte: sluitingstijd bij een grote club, of een reeks avondlandingen, maakt van vijf minuten wachten veertig.',
      'Fine for short hops and the default from the airport rank. Metered with supplements that vary by time and luggage. The weakness is volume: closing time at a big club, or a bank of evening landings, turns a five-minute wait into forty.',
      'Gut für kurze Strecken und die Standardlösung ab dem Stand am Flughafen. Nach Taxameter, mit Zuschlägen je nach Uhrzeit und Gepäck. Die Schwachstelle ist das Aufkommen: Sperrstunde an einem großen Club oder eine Welle von Abendlandungen macht aus fünf Minuten Wartezeit vierzig.',
      'Bien para trayectos cortos y la opción por defecto en la parada del aeropuerto. Con taxímetro y suplementos que varían según la hora y el equipaje. El punto débil es el volumen: la hora de cierre de un club grande, o una tanda de aterrizajes por la tarde, convierte cinco minutos de espera en cuarenta.',
      "Parfait pour les courts trajets et le réflexe depuis la station de l'aéroport. Au compteur, avec des suppléments selon l'heure et les bagages. Le point faible, c'est l'affluence : la fermeture d'un grand club, ou une série d'atterrissages en soirée, transforme cinq minutes d'attente en quarante.",
    ),
  },
  {
    name: L('Bus', 'Bus', 'Bus', 'Autobús', 'Bus'),
    body: L(
      'Echt bruikbaar tussen Ibiza-Stad, San Antonio, Santa Eulalia en het vliegveld, met in de zomer extra stranddiensten. Goedkoop en betrouwbaar overdag. Controleer de laatste rit vóór je er ’s avonds op rekent — dát is het getal dat telt, niet de prijs.',
      'Genuinely useful between Ibiza Town, San Antonio, Santa Eulalia and the airport, with seasonal beach routes in summer. Cheap and reliable in daylight. Check the last departure before you rely on it for an evening — that is the number that matters, not the fare.',
      'Wirklich nützlich zwischen Ibiza-Stadt, San Antonio, Santa Eulalia und dem Flughafen, im Sommer mit zusätzlichen Strandlinien. Günstig und tagsüber verlässlich. Prüfe die letzte Abfahrt, bevor du dich abends darauf verlässt — das ist die entscheidende Zahl, nicht der Fahrpreis.',
      'De verdad útil entre Ibiza ciudad, San Antonio, Santa Eulalia y el aeropuerto, con líneas de playa en verano. Barato y fiable de día. Mira la última salida antes de contar con él para una noche — ese es el número que importa, no el precio.',
      "Vraiment utile entre Ibiza-ville, San Antonio, Santa Eulalia et l'aéroport, avec des lignes de plage l'été. Bon marché et fiable en journée. Vérifiez le dernier départ avant d'y compter pour une soirée — c'est le chiffre qui compte, pas le tarif.",
    ),
  },
  {
    name: L('Vooraf geboekte transfer', 'Pre-booked transfer', 'Vorab gebuchter Transfer', 'Traslado reservado', 'Transfert réservé'),
    body: L(
      'Een chauffeur met je naam erop, tegen een vooraf afgesproken prijs. De moeite waard voor een groep, een late landing, of de terugweg van een club die aan een weg ligt in plaats van in een dorp. Dit is wat Simon via WhatsApp regelt.',
      'A driver with your name at a price agreed in advance. Worth it for a group, a late landing, or the ride back from a club that sits on a road rather than in a town. This is what Simon arranges over WhatsApp.',
      'Ein Fahrer mit deinem Namen zu einem vorher vereinbarten Preis. Lohnt sich für eine Gruppe, eine späte Landung oder die Rückfahrt von einem Club, der an einer Landstraße liegt statt in einem Ort. Das organisiert Simon per WhatsApp.',
      'Un conductor con tu nombre y un precio acordado de antemano. Merece la pena para un grupo, un aterrizaje tarde o la vuelta desde un club que está a pie de carretera y no dentro de un pueblo. Esto es lo que gestiona Simon por WhatsApp.',
      "Un chauffeur avec votre nom, à un prix convenu à l'avance. Utile pour un groupe, un atterrissage tardif, ou le retour d'un club situé en bord de route plutôt que dans un village. C'est ce que Simon organise via WhatsApp.",
    ),
  },
  {
    name: L('Scooter', 'Scooter', 'Roller', 'Moto', 'Scooter'),
    body: L(
      'Goedkoop, parkeert overal, en een prettige manier om de kustwegen bij daglicht te zien. Het argument ertegen is het overige verkeer ’s nachts, niet de wegen zelf.',
      'Cheap, parks anywhere, and a good way to see the coast roads in daylight. The argument against it is the other traffic at night rather than the roads themselves.',
      'Günstig, parkt überall, und eine schöne Art, die Küstenstraßen bei Tageslicht zu sehen. Das Gegenargument ist der übrige Verkehr bei Nacht, nicht die Straßen selbst.',
      'Barata, aparca en cualquier sitio y es una buena forma de ver las carreteras de costa de día. El argumento en contra es el resto del tráfico de noche, no las carreteras.',
      "Bon marché, se gare partout, et une belle façon de voir les routes côtières de jour. L'argument contre, c'est le reste du trafic la nuit, pas les routes elles-mêmes.",
    ),
  },
  {
    name: L('Boot', 'Boat', 'Boot', 'Barco', 'Bateau'),
    body: L(
      'Geen grap op dit eiland. Een charter bereikt baaien waar de weg niet komt, en de overtocht naar Formentera is dertig minuten met de snelle ferry tegenover helemaal geen weg. Voor een dag aan de westkust is het vaak de betere route.',
      'Not a joke on this island. A charter reaches bays that the roads do not, and the Formentera crossing is thirty minutes by fast ferry against no road at all. For a day out on the west coast it is often the better route.',
      'Auf dieser Insel kein Scherz. Ein Charter erreicht Buchten, zu denen keine Straße führt, und die Überfahrt nach Formentera dauert dreißig Minuten mit der Schnellfähre — gegenüber gar keiner Straße. Für einen Tag an der Westküste ist das oft der bessere Weg.',
      'En esta isla no es una broma. Un chárter llega a calas a las que no llega la carretera, y la travesía a Formentera son treinta minutos en ferry rápido frente a ninguna carretera. Para un día en la costa oeste suele ser la mejor ruta.',
      "Sur cette île, ce n'est pas une plaisanterie. Un charter atteint des criques que la route n'atteint pas, et la traversée vers Formentera prend trente minutes en ferry rapide contre aucune route du tout. Pour une journée sur la côte ouest, c'est souvent la meilleure option.",
    ),
  },
]

export const H_CARLESS: T = L(
  'Ibiza zonder auto — kan dat?',
  'Ibiza without a car — can you?',
  'Ibiza ohne Auto — geht das?',
  '¿Se puede estar en Ibiza sin coche?',
  'Ibiza sans voiture — est-ce possible ?',
)

/** `${totaal}`, `${sa}`, `${bossa}`, `${stad}` worden ingevuld door de pagina. */
export function carlessIntro(l: Locale, totaal: number, sa: number, bossa: number, stad: number): string {
  const m: T = {
    nl: `Ja, en op de meeste reizen is het ook de goedkoopste keuze — maar het wordt bepaald door wáár je slaapt, niet door hoe avontuurlijk je bent. Van de ${totaal} clubs op onze eilandkaart staan er ${sa} in San Antonio, ${bossa} aan de strip van Playa d'en Bossa en ${stad} aan de Ibiza-Stadkant van de haven. Kies één van die drie als uitvalsbasis en een echt deel van de week eindigt lopend. Wat een auto koopt is de rest van het eiland: de westkustbaaien, het noorden, en de zalen die aan een weg liggen in plaats van in een dorp.`,
    en: `Yes, and on most trips it is the cheaper answer — but it is decided by where you sleep, not by how adventurous you are. Of the ${totaal} clubs on our island map, ${sa} sit in San Antonio, ${bossa} on the Playa d'en Bossa strip and ${stad} on the Ibiza Town side of the harbour. Base yourself in one of those three and a real part of the week ends on foot. What a car buys is the rest of the island: the west-coast bays, the north, and the rooms that sit on a road rather than in a town.`,
    de: `Ja, und auf den meisten Reisen ist es sogar die günstigere Antwort — aber es entscheidet sich daran, wo du schläfst, nicht daran, wie abenteuerlustig du bist. Von den ${totaal} Clubs auf unserer Inselkarte liegen ${sa} in San Antonio, ${bossa} an der Strip von Playa d'en Bossa und ${stad} auf der Ibiza-Stadt-Seite des Hafens. Nimm eine dieser drei als Basis, und ein echter Teil der Woche endet zu Fuß. Was ein Auto kauft, ist der Rest der Insel: die Westküstenbuchten, der Norden, und die Locations an einer Landstraße statt in einem Ort.`,
    es: `Sí, y en la mayoría de los viajes además sale más barato — pero lo decide dónde duermes, no lo aventurero que seas. De los ${totaal} clubs de nuestro mapa de la isla, ${sa} están en San Antonio, ${bossa} en la strip de Playa d'en Bossa y ${stad} en el lado de Ibiza ciudad del puerto. Alójate en una de esas tres zonas y una parte real de la semana termina andando. Lo que te compra un coche es el resto de la isla: las calas del oeste, el norte, y las salas que están a pie de carretera y no dentro de un pueblo.`,
    fr: `Oui, et sur la plupart des séjours c'est même la réponse la moins chère — mais cela se décide à l'endroit où vous dormez, pas à votre goût de l'aventure. Sur les ${totaal} clubs de notre carte de l'île, ${sa} se trouvent à San Antonio, ${bossa} sur la strip de Playa d'en Bossa et ${stad} du côté d'Ibiza-ville du port. Installez-vous dans l'une de ces trois zones et une vraie partie de la semaine se termine à pied. Ce qu'une voiture achète, c'est le reste de l'île : les criques de l'ouest, le nord, et les salles situées en bord de route plutôt que dans un village.`,
  }
  return m[l]
}

/** `${clubs}` = de clubnamen in dat gebied, `${n}` = het aantal. */
export const CARLESS_SA = {
  name: (n: number): T => L(`San Antonio — ${n} clubs in dezelfde plaats`, `San Antonio — ${n} clubs in the same town`, `San Antonio — ${n} Clubs am selben Ort`, `San Antonio — ${n} clubs en el mismo pueblo`, `San Antonio — ${n} clubs dans la même ville`),
  body: (clubs: string): T => L(
    `${clubs} staan alle in San Antonio of aan de baai, dus vanuit een hotel in het centrum is de avond te lopen. Dit is ook de kant met de zonsonderganglocaties en overdag de meeste busverbindingen. De ruil is de afstand naar de grote zalen aan de andere kant van het eiland — een reis die je in één nacht twee keer maakt.`,
    `${clubs} are all in San Antonio or on the bay, so from a hotel in the centre the night is a walk. This is also the side with the sunset spots and the most daytime bus connections. The trade is the distance to the big rooms on the other side of the island — a journey you make twice in a night.`,
    `${clubs} liegen alle in San Antonio oder an der Bucht, von einem Hotel im Zentrum aus ist der Abend also zu Fuß machbar. Das ist auch die Seite mit den Sonnenuntergangs-Spots und tagsüber den meisten Busverbindungen. Der Preis dafür ist die Entfernung zu den großen Räumen auf der anderen Inselseite — eine Fahrt, die du in einer Nacht zweimal machst.`,
    `${clubs} están todos en San Antonio o en la bahía, así que desde un hotel del centro la noche se hace andando. Es también el lado de los atardeceres y el que más conexiones de autobús tiene de día. A cambio, la distancia hasta las salas grandes del otro lado de la isla — un trayecto que haces dos veces en una noche.`,
    `${clubs} sont tous à San Antonio ou sur la baie : depuis un hôtel du centre, la soirée se fait à pied. C'est aussi le côté des couchers de soleil et celui qui a le plus de liaisons de bus en journée. En contrepartie, la distance jusqu'aux grandes salles de l'autre côté de l'île — un trajet que vous faites deux fois dans la nuit.`,
  ),
}

export const CARLESS_BOSSA = {
  name: (n: number): T => L(`Playa d'en Bossa — ${n} clubs aan één strip`, `Playa d'en Bossa — ${n} clubs on one strip`, `Playa d'en Bossa — ${n} Clubs an einer Strip`, `Playa d'en Bossa — ${n} clubs en una sola strip`, `Playa d'en Bossa — ${n} clubs sur une seule strip`),
  body: (clubs: string): T => L(
    `${clubs} liggen aan dezelfde strip, met de beachclubs die de middag vullen op hetzelfde stuk strand. Slaap je op die strip, dan eindigt de nacht met een wandeling in plaats van een onderhandeling, en het vliegveld is een kwartier rijden. Je logeert dan wel ín het uitgaansleven in plaats van ernaast.`,
    `${clubs} sit on the same strip, with the beach clubs that fill the afternoon on the same stretch of sand. Sleep on that strip and the night ends in a walk rather than a negotiation, and the airport is fifteen minutes away. You are then staying in the nightlife rather than near it.`,
    `${clubs} liegen an derselben Strip, mit den Beachclubs, die den Nachmittag füllen, am gleichen Strandabschnitt. Schläfst du dort, endet die Nacht mit einem Spaziergang statt mit einer Verhandlung, und der Flughafen ist eine Viertelstunde entfernt. Dafür wohnst du im Nachtleben statt daneben.`,
    `${clubs} están en la misma strip, con los beach clubs que llenan la tarde en el mismo tramo de arena. Si duermes en esa strip, la noche acaba en un paseo y no en una negociación, y el aeropuerto queda a un cuarto de hora. Eso sí: te alojas dentro del ambiente, no al lado.`,
    `${clubs} sont sur la même strip, avec les beach clubs qui remplissent l'après-midi sur la même portion de sable. Dormez là et la soirée se termine par une marche plutôt qu'une négociation, et l'aéroport est à un quart d'heure. En revanche, vous logez dans la vie nocturne plutôt qu'à côté.`,
  ),
}

export const CARLESS_STAD = {
  name: (n: number): T => L(`Ibiza-Stad — ${n} clubs, plus alles wat geen club is`, `Ibiza Town — ${n} clubs, plus everything that is not one`, `Ibiza-Stadt — ${n} Clubs, plus alles, was keiner ist`, `Ibiza ciudad — ${n} clubs, y todo lo que no lo es`, `Ibiza-ville — ${n} clubs, et tout ce qui n'en est pas`),
  body: (clubs: string): T => L(
    `${clubs} liggen aan deze kant van de haven, al hangt de loopafstand af van waar je precies slaapt — Marina Botafoch ligt aan de overkant van het water. Hier komen ook de meeste buslijnen samen, en hier is een regenachtige dag nog steeds een dag.`,
    `${clubs} are on this side of the harbour, though how far you walk depends on exactly where you sleep — Marina Botafoch is across the water from the old town. This is also where most bus routes meet, and where a rainy day is still a day.`,
    `${clubs} liegen auf dieser Seite des Hafens, wobei die Gehstrecke davon abhängt, wo genau du schläfst — Marina Botafoch liegt gegenüber der Altstadt. Hier treffen sich auch die meisten Buslinien, und hier ist ein Regentag immer noch ein Tag.`,
    `${clubs} están en este lado del puerto, aunque lo que camines depende de dónde duermas exactamente — Marina Botafoch está al otro lado del agua. Aquí confluyen además la mayoría de las líneas de autobús, y aquí un día de lluvia sigue siendo un día.`,
    `${clubs} se trouvent de ce côté du port, même si la distance à pied dépend de l'endroit exact où vous dormez — Marina Botafoch est de l'autre côté de l'eau. C'est aussi là que se croisent la plupart des lignes de bus, et là qu'un jour de pluie reste une journée.`,
  ),
}

export const CARLESS_RIDE = {
  name: L('Waar je wél een rit voor nodig hebt', 'What you do need a ride for', 'Wofür du doch eine Fahrt brauchst', 'Para lo que sí necesitas transporte', 'Ce pour quoi il vous faut un trajet'),
  body: (clubs: string): T => L(
    `${clubs} liggen geen van alle in een plaats waar je logeert — landinwaarts, of aan een weg tussen twee dorpen. Regel voor die avonden de terugweg vóórdat je gaat: een geboekte transfer, de discobus die jouw avond rijdt, of een chauffeur die niet drinkt. Overdag geldt hetzelfde voor de westkustbaaien en het noorden.`,
    `${clubs} are in none of the places you stay — inland, or on a road between villages. For those nights, arrange the way back before you go out: a booked transfer, a discobus running your night, or a driver who is not drinking. The same applies by day to the west-coast bays and the north.`,
    `${clubs} liegen an keinem der Orte, an denen du wohnst — im Landesinneren oder an einer Straße zwischen zwei Dörfern. Regle für diese Abende den Rückweg, bevor du losgehst: ein gebuchter Transfer, der Discobus deines Abends, oder ein Fahrer, der nicht trinkt. Tagsüber gilt dasselbe für die Westküstenbuchten und den Norden.`,
    `${clubs} no están en ninguno de los sitios donde te alojas — tierra adentro, o en una carretera entre pueblos. Para esas noches, organiza la vuelta antes de salir: un traslado reservado, el discobus que cubra tu noche, o alguien que conduzca sin beber. De día pasa lo mismo con las calas del oeste y el norte.`,
    `${clubs} ne sont dans aucun des endroits où l'on loge — à l'intérieur des terres, ou sur une route entre deux villages. Pour ces soirées, organisez le retour avant de partir : un transfert réservé, le discobus qui couvre votre soirée, ou un conducteur qui ne boit pas. De jour, cela vaut aussi pour les criques de l'ouest et le nord.`,
  ),
  fallback: L(
    'De westkustbaaien en het noorden van het eiland blijven het argument voor een auto: daar rijdt in de zomer wel een bus heen, maar niet op het tijdstip waarop je terug wilt.',
    'The west-coast bays and the north of the island remain the argument for a car: buses run there in summer, but not at the hour you want to come back.',
    'Die Westküstenbuchten und der Norden der Insel bleiben das Argument für ein Auto: Dorthin fährt im Sommer zwar ein Bus, aber nicht zu der Zeit, zu der du zurückwillst.',
    'Las calas del oeste y el norte de la isla siguen siendo el argumento a favor del coche: en verano hay autobús, pero no a la hora a la que quieres volver.',
    "Les criques de l'ouest et le nord de l'île restent l'argument pour la voiture : un bus y va l'été, mais pas à l'heure où vous voulez rentrer.",
  ),
}

export const H_RIDE_HOME: T = L(
  'De rit naar huis bepaalt alles',
  'The ride home decides everything',
  'Die Rückfahrt entscheidet alles',
  'La vuelta a casa lo decide todo',
  'Le retour décide de tout',
)

export const RIDE_HOME: T[] = [
  L(
    'Elke vervoersbeslissing op dit eiland is eigenlijk een beslissing over zes uur ’s ochtends. Overdag werkt alles — de bussen rijden, er zijn taxi’s, de wegen zijn rustig genoeg. Bij sluitingstijd verlaten een paar duizend mensen tegelijk één gebouw, en wie er vooraf niet over nagedacht heeft staat er veertig minuten later nog.',
    'Every transport decision on this island is really a decision about six in the morning. In daylight everything works — the buses run, taxis are available, the roads are quiet enough. At closing time, several thousand people leave one building at once, and the ones who did not think about it beforehand are the ones still standing there forty minutes later.',
    'Jede Verkehrsentscheidung auf dieser Insel ist eigentlich eine Entscheidung über sechs Uhr morgens. Tagsüber funktioniert alles — die Busse fahren, es gibt Taxis, die Straßen sind ruhig genug. Zur Sperrstunde verlassen mehrere tausend Menschen gleichzeitig ein Gebäude, und wer vorher nicht daran gedacht hat, steht vierzig Minuten später noch da.',
    'Cada decisión de transporte en esta isla es en realidad una decisión sobre las seis de la mañana. De día todo funciona — hay autobuses, hay taxis, las carreteras están tranquilas. A la hora de cierre, varios miles de personas salen a la vez de un mismo edificio, y quien no lo pensó antes sigue ahí cuarenta minutos después.',
    "Chaque décision de transport sur cette île est en réalité une décision sur six heures du matin. En journée tout fonctionne — les bus circulent, il y a des taxis, les routes sont assez calmes. À la fermeture, plusieurs milliers de personnes sortent d'un même bâtiment en même temps, et ceux qui n'y avaient pas pensé sont encore là quarante minutes plus tard.",
  ),
  L(
    'Dat telt het zwaarst bij de clubs die aan een weg tussen twee dorpen liggen in plaats van in een dorp. Die zalen hebben parkeerruimte en plek, en juist daarom kunnen ze draaien wat ze draaien — maar er is niets omheen dat te lopen valt, en het taxi-aanbod om zes uur is eindig. Een vooraf geboekte terugrit, een discobus die jouw avond rijdt, of één persoon die niet drinkt: dat zijn de drie antwoorden. Alle drie neem je bij daglicht.',
    'This matters most for the clubs that sit on a road between two towns rather than inside one. Those venues have parking and space, which is why they can run the rooms they do, but nothing around them is walkable and the taxi supply at six is finite. A pre-booked return, a discobus running your night, or one person who is not drinking are the three answers. All three are decisions to make in daylight.',
    'Am meisten zählt das bei den Clubs, die an einer Straße zwischen zwei Orten liegen statt in einem. Diese Locations haben Parkplätze und Platz, deshalb können sie überhaupt so große Räume betreiben — aber drumherum ist nichts zu Fuß erreichbar, und das Taxiangebot um sechs ist endlich. Eine vorab gebuchte Rückfahrt, ein Discobus für deinen Abend, oder eine Person, die nicht trinkt: das sind die drei Antworten. Alle drei entscheidest du bei Tageslicht.',
    'Esto pesa sobre todo en los clubs que están en una carretera entre dos pueblos y no dentro de uno. Esos locales tienen aparcamiento y espacio, y por eso pueden montar las salas que montan, pero alrededor no hay nada que se pueda hacer andando y los taxis a las seis son finitos. Una vuelta reservada, un discobus que cubra tu noche, o una persona que no beba: esas son las tres respuestas. Las tres se deciden de día.',
    "Cela compte surtout pour les clubs situés sur une route entre deux villages plutôt que dans l'un d'eux. Ces lieux ont du parking et de la place, c'est pour cela qu'ils peuvent exploiter de telles salles — mais rien autour n'est accessible à pied, et l'offre de taxis à six heures est limitée. Un retour réservé, un discobus qui couvre votre soirée, ou une personne qui ne boit pas : voilà les trois réponses. Toutes trois se décident de jour.",
  ),
  L(
    'Het gevolg is dat waar je slaapt óók een vervoersbeslissing is. Vanuit Playa d’en Bossa en Ibiza-Stad kun je van minstens een deel van de grote avonden naar huis lopen; vanuit San Antonio en de rest niet. Dat ene feit verandert de werkelijke kosten van een week meer dan het verschil tussen twee hotels.',
    'The corollary is that where you stay is a transport decision too. Playa d’en Bossa and Ibiza Town let you walk home from at least some of the big nights; San Antonio and everywhere else do not. That single fact changes the real cost of a week more than the difference between two hotels does.',
    'Die Folge ist, dass auch die Unterkunft eine Verkehrsentscheidung ist. Von Playa d’en Bossa und Ibiza-Stadt kommst du von zumindest einigen der großen Nächte zu Fuß nach Hause; von San Antonio und überall sonst nicht. Diese eine Tatsache verändert die realen Kosten einer Woche stärker als der Unterschied zwischen zwei Hotels.',
    'La consecuencia es que dónde te alojas también es una decisión de transporte. Desde Playa d’en Bossa e Ibiza ciudad puedes volver andando de al menos algunas de las noches grandes; desde San Antonio y el resto, no. Ese único dato cambia el coste real de una semana más que la diferencia entre dos hoteles.',
    "La conséquence, c'est que le choix du logement est aussi une décision de transport. Depuis Playa d’en Bossa et Ibiza-ville, on peut rentrer à pied d'au moins une partie des grandes soirées ; depuis San Antonio et ailleurs, non. Ce seul fait change le coût réel d'une semaine plus que l'écart entre deux hôtels.",
  ),
]

export const H_DRIVING: T = L(
  'Autorijden hier, eerlijk gezegd',
  'Driving here, honestly',
  'Autofahren hier, ehrlich gesagt',
  'Conducir aquí, con franqueza',
  'Conduire ici, franchement',
)

export const DRIVING: T[] = [
  L(
    'De wegen zijn goed en de afstanden kort, dus rijden op Ibiza is op zichzelf makkelijk. Wat niet makkelijk is, is augustus: de hoofdroutes tussen Ibiza-Stad, het vliegveld en San Antonio slikken veel verkeer, en elke derde auto wordt bestuurd door iemand die hem die ochtend heeft opgehaald en op zijn telefoon navigeert.',
    'The roads are good and the distances are short, so driving on Ibiza is easy in itself. What is not easy is August: the main routes between Ibiza Town, the airport and San Antonio carry a lot of traffic, and every third car is being driven by someone who collected it that morning and is navigating by phone.',
    'Die Straßen sind gut und die Entfernungen kurz, Autofahren auf Ibiza ist an sich also einfach. Nicht einfach ist der August: Die Hauptrouten zwischen Ibiza-Stadt, Flughafen und San Antonio tragen viel Verkehr, und jedes dritte Auto fährt jemand, der es am Morgen abgeholt hat und per Handy navigiert.',
    'Las carreteras son buenas y las distancias cortas, así que conducir en Ibiza es fácil en sí. Lo que no es fácil es agosto: las rutas principales entre Ibiza ciudad, el aeropuerto y San Antonio soportan mucho tráfico, y uno de cada tres coches lo conduce alguien que lo recogió esa mañana y navega con el móvil.',
    "Les routes sont bonnes et les distances courtes : conduire à Ibiza est facile en soi. Ce qui ne l'est pas, c'est août : les axes principaux entre Ibiza-ville, l'aéroport et San Antonio supportent beaucoup de trafic, et une voiture sur trois est conduite par quelqu'un qui l'a récupérée le matin même et navigue au téléphone.",
  ),
  L(
    'Parkeren is de echte belasting. Ibiza-Stad ’s avonds en de zonsondergangstrip van San Antonio zijn allebei een project, en de populaire westkuststranden lopen in het hoogseizoen tegen het eind van de ochtend vol. Reken op twintig minuten aan beide kanten in plaats van de rijtijd als de reis te zien.',
    'Parking is the real tax. Ibiza Town in the evening and San Antonio on the sunset strip are both projects, and the popular west-coast beaches fill by late morning in peak season. Budget twenty minutes at each end rather than treating the drive time as the journey.',
    'Parken ist die eigentliche Steuer. Ibiza-Stadt am Abend und die Sunset-Strip von San Antonio sind beides Projekte, und die beliebten Westküstenstrände sind in der Hochsaison am späten Vormittag voll. Rechne mit zwanzig Minuten an beiden Enden, statt die Fahrzeit für die Reise zu halten.',
    'El aparcamiento es el impuesto de verdad. Ibiza ciudad por la tarde y la strip del atardecer en San Antonio son proyectos, y las playas populares del oeste se llenan a media mañana en temporada alta. Cuenta veinte minutos en cada extremo en vez de tomar el tiempo de conducción como el viaje.',
    "Le stationnement est la vraie taxe. Ibiza-ville le soir et la strip du coucher de soleil à San Antonio sont deux chantiers, et les plages populaires de l'ouest se remplissent en fin de matinée en haute saison. Comptez vingt minutes à chaque bout plutôt que de prendre le temps de route pour le trajet.",
  ),
  L(
    'En het voor de hand liggende dat toch gezegd moet worden: een huurauto en een clubavond zijn twee plannen die niet samengaan tenzij iemand zich heeft opgeworpen om niet te drinken. De Spaanse limiet ligt lager dan veel bezoekers denken, er wordt gecontroleerd, en "het is maar een klein stukje" is precies de redenering die hier misgaat.',
    'And the obvious one that still needs saying: a hire car and a club night are two plans that do not combine unless somebody has volunteered not to drink. The Spanish limit is lower than many visitors assume, checks do happen, and "it is a short drive" is exactly the reasoning that goes wrong here.',
    'Und das Offensichtliche, das trotzdem gesagt werden muss: Ein Mietwagen und eine Clubnacht sind zwei Pläne, die sich nicht verbinden lassen, wenn sich niemand freiwillig zum Nichttrinken gemeldet hat. Die spanische Grenze liegt niedriger, als viele Besucher annehmen, es wird kontrolliert, und "es ist doch nur ein kurzes Stück" ist genau die Überlegung, die hier schiefgeht.',
    'Y lo evidente que aun así hay que decir: un coche de alquiler y una noche de club son dos planes que no encajan salvo que alguien se ofrezca a no beber. El límite español es más bajo de lo que muchos visitantes suponen, sí hay controles, y "si es un momento" es exactamente el razonamiento que aquí sale mal.',
    "Et l'évidence qu'il faut quand même dire : une voiture de location et une soirée en club sont deux plans qui ne se combinent pas, sauf si quelqu'un s'est porté volontaire pour ne pas boire. La limite espagnole est plus basse que ne le supposent beaucoup de visiteurs, il y a des contrôles, et « c'est juste à côté » est exactement le raisonnement qui tourne mal ici.",
  ),
]

export const CTA_BODY: T = L(
  'Stuur Simon waar je verblijft en wat je die week wilt doen, dan zegt hij of je überhaupt een auto nodig hebt — ook als het antwoord is dat je die niet nodig hebt. Hij regelt ook privétransfers, en de terugrit van een club bij sluitingstijd is de rit die je vooraf wilt boeken.',
  'Send Simon where you are staying and what you want to do that week, and he will tell you whether you need a car at all — including when the answer is that you do not. He also arranges private transfers, and the return from a club at closing time is the one worth booking in advance.',
  'Schick Simon, wo du wohnst und was du in der Woche vorhast, dann sagt er dir, ob du überhaupt ein Auto brauchst — auch wenn die Antwort lautet, dass du keines brauchst. Er organisiert auch private Transfers, und die Rückfahrt von einem Club zur Sperrstunde ist die, die man vorher bucht.',
  'Dile a Simon dónde te alojas y qué quieres hacer esa semana, y te dirá si necesitas coche siquiera — también cuando la respuesta es que no. También gestiona traslados privados, y la vuelta desde un club a la hora de cierre es la que conviene reservar antes.',
  "Dites à Simon où vous logez et ce que vous voulez faire cette semaine : il vous dira si vous avez besoin d'une voiture — y compris quand la réponse est non. Il organise aussi des transferts privés, et le retour d'un club à la fermeture est celui qu'on réserve à l'avance.",
)
export const CTA_PREFILL: T = L(
  'Hoi Simon, vraag over vervoer op Ibiza — ik verblijf in ',
  "Hi Simon, question about getting around Ibiza — I'm staying in ",
  'Hallo Simon, Frage zur Fortbewegung auf Ibiza — ich wohne in ',
  'Hola Simon, una pregunta sobre moverse por Ibiza — me alojo en ',
  'Salut Simon, une question sur les déplacements à Ibiza — je loge à ',
)

export const FAQS: { q: T; a: T }[] = [
  {
    q: L('Heb ik een auto nodig op Ibiza?', 'Do I need a car in Ibiza?', 'Brauche ich auf Ibiza ein Auto?', '¿Necesito coche en Ibiza?', "Ai-je besoin d'une voiture à Ibiza ?"),
    a: L(
      'Het hangt van één ding af: verlaat je je verblijf meer dan twee keer per dag. Zit je in Playa d’en Bossa of Ibiza-Stad en ga je elke avond uit, dan is een auto een parkeerprobleem waar je voor betaalt. Zit je in het noorden, in Santa Eulalia, of wil je vanaf daar de westkuststranden bereiken, dan is een auto binnen ongeveer twee dagen goedkoper dan de taxi’s die hij vervangt.',
      'It depends on one thing: whether you will leave your resort more than twice a day. Staying in Playa d\'en Bossa or Ibiza Town and clubbing every night, a car is a parking problem you are paying for. Staying in the north, in Santa Eulalia, or anywhere you want to reach the west-coast beaches from, a car is cheaper than the taxis it replaces within about two days.',
      'Es hängt an einer Sache: Verlässt du deine Unterkunft mehr als zweimal am Tag? Wohnst du in Playa d’en Bossa oder Ibiza-Stadt und gehst jeden Abend aus, ist ein Auto ein Parkproblem, für das du zahlst. Wohnst du im Norden, in Santa Eulalia oder irgendwo, von wo aus du die Westküstenstrände erreichen willst, ist ein Auto binnen etwa zwei Tagen günstiger als die Taxis, die es ersetzt.',
      'Depende de una sola cosa: si vas a salir de tu alojamiento más de dos veces al día. Si te alojas en Playa d’en Bossa o Ibiza ciudad y sales cada noche, el coche es un problema de aparcamiento por el que pagas. Si te alojas en el norte, en Santa Eulalia, o en cualquier sitio desde el que quieras llegar a las playas del oeste, el coche sale más barato que los taxis que sustituye en unos dos días.',
      "Cela tient à une chose : quitterez-vous votre hébergement plus de deux fois par jour ? Si vous logez à Playa d’en Bossa ou Ibiza-ville et sortez chaque soir, la voiture est un problème de stationnement que vous payez. Si vous logez au nord, à Santa Eulalia, ou partout d'où vous voulez rejoindre les plages de l'ouest, la voiture revient moins cher que les taxis qu'elle remplace en deux jours environ.",
    ),
  },
  {
    q: L('Hoe groot is Ibiza en hoe lang doe je over het eiland?', 'How big is Ibiza and how long does it take to cross?', 'Wie groß ist Ibiza und wie lange dauert die Durchquerung?', '¿Cómo de grande es Ibiza y cuánto se tarda en cruzarla?', "Quelle est la taille d'Ibiza et combien de temps pour la traverser ?"),
    a: L(
      'Klein genoeg dat niets verder dan ongeveer 45 minuten weg is, en groot genoeg dat het verschil om zes uur ’s ochtends telt. Ibiza-Stad naar San Antonio is ruwweg een half uur, het vliegveld naar Ibiza-Stad zo’n vijftien tot twintig minuten, en de noordkust vanaf beide steden zo’n 40 tot 45 minuten over tragere wegen.',
      'Small enough that nothing is more than about 45 minutes away, and big enough that the difference matters at six in the morning. Ibiza Town to San Antonio is roughly half an hour, the airport to Ibiza Town about fifteen to twenty minutes, and the north coast from either town is around 40 to 45 minutes on slower roads.',
      'Klein genug, dass nichts weiter als etwa 45 Minuten entfernt ist, und groß genug, dass der Unterschied um sechs Uhr morgens zählt. Ibiza-Stadt nach San Antonio dauert etwa eine halbe Stunde, der Flughafen nach Ibiza-Stadt fünfzehn bis zwanzig Minuten, und die Nordküste von beiden Städten rund 40 bis 45 Minuten auf langsameren Straßen.',
      'Lo bastante pequeña para que nada esté a más de unos 45 minutos, y lo bastante grande para que la diferencia cuente a las seis de la mañana. De Ibiza ciudad a San Antonio hay media hora larga, del aeropuerto a Ibiza ciudad unos quince o veinte minutos, y la costa norte queda a unos 40-45 minutos desde cualquiera de las dos por carreteras más lentas.',
      "Assez petite pour que rien ne soit à plus de 45 minutes environ, et assez grande pour que l'écart compte à six heures du matin. D'Ibiza-ville à San Antonio, comptez une demi-heure, de l'aéroport à Ibiza-ville quinze à vingt minutes, et la côte nord à 40-45 minutes depuis l'une ou l'autre par des routes plus lentes.",
    ),
  },
  {
    q: L('Rijden er bussen op Ibiza?', 'Are there buses in Ibiza?', 'Gibt es Busse auf Ibiza?', '¿Hay autobuses en Ibiza?', 'Y a-t-il des bus à Ibiza ?'),
    a: L(
      'Ja, en ze zijn echt bruikbaar op de hoofdroutes tussen Ibiza-Stad, San Antonio, Santa Eulalia en het vliegveld, met in de zomer extra diensten naar de drukkere stranden. Lijnnummers en dienstregelingen wisselen per seizoen, dus raadpleeg de actuele dienstregeling en geen oude blog. Wat telt voor een avond uit is de laatste rit, niet de prijs.',
      'Yes, and they are genuinely useful for the main routes between Ibiza Town, San Antonio, Santa Eulalia and the airport, with extra seasonal routes to the busier beaches in summer. Line numbers and timetables change between seasons, so check the current schedule rather than an old blog. The thing that matters for a night out is the last departure, not the fare.',
      'Ja, und sie sind auf den Hauptrouten zwischen Ibiza-Stadt, San Antonio, Santa Eulalia und dem Flughafen wirklich nützlich, im Sommer mit zusätzlichen Linien zu den volleren Stränden. Liniennummern und Fahrpläne ändern sich je Saison, prüfe also den aktuellen Fahrplan und keinen alten Blog. Für einen Abend zählt die letzte Abfahrt, nicht der Preis.',
      'Sí, y son de verdad útiles en las rutas principales entre Ibiza ciudad, San Antonio, Santa Eulalia y el aeropuerto, con líneas extra de temporada a las playas con más gente. Los números de línea y los horarios cambian según la temporada, así que consulta el horario actual y no un blog antiguo. Para una noche fuera lo que importa es la última salida, no el precio.',
      "Oui, et ils sont vraiment utiles sur les axes principaux entre Ibiza-ville, San Antonio, Santa Eulalia et l'aéroport, avec des lignes saisonnières supplémentaires vers les plages les plus fréquentées l'été. Les numéros de ligne et les horaires changent selon la saison : consultez l'horaire en cours plutôt qu'un vieux blog. Pour une soirée, ce qui compte est le dernier départ, pas le tarif.",
    ),
  },
  {
    q: L('Hoe kom ik om zes uur ’s ochtends thuis vanaf een club?', 'How do I get home from a club at six in the morning?', 'Wie komme ich um sechs Uhr morgens vom Club nach Hause?', '¿Cómo vuelvo a casa desde un club a las seis de la mañana?', "Comment rentrer d'un club à six heures du matin ?"),
    a: L(
      'Beslis dat vóór je gaat. Taxi’s bij sluitingstijd zijn een rij en geen zekerheid, vooral bij de clubs die aan een weg tussen twee dorpen liggen. De betrouwbare opties zijn een vooraf geboekte terugrit, een discobus die jouw avond rijdt, of een aangewezen chauffeur. Improviseren om zes uur ’s ochtends is de dure versie, en het overkomt in elke groep iemand.',
      'Decide before you go out. Taxis at closing time are a queue rather than a given, especially at the clubs that sit on a road between towns rather than in one. The reliable options are a pre-booked return, a discobus service running your night, or a designated driver. Improvising at six in the morning is the expensive version and it happens to somebody in every group.',
      'Entscheide das, bevor du losgehst. Taxis zur Sperrstunde sind eine Schlange und keine Selbstverständlichkeit, besonders bei den Clubs, die an einer Straße zwischen zwei Orten liegen. Verlässlich sind eine vorab gebuchte Rückfahrt, ein Discobus für deinen Abend, oder ein Fahrer, der nüchtern bleibt. Um sechs Uhr morgens zu improvisieren ist die teure Variante, und es trifft in jeder Gruppe jemanden.',
      'Decídelo antes de salir. Los taxis a la hora de cierre son una cola, no una garantía, sobre todo en los clubs que están en una carretera entre pueblos. Lo fiable es una vuelta reservada, un discobus que cubra tu noche, o un conductor designado. Improvisar a las seis de la mañana es la versión cara, y le pasa a alguien en todos los grupos.',
      "Décidez-le avant de sortir. Les taxis à la fermeture, c'est une file d'attente et pas une certitude, surtout aux clubs situés sur une route entre deux villages. Les options fiables sont un retour réservé, un discobus couvrant votre soirée, ou un conducteur désigné. Improviser à six heures du matin est la version chère, et cela arrive à quelqu'un dans chaque groupe.",
    ),
  },
  {
    q: L('Kan ik Uber of Bolt gebruiken op Ibiza?', 'Can I use Uber or Bolt in Ibiza?', 'Kann ich auf Ibiza Uber oder Bolt nutzen?', '¿Puedo usar Uber o Bolt en Ibiza?', 'Puis-je utiliser Uber ou Bolt à Ibiza ?'),
    a: L(
      'Bouw er geen plan op. De dekking van ritdiensten op het eiland is beperkt en seizoensgebonden, en het is geen vervanging van de taxistandplaats of een geboekte transfer zoals in een stad op het vasteland. Waar een wachtende auto er echt toe doet — een late aankomst, een club aan een weg — boek je hem vooraf in plaats van aan te nemen dat een app antwoordt.',
      'Do not build a plan around it. Ride-hailing coverage on the island is limited and seasonal, and it is not a substitute for the taxi rank or a booked transfer the way it is in a mainland city. Where having a car waiting actually matters — a late arrival, a club on a road location — book it in advance instead of assuming an app will answer.',
      'Bau keinen Plan darauf. Die Abdeckung von Fahrdiensten auf der Insel ist begrenzt und saisonal, und sie ersetzt weder den Taxistand noch einen gebuchten Transfer wie in einer Stadt auf dem Festland. Wo ein wartendes Auto wirklich zählt — späte Ankunft, Club an einer Landstraße — buchst du es vorher, statt darauf zu setzen, dass eine App antwortet.',
      'No montes un plan sobre eso. La cobertura de las apps de transporte en la isla es limitada y estacional, y no sustituye a la parada de taxis ni a un traslado reservado como en una ciudad peninsular. Donde de verdad importa tener un coche esperando — una llegada tarde, un club en carretera — resérvalo antes en vez de dar por hecho que una app responderá.',
      "N'y adossez pas votre plan. La couverture des VTC sur l'île est limitée et saisonnière, et elle ne remplace ni la station de taxis ni un transfert réservé comme dans une ville du continent. Là où avoir une voiture qui attend compte vraiment — une arrivée tardive, un club en bord de route — réservez à l'avance plutôt que de supposer qu'une application répondra.",
    ),
  },
  {
    q: L('Scooter of quad huren?', 'Should I rent a scooter or a quad?', 'Roller oder Quad mieten?', '¿Alquilo moto o quad?', 'Louer un scooter ou un quad ?'),
    a: L(
      'Een scooter is goedkoop, parkeert overal en is bij daglicht echt prettig op de kustwegen. Hij zet je ook op een weg die je deelt met huurauto’s bestuurd door mensen die die ochtend zijn aangekomen, ’s nachts, mogelijk na een lange dag in de zon. Het grootste deel van het eiland rijdt prima; het argument tegen een scooter hier zijn de anderen, niet de wegen.',
      'A scooter is cheap, parks anywhere and is genuinely pleasant on the coast roads in daylight. It also puts you on a road shared with hire cars driven by people who arrived that morning, at night, possibly after a long day in the sun. Most of the island is fine to drive; the argument against a scooter here is other people, not the roads.',
      'Ein Roller ist günstig, parkt überall und macht auf den Küstenstraßen bei Tageslicht wirklich Freude. Er setzt dich aber auch auf eine Straße, die du dir nachts mit Mietwagen teilst, gefahren von Leuten, die am Morgen angekommen sind, womöglich nach einem langen Tag in der Sonne. Der Großteil der Insel fährt sich gut; das Gegenargument sind hier die anderen, nicht die Straßen.',
      'La moto es barata, aparca en cualquier sitio y de día es un gusto en las carreteras de costa. También te pone en una vía compartida de noche con coches de alquiler conducidos por gente que llegó esa mañana, quizá tras un día largo al sol. Casi toda la isla se conduce bien; el argumento en contra de la moto aquí son los demás, no las carreteras.',
      "Un scooter est bon marché, se gare partout et est vraiment agréable sur les routes côtières de jour. Il vous met aussi, la nuit, sur une route partagée avec des voitures de location conduites par des gens arrivés le matin même, peut-être après une longue journée au soleil. La majeure partie de l'île se conduit bien ; l'argument contre le scooter ici, ce sont les autres, pas les routes.",
    ),
  },
  {
    q: L('En hoe kom ik op Formentera?', 'What about getting to Formentera?', 'Und wie komme ich nach Formentera?', '¿Y cómo se llega a Formentera?', 'Et pour aller à Formentera ?'),
    a: L(
      'Alleen over zee — Formentera heeft geen vliegveld, en de snelle ferry vanaf Ibiza doet er ongeveer dertig minuten over. Dat maakt het een dagtocht en geen tussenstop, en het is een van de weinige ritten hier waarbij de boot het vervoer is en niet de activiteit. Onze Formentera-ferrypagina behandelt de rederijen en de overtochten.',
      'By sea only — Formentera has no airport, and the fast ferry from Ibiza takes roughly thirty minutes. That makes it a day trip rather than a detour, and it is one of the few journeys here where the boat is the transport rather than the activity. Our Formentera ferry page covers the operators and crossings.',
      'Nur über das Meer — Formentera hat keinen Flughafen, und die Schnellfähre ab Ibiza braucht rund dreißig Minuten. Das macht es zu einem Tagesausflug statt einem Abstecher, und es ist eine der wenigen Fahrten hier, bei denen das Boot das Verkehrsmittel ist und nicht die Aktivität. Unsere Formentera-Fährseite behandelt die Reedereien und Überfahrten.',
      'Solo por mar — Formentera no tiene aeropuerto, y el ferry rápido desde Ibiza tarda unos treinta minutos. Eso lo convierte en una excursión de un día y no en un desvío, y es uno de los pocos trayectos aquí en los que el barco es el transporte y no la actividad. Nuestra página del ferry a Formentera cubre las navieras y las travesías.',
      "Par la mer uniquement — Formentera n'a pas d'aéroport, et le ferry rapide depuis Ibiza met environ trente minutes. Cela en fait une excursion à la journée plutôt qu'un détour, et c'est l'un des rares trajets ici où le bateau est le transport et non l'activité. Notre page sur le ferry pour Formentera couvre les compagnies et les traversées.",
    ),
  },
  {
    q: L('Is parkeren lastig op Ibiza?', 'Is parking difficult in Ibiza?', 'Ist Parken auf Ibiza schwierig?', '¿Es difícil aparcar en Ibiza?', 'Le stationnement est-il difficile à Ibiza ?'),
    a: L(
      'In Ibiza-Stad en San Antonio op een zomeravond wel, en bij de haven is het een project op zich. Stranden verschillen: de populaire westkustbaaien lopen in augustus tegen het eind van de ochtend vol. Dit is de werkelijke kostenpost van een huurauto en zelden degene waar mensen op rekenen — niet het huurtarief, maar de twintig minuten aan beide kanten.',
      'In Ibiza Town and San Antonio on a summer evening, yes, and near the harbour it is its own project. Beaches vary: the popular west-coast bays fill by late morning in August. This is the real cost of a hire car and it is rarely the one people budget for — not the rental rate, the twenty minutes at each end.',
      'In Ibiza-Stadt und San Antonio an einem Sommerabend ja, und am Hafen ist es ein eigenes Projekt. Bei den Stränden ist es unterschiedlich: Die beliebten Westküstenbuchten sind im August am späten Vormittag voll. Das ist der eigentliche Preis eines Mietwagens und selten der, mit dem gerechnet wird — nicht der Mietpreis, sondern die zwanzig Minuten an beiden Enden.',
      'En Ibiza ciudad y San Antonio una tarde de verano, sí, y junto al puerto es un proyecto en sí mismo. Las playas varían: las calas populares del oeste se llenan a media mañana en agosto. Este es el coste real de un coche de alquiler y rara vez el que la gente presupuesta — no la tarifa, sino los veinte minutos en cada extremo.',
      "À Ibiza-ville et San Antonio un soir d'été, oui, et près du port c'est un projet en soi. Pour les plages, cela varie : les criques populaires de l'ouest se remplissent en fin de matinée en août. C'est le vrai coût d'une voiture de location, et rarement celui qu'on budgète — pas le tarif, mais les vingt minutes à chaque bout.",
    ),
  },
]

export const H_LINKS: T = L('Gerelateerde pagina’s', 'Related pages', 'Verwandte Seiten', 'Páginas relacionadas', 'Pages liées')

export const LINKS: { key: string; localized: boolean; label: T; body: T }[] = [
  {
    key: 'airport-transfer', localized: true,
    label: L('Luchthaventransfer Ibiza', 'Ibiza airport transfers', 'Ibiza Flughafentransfer', 'Traslados aeropuerto Ibiza', "Transferts aéroport d'Ibiza"),
    body: L('Het eerste uur: taxistandplaats, bus, privétransfer of huurauto.', 'The first hour: taxi rank, bus, private transfer or hire car.', 'Die erste Stunde: Taxistand, Bus, Privattransfer oder Mietwagen.', 'La primera hora: parada de taxis, bus, traslado privado o coche.', "La première heure : station de taxis, bus, transfert privé ou voiture."),
  },
  {
    key: 'car-rental', localized: true,
    label: L('Auto huren op Ibiza', 'Car rental in Ibiza', 'Mietwagen auf Ibiza', 'Alquiler de coches en Ibiza', 'Location de voiture à Ibiza'),
    body: L('All-in huren via Wiber, vijf minuten van de terminal.', 'All-inclusive hire through Wiber, five minutes from the terminal.', 'All-inclusive-Miete über Wiber, fünf Minuten vom Terminal.', 'Alquiler todo incluido con Wiber, a cinco minutos de la terminal.', "Location tout compris via Wiber, à cinq minutes du terminal."),
  },
  {
    key: 'nightlife-guide', localized: true,
    label: L('Uitgaansgids Ibiza', 'Ibiza nightlife guide', 'Ibiza Nachtleben-Guide', 'Guía de vida nocturna en Ibiza', 'Guide de la vie nocturne à Ibiza'),
    body: L('Hoe de avond verloopt, en waarom de terugreis ertoe doet.', 'How the night runs, and why the return journey matters.', 'Wie der Abend abläuft und warum die Rückfahrt zählt.', 'Cómo va la noche y por qué importa la vuelta.', "Comment se déroule la soirée, et pourquoi le retour compte."),
  },
  {
    key: 'ferry-formentera', localized: false,
    label: L('Ferry naar Formentera', 'Formentera ferry', 'Fähre nach Formentera', 'Ferry a Formentera', 'Ferry pour Formentera'),
    body: L('Dertig minuten over zee, en de enige manier om er te komen.', 'Thirty minutes by sea, and the only way there.', 'Dreißig Minuten über See, und der einzige Weg dorthin.', 'Treinta minutos por mar, y la única forma de llegar.', "Trente minutes par la mer, et le seul moyen d'y aller."),
  },
  {
    key: 'locations', localized: false,
    label: L('Gebieden op Ibiza', 'Ibiza areas', 'Gebiete auf Ibiza', 'Zonas de Ibiza', "Zones d'Ibiza"),
    body: L('Waar je je basis kiest, en wat dat kost aan reistijd.', 'Where to base yourself, and what that costs in travel time.', 'Wo du dich einquartierst und was das an Fahrzeit kostet.', 'Dónde alojarte y lo que cuesta en tiempo de viaje.', "Où s'installer, et ce que cela coûte en temps de trajet."),
  },
  {
    key: 'tips', localized: false,
    label: L('Ibiza tips', 'Ibiza tips', 'Ibiza Tipps', 'Consejos de Ibiza', 'Conseils Ibiza'),
    body: L('Praktisch eilandadvies van het lokale team.', 'Practical island advice from the local team.', 'Praktische Inseltipps vom Team vor Ort.', 'Consejos prácticos del equipo local.', "Conseils pratiques de l'équipe sur place."),
  },
]

export const BYLINE_TOPIC: T = L(
  'vervoer op Ibiza',
  'getting around Ibiza',
  'Fortbewegung auf Ibiza',
  'cómo moverse por Ibiza',
  'les déplacements à Ibiza',
)
