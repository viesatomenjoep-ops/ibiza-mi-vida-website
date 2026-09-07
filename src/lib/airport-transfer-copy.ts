import type { Locale } from '@/lib/seo'

/**
 * Luchthaventransfer Ibiza, vijf talen.
 *
 * Vierde in de reeks. Zelfde opzet als dress-code-, getting-around- en
 * nightlife-copy: één structuur, vijf keer de tekst, en de routebestanden
 * lezen de taal uit `params.locale`.
 *
 * ── Wat hier bewust ontbreekt ─────────────────────────────────────────────
 * Geen taxitarieven en geen buslijnnummers, in geen enkele taal. Allebei
 * kennen ze seizoens- en nachttoeslagen en veranderen ze tussen zomers; een
 * hardgecodeerd bedrag is binnen één seizoen onwaar en blijft dan jaren staan.
 * Afstanden en reistijden zijn wél stabiel. De ontbrekende cijfers staan als
 * [[VERIFY]] in docs/seo/NIGHT-REPORT.md; zodra Simon ze bevestigt komt hier
 * een PriceTable met echte rijen.
 *
 * ── Eén clubnaam eruit ────────────────────────────────────────────────────
 * De Engelse tekst noemde Amnesia twee keer als voorbeeld van "een club aan de
 * weg naar San Antonio". Die club zit nog achter een afspraak
 * (src/lib/pending-venues.ts) en heeft daarom een pagina die met opzet 404't —
 * hem in vier extra talen als voorbeeld opvoeren zou die keuze in vier extra
 * talen tegenspreken. De zin doet het net zo goed zonder naam: het gaat om de
 * ligging, niet om de club.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface NamedCopy { name: T; body: T }

export const META_TITLE: T = L(
  'Ibiza luchthaven — transfers en taxi’s',
  'Ibiza Airport Transfers & Taxis',
  'Ibiza Flughafen — Transfers und Taxis',
  'Aeropuerto de Ibiza: traslados y taxis',
  "Aéroport d'Ibiza — transferts et taxis",
)

/** 140-160 tekens. */
export const META_DESC: T = L(
  'Van de luchthaven van Ibiza naar je hotel: taxi, bus, vooraf geboekte transfer of huurauto, en welke past bij je aankomsttijd en het aantal personen.',
  'Getting from Ibiza airport to your hotel: taxi, bus, pre-booked transfer or hire car, and which one is right for your arrival time and group size.',
  'Vom Flughafen Ibiza zum Hotel: Taxi, Bus, vorab gebuchter Transfer oder Mietwagen — und was zu deiner Ankunftszeit und Gruppengröße am besten passt.',
  'Del aeropuerto de Ibiza a tu hotel: taxi, autobús, traslado privado reservado o coche de alquiler, y cuál encaja con tu hora de llegada y tu grupo.',
  "De l'aéroport d'Ibiza à votre hôtel : taxi, bus, transfert réservé ou voiture, et lequel convient à votre heure d'arrivée et à votre groupe.",
)

export const OG_DESC: T = L(
  'Vier manieren de terminal uit, en welke bij jouw aankomst past.',
  'Four ways out of Ibiza airport, and which one fits your arrival.',
  'Vier Wege aus dem Terminal, und welcher zu deiner Ankunft passt.',
  'Cuatro formas de salir de la terminal y cuál encaja con tu llegada.',
  "Quatre façons de sortir du terminal, et laquelle convient à votre arrivée.",
)

export const CRUMB_SELF: T = L('Luchthaventransfer Ibiza', 'Ibiza airport transfers', 'Ibiza Flughafentransfer', 'Traslados aeropuerto de Ibiza', "Transferts aéroport d'Ibiza")

export const H1: T = L(
  'Ibiza luchthaventransfer — taxi, bus, privé of huurauto',
  'Ibiza Airport Transfers — Taxi, Bus, Private or Hire Car',
  'Ibiza Flughafentransfer — Taxi, Bus, privat oder Mietwagen',
  'Traslados aeropuerto de Ibiza: taxi, bus, privado o coche',
  "Transferts aéroport d'Ibiza — taxi, bus, privé ou voiture",
)

export const LEAD_1: T = L(
  'De luchthaven van Ibiza ligt ongeveer zeven kilometer van Ibiza-Stad — vijftien tot twintig minuten over de weg, en minder naar Playa d’en Bossa. Er zijn vier manieren om de terminal uit te komen: de taxistandplaats bij aankomst, een vooraf geboekte privétransfer, de openbare bus, of een huurauto. Welke de juiste is hangt af van twee dingen: hoe laat je landt en met hoeveel je bent.',
  'Ibiza airport sits about seven kilometres from Ibiza Town — fifteen to twenty minutes by road, and less to Playa d’en Bossa. There are four ways out of the terminal: the taxi rank outside arrivals, a pre-booked private transfer, the public bus, or a hire car. Which one is right comes down to two things: what time you land and how many of you there are.',
  'Der Flughafen Ibiza liegt etwa sieben Kilometer von Ibiza-Stadt entfernt — fünfzehn bis zwanzig Minuten über die Straße, nach Playa d’en Bossa weniger. Es gibt vier Wege aus dem Terminal: den Taxistand vor der Ankunft, einen vorab gebuchten Privattransfer, den öffentlichen Bus oder einen Mietwagen. Welcher der richtige ist, hängt an zwei Dingen: wann du landest und mit wie vielen ihr seid.',
  'El aeropuerto de Ibiza está a unos siete kilómetros de Ibiza ciudad — quince o veinte minutos por carretera, y menos hasta Playa d’en Bossa. Hay cuatro formas de salir de la terminal: la parada de taxis a la salida de llegadas, un traslado privado reservado, el autobús público o un coche de alquiler. Cuál es la buena depende de dos cosas: a qué hora aterrizas y cuántos sois.',
  "L'aéroport d'Ibiza se trouve à environ sept kilomètres d'Ibiza-ville — quinze à vingt minutes par la route, et moins jusqu'à Playa d’en Bossa. Il y a quatre façons de sortir du terminal : la station de taxis devant les arrivées, un transfert privé réservé, le bus public, ou une voiture de location. Laquelle convient tient à deux choses : votre heure d'atterrissage et le nombre de personnes.",
)

