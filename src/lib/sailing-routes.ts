import type { Locale } from './seo'

// ── Sailing-route content for the private charter page (5 locales) ─────────
// A sibling of ./page-faq.ts and ./water-facts.ts, and bound by exactly the
// same guardrails. This file answers the question a visitor actually has once
// they know a private boat is possible: "where would we go?" — laid out as
// three classic day routes with an ordered list of stops, because ordered
// lists and headings are the shapes answer engines lift most reliably.
//
// HARD RULE — every claim here must be verifiable and true. No invented
// prices, no distances in nautical miles, no sailing times in minutes, no
// depths, no mooring fees, no capacities, and nothing is ever called free.
// No named third-party businesses, beach clubs or restaurants. No specific
// permit or regulation claims: we may say that the seagrass beds around the
// islands are protected and that a skipper anchors on sand accordingly —
// that is true and generally known — but never a rule expressed as a number.
// Geography, orientation, exposure to wind and the character of a bay are
// stable facts and are safe to describe; anything else is qualitative or is
// left out. Charter rates depend on boat, date and season and are confirmed
// over WhatsApp.
//
// At least four passages must carry an honest limitation (a bay unusable in
// a given wind, somewhere that is crowded in August, a route that gets
// reversed or dropped when the sea says so). Do not edit those out.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export type RouteStop = {
  /** Place name — rendered as an <h3>. Not translated where it is a proper noun. */
  name: string
  /** One or two sentences of true, evocative description. */
  blurb: T
  /** Why it earns a stop on the day. */
  why: T
  /** One practical note: anchoring, shelter, crowding, or when it does not work. */
  note: T
  /**
   * Photograph of THIS bay. Optional, and deliberately so.
   *
   * ── The one rule ──────────────────────────────────────────────────────
   * A real photograph of the actual place, or nothing. Not a generic
   * Mediterranean cove, not a stock beach, and above all not an AI-generated
   * image — this site already carries eight of those under /locations, and
   * they are illustrations rather than pictures of anywhere.
   *
   * Here that matters more than on a landing page. Someone reads this list to
   * decide where to spend a chartered day and several hundred euros. A picture
   * of a bay that does not exist is a promise the boat cannot keep, and the
   * header of this file already forbids every other kind of unverifiable
   * claim; an image is a claim like any other.
   *
   * A stop with no photo simply renders without one, which is the honest
   * state and looks fine.
   */
  image?: {
    /** Path or URL. */
    src: string
    /** Photographer or owner, shown under the image. Required — an
     *  uncredited photo is one nobody can check the provenance of. */
    credit: string
    /** Localised alt text describing what is actually visible. */
    alt: T
  }
}

export type SailingRoute = {
  id: string
  /** Route title — rendered as an <h3> inside the section, stops become <h4>-level headings visually but real <h3> semantics per stop list. */
  title: T
  /** Who the route suits. */
  suits: T
  /** Short intro paragraph. */
  intro: T
  stops: RouteStop[]
  /** Honest closing note for this route. */
  note: T
}

/** Section chrome. */
export const ROUTES_HEADING: T = L(
  'Drie klassieke vaarroutes vanaf Ibiza',
  'Three classic day routes from Ibiza',
  'Drei klassische Tagesrouten ab Ibiza',
  'Tres rutas clásicas de un día desde Ibiza',
  'Trois itinéraires classiques à la journée depuis Ibiza',
)

export const ROUTES_INTRO: T = L(
  'De vraag die iedereen stelt zodra de boot geregeld is: waar varen we heen? Hieronder staan de drie routes die onze schippers het vaakst varen, met de baaien op volgorde. Ze zijn geen dienstregeling maar een startpunt — de wind van die ochtend bepaalt welke kant van het eiland aangenaam is, en de schipper draait de volgorde om of ruilt een stop in wanneer dat beter uitpakt. Welke route bij jullie dag past, bespreken we vooraf via WhatsApp.',
  'The question everyone asks once the boat is sorted: where do we actually go? Below are the three routes our skippers run most often, with the coves in order. They are a starting point rather than a timetable — the wind that morning decides which side of the island is pleasant, and the skipper will reverse the order or swap a stop when that works out better. Which route suits your day is something we talk through over WhatsApp beforehand.',
  'Die Frage, die alle stellen, sobald das Boot steht: Wohin fahren wir eigentlich? Unten stehen die drei Routen, die unsere Skipper am häufigsten fahren, mit den Buchten in der Reihenfolge. Sie sind ein Ausgangspunkt, kein Fahrplan — der Wind am Morgen entscheidet, welche Inselseite angenehm ist, und der Skipper dreht die Reihenfolge um oder tauscht einen Stopp, wenn das besser passt. Welche Route zu eurem Tag passt, besprechen wir vorab per WhatsApp.',
  'La pregunta que todo el mundo hace en cuanto el barco está cerrado: ¿adónde vamos? Abajo están las tres rutas que más navegan nuestros patrones, con las calas en orden. Son un punto de partida, no un horario — el viento de esa mañana decide qué lado de la isla resulta agradable, y el patrón invierte el orden o cambia una parada cuando conviene. Qué ruta encaja con vuestro día lo hablamos antes por WhatsApp.',
  'La question que tout le monde pose une fois le bateau réservé : où va-t-on vraiment ? Voici les trois itinéraires que nos skippers empruntent le plus souvent, avec les criques dans l’ordre. C’est un point de départ, pas un horaire — le vent du matin décide quel côté de l’île est agréable, et le skipper inverse l’ordre ou remplace une escale quand cela vaut mieux. L’itinéraire qui convient à votre journée, nous en parlons à l’avance par WhatsApp.',
)

export const ROUTES_NOTE: T = L(
  'Eerlijk erbij: geen enkele route is gegarandeerd. De zee heeft het laatste woord, en bij aanhoudende wind schrapt de schipper een baai of vaart hij de route andersom. Rond de eilanden liggen beschermde zeegrasvelden; een schipper laat het anker daarom op zandplekken vallen en niet zomaar ergens. En het hoogseizoen is druk: in augustus liggen de bekendste baaien midden op de dag vol boten, dus vroeg vertrekken scheelt meer dan welke route dan ook.',
  'To be straight about it: no route is guaranteed. The sea has the last word, and in sustained wind the skipper drops a cove or runs the route the other way round. Protected seagrass beds lie around these islands, so a skipper puts the anchor down on sand rather than anywhere convenient. And high season is busy: in August the best-known bays fill with boats in the middle of the day, so leaving early makes more difference than any choice of route.',
  'Ehrlich dazu: Keine Route ist garantiert. Das Meer hat das letzte Wort, und bei anhaltendem Wind streicht der Skipper eine Bucht oder fährt die Route andersherum. Rund um die Inseln liegen geschützte Seegraswiesen; ein Skipper wirft den Anker deshalb auf Sandflecken und nicht irgendwo. Und die Hochsaison ist voll: Im August liegen die bekanntesten Buchten mittags voller Boote — früh loszufahren bringt mehr als jede Routenwahl.',
  'Con honestidad: ninguna ruta está garantizada. El mar tiene la última palabra, y con viento sostenido el patrón suprime una cala o hace la ruta al revés. Alrededor de estas islas hay praderas de posidonia protegidas, así que el patrón fondea sobre arena y no en cualquier sitio. Y la temporada alta va llena: en agosto las calas más conocidas se llenan de barcos a mediodía, de modo que salir temprano influye más que cualquier ruta.',
  'Soyons clairs : aucun itinéraire n’est garanti. La mer a le dernier mot, et par vent installé le skipper supprime une crique ou fait le parcours en sens inverse. Des herbiers protégés bordent ces îles : le skipper mouille donc sur des taches de sable et non n’importe où. Et la haute saison est chargée : en août, les baies les plus connues se remplissent de bateaux en milieu de journée, si bien que partir tôt change plus de choses que le choix de l’itinéraire.',
)

