import type { Metadata } from 'next'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, SITE_NAME, type Locale } from './seo'

// ── Per-page SEO copy ──────────────────────────────────────────────────
// Localized title + description for the static routes, keyed by their
// locale-agnostic path. `staticMetadata()` turns an entry into a full
// Metadata object (canonical + hreflang + OG + Twitter) via pageMetadata().

type Copy = { title: Record<Locale, string>; description: Record<Locale, string> }

const L = (nl: string, en: string, de: string, es: string, fr: string): Record<Locale, string> => ({ nl, en, de, es, fr })

// Homepage title/description — also reused as the JSON-LD Organization/TravelAgency
// "bio" (HomeJsonLd.tsx) so every place Google can surface a business description
// (meta tag, Knowledge Panel, rich result) shows the same story.
export const HOME_TITLE: Record<Locale, string> = L(
  'Ibiza Tickets, Clubs, Privéboten & Events',
  'Ibiza Club Tickets, Private Boats & Events',
  'Ibiza Tickets, Clubs, Privatboote & Events',
  'Entradas Ibiza, Clubs, Barcos Privados y Eventos',
  'Billets Ibiza, Clubs, Bateaux Privés & Événements',
)
export const HOME_DESC: Record<Locale, string> = L(
  'Boek clubtickets, privéboten, boat parties, VIP-tafels en Formentera-trips op Ibiza — alles op één platform, geregeld door lokale experts.',
  'Book club tickets, private boat charters, boat parties, VIP tables and Formentera trips in Ibiza — all on one platform, handled by local experts.',
  'Buche Clubtickets, Privatboote, Boat-Partys, VIP-Tische und Formentera-Trips auf Ibiza — alles auf einer Plattform, organisiert von lokalen Experten.',
  'Reserva entradas a clubs, barcos privados, boat parties, mesas VIP y excursiones a Formentera en Ibiza — todo en una plataforma, con expertos locales.',
  'Réservez billets de clubs, bateaux privés, boat parties, tables VIP et excursions à Formentera à Ibiza — le tout sur une seule plateforme.',
)