export const LEAD_2: T = L(
  'We drukken hier bewust geen taxitarieven of buslijnnummers af. Allebei kennen ze seizoens- en nachttoeslagen en allebei veranderen ze tussen zomers, en een verouderd getal op zo’n pagina is erger dan geen getal. Simon bevestigt het werkelijke bedrag voor jouw vlucht vóór je boekt.',
  'We deliberately do not print taxi fares or bus line numbers here. Both carry seasonal and night supplements and both change between summers, and a stale number on a page like this is worse than none. Simon confirms the real figure for your flight before you book.',
  'Wir drucken hier bewusst keine Taxitarife oder Buslinien-Nummern ab. Beide haben Saison- und Nachtzuschläge und beide ändern sich von Sommer zu Sommer, und eine veraltete Zahl auf so einer Seite ist schlimmer als gar keine. Simon bestätigt den echten Betrag für deinen Flug, bevor du buchst.',
  'A propósito no publicamos aquí tarifas de taxi ni números de línea de autobús. Ambos llevan suplementos de temporada y nocturnos y ambos cambian de un verano a otro, y un dato caducado en una página así es peor que ninguno. Simon confirma el importe real para tu vuelo antes de que reserves.',
  "Nous n'imprimons volontairement ici ni tarifs de taxi ni numéros de ligne de bus. Les deux comportent des suppléments saisonniers et de nuit et changent d'un été à l'autre, et un chiffre périmé sur une page comme celle-ci est pire que pas de chiffre. Simon confirme le montant réel pour votre vol avant que vous ne réserviez.",
)

export const H_OPTIONS: T = L('De vier opties', 'The four options', 'Die vier Optionen', 'Las cuatro opciones', 'Les quatre options')

export const OPTIONS: NamedCopy[] = [
  {
    name: L('Taxi van de standplaats', 'Taxi from the rank', 'Taxi vom Stand', 'Taxi de la parada', 'Taxi à la station'),
    body: L(
      'Buiten bij aankomst, geen boeking nodig, werkt voor de meeste aankomsten. Op de meter, met toeslagen die per tijdstip en bagage verschillen. De zwakke plek is de rij na een reeks avondlandingen — twintig minuten vliegtijd kan veertig minuten staan worden.',
      'Outside arrivals, no booking, works for most arrivals. Metered with supplements that vary by time of day and luggage. The weakness is the queue after a bank of evening landings — twenty minutes of flying time can turn into forty minutes of standing.',
      'Draußen vor der Ankunft, ohne Buchung, funktioniert für die meisten Ankünfte. Nach Taxameter, mit Zuschlägen je nach Uhrzeit und Gepäck. Die Schwachstelle ist die Schlange nach einer Welle von Abendlandungen — zwanzig Minuten Flugzeit können zu vierzig Minuten Stehen werden.',
      'A la salida de llegadas, sin reserva, sirve para la mayoría. Con taxímetro y suplementos que varían según la hora y el equipaje. El punto débil es la cola tras una tanda de aterrizajes por la tarde — veinte minutos de vuelo pueden convertirse en cuarenta de pie.',
      "Devant les arrivées, sans réservation, convient à la plupart des arrivées. Au compteur, avec des suppléments selon l'heure et les bagages. Le point faible : la file après une série d'atterrissages en soirée — vingt minutes de vol peuvent devenir quarante minutes debout.",
    ),
  },
  {
    name: L('Vooraf geboekte privétransfer', 'Pre-booked private transfer', 'Vorab gebuchter Privattransfer', 'Traslado privado reservado', 'Transfert privé réservé'),
    body: L(
      'Een chauffeur met je naam, wachtend, tegen een prijs die vaststaat voordat je vliegt. De moeite waard voor groepen, voor wie laat landt, en voor een eerste reis waarbij niemand het eiland kent. Dit is wat Simon via WhatsApp regelt.',
      'A driver with your name, waiting, at a price agreed before you fly. Worth it for groups, for anyone landing late, and for a first trip where nobody knows the island. This is what Simon arranges over WhatsApp.',
      'Ein Fahrer mit deinem Namen, der wartet, zu einem Preis, der vor dem Flug feststeht. Lohnt sich für Gruppen, für späte Landungen und für eine erste Reise, bei der niemand die Insel kennt. Das organisiert Simon per WhatsApp.',
      'Un conductor con tu nombre, esperando, a un precio cerrado antes de volar. Merece la pena para grupos, para quien aterriza tarde, y para un primer viaje en el que nadie conoce la isla. Esto es lo que gestiona Simon por WhatsApp.',
      "Un chauffeur avec votre nom, qui attend, à un prix fixé avant le départ. Utile pour les groupes, pour ceux qui atterrissent tard, et pour un premier séjour où personne ne connaît l'île. C'est ce que Simon organise via WhatsApp.",
    ),
  },
  {
    name: L('Openbare bus', 'Public bus', 'Öffentlicher Bus', 'Autobús público', 'Bus public'),
    body: L(
      'De goedkope optie als je licht reist en naar Ibiza-Stad gaat. Een lijn rijdt het hele jaar naar de stad; een seizoenslijn rijdt in de zomer richting San Antonio. Controleer de actuele dienstregeling — de laatste rit telt zwaarder dan de prijs.',
      'The cheap option if you are travelling light and heading for Ibiza Town. A year-round route serves the town; a seasonal one runs towards San Antonio in summer. Check the current timetable — the last departure matters more than the fare.',
      'Die günstige Option, wenn du leicht reist und nach Ibiza-Stadt willst. Eine Linie fährt ganzjährig in die Stadt; eine Saisonlinie fährt im Sommer Richtung San Antonio. Prüfe den aktuellen Fahrplan — die letzte Abfahrt zählt mehr als der Preis.',
      'La opción barata si viajas ligero y vas a Ibiza ciudad. Una línea cubre la ciudad todo el año; otra de temporada va hacia San Antonio en verano. Consulta el horario actual — la última salida importa más que el precio.',
      "L'option économique si vous voyagez léger et allez vers Ibiza-ville. Une ligne dessert la ville toute l'année ; une ligne saisonnière va vers San Antonio l'été. Vérifiez l'horaire en cours — le dernier départ compte plus que le tarif.",
    ),
  },
  {
    name: L('Huurauto vanaf de luchthaven', 'Hire car from the airport', 'Mietwagen ab Flughafen', 'Coche de alquiler desde el aeropuerto', "Voiture de location à l'aéroport"),
    body: L(
      'De beste keuze als je regelmatig van je verblijf weg wilt, als je in het noorden of aan de westkust zit, of als een club aan de weg naar San Antonio in de planning staat. Het minst nuttig als je aan de strip zit en elke avond uitgaat.',
      'Best value if you will leave your resort regularly, if you are staying in the north or on the west coast, or if a club out on the San Antonio road is in the plan. Least useful if you are on the strip and out every night.',
      'Die beste Wahl, wenn du regelmäßig von deiner Unterkunft weg willst, wenn du im Norden oder an der Westküste wohnst, oder wenn ein Club an der Straße nach San Antonio auf dem Plan steht. Am wenigsten nützlich, wenn du an der Strip wohnst und jeden Abend ausgehst.',
      'La mejor opción si vas a salir de tu alojamiento con frecuencia, si te alojas en el norte o en la costa oeste, o si en el plan entra un club a pie de la carretera de San Antonio. La menos útil si estás en la strip y sales cada noche.',
      "Le meilleur choix si vous quittez régulièrement votre hébergement, si vous logez au nord ou sur la côte ouest, ou si un club sur la route de San Antonio est au programme. Le moins utile si vous êtes sur la strip et sortez chaque soir.",
    ),
  },
]