/** Small labels used by the component. */
export const ROUTE_LABELS = {
  suits: L('Past bij', 'Who it suits', 'Passt zu', 'Para quién es', 'Pour qui'),
  why: L('Waarom stoppen', 'Why stop here', 'Warum hier stoppen', 'Por qué parar', 'Pourquoi s’y arrêter'),
  note: L('Praktisch', 'Practical note', 'Praktisch', 'Nota práctica', 'Note pratique'),
  stops: L('Stops op volgorde', 'Stops in order', 'Stopps in Reihenfolge', 'Paradas en orden', 'Escales dans l’ordre'),
  // Bewust een plaatsbepaling en geen toegangsbelofte: "aan dit strand ligt"
  // zegt waar de zaak staat, niet dat je er kunt aanleggen of die dag aan land
  // kunt. Dat laatste hangt af van wind en drukte en beslist de schipper.
  onBeach: L(
    'Aan dit strand ligt',
    'On this beach',
    'An diesem Strand liegt',
    'En esta playa está',
    'Sur cette plage se trouve',
  ),
  ashore: L(
    'Aan land gaan kan niet overal en niet elke dag — wind, drukte en de bodem bepalen of het die dag werkt. Je schipper beslist ter plekke.',
    'Going ashore is not possible everywhere or every day — wind, crowding and the seabed decide whether it works. Your skipper calls it on the day.',
    'An Land gehen geht nicht überall und nicht jeden Tag — Wind, Andrang und der Grund entscheiden. Dein Skipper entscheidet vor Ort.',
    'Bajar a tierra no es posible en todas partes ni todos los días: el viento, la afluencia y el fondo lo deciden. Tu patrón lo decide sobre la marcha.',
    'Descendre à terre n’est pas possible partout ni tous les jours — le vent, l’affluence et le fond décident. Votre skipper tranche sur place.',
  ),
}