export const SEO_PAGES: Record<string, Copy> = {
  calendar: {
    title: L(
      'Ibiza Clubagenda 2026 — alle line-ups',
      'Ibiza Club Calendar 2026 — Every Line-up',
      'Ibiza Clubkalender 2026 — alle Line-ups',
      'Agenda de Clubs Ibiza 2026 — Line-ups',
      'Calendrier des Clubs Ibiza 2026',
    ),
    description: L(
      'Bekijk de complete Ibiza-agenda: alle clubevents, festivals en line-ups per dag. Koop je tickets veilig via de officiële partner.',
      'Browse the full Ibiza calendar: every club event, festival and line-up by day. Buy tickets securely via the official partner.',
      'Der komplette Ibiza-Kalender: alle Clubevents, Festivals und Line-ups pro Tag. Tickets sicher über den offiziellen Partner.',
      'Consulta la agenda completa de Ibiza: todos los eventos, festivales y line-ups por día. Compra entradas de forma segura.',
      'Consultez l’agenda complet d’Ibiza : tous les événements, festivals et line-ups par jour. Billets en toute sécurité.',
    ),
  },
  'club-tickets': {
    title: L(
      'Ibiza Club Tickets 2026 — Hï, Ushuaïa, Pacha & meer',
      'Ibiza Club Tickets 2026 — Hï, Ushuaïa, Pacha & More',
      'Ibiza Club Tickets 2026 — Hï, Ushuaïa, Pacha & mehr',
      'Entradas Clubs Ibiza 2026 — Hï, Ushuaïa, Pacha y más',
      'Billets Clubs Ibiza 2026 — Hï, Ushuaïa, Pacha & plus',
    ),
    description: L(
      'Officiële tickets voor de beste clubs van Ibiza: Hï, Ushuaïa, Pacha, Amnesia en meer. Directe levering, geen verborgen kosten.',
      'Official tickets for Ibiza’s best clubs: Hï, Ushuaïa, Pacha, Amnesia and more. Instant delivery, no hidden fees.',
      'Offizielle Tickets für Ibizas beste Clubs: Hï, Ushuaïa, Pacha, Amnesia und mehr. Sofortige Lieferung, keine versteckten Kosten.',
      'Entradas oficiales para los mejores clubs de Ibiza: Hï, Ushuaïa, Pacha, Amnesia y más. Entrega inmediata, sin costes ocultos.',
      'Billets officiels pour les meilleurs clubs d’Ibiza : Hï, Ushuaïa, Pacha, Amnesia et plus. Livraison immédiate, sans frais cachés.',
    ),
  },
  artists: {
    title: L(
      'Ibiza DJ’s & Artiesten 2026 — Wie speelt waar',
      'Ibiza DJs & Artists 2026 — Who Plays Where',
      'Ibiza DJs & Künstler 2026 — Wer spielt wo',
      'DJs y Artistas Ibiza 2026 — Quién toca dónde',
      'DJs & Artistes Ibiza 2026 — Qui joue où',
    ),
    description: L(
      'Ontdek welke DJ’s en artiesten deze zomer op Ibiza spelen, met alle datums, clubs en tickets op één plek.',
      'Discover which DJs and artists are playing Ibiza this summer, with every date, club and ticket in one place.',
      'Entdecke, welche DJs und Künstler diesen Sommer auf Ibiza spielen — mit allen Terminen, Clubs und Tickets.',
      'Descubre qué DJs y artistas actúan en Ibiza este verano, con todas las fechas, clubs y entradas.',
      'Découvrez quels DJs et artistes jouent à Ibiza cet été, avec toutes les dates, clubs et billets.',
    ),
  },
  'deals-of-the-day': {
    title: L(
      'Ibiza Deals van de Dag — Tickets, Boten & Meer',
      'Ibiza Deals of the Day — Tickets, Boats & More',
      'Ibiza Angebote des Tages — Tickets, Boote & mehr',
      'Ofertas del Día Ibiza — Entradas, Barcos y Más',
      'Offres du Jour Ibiza — Billets, Bateaux & Plus',
    ),
    description: L(
      'De scherpste dagaanbiedingen op Ibiza: clubtickets, boottochten en activiteiten tegen de beste prijs. Elke dag vernieuwd.',
      'The sharpest daily deals in Ibiza: club tickets, boat trips and activities at the best price. Refreshed every day.',
      'Die besten Tagesangebote auf Ibiza: Clubtickets, Bootstouren und Aktivitäten zum Bestpreis. Täglich aktualisiert.',
      'Las mejores ofertas diarias en Ibiza: entradas, excursiones en barco y actividades al mejor precio. Cada día.',
      'Les meilleures offres du jour à Ibiza : billets, sorties en bateau et activités au meilleur prix. Chaque jour.',
    ),
  },
  // Carries BOTH terms on purpose — "guestlist" weghalen om bij het interne
  // label "Package Deals" te passen zou het trefwoord weggooien waarop deze
  // pagina daadwerkelijk gevonden wordt.
  //
  // Wat wél veranderd is, is de volgorde: guestlist staat nu vooraan, in titel
  // en in omschrijving. Een titel wordt van links naar rechts gewogen en in
  // zoekresultaten aan de achterkant afgekapt, dus de eerste term bepaalt
  // waar deze pagina volgens de buitenwereld over gaat. Package deals blijven
  // er gewoon in staan, alleen niet meer als eerste — zelfde volgorde als de
  // H1 nu, zie de kop van de guestlist-pagina voor de redenering.
  guestlist: {
    title: L(
      'Ibiza Guestlist & Package Deals — via WhatsApp',
      'Ibiza Guestlist & Package Deals — via WhatsApp',
      'Ibiza Gästeliste & Package Deals — per WhatsApp',
      'Guestlist de Ibiza y Package Deals — por WhatsApp',
      'Guestlist Ibiza & Package Deals — via WhatsApp',
    ),
    description: L(
      'De gastenlijst van de beste clubs op Ibiza, plus package deals en groepsdeals. Simon regelt het via WhatsApp en vertelt je vooraf precies wat er die avond geldt.',
      'The guestlist at Ibiza’s best clubs, plus package deals and group deals. Simon arranges it via WhatsApp and tells you beforehand exactly what applies that night.',
      'Die Gästeliste der besten Clubs Ibizas, dazu Package Deals und Gruppendeals. Simon organisiert es per WhatsApp und sagt dir vorher genau, was an dem Abend gilt.',
      'La lista de los mejores clubs de Ibiza, más package deals y ofertas de grupo. Simon lo gestiona por WhatsApp y te dice antes exactamente qué aplica esa noche.',
      'La guestlist des meilleurs clubs d’Ibiza, plus des package deals et offres de groupe. Simon s’en occupe via WhatsApp et vous précise à l’avance ce qui s’applique ce soir-là.',
    ),
  },
  clubs: {
    title: L(
      'Clubs op Ibiza — Alle clubs en feesten',
      'Ibiza Clubs — Every Club and Party',
      'Clubs auf Ibiza — Alle Clubs und Partys',
      'Clubs de Ibiza — Todos los clubs y fiestas',
      'Clubs à Ibiza — Tous les clubs et soirées',
    ),
    description: L(
      'Alle clubs op Ibiza op één plek, met het programma per club en officiële tickets via onze ticketpartner.',
      'Every Ibiza club in one place, with each club’s programme and official tickets through our ticket partner.',
      'Alle Clubs auf Ibiza an einem Ort, mit dem Programm je Club und offiziellen Tickets über unseren Ticketpartner.',
      'Todos los clubs de Ibiza en un solo lugar, con el programa de cada club y entradas oficiales vía nuestro socio.',
      'Tous les clubs d’Ibiza au même endroit, avec le programme de chaque club et des billets officiels via notre partenaire.',
    ),
  },
  'boat-party': {
    title: L(
      'Ibiza Boat Party — Feesten op het Water',
      'Ibiza Boat Party — Party on the Water',
      'Ibiza Boat Party — Feiern auf dem Wasser',
      'Boat Party Ibiza — Fiesta en el Agua',
      'Boat Party Ibiza — La Fête sur l’Eau',
    ),
    description: L(
      'Beleef de ultieme Ibiza boat party: DJ’s, open bar en zwemstops in kristalhelder water. Boek je plek online.',
      'Experience the ultimate Ibiza boat party: DJs, open bar and swim stops in crystal-clear water. Book online.',
      'Erlebe die ultimative Ibiza Boat Party: DJs, Open Bar und Badestopps im kristallklaren Wasser. Online buchen.',
      'Vive la mejor boat party de Ibiza: DJs, barra libre y paradas de baño en agua cristalina. Reserva online.',
      'Vivez la boat party ultime d’Ibiza : DJs, open bar et pauses baignade en eau cristalline. Réservez en ligne.',
    ),
  },
  'boat-trip': {
    title: L(
      'Boottochten op Ibiza — dagtrips vanaf het water',
      'Boat trips in Ibiza — day trips on the water',
      'Bootstouren auf Ibiza — Tagesausflüge auf dem Wasser',
      'Excursiones en barco por Ibiza — salidas de día',
      'Sorties en bateau à Ibiza — journées sur l’eau',
    ),
    description: L(
      'Ontdek Ibiza en Formentera vanaf het water met onze boottochten en dagtrips. Zwemstops, zonnedeks en de mooiste baaien.',
      'Discover Ibiza and Formentera from the water with our boat trips and day excursions. Swim stops, sun decks and the finest bays.',
      'Entdecke Ibiza und Formentera vom Wasser aus mit unseren Bootstouren und Tagesausflügen. Badestopps und schönste Buchten.',
      'Descubre Ibiza y Formentera desde el mar con nuestras excursiones en barco. Paradas de baño y las mejores calas.',
      'Découvrez Ibiza et Formentera depuis l’eau avec nos sorties en bateau. Pauses baignade et plus belles criques.',
    ),
  },
  // Was 'Ibiza Boat Rental — Charters & Yachts', wat frontaal botste met de
  // pillar /boat-rental-ibiza: twee eigen URL's op één zoekopdracht. Deze
  // pagina is een hub die naar vijf categorieën routeert, en de titel zegt dat
  // nu ook — de verhuurintentie hoort bij de pillar.
  boats: {
    title: L(
      'Ibiza per boot: alle opties op het water',
      'Ibiza by boat: every option on the water',
      'Ibiza per Boot: alle Optionen',
      'Ibiza en barco: todas las opciones',
      'Ibiza en bateau : toutes les options',
    ),
    description: L(
      'Vijf manieren om Ibiza vanaf het water te zien: privécharter, boottocht, boat party, verhuur en de ferry. Kies je categorie.',
      'Five ways to see Ibiza from the water: private charter, boat trip, boat party, rental and the ferry. Pick your category.',
      'Fünf Wege, Ibiza vom Wasser zu sehen: Privatcharter, Bootstour, Boat Party, Vermietung und Fähre. Wähle deine Kategorie.',
      'Cinco formas de ver Ibiza desde el mar: chárter privado, excursión, boat party, alquiler y ferry. Elige tu categoría.',
      'Cinq façons de voir Ibiza depuis l’eau : charter privé, sortie, boat party, location et ferry. Choisissez votre catégorie.',
    ),
  },
  tours: {
    title: L(
      'Rondleidingen & excursies op Ibiza',
      'Guided tours & excursions in Ibiza',
      'Geführte Touren & Ausflüge auf Ibiza',
      'Visitas guiadas y excursiones en Ibiza',
      'Visites guidées & excursions à Ibiza',
    ),
    description: L(
      'Excursies met gids op Ibiza: Dalt Vila, Es Vedrà, de hippiemarkten en zonsondergangtrips. Ophalen op afgesproken punten.',
      'Guided excursions in Ibiza: Dalt Vila, Es Vedrà, the hippy markets and sunset trips. Pick-up at agreed points.',
      'Geführte Ausflüge auf Ibiza: Dalt Vila, Es Vedrà, die Hippiemärkte und Sonnenuntergangstouren. Abholung vereinbart.',
      'Excursiones guiadas en Ibiza: Dalt Vila, Es Vedrà, los mercadillos hippies y salidas al atardecer.',
      'Excursions guidées à Ibiza : Dalt Vila, Es Vedrà, les marchés hippies et sorties au coucher du soleil.',
    ),
  },
  // Leidde met 'Jet Ski', wat sinds /jet-ski-rental-ibiza bestaat de sterkste
  // term van die pagina wegnam. Jetski blijft in de content staan; de titel
  // dekt nu de categorie.
  'water-sports': {
    title: L(
      'Watersport op Ibiza — het hele aanbod',
      'Water sports in Ibiza — the full range',
      'Wassersport auf Ibiza — das Angebot',
      'Deportes acuáticos en Ibiza',
      'Sports nautiques à Ibiza',
    ),
    description: L(
      'Van jetski en flyboard tot parasailing: boek de beste watersport-activiteiten op Ibiza. Voor alle niveaus.',
      'From jet ski and flyboard to parasailing: book the best water sports activities in Ibiza. For all levels.',
      'Von Jetski und Flyboard bis Parasailing: buche die besten Wassersport-Aktivitäten auf Ibiza. Für alle Level.',
      'De moto de agua y flyboard a parasailing: reserva las mejores actividades acuáticas en Ibiza.',
      'Du jet ski au flyboard en passant par le parachute ascensionnel : réservez les meilleures activités nautiques.',
    ),
  },
  activities: {
    title: L(
      'Wat te doen op Ibiza — alle activiteiten',
      'Things to do in Ibiza — every activity',
      'Was tun auf Ibiza — alle Aktivitäten',
      'Qué hacer en Ibiza — todas las actividades',
      'Que faire à Ibiza — toutes les activités',
    ),
    description: L(
      'Het volledige activiteitenoverzicht van Ibiza, met de agenda per aanbieder. Watersport en rondleidingen hebben een eigen pagina.',
      'The complete overview of activities in Ibiza, with the agenda per provider. Water sports and guided tours have their own page.',
      'Die komplette Aktivitätenübersicht für Ibiza, mit Agenda pro Anbieter. Wassersport und Touren haben eigene Seiten.',
      'El listado completo de actividades en Ibiza, con la agenda por proveedor. Deportes acuáticos y tours tienen su página.',
      'La liste complète des activités à Ibiza, avec l’agenda par prestataire. Nautisme et visites guidées ont leur page.',
    ),
  },
  'ferry-formentera': {
    title: L(
      'Ferry Ibiza — Formentera | Tickets & Tijden',
      'Ferry Ibiza — Formentera | Tickets & Times',
      'Fähre Ibiza — Formentera | Tickets & Zeiten',
      'Ferry Ibiza — Formentera | Billetes y Horarios',
      'Ferry Ibiza — Formentera | Billets & Horaires',
    ),
    description: L(
      'Boek je ferry van Ibiza naar Formentera: dagelijkse afvaarten, scherpe prijzen en directe bevestiging.',
      'Book your ferry from Ibiza to Formentera: daily crossings, sharp prices and instant confirmation.',
      'Buche deine Fähre von Ibiza nach Formentera: tägliche Überfahrten, faire Preise, sofortige Bestätigung.',
      'Reserva tu ferry de Ibiza a Formentera: salidas diarias, precios ajustados y confirmación inmediata.',
      'Réservez votre ferry d’Ibiza à Formentera : traversées quotidiennes, prix serrés, confirmation immédiate.',
    ),
  },
  'shuttle-ferry': {
    title: L(
      'Ibiza Shuttle Ferry — Snel over Water',
      'Ibiza Shuttle Ferry — Fast Water Transfers',
      'Ibiza Shuttle-Fähre — Schnell übers Wasser',
      'Shuttle Ferry Ibiza — Traslados Rápidos',
      'Navette Ferry Ibiza — Transferts Rapides',
    ),
    description: L(
      'Snelle shuttle-ferry’s tussen de stranden en baaien van Ibiza. Sla het verkeer over en reis over water.',
      'Fast shuttle ferries between Ibiza’s beaches and bays. Skip the traffic and travel by water.',
      'Schnelle Shuttle-Fähren zwischen Ibizas Stränden und Buchten. Umgehe den Verkehr und reise übers Wasser.',
      'Ferries lanzadera rápidos entre las playas y calas de Ibiza. Evita el tráfico y viaja por mar.',
      'Navettes rapides entre les plages et criques d’Ibiza. Évitez le trafic et voyagez par la mer.',
    ),
  },
  // Dezelfde fout als guestlist/package deals: 'Auto & Scooter' zijn twee
  // zoekopdrachten op één URL. Auto's hebben sinds vandaag een eigen pillar
  // (/car-rental-ibiza), dus deze pagina is nu de scooterpagina en verwijst
  // voor auto's door. Zo vecht niets meer om dezelfde term.
  'car-scooter-rental': {
    title: L(
      'Scooter & quad huren op Ibiza',
      'Scooter & quad rental in Ibiza',
      'Roller & Quad mieten auf Ibiza',
      'Alquiler de motos y quads en Ibiza',
      'Location de scooter et quad à Ibiza',
    ),
    description: L(
      'Scooter of quad huren op Ibiza: parkeer overal, sla het verkeer over en zie het eiland op je eigen tempo. Auto huren regel je op onze autopagina.',
      'Rent a scooter or quad in Ibiza: park anywhere, skip the traffic and see the island at your own pace. Renting a car is on our car rental page.',
      'Roller oder Quad mieten auf Ibiza: überall parken, den Verkehr umgehen und die Insel im eigenen Tempo sehen. Mietwagen stehen auf unserer Autoseite.',
      'Alquila una moto o quad en Ibiza: aparca donde quieras, evita el tráfico y recorre la isla a tu ritmo. Los coches están en nuestra página de coches.',
      'Louez un scooter ou un quad à Ibiza : garez-vous partout, évitez le trafic et parcourez l’île à votre rythme. Les voitures ont leur propre page.',
    ),
  },
  'drink-packages': {
    title: L(
      'Ibiza Drankpakketten — Bespaar in de Club',
      'Ibiza Drink Packages — Save at the Club',
      'Ibiza Getränkepakete — Spare im Club',
      'Packs de Bebida Ibiza — Ahorra en el Club',
      'Forfaits Boissons Ibiza — Économisez en Club',
    ),
    description: L(
      'Vooraf geboekte drankpakketten voor de clubs van Ibiza. Weet wat je betaalt en bespaar op de bar.',
      'Pre-booked drink packages for Ibiza’s clubs. Know what you pay and save at the bar.',
      'Vorab gebuchte Getränkepakete für Ibizas Clubs. Weiß, was du zahlst, und spare an der Bar.',
      'Packs de bebida reservados por adelantado para los clubs de Ibiza. Sabe lo que pagas y ahorra.',
      'Forfaits boissons réservés à l’avance pour les clubs d’Ibiza. Sachez ce que vous payez et économisez.',
    ),
  },
  blog: {
    title: L(
      'Ibiza Blog — Tips, Gidsen & Nieuws',
      'Ibiza Blog — Tips, Guides & News',
      'Ibiza Blog — Tipps, Guides & News',
      'Blog Ibiza — Consejos, Guías y Noticias',
      'Blog Ibiza — Conseils, Guides & Actus',
    ),
    description: L(
      'Insider-tips, gidsen en nieuws over Ibiza: clubs, stranden, restaurants en het beste van het eiland.',
      'Insider tips, guides and news about Ibiza: clubs, beaches, restaurants and the best of the island.',
      'Insider-Tipps, Guides und News über Ibiza: Clubs, Strände, Restaurants und das Beste der Insel.',
      'Consejos, guías y noticias sobre Ibiza: clubs, playas, restaurantes y lo mejor de la isla.',
      'Conseils d’initiés, guides et actus sur Ibiza : clubs, plages, restaurants et le meilleur de l’île.',
    ),
  },
  'beach-clubs': {
    title: L(
      'Beachclubs Ibiza 2026 — Ligbedden & VIP-bedden per Gebied',
      'Ibiza Beach Clubs 2026 — Sunbeds & VIP Beds by Area',
      'Beachclubs Ibiza 2026 — Liegen & VIP-Betten nach Gebiet',
      'Beach Clubs Ibiza 2026 — Hamacas y Camas VIP por Zona',
      'Beach Clubs Ibiza 2026 — Transats & Lits VIP par Zone',
    ),
    description: L(
      'De bekendste beachclubs van Ibiza per gebied: Cala Bassa, Playa d’en Bossa, Cala Jondal, Ses Salines, Cala Comte en meer. Eerlijke tips over drukte, wind en bereikbaarheid.',
      'Ibiza’s best-known beach clubs area by area: Cala Bassa, Playa d’en Bossa, Cala Jondal, Ses Salines, Cala Comte and more. Honest notes on crowds, wind and getting there.',
      'Ibizas bekannteste Beachclubs nach Gebieten: Cala Bassa, Playa d’en Bossa, Cala Jondal, Ses Salines, Cala Comte und mehr. Ehrliche Hinweise zu Andrang, Wind und Anfahrt.',
      'Los beach clubs más conocidos de Ibiza por zonas: Cala Bassa, Playa d’en Bossa, Cala Jondal, Ses Salines, Cala Comte y más. Notas honestas sobre gentío, viento y acceso.',
      'Les beach clubs les plus connus d’Ibiza par zone : Cala Bassa, Playa d’en Bossa, Cala Jondal, Ses Salines, Cala Comte et plus. Notes honnêtes sur l’affluence, le vent et l’accès.',
    ),
  },
  contact: {
    title: L('Contact', 'Contact', 'Kontakt', 'Contacto', 'Contact'),
    description: L(
      'Neem contact op met Ibiza mi vida. Onze lokale concierge helpt je 24/7 via WhatsApp met tickets, boten en meer.',
      'Get in touch with Ibiza mi vida. Our local concierge helps you 24/7 via WhatsApp with tickets, boats and more.',
      'Kontaktiere Ibiza mi vida. Unser lokaler Concierge hilft dir 24/7 per WhatsApp mit Tickets, Booten und mehr.',
      'Contacta con Ibiza mi vida. Nuestro conserje local te ayuda 24/7 por WhatsApp con entradas, barcos y más.',
      'Contactez Ibiza mi vida. Notre conciergerie locale vous aide 24/7 sur WhatsApp : billets, bateaux et plus.',
    ),
  },
  'about-us': {
    title: L('Over Ons', 'About Us', 'Über Uns', 'Sobre Nosotros', 'À Propos'),
    description: L(
      'Ibiza mi vida is jouw lokale team op het eiland: clubtickets, privéboten, activiteiten en 24/7 concierge.',
      'Ibiza mi vida is your local team on the island: club tickets, private boats, activities and 24/7 concierge.',
      'Ibiza mi vida ist dein lokales Team auf der Insel: Clubtickets, Privatboote, Aktivitäten und 24/7 Concierge.',
      'Ibiza mi vida es tu equipo local en la isla: entradas, barcos privados, actividades y conserjería 24/7.',
      'Ibiza mi vida est votre équipe locale sur l’île : billets, bateaux privés, activités et conciergerie 24/7.',
    ),
  },
  faq: {
    title: L('Veelgestelde Vragen', 'Frequently Asked Questions', 'Häufige Fragen', 'Preguntas Frecuentes', 'Questions Fréquentes'),
    description: L(
      'Antwoorden op veelgestelde vragen over tickets, boekingen, boten en betalingen bij Ibiza mi vida.',
      'Answers to frequently asked questions about tickets, bookings, boats and payments at Ibiza mi vida.',
      'Antworten auf häufige Fragen zu Tickets, Buchungen, Booten und Zahlungen bei Ibiza mi vida.',
      'Respuestas a las preguntas frecuentes sobre entradas, reservas, barcos y pagos en Ibiza mi vida.',
      'Réponses aux questions fréquentes sur les billets, réservations, bateaux et paiements chez Ibiza mi vida.',
    ),
  },
}