export const H_WHICH: T = L(
  'Welke past bij jouw aankomst',
  'Which one for your arrival',
  'Welche passt zu deiner Ankunft',
  'Cuál encaja con tu llegada',
  'Laquelle pour votre arrivée',
)

export const WHICH: T[] = [
  L(
    'Land je bij daglicht, met z’n tweeën, en verblijf je in Ibiza-Stad of Playa d’en Bossa: neem de taxi van de standplaats. De rit is kort, de rij is ’s middags te doen, en een rit van een kwartier vooraf boeken is een oplossing voor een probleem dat je niet hebt.',
    'Landing in daylight, two of you, staying in Ibiza Town or Playa d’en Bossa: take the taxi from the rank. The run is short, the queue in the afternoon is manageable, and pre-booking a fifteen-minute journey is a solution to a problem you do not have.',
    'Landest du bei Tageslicht, zu zweit, und wohnst in Ibiza-Stadt oder Playa d’en Bossa: nimm das Taxi vom Stand. Die Strecke ist kurz, die Schlange am Nachmittag machbar, und eine Viertelstundenfahrt vorher zu buchen löst ein Problem, das du nicht hast.',
    'Si aterrizas de día, sois dos y te alojas en Ibiza ciudad o Playa d’en Bossa: coge el taxi de la parada. El trayecto es corto, la cola por la tarde es llevadera, y reservar antes un viaje de quince minutos es resolver un problema que no tienes.',
    "Vous atterrissez de jour, à deux, et logez à Ibiza-ville ou Playa d’en Bossa : prenez le taxi à la station. Le trajet est court, la file l'après-midi est gérable, et réserver à l'avance un trajet d'un quart d'heure résout un problème que vous n'avez pas.",
  ),
  L(
    'Land je na elven ’s avonds, ben je met z’n vieren of meer, of heeft iemand veel bagage: boek vooraf. De avond is precies wanneer aankomsten zich opstapelen, de rij het langst is en de bus voor die dag klaar is. Een transfer die je vanaf de bank boekt kost een bekend bedrag; dezelfde rit die je om twee uur ’s nachts moet regelen niet — en het is altijd één iemand in de groep die dat mag doen.',
    'Landing after eleven at night, or four or more of you, or anyone with a lot of luggage: pre-book. The evening is when arrivals bank up, when the queue is longest and the bus has finished for the day. A transfer booked from your sofa costs a known amount; the same journey negotiated at two in the morning does not, and one member of the group is always the one who ends up sorting it.',
    'Landest du nach elf Uhr abends, seid ihr zu viert oder mehr, oder hat jemand viel Gepäck: buche vorher. Am Abend stauen sich die Ankünfte, die Schlange ist am längsten und der Bus hat Feierabend. Ein Transfer, den du vom Sofa aus buchst, kostet einen bekannten Betrag; dieselbe Fahrt um zwei Uhr nachts auszuhandeln nicht — und es ist immer eine Person aus der Gruppe, die das dann macht.',
    'Si aterrizas después de las once de la noche, sois cuatro o más, o alguien lleva mucho equipaje: reserva antes. La noche es justo cuando se acumulan las llegadas, la cola es más larga y el autobús ya ha terminado. Un traslado reservado desde el sofá cuesta una cifra conocida; el mismo trayecto negociado a las dos de la madrugada no, y siempre hay una persona del grupo que acaba encargándose.',
    "Vous atterrissez après onze heures du soir, vous êtes quatre ou plus, ou quelqu'un a beaucoup de bagages : réservez à l'avance. Le soir, c'est quand les arrivées s'accumulent, que la file est la plus longue et que le bus a fini sa journée. Un transfert réservé depuis votre canapé coûte un montant connu ; le même trajet négocié à deux heures du matin non — et c'est toujours une personne du groupe qui finit par s'en charger.",
  ),
  L(
    'Verblijf je in het noorden, aan de westkust, in Santa Eulalia of ergens dat geen loopafstand van een strand en een supermarkt is: huur een auto op de luchthaven en denk de rest van de week niet meer aan vervoer. Het omslagpunt met taxi’s komt sneller dan mensen verwachten — ruwweg twee retourritten per dag is genoeg — en het is wat de clubs aan de doorgaande wegen, de uitzichtpunten bij Es Vedrà en de noordkuststranden praktisch maakt in plaats van een project.',
    'Staying in the north, on the west coast, in Santa Eulalia or anywhere that is not walking distance from a beach and a supermarket: hire a car at the airport and stop thinking about transport for the week. The break-even against taxis arrives faster than people expect — roughly two return journeys a day is all it takes — and it is what makes the clubs out on the main roads, the Es Vedrà viewpoints and the north-coast beaches practical rather than a project.',
    'Wohnst du im Norden, an der Westküste, in Santa Eulalia oder irgendwo, das nicht zu Fuß von Strand und Supermarkt entfernt ist: miete am Flughafen ein Auto und denk die restliche Woche nicht mehr an Verkehr. Der Break-even gegenüber Taxis kommt schneller als gedacht — etwa zwei Hin- und Rückfahrten am Tag reichen — und er macht die Clubs an den Durchgangsstraßen, die Aussichtspunkte am Es Vedrà und die Nordküstenstrände praktikabel statt zum Projekt.',
    'Si te alojas en el norte, en la costa oeste, en Santa Eulalia o en cualquier sitio que no esté a pie de playa y supermercado: alquila un coche en el aeropuerto y deja de pensar en transporte el resto de la semana. El punto de equilibrio frente al taxi llega antes de lo que se espera — bastan unos dos trayectos de ida y vuelta al día — y es lo que hace practicables los clubs de las carreteras principales, los miradores de Es Vedrà y las playas del norte, en vez de convertirlos en un proyecto.',
    "Si vous logez au nord, sur la côte ouest, à Santa Eulalia ou partout qui n'est pas à distance de marche d'une plage et d'un supermarché : louez une voiture à l'aéroport et cessez de penser aux transports pour la semaine. Le seuil de rentabilité face aux taxis arrive plus vite qu'on ne le croit — environ deux allers-retours par jour suffisent — et c'est ce qui rend praticables les clubs des grands axes, les points de vue sur Es Vedrà et les plages du nord, au lieu d'en faire un projet.",
  ),
  L(
    'Eén ding geldt voor alle vier: reken er niet op dat een ritdienst-app antwoordt. De dekking op het eiland is beperkt en seizoensgebonden, en een aankomstplan dat daarvan afhangt is een aankomstplan zonder terugvaloptie.',
    'One thing that applies to all four: do not plan on a ride-hailing app answering. Coverage on the island is limited and seasonal, and an arrival plan that depends on it is an arrival plan with no fallback.',
    'Eines gilt für alle vier: Rechne nicht damit, dass eine Fahrdienst-App antwortet. Die Abdeckung auf der Insel ist begrenzt und saisonal, und ein Ankunftsplan, der davon abhängt, ist ein Ankunftsplan ohne Rückfallebene.',
    'Una cosa vale para las cuatro: no cuentes con que una app de transporte responda. La cobertura en la isla es limitada y estacional, y un plan de llegada que dependa de eso es un plan sin alternativa.',
    "Une chose vaut pour les quatre : ne comptez pas sur une application de VTC. La couverture sur l'île est limitée et saisonnière, et un plan d'arrivée qui en dépend est un plan sans solution de repli.",
  ),
]

