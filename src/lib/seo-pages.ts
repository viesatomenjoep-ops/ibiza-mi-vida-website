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
      'Ibiza Agenda 2026 — Alle Clubevents & Line-ups',
      'Ibiza Calendar 2026 — All Club Events & Line-ups',
      'Ibiza Kalender 2026 — Alle Clubevents & Line-ups',
      'Agenda Ibiza 2026 — Todos los Eventos y Line-ups',
      'Agenda Ibiza 2026 — Tous les Événements & Line-ups',
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
  // Carries BOTH terms on purpose. The UI label is now "Package Deals", but
  // "guestlist" is the term with the search volume and the one this page ranks
  // for, so it stays in the title and description. Dropping it to match the new
  // label would have thrown away the keyword.
  guestlist: {
    title: L(
      'Ibiza Package Deals & Gastenlijst — via WhatsApp',
      'Ibiza Package Deals & Guestlist — via WhatsApp',
      'Ibiza Package Deals & Gästeliste — per WhatsApp',
      'Package Deals y Lista de Ibiza — por WhatsApp',
      'Package Deals & Guestlist Ibiza — via WhatsApp',
    ),
    description: L(
      'Package deals, groepsdeals en de gastenlijst van de beste clubs op Ibiza. Simon regelt het via WhatsApp en vertelt je vooraf precies wat er die avond geldt.',
      'Package deals, group deals and the guestlist at Ibiza’s best clubs. Simon arranges it via WhatsApp and tells you beforehand exactly what applies that night.',
      'Package Deals, Gruppendeals und die Gästeliste der besten Clubs Ibizas. Simon organisiert es per WhatsApp und sagt dir vorher genau, was an dem Abend gilt.',
      'Package deals, ofertas de grupo y la lista de los mejores clubs de Ibiza. Simon lo gestiona por WhatsApp y te dice antes exactamente qué aplica esa noche.',
      'Package deals, offres de groupe et la guestlist des meilleurs clubs d’Ibiza. Simon s’en occupe via WhatsApp et vous précise à l’avance ce qui s’applique ce soir-là.',
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
      'Ibiza Boottochten — Dagtrips & Excursies',
      'Ibiza Boat Trips — Day Trips & Excursions',
      'Ibiza Bootstouren — Tagesausflüge & Touren',
      'Excursiones en Barco Ibiza — Salidas de Día',
      'Sorties en Bateau Ibiza — Excursions à la Journée',
    ),
    description: L(
      'Ontdek Ibiza en Formentera vanaf het water met onze boottochten en dagtrips. Zwemstops, zonnedeks en de mooiste baaien.',
      'Discover Ibiza and Formentera from the water with our boat trips and day excursions. Swim stops, sun decks and the finest bays.',
      'Entdecke Ibiza und Formentera vom Wasser aus mit unseren Bootstouren und Tagesausflügen. Badestopps und schönste Buchten.',
      'Descubre Ibiza y Formentera desde el mar con nuestras excursiones en barco. Paradas de baño y las mejores calas.',
      'Découvrez Ibiza et Formentera depuis l’eau avec nos sorties en bateau. Pauses baignade et plus belles criques.',
    ),
  },
  boats: {
    title: L(
      'Ibiza Boten Huren — Charters & Jachten',
      'Ibiza Boat Rental — Charters & Yachts',
      'Ibiza Boote Mieten — Charter & Yachten',
      'Alquiler de Barcos Ibiza — Chárter y Yates',
      'Location de Bateaux Ibiza — Charters & Yachts',
    ),
    description: L(
      'Huur een boot of jacht op Ibiza met of zonder schipper. Van sloepen tot luxe jachten — de hele vloot op één plek.',
      'Rent a boat or yacht in Ibiza with or without a skipper. From day boats to luxury yachts — the full fleet in one place.',
      'Miete ein Boot oder eine Yacht auf Ibiza mit oder ohne Skipper. Von Tagesbooten bis Luxusyachten — die ganze Flotte.',
      'Alquila un barco o yate en Ibiza con o sin patrón. Desde barcos de día a yates de lujo — toda la flota.',
      'Louez un bateau ou un yacht à Ibiza avec ou sans skipper. Du bateau à la journée au yacht de luxe — toute la flotte.',
    ),
  },
  tours: {
    title: L(
      'Ibiza Tours & Excursies — Ontdek het Eiland',
      'Ibiza Tours & Excursions — Discover the Island',
      'Ibiza Touren & Ausflüge — Entdecke die Insel',
      'Tours y Excursiones Ibiza — Descubre la Isla',
      'Tours & Excursions Ibiza — Découvrez l’Île',
    ),
    description: L(
      'Boek de mooiste tours en excursies op Ibiza: van verborgen baaien tot zonsondergangtrips. Geregeld door lokale experts.',
      'Book the finest tours and excursions in Ibiza: from hidden coves to sunset trips. Arranged by local experts.',
      'Buche die schönsten Touren und Ausflüge auf Ibiza: von versteckten Buchten bis Sonnenuntergangstrips.',
      'Reserva los mejores tours y excursiones en Ibiza: de calas escondidas a salidas al atardecer.',
      'Réservez les plus belles excursions à Ibiza : des criques cachées aux sorties au coucher du soleil.',
    ),
  },
  'water-sports': {
    title: L(
      'Ibiza Watersport — Jetski, Flyboard & Meer',
      'Ibiza Water Sports — Jet Ski, Flyboard & More',
      'Ibiza Wassersport — Jetski, Flyboard & mehr',
      'Deportes Acuáticos Ibiza — Moto de Agua y Más',
      'Sports Nautiques Ibiza — Jet Ski, Flyboard & Plus',
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
      'Ibiza Activiteiten — Beleef het Eiland',
      'Ibiza Activities — Experience the Island',
      'Ibiza Aktivitäten — Erlebe die Insel',
      'Actividades Ibiza — Vive la Isla',
      'Activités Ibiza — Vivez l’Île',
    ),
    description: L(
      'De leukste activiteiten op Ibiza: van strandclubs en boottochten tot verborgen parels. Alles boekbaar op één plek.',
      'The best things to do in Ibiza: from beach clubs and boat trips to hidden gems. All bookable in one place.',
      'Die besten Aktivitäten auf Ibiza: von Beachclubs und Bootstouren bis zu Geheimtipps. Alles an einem Ort buchbar.',
      'Las mejores actividades en Ibiza: de beach clubs y excursiones en barco a joyas escondidas.',
      'Les meilleures activités à Ibiza : des beach clubs aux sorties en bateau et pépites cachées.',
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
  'car-scooter-rental': {
    title: L(
      'Auto & Scooter Huren op Ibiza',
      'Car & Scooter Rental in Ibiza',
      'Auto & Roller Mieten auf Ibiza',
      'Alquiler de Coches y Motos en Ibiza',
      'Location de Voiture & Scooter à Ibiza',
    ),
    description: L(
      'Ontdek Ibiza op je eigen tempo. Huur een auto of scooter tegen scherpe prijzen, met flexibele ophaalpunten.',
      'Discover Ibiza at your own pace. Rent a car or scooter at sharp prices, with flexible pickup points.',
      'Entdecke Ibiza in deinem Tempo. Miete ein Auto oder einen Roller zu fairen Preisen mit flexiblen Abholorten.',
      'Descubre Ibiza a tu ritmo. Alquila un coche o moto a buen precio, con puntos de recogida flexibles.',
      'Découvrez Ibiza à votre rythme. Louez une voiture ou un scooter à prix serrés, points de retrait flexibles.',
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
  const description = copy ? copy.description[locale] : FALLBACK_DESC[locale](fallbackName || key)
  return pageMetadata({ locale, path: key, title, description, noindex })
}

/**
 * Full Metadata for a data-driven detail page (a specific venue/event/activity).
 * @param path  the full locale-agnostic path, e.g. `activities/${slug}`
 */
export function detailMetadata(
  localeRaw: string,
  path: string,
  name: string,
  opts: { description?: string; image?: string; suffix?: string } = {},
): Metadata {
  const locale = (LOCALES as readonly string[]).includes(localeRaw) ? (localeRaw as Locale) : DEFAULT_LOCALE
  const clean = (name || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || SITE_NAME
  const title = `${clean}${opts.suffix ? ` ${opts.suffix}` : ' — Ibiza'}`
  const rawDesc = (opts.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const description = (rawDesc ? rawDesc : FALLBACK_DESC[locale](clean)).slice(0, 160)
  return pageMetadata({ locale, path, title, description, images: opts.image ? [opts.image] : undefined })
}