// Localized fallback for secondary/legal pages not in SEO_PAGES.
const FALLBACK_DESC: Record<Locale, (name: string) => string> = {
  nl: (n) => `${n} bij Ibiza mi vida — jouw lokale gids voor tickets, boten en activiteiten op Ibiza.`,
  en: (n) => `${n} at Ibiza mi vida — your local guide to tickets, boats and activities in Ibiza.`,
  de: (n) => `${n} bei Ibiza mi vida — dein lokaler Guide für Tickets, Boote und Aktivitäten auf Ibiza.`,
  es: (n) => `${n} en Ibiza mi vida — tu guía local de entradas, barcos y actividades en Ibiza.`,
  fr: (n) => `${n} chez Ibiza mi vida — votre guide local des billets, bateaux et activités à Ibiza.`,
}

/**
 * A true sentence used to bring a too-short meta description up to length.
 *
 * Google truncates a description around 155–160 characters, but a description
 * far UNDER that wastes the space — and hundreds of pages here were generating
 * 90-to-110-character descriptions from a name plus a generic tail, which is
 * the single largest category of on-page problem on this site.
 *
 * Everything here has to be true of every page it can land on, because it lands
 * on all of them. It describes how this business actually works — a local team,
 * confirmation over WhatsApp before booking — and claims nothing about the
 * specific venue, boat or event the page is about. Do not add a figure, a
 * promise or a superlative to these strings: they cannot be verified per page.
 */