export const CTA_BODY: T = L(
  'Stuur Simon je vluchtnummer, landingstijd, het aantal personen en waar je verblijft, dan regelt hij een privétransfer met de prijs bevestigd vóór je vliegt. Dezelfde chat als je clubtickets en bootboekingen, dus de hele reis zit op één plek — en is de taxistandplaats voor jouw rit eerlijk gezegd goedkoper, dan zegt hij dat.',
  'Send Simon your flight number, landing time, group size and where you are staying, and he arranges a private transfer with the price confirmed before you fly. Same thread as your club tickets and boat bookings, so the whole trip is in one place — and if the honest answer is that the taxi rank is cheaper for your run, he will say so.',
  'Schick Simon deine Flugnummer, Landezeit, Gruppengröße und Unterkunft, dann organisiert er einen Privattransfer mit vor dem Flug bestätigtem Preis. Derselbe Chat wie für Clubtickets und Bootsbuchungen, die ganze Reise liegt also an einem Ort — und wenn der Taxistand für deine Strecke ehrlicherweise günstiger ist, sagt er das.',
  'Envía a Simon tu número de vuelo, la hora de aterrizaje, cuántos sois y dónde te alojas, y organiza un traslado privado con el precio confirmado antes de volar. El mismo chat que tus entradas y reservas de barco, así que todo el viaje está en un sitio — y si la respuesta honesta es que la parada de taxis te sale más barata, te lo dirá.',
  "Envoyez à Simon votre numéro de vol, l'heure d'atterrissage, le nombre de personnes et votre hébergement : il organise un transfert privé avec le prix confirmé avant le départ. Le même fil que vos billets de club et réservations de bateau, tout le séjour au même endroit — et si la réponse honnête est que la station de taxis est moins chère pour votre trajet, il le dira.",
)
export const CTA_PREFILL: T = L(
  'Hoi Simon, ik zoek een luchthaventransfer op Ibiza — vluchtnummer, landingstijd en aantal personen: ',
  'Hi Simon, I need an airport transfer in Ibiza — flight number, landing time and group size: ',
  'Hallo Simon, ich brauche einen Flughafentransfer auf Ibiza — Flugnummer, Landezeit und Personenzahl: ',
  'Hola Simon, necesito un traslado desde el aeropuerto en Ibiza — número de vuelo, hora de aterrizaje y personas: ',
  "Salut Simon, j'ai besoin d'un transfert aéroport à Ibiza — numéro de vol, heure d'atterrissage et nombre de personnes : ",
)

