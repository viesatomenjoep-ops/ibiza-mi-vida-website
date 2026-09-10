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
}