export const SAILING_ROUTES: SailingRoute[] = [
  // ── 1. South + Formentera ────────────────────────────────────────────────
  {
    id: 'south-formentera',
    title: L(
      'Zuid en de oversteek naar Formentera',
      'South coast and the crossing to Formentera',
      'Süden und die Überfahrt nach Formentera',
      'Sur y la travesía a Formentera',
      'Le sud et la traversée vers Formentera',
    ),
    suits: L(
      'Wie voor het eerst een dag op het water doorbrengt, gezinnen en iedereen die vooral ondiep turquoise water wil.',
      'First-timers, families and anyone whose main wish is shallow turquoise water.',
      'Alle, die zum ersten Mal einen Tag auf dem Wasser verbringen, Familien und alle, die vor allem flaches türkisfarbenes Wasser wollen.',
      'Quien navega por primera vez, familias y todo el que busca sobre todo agua turquesa y poco profunda.',
      'Les primo-navigants, les familles et tous ceux qui veulent surtout de l’eau turquoise peu profonde.',
    ),
    intro: L(
      'De bekendste route, en niet zonder reden: het water tussen Ibiza en Formentera is licht en helder omdat de bodem er uit zand bestaat in plaats van uit rots. Je vaart langs de zuidpunt van Ibiza, steekt over en brengt het midden van de dag door op de zandbanken. In de ochtend ligt het water hier vaak nog spiegelglad.',
      'The best-known route, and not without reason: the water between Ibiza and Formentera reads pale and clear because the bottom there is sand rather than rock. You run down past the southern tip of Ibiza, cross over, and spend the middle of the day on the sandbanks. In the morning this stretch is often still glassy.',
      'Die bekannteste Route, und das zu Recht: Das Wasser zwischen Ibiza und Formentera wirkt hell und klar, weil der Grund dort aus Sand besteht und nicht aus Fels. Man fährt an der Südspitze Ibizas entlang, setzt über und verbringt die Mittagszeit auf den Sandbänken. Morgens ist es hier oft noch spiegelglatt.',
      'La ruta más conocida, y no por casualidad: el agua entre Ibiza y Formentera se ve clara y luminosa porque el fondo es de arena y no de roca. Se baja por la punta sur de Ibiza, se cruza y se pasa el centro del día sobre los bajos de arena. Por la mañana este tramo suele estar como un plato.',
      'L’itinéraire le plus connu, et pour de bonnes raisons : l’eau entre Ibiza et Formentera paraît claire et lumineuse parce que le fond y est de sable et non de roche. On descend le long de la pointe sud d’Ibiza, on traverse, et on passe le milieu de journée sur les bancs de sable. Le matin, ce secteur est souvent d’huile.',
    ),
    stops: [
      {
        name: 'Ses Salines',
        blurb: L(
          'De vlakke zuidpunt van Ibiza, met lage duinen, dennen tot vlak aan het strand en daarachter de oude zoutpannen waar het eiland zijn naam aan dankt.',
          'The flat southern tip of Ibiza: low dunes, pines standing almost on the sand and, behind them, the old salt pans the area is named after.',
          'Die flache Südspitze Ibizas mit niedrigen Dünen, Kiefern bis fast an den Strand und dahinter den alten Salinen, nach denen die Gegend heißt.',
          'La punta sur y llana de Ibiza: dunas bajas, pinos casi sobre la arena y, detrás, las viejas salinas que dan nombre a la zona.',
          'La pointe sud et plate d’Ibiza : dunes basses, pins presque sur le sable et, derrière, les anciens marais salants qui donnent son nom au secteur.',
        ),
        why: L(
          'Een korte, rustige eerste stop vlak bij de haven, zodat iedereen alvast het water in kan voordat de oversteek begint.',
          'A short, easy first stop close to the marina, so everyone gets in the water before the crossing begins.',
          'Ein kurzer, entspannter erster Stopp nahe am Hafen, damit alle ins Wasser können, bevor die Überfahrt beginnt.',
          'Una primera parada corta y tranquila cerca del puerto, para que todos se metan al agua antes de cruzar.',
          'Une première escale courte et tranquille près du port, pour que tout le monde se baigne avant la traversée.',
        ),
        note: L(
          'De kust ligt hier open naar het zuiden: waait het uit die hoek, dan is het onrustig en slaan we deze stop over en varen direct door. Het is bovendien een natuurgebied met zeegras, dus het anker gaat op zand.',
          'This coast lies open to the south: with wind from that quarter it is restless, and we skip the stop and press straight on. It is also protected ground with seagrass, so the anchor goes down on sand.',
          'Die Küste liegt hier offen nach Süden: Weht es aus dieser Richtung, ist es unruhig — dann lassen wir den Stopp aus und fahren direkt weiter. Zudem ist es Schutzgebiet mit Seegras, der Anker fällt also auf Sand.',
          'Esta costa está abierta al sur: con viento de esa dirección se mueve, y entonces nos saltamos la parada y seguimos directos. Además es zona protegida con posidonia, así que el ancla va sobre arena.',
          'Cette côte est ouverte au sud : par vent de ce secteur, c’est agité et nous sautons l’escale pour continuer directement. C’est aussi une zone protégée avec des herbiers : l’ancre se pose sur le sable.',
        ),
      },
      {
        name: 'Es Freus',
        blurb: L(
          'De zeestraat tussen Ibiza en Formentera, bezaaid met kleine rotseilandjes en een vuurtoren. Het water wisselt hier binnen enkele meters van diepblauw naar bijna wit.',
          'The strait between Ibiza and Formentera, scattered with small rocky islets and marked by a lighthouse. The water switches from deep blue to almost white within a few metres.',
          'Die Meerenge zwischen Ibiza und Formentera, übersät mit kleinen Felseninseln und markiert von einem Leuchtturm. Das Wasser wechselt innerhalb weniger Meter von Tiefblau zu fast Weiß.',
          'El estrecho entre Ibiza y Formentera, salpicado de islotes rocosos y señalado por un faro. El agua pasa de azul oscuro a casi blanco en pocos metros.',
          'Le détroit entre Ibiza et Formentera, parsemé de petits îlots rocheux et signalé par un phare. L’eau passe du bleu profond au presque blanc en quelques mètres.',
        ),
        why: L(
          'Dit is het stuk waar mensen hun telefoon pakken. Niet om te ankeren, wel om langzaam doorheen te varen.',
          'This is the stretch where people reach for their phone. Not a place to anchor, very much a place to idle through slowly.',
          'Das ist der Abschnitt, an dem alle zum Handy greifen. Kein Ankerplatz, aber eine Strecke, die man langsam durchfährt.',
          'Es el tramo en el que todo el mundo saca el móvil. No es sitio para fondear, sí para pasarlo despacio.',
          'C’est le passage où tout le monde sort son téléphone. Pas un mouillage, mais un endroit à traverser lentement.',
        ),
        note: L(
          'Wind en stroming worden hier samengeknepen. Staat de wind tegen de stroom in, dan wordt het korte, hakkerige golfslag — vervelend voor wie snel zeeziek wordt. Vroeg oversteken is bijna altijd comfortabeler.',
          'Wind and current get squeezed together here. When the wind sets against the flow you get a short, choppy sea — unpleasant if you are prone to seasickness. Crossing early is almost always more comfortable.',
          'Wind und Strömung werden hier zusammengedrückt. Steht der Wind gegen den Strom, entsteht kurze, hackende See — unangenehm für Empfindliche. Früh überzusetzen ist fast immer bequemer.',
          'Aquí el viento y la corriente se estrechan. Con viento contra corriente sale una mar corta y picada, incómoda si te mareas con facilidad. Cruzar temprano casi siempre va mejor.',
          'Le vent et le courant s’y resserrent. Vent contre courant, la mer devient courte et hachée — désagréable si vous êtes sujet au mal de mer. Traverser tôt est presque toujours plus confortable.',
        ),
      },
      {
        name: 'Es Palmador',
        blurb: L(
          'Een onbewoond eilandje tussen Ibiza en Formentera, laag en kaal, met aan de binnenkant uitgestrekte ondiepe zandbanken waar het water bijna melkachtig licht wordt.',
          'An uninhabited islet lying between Ibiza and Formentera — low, bare, and fringed on its inner side by broad shallow sandbanks where the water turns almost milky pale.',
          'Ein unbewohntes Inselchen zwischen Ibiza und Formentera — flach, kahl, an der Innenseite gesäumt von weiten flachen Sandbänken, über denen das Wasser fast milchig hell wird.',
          'Un islote deshabitado entre Ibiza y Formentera: bajo, pelado y bordeado por su cara interior de amplios bajos de arena donde el agua se vuelve casi lechosa.',
          'Un îlot inhabité entre Ibiza et Formentera : bas, dénudé, bordé côté intérieur de larges bancs de sable où l’eau devient presque laiteuse.',
        ),
        why: L(
          'De vaste ankerplek voor de lunch. Het water is er zo ondiep dat je er eerder in staat dan in zwemt, en dat maakt het ideaal met kinderen.',
          'The standard lunch anchorage. The water is shallow enough that you stand in it rather than swim, which makes it ideal with children.',
          'Der klassische Ankerplatz für die Mittagspause. Das Wasser ist so flach, dass man eher darin steht als schwimmt — ideal mit Kindern.',
          'El fondeadero habitual para comer. El agua es tan somera que más que nadar se está de pie, algo ideal con niños.',
          'Le mouillage classique du déjeuner. L’eau y est si peu profonde qu’on s’y tient debout plutôt qu’on y nage — idéal avec des enfants.',
        ),
        note: L(
          'Het eiland en het water eromheen zijn beschermd natuurgebied; de schipper ankert op zand, buiten het zeegras, en houdt zich aan wat er lokaal geldt. Reken er in juli en augustus op dat je er midden op de dag niet alleen ligt — kom je vroeg, dan is het een ander eiland.',
          'The island and the water around it are protected; the skipper anchors on sand, clear of the seagrass, and follows whatever the local rules are that season. In July and August expect company in the middle of the day — arrive early and it is a different island entirely.',
          'Die Insel und das Wasser ringsum stehen unter Schutz; der Skipper ankert auf Sand, abseits des Seegrases, und hält sich an die jeweils geltenden Vorgaben. Im Juli und August ist man mittags nicht allein — wer früh kommt, erlebt eine andere Insel.',
          'La isla y sus aguas están protegidas; el patrón fondea sobre arena, fuera de la posidonia, y respeta lo que marque la normativa local. En julio y agosto no estarás solo a mediodía — si llegas temprano, es otra isla.',
          'L’île et ses eaux sont protégées ; le skipper mouille sur le sable, à l’écart des herbiers, en respectant la réglementation en vigueur. En juillet-août, vous ne serez pas seul en milieu de journée — arrivez tôt et c’est une tout autre île.',
        ),
      },
      {
        name: 'Ses Illetes',
        blurb: L(
          'De smalle zandtong die vanaf de noordpunt van Formentera het water in steekt, met aan weerszijden strand en daartussen niet veel meer dan duin.',
          'The narrow sand spit reaching north from the tip of Formentera, with beach on both sides and little more than dune in between.',
          'Die schmale Sandzunge, die von der Nordspitze Formenteras ins Meer ragt — Strand auf beiden Seiten und dazwischen kaum mehr als Düne.',
          'La estrecha lengua de arena que se adentra desde la punta norte de Formentera, con playa a ambos lados y poco más que duna en medio.',
          'La fine langue de sable qui s’avance depuis la pointe nord de Formentera, plage des deux côtés et guère plus que de la dune entre les deux.',
        ),
        why: L(
          'Het is het beeld waar mensen voor komen, en het klopt ook echt: fijn zand dat ver doorloopt, water dat lang ondiep blijft.',
          'It is the picture people come for, and it genuinely holds up: fine sand running a long way out, water that stays shallow for ages.',
          'Es ist das Bild, für das man kommt, und es stimmt tatsächlich: feiner Sand, der weit hinausreicht, Wasser, das lange flach bleibt.',
          'Es la imagen por la que viene la gente, y de verdad se sostiene: arena fina que sigue mar adentro y agua que tarda en cubrir.',
          'C’est l’image pour laquelle on vient, et elle tient vraiment : du sable fin qui s’étend loin, une eau qui reste longtemps peu profonde.',
        ),
        note: L(
          'De landtong is smal, dus draait de wind, dan verkas je simpelweg naar de beschutte kant — een van de weinige plekken waar een windverandering je niet meer kost dan een korte verplaatsing. Wel is dit het drukste stukje water van Formentera in het hoogseizoen.',
          'The spit is narrow, so if the wind turns you simply move to the sheltered side — one of the few places where a wind shift costs you nothing more than a short reposition. It is, however, the busiest piece of water on Formentera in high season.',
          'Die Landzunge ist schmal: Dreht der Wind, wechselt man einfach auf die geschützte Seite — einer der wenigen Orte, an denen eine Winddrehung nur ein kurzes Verholen kostet. Es ist allerdings das vollste Stück Wasser Formenteras in der Hochsaison.',
          'La lengua es estrecha, así que si el viento rola basta con pasarse al lado resguardado — uno de los pocos sitios donde un cambio de viento solo cuesta un pequeño traslado. Eso sí, es el trozo de mar más concurrido de Formentera en temporada alta.',
          'La langue de sable est étroite : si le vent tourne, on passe simplement du côté abrité — l’un des rares endroits où une bascule ne coûte qu’un court déplacement. C’est en revanche le plan d’eau le plus fréquenté de Formentera en haute saison.',
        ),
      },
      {
        name: 'Cala Saona',
        blurb: L(
          'Een insnijding in de westkust van Formentera, geflankeerd door lage roodbruine kliffen die in de late middag oplichten.',
          'A notch in Formentera’s west coast, flanked by low reddish-brown cliffs that catch the light late in the afternoon.',
          'Ein Einschnitt an Formenteras Westküste, flankiert von niedrigen rotbraunen Klippen, die am späten Nachmittag aufleuchten.',
          'Una entalladura en la costa oeste de Formentera, flanqueada por acantilados bajos de tono rojizo que se encienden a última hora de la tarde.',
          'Une échancrure sur la côte ouest de Formentera, bordée de falaises basses rougeâtres qui s’embrasent en fin d’après-midi.',
        ),
        why: L(
          'Een rustiger afsluiter dan Illetes, met mooi licht op het moment dat je toch al aan de terugtocht denkt.',
          'A quieter closer than Illetes, with good light at exactly the hour you are starting to think about the way home.',
          'Ein ruhigerer Abschluss als Illetes, mit schönem Licht genau dann, wenn man ohnehin an die Rückfahrt denkt.',
          'Un cierre más tranquilo que Illetes, con buena luz justo cuando ya piensas en la vuelta.',
          'Une fin d’étape plus calme qu’Illetes, avec une belle lumière juste au moment où l’on songe au retour.',
        ),
        note: L(
          'De baai kijkt uit op het westen en vangt daardoor deining uit die richting. Rolt er zwell binnen, dan is het er niet prettig liggen en kiezen we een baai aan de andere kant.',
          'The bay faces west and takes any swell from that direction. When swell rolls in it is no fun lying there, and we pick a cove on the other side instead.',
          'Die Bucht liegt nach Westen und fängt Dünung aus dieser Richtung. Läuft Schwell hinein, liegt man dort unangenehm — dann wählen wir eine Bucht auf der anderen Seite.',
          'La cala mira al oeste y recoge el mar de fondo de esa dirección. Si entra marejada no se está bien fondeado, y elegimos una cala del otro lado.',
          'La baie est orientée à l’ouest et reçoit la houle de ce secteur. Quand la houle entre, on y est mal, et nous choisissons plutôt une crique de l’autre côté.',
        ),
      },
    ],
    note: L(
      'Formentera en terug op één dag kan prima, maar dan is dat ook de dag: twee, hooguit drie stops. Wie vier baaien op de lijst zet, is vooral aan het varen. Bij harde zuidenwind draaien we deze route om of ruilen we hem in voor de noordkant.',
      'Formentera and back in a day works well, but then that is the day: two stops, three at most. Put four coves on the list and you mainly spend the day under way. In strong southerly wind we reverse this route or trade it for the north side.',
      'Formentera und zurück an einem Tag klappt gut — aber dann ist das der Tag: zwei Stopps, höchstens drei. Wer vier Buchten aufschreibt, ist vor allem unterwegs. Bei starkem Südwind drehen wir die Route um oder tauschen sie gegen die Nordseite.',
      'Formentera y vuelta en un día funciona bien, pero entonces ese es el día: dos paradas, tres como mucho. Quien apunta cuatro calas se pasa la jornada navegando. Con viento fuerte del sur invertimos la ruta o la cambiamos por el norte.',
      'Formentera et retour dans la journée fonctionne bien, mais c’est alors toute la journée : deux escales, trois au maximum. Avec quatre criques au programme, on passe surtout son temps à naviguer. Par fort vent de sud, nous inversons l’itinéraire ou lui préférons le nord.',
    ),
  },

  // ── 2. West coast + Es Vedrà ─────────────────────────────────────────────
  {
    id: 'west-es-vedra',
    title: L(
      'Westkust en Es Vedrà',
      'West coast and Es Vedrà',
      'Westküste und Es Vedrà',
      'Costa oeste y Es Vedrà',
      'Côte ouest et Es Vedrà',
    ),
    suits: L(
      'Stellen, fotografen en iedereen die de dag rond de zonsondergang wil bouwen.',
      'Couples, photographers and anyone who wants to build the day around the sunset.',
      'Paare, Fotografen und alle, die den Tag um den Sonnenuntergang herum planen wollen.',
      'Parejas, aficionados a la fotografía y quien quiera montar el día en torno a la puesta de sol.',
      'Les couples, les photographes et tous ceux qui veulent construire la journée autour du coucher du soleil.',
    ),
    intro: L(
      'De westkant van Ibiza is grilliger dan het zuiden: rotsplaten, dennen die tot aan de rand groeien en baaien die dieper het land in snijden. Het is ook de kant waar de zon in zee zakt, dus deze route bouwt zich naar de avond toe op. Onderweg staat de bekendste rots van het eiland.',
      'Ibiza’s west side is more rugged than the south: rock shelves, pines growing right to the edge and coves that cut deeper inland. It is also the side where the sun goes down into the sea, so this route builds towards the evening. The island’s most famous rock stands along the way.',
      'Die Westseite Ibizas ist schroffer als der Süden: Felsplatten, Kiefern bis an die Kante und Buchten, die tiefer ins Land schneiden. Es ist außerdem die Seite, an der die Sonne ins Meer sinkt — diese Route steigert sich also zum Abend hin. Unterwegs steht der berühmteste Fels der Insel.',
      'El oeste de Ibiza es más agreste que el sur: plataformas de roca, pinos que llegan al borde y calas que se meten más hacia el interior. Es también el lado por el que el sol se hunde en el mar, así que esta ruta va creciendo hacia la tarde. Por el camino está la roca más famosa de la isla.',
      'La côte ouest d’Ibiza est plus escarpée que le sud : dalles rocheuses, pins jusqu’au bord et criques qui s’enfoncent davantage dans les terres. C’est aussi le côté où le soleil plonge dans la mer : l’itinéraire monte donc en puissance vers le soir. En chemin se dresse le rocher le plus célèbre de l’île.',
    ),
    stops: [
      {
        name: 'Cala Bassa',
        blurb: L(
          'Een brede, naar het westen gekeerde baai met zand en een dennenbos dat tot vlak boven het water doorloopt.',
          'A wide, west-facing bay with sand and a pine wood running down to just above the water.',
          'Eine breite, nach Westen gerichtete Bucht mit Sand und einem Kiefernwald, der bis knapp über das Wasser reicht.',
          'Una bahía ancha orientada al oeste, con arena y un pinar que baja hasta justo encima del agua.',
          'Une large baie exposée à l’ouest, avec du sable et une pinède qui descend jusqu’au-dessus de l’eau.',
        ),
        why: L(
          'Eerste zwemstop van de dag, met genoeg ruimte om rustig voor anker te gaan en beschutting tegen wind uit het noorden en oosten.',
          'The first swim of the day, with room to anchor comfortably and shelter from wind out of the north and east.',
          'Der erste Badestopp des Tages, mit genug Platz zum entspannten Ankern und Schutz vor Wind aus Nord und Ost.',
          'El primer baño del día, con espacio para fondear con calma y abrigo del viento del norte y del este.',
          'La première baignade de la journée, avec de la place pour mouiller tranquillement et un abri des vents de nord et d’est.',
        ),
        note: L(
          'Precies waar de baai beschutting geeft tegen noordenwind, ligt hij open voor wind uit het westen. In het hoogseizoen is het bovendien een van de drukkere ankerplaatsen van de westkust.',
          'Exactly where the bay shelters you from a northerly, it lies open to wind from the west. In high season it is also one of the busier anchorages on the west coast.',
          'Genau dort, wo die Bucht vor Nordwind schützt, liegt sie offen für Westwind. In der Hochsaison ist sie zudem einer der volleren Ankerplätze der Westküste.',
          'Justo donde la cala protege del norte, queda abierta al viento del oeste. En temporada alta es además uno de los fondeaderos más concurridos de la costa oeste.',
          'Là même où la baie protège du nord, elle reste ouverte au vent d’ouest. En haute saison, c’est aussi l’un des mouillages les plus fréquentés de la côte ouest.',
        ),
      },
      {
        name: 'Cala Conta',
        blurb: L(
          'Lage rotsplaten in plaats van één doorlopend strand, met een paar onbewoonde eilandjes vlak voor de kust die het licht in de avond breken.',
          'Low rock shelves rather than one continuous beach, with a couple of uninhabited islets sitting just offshore that break up the evening light.',
          'Niedrige Felsplatten statt eines durchgehenden Strandes, mit ein paar unbewohnten Inselchen direkt davor, die das Abendlicht brechen.',
          'Plataformas bajas de roca en lugar de una playa continua, con un par de islotes deshabitados justo enfrente que rompen la luz del atardecer.',
          'Des dalles rocheuses basses plutôt qu’une plage continue, avec quelques îlots inhabités juste au large qui découpent la lumière du soir.',
        ),
        why: L(
          'Het water is er uitzonderlijk helder omdat de bodem uit zand en rots bestaat — de beste snorkelstop van de route.',
          'The water is exceptionally clear here because the bottom is sand and rock — the best snorkelling stop on the route.',
          'Das Wasser ist hier außergewöhnlich klar, weil der Grund aus Sand und Fels besteht — der beste Schnorchelstopp der Route.',
          'El agua es excepcionalmente clara porque el fondo es de arena y roca — la mejor parada de snorkel de la ruta.',
          'L’eau y est exceptionnellement claire car le fond est de sable et de roche — la meilleure escale de snorkeling du parcours.',
        ),
        note: L(
          'Er is weinig luwte tegen wind uit het westen, en tussen de zandplekken door ligt zeegras; de schipper zoekt daarom eerst een schone zandplek voordat het anker valt.',
          'There is little cover from a westerly, and seagrass grows between the patches of sand; the skipper looks for a clean sandy spot before the anchor goes down.',
          'Vor Westwind gibt es kaum Schutz, und zwischen den Sandflächen wächst Seegras; der Skipper sucht deshalb erst eine saubere Sandstelle, bevor der Anker fällt.',
          'Hay poco abrigo del viento del oeste, y entre las manchas de arena crece posidonia; el patrón busca primero un claro de arena antes de fondear.',
          'L’abri contre le vent d’ouest est faible, et des herbiers poussent entre les taches de sable ; le skipper cherche donc un fond de sable propre avant de mouiller.',
        ),
      },
      {
        name: 'Cala d’Hort',
        blurb: L(
          'De baai in de zuidwesthoek van Ibiza die recht uitkijkt op Es Vedrà. Kiezels en zand, hoge hellingen aan weerszijden.',
          'The cove in Ibiza’s south-west corner that looks straight out at Es Vedrà. Shingle and sand, high slopes on either side.',
          'Die Bucht im Südwesten Ibizas mit direktem Blick auf Es Vedrà. Kies und Sand, hohe Hänge zu beiden Seiten.',
          'La cala del extremo suroeste de Ibiza que mira de frente a Es Vedrà. Grava y arena, laderas altas a ambos lados.',
          'La crique du coin sud-ouest d’Ibiza qui fait face à Es Vedrà. Galets et sable, hauts versants de part et d’autre.',
        ),
        why: L(
          'Vanaf het water heb je hier het uitzicht dat op ansichtkaarten staat, zonder dat je ervoor over land hoeft.',
          'From the water you get the postcard view without having to drive out here over land.',
          'Vom Wasser aus hat man hier den Postkartenblick, ohne über Land anreisen zu müssen.',
          'Desde el agua tienes la vista de postal sin tener que llegar por carretera.',
          'Depuis l’eau, vous avez la vue de carte postale sans avoir à venir par la route.',
        ),
        note: L(
          'Bij zuidwestenwind staat de deining recht de baai in en is ankeren er onaangenaam tot onmogelijk. Dan bekijken we Es Vedrà varend en zwemmen we elders.',
          'In a south-westerly the swell runs straight into the bay and anchoring goes from unpleasant to not worth it. Then we look at Es Vedrà under way and swim elsewhere.',
          'Bei Südwestwind läuft die Dünung direkt in die Bucht, und Ankern wird unangenehm bis sinnlos. Dann sehen wir uns Es Vedrà in Fahrt an und schwimmen woanders.',
          'Con viento del suroeste la marejada entra de lleno en la cala y fondear pasa de incómodo a inviable. Entonces vemos Es Vedrà navegando y nos bañamos en otro sitio.',
          'Par vent de sud-ouest, la houle entre droit dans la baie et le mouillage devient inconfortable, voire inutile. On observe alors Es Vedrà en navigation et on se baigne ailleurs.',
        ),
      },
      {
        name: 'Es Vedrà',
        blurb: L(
          'Een onbewoonde rotsklomp die voor de zuidwestkust van Ibiza vrijwel loodrecht uit zee omhoog komt, met het kleinere Es Vedranell ernaast. Geen strand, geen huizen, alleen kaal gesteente en zeevogels.',
          'An uninhabited rock rising almost sheer out of the sea off Ibiza’s south-west coast, with the smaller Es Vedranell beside it. No beach, no houses, just bare stone and seabirds.',
          'Ein unbewohnter Felsen, der vor der Südwestküste Ibizas fast senkrecht aus dem Meer aufragt, daneben das kleinere Es Vedranell. Kein Strand, keine Häuser, nur nackter Fels und Seevögel.',
          'Un peñón deshabitado que se alza casi vertical desde el mar frente a la costa suroeste de Ibiza, con el más pequeño Es Vedranell al lado. Sin playa, sin casas, solo roca desnuda y aves marinas.',
          'Un rocher inhabité qui surgit presque à la verticale de la mer au large de la côte sud-ouest d’Ibiza, avec le plus petit Es Vedranell à ses côtés. Ni plage, ni maisons : de la pierre nue et des oiseaux de mer.',
        ),
        why: L(
          'Van dichtbij is de schaal pas echt te vatten: de rots is veel hoger dan hij vanaf de kust lijkt. De meeste schippers varen er langzaam omheen.',
          'Only up close does the scale land: the rock is far taller than it looks from shore. Most skippers make a slow circuit around it.',
          'Erst aus der Nähe begreift man die Dimension: Der Fels ist viel höher, als er von Land wirkt. Die meisten Skipper umrunden ihn langsam.',
          'Solo de cerca se capta la escala: la roca es mucho más alta de lo que parece desde tierra. La mayoría de los patrones da una vuelta lenta alrededor.',
          'Ce n’est que de près que l’échelle se comprend : le rocher est bien plus haut qu’il n’y paraît depuis la côte. La plupart des skippers en font lentement le tour.',
        ),
        note: L(
          'Het is een beschermd natuurgebied en er is nergens aan te leggen — dit is een plek om omheen te varen, niet om aan land te gaan. De wind versnelt bovendien langs de rotswand en de deining kaatst terug, waardoor het er zelden echt rustig ligt.',
          'It is protected ground and there is nowhere to land — this is a place to circle, not to go ashore. Wind also accelerates along the cliff face and swell bounces back off it, so it is rarely genuinely calm there.',
          'Es ist Schutzgebiet, und anlegen kann man nirgends — hier wird umrundet, nicht an Land gegangen. Zudem beschleunigt der Wind an der Felswand und die Dünung wird zurückgeworfen, sodass es dort selten wirklich ruhig ist.',
          'Es zona protegida y no hay dónde desembarcar: aquí se rodea, no se baja a tierra. Además el viento se acelera junto a la pared y la marejada rebota, así que rara vez está de verdad tranquilo.',
          'C’est une zone protégée et il n’y a nulle part où débarquer : on en fait le tour, on n’y met pas pied à terre. Le vent s’accélère aussi le long de la paroi et la houle s’y réfléchit : il y est rarement vraiment calme.',
        ),
      },
      {
        name: 'Cala Tarida',
        blurb: L(
          'Een naar het westen open baai halverwege de kust, waar de terugtocht meestal doorheen loopt op het moment dat de zon laag staat.',
          'A west-open bay halfway up the coast, which the run home usually passes through just as the sun drops low.',
          'Eine nach Westen offene Bucht auf halber Höhe der Küste, durch die die Rückfahrt meist genau dann führt, wenn die Sonne tief steht.',
          'Una bahía abierta al oeste a media costa, por la que la vuelta suele pasar justo cuando el sol está bajo.',
          'Une baie ouverte à l’ouest à mi-côte, que le retour traverse en général au moment où le soleil descend.',
        ),
        why: L(
          'De laatste duik van de dag, met de zon in je gezicht en de kust in silhouet. Voor veel gasten is dit het stuk dat blijft hangen.',
          'The last swim of the day, sun in your face and the coast in silhouette. For a lot of guests this is the part that stays with them.',
          'Der letzte Sprung ins Wasser, die Sonne im Gesicht, die Küste als Silhouette. Für viele Gäste bleibt genau dieser Teil hängen.',
          'El último baño del día, con el sol de frente y la costa en silueta. Para muchos invitados es la parte que se queda.',
          'La dernière baignade de la journée, le soleil en face et la côte en silhouette. Pour beaucoup, c’est le moment qui reste.',
        ),
        note: L(
          'Zodra de zon weg is, koelt het op het water snel af — een extra laag kleding is geen overbodige luxe. Trekt de wind in de late middag aan, dan kort de schipper deze stop in om nog met licht binnen te zijn.',
          'Once the sun is gone it cools down fast on the water — a layer of clothing is not a luxury. If the wind builds late in the afternoon the skipper trims this stop short so you are back in daylight.',
          'Sobald die Sonne weg ist, kühlt es auf dem Wasser schnell ab — eine zusätzliche Lage Kleidung ist kein Luxus. Frischt der Wind am späten Nachmittag auf, kürzt der Skipper diesen Stopp, damit ihr bei Licht zurück seid.',
          'En cuanto se va el sol refresca rápido en el agua — una capa extra de ropa no sobra. Si el viento aprieta a última hora de la tarde, el patrón acorta esta parada para volver con luz.',
          'Dès que le soleil disparaît, il fait vite frais sur l’eau — une couche supplémentaire n’est pas un luxe. Si le vent forcit en fin d’après-midi, le skipper écourte cette escale pour rentrer de jour.',
        ),
      },
    ],
    note: L(
      'Deze route werkt alleen als het uit het oosten of het noordoosten waait; dan ligt de hele westkust in de luwte. Waait het uit het westen, dan staat er precies op de mooie plekken deining en verplaatsen we de dag naar de andere kant van het eiland. Dat is geen slap excuus maar het verschil tussen een fijne en een ellendige dag.',
      'This route only works with wind out of the east or north-east, which puts the entire west coast in the lee. With wind from the west there is swell on exactly the good spots and we move the day to the other side of the island. That is not a soft excuse — it is the difference between a lovely day and a miserable one.',
      'Diese Route funktioniert nur bei Wind aus Ost oder Nordost, dann liegt die ganze Westküste im Windschatten. Bei Westwind steht genau an den schönen Stellen Dünung, und wir verlegen den Tag auf die andere Inselseite. Das ist keine faule Ausrede, sondern der Unterschied zwischen einem schönen und einem miesen Tag.',
      'Esta ruta solo funciona con viento del este o del noreste: entonces toda la costa oeste queda a resguardo. Con viento del oeste hay marejada justo en los mejores sitios y trasladamos el día al otro lado de la isla. No es una excusa: es la diferencia entre un buen día y uno pésimo.',
      'Cet itinéraire ne fonctionne que par vent d’est ou de nord-est : toute la côte ouest est alors sous le vent. Par vent d’ouest, la houle arrive précisément sur les meilleurs spots et nous déplaçons la journée de l’autre côté de l’île. Ce n’est pas un prétexte : c’est la différence entre une belle journée et une journée pénible.',
    ),
  },

  // ── 3. North and east ────────────────────────────────────────────────────
  {
    id: 'north-east',
    title: L(
      'Noord en oost: de stille kant',
      'North and east: the quieter side',
      'Norden und Osten: die ruhigere Seite',
      'Norte y este: el lado tranquilo',
      'Nord et est : le côté tranquille',
    ),
    suits: L(
      'Wie het zuiden al kent, snorkelaars, en iedereen die op een drukke dag liever niet in een rij boten ligt.',
      'Anyone who already knows the south, snorkellers, and anyone who would rather not lie in a row of boats on a busy day.',
      'Alle, die den Süden schon kennen, Schnorchler und alle, die an einem vollen Tag lieber nicht in einer Reihe Boote liegen.',
      'Quien ya conoce el sur, los aficionados al snorkel y todo el que prefiera no fondear en fila un día concurrido.',
      'Ceux qui connaissent déjà le sud, les amateurs de snorkeling et tous ceux qui préfèrent éviter la file de bateaux un jour chargé.',
    ),
    intro: L(
      'Boven Sant Antoni verandert de kust van karakter: hoger, groener, met kleine baaien die zich achter rotspunten verstoppen. Er varen hier minder boten, het water is er vaak helderder en de baaien zijn kleiner. Deze route loopt langs de noordkust door naar de oostkant.',
      'North of Sant Antoni the coast changes character: higher, greener, with small coves tucked behind rocky points. Fewer boats come this way, the water is often clearer and the bays are smaller. This route runs along the north coast and round onto the east side.',
      'Nördlich von Sant Antoni ändert die Küste ihren Charakter: höher, grüner, mit kleinen Buchten hinter Felsspitzen. Hier fahren weniger Boote, das Wasser ist oft klarer und die Buchten sind kleiner. Diese Route führt an der Nordküste entlang und um die Ostseite herum.',
      'Al norte de Sant Antoni la costa cambia de carácter: más alta, más verde, con calas pequeñas escondidas tras puntas de roca. Pasan menos barcos, el agua suele estar más clara y las calas son más recogidas. Esta ruta recorre el norte y dobla hacia el este.',
      'Au nord de Sant Antoni, la côte change de caractère : plus haute, plus verte, avec de petites criques nichées derrière des pointes rocheuses. Moins de bateaux y passent, l’eau est souvent plus claire et les baies plus petites. Cet itinéraire longe la côte nord puis contourne l’est.',
    ),
    stops: [
      {
        name: 'Cala Salada',
        blurb: L(
          'Een diep ingesneden baai ten noorden van Sant Antoni, met steile beboste hellingen eromheen en een tweede, kleinere baai er direct naast.',
          'A deeply cut bay north of Sant Antoni, ringed by steep wooded slopes, with a second and smaller cove right beside it.',
          'Eine tief eingeschnittene Bucht nördlich von Sant Antoni, umgeben von steilen bewaldeten Hängen, mit einer zweiten, kleineren Bucht direkt daneben.',
          'Una cala muy encajada al norte de Sant Antoni, rodeada de laderas boscosas y empinadas, con una segunda cala más pequeña justo al lado.',
          'Une baie profondément découpée au nord de Sant Antoni, cernée de versants boisés escarpés, avec une seconde crique plus petite juste à côté.',
        ),
        why: L(
          'Het contrast met de open zuidkust is meteen voelbaar: minder wind, meer schaduw aan de kant, en water dat er groener uitziet doordat de dennen erin weerspiegelen.',
          'The contrast with the open south coast is immediate: less wind, more shade along the edges, and water that reads greener because the pines reflect into it.',
          'Der Kontrast zur offenen Südküste ist sofort spürbar: weniger Wind, mehr Schatten am Rand und Wasser, das grüner wirkt, weil sich die Kiefern darin spiegeln.',
          'El contraste con la costa sur abierta se nota al momento: menos viento, más sombra en los bordes y un agua que se ve más verde porque los pinos se reflejan en ella.',
          'Le contraste avec la côte sud ouverte est immédiat : moins de vent, plus d’ombre sur les bords, et une eau plus verte parce que les pins s’y reflètent.',
        ),
        note: L(
          'De baai is klein en er is niet veel ankerruimte, dus op een mooie dag is hij snel vol. Bovendien staat hij open naar het noordwesten; waait het daaruit, dan is dit geen stop maar een doorvaart.',
          'The bay is small and there is not much room to anchor, so on a fine day it fills quickly. It also lies open to the north-west; with wind from there this is not a stop but a place you pass.',
          'Die Bucht ist klein und bietet wenig Ankerraum, an einem schönen Tag ist sie also schnell voll. Zudem liegt sie offen nach Nordwesten; weht es von dort, ist das kein Stopp, sondern eine Durchfahrt.',
          'La cala es pequeña y hay poco sitio para fondear, así que un día bueno se llena rápido. Además está abierta al noroeste; con viento de ahí no es una parada, es un lugar de paso.',
          'La baie est petite et offre peu de place au mouillage : par beau temps, elle se remplit vite. Elle est aussi ouverte au nord-ouest ; par vent de ce secteur, ce n’est plus une escale mais un passage.',
        ),
      },
      {
        name: 'Cala Benirràs',
        blurb: L(
          'Een noordwaarts gerichte baai met een losse rotspunt vlak voor de kust die er als een silhouet uitziet. Aan land verzamelen mensen zich hier bij zonsondergang om te trommelen.',
          'A north-facing bay with a detached rock standing just offshore like a silhouette. On shore, people gather here at sunset to drum.',
          'Eine nach Norden gerichtete Bucht mit einem freistehenden Felsen davor, der wie eine Silhouette wirkt. An Land versammeln sich hier bei Sonnenuntergang Menschen zum Trommeln.',
          'Una cala orientada al norte con una roca exenta justo enfrente que parece una silueta. En tierra, la gente se reúne al atardecer para tocar tambores.',
          'Une baie orientée au nord avec un rocher isolé juste au large, comme une silhouette. À terre, on s’y rassemble au coucher du soleil pour jouer du tambour.',
        ),
        why: L(
          'Een van de weinige plekken op Ibiza waar het landschap zelf de reden is om te stoppen, niet het strand.',
          'One of the few places in Ibiza where the landscape itself, rather than the beach, is the reason to stop.',
          'Einer der wenigen Orte auf Ibiza, an denen die Landschaft selbst der Grund zum Anhalten ist, nicht der Strand.',
          'Uno de los pocos sitios de Ibiza donde el motivo para parar es el paisaje en sí, no la playa.',
          'L’un des rares endroits d’Ibiza où c’est le paysage lui-même, et non la plage, qui justifie l’escale.',
        ),
        note: L(
          'De hele noordkust is onbruikbaar bij noordenwind: dan rolt de deining er ongehinderd in en heeft ankeren geen zin. Op zo’n dag varen we deze route niet, hoe graag je hier ook wilt liggen.',
          'The whole north coast is unusable in a northerly: the swell rolls straight in and anchoring makes no sense. On a day like that we do not run this route at all, however much you wanted to lie here.',
          'Die gesamte Nordküste ist bei Nordwind unbrauchbar: Die Dünung läuft ungehindert hinein, Ankern ist sinnlos. An so einem Tag fahren wir diese Route gar nicht, so gern ihr hier auch liegen würdet.',
          'Toda la costa norte queda inservible con viento del norte: la marejada entra sin obstáculo y fondear no tiene sentido. Un día así no hacemos esta ruta, por mucho que quisieras fondear aquí.',
          'Toute la côte nord est inutilisable par vent de nord : la houle y entre sans obstacle et le mouillage n’a plus de sens. Ce jour-là, nous ne faisons pas cet itinéraire, quelle que soit votre envie d’y mouiller.',
        ),
      },
      {
        name: 'Cala Xarraca',
        blurb: L(
          'Een inham aan de noordkust met donkere rotsen, ijzerhoudende modder aan de rand en opvallend helder water daartussen.',
          'An inlet on the north coast with dark rock, iron-rich mud along its edge and strikingly clear water in between.',
          'Eine Bucht an der Nordküste mit dunklem Fels, eisenhaltigem Schlamm am Rand und auffallend klarem Wasser dazwischen.',
          'Una ensenada de la costa norte con roca oscura, barro ferruginoso en el borde y un agua llamativamente clara en medio.',
          'Une anse de la côte nord avec de la roche sombre, de la boue ferrugineuse sur les bords et une eau remarquablement claire entre les deux.',
        ),
        why: L(
          'Rotsbodem en helder water maken dit de beste snorkelplek van de route — je ziet er meer dan boven een zandbodem.',
          'Rocky bottom and clear water make this the best snorkelling of the route — you see far more than over sand.',
          'Felsgrund und klares Wasser machen das zum besten Schnorchelrevier der Route — man sieht deutlich mehr als über Sand.',
          'El fondo rocoso y el agua clara hacen de esta la mejor parada de snorkel de la ruta: se ve mucho más que sobre arena.',
          'Fond rocheux et eau claire en font le meilleur spot de snorkeling du parcours — on y voit bien plus que sur du sable.',
        ),
        note: L(
          'De inham is bescheiden van formaat en biedt maar beperkt houvast voor het anker; een schipper zoekt hier bewust een zandplek uit en blijft niet urenlang liggen.',
          'The inlet is modest in size and offers only limited holding for an anchor; a skipper picks a sandy patch deliberately here and does not linger for hours.',
          'Die Bucht ist klein und bietet nur begrenzten Halt für den Anker; ein Skipper sucht hier gezielt eine Sandstelle und bleibt nicht stundenlang liegen.',
          'La ensenada es de tamaño modesto y el agarre para el ancla es limitado; el patrón elige aquí una mancha de arena a propósito y no se queda horas.',
          'L’anse est de taille modeste et la tenue au mouillage y est limitée ; le skipper y choisit délibérément une tache de sable et ne s’attarde pas des heures.',
        ),
      },
      {
        name: 'Portinatx',
        blurb: L(
          'Een reeks kleine baaien in de noordoosthoek van het eiland, met een hoge witte vuurtoren op de kaap ernaast.',
          'A cluster of small coves in the island’s north-east corner, with a tall white lighthouse standing on the headland alongside.',
          'Eine Reihe kleiner Buchten in der Nordostecke der Insel, daneben ein hoher weißer Leuchtturm auf dem Kap.',
          'Un conjunto de calas pequeñas en el extremo noreste de la isla, con un faro blanco y alto en el cabo contiguo.',
          'Un chapelet de petites criques dans l’angle nord-est de l’île, avec un haut phare blanc sur le cap voisin.',
        ),
        why: L(
          'Doordat de baaien in elkaars verlengde liggen en verschillende kanten op kijken, is er bijna altijd wel één die op die dag beschut ligt.',
          'Because the coves sit next to one another facing different ways, there is nearly always one that happens to be sheltered on the day.',
          'Weil die Buchten nebeneinanderliegen und in verschiedene Richtungen zeigen, ist fast immer eine dabei, die an dem Tag geschützt liegt.',
          'Como las calas están una junto a otra y miran en direcciones distintas, casi siempre hay una resguardada ese día.',
          'Comme les criques se suivent en regardant dans des directions différentes, il y en a presque toujours une abritée ce jour-là.',
        ),
        note: L(
          'Uitzondering: wind pal uit het noorden of noordoosten legt ze allemaal tegelijk plat. En let op, dit is het verste punt van de meeste routes — hier stoppen betekent dat er elders een baai afvalt.',
          'The exception: wind straight out of the north or north-east knocks all of them out at once. Also worth knowing, this is the furthest point on most routes — stopping here means a cove elsewhere drops off the list.',
          'Ausnahme: Wind direkt aus Nord oder Nordost legt sie alle gleichzeitig lahm. Und beachte: Das ist der entfernteste Punkt der meisten Routen — hier zu stoppen heißt, dass anderswo eine Bucht entfällt.',
          'La excepción: el viento del norte o noreste franco las inutiliza todas a la vez. Y ten en cuenta que es el punto más lejano de la mayoría de rutas — parar aquí implica que otra cala se cae de la lista.',
          'L’exception : un vent plein nord ou nord-est les met toutes hors service en même temps. À savoir aussi : c’est le point le plus éloigné de la plupart des itinéraires — s’y arrêter signifie qu’une crique saute ailleurs.',
        ),
      },
      {
        name: 'Tagomago',
        blurb: L(
          'Een langgerekt, laag privé-eiland voor de oostkust van Ibiza, met een vuurtoren op de verre punt en verder vooral rots en struikgewas.',
          'A long, low private island off Ibiza’s east coast, with a lighthouse on its far point and otherwise mostly rock and scrub.',
          'Eine langgestreckte, flache Privatinsel vor der Ostküste Ibizas, mit einem Leuchtturm an der fernen Spitze und ansonsten vor allem Fels und Gestrüpp.',
          'Una isla privada, alargada y baja, frente a la costa este de Ibiza, con un faro en su punta más lejana y, por lo demás, roca y matorral.',
          'Une île privée allongée et basse au large de la côte est d’Ibiza, avec un phare à sa pointe éloignée et, pour le reste, surtout de la roche et du maquis.',
        ),
        why: L(
          'Het is een van de weinige plekken rond Ibiza waar je vanaf het water naar iets kijkt dat er niet voor bezoekers ligt — en het water in de luwte ervan is opvallend rustig.',
          'It is one of the few places around Ibiza where you look at something from the water that is not there for visitors — and the water in its lee is notably calm.',
          'Es ist einer der wenigen Orte rund um Ibiza, an denen man vom Wasser aus auf etwas blickt, das nicht für Besucher da ist — und das Wasser in seinem Windschatten ist auffallend ruhig.',
          'Es uno de los pocos lugares alrededor de Ibiza donde miras desde el agua algo que no está puesto para el visitante — y el agua a su abrigo es notablemente tranquila.',
          'C’est l’un des rares endroits autour d’Ibiza où l’on regarde, depuis l’eau, quelque chose qui n’est pas là pour les visiteurs — et l’eau sous son vent est remarquablement calme.',
        ),
        note: L(
          'Het eiland is privébezit: aan land gaan is niet aan de orde, je ankert ervoor en zwemt. In de doorgang tussen het eiland en de kust kan het door de vernauwing behoorlijk rommelen.',
          'The island is privately owned: going ashore is not on the table, you anchor off it and swim. The passage between the island and the mainland can get properly restless where it narrows.',
          'Die Insel ist Privatbesitz: An Land gehen steht nicht zur Debatte, man ankert davor und schwimmt. Der Durchgang zwischen Insel und Küste kann an der Engstelle ordentlich unruhig werden.',
          'La isla es propiedad privada: bajar a tierra no entra en los planes, se fondea delante y se nada. El paso entre la isla y la costa puede moverse bastante donde se estrecha.',
          'L’île est une propriété privée : débarquer n’est pas envisageable, on mouille devant et on se baigne. Le passage entre l’île et la côte peut devenir bien agité là où il se resserre.',
        ),
      },
      {
        name: 'Cala Llonga',
        blurb: L(
          'Een lange, smalle inham aan de oostkust, ingeklemd tussen hoge rotswanden en aan het einde afgesloten door zand.',
          'A long, narrow inlet on the east coast, squeezed between high rock walls and closed off at its head by sand.',
          'Eine lange, schmale Bucht an der Ostküste, eingezwängt zwischen hohen Felswänden und am Ende von Sand abgeschlossen.',
          'Una ensenada larga y estrecha en la costa este, encajada entre paredes rocosas altas y cerrada al fondo por arena.',
          'Une longue anse étroite sur la côte est, encaissée entre de hautes parois rocheuses et fermée au fond par du sable.',
        ),
        why: L(
          'De vorm van de inham vangt wind en golven weg, waardoor het er vaak nog rustig ligt als de rest van de kust al onrustig is. Een prettige laatste stop op de terugweg.',
          'The shape of the inlet takes the wind and waves out of the equation, so it often stays calm here when the rest of the coast has turned restless. A pleasant last stop on the way back.',
          'Die Form der Bucht nimmt Wind und Wellen heraus, sodass es hier oft noch ruhig ist, wenn der Rest der Küste schon unruhig wird. Ein angenehmer letzter Stopp auf dem Rückweg.',
          'La forma de la ensenada quita el viento y las olas de la ecuación, así que suele seguir tranquila cuando el resto de la costa ya se ha movido. Una última parada agradable de vuelta.',
          'La forme de l’anse absorbe le vent et les vagues : elle reste souvent calme quand le reste de la côte s’agite. Une agréable dernière escale au retour.',
        ),
        note: L(
          'Het is een levendige badplaats, dus verwacht geen verlaten baai — wel een betrouwbaar rustige ankerplek als de dag ruwer is uitgepakt dan gehoopt.',
          'It is a busy resort bay, so do not expect solitude — what you do get is a dependably calm anchorage when the day has turned out rougher than hoped.',
          'Es ist eine belebte Badebucht, erwarte also keine Einsamkeit — dafür einen verlässlich ruhigen Ankerplatz, wenn der Tag rauer ausgefallen ist als erhofft.',
          'Es una bahía turística animada, así que no esperes soledad — sí un fondeadero fiablemente tranquilo cuando el día ha salido más movido de lo previsto.',
          'C’est une baie balnéaire animée : n’espérez pas la solitude — mais un mouillage fiablement calme quand la journée s’est révélée plus agitée que prévu.',
        ),
      },
    ],
    note: L(
      'Deze route is ook onze uitwijkroute. Ligt het zuiden er op jullie dag slecht bij, dan varen we hem in omgekeerde richting: eerst de oostkust en Tagomago, daarna zo ver naar het noorden als aangenaam blijft. Reken erop dat je de hele lijst niet in één dag haalt; drie van deze stops is een goede, ontspannen dag.',
      'This route doubles as our fallback. If the south is in poor shape on your day we run it the other way round: the east coast and Tagomago first, then as far north as stays pleasant. Do not count on covering the whole list in one day; three of these stops makes a good, unhurried day.',
      'Diese Route ist zugleich unsere Ausweichroute. Ist der Süden an eurem Tag schlecht dran, fahren wir sie andersherum: zuerst die Ostküste und Tagomago, dann so weit nach Norden, wie es angenehm bleibt. Rechnet nicht damit, die ganze Liste an einem Tag zu schaffen; drei dieser Stopps ergeben einen guten, entspannten Tag.',
      'Esta ruta es además nuestra alternativa. Si el sur está feo vuestro día, la hacemos al revés: primero la costa este y Tagomago, y luego tan al norte como resulte agradable. No cuentes con hacer la lista entera en un día; tres de estas paradas dan un día bueno y sin prisas.',
      'Cet itinéraire sert aussi de solution de repli. Si le sud est mauvais le jour venu, nous le faisons en sens inverse : d’abord la côte est et Tagomago, puis aussi loin au nord que cela reste agréable. Ne comptez pas tout enchaîner en une journée ; trois de ces escales font une belle journée sans précipitation.',
    ),
  },
]