export const FAQS: { q: T; a: T }[] = [
  {
    q: L('Hoe kom ik van de luchthaven naar mijn hotel?', 'How do I get from Ibiza airport to my hotel?', 'Wie komme ich vom Flughafen zum Hotel?', '¿Cómo llego del aeropuerto a mi hotel?', "Comment aller de l'aéroport à mon hôtel ?"),
    a: L(
      'Vier opties, en welke de juiste is hangt af van je aankomsttijd en het aantal personen. De taxistandplaats bij aankomst is de standaard en werkt voor de meeste mensen. Een vooraf geboekte privétransfer is logisch voor een groep met bagage of een late landing. De openbare bus is de goedkope optie als je licht reist naar Ibiza-Stad. Een huurauto verdient zichzelf terug als je van plan bent je verblijf meer dan twee keer per dag te verlaten.',
      'Four options, and the right one depends on your arrival time and group size. The taxi rank outside arrivals is the default and works for most people. A pre-booked private transfer makes sense for a group with luggage or a late landing. The public bus is the cheap option if you are travelling light to Ibiza Town. A hire car pays for itself if you plan to leave your resort more than twice.',
      'Vier Optionen, und welche die richtige ist, hängt von Ankunftszeit und Gruppengröße ab. Der Taxistand vor der Ankunft ist der Standard und passt für die meisten. Ein vorab gebuchter Privattransfer ist sinnvoll für eine Gruppe mit Gepäck oder eine späte Landung. Der öffentliche Bus ist die günstige Option, wenn du leicht nach Ibiza-Stadt reist. Ein Mietwagen rechnet sich, wenn du deine Unterkunft öfter als zweimal am Tag verlässt.',
      'Cuatro opciones, y la buena depende de tu hora de llegada y de cuántos seáis. La parada de taxis a la salida de llegadas es lo estándar y sirve para la mayoría. Un traslado privado reservado tiene sentido para un grupo con equipaje o un aterrizaje tarde. El autobús público es la opción barata si viajas ligero a Ibiza ciudad. Un coche de alquiler se amortiza si piensas salir de tu alojamiento más de dos veces al día.',
      "Quatre options, et la bonne dépend de votre heure d'arrivée et du nombre de personnes. La station de taxis devant les arrivées est le réflexe par défaut et convient à la plupart. Un transfert privé réservé a du sens pour un groupe avec bagages ou un atterrissage tardif. Le bus public est l'option économique si vous voyagez léger vers Ibiza-ville. Une voiture de location se rentabilise si vous comptez quitter votre hébergement plus de deux fois par jour.",
    ),
  },
  {
    q: L('Hoe ver is de luchthaven van Ibiza-Stad?', 'How far is Ibiza airport from Ibiza Town?', 'Wie weit ist der Flughafen von Ibiza-Stadt?', '¿A qué distancia está el aeropuerto de Ibiza ciudad?', "À quelle distance est l'aéroport d'Ibiza-ville ?"),
    a: L(
      'Ongeveer zeven kilometer, wat buiten de spits vijftien tot twintig minuten over de weg is. Playa d’en Bossa ligt nog dichterbij — dat zit ertussenin. San Antonio ligt aan de andere kant van het eiland en is een langere rit, ruwweg een half uur afhankelijk van verkeer en seizoen. Santa Eulalia is nog verder.',
      'About seven kilometres, which is fifteen to twenty minutes by road outside peak times. Playa d’en Bossa is closer still — it sits between the two. San Antonio is on the other side of the island and is a longer run, roughly half an hour depending on traffic and the season. Santa Eulalia is further again.',
      'Etwa sieben Kilometer, also fünfzehn bis zwanzig Minuten über die Straße außerhalb der Stoßzeiten. Playa d’en Bossa liegt noch näher — es liegt dazwischen. San Antonio liegt auf der anderen Inselseite und ist eine längere Fahrt, grob eine halbe Stunde je nach Verkehr und Saison. Santa Eulalia ist noch weiter.',
      'Unos siete kilómetros, que son quince o veinte minutos por carretera fuera de horas punta. Playa d’en Bossa queda aún más cerca — está entre medias. San Antonio está al otro lado de la isla y es un trayecto más largo, media hora larga según el tráfico y la temporada. Santa Eulalia queda todavía más lejos.',
      "Environ sept kilomètres, soit quinze à vingt minutes par la route hors heures de pointe. Playa d’en Bossa est encore plus près — il se situe entre les deux. San Antonio est de l'autre côté de l'île et représente un trajet plus long, environ une demi-heure selon le trafic et la saison. Santa Eulalia est encore plus loin.",
    ),
  },
  {
    q: L('Is er een taxistandplaats op de luchthaven?', 'Is there a taxi rank at Ibiza airport?', 'Gibt es am Flughafen einen Taxistand?', '¿Hay parada de taxis en el aeropuerto?', "Y a-t-il une station de taxis à l'aéroport ?"),
    a: L(
      'Ja, direct buiten bij aankomst, en het is de simpelste manier de terminal uit. In het hoogseizoen en na een reeks avondlandingen staat er een rij, en die beweegt in het tempo waarin de standplaats wordt bijgevuld en niet in het tempo dat jij zou willen. Taxi’s rijden op de meter met toeslagen die per tijdstip en bagage verschillen — vraag wat de rit gaat kosten voordat je vertrekt.',
      'Yes, directly outside arrivals, and it is the simplest way out of the terminal. In peak season and after a bank of evening landings there is a queue, and it moves at the pace the rank is fed rather than the pace you would like. Taxis are metered with supplements that vary by time and luggage — ask what the run will cost before you set off.',
      'Ja, direkt vor der Ankunft, und es ist der einfachste Weg aus dem Terminal. In der Hochsaison und nach einer Welle von Abendlandungen gibt es eine Schlange, und die bewegt sich im Takt, in dem der Stand beliefert wird, nicht in deinem. Taxis fahren nach Taxameter mit Zuschlägen je nach Uhrzeit und Gepäck — frag vor der Abfahrt, was die Strecke kostet.',
      'Sí, justo a la salida de llegadas, y es la forma más simple de salir de la terminal. En temporada alta y tras una tanda de aterrizajes por la tarde hay cola, y avanza al ritmo al que se abastece la parada, no al que te gustaría. Los taxis van con taxímetro y suplementos que varían según la hora y el equipaje — pregunta cuánto costará el trayecto antes de salir.',
      "Oui, juste devant les arrivées, et c'est la façon la plus simple de sortir du terminal. En haute saison et après une série d'atterrissages en soirée, il y a une file, et elle avance au rythme auquel la station est alimentée, pas au vôtre. Les taxis sont au compteur avec des suppléments selon l'heure et les bagages — demandez le coût du trajet avant de partir.",
    ),
  },
  {
    q: L('Kan ik Uber of Bolt gebruiken op Ibiza?', 'Can I use Uber or Bolt in Ibiza?', 'Kann ich auf Ibiza Uber oder Bolt nutzen?', '¿Puedo usar Uber o Bolt en Ibiza?', 'Puis-je utiliser Uber ou Bolt à Ibiza ?'),
    a: L(
      'Bouw je aankomst er niet omheen. De dekking van ritdiensten op het eiland is beperkt en seizoensgebonden, en het is geen vervanging van de taxistandplaats zoals in een stad op het vasteland. Doet een wachtende auto ertoe — een late landing, een groep, veel bagage — boek dan vooraf een privétransfer in plaats van aan te nemen dat een app antwoordt.',
      'Do not build your arrival around it. Ride-hailing coverage on the island is limited and seasonal, and it is not a substitute for the taxi rank the way it is in a mainland city. If having a car waiting matters — a late landing, a group, a lot of luggage — book a private transfer in advance instead of assuming an app will answer.',
      'Bau deine Ankunft nicht darum herum. Die Abdeckung von Fahrdiensten auf der Insel ist begrenzt und saisonal und ersetzt den Taxistand nicht so wie in einer Stadt auf dem Festland. Wenn ein wartendes Auto zählt — späte Landung, Gruppe, viel Gepäck — buche vorher einen Privattransfer, statt darauf zu setzen, dass eine App antwortet.',
      'No montes tu llegada alrededor de eso. La cobertura de las apps de transporte en la isla es limitada y estacional, y no sustituye a la parada de taxis como en una ciudad peninsular. Si importa tener un coche esperando — aterrizaje tarde, un grupo, mucho equipaje — reserva antes un traslado privado en vez de dar por hecho que una app responderá.',
      "Ne construisez pas votre arrivée là-dessus. La couverture des VTC sur l'île est limitée et saisonnière, et elle ne remplace pas la station de taxis comme dans une ville du continent. Si avoir une voiture qui attend compte — atterrissage tardif, groupe, beaucoup de bagages — réservez un transfert privé à l'avance plutôt que de supposer qu'une application répondra.",
    ),
  },
  {
    q: L('Rijdt er een bus vanaf de luchthaven?', 'Is there a bus from Ibiza airport?', 'Fährt ein Bus vom Flughafen?', '¿Hay autobús desde el aeropuerto?', "Y a-t-il un bus depuis l'aéroport ?"),
    a: L(
      'Er is een openbare busverbinding tussen de luchthaven en Ibiza-Stad die het hele jaar rijdt, plus een seizoenslijn richting San Antonio in de zomer. Lijnnummers en dienstregelingen wisselen per seizoen, dus controleer de actuele dienstregeling voordat je erop rekent — zeker bij een late aankomst, waar de laatste rit van de dag zwaarder telt dan de prijs.',
      'There is a public bus service between the airport and Ibiza Town that runs year-round, plus a seasonal route towards San Antonio during the summer. Line numbers and timetables change between seasons, so check the current schedule before you rely on it — particularly for a late arrival, where the last departure of the day matters more than the fare.',
      'Es gibt eine öffentliche Busverbindung zwischen Flughafen und Ibiza-Stadt, die ganzjährig fährt, plus eine Saisonlinie Richtung San Antonio im Sommer. Liniennummern und Fahrpläne ändern sich je Saison, prüfe also den aktuellen Fahrplan, bevor du dich darauf verlässt — besonders bei später Ankunft, wo die letzte Abfahrt des Tages mehr zählt als der Preis.',
      'Hay una línea pública entre el aeropuerto e Ibiza ciudad que funciona todo el año, y una línea de temporada hacia San Antonio en verano. Los números de línea y los horarios cambian según la temporada, así que consulta el horario actual antes de contar con ello — sobre todo en una llegada tarde, donde la última salida del día importa más que el precio.',
      "Il existe une ligne de bus publique entre l'aéroport et Ibiza-ville qui circule toute l'année, plus une ligne saisonnière vers San Antonio l'été. Les numéros de ligne et les horaires changent selon la saison : vérifiez l'horaire en cours avant d'y compter — surtout pour une arrivée tardive, où le dernier départ compte plus que le tarif.",
    ),
  },
  {
    q: L('En als ik na middernacht land?', 'What if I land after midnight?', 'Und wenn ich nach Mitternacht lande?', '¿Y si aterrizo pasada la medianoche?', 'Et si j’atterris après minuit ?'),
    a: L(
      'Boek vooraf. Late landingen zijn precies wanneer de taxirij het langst is en de bus gestopt is, en het is de ene aankomst waarbij improviseren echt duur uitpakt. Een vooraf geboekte privétransfer kost een bekend bedrag en heeft je naam erop; dezelfde rit die je om twee uur ’s nachts moet vinden niet.',
      'Pre-book. Late landings are exactly when the taxi queue is longest and the bus has stopped running, and it is the one arrival where improvising is genuinely expensive. A private transfer booked in advance costs a known amount and has your name on it; the same journey found at two in the morning does not.',
      'Buche vorher. Späte Landungen sind genau dann, wenn die Taxischlange am längsten ist und der Bus nicht mehr fährt, und es ist die eine Ankunft, bei der Improvisieren wirklich teuer wird. Ein vorab gebuchter Privattransfer kostet einen bekannten Betrag und trägt deinen Namen; dieselbe Fahrt um zwei Uhr nachts zu finden nicht.',
      'Reserva antes. Los aterrizajes tarde son justo cuando la cola del taxi es más larga y el autobús ya no circula, y es la única llegada en la que improvisar sale de verdad caro. Un traslado privado reservado antes cuesta una cifra conocida y lleva tu nombre; el mismo trayecto buscado a las dos de la madrugada, no.',
      "Réservez à l'avance. Les atterrissages tardifs, c'est exactement quand la file de taxis est la plus longue et que le bus ne circule plus, et c'est la seule arrivée où improviser coûte vraiment cher. Un transfert privé réservé à l'avance coûte un montant connu et porte votre nom ; le même trajet trouvé à deux heures du matin, non.",
    ),
  },
  {
    q: L('Kan ik beter een auto huren?', 'Should I hire a car instead?', 'Soll ich lieber ein Auto mieten?', '¿Mejor alquilo un coche?', 'Vaut-il mieux louer une voiture ?'),
    a: L(
      'Verblijf je buiten Ibiza-Stad of Playa d’en Bossa, of wil je het noorden, de westkuststranden of een club aan de doorgaande weg naar San Antonio bereiken, dan is een auto meestal goedkoper dan de taxi’s die hij vervangt. Zit je aan de strip en ga je elke avond uit, dan is het een parkeerprobleem waar je voor betaalt. Onze autohuurpagina beschrijft het ophalen op de luchthaven.',
      'If you are staying outside Ibiza Town or Playa d’en Bossa, or you want to reach the north, the west-coast beaches or a club out on the San Antonio road, a car is usually cheaper than the taxis it replaces. If you are staying on the strip and clubbing every night, it is a parking problem you are paying for. Our car rental page covers the pick-up flow at the airport.',
      'Wohnst du außerhalb von Ibiza-Stadt oder Playa d’en Bossa, oder willst du in den Norden, an die Westküstenstrände oder zu einem Club an der Durchgangsstraße nach San Antonio, ist ein Auto meist günstiger als die Taxis, die es ersetzt. Wohnst du an der Strip und gehst jeden Abend aus, ist es ein Parkproblem, für das du zahlst. Unsere Mietwagenseite beschreibt die Abholung am Flughafen.',
      'Si te alojas fuera de Ibiza ciudad o Playa d’en Bossa, o quieres llegar al norte, a las playas del oeste o a un club de la carretera de San Antonio, el coche suele salir más barato que los taxis que sustituye. Si estás en la strip y sales cada noche, es un problema de aparcamiento por el que pagas. Nuestra página de alquiler explica la recogida en el aeropuerto.',
      "Si vous logez hors d'Ibiza-ville ou de Playa d’en Bossa, ou si vous voulez rejoindre le nord, les plages de l'ouest ou un club sur la route de San Antonio, la voiture revient généralement moins cher que les taxis qu'elle remplace. Si vous êtes sur la strip et sortez chaque soir, c'est un problème de stationnement que vous payez. Notre page location de voiture décrit la prise en charge à l'aéroport.",
    ),
  },
  {
    q: L('Kan Ibiza Mi Vida een transfer regelen?', 'Can Ibiza Mi Vida arrange a transfer?', 'Kann Ibiza Mi Vida einen Transfer organisieren?', '¿Ibiza Mi Vida puede gestionar un traslado?', 'Ibiza Mi Vida peut-elle organiser un transfert ?'),
    a: L(
      'Ja, via Simon op WhatsApp. Stuur het vluchtnummer, de landingstijd, het aantal personen en waar je verblijft, dan regelt hij een privétransfer en bevestigt hij de prijs vóór je vliegt in plaats van nadat je geland bent. Het is dezelfde chat die gastenlijst- en bootboekingen doet, dus een hele reis kan in één gesprek geregeld worden.',
      'Yes, through Simon on WhatsApp. Send the flight number, the landing time, the group size and where you are staying, and he arranges a private transfer and confirms the price before you fly rather than after you land. It is the same channel that handles guestlist and boat bookings, so a whole trip can be sorted in one thread.',
      'Ja, über Simon per WhatsApp. Schick Flugnummer, Landezeit, Gruppengröße und Unterkunft, dann organisiert er einen Privattransfer und bestätigt den Preis vor dem Flug statt nach der Landung. Es ist derselbe Kanal wie für Gästeliste und Bootsbuchungen, eine ganze Reise lässt sich also in einem Gespräch regeln.',
      'Sí, con Simon por WhatsApp. Envía el número de vuelo, la hora de aterrizaje, cuántos sois y dónde te alojas, y organiza un traslado privado confirmando el precio antes de volar y no después de aterrizar. Es el mismo canal que lleva la guestlist y las reservas de barco, así que un viaje entero se resuelve en una conversación.',
      "Oui, via Simon sur WhatsApp. Envoyez le numéro de vol, l'heure d'atterrissage, le nombre de personnes et votre hébergement : il organise un transfert privé et confirme le prix avant le départ plutôt qu'après l'atterrissage. C'est le même canal que pour la guestlist et les réservations de bateau : tout un séjour se règle dans une seule conversation.",
    ),
  },
]

