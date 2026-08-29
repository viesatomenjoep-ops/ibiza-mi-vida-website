import type { Locale } from './seo'
import type { FaqItem } from './faq-content'

// ── Per-PAGE FAQ content (5 locales) ───────────────────────────────────
// Distinct from the sitewide FAQ_GROUPS in ./faq-content.ts: these blocks
// belong to one landing page each and are keyed by page slug. Every entry
// feeds BOTH the visible accordion on that page AND the FAQPage JSON-LD in
// its <head>, so the text is quoted verbatim by search engines and AI
// assistants.
//
// HARD RULE — every claim here must be verifiable and true about our own
// operation. Never invent prices, departure times, timetables, duration
// promises, phone numbers or operator names, and never call anything free.
// Where a real figure would belong, answer usefully without it and point the
// reader to WhatsApp, where we confirm the current rate or condition before
// booking. Booking a private charter runs through WhatsApp, not an instant
// online checkout.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const PAGE_FAQ: Record<string, FaqItem[]> = {
  'private-boat-charters': [
    {
      q: L(
        'Heb ik een vaarbewijs nodig om een privéboot op Ibiza te huren?',
        'Do I need a boat licence to charter a private boat in Ibiza?',
        'Brauche ich einen Bootsführerschein, um auf Ibiza ein Privatboot zu chartern?',
        '¿Necesito licencia de navegación para alquilar un barco privado en Ibiza?',
        'Ai-je besoin d’un permis bateau pour louer un bateau privé à Ibiza ?',
      ),
      a: L(
        'Voor de meeste van onze charters niet, omdat er een schipper meevaart — dan hoef jij niets aan te tonen. Wil je zelf varen, dan geldt de Spaanse regelgeving: voor grotere en krachtigere boten is een geldig vaarbewijs verplicht, terwijl een deel van de kleinere boten zonder mag. Welke categorie jouw boot valt, laten we je vooraf via WhatsApp precies weten.',
        'For most of our charters you do not, because a skipper comes along — nothing to prove on your side. If you want to drive yourself, Spanish rules apply: larger and more powerful boats require a valid licence, while some smaller boats may be rented without one. We tell you over WhatsApp exactly which category the boat you are looking at falls into.',
        'Bei den meisten unserer Charter nicht, denn ein Skipper fährt mit — du musst nichts nachweisen. Willst du selbst fahren, gilt spanisches Recht: für größere und stärkere Boote ist ein gültiger Führerschein Pflicht, ein Teil der kleineren Boote darf ohne gemietet werden. Wir sagen dir per WhatsApp genau, in welche Kategorie dein Boot fällt.',
        'En la mayoría de nuestros chárteres no, porque va un patrón a bordo y tú no tienes que acreditar nada. Si quieres navegar tú mismo, se aplica la normativa española: los barcos más grandes y potentes exigen titulación válida, mientras que algunos barcos pequeños se pueden alquilar sin ella. Por WhatsApp te decimos exactamente en qué categoría entra tu barco.',
        'Pour la plupart de nos charters, non : un skipper vous accompagne et vous n’avez rien à justifier. Si vous souhaitez naviguer vous-même, la réglementation espagnole s’applique : les bateaux plus grands et plus puissants exigent un permis valide, tandis que certains petits bateaux se louent sans. Nous vous précisons par WhatsApp la catégorie exacte de votre bateau.',
      ),
    },
    {
      q: L(
        'Vaart er een schipper mee of stuur ik zelf?',
        'Does the boat come with a skipper, or do I drive it myself?',
        'Fährt ein Skipper mit oder steuere ich selbst?',
        '¿El barco lleva patrón o lo piloto yo?',
        'Le bateau est-il avec skipper ou dois-je le piloter moi-même ?',
      ),
      a: L(
        'Allebei kan. Standaard boeken we met een lokale schipper: hij kent de baaien, weet waar de ankergrond goed is en past de route aan op de wind van die dag — dat scheelt in de praktijk uren zoeken. Wil je liever zelf varen, dan kijken we welke boten daarvoor in aanmerking komen en wat je daarvoor nodig hebt. Geef bij je aanvraag door wat je voorkeur is.',
        'Both are possible. By default we book with a local skipper: he knows the coves, knows where the anchoring holds and adapts the route to the wind that day — in practice that saves hours of guessing. If you would rather drive yourself, we look at which boats qualify and what you need for them. Just tell us your preference when you enquire.',
        'Beides ist möglich. Standardmäßig buchen wir mit lokalem Skipper: Er kennt die Buchten, weiß, wo der Ankergrund hält, und passt die Route an den Wind des Tages an — das spart in der Praxis Stunden. Willst du lieber selbst fahren, prüfen wir, welche Boote dafür in Frage kommen und was du dafür brauchst. Sag uns einfach bei der Anfrage, was du bevorzugst.',
        'Ambas opciones existen. Por defecto reservamos con patrón local: conoce las calas, sabe dónde agarra el ancla y adapta la ruta al viento de ese día — en la práctica ahorra horas de búsqueda. Si prefieres navegar tú, miramos qué barcos lo permiten y qué necesitas. Dinos tu preferencia al hacer la consulta.',
        'Les deux sont possibles. Par défaut, nous réservons avec un skipper local : il connaît les criques, sait où le mouillage tient et adapte l’itinéraire au vent du jour — cela évite des heures de recherche. Si vous préférez piloter, nous regardons quels bateaux le permettent et ce qu’il vous faut. Indiquez simplement votre préférence lors de la demande.',
      ),
    },
    {
      q: L(
        'Wat zit er bij de prijs in en wat kost extra?',
        'What is included in a private charter and what costs extra?',
        'Was ist im Preis enthalten und was kostet extra?',
        '¿Qué incluye el chárter privado y qué cuesta aparte?',
        'Qu’est-ce qui est inclus dans un charter privé et qu’est-ce qui coûte en plus ?',
      ),
      a: L(
        'In de basis: de boot voor de afgesproken tijd, de schipper en de verzekering. Brandstof, havengeld, catering, drank en watersportspullen verschillen per boot — soms zit het erbij, soms rekenen we het apart af. Omdat dat per boot en per seizoen anders ligt, sturen we je vooraf via WhatsApp een uitsplitsing, zodat je precies weet waar je aan toe bent voordat je bevestigt.',
        'The basics: the boat for the agreed time, the skipper and insurance. Fuel, port fees, catering, drinks and water toys vary per boat — sometimes they are bundled, sometimes billed separately. Because it differs per boat and per season, we send you a written breakdown over WhatsApp so you know exactly where you stand before you confirm.',
        'Grundsätzlich: das Boot für die vereinbarte Zeit, der Skipper und die Versicherung. Treibstoff, Hafengebühren, Catering, Getränke und Wassersportgeräte unterscheiden sich je nach Boot — mal inklusive, mal separat. Da das je Boot und Saison variiert, schicken wir dir vorab per WhatsApp eine Aufstellung, damit du vor der Bestätigung genau Bescheid weißt.',
        'La base: el barco durante el tiempo acordado, el patrón y el seguro. Combustible, tasas de puerto, catering, bebidas y material acuático varían según el barco — a veces van incluidos, a veces se facturan aparte. Como cambia por barco y por temporada, te enviamos el desglose por WhatsApp para que lo sepas todo antes de confirmar.',
        'La base : le bateau pour la durée convenue, le skipper et l’assurance. Carburant, frais de port, traiteur, boissons et matériel nautique varient selon le bateau — parfois inclus, parfois facturés à part. Comme cela dépend du bateau et de la saison, nous vous envoyons le détail par WhatsApp avant que vous confirmiez.',
      ),
    },
    {
      q: L(
        'Met hoeveel mensen kunnen we mee?',
        'How many people can join a private boat charter?',
        'Mit wie vielen Personen können wir an Bord?',
        '¿Cuántas personas pueden ir en un chárter privado?',
        'Combien de personnes peuvent embarquer sur un charter privé ?',
      ),
      a: L(
        'Elke boot heeft een wettelijk maximum aantal opvarenden dat op de papieren staat; daar wijken we nooit vanaf. Belangrijker is het comfortabele aantal: een boot die op papier tien man mag vervoeren, voelt met acht een stuk ruimer als je een dag lang wilt zonnen en zwemmen. Geef je groepsgrootte door, dan wijzen we de boten aan waar jullie écht goed op zitten.',
        'Every boat has a legal maximum number of people on board, stated on its papers, and we never go past it. The more useful number is the comfortable one: a boat licensed for ten feels considerably roomier with eight if you plan to sunbathe and swim all day. Tell us your group size and we will point you to the boats that genuinely suit it.',
        'Jedes Boot hat eine gesetzlich zulässige Höchstzahl an Personen, die in den Papieren steht — davon weichen wir nie ab. Wichtiger ist die komfortable Zahl: Ein Boot für zehn Personen fühlt sich mit acht deutlich großzügiger an, wenn ihr den ganzen Tag sonnen und schwimmen wollt. Nenn uns eure Gruppengröße, und wir zeigen euch die passenden Boote.',
        'Cada barco tiene un máximo legal de personas a bordo, indicado en su documentación, y nunca lo superamos. Más útil es el número cómodo: un barco autorizado para diez va mucho más holgado con ocho si vais a tomar el sol y bañaros todo el día. Dinos el tamaño del grupo y te señalamos los barcos que de verdad encajan.',
        'Chaque bateau a un nombre maximal de personnes autorisé, indiqué sur ses papiers, et nous ne le dépassons jamais. Le chiffre le plus utile reste le nombre confortable : un bateau homologué pour dix est bien plus agréable à huit si vous comptez bronzer et nager toute la journée. Dites-nous la taille du groupe et nous vous orientons.',
      ),
    },
    {
      q: L(
        'Wat gebeurt er als het te hard waait?',
        'What happens if the wind is too strong on the day?',
        'Was passiert, wenn es zu stark weht?',
        '¿Qué pasa si hace demasiado viento ese día?',
        'Que se passe-t-il s’il y a trop de vent le jour même ?',
      ),
      a: L(
        'Dan varen we niet zoals gepland, en dat zeggen we ook eerlijk. Ibiza kan bij harde noordenwind onrustig worden: de westkust en Es Vedrà zijn dan geen pretje, terwijl de zuidkant vaak nog prima ligt — en andersom bij zuidenwind. De schipper besluit op de ochtend zelf. Meestal draaien we de route om naar de beschutte kant; is dat ook geen optie, dan zoeken we samen een andere datum. Veiligheid gaat altijd voor.',
        'Then we do not sail the plan we agreed, and we will say so honestly. In a strong northerly Ibiza gets choppy: the west coast and Es Vedrà become genuinely unpleasant while the south side often stays fine — and the reverse in a southerly. The skipper makes the call on the morning itself. Usually we flip the route to the sheltered side; if that is not workable either, we look for another date together. Safety always comes first.',
        'Dann fahren wir nicht wie geplant — und das sagen wir dir ehrlich. Bei starkem Nordwind wird es rund um Ibiza unruhig: die Westküste und Es Vedrà sind dann kein Vergnügen, während die Südseite oft ruhig bleibt — bei Südwind umgekehrt. Der Skipper entscheidet am Morgen. Meist drehen wir die Route auf die geschützte Seite; geht auch das nicht, suchen wir gemeinsam ein anderes Datum. Sicherheit geht immer vor.',
        'Entonces no navegamos según lo previsto, y te lo decimos con franqueza. Con viento fuerte del norte Ibiza se pone movida: la costa oeste y Es Vedrà dejan de ser agradables mientras el sur suele aguantar bien — y al revés con viento del sur. El patrón decide esa misma mañana. Normalmente giramos la ruta hacia el lado resguardado; si tampoco es viable, buscamos otra fecha juntos. La seguridad manda.',
        'Nous ne naviguons alors pas comme prévu, et nous vous le disons franchement. Par fort vent de nord, Ibiza devient agitée : la côte ouest et Es Vedrà ne sont plus agréables, alors que le sud reste souvent praticable — et inversement par vent de sud. Le skipper décide le matin même. En général nous inversons l’itinéraire vers le côté abrité ; si ce n’est pas possible, nous cherchons ensemble une autre date. La sécurité prime.',
      ),
    },
    {
      q: L(
        'Hoe ver van tevoren moet ik boeken?',
        'How far in advance should I book a private boat?',
        'Wie weit im Voraus sollte ich buchen?',
        '¿Con cuánta antelación debo reservar?',
        'Combien de temps à l’avance faut-il réserver ?',
      ),
      a: L(
        'Het seizoen loopt ruwweg van mei tot oktober, en in de piekweken zijn de populairste boten weken van tevoren weg — zeker in het weekend. Zit je vast aan één specifieke datum of een grote groep, boek dan zo vroeg mogelijk. Last minute lukt vaak nog wel, alleen kies je dan uit wat er over is. App ons met je datum, dan checken we meteen de actuele beschikbaarheid.',
        'The season runs roughly from May to October, and in the peak weeks the most popular boats are gone weeks ahead — especially at weekends. If you are locked to one specific date or travelling with a big group, book as early as you can. Last minute often still works, you simply choose from what is left. Message us with your date and we will check live availability right away.',
        'Die Saison läuft etwa von Mai bis Oktober, und in den Spitzenwochen sind die beliebtesten Boote Wochen im Voraus weg — vor allem am Wochenende. Bist du an ein bestimmtes Datum oder eine große Gruppe gebunden, buche so früh wie möglich. Last Minute klappt oft noch, dann wählst du aber aus dem Rest. Schreib uns dein Datum, wir prüfen sofort die aktuelle Verfügbarkeit.',
        'La temporada va aproximadamente de mayo a octubre, y en las semanas punta los barcos más solicitados vuelan con semanas de antelación — sobre todo en fin de semana. Si dependes de una fecha concreta o vais en grupo grande, reserva cuanto antes. A última hora suele haber opciones, pero eliges entre lo que queda. Escríbenos tu fecha y miramos la disponibilidad al momento.',
        'La saison s’étend en gros de mai à octobre, et en pleine saison les bateaux les plus demandés partent des semaines à l’avance — surtout le week-end. Si vous êtes bloqué sur une date précise ou en grand groupe, réservez au plus tôt. Le dernier moment fonctionne souvent, mais vous choisissez parmi ce qui reste. Envoyez-nous votre date, nous vérifions la disponibilité immédiatement.',
      ),
    },
  ],

  boats: [
    {
      q: L(
        'Wat is het verschil tussen de bootsoorten die jullie aanbieden?',
        'What is the difference between the types of boat you offer?',
        'Was ist der Unterschied zwischen den angebotenen Bootstypen?',
        '¿Qué diferencia hay entre los tipos de barco que ofrecéis?',
        'Quelle est la différence entre les types de bateaux proposés ?',
      ),
      a: L(
        'Grof gezegd: een motorjacht is snel en brengt je in korte tijd ver — handig als je Formentera of de westkust wilt halen. Een catamaran ligt breed en stabiel, met veel plek om languit te liggen, maar vaart rustiger. Een rubberboot of kleine speedboot is wendbaar en betaalbaar en komt in kleine baaien waar grotere boten niet kunnen liggen. Zeilboten zijn het mooiste als je de dag zelf het doel is.',
        'Broadly: a motor yacht is fast and covers distance quickly — useful if you want to reach Formentera or the west coast. A catamaran sits wide and stable with plenty of room to stretch out, but travels more slowly. A RIB or small speedboat is nimble and affordable and gets into little coves where bigger boats cannot anchor. Sailing boats are the loveliest when the day itself, rather than the destination, is the point.',
        'Grob gesagt: Eine Motoryacht ist schnell und bringt dich in kurzer Zeit weit — praktisch für Formentera oder die Westküste. Ein Katamaran liegt breit und stabil mit viel Liegefläche, fährt aber gemächlicher. Ein Schlauchboot oder kleines Speedboot ist wendig und günstiger und kommt in kleine Buchten, in denen größere Boote nicht ankern können. Segelboote sind am schönsten, wenn der Tag selbst das Ziel ist.',
        'A grandes rasgos: un yate a motor es rápido y cubre distancias en poco tiempo — útil si quieres llegar a Formentera o a la costa oeste. Un catamarán es ancho y estable, con mucho sitio para tumbarse, pero navega más despacio. Una neumática o lancha pequeña es ágil y más asequible, y entra en calas donde los barcos grandes no pueden fondear. Los veleros son lo más bonito cuando el día en sí es el plan.',
        'En résumé : un yacht à moteur est rapide et couvre de la distance — pratique pour rejoindre Formentera ou la côte ouest. Un catamaran est large et stable, avec beaucoup de place pour s’allonger, mais navigue plus lentement. Un semi-rigide ou petit bateau à moteur est maniable et plus abordable, et entre dans de petites criques inaccessibles aux gros bateaux. Les voiliers sont les plus agréables quand la journée elle-même est le but.',
      ),
    },
    {
      q: L(
        'Welke boot is het beste voor een gezin met kinderen?',
        'Which boat works best for a family with young children?',
        'Welches Boot eignet sich am besten für eine Familie mit Kindern?',
        '¿Qué barco es mejor para una familia con niños?',
        'Quel bateau convient le mieux à une famille avec enfants ?',
      ),
      a: L(
        'Een brede, stabiele boot met schaduw en een lage badplatform-instap. Kinderen worden zeeziek van een boot die stampt, niet van een boot die vaart — dus kies liever comfort dan snelheid, en plan een kortere tocht langs beschutte baaien in plaats van de hele westkust. Zeg bij je aanvraag hoe oud de kinderen zijn; dan sturen we de boten waarvan we weten dat gezinnen er goed op zitten.',
        'A wide, stable boat with shade and an easy step down from the bathing platform. Children get seasick from a boat that pitches, not from a boat that moves — so choose comfort over speed, and plan a shorter run along sheltered bays rather than the whole west coast. Tell us the children’s ages when you enquire and we will send the boats we know families do well on.',
        'Ein breites, stabiles Boot mit Schatten und leichtem Einstieg über die Badeplattform. Kindern wird von einem stampfenden Boot übel, nicht vom Fahren an sich — wählt also Komfort statt Tempo und plant eine kürzere Tour entlang geschützter Buchten statt der ganzen Westküste. Nenn uns bei der Anfrage das Alter der Kinder; wir schicken die Boote, mit denen Familien gute Erfahrungen machen.',
        'Un barco ancho y estable, con sombra y una entrada fácil desde la plataforma de baño. A los niños les marea un barco que cabecea, no el hecho de navegar — así que prioriza comodidad sobre velocidad y planifica una salida más corta por calas resguardadas en lugar de toda la costa oeste. Dinos la edad de los niños y te enviamos los barcos que funcionan bien con familias.',
        'Un bateau large et stable, avec de l’ombre et un accès facile depuis la plateforme de bain. Les enfants ont le mal de mer à cause du tangage, pas de la navigation en soi — privilégiez donc le confort à la vitesse et prévoyez une sortie plus courte le long de criques abritées plutôt que toute la côte ouest. Indiquez l’âge des enfants et nous vous enverrons les bateaux adaptés.',
      ),
    },
    {
      q: L(
        'Waar vertrekken de boten vandaan?',
        'Where do the boats depart from?',
        'Von wo fahren die Boote ab?',
        '¿Desde dónde salen los barcos?',
        'D’où partent les bateaux ?',
      ),
      a: L(
        'Vanuit de jachthavens rond het eiland, waaronder die van Ibiza-stad. Welke haven het wordt, hangt af van de boot die je kiest en van waar je verblijft — soms scheelt een andere vertrekhaven je een halfuur rijden of juist een halfuur varen. We bevestigen het exacte vertrekpunt en het meldtijdstip bij je boeking via WhatsApp, met een locatiepin erbij zodat je het niet hoeft te zoeken.',
        'From marinas around the island, including Ibiza Town. Which one depends on the boat you pick and where you are staying — sometimes a different departure marina saves you half an hour of driving, or half an hour of sailing. We confirm the exact departure point and the time to be there when you book, over WhatsApp, with a location pin so you are not hunting for it.',
        'Von den Marinas rund um die Insel, unter anderem in Ibiza-Stadt. Welcher Hafen es wird, hängt vom gewählten Boot und deinem Standort ab — manchmal spart ein anderer Starthafen eine halbe Stunde Fahrt oder eine halbe Stunde Seeweg. Den genauen Treffpunkt und die Uhrzeit bestätigen wir bei der Buchung per WhatsApp, inklusive Standort-Pin.',
        'Desde los puertos deportivos repartidos por la isla, incluido el de Ibiza ciudad. Cuál será depende del barco que elijas y de dónde te alojes — a veces otro puerto de salida te ahorra media hora de coche o media hora de navegación. Confirmamos el punto exacto y la hora de encuentro al reservar, por WhatsApp y con ubicación compartida.',
        'Depuis les marinas autour de l’île, dont celle d’Ibiza-ville. Le port dépend du bateau choisi et de votre lieu de séjour — un autre port de départ peut vous faire gagner une demi-heure de route ou de navigation. Nous confirmons le point de départ exact et l’heure de rendez-vous lors de la réservation, par WhatsApp, avec la localisation.',
      ),
    },
    {
      q: L(
        'Wat moet ik meenemen aan boord?',
        'What should I bring on board?',
        'Was sollte ich an Bord mitnehmen?',
        '¿Qué debo llevar a bordo?',
        'Que faut-il emporter à bord ?',
      ),
      a: L(
        'Zwemkleding, een handdoek, zonnebrand met hoge factor, een pet of hoed en een lichte trui voor de terugtocht — op het water koelt het sneller af dan je denkt. Neem je spullen mee in een zachte tas in plaats van een koffer, want harde bagage past slecht weg. Draag geen zwarte zolen: die laten strepen op het dek na. En je paspoort of ID, dat wil de haven soms zien.',
        'Swimwear, a towel, high-factor sunscreen, a cap or hat and a light layer for the way back — it cools down faster on the water than you expect. Pack into a soft bag rather than a case, because hard luggage stows badly. Skip black-soled shoes: they leave marks on the deck. And bring your passport or ID, as the marina sometimes asks for it.',
        'Badesachen, Handtuch, Sonnencreme mit hohem Schutzfaktor, Kappe oder Hut und einen leichten Pulli für die Rückfahrt — auf dem Wasser kühlt es schneller ab als gedacht. Pack lieber in eine weiche Tasche als in einen Koffer, Hartschalengepäck lässt sich schlecht verstauen. Keine Schuhe mit schwarzen Sohlen: die hinterlassen Streifen an Deck. Und Ausweis mitnehmen, im Hafen wird er manchmal verlangt.',
        'Bañador, toalla, protector solar de factor alto, gorra o sombrero y algo ligero de manga larga para la vuelta — en el mar refresca antes de lo que crees. Lleva las cosas en una bolsa blanda, no en maleta rígida: cuesta guardarla. Evita suelas negras, dejan marcas en la cubierta. Y el pasaporte o DNI, que a veces lo piden en el puerto.',
        'Maillot de bain, serviette, crème solaire haute protection, casquette ou chapeau et une couche légère pour le retour — il fait plus frais sur l’eau qu’on ne l’imagine. Prenez un sac souple plutôt qu’une valise rigide, qui se range mal. Évitez les semelles noires : elles marquent le pont. Et votre passeport ou carte d’identité, parfois demandé au port.',
      ),
    },
    {
      q: L(
        'Word ik zeeziek? Hoe ruw is het rond Ibiza?',
        'Will I get seasick — how rough does the sea get around Ibiza?',
        'Werde ich seekrank? Wie rau ist die See rund um Ibiza?',
        '¿Me voy a marear? ¿Cómo está el mar alrededor de Ibiza?',
        'Vais-je avoir le mal de mer ? La mer est-elle agitée autour d’Ibiza ?',
      ),
      a: L(
        'Meestal valt het mee: in de zomer is de ochtend vaak spiegelglad en trekt de wind pas in de middag aan. Maar we doen niet alsof het altijd zo is. Bij aanhoudende wind kan het rond de kapen flink deinen, en dan is een tocht naar Es Vedrà of Formentera echt onrustig. Ben je gevoelig, vaar dan ’s ochtends, blijf aan dek, kijk naar de horizon en neem eventueel vooraf een middel. De schipper zegt eerlijk wanneer een route beter kan wachten.',
        'Usually it is fine: in summer the morning is often glassy and the wind only builds in the afternoon. But we will not pretend it is always like that. In sustained wind it can heave properly around the headlands, and then a run to Es Vedrà or Formentera really is bumpy. If you are sensitive, sail in the morning, stay on deck, watch the horizon and consider taking something beforehand. The skipper will tell you honestly when a route is better left for another day.',
        'Meist ist es angenehm: Im Sommer ist der Morgen oft spiegelglatt, der Wind frischt erst nachmittags auf. Aber wir tun nicht so, als wäre das immer so. Bei anhaltendem Wind kann es an den Kaps ordentlich schaukeln, und eine Fahrt nach Es Vedrà oder Formentera wird dann wirklich unruhig. Wenn du empfindlich bist: morgens fahren, an Deck bleiben, den Horizont fixieren und ggf. vorher ein Mittel nehmen. Der Skipper sagt ehrlich, wann eine Route besser warten sollte.',
        'Normalmente va bien: en verano la mañana suele estar como un plato y el viento entra por la tarde. Pero no vamos a fingir que siempre es así. Con viento sostenido puede moverse bastante en los cabos, y entonces una salida a Es Vedrà o Formentera es realmente movida. Si eres sensible: navega por la mañana, quédate en cubierta, mira al horizonte y valora tomar algo antes. El patrón te dirá con sinceridad cuándo conviene dejar una ruta para otro día.',
        'En général tout va bien : en été, la matinée est souvent d’huile et le vent ne se lève que l’après-midi. Mais nous ne prétendrons pas que c’est toujours le cas. Par vent installé, cela peut bien remuer autour des caps, et une sortie vers Es Vedrà ou Formentera devient vraiment agitée. Si vous y êtes sensible : partez le matin, restez sur le pont, fixez l’horizon et envisagez un traitement préventif. Le skipper vous dira honnêtement quand mieux vaut reporter un itinéraire.',
      ),
    },
    {
      q: L(
        'Hoe kies ik de juiste boot als ik dit nog nooit heb gedaan?',
        'How do I choose the right boat if I have never done this before?',
        'Wie wähle ich das richtige Boot, wenn ich das noch nie gemacht habe?',
        '¿Cómo elijo el barco adecuado si nunca lo he hecho?',
        'Comment choisir le bon bateau quand on n’a jamais fait ça ?',
      ),
      a: L(
        'Begin niet bij de boot maar bij de dag die je voor je ziet. Vier vragen zijn genoeg: met hoeveel mensen, hoeveel uur, wil je vooral zwemmen en luieren of echt afstand maken, en hoeveel wil je uitgeven. Met die antwoorden houden we er meestal twee of drie over die passen, en leggen we uit waarom. App ons gerust zonder dat je al iets weet — daar zijn we voor, en we zeggen het ook als je beter een andere dag of een ander type boot kunt nemen.',
        'Do not start with the boat, start with the day you are picturing. Four questions are enough: how many people, how many hours, do you mainly want to swim and lounge or actually cover distance, and what do you want to spend. With those answers we usually narrow it to two or three that fit, and explain why. Message us even if you know nothing yet — that is what we are here for, and we will also say when a different day or a different type of boat would serve you better.',
        'Fang nicht beim Boot an, sondern bei dem Tag, den du dir vorstellst. Vier Fragen genügen: wie viele Personen, wie viele Stunden, vor allem schwimmen und faulenzen oder wirklich Strecke machen, und welches Budget. Mit diesen Antworten bleiben meist zwei oder drei passende Boote übrig, und wir erklären warum. Schreib uns ruhig, ohne dass du schon etwas weißt — dafür sind wir da. Wir sagen auch, wenn ein anderer Tag oder Bootstyp besser passt.',
        'No empieces por el barco, empieza por el día que te imaginas. Bastan cuatro preguntas: cuántos sois, cuántas horas, si queréis sobre todo bañaros y descansar o realmente recorrer distancia, y qué presupuesto manejáis. Con eso normalmente quedan dos o tres opciones que encajan, y te explicamos por qué. Escríbenos aunque no tengas nada claro — para eso estamos, y también te diremos si otro día u otro tipo de barco te conviene más.',
        'Ne commencez pas par le bateau, mais par la journée que vous imaginez. Quatre questions suffisent : combien de personnes, combien d’heures, plutôt baignade et farniente ou vraiment de la distance, et quel budget. Avec ces réponses, il reste en général deux ou trois bateaux adaptés, et nous expliquons pourquoi. Écrivez-nous même sans rien savoir — c’est notre rôle, et nous vous dirons aussi si un autre jour ou un autre type de bateau vous conviendrait mieux.',
      ),
    },
  ],

  'ferry-formentera': [
    {
      q: L(
        'Hoe lang duurt de overtocht van Ibiza naar Formentera?',
        'How long does the crossing from Ibiza to Formentera take?',
        'Wie lange dauert die Überfahrt von Ibiza nach Formentera?',
        '¿Cuánto dura la travesía de Ibiza a Formentera?',
        'Combien de temps dure la traversée d’Ibiza à Formentera ?',
      ),
      a: L(
        'Met de snelle ferry ben je er in ongeveer een halfuur. Langzamere schepen en boten die eerst nog een tussenstop maken, doen er langer over. De vaartijden verschillen per rederij en per periode van het seizoen, dus we sturen je de actuele afvaarten via WhatsApp in plaats van een schema te noemen dat morgen alweer anders is.',
        'On the fast ferry it is roughly half an hour. Slower vessels, and boats that make a stop on the way, take longer. Sailing times differ per operator and per part of the season, so we send you the current departures over WhatsApp rather than quoting a timetable that may already have changed by tomorrow.',
        'Mit der Schnellfähre bist du in etwa einer halben Stunde da. Langsamere Schiffe und Boote mit Zwischenstopp brauchen länger. Die Fahrzeiten unterscheiden sich je nach Reederei und Saisonabschnitt — deshalb schicken wir dir die aktuellen Abfahrten per WhatsApp, statt einen Fahrplan zu nennen, der morgen schon anders sein kann.',
        'En ferry rápido se tarda alrededor de media hora. Los barcos más lentos, y los que hacen una parada por el camino, tardan más. Los horarios varían según la naviera y el momento de la temporada, así que te enviamos las salidas actualizadas por WhatsApp en vez de citar un horario que mañana puede haber cambiado.',
        'En ferry rapide, comptez environ une demi-heure. Les navires plus lents, et ceux qui font une escale, mettent plus longtemps. Les horaires varient selon la compagnie et la période de la saison : nous vous envoyons donc les départs à jour par WhatsApp plutôt que d’annoncer un horaire déjà obsolète demain.',
      ),
    },
    {
      q: L(
        'Is de ferry de enige manier om op Formentera te komen?',
        'Is the ferry the only way to reach Formentera?',
        'Ist die Fähre der einzige Weg nach Formentera?',
        '¿El ferry es la única forma de llegar a Formentera?',
        'Le ferry est-il le seul moyen d’aller à Formentera ?',
      ),
      a: L(
        'Ja, over water kom je er alleen. Formentera heeft geen vliegveld, dus iedereen — inwoners, bevoorrading, dagjesmensen — gaat per boot. Praktisch heb je twee opties: de lijnferry vanaf Ibiza, of je eigen gehuurde boot die je bij een baai voor anker legt. De ferry is de eenvoudigste keus; met een privéboot bepaal je zelf waar je stopt.',
        'Yes — the only way there is by water. Formentera has no airport, so everyone reaches it by boat: residents, supplies, day trippers alike. In practice you have two options: the scheduled ferry from Ibiza, or your own chartered boat anchoring off a cove. The ferry is the simplest choice; a private boat lets you decide where you stop.',
        'Ja, du kommst nur über das Wasser hin. Formentera hat keinen Flughafen — alle reisen per Schiff an: Einwohner, Warenlieferungen, Tagesgäste. Praktisch hast du zwei Möglichkeiten: die Linienfähre ab Ibiza oder dein eigenes gechartertes Boot, das vor einer Bucht ankert. Die Fähre ist am einfachsten; mit einem Privatboot bestimmst du selbst, wo du hältst.',
        'Sí, solo se llega por mar. Formentera no tiene aeropuerto, así que todo el mundo llega en barco: residentes, suministros y visitantes de un día. En la práctica tienes dos opciones: el ferry regular desde Ibiza, o tu propio barco alquilado fondeando frente a una cala. El ferry es lo más sencillo; con barco privado decides tú dónde parar.',
        'Oui, on n’y accède que par la mer. Formentera n’a pas d’aéroport : tout le monde y arrive en bateau, habitants, marchandises et visiteurs d’un jour. Concrètement, deux options : le ferry régulier depuis Ibiza, ou votre propre bateau loué mouillant devant une crique. Le ferry est le plus simple ; le bateau privé vous laisse choisir vos escales.',
      ),
    },
    {
      q: L(
        'Kun je Formentera in één dag doen vanaf Ibiza?',
        'Can you do Formentera as a day trip from Ibiza?',
        'Kann man Formentera als Tagesausflug von Ibiza machen?',
        '¿Se puede ir a Formentera en el día desde Ibiza?',
        'Peut-on faire Formentera à la journée depuis Ibiza ?',
      ),
      a: L(
        'Zeker, dat is verreweg de meest gemaakte trip. Ga wel vroeg: dan sta je niet in de rij, heb je nog keuze in scooters en ligt het strand er ’s ochtends op zijn mooist bij. Eén ding om rekening mee te houden: het eiland is groter dan het op de kaart lijkt, dus probeer niet alles op één dag te zien. Twee stranden en een lunch is een prettige dag; vijf stranden is haasten.',
        'Absolutely — it is by far the most common trip people make. Go early, though: no queue, more choice of scooters, and the beaches look their best in the morning. One thing to reckon with: the island is bigger than it looks on the map, so do not try to see all of it in a day. Two beaches and a long lunch makes for a lovely day; five beaches means rushing.',
        'Auf jeden Fall — das ist mit Abstand der häufigste Ausflug. Fahr aber früh: keine Schlange, mehr Auswahl bei den Rollern, und morgens sind die Strände am schönsten. Eines solltest du bedenken: Die Insel ist größer, als sie auf der Karte wirkt — versuch also nicht, alles an einem Tag zu sehen. Zwei Strände und ein ausgiebiges Mittagessen ergeben einen schönen Tag; fünf Strände bedeuten Hetze.',
        'Sin duda, es con diferencia la excursión más habitual. Eso sí, ve temprano: sin colas, más opciones de motos y las playas están en su mejor momento por la mañana. Ten en cuenta algo: la isla es más grande de lo que parece en el mapa, así que no intentes verlo todo en un día. Dos playas y una comida tranquila son un día redondo; cinco playas son prisas.',
        'Tout à fait — c’est de loin l’excursion la plus courante. Partez tôt : pas de file d’attente, plus de choix de scooters, et les plages sont au mieux le matin. Un point à retenir : l’île est plus grande qu’elle n’en a l’air sur la carte, n’essayez donc pas de tout voir en une journée. Deux plages et un long déjeuner font une belle journée ; cinq plages, c’est de la course.',
      ),
    },
    {
      q: L(
        'Wat kun je doen zodra je op Formentera aankomt?',
        'What is there to do once you arrive in Formentera?',
        'Was kann man machen, sobald man in Formentera ankommt?',
        '¿Qué se puede hacer al llegar a Formentera?',
        'Que faire une fois arrivé à Formentera ?',
      ),
      a: L(
        'De meeste mensen huren bij de haven meteen een scooter, fiets of auto en rijden naar de stranden aan de noord- en oostkant, waar het water ondiep en helder is. Verder: de vuurtoren aan de oostpunt, het zoutmeer, een lange lunch bij een strandtent en de markt in het dorp. Het is een klein, rustig eiland — de charme zit in weinig doen op een mooie plek, niet in een lijstje afwerken.',
        'Most people pick up a scooter, bike or car right by the port and ride out to the beaches on the north and east side, where the water is shallow and clear. Beyond that: the lighthouse on the eastern tip, the salt lagoons, a long lunch at a beach shack and the village market. It is a small, quiet island — the charm is in doing very little somewhere beautiful, not in ticking off a list.',
        'Die meisten mieten direkt am Hafen einen Roller, ein Fahrrad oder ein Auto und fahren zu den Stränden im Norden und Osten, wo das Wasser flach und klar ist. Außerdem: der Leuchtturm an der Ostspitze, die Salinen, ein ausgedehntes Mittagessen in einer Strandbar und der Markt im Dorf. Es ist eine kleine, ruhige Insel — der Reiz liegt darin, an einem schönen Ort wenig zu tun.',
        'La mayoría alquila una moto, bici o coche junto al puerto y va a las playas del norte y el este, donde el agua es somera y transparente. Además: el faro del extremo este, las salinas, una comida larga en un chiringuito y el mercadillo del pueblo. Es una isla pequeña y tranquila — la gracia está en hacer poco en un sitio bonito, no en tachar una lista.',
        'La plupart des visiteurs louent un scooter, un vélo ou une voiture près du port et filent vers les plages du nord et de l’est, où l’eau est peu profonde et limpide. Sinon : le phare à la pointe est, les salines, un long déjeuner dans une paillote et le marché du village. C’est une petite île tranquille — le charme est de ne pas faire grand-chose dans un bel endroit.',
      ),
    },
    {
      q: L(
        'Kan ik een scooter, fiets of auto meenemen op de ferry?',
        'Can I take a scooter, bike or car on the ferry?',
        'Kann ich Roller, Fahrrad oder Auto auf die Fähre mitnehmen?',
        '¿Puedo llevar moto, bici o coche en el ferry?',
        'Puis-je emmener un scooter, un vélo ou une voiture sur le ferry ?',
      ),
      a: L(
        'Dat hangt van het schip af. Snelle passagiersferry’s nemen vaak wel fietsen mee maar geen voertuigen; daarvoor zijn er aparte veerboten met een autodek, die er langer over doen en een ander tarief hanteren. In de praktijk is huren op Formentera zelf voor de meeste dagjesmensen eenvoudiger en goedkoper dan overzetten. Laat ons weten wat je van plan bent, dan zeggen we welke variant voor jouw dag het handigst is.',
        'That depends on the vessel. Fast passenger ferries often take bicycles but not vehicles; for those there are separate car ferries with a vehicle deck, which take longer and are priced differently. In practice, hiring on Formentera itself is simpler and cheaper than shipping something across for most day trippers. Tell us what you have in mind and we will say which option makes most sense for your day.',
        'Das hängt vom Schiff ab. Schnelle Passagierfähren nehmen oft Fahrräder mit, aber keine Fahrzeuge; dafür gibt es eigene Autofähren mit Fahrzeugdeck, die länger brauchen und anders bepreist sind. In der Praxis ist es für die meisten Tagesgäste einfacher und günstiger, direkt auf Formentera zu mieten. Sag uns, was du vorhast, und wir sagen dir, welche Variante für deinen Tag sinnvoller ist.',
        'Depende del barco. Los ferris rápidos de pasajeros suelen admitir bicicletas pero no vehículos; para eso hay ferris con bodega para coches, que tardan más y tienen otra tarifa. En la práctica, para la mayoría de excursionistas es más sencillo y barato alquilar en la propia Formentera que cruzar el vehículo. Cuéntanos tu plan y te decimos qué opción compensa.',
        'Cela dépend du navire. Les ferries rapides passagers acceptent souvent les vélos mais pas les véhicules ; il existe pour cela des ferries avec pont-garage, plus lents et tarifés différemment. En pratique, pour la plupart des visiteurs d’un jour, louer sur place à Formentera est plus simple et moins cher que de traverser avec un véhicule. Dites-nous votre projet et nous vous conseillerons.',
      ),
    },
    {
      q: L(
        'Kan de ferry uitvallen door slecht weer?',
        'Can the ferry be cancelled because of bad weather?',
        'Kann die Fähre wegen schlechten Wetters ausfallen?',
        '¿Puede cancelarse el ferry por mal tiempo?',
        'Le ferry peut-il être annulé à cause du mauvais temps ?',
      ),
      a: L(
        'Ja, en het is eerlijker om dat gewoon te zeggen. Bij harde wind kan een rederij afvaarten schrappen of overstappen op een groter, langzamer schip; het gebeurt niet vaak in de zomer, maar het gebeurt. Twee tips uit ervaring: plan Formentera niet op je vertrekdag, en boek de terugtocht niet te laat op de dag, zodat er nog afvaarten achter je zitten als er iets vervalt. Zien we slecht weer aankomen, dan waarschuwen we je vooraf via WhatsApp.',
        'Yes, and it is fairer to say so plainly. In strong wind an operator may drop departures or switch to a bigger, slower vessel; it is not common in summer, but it happens. Two tips from experience: do not plan Formentera on the day you fly home, and do not book the very last return of the day, so there are still sailings behind you if one is dropped. If we see bad weather coming, we warn you in advance over WhatsApp.',
        'Ja — und es ist ehrlicher, das offen zu sagen. Bei starkem Wind kann eine Reederei Abfahrten streichen oder auf ein größeres, langsameres Schiff wechseln; im Sommer passiert das selten, aber es passiert. Zwei Tipps aus Erfahrung: Plane Formentera nicht auf deinen Abreisetag, und buche nicht die allerletzte Rückfahrt, damit noch Abfahrten hinter dir liegen. Zeichnet sich schlechtes Wetter ab, warnen wir dich vorab per WhatsApp.',
        'Sí, y es más honesto decirlo claramente. Con viento fuerte una naviera puede suprimir salidas o cambiar a un barco mayor y más lento; en verano no es frecuente, pero ocurre. Dos consejos por experiencia: no planifiques Formentera el día que vuelas de vuelta, y no reserves la última salida del día, para que queden más salidas por detrás. Si vemos mal tiempo, te avisamos con antelación por WhatsApp.',
        'Oui, et il est plus honnête de le dire clairement. Par vent fort, une compagnie peut supprimer des départs ou basculer sur un navire plus grand et plus lent ; c’est rare en été, mais cela arrive. Deux conseils d’expérience : ne prévoyez pas Formentera le jour de votre vol retour, et ne réservez pas le tout dernier retour de la journée, afin qu’il reste des départs après le vôtre. Si le temps se gâte, nous vous prévenons par WhatsApp.',
      ),
    },
  ],

  'boat-party': [
    {
      q: L(
        'Wat houdt een boat party op Ibiza precies in?',
        'What does an Ibiza boat party actually involve?',
        'Was passiert bei einer Boat Party auf Ibiza genau?',
        '¿En qué consiste exactamente una boat party en Ibiza?',
        'En quoi consiste vraiment une boat party à Ibiza ?',
      ),
      a: L(
        'Je vaart met een groep mee vanaf een haven, er staat een DJ aan boord, er is een bar en onderweg wordt er gestopt om te zwemmen. Verwacht geen clubvloer op zee: het is buiten, in zwemkleding, met zon en zeewind erbij — dichter bij een strandfeest dat toevallig vaart dan bij een avond in een club. Wie het rustiger wil, gaat naar het achterdek; daar is het altijd een slag kalmer.',
        'You sail out with a group from a marina, there is a DJ on board, there is a bar, and the boat stops along the way so people can swim. Do not expect a club floor at sea: it is outdoors, in swimwear, with sun and sea breeze — closer to a beach party that happens to be moving than to a night in a club. If you want it calmer, head to the back deck; it is always a notch quieter there.',
        'Du fährst mit einer Gruppe von einem Hafen aus los, an Bord legt ein DJ auf, es gibt eine Bar, und unterwegs wird zum Schwimmen gestoppt. Erwarte keinen Clubfloor auf See: Es ist draußen, in Badekleidung, mit Sonne und Seewind — eher eine Strandparty, die zufällig fährt, als ein Clubabend. Wer es ruhiger mag, geht aufs Achterdeck; dort ist es immer etwas entspannter.',
        'Sales con un grupo desde un puerto, hay un DJ a bordo, hay barra y por el camino se para para bañarse. No esperes una pista de club en el mar: es al aire libre, en bañador, con sol y brisa — más parecido a una fiesta de playa que navega que a una noche de club. Si lo quieres más tranquilo, vete a la cubierta de popa; siempre está algo más calmada.',
        'Vous partez en groupe depuis une marina, un DJ mixe à bord, il y a un bar et le bateau s’arrête en chemin pour se baigner. N’attendez pas un dancefloor de club en mer : c’est en plein air, en maillot, avec le soleil et le vent — plus proche d’une fête de plage qui navigue que d’une soirée en club. Pour plus de calme, allez sur le pont arrière, toujours un cran plus tranquille.',
      ),
    },
    {
      q: L(
        'Wat zit er bij een boat party-ticket inbegrepen?',
        'What is included in a boat party ticket?',
        'Was ist im Boat-Party-Ticket enthalten?',
        '¿Qué incluye la entrada de una boat party?',
        'Qu’est-ce qui est inclus dans un billet de boat party ?',
      ),
      a: L(
        'Altijd: de vaart zelf, de DJ en de zwemstops. Wat er verder bij zit — drank, eten, vervoer naar de haven of doorgaan bij een club na afloop — verschilt per party, per dag en per week, en die voorwaarden veranderen door het seizoen heen. We beloven daarom niets op voorhand: vraag ons naar de datum die jij op het oog hebt, dan bevestigen we via WhatsApp wat er die dag precies in het ticket zit.',
        'Always: the sailing itself, the DJ and the swim stops. What comes with it beyond that — drinks, food, transport to the marina, or continuing at a club afterwards — varies by party, by day and by week, and those terms shift over the course of the season. So we do not promise anything up front: ask us about the date you have in mind and we will confirm over WhatsApp exactly what the ticket covers that day.',
        'Immer: die Fahrt selbst, der DJ und die Badestopps. Was darüber hinaus dabei ist — Getränke, Essen, Transfer zum Hafen oder das Weitermachen im Club danach — unterscheidet sich je nach Party, Tag und Woche, und diese Konditionen ändern sich im Lauf der Saison. Deshalb versprechen wir vorab nichts: Frag uns nach deinem Wunschdatum, wir bestätigen per WhatsApp, was an dem Tag genau enthalten ist.',
        'Siempre: la navegación en sí, el DJ y las paradas para nadar. Lo demás — bebida, comida, transporte al puerto o continuar después en un club — varía según la fiesta, el día y la semana, y esas condiciones cambian a lo largo de la temporada. Por eso no prometemos nada de antemano: pregúntanos por tu fecha y te confirmamos por WhatsApp qué incluye exactamente ese día.',
        'Toujours : la navigation elle-même, le DJ et les arrêts baignade. Le reste — boissons, nourriture, transport jusqu’à la marina, ou la suite en club — varie selon la soirée, le jour et la semaine, et ces conditions évoluent au fil de la saison. Nous ne promettons donc rien à l’avance : demandez-nous pour votre date et nous confirmons par WhatsApp ce que le billet couvre ce jour-là.',
      ),
    },
    {
      q: L(
        'Geldt er een minimumleeftijd voor een boat party?',
        'Is there a minimum age for a boat party?',
        'Gibt es ein Mindestalter für eine Boat Party?',
        '¿Hay edad mínima para una boat party?',
        'Y a-t-il un âge minimum pour une boat party ?',
      ),
      a: L(
        'Ja, er geldt altijd een leeftijdsgrens, maar die verschilt per organisator en per feest — we noemen daarom geen getal dat voor jouw datum misschien niet klopt. Neem sowieso een geldig paspoort of ID mee: dat wordt bij het inschepen gecontroleerd en zonder legitimatie kom je niet aan boord. Vraag ons naar de party die je op het oog hebt en we bevestigen de leeftijdsgrens vooraf.',
        'Yes, there is always an age limit, but it differs by organiser and by party — so we will not quote a number that might not apply to your date. Either way, bring a valid passport or ID: it is checked at boarding and without it you will not get on. Ask us about the party you are looking at and we will confirm the age limit in advance.',
        'Ja, es gilt immer eine Altersgrenze, sie unterscheidet sich aber je nach Veranstalter und Party — deshalb nennen wir keine Zahl, die für dein Datum vielleicht nicht stimmt. Nimm auf jeden Fall einen gültigen Ausweis mit: Er wird beim Einschiffen kontrolliert, ohne kommst du nicht an Bord. Frag uns nach deiner Wunschparty, wir bestätigen die Altersgrenze vorab.',
        'Sí, siempre hay un límite de edad, pero cambia según el organizador y la fiesta — por eso no damos una cifra que quizá no aplique a tu fecha. En cualquier caso, lleva pasaporte o DNI válido: lo comprueban al embarcar y sin él no subes. Pregúntanos por la fiesta que te interesa y te confirmamos el límite de edad antes.',
        'Oui, il y a toujours une limite d’âge, mais elle varie selon l’organisateur et la soirée — nous n’avancerons donc pas un chiffre qui pourrait ne pas s’appliquer à votre date. Dans tous les cas, apportez un passeport ou une pièce d’identité valide : c’est contrôlé à l’embarquement et sans elle vous ne montez pas. Demandez-nous pour votre soirée, nous confirmons à l’avance.',
      ),
    },
    {
      q: L(
        'Wat neem ik mee naar een boat party?',
        'What should I bring to a boat party?',
        'Was nehme ich zu einer Boat Party mit?',
        '¿Qué llevo a una boat party?',
        'Que faut-il apporter à une boat party ?',
      ),
      a: L(
        'Zwemkleding onder je kleren, een handdoek, zonnebrand, een zonnebril en je ID. Neem weinig mee: er is nauwelijks opbergruimte en spullen raken nat. Laat dure telefoons, tassen en sieraden liever in het hotel of stop ze in een waterdicht hoesje. Ook belangrijk: drink water tussendoor. Zon, dansen en zeewind hakken er harder in dan mensen verwachten.',
        'Swimwear under your clothes, a towel, sunscreen, sunglasses and your ID. Travel light: there is barely any storage and things get wet. Leave expensive phones, bags and jewellery at the hotel, or bring a waterproof pouch. One more thing that matters: drink water throughout. Sun, dancing and sea breeze hit harder than people expect.',
        'Badesachen unter der Kleidung, Handtuch, Sonnencreme, Sonnenbrille und Ausweis. Nimm wenig mit: Es gibt kaum Stauraum und alles wird nass. Teure Handys, Taschen und Schmuck lässt du besser im Hotel oder packst sie in eine wasserdichte Hülle. Und wichtig: zwischendurch Wasser trinken. Sonne, Tanzen und Seewind hauen stärker rein, als man denkt.',
        'Bañador debajo de la ropa, toalla, protector solar, gafas de sol y tu documento de identidad. Lleva poco: apenas hay sitio para guardar cosas y todo se moja. Deja móviles caros, bolsos y joyas en el hotel, o mételos en una funda estanca. Y algo importante: bebe agua durante la travesía. El sol, el baile y la brisa pegan más de lo que la gente espera.',
        'Maillot sous les vêtements, serviette, crème solaire, lunettes de soleil et pièce d’identité. Voyagez léger : il n’y a presque pas de rangement et tout finit mouillé. Laissez téléphones coûteux, sacs et bijoux à l’hôtel, ou prenez une pochette étanche. Point important : buvez de l’eau régulièrement. Le soleil, la danse et le vent marin fatiguent plus qu’on ne le croit.',
      ),
    },
    {
      q: L(
        'Wordt er gestopt om te zwemmen, en moet ik dat?',
        'Are there swim stops, and do I have to join in?',
        'Wird zum Schwimmen gestoppt, und muss ich mitmachen?',
        '¿Hay paradas para nadar y estoy obligado a bañarme?',
        'Y a-t-il des arrêts baignade, et suis-je obligé de me baigner ?',
      ),
      a: L(
        'Er wordt onderweg voor anker gegaan zodat wie wil het water in kan, en dat is voor veel mensen het mooiste moment van de tocht. Meedoen hoeft niet: prima om aan boord te blijven zitten. Waar precies wordt gestopt, hangt af van de wind — de schipper kiest een beschutte baai, en bij een stevige noordenwind gaan we juist naar de zuidkant. De baai op de foto is dus niet gegarandeerd de baai van die dag.',
        'The boat anchors along the way so anyone who wants to can get in the water, and for a lot of people that is the best part of the trip. Joining in is optional: staying on board is completely fine. Where exactly we stop depends on the wind — the skipper picks a sheltered cove, and in a firm northerly we go to the south side instead. So the cove in the photo is not guaranteed to be the cove of the day.',
        'Unterwegs wird geankert, damit alle, die möchten, ins Wasser können — für viele der schönste Moment der Fahrt. Mitmachen ist freiwillig: An Bord bleiben ist völlig in Ordnung. Wo genau gestoppt wird, hängt vom Wind ab — der Skipper wählt eine geschützte Bucht, und bei kräftigem Nordwind fahren wir stattdessen an die Südseite. Die Bucht auf dem Foto ist also nicht garantiert die Bucht des Tages.',
        'El barco fondea por el camino para que quien quiera se meta en el agua, y para mucha gente ese es el mejor momento. No es obligatorio: quedarse a bordo está perfectamente bien. Dónde se para exactamente depende del viento — el patrón elige una cala resguardada, y con viento fuerte del norte nos vamos al sur. Así que la cala de la foto no es necesariamente la cala del día.',
        'Le bateau mouille en chemin pour que ceux qui le souhaitent se baignent, et c’est souvent le meilleur moment de la sortie. Rien d’obligatoire : rester à bord convient très bien. L’endroit exact dépend du vent — le skipper choisit une crique abritée, et par fort vent de nord nous allons plutôt au sud. La crique de la photo n’est donc pas forcément celle du jour.',
      ),
    },
    {
      q: L(
        'Wat gebeurt er als de boat party niet doorgaat?',
        'What happens if the boat party is cancelled?',
        'Was passiert, wenn die Boat Party abgesagt wird?',
        '¿Qué pasa si se cancela la boat party?',
        'Que se passe-t-il si la boat party est annulée ?',
      ),
      a: L(
        'Soms gaat een party niet door, meestal door wind of te weinig aanmeldingen. Wat er dan gebeurt, staat in de voorwaarden van de organisator van dat feest: doorgaans krijg je een andere datum aangeboden of je geld terug. We laten je zo snel mogelijk weten wat er speelt en regelen het verder via WhatsApp — en als je maar een paar dagen op het eiland bent, denken we mee over een alternatief voor die avond.',
        'Sometimes a party does not run, usually because of wind or too few bookings. What happens then is set out in that party organiser’s terms: normally you are offered another date or your money back. We let you know as soon as we hear, and sort it out with you over WhatsApp — and if you are only on the island for a few days, we will help you find an alternative for that evening.',
        'Manchmal findet eine Party nicht statt, meist wegen Wind oder zu wenigen Buchungen. Was dann gilt, steht in den Bedingungen des jeweiligen Veranstalters: In der Regel bekommst du einen Ersatztermin oder dein Geld zurück. Wir melden uns, sobald wir es wissen, und regeln alles Weitere per WhatsApp — und wenn du nur ein paar Tage auf der Insel bist, suchen wir mit dir eine Alternative für den Abend.',
        'A veces una fiesta no sale, normalmente por viento o por pocas reservas. Lo que ocurre entonces está en las condiciones del organizador de esa fiesta: lo habitual es que te ofrezcan otra fecha o la devolución. Te avisamos en cuanto lo sabemos y lo gestionamos contigo por WhatsApp — y si solo estás unos días en la isla, te ayudamos a encontrar una alternativa para esa noche.',
        'Il arrive qu’une soirée n’ait pas lieu, généralement à cause du vent ou d’un nombre de réservations insuffisant. Ce qui s’applique alors figure dans les conditions de l’organisateur : en général, une autre date vous est proposée ou vous êtes remboursé. Nous vous prévenons dès que nous le savons et gérons la suite par WhatsApp — et si vous n’êtes sur l’île que quelques jours, nous vous aidons à trouver une alternative pour la soirée.',
      ),
    },
  ],
}
