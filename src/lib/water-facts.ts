import type { Locale } from './seo'

// ── Per-PAGE comparison tables (5 locales) ─────────────────────────────
// A companion to ./page-faq.ts. Where the FAQ answers a question, this file
// lays the same ground out as a grid: three options, the same handful of
// attributes for each. Answer engines lift comparison tables almost verbatim
// because the shape of the data already resolves the comparison for them, so
// the table is rendered as a real <table> with a <caption> and column headers
// rather than as styled divs.
//
// HARD RULE — identical to page-faq.ts. Every cell must be verifiable and true
// about our own operation. Never invent prices, departure times, timetables,
// capacities, age limits or operator names, and never call anything free.
// Where a real figure would belong but cannot be verified, the cell carries a
// qualitative descriptor and points to WhatsApp, where we confirm the current
// rate or condition before booking.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export type QuickFactsTable = {
  /** Section heading above the table. */
  heading: T
  /** One short paragraph of prose before the table. */
  intro: T
  /** <caption> — describes the table for screen readers and crawlers. */
  caption: T
  /** Column headers. The first one labels the row-header column. */
  columns: T[]
  /** Rows; each row must have exactly columns.length cells. */
  rows: T[][]
  /** Honest limitation printed under the table. */
  note: T
}

export const WATER_FACTS: Record<string, QuickFactsTable> = {
  'ferry-formentera': {
    heading: L(
      'Drie manieren om naar Formentera over te steken',
      'Three ways to cross to Formentera',
      'Drei Wege, um nach Formentera überzusetzen',
      'Tres formas de cruzar a Formentera',
      'Trois façons de rejoindre Formentera',
    ),
    intro: L(
      'Formentera heeft geen vliegveld, dus je komt er alleen over water. Vanaf Ibiza kan dat op drie manieren, en ze verschillen vooral in hoeveel vrijheid je onderweg hebt. De tabel hieronder zet ze naast elkaar; concrete tijden en tarieven wisselen per dag en per aanbieder, die bevestigen we vooraf via WhatsApp.',
      'Formentera has no airport, so the only way to reach it is by sea. From Ibiza there are three routes, and what really separates them is how much freedom you have along the way. The table below puts them side by side; exact times and rates change by day and by operator, so we confirm those over WhatsApp before you book.',
      'Formentera hat keinen Flughafen — die Insel ist ausschließlich über das Wasser erreichbar. Von Ibiza aus gibt es drei Wege, und der Unterschied liegt vor allem darin, wie viel Freiheit du unterwegs hast. Die Tabelle stellt sie nebeneinander; genaue Zeiten und Preise wechseln je nach Tag und Anbieter und bestätigen wir vorab per WhatsApp.',
      'Formentera no tiene aeropuerto, así que solo se llega por mar. Desde Ibiza hay tres opciones, y lo que de verdad las separa es cuánta libertad tienes por el camino. La tabla las pone una al lado de la otra; los horarios y las tarifas exactas cambian según el día y el operador, y los confirmamos por WhatsApp antes de reservar.',
      'Formentera n’a pas d’aéroport : on ne peut y accéder que par la mer. Depuis Ibiza, trois solutions existent, et ce qui les distingue vraiment, c’est la liberté que vous avez en chemin. Le tableau les compare ; les horaires et tarifs exacts varient selon le jour et l’opérateur, nous les confirmons par WhatsApp avant réservation.',
    ),
    caption: L(
      'Vergelijking van de drie manieren om van Ibiza naar Formentera over te steken: overtochttijd, waar het bij past, flexibiliteit en hoe je boekt.',
      'Comparison of the three ways to cross from Ibiza to Formentera: crossing time, what it suits, flexibility and how to book.',
      'Vergleich der drei Wege von Ibiza nach Formentera: Überfahrtdauer, wofür es passt, Flexibilität und Buchungsweg.',
      'Comparativa de las tres formas de cruzar de Ibiza a Formentera: duración de la travesía, para quién encaja, flexibilidad y cómo se reserva.',
      'Comparatif des trois façons de rejoindre Formentera depuis Ibiza : durée de la traversée, à qui cela convient, flexibilité et mode de réservation.',
    ),
    columns: [
      L('Manier', 'Way to cross', 'Variante', 'Opción', 'Option'),
      L('Overtochttijd', 'Crossing time', 'Überfahrtdauer', 'Duración de la travesía', 'Durée de la traversée'),
      L('Past bij', 'What it suits', 'Passt zu', 'Encaja con', 'Convient à'),
      L('Flexibiliteit', 'Flexibility', 'Flexibilität', 'Flexibilidad', 'Flexibilité'),
      L('Zo boek je', 'Booking route', 'So buchst du', 'Cómo se reserva', 'Réservation'),
    ],
    rows: [
      [
        L('Lijndienst snelveerboot', 'Scheduled fast ferry', 'Linien-Schnellfähre', 'Ferry rápido de línea', 'Ferry rapide de ligne'),
        L(
          'Ongeveer 30 minuten van haven tot haven',
          'Roughly 30 minutes port to port',
          'Rund 30 Minuten von Hafen zu Hafen',
          'Unos 30 minutos de puerto a puerto',
          'Environ 30 minutes de port à port',
        ),
        L(
          'Snel oversteken en zelf het eiland op, met eigen huurscooter of bus',
          'Getting across fast and exploring the island on your own, by rented scooter or bus',
          'Schnell übersetzen und die Insel auf eigene Faust erkunden, per Mietroller oder Bus',
          'Cruzar rápido y recorrer la isla por tu cuenta, en moto de alquiler o autobús',
          'Traverser vite et explorer l’île par vous-même, en scooter de location ou en bus',
        ),
        L(
          'Vaste vertrektijden; je bent gebonden aan de dienstregeling van die dag',
          'Fixed departure times; you are tied to that day’s timetable',
          'Feste Abfahrtszeiten; du bist an den Fahrplan des Tages gebunden',
          'Salidas a horas fijas; dependes del horario de ese día',
          'Départs à heures fixes ; vous dépendez de l’horaire du jour',
        ),
        // Corrected: we DO sell these — the bookable crossings are listed in
        // the agenda on this very page, via our ticket partner. The original
        // wording ("buy direct with the ferry company") contradicted the
        // business model and would have been quoted back at us by an AI.
        L(
          'Kies een afvaart in de agenda hierboven en boek direct online.',
          'Pick a crossing in the agenda above and book it online right away.',
          'Wähle oben in der Übersicht eine Abfahrt und buche direkt online.',
          'Elige una salida en la agenda de arriba y resérvala online.',
          'Choisissez une traversée dans l’agenda ci-dessus et réservez en ligne.',
        ),
      ],
      [
        L('Dagtocht met strandstops', 'Day trip with beach stops', 'Tagestour mit Strandstopps', 'Excursión de día con paradas de playa', 'Excursion à la journée avec arrêts baignade'),
        L(
          'De overtocht duurt langer omdat er onderweg gestopt en gezwommen wordt',
          'Longer than the direct crossing, because the boat stops to swim along the way',
          'Länger als die direkte Überfahrt, da unterwegs zum Schwimmen gestoppt wird',
          'Más larga que la travesía directa, porque el barco para a bañarse por el camino',
          'Plus longue que la traversée directe, car le bateau s’arrête pour la baignade',
        ),
        L(
          'Een hele dag op het water, waarbij de vaart zelf het uitje is',
          'A full day on the water, where the trip itself is the outing',
          'Ein ganzer Tag auf dem Wasser, bei dem die Fahrt selbst das Erlebnis ist',
          'Un día entero en el agua, donde la propia navegación es el plan',
          'Une journée entière sur l’eau, où la navigation est l’attraction',
        ),
        L(
          'Route en stops liggen vooraf vast; je vaart mee met de groep',
          'Route and stops are set in advance; you travel with the group',
          'Route und Stopps stehen vorab fest; du fährst mit der Gruppe',
          'Ruta y paradas fijadas de antemano; navegas con el grupo',
          'Itinéraire et arrêts fixés à l’avance ; vous naviguez avec le groupe',
        ),
        L(
          'Datum kiezen in de agenda hierboven, of vraag ons via WhatsApp om mee te kijken',
          'Pick a date in the agenda above, or ask us over WhatsApp to look with you',
          'Datum in der Agenda oben wählen oder uns per WhatsApp fragen',
          'Elige fecha en la agenda de arriba o pregúntanos por WhatsApp',
          'Choisissez une date dans l’agenda ci-dessus ou demandez-nous par WhatsApp',
        ),
      ],
      [
        L('Privécharter', 'Private charter', 'Privatcharter', 'Chárter privado', 'Charter privé'),
        L(
          'Jij bepaalt de vaartijd; de oversteek zelf is kort, de dag zo lang als je boekt',
          'You set the pace; the crossing itself is short, the day as long as you book it',
          'Du bestimmst das Tempo; die Überfahrt ist kurz, der Tag so lang wie gebucht',
          'Tú marcas el ritmo; la travesía es corta y el día dura lo que reserves',
          'Vous fixez le rythme ; la traversée est courte, la journée dure ce que vous réservez',
        ),
        L(
          'Groepen, gezinnen en iedereen die niet met vreemden op één boot wil',
          'Groups, families and anyone who would rather not share a boat with strangers',
          'Gruppen, Familien und alle, die kein Boot mit Fremden teilen möchten',
          'Grupos, familias y quien prefiere no compartir barco con desconocidos',
          'Groupes, familles et tous ceux qui préfèrent ne pas partager le bateau',
        ),
        L(
          'De grootste: vertrektijd, baaien en lengte van de dag stem je met de schipper af',
          'The highest: departure time, coves and length of day are agreed with the skipper',
          'Am höchsten: Abfahrtszeit, Buchten und Länge des Tages stimmst du mit dem Skipper ab',
          'La mayor: hora de salida, calas y duración del día se acuerdan con el patrón',
          'La plus grande : heure de départ, criques et durée se décident avec le skipper',
        ),
        L(
          'Aanvraag via WhatsApp; wij bevestigen boot, tijd en tarief voordat je vastlegt',
          'Enquiry over WhatsApp; we confirm boat, time and rate before you commit',
          'Anfrage per WhatsApp; wir bestätigen Boot, Zeit und Preis vor der Buchung',
          'Consulta por WhatsApp; confirmamos barco, hora y tarifa antes de cerrar',
          'Demande par WhatsApp ; nous confirmons bateau, horaire et tarif avant validation',
        ),
      ],
    ],
    note: L(
      'Eerlijk gezegd: het weer beslist mee. Bij harde wind kan een overtocht worden uitgesteld, ingekort of omgelegd naar beschutter water, en dat horen we soms pas op de ochtend zelf. Het seizoen loopt ruwweg van mei tot en met oktober; buiten die maanden is het aanbod een stuk beperkter.',
      'To be straight about it: the weather has a vote. In strong wind a crossing can be delayed, shortened or rerouted to more sheltered water, and sometimes we only hear that on the morning itself. The season runs roughly from May to October; outside those months the choice is a good deal thinner.',
      'Ehrlich gesagt entscheidet das Wetter mit. Bei starkem Wind kann eine Überfahrt verschoben, verkürzt oder in geschütztere Gewässer verlegt werden — manchmal erfahren wir das erst am Morgen selbst. Die Saison läuft etwa von Mai bis Oktober; außerhalb dieser Monate ist das Angebot deutlich kleiner.',
      'Siendo honestos: el tiempo también decide. Con viento fuerte una travesía puede retrasarse, acortarse o desviarse a aguas más resguardadas, y a veces lo sabemos la misma mañana. La temporada va aproximadamente de mayo a octubre; fuera de esos meses la oferta es bastante menor.',
      'Soyons clairs : la météo a son mot à dire. Par vent fort, une traversée peut être retardée, écourtée ou déroutée vers des eaux plus abritées, parfois annoncé le matin même. La saison s’étend grosso modo de mai à octobre ; hors de ces mois, l’offre est nettement plus réduite.',
    ),
  },

  'boat-party': {
    heading: L(
      'Drie soorten boottochten, naast elkaar',
      'Three kinds of boat trip, side by side',
      'Drei Arten von Bootstouren im Vergleich',
      'Tres tipos de salida en barco, comparados',
      'Trois types de sorties en bateau, comparés',
    ),
    intro: L(
      'Een boottocht op Ibiza betekent niet voor iedereen hetzelfde. Grofweg zijn er drie vormen, en het verschil zit in het tijdstip, het geluidsniveau en met wie je aan boord staat. Prijzen en vertrektijden verschillen per boot en per datum — die bevestigen we vooraf via WhatsApp.',
      'A boat trip in Ibiza does not mean the same thing to everyone. Broadly there are three formats, and the difference lies in the time of day, the volume and who you end up on board with. Prices and departure times vary per boat and per date — we confirm those over WhatsApp before you book.',
      'Eine Bootstour auf Ibiza bedeutet nicht für alle dasselbe. Grob gibt es drei Formate, und der Unterschied liegt in der Tageszeit, der Lautstärke und der Gesellschaft an Bord. Preise und Abfahrtszeiten variieren je Boot und Datum — wir bestätigen sie vorab per WhatsApp.',
      'Una salida en barco en Ibiza no significa lo mismo para todos. A grandes rasgos hay tres formatos, y la diferencia está en la hora del día, el volumen y con quién compartes cubierta. Precios y horarios varían según el barco y la fecha — los confirmamos por WhatsApp antes de reservar.',
      'Une sortie en bateau à Ibiza ne veut pas dire la même chose pour tout le monde. Il existe en gros trois formats, et la différence tient à l’heure, au volume sonore et aux personnes à bord. Les prix et horaires varient selon le bateau et la date — nous les confirmons par WhatsApp avant réservation.',
    ),
    caption: L(
      'Vergelijking van dagboottocht, sunset cruise en privéboot voor groepen: tijdstip, sfeer, zwemstops en waar het bij past.',
      'Comparison of the day boat party, the sunset cruise and the private group boat: time of day, vibe, swim stops and who it is best for.',
      'Vergleich von Tages-Bootsparty, Sunset-Cruise und privatem Gruppenboot: Tageszeit, Stimmung, Badestopps und für wen es passt.',
      'Comparativa de la fiesta en barco de día, el crucero al atardecer y el barco privado de grupo: hora, ambiente, paradas de baño y para quién es.',
      'Comparatif de la boat party de jour, de la croisière au coucher du soleil et du bateau privé de groupe : horaire, ambiance, arrêts baignade et public.',
    ),
    columns: [
      L('Soort tocht', 'Type of trip', 'Art der Tour', 'Tipo de salida', 'Type de sortie'),
      L('Tijdstip', 'Time of day', 'Tageszeit', 'Hora del día', 'Moment de la journée'),
      L('Sfeer', 'Typical vibe', 'Stimmung', 'Ambiente', 'Ambiance'),
      L('Zwemstops', 'Swim stops', 'Badestopps', 'Paradas de baño', 'Arrêts baignade'),
      L('Past bij', 'Best for', 'Passt zu', 'Ideal para', 'Idéal pour'),
    ],
    rows: [
      [
        L('Dagboottocht met dj', 'Day boat party', 'Tages-Bootsparty', 'Fiesta en barco de día', 'Boat party de jour'),
        L(
          'Overdag, meestal met vertrek in de ochtend of vroege middag',
          'Daytime, usually leaving in the morning or early afternoon',
          'Tagsüber, meist mit Abfahrt am Morgen oder frühen Nachmittag',
          'De día, normalmente con salida por la mañana o a primera hora de la tarde',
          'En journée, généralement au départ du matin ou début d’après-midi',
        ),
        L(
          'Uitbundig: muziek aan, drankje in de hand, veel mensen op één dek',
          'Loud and social: music on, drink in hand, a lot of people on one deck',
          'Ausgelassen: Musik an, Drink in der Hand, viele Menschen auf einem Deck',
          'Animado: música alta, copa en la mano y mucha gente en cubierta',
          'Festif : musique à fond, verre à la main, beaucoup de monde sur le pont',
        ),
        L(
          'Ja, doorgaans één of meer stops in een baai — de schipper kiest op wind',
          'Yes, normally one or more stops in a cove — the skipper picks on the wind',
          'Ja, meist ein oder mehrere Stopps in einer Bucht — der Skipper wählt nach Wind',
          'Sí, normalmente una o más paradas en una cala — el patrón elige según el viento',
          'Oui, en général un ou plusieurs arrêts en crique — le skipper choisit selon le vent',
        ),
        L(
          'Vriendengroepen en solo-reizigers die mensen willen leren kennen',
          'Groups of friends and solo travellers who want to meet people',
          'Freundesgruppen und Alleinreisende, die Leute kennenlernen wollen',
          'Grupos de amigos y viajeros solos que quieren conocer gente',
          'Groupes d’amis et voyageurs solos qui veulent rencontrer du monde',
        ),
      ],
      [
        L('Sunset cruise', 'Sunset cruise', 'Sunset-Cruise', 'Crucero al atardecer', 'Croisière au coucher du soleil'),
        L(
          'Laat in de middag tot na zonsondergang; het tijdstip schuift mee met het seizoen',
          'Late afternoon until after sundown; the timing shifts with the season',
          'Später Nachmittag bis nach Sonnenuntergang; die Zeit verschiebt sich mit der Saison',
          'Desde media tarde hasta después de la puesta de sol; la hora cambia con la temporada',
          'De la fin d’après-midi jusqu’après le coucher du soleil ; l’horaire suit la saison',
        ),
        L(
          'Rustiger en meer op het uitzicht gericht, vaak richting de westkust en Es Vedrà',
          'Calmer and built around the view, often heading for the west coast and Es Vedrà',
          'Ruhiger und auf die Aussicht ausgerichtet, oft Richtung Westküste und Es Vedrà',
          'Más tranquilo y centrado en las vistas, a menudo hacia la costa oeste y Es Vedrà',
          'Plus calme et centré sur la vue, souvent vers la côte ouest et Es Vedrà',
        ),
        L(
          'Soms één korte stop, soms geen — vraag het vooraf, wij checken het per boot',
          'Sometimes one short stop, sometimes none — ask first, we check it per boat',
          'Manchmal ein kurzer Stopp, manchmal keiner — frag vorher, wir prüfen es pro Boot',
          'A veces una parada corta, a veces ninguna — pregunta antes y lo comprobamos por barco',
          'Parfois un arrêt court, parfois aucun — demandez, nous vérifions bateau par bateau',
        ),
        L(
          'Stellen en wie de avond rustig wil beginnen voordat de clubs opengaan',
          'Couples and anyone who wants a quiet start to the evening before the clubs open',
          'Paare und alle, die den Abend ruhig beginnen wollen, bevor die Clubs öffnen',
          'Parejas y quien quiere empezar la noche con calma antes de que abran los clubes',
          'Couples et ceux qui veulent commencer la soirée en douceur avant les clubs',
        ),
      ],
      [
        L('Privéboot voor je groep', 'Private group boat', 'Privatboot für die Gruppe', 'Barco privado para tu grupo', 'Bateau privé pour votre groupe'),
        L(
          'Jij kiest: ochtend, middag of over de zonsondergang heen',
          'You choose: morning, afternoon or straight through sunset',
          'Du wählst: Vormittag, Nachmittag oder über den Sonnenuntergang hinaus',
          'Tú eliges: mañana, tarde o hasta pasada la puesta de sol',
          'Vous choisissez : matin, après-midi ou jusqu’après le coucher du soleil',
        ),
        L(
          'Precies wat je groep ervan maakt, van stil ankeren tot muziek aan',
          'Exactly what your group makes of it, from quiet anchoring to music on',
          'Genau das, was eure Gruppe daraus macht — von stillem Ankern bis Musik an',
          'Exactamente lo que vuestro grupo decida, del fondeo tranquilo a la música alta',
          'Exactement ce que votre groupe en fait, du mouillage tranquille à la musique',
        ),
        L(
          'Zoveel als de dag toelaat; de schipper vaart de baaien aan die jullie kiezen',
          'As many as the day allows; the skipper runs the coves you choose',
          'So viele, wie der Tag zulässt; der Skipper fährt die Buchten an, die ihr wählt',
          'Tantas como permita el día; el patrón va a las calas que elijáis',
          'Autant que la journée le permet ; le skipper vise les criques que vous choisissez',
        ),
        L(
          'Verjaardagen, vrijgezellenfeesten en groepen die het dek voor zichzelf willen',
          'Birthdays, stag and hen groups and anyone who wants the deck to themselves',
          'Geburtstage, Junggesellenabschiede und Gruppen, die das Deck für sich wollen',
          'Cumpleaños, despedidas de soltero y grupos que quieren la cubierta para ellos',
          'Anniversaires, enterrements de vie de garçon et groupes qui veulent le pont pour eux',
        ),
      ],
    ],
    note: L(
      'Eerlijk erbij: de zee bepaalt de dag. Bij harde wind kan een tocht worden afgelast, ingekort of verlegd naar rustiger water, en zwemstops kunnen dan vervallen. Het vaarseizoen loopt ruwweg van mei tot en met oktober. Wat er op jouw datum daadwerkelijk vaart en wat het kost, bevestigen we via WhatsApp voordat je boekt.',
      'Honestly: the sea decides the day. In strong wind a trip can be cancelled, shortened or moved to calmer water, and swim stops may drop off. The sailing season runs roughly from May to October. What actually sails on your date, and what it costs, we confirm over WhatsApp before you book.',
      'Ehrlich dazu: Das Meer bestimmt den Tag. Bei starkem Wind kann eine Tour abgesagt, verkürzt oder in ruhigeres Wasser verlegt werden, Badestopps können entfallen. Die Saison läuft etwa von Mai bis Oktober. Was an deinem Datum tatsächlich fährt und was es kostet, bestätigen wir per WhatsApp vor der Buchung.',
      'Con honestidad: el mar manda. Con viento fuerte una salida puede cancelarse, acortarse o trasladarse a aguas más tranquilas, y las paradas de baño pueden caerse. La temporada va aproximadamente de mayo a octubre. Qué navega realmente en tu fecha y cuánto cuesta lo confirmamos por WhatsApp antes de reservar.',
      'Honnêtement : c’est la mer qui décide. Par vent fort, une sortie peut être annulée, écourtée ou déplacée vers des eaux plus calmes, et les arrêts baignade peuvent sauter. La saison s’étend grosso modo de mai à octobre. Ce qui navigue réellement à votre date, et à quel prix, nous le confirmons par WhatsApp avant réservation.',
    ),
  },

  'private-boat-charters': {
    heading: L(
      'Drie categorieën privéboten, naast elkaar',
      'Three categories of private boat charters, compared',
      'Drei Kategorien privater Boote im Vergleich',
      'Tres categorías de barcos privados, comparadas',
      'Trois catégories de bateaux privés, comparées',
    ),
    intro: L(
      'Een privéboot huren op Ibiza hangt af van je groepsgrootte, gewenst comfort en vaarbereik. We onderscheiden drie hoofdcategorieën: wendbare dagboten (7–10 m), ruime catamarans & zeiljachten (11–15 m), en exclusieve motorjachten (15–24 m+). Elke charter is inclusief ervaren schipper en verzekering; brandstof wordt helder berekend op basis van werkelijk verbruik.',
      'Chartering a private boat in Ibiza comes down to group size, comfort and cruising range. We divide the fleet into three main categories: agile day cruisers (7–10 m), spacious catamarans & sailing yachts (11–15 m), and luxury motor yachts (15–24 m+). Every charter includes an experienced skipper and insurance; fuel is calculated transparently on actual consumption.',
      'Ein Privatboot auf Ibiza zu chartern hängt von Gruppengröße, Komfort und Fahrtgebiet ab. Wir unterteilen in drei Hauptkategorien: wendige Daycruiser (7–10 m), geräumige Katamarane & Segelyachten (11–15 m) und Luxusyachten (15–24 m+). Jeder Charter beinhaltet Skipper und Versicherung; Treibstoff wird transparent nach Verbrauch berechnet.',
      'Alquilar un barco privado en Ibiza depende del grupo, el confort y la zona de navegación. Dividimos la flota en tres categorías: lanchas de día (7–10 m), catamaranes y veleros espaciosos (11–15 m), y yates a motor de lujo (15–24 m+). Todos los chárteres incluyen patrón profesional y seguro; el combustible se calcula según consumo real.',
      'Louer un bateau privé à Ibiza dépend de la taille du groupe, du confort et du rayon de navigation. Nous distinguons trois catégories : vedettes de jour (7–10 m), catamarans et voiliers spacieux (11–15 m), et yachts de luxe (15–24 m+). Chaque sortie comprend skipper et assurance ; le carburant est calculé selon la consommation réelle.',
    ),
    caption: L(
      'Vergelijking van dagboten, catamarans en luxe motorjachten: capaciteit, vaartijd, routes en voorzieningen.',
      'Comparison of day cruisers, catamarans and luxury motor yachts: capacity, duration, routes and amenities.',
      'Vergleich von Daycruisern, Katamaranen und Luxusyachten: Kapazität, Fahrtdauer, Routen und Ausstattung.',
      'Comparativa de lanchas de día, catamaranes y yates de lujo: capacidad, duración, rutas y equipamiento.',
      'Comparatif des vedettes de jour, catamarans et yachts de luxe : capacité, durée, itinéraires et équipements.',
    ),
    columns: [
      L('Bootcategorie', 'Boat category', 'Bootstyp', 'Tipo de barco', 'Catégorie de bateau'),
      L('Capaciteit', 'Capacity', 'Kapazität', 'Capacidad', 'Capacité'),
      L('Vaarduur & Vertrek', 'Duration & Departure', 'Dauer & Abfahrt', 'Duración y salida', 'Durée et départ'),
      L('Populaire routes', 'Popular routes', 'Beliebte Routen', 'Rutas populares', 'Itinéraires populaires'),
      L('Inbegrepen', 'Included', 'Inbegriffen', 'Incluido', 'Inclus'),
    ],
    rows: [
      [
        L('Dagboot / Motorboot (7–10 m)', 'Day cruiser / Motorboat (7–10 m)', 'Daycruiser / Motorboot (7–10 m)', 'Lancha de día / Motora (7–10 m)', 'Vedette de jour / Bateau à moteur (7–10 m)'),
        L(
          'Tot 8–10 personen (optimaal comfort: 6–8)',
          'Up to 8–10 guests (ideal comfort: 6–8)',
          'Bis zu 8–10 Personen (optimal: 6–8)',
          'Hasta 8–10 personas (confort ideal: 6–8)',
          'Jusqu’à 8–10 personnes (confort idéal : 6–8)',
        ),
        L(
          'Halve dag (4 uur) of hele dag (8 uur); vertrek Marina Botafoch of San Antonio',
          'Half day (4h) or full day (8h); departs Marina Botafoch or San Antonio',
          'Halber Tag (4 Std.) oder ganzer Tag (8 Std.); ab Marina Botafoch oder San Antonio',
          'Medio día (4 h) o día completo (8 h); salida Marina Botafoch o San Antonio',
          'Demi-journée (4h) ou journée complète (8h) ; départ Marina Botafoch ou San Antonio',
        ),
        L(
          'Es Vedrà, Cala Conta, Cala Bassa, Ses Salines',
          'Es Vedrà, Cala Conta, Cala Bassa, Ses Salines',
          'Es Vedrà, Cala Conta, Cala Bassa, Ses Salines',
          'Es Vedrà, Cala Conta, Cala Bassa, Ses Salines',
          'Es Vedrà, Cala Conta, Cala Bassa, Ses Salines',
        ),
        L(
          'Lokale schipper, koelbox met ijs, snorkelsets, zonnedek, zwemtrap en verzekering',
          'Local skipper, coolbox with ice, snorkels, sundeck, swim ladder and insurance',
          'Lokaler Skipper, Kühlbox mit Eis, Schnorchelsets, Sonnendeck, Badeleiter und Versicherung',
          'Patrón local, nevera con hielo, equipo de snorkel, solárium, escalera de baño y seguro',
          'Skipper local, glacière avec glaçons, masques/tubas, bain de soleil, échelle et assurance',
        ),
      ],
      [
        L('Catamaran & Zeiljacht (11–15 m)', 'Catamaran & Sailing Yacht (11–15 m)', 'Katamaran & Segelyacht (11–15 m)', 'Catamarán y Velero (11–15 m)', 'Catamaran et Voilier (11–15 m)'),
        L(
          'Tot 10–12 personen (veel leefruimte en schaduw)',
          'Up to 10–12 guests (generous deck space and shade)',
          'Bis zu 10–12 Personen (großzügiges Deck und Schatten)',
          'Hasta 10–12 personas (amplio espacio y sombra)',
          'Jusqu’à 10–12 personnes (vaste pont et zones d’ombre)',
        ),
        L(
          'Hele dag (8 uur) of sunset cruise; vertrek San Antonio of Salinas',
          'Full day (8h) or sunset cruise; departs San Antonio or Salinas',
          'Ganzer Tag (8 Std.) oder Sunset-Cruise; ab San Antonio oder Salinas',
          'Día completo (8 h) o crucero al atardecer; salida San Antonio o Salinas',
          'Journée complète (8h) ou coucher de soleil ; départ San Antonio ou Salinas',
        ),
        L(
          'Formentera (Espalmador & Ses Illetes), rustige ankerbaaien',
          'Formentera (Espalmador & Ses Illetes), sheltered coves',
          'Formentera (Espalmador & Ses Illetes), ruhige Ankerbuchten',
          'Formentera (Espalmador y Ses Illetes), calas tranquilas',
          'Formentera (Espalmador & Ses Illetes), criques protégées',
        ),
        L(
          'Schipper, paddleboards (SUP), loungenet, audiosysteem, schaduwrijke bimini',
          'Skipper, stand-up paddleboards, trampoline nets, sound system, shade bimini',
          'Skipper, Stand-Up-Paddleboards, Trampolinnetze, Soundsystem, Sonnenverdeck',
          'Patrón, tablas de paddle surf, redes de proa, sistema de sonido y toldo bimini',
          'Skipper, paddle (SUP), filets de proue, système audio et taud de soleil',
        ),
      ],
      [
        L('Luxe Motorjacht (15–24 m+)', 'Luxury Motor Yacht (15–24 m+)', 'Luxus-Motoryacht (15–24 m+)', 'Yate de motor de lujo (15–24 m+)', 'Yacht à moteur de luxe (15–24 m+)'),
        L(
          'Tot 10–12 gasten plus professionele bemanning',
          'Up to 10–12 guests plus professional crew',
          'Bis zu 10–12 Gäste plus professionelle Crew',
          'Hasta 10–12 invitados más tripulación profesional',
          'Jusqu’à 10–12 passagers plus équipage professionnel',
        ),
        L(
          'Volledige dagcharter (8 uur); vertrek Marina Ibiza of Marina Botafoch',
          'Full day charter (8h); departs Marina Ibiza or Marina Botafoch',
          'Ganztags-Charter (8 Std.); ab Marina Ibiza oder Marina Botafoch',
          'Chárter de día completo (8 h); salida Marina Ibiza o Marina Botafoch',
          'Charter journée complète (8h) ; départ Marina Ibiza ou Marina Botafoch',
        ),
        L(
          'Snelle oversteek naar Formentera (lunch bij Beso Beach / Juan y Andrea), Tagomago',
          'Fast crossing to Formentera (lunch at Beso Beach / Juan y Andrea), Tagomago',
          'Schnelle Überfahrt nach Formentera (Mittagessen bei Beso Beach / Juan y Andrea), Tagomago',
          'Cruce rápido a Formentera (comida en Beso Beach / Juan y Andrea), Tagomago',
          'Traversée rapide vers Formentera (déjeuner à Beso Beach / Juan y Andrea), Tagomago',
        ),
        L(
          'Kapitein & stewardess, handdoeken, frisdrank & ijs, seabob op aanvraag, luxe cabins met airco',
          'Captain & stewardess, towels, soft drinks & ice, Seabob on request, A/C luxury cabins',
          'Kapitän & Stewardess, Handtücher, Softdrinks & Eis, Seabob auf Wunsch, klimatisierte Kabinen',
          'Capitán y azafata, toallas, refrescos y hielo, Seabob bajo petición, camarotes climatizados',
          'Capitaine et hôtesse, serviettes, boissons fraîches & glace, Seabob sur demande, cabines climatisées',
        ),
      ],
    ],
    note: L(
      'Goed om te weten: Prijzen zijn seizoensafhankelijk (voor- en naseizoen mei/okt vs. hoogseizoen juli/augustus). De schipper stemt de vaarroute op de ochtend zelf af op de wind en deining, zodat je altijd in de kalmste baaien ligt. Actuele beschikbaarheid en dagtarieven bevestigen we vooraf via WhatsApp.',
      'Good to know: Rates vary by season (shoulder season May/Oct vs peak July/August). The skipper confirms the day’s route on the morning of departure based on real-time wind and swell to ensure the calmest anchorages. We confirm live availability and exact daily rates over WhatsApp before booking.',
      'Gut zu wissen: Preise hängen von der Saison ab (Nebensaison Mai/Okt vs. Hochsaison Juli/August). Der Skipper passt die Route am Morgen an Wind und Wellen an, um die ruhigsten Buchten anzulaufen. Aktuelle Verfügbarkeit und Tagespreise bestätigen wir vorab per WhatsApp.',
      'A tener en cuenta: Las tarifas varían según la temporada (temporada baja mayo/oct vs temporada alta julio/agosto). El patrón adapta la ruta la mañana de la salida según el viento para fondear en aguas tranquilas. Confirmamos disponibilidad y precios exactos por WhatsApp antes de reservar.',
      'Bon à savoir : Les tarifs dépendent de la saison (mai/octobre vs juillet/août). Le skipper ajuste l’itinéraire le matin même en fonction du vent pour vous garantir des mouillages abrités. Nous confirmons la disponibilité et les tarifs précis par WhatsApp avant réservation.',
    ),
  },
  'beach-clubs': {
    heading: L(
      'De drie soorten beachclubs op Ibiza',
      'The three types of beach clubs in Ibiza',
      'Die drei Arten von Beachclubs auf Ibiza',
      'Los tres tipos de beach clubs en Ibiza',
      'Les trois types de beach clubs à Ibiza',
    ),
    intro: L(
      'Niet elke beachclub op Ibiza is hetzelfde: van bruisende daytime pool party’s tot ontspannen bohemien baaien en gastronomische strandrestaurants met VIP-loungers. Deze vergelijking helpt je de sfeer te kiezen die past bij jouw dag en gezelschap.',
      'Not every Ibiza beach club offers the same vibe: from vibrant daytime pool parties to chilled bohemian coves and gourmet seaside restaurants with plush loungers. This comparison helps you pick the right atmosphere for your day and group.',
      'Nicht jeder Beachclub auf Ibiza ist gleich: von pulsierenden Tagespartys bis zu entspannten Boho-Buchten und Gourmet-Strandrestaurants mit VIP-Liegen. Dieser Vergleich hilft dir, die passende Atmosphäre für deinen Tag zu wählen.',
      'No todos los beach clubs de Ibiza son iguales: desde fiestas diurnas junto a la piscina hasta calas bohemias relajadas y restaurantes gastronómicos a pie de playa con camas VIP. Esta comparativa te ayuda a elegir el ambiente ideal.',
      'Tous les beach clubs d’Ibiza ne se ressemblent pas : des pool parties animées en journée aux criques bohèmes et restaurants gastronomiques en bord de mer. Ce comparatif vous aide à choisir l’ambiance qui vous correspond.',
    ),
    caption: L(
      'Vergelijking van de drie stijlen beachclubs op Ibiza: sfeer & publiek, ligbedden & reserveren, muziek & energie, en bereikbaarheid.',
      'Comparison of the three beach club styles in Ibiza: vibe & crowd, sunbeds & booking, music & energy, and access.',
      'Vergleich der drei Beachclub-Stile auf Ibiza: Atmosphäre & Publikum, Liegen & Reservierung, Musik & Energie sowie Anfahrt.',
      'Comparativa de los tres estilos de beach clubs en Ibiza: ambiente y público, hamacas y reservas, música y energía, y accesibilidad.',
      'Comparatif des trois styles de beach clubs à Ibiza : ambiance & public, transats & réservation, musique & énergie, et accès.',
    ),
    columns: [
      L('Type beachclub', 'Beach club style', 'Beachclub-Stil', 'Tipo de beach club', 'Style de beach club'),
      L('Sfeer & Publiek', 'Vibe & Crowd', 'Atmosphäre & Publikum', 'Ambiente y público', 'Ambiance & public'),
      L('Ligbedden & Reserveren', 'Sunbeds & Booking', 'Liegen & Reservierung', 'Hamacas y reservas', 'Transats & réservation'),
      L('Muziek & Energie', 'Music & Energy', 'Musik & Energie', 'Música y energía', 'Musique & énergie'),
      L('Bereikbaarheid & Vervoer', 'Access & Transport', 'Anfahrt & Transfer', 'Acceso y transporte', 'Accès & transport'),
    ],
    rows: [
      [
        L('Day Club & Party (o.a. O Beach, Ushuaïa, Playa d’en Bossa)', 'Day Club & Party (e.g. O Beach, Ushuaïa, Playa d’en Bossa)', 'Day Club & Party (u.a. O Beach, Ushuaïa, Playa d’en Bossa)', 'Day Club y fiesta (ej. O Beach, Ushuaïa, Playa d’en Bossa)', 'Day Club & Fête (ex. O Beach, Ushuaïa, Playa d’en Bossa)'),
        L(
          'Energiek, dansen in de zon, zwembad-acts, groepen en feestvierders',
          'High-energy, poolside dancing, live performances, groups and celebrations',
          'Energiegeladen, Tanzen am Pool, Live-Shows, Gruppen und Feierlaune',
          'Alta energía, baile junto a la piscina, espectáculos en vivo y grupos',
          'Grande énergie, danse au bord de la piscine, shows en direct et groupes',
        ),
        L(
          'VIP-bedden en tafels met minimum spend; ver vooraf reserveren noodzakelijk in juli/augustus',
          'VIP beds and tables with minimum spend; advance booking weeks ahead required in July/August',
          'VIP-Betten und Tische mit Mindestverzehr; in der Hochsaison Wochen im Voraus buchen',
          'Camas VIP y mesas con consumo mínimo; imprescindible reservar con semanas de antelación en julio/agosto',
          'Lits VIP et tables avec consommation minimale ; réservation indispensable des semaines à l’avance en été',
        ),
        L(
          'Commerciële house, resident DJ’s, luide beats en acts rond het zwembad',
          'Commercial house, resident DJs, loud beats and daytime pool spectacle',
          'Uplifting House, Resident-DJs, druckvolle Beats und Pool-Action',
          'House comercial, DJs residentes, ritmos enérgicos y animación',
          'House entraînante, DJs résidents, volume soutenu et ambiance festive',
        ),
        L(
          'Eenvoudig te voet of per taxi in San Antonio of Playa d’en Bossa',
          'Easy on foot or short taxi in San Antonio or Playa d’en Bossa',
          'Leicht zu Fuß oder per kurzem Taxi in San Antonio oder Bossa erreichbar',
          'Fácil a pie o en taxi corto en San Antonio o Playa d’en Bossa',
          'Facile à pied ou en court trajet de taxi à San Antonio ou Bossa',
        ),
      ],
      [
        L('Bohemian & Sunset (o.a. Sunset Ashram, Experimental Beach, Aiyanna)', 'Bohemian & Sunset (e.g. Sunset Ashram, Experimental Beach, Aiyanna)', 'Boho & Sunset (u.a. Sunset Ashram, Experimental Beach, Aiyanna)', 'Bohemio y atardecer (ej. Sunset Ashram, Experimental Beach, Aiyanna)', 'Bohème & Coucher de soleil (ex. Sunset Ashram, Experimental Beach, Aiyanna)'),
        L(
          'Barefoot chic, ontspannen zonsondergang, stellen en levensgenieters',
          'Barefoot chic, laid-back sunsets, couples and relaxed foodies',
          'Barfuß-Chic, traumhafte Sonnenuntergänge, Paare und Genießer',
          'Estilo desenfadado chic, atardeceres mágicos, parejas y relax',
          'Élégance décontractée pieds dans le sable, couchers de soleil et couples',
        ),
        L(
          'Enkele ligbedden op rots/strand; voor zonsondergang-diner altijd tijdig tafel vastleggen',
          'Limited loungers on beach/rocks; dinner table reservation essential for sunset slot',
          'Begrenzte Liegen auf Fels/Strand; Tische zum Sonnenuntergang zwingend vorab sichern',
          'Pocas hamacas en roca/playa; cena de puesta de sol imprescindible reservar mesa',
          'Quelques transats sur roche/sable ; réservation de table obligatoire pour le coucher de soleil',
        ),
        L(
          'Organic deep house, downtempo, akoestische klanken en sunset-rituelen',
          'Organic deep house, downtempo, ambient melodies and sunset vibes',
          'Organic Deep House, Downtempo, sanfte Klänge und Sunset-Vibes',
          'Deep house orgánico, downtempo, sonidos acústicos y puesta de sol',
          'Deep house organique, downtempo, mélodies acoustiques au crépuscule',
        ),
        L(
          'Huurauto of vooraf geboekte transfer aanbevolen (smalle toegangswegen en afgelegen baaien)',
          'Hire car or pre-booked transfer recommended (remote coves and narrow dirt access)',
          'Mietwagen oder vorab gebuchter Transfer ratsam (abgelegene Buchten, schmale Wege)',
          'Se recomienda coche de alquiler o traslado reservado (calas remotas y accesos estrechos)',
          'Voiture de location ou transfert réservé recommandé (criques isolées et accès étroits)',
        ),
      ],
      [
        L('Luxe & Gastronomisch (o.a. Casa Jondal, Cala Bassa Beach Club, Beso Beach)', 'Luxury & Dining (e.g. Casa Jondal, Cala Bassa Beach Club, Beso Beach)', 'Luxus & Gastronomie (u.a. Casa Jondal, Cala Bassa Beach Club, Beso Beach)', 'Lujo y gastronomía (ej. Casa Jondal, Cala Bassa Beach Club, Beso Beach)', 'Luxe & Gastronomie (ex. Casa Jondal, Cala Bassa Beach Club, Beso Beach)'),
        L(
          'Exclusief, verse zeevruchten, jachteigenaren, verfijnde service en comfort',
          'Upscale, fresh Mediterranean seafood, yacht crowd, polished service and prime comfort',
          'Gehoben, fangfrische Meeresfrüchte, Yachtgäste, erstklassiger Service und Komfort',
          'Exclusivo, mariscos frescos, ambiente náutico, servicio impecable y confort',
          'Haut de gamme, fruits de mer frais, clientèle nautique, service attentif et grand confort',
        ),
        L(
          'Comfortabele Balinese bedden en ligbedden (aparte reservering van het restaurant); zomers weken vooraf vol',
          'Premium Balinese daybeds and sunbeds (booked separately from dining); weeks ahead in peak summer',
          'Breite Balinesische Betten und Liegen (separat vom Restaurant zu buchen); im Sommer früh ausgebucht',
          'Camas balinesas y hamacas premium (reserva independiente del restaurante); se llena semanas antes',
          'Lits balinais et transats haut de gamme (réservation distincte du restaurant) ; complet en été',
        ),
        L(
          'Chique lounge, Balearic beats op aangenaam volume zodat gesprekken centraal staan',
          'Sophisticated lounge, tasteful Balearic beats kept at conversational level',
          'Edle Lounge-Musik, stilvolle Balearic Beats auf angenehmer Gesprächslautstärke',
          'Música lounge elegante y ritmos baleáricos a un volumen que permite conversar',
          'Lounge raffiné, rythmes baléares à un volume propice aux conversations',
        ),
        L(
          'Bereikbaar per auto (vaak valet parking) of rechtstreeks met zodiac-tenderservice vanaf je privécharter',
          'Accessible by car (often valet) or tender boat service directly from your chartered yacht',
          'Per Auto (oft Valet-Parking) oder per Zodiac-Tenderservice direkt von der Privatyacht erreichbar',
          'En coche (suele haber aparcacoches) o en lancha rápida/tender directo desde tu barco privado',
          'En voiture (souvent voiturier) ou par service de navette zodiac depuis votre bateau privé',
        ),
      ],
    ],
    note: L(
      'Goed om te weten: Wij exploiteren geen beachclubs en verkopen geen losse bedden — reserveringen lopen rechtstreeks bij de locaties zelf. Wel helpen we je dag naadloos in te richten in combinatie met een bootcharter, luxe transfer of vervoer naar afgelegen baaien. Vraag Simon via WhatsApp om lokaal advies.',
      'Good to know: We do not operate beach clubs or resell individual sunbeds — bookings are handled directly with each venue. We do help you seamlessly plan your day in tandem with a private boat charter, VIP transfer or island transport. Ask Simon over WhatsApp for local guidance.',
      'Gut zu wissen: Wir betreiben keine Beachclubs und verkaufen keine einzelnen Liegen — Reservierungen erfolgen direkt bei den Venues. Wir helfen dir jedoch gerne, deinen Strandtag nahtlos mit einem Bootcharter, VIP-Transfer oder Inseltransport zu verbinden. Frag Simon per WhatsApp.',
      'A tener en cuenta: No gestionamos beach clubs ni revendemos hamacas sueltas — las reservas se realizan directamente con cada establecimiento. Te ayudamos a coordinar tu día en combinación con un barco privado, traslado VIP o transporte por la isla. Escribe a Simon por WhatsApp.',
      'Bon à savoir : Nous n’exploitons aucun beach club et ne vendons pas de transats isolés — les réservations s’effectuent directement auprès de chaque établissement. Nous vous aidons à articuler votre journée avec un charter privé, un transfert VIP ou vos déplacements. Contactez Simon sur WhatsApp.',
    ),
  },
  'airport-transfer': {
    heading: L(
      'De vier manieren vanaf Ibiza Airport naar je verblijf',
      'Four ways from Ibiza Airport to your accommodation',
      'Vier Wege vom Flughafen Ibiza zu deiner Unterkunft',
      'Las cuatro formas de ir del aeropuerto de Ibiza a tu alojamiento',
      'Quatre façons de rejoindre votre hébergement depuis l’aéroport d’Ibiza',
    ),
    intro: L(
      'Vanaf de aankomsthal van Ibiza Airport (IBZ) zijn er vier reële manieren om bij je hotel of villa te komen. De tabel hieronder vergelijkt ze op reistijd, wachttijd, comfort en tariefstructuur.',
      'From the arrivals terminal at Ibiza Airport (IBZ) there are four practical ways to reach your hotel or villa. The table below compares them by journey time, waiting time, convenience and pricing structure.',
      'Vom Ankunftsbereich am Flughafen Ibiza (IBZ) gibt es vier praktische Optionen, um dein Hotel oder deine Finca zu erreichen. Die folgende Übersicht vergleicht Fahrzeit, Wartezeit, Komfort und Tarifstruktur.',
      'Desde la terminal de llegadas del aeropuerto de Ibiza (IBZ) hay cuatro formas de llegar a tu hotel o villa. La tabla las compara por tiempo de trayecto, espera, comodidad y tipo de tarifa.',
      'Depuis le hall des arrivées de l’aéroport d’Ibiza (IBZ), quatre options s’offrent à vous pour rejoindre votre hôtel ou villa. Le tableau ci-dessous compare durée de trajet, attente, confort et tarification.',
    ),
    caption: L(
      'Vergelijking van vervoersopties vanaf Ibiza Airport: reistijd, wachttijd aan de terminal, geschikt voor en boeking/tarief.',
      'Comparison of transport options from Ibiza Airport: travel time, terminal wait time, best suited for and booking/pricing.',
      'Vergleich der Transportoptionen ab Flughafen Ibiza: Fahrzeit, Wartezeit am Terminal, Eignung und Buchung/Tarif.',
      'Comparativa de opciones de transporte desde el aeropuerto de Ibiza: tiempo de viaje, espera en la terminal, para quién encaja y reserva/tarifa.',
      'Comparatif des options de transport depuis l’aéroport d’Ibiza : temps de trajet, attente au terminal, idéal pour et réservation/tarif.',
    ),
    columns: [
      L('Vervoersoptie', 'Transport option', 'Transportmittel', 'Opción de transporte', 'Mode de transport'),
      L('Reistijd naar stad/zuid', 'Travel time to Town/South', 'Fahrzeit Stadt/Süd', 'Tiempo a Ibiza/Sur', 'Temps vers ville/sud'),
      L('Wachttijd aan terminal', 'Terminal wait time', 'Wartezeit am Terminal', 'Tiempo de espera en terminal', 'Attente au terminal'),
      L('Ideaal voor', 'Best suited for', 'Ideal für', 'Ideal para', 'Idéal pour'),
      L('Boeken & Tarief', 'Booking & Fare rule', 'Buchung & Tarif', 'Reserva y tarifa', 'Réservation & tarif'),
    ],
    rows: [
      [
        L('Officiële taxistandplaats', 'Official airport taxi rank', 'Offizieller Taxistand', 'Parada oficial de taxis', 'Station de taxis officielle'),
        L(
          '15–20 min naar Ibiza-Stad / Bossa; 30–35 min naar San Antonio',
          '15–20 min to Ibiza Town / Bossa; 30–35 min to San Antonio',
          '15–20 Min. nach Ibiza-Stadt / Bossa; 30–35 Min. nach San Antonio',
          '15–20 min a Ibiza ciudad / Bossa; 30–35 min a San Antonio',
          '15–20 min vers Ibiza-ville / Bossa ; 30–35 min vers San Antonio',
        ),
        L(
          'Kort overdag buiten het hoogseizoen; kan in juli/augustus oplopen tot 30–50+ minuten in de rij',
          'Short off-peak; can reach 30–50+ minutes in the queue during summer peak evening arrivals',
          'Tagsüber kurz; in der Hochsaison abends oft 30–50+ Minuten Schlange stehen',
          'Corta fuera de temporada; en verano por la noche puede superar 30–50 minutos de cola',
          'Courte hors saison ; peut atteindre 30–50+ minutes de file lors des arrivées du soir en été',
        ),
        L(
          '1 tot 3 personen met lichte bagage die overdag landen nabij de stad',
          '1 to 3 passengers with light luggage landing during daytime near Ibiza Town',
          '1 bis 3 Personen mit leichtem Gepäck bei Tageslandungen nahe der Stadt',
          '1 a 3 personas con poco equipaje que llegan de día cerca de la ciudad',
          '1 à 3 personnes avec bagages légers arrivant de jour près de la ville',
        ),
        L(
          'Geen boeking vooraf; rit verloopt op de meter met luchthaven- en nachttaxatoeslagen',
          'No advance booking; metered fare with airport and night supplements added',
          'Keine Vorabbuchung; Taxameterfahrt zzgl. Flughafen- und Nachtzuschlägen',
          'Sin reserva previa; se cobra por taxímetro con suplementos de aeropuerto y nocturno',
          'Sans réservation ; tarif au compteur avec suppléments aéroport et nuit',
        ),
      ],
      [
        L('Vooraf geboekte privétransfer (Simon / WhatsApp)', 'Pre-booked private transfer (Simon / WhatsApp)', 'Vorab gebuchter Privattransfer (Simon / WhatsApp)', 'Traslado privado reservado (Simon / WhatsApp)', 'Transfert privé réservé (Simon / WhatsApp)'),
        L(
          '15–20 min naar Ibiza-Stad; directe rit zonder tussenstops naar elke villa of hotel',
          '15–20 min to Ibiza Town; direct door-to-door run to any villa or resort across the island',
          '15–20 Min. nach Ibiza-Stadt; direkte Fahrt zu jeder Finca oder jedem Hotel ohne Umwege',
          '15–20 min a Ibiza ciudad; directo puerta a puerta a cualquier villa u hotel',
          '15–20 min vers Ibiza-ville ; direct porte-à-porte vers toute villa ou hôtel de l’île',
        ),
        L(
          '0 minuten: chauffeur wacht met naambordje in de aankomsthal en volgt je vluchtnummer live',
          '0 minutes: driver meets you in arrivals with name sign, tracking your flight live for delays',
          '0 Minuten: Fahrer erwartet dich mit Namensschild in der Ankunftshalle (Flugverfolgung live)',
          '0 minutos: el chófer espera con cartel con tu nombre en llegadas y monitoriza el vuelo',
          '0 minute : chauffeur avec pancarte nominative aux arrivées et suivi du vol en temps réel',
        ),
        L(
          'Families, vriendengroepen (4–8+ pers.), nachtvluchten en villa’s op het platteland',
          'Families, friend groups (4–8+ guests), late night arrivals and countryside villas',
          'Familien, Gruppen (4–8+ Pers.), Spätflieger und Fincas im Inselinneren',
          'Familias, grupos (4–8+ personas), llegadas de madrugada y villas en el campo',
          'Familles, groupes (4–8+ pers.), arrivées tardives et villas isolées',
        ),
        L(
          'Vaste ritprijs vooraf schriftelijk bevestigd via WhatsApp; kinderzitjes op verzoek',
          'Fixed rate agreed in advance via WhatsApp; child seats available upon request',
          'Fester Pauschalpreis vorab per WhatsApp bestätigt; Kindersitze auf Anfrage',
          'Precio cerrado por adelantado vía WhatsApp; sillitas de bebé bajo petición',
          'Tarif fixe confirmé à l’avance par WhatsApp ; sièges enfants sur demande',
        ),
      ],
      [
        L('Huurauto op de luchthaven (o.a. Wiber)', 'Airport car rental (e.g. Wiber)', 'Mietwagen am Flughafen (u.a. Wiber)', 'Coche de alquiler en el aeropuerto (ej. Wiber)', 'Voiture de location aéroport (ex. Wiber)'),
        L(
          'Flexibel in eigen tempo; eilandbreed de hele vakantie beschikbaar',
          'Drive at your own pace; full island freedom for your entire stay',
          'Flexibel im eigenen Tempo; volle Unabhängigkeit für den gesamten Aufenthalt',
          'A tu propio ritmo; máxima libertad por toda la isla durante toda la estancia',
          'À votre rythme ; totale liberté sur l’île pendant tout votre séjour',
        ),
        L(
          '15–25 min voor gratis shuttleservice en snelle sleuteloverdracht',
          '15–25 min for complimentary shuttle and quick contactless desk pick-up',
          '15–25 Min. für kostenlosen Shuttle und zügige Fahrzeugübernahme',
          '15–25 min entre la lanzadera gratuita y la entrega del vehículo',
          '15–25 min pour la navette gratuite et la prise en charge du véhicule',
        ),
        L(
          'Wie het noorden, afgelegen strandjes en clubs verspreid over het eiland wil verkennen',
          'Travellers exploring northern coves, secluded calas and venues across the island',
          'Reisende, die einsame Buchten im Norden und die ganze Insel erkunden wollen',
          'Viajeros que quieren recorrer calas vírgenes del norte y moverse libremente',
          'Voyageurs souhaitant explorer les criques du nord et toute l’île en toute liberté',
        ),
        L(
          'Vooraf online boeken met all-inclusive dekking en creditcard op naam van hoofdbestuurder',
          'Book online in advance with all-inclusive cover and credit card in main driver’s name',
          'Vorab online buchen mit All-Inclusive-Schutz und Kreditkarte des Hauptfahrers',
          'Reserva online previa con cobertura todo incluido y tarjeta a nombre del conductor',
          'Réservation en ligne préalable tout inclus avec carte de crédit au nom du conducteur',
        ),
      ],
      [
        L('Openbare lijnbus', 'Public regular bus', 'Öffentlicher Linienbus', 'Autobús público de línea', 'Bus régulier de ligne'),
        L(
          '25–35 min naar Ibiza-Stad (L10); seizoensdienst naar San Antonio en Santa Eulària',
          '25–35 min to Ibiza Town (L10); seasonal summer lines to San Antonio and Santa Eulària',
          '25–35 Min. nach Ibiza-Stadt (L10); im Sommer Linien nach San Antonio und Santa Eulària',
          '25–35 min a Ibiza ciudad (L10); en verano líneas a San Antonio y Santa Eulària',
          '25–35 min vers Ibiza-ville (L10) ; lignes estivales vers San Antonio et Santa Eulària',
        ),
        L(
          '15–30 min afhankelijk van de actuele vertrektijden volgens dienstregeling',
          '15–30 min depending on the scheduled departure intervals',
          '15–30 Min. je nach aktuellem Abfahrtstakt des Fahrplans',
          '15–30 min según el intervalo de salidas del horario oficial',
          '15–30 min selon la fréquence des départs programmés',
        ),
        L(
          'Soloreizigers en budgetreizigers met handbagage die dichtbij het centrale busstation verblijven',
          'Solo or budget travellers with hand luggage staying near the central bus terminal',
          'Alleinreisende und Budget-Urlauber mit leichtem Gepäck nahe der Busstation',
          'Viajeros solos o de bajo presupuesto con equipaje de mano cerca de la estación',
          'Voyageurs solos ou petit budget avec bagage cabine logeant près de la gare routière',
        ),
        L(
          'Los kaartje kopen bij instappen in de bus; rijdt niet na middernacht',
          'Single ticket purchased on board; stops running around midnight',
          'Einzelticket beim Fahrer beim Einsteigen; fährt nachts nach Mitternacht nicht',
          'Billete sencillo al subir al autobús; deja de operar pasada la medianoche',
          'Billet à l’unité acheté à bord ; aucun service après minuit',
        ),
      ],
    ],
    note: L(
      'Goed om te weten: Populaire ritdienst-apps hebben op Ibiza een zeer beperkte vloot en mogen niet altijd direct voor de terminal voorrijden. Voor vluchten na 23:00 uur of groepen vanaf 4 personen raden we aan om vooraf een transfer vast te leggen.',
      'Good to know: Ride-hailing apps maintain very limited fleets in Ibiza and cannot always pick up immediately curbside. For flights arriving past 23:00 or parties of 4+ passengers, pre-booking a private transfer avoids long queues.',
      'Gut zu wissen: Fahrdienst-Apps haben auf Ibiza eine sehr kleine Flotte und dürfen oft nicht direkt am Terminal vorfahren. Bei Flügen nach 23:00 Uhr oder Gruppen ab 4 Personen empfiehlt sich ein vorab gebuchter Transfer.',
      'A tener en cuenta: Las aplicaciones de transporte tienen una flota muy limitada en la isla y restricciones en terminal. Para vuelos que llegan después de las 23:00 o grupos de 4 o más personas, reservar con antelación evita largas colas.',
      'Bon à savoir : Les applications VTC disposent d’une flotte très restreinte à Ibiza et de restrictions aux abords du terminal. Pour les vols après 23h ou les groupes de 4 personnes et plus, réserver à l’avance évite les longues attentes.',
    ),
  },
}

export const QUICK_FACTS = WATER_FACTS