export const H_LINKS: T = L('Gerelateerde pagina’s', 'Related pages', 'Verwandte Seiten', 'Páginas relacionadas', 'Pages liées')

export const LINKS: { key: string; localized: boolean; label: T; body: T }[] = [
  {
    key: 'car-rental', localized: true,
    label: L('Auto huren op Ibiza', 'Car rental in Ibiza', 'Mietwagen auf Ibiza', 'Alquiler de coches en Ibiza', 'Location de voiture à Ibiza'),
    body: L('All-in huren via Wiber, vijf minuten van de terminal.', 'All-inclusive hire through Wiber, five minutes from the terminal.', 'All-inclusive-Miete über Wiber, fünf Minuten vom Terminal.', 'Alquiler todo incluido con Wiber, a cinco minutos de la terminal.', "Location tout compris via Wiber, à cinq minutes du terminal."),
  },
  {
    key: 'car-rental-airport', localized: true,
    label: L('Auto huren op de luchthaven', 'Car rental at Ibiza airport', 'Mietwagen am Flughafen Ibiza', 'Alquiler de coches en el aeropuerto', "Location de voiture à l'aéroport"),
    body: L('Het ophalen op IBZ, de shuttle en advies bij late landingen.', 'The pick-up flow at IBZ, shuttle and late-landing advice.', 'Die Abholung am IBZ, Shuttle und Tipps bei später Landung.', 'La recogida en IBZ, la lanzadera y consejos si aterrizas tarde.', "La prise en charge à IBZ, la navette et les conseils pour un vol tardif."),
  },
  {
    key: 'getting-around', localized: true,
    label: L('Vervoer op Ibiza', 'Getting around Ibiza', 'Fortbewegung auf Ibiza', 'Cómo moverse por Ibiza', 'Se déplacer à Ibiza'),
    body: L('De week ná de aankomst: bus, taxi, huurauto of boot.', 'The week after the arrival: bus, taxi, hire car or boat.', 'Die Woche nach der Ankunft: Bus, Taxi, Mietwagen oder Boot.', 'La semana después de llegar: bus, taxi, coche o barco.', "La semaine après l'arrivée : bus, taxi, voiture ou bateau."),
  },
  {
    key: 'tips', localized: false,
    label: L('Ibiza tips', 'Ibiza tips', 'Ibiza Tipps', 'Consejos de Ibiza', 'Conseils Ibiza'),
    body: L('Praktisch eilandadvies van het lokale team.', 'Practical island advice from the local team.', 'Praktische Inseltipps vom Team vor Ort.', 'Consejos prácticos del equipo local.', "Conseils pratiques de l'équipe sur place."),
  },
  {
    key: 'calendar', localized: false,
    label: L('Ibiza clubagenda', 'Ibiza club calendar', 'Ibiza Clubkalender', 'Agenda de clubs de Ibiza', "Agenda des clubs d'Ibiza"),
    body: L('Plan de week voordat je de transfer plant.', 'Plan the week before you plan the transfer.', 'Plane die Woche, bevor du den Transfer planst.', 'Planifica la semana antes que el traslado.', 'Planifiez la semaine avant le transfert.'),
  },
  {
    key: 'club-tickets-hub', localized: true,
    label: L('Ibiza clubtickets 2026', 'Ibiza club tickets 2026', 'Ibiza Clubtickets 2026', 'Entradas discotecas Ibiza 2026', 'Billets clubs Ibiza 2026'),
    body: L('Wat een avond uit kost, vóór je de taxi begroot.', 'What a night out costs, before you budget the taxi.', 'Was ein Abend kostet, bevor du das Taxi einplanst.', 'Lo que cuesta una noche, antes de presupuestar el taxi.', "Le coût d'une soirée, avant de budgéter le taxi."),
  },
]

export const BYLINE_TOPIC: T = L(
  'luchthaventransfers op Ibiza',
  'Ibiza airport transfers',
  'Flughafentransfers auf Ibiza',
  'los traslados del aeropuerto de Ibiza',
  "les transferts depuis l'aéroport d'Ibiza",
)