const DESC_TAIL: Record<Locale, string> = {
  nl: 'Ons team woont op Ibiza en bevestigt data, prijzen en beschikbaarheid via WhatsApp voordat je boekt.',
  en: 'Our team lives on Ibiza and confirms dates, prices and availability over WhatsApp before you book.',
  de: 'Unser Team lebt auf Ibiza und bestätigt Termine, Preise und Verfügbarkeit per WhatsApp vor der Buchung.',
  es: 'Nuestro equipo vive en Ibiza y confirma fechas, precios y disponibilidad por WhatsApp antes de reservar.',
  fr: 'Notre équipe vit à Ibiza et confirme dates, prix et disponibilités par WhatsApp avant votre réservation.',
}

/** Google's useful range. Below the minimum the snippet wastes space; above the
 *  maximum it gets cut off mid-sentence in the results. */
const DESC_MIN = 140
const DESC_MAX = 158

/**
 * Bring a description into the 140–158 range: pad a short one with DESC_TAIL,
 * trim a long one at a word boundary. Never returns something outside the range
 * unless the tail itself cannot close the gap, which it can for any input.
 */
export function fitDescription(text: string, locale: Locale): string {
  let out = (text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (out.length < DESC_MIN) {
    const tail = DESC_TAIL[locale]
    out = out ? `${out.replace(/[\s.]+$/, '')}. ${tail}` : tail
  }
  return truncateAtWord(out, DESC_MAX)
}

/**
 * A page title that still fits once the layout appends " | Ibiza mi vida".
 *
 * The root layout wraps every title in `%s | Ibiza mi vida`, which is 16
 * characters nobody writing a title remembers to count. Detail pages built from
 * a venue or event name regularly ran past 60 as a result, and Google then cuts
 * the brand off — the one part of the title that was supposed to be constant.
 * So the name is trimmed to fit rather than the brand being lost.
 */
const BRAND_SUFFIX_LENGTH = ' | Ibiza mi vida'.length
const TITLE_MAX = 60

export function fitTitle(title: string): string {
  const room = TITLE_MAX - BRAND_SUFFIX_LENGTH
  const t = title.trim()
  return t.length <= room ? t : truncateAtWord(t, room)
}

/**
 * Full Metadata for a static route.
 * @param localeRaw current locale (unvalidated)
 * @param path      locale-agnostic path, also used as the SEO_PAGES key (leading slash optional)
 * @param fallbackName human name used when the path has no bespoke copy
 * @param noindex   set for thin/legal pages that shouldn't rank
 */
export function staticMetadata(localeRaw: string, path: string, fallbackName?: string, noindex = false): Metadata {
  const locale = (LOCALES as readonly string[]).includes(localeRaw) ? (localeRaw as Locale) : DEFAULT_LOCALE
  const key = path.replace(/^\//, '')
  const copy = SEO_PAGES[key]
  // Bare title — the root layout template appends " | Ibiza mi vida".
  const title = copy ? copy.title[locale] : (fallbackName || key)
  const description = fitDescription(copy ? copy.description[locale] : FALLBACK_DESC[locale](fallbackName || key), locale)
  return pageMetadata({ locale, path: key, title: fitTitle(title), description, noindex })
}

/**
 * Full Metadata for a data-driven detail page (a specific venue/event/activity).
 * @param path  the full locale-agnostic path, e.g. `activities/${slug}`
 */
/**
 * Trim to a length without breaking a word, and without leaving dangling
 * punctuation. Falls back to a hard cut only if the text has no spaces at all.
 */
export function truncateAtWord(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  const base = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut
  return base.replace(/[\s,;:.\-–—]+$/, '') + '…'
}

export function detailMetadata(
  localeRaw: string,
  path: string,
  name: string,
  opts: { description?: string; image?: string; suffix?: string } = {},
): Metadata {
  const locale = (LOCALES as readonly string[]).includes(localeRaw) ? (localeRaw as Locale) : DEFAULT_LOCALE
  const clean = (name || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || SITE_NAME

  // Prefer the decorated title, fall back to the bare name when the decoration
  // is what pushes it over the limit — losing " — Ibiza" costs nothing, losing
  // half the event name costs the reader the thing they searched for.
  const decorated = `${clean}${opts.suffix ? ` ${opts.suffix}` : ' — Ibiza'}`
  const title = fitTitle(decorated.length <= TITLE_MAX - BRAND_SUFFIX_LENGTH ? decorated : clean)

  const rawDesc = (opts.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  // Never cut mid-word. The old `.slice(0, 160)` produced descriptions ending
  // in fragments like "Met de gr", which is what Google actually printed in the
  // results — and a snippet that stops mid-word is one nobody clicks.
  // fitDescription also pads a too-short one; most of these come from a venue
  // blurb of two lines, which left the snippet half empty.
  const description = fitDescription(rawDesc || FALLBACK_DESC[locale](clean), locale)
  return pageMetadata({ locale, path, title, description, images: opts.image ? [opts.image] : undefined })
}
