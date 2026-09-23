import type { Locale } from './seo'

/**
 * Redactionele About-copy voor venue-detailpagina's, per venue-slug.
 *
 * Waarom dit bestaat: de feed-descriptions van een deel van de bootvenues
 * zijn vervuild met CSS-restanten en widget-markup (zie bijv. de dump voor
 * lady-virginia-boat). `cleanHtml` haalt de tags weg maar houdt de rommel in
 * de tekst. Voor de venues in deze map rendert VenueDetailPage deze alinea's
 * in plaats van de feed-description.
 *
 * HARDE REGEL — zelfde als page-faq.ts: elke feitelijke bewering hieronder is
 * herleidbaar tot de (gestripte) feed-description van het bijbehorende event.
 * Tijden, prijzen en datums staan hier NIET — die rendert de pagina live uit
 * de feed. Per taal geschreven, niet vertaald.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const VENUE_COPY: Record<string, { paragraphs: T[] }> = {
  // Bron: feed-event lady-virginia-boat-trip — 3,5 uur, open bar, eten
  // inbegrepen, vertrek San Antonio, zwemstop, paddle/snorkel, muziek aan
  // boord, dag- én middagafvaarten, sunset-tijden variëren.
  'lady-virginia-boat': {
    paragraphs: [
      L(
        'De Lady Virginia vaart dagelijks vanuit de haven van San Antonio voor een tocht van zo’n 3,5 uur langs de westkust. Aan boord is het geregeld: open bar, eten inbegrepen en muziek — en onderweg een zwemstop in helder water, met paddleboards en snorkelspullen erbij.',
        'The Lady Virginia sails daily from San Antonio port on a roughly 3.5-hour trip along the west coast. Everything on board is taken care of: open bar, food included and music — plus a swim stop in clear water along the way, with paddle boards and snorkelling gear on hand.',
        'Die Lady Virginia legt täglich im Hafen von San Antonio ab, für eine rund 3,5-stündige Tour an der Westküste entlang. An Bord ist gesorgt: Open Bar, Essen inklusive und Musik — unterwegs ein Badestopp im klaren Wasser, Paddleboards und Schnorchelzeug liegen bereit.',
        'El Lady Virginia zarpa a diario del puerto de San Antonio para una travesía de unas 3,5 horas por la costa oeste. A bordo está todo resuelto: barra libre, comida incluida y música — y por el camino una parada para el baño en aguas cristalinas, con tablas de paddle y equipo de snorkel.',
        'Le Lady Virginia appareille chaque jour du port de San Antonio pour une sortie d’environ 3 h 30 le long de la côte ouest. À bord, tout est prévu : open bar, repas compris et musique — avec en chemin un arrêt baignade en eau claire, paddles et matériel de snorkeling à disposition.',
      ),
      L(
        'Je kunt overdag of in de middag mee; de zonsondergangsafvaart schuift mee met het seizoen. De actuele afvaarten en prijzen staan hieronder in de agenda.',
        'You can join a daytime or afternoon sailing; the sunset departure shifts with the season. Current departures and prices are in the calendar below.',
        'Es gibt Tages- und Nachmittagsfahrten; die Sunset-Abfahrt verschiebt sich mit der Saison. Aktuelle Abfahrten und Preise stehen unten im Kalender.',
        'Puedes ir de día o por la tarde; la salida al atardecer se mueve con la temporada. Las salidas y precios actuales están abajo en la agenda.',
        'Départs en journée ou l’après-midi ; l’horaire du coucher de soleil évolue avec la saison. Les départs et tarifs actuels figurent dans l’agenda ci-dessous.',
      ),
    ],
  },
  // Bron: feed-event chilli-pepper-boat — klassieke llaüt, baai van San
  // Antonio + stranden westkust, ±3 uur, drankjes, Spaanse tapas, zwemmen,
  // muziek aan boord, meerdere dagdelen.
  'chilli-pepper-boats': {
    paragraphs: [
      L(
        'De Chilli Pepper is een klassieke Ibicenco llaüt die vanuit San Antonio de baai uit vaart, langs de mooiste stranden van de westkust. Ongeveer drie uur op het water, met drankjes en Spaanse tapas aan boord, muziek, en onderweg tijd om te zwemmen in helder water of gewoon aan dek te liggen.',
        'The Chilli Pepper is a classic Ibizan llaüt that sails out of San Antonio bay along the finest beaches of the west coast. Around three hours on the water, with drinks and Spanish tapas on board, music, and time along the way to swim in clear water or simply stretch out on deck.',
        'Die Chilli Pepper ist ein klassischer ibizenkischer Llaüt, der von San Antonio aus die Bucht entlang der schönsten Weststrände fährt. Rund drei Stunden auf dem Wasser, mit Getränken und spanischen Tapas an Bord, Musik, und unterwegs Zeit zum Schwimmen im klaren Wasser oder einfach zum Liegen an Deck.',
        'El Chilli Pepper es un llaüt clásico ibicenco que sale de la bahía de San Antonio bordeando las mejores playas de la costa oeste. Unas tres horas en el agua, con bebidas y tapas españolas a bordo, música, y tiempo por el camino para nadar en aguas cristalinas o simplemente tumbarse en cubierta.',
        'Le Chilli Pepper est un llaüt classique d’Ibiza qui quitte la baie de San Antonio en longeant les plus belles plages de la côte ouest. Environ trois heures sur l’eau, avec boissons et tapas espagnoles à bord, de la musique, et le temps de nager en eau claire ou de s’allonger sur le pont.',
      ),
      L(
        'Er zijn afvaarten op meerdere dagdelen — ochtend, middag en vroege avond. Welke er deze week varen en wat ze kosten, zie je hieronder in de agenda.',
        'Sailings run at several times of day — morning, afternoon and early evening. Which ones sail this week and what they cost is in the calendar below.',
        'Gefahren wird zu mehreren Tageszeiten — vormittags, nachmittags und am frühen Abend. Welche diese Woche fahren und was sie kosten, steht unten im Kalender.',
        'Hay salidas en varias franjas — mañana, tarde y primera hora de la noche. Cuáles navegan esta semana y su precio están abajo en la agenda.',
        'Des départs ont lieu à plusieurs moments de la journée — matin, après-midi et début de soirée. Ceux de la semaine et leurs tarifs figurent dans l’agenda ci-dessous.',
      ),
    ],
  },
  // Bron: feed-event beach-hopper-daytime — vertrek San Antonio 's ochtends,
  // Caves of Love, vrije tijd Cala Bassa & Cala Conta, watersportstop Cala
  // Tarida, open bar, eten, muziek & zonnedek.
  'the-beach-hopper': {
    paragraphs: [
      L(
        'The Beach Hopper doet op één dag de plekken waar je anders drie strandtrips voor nodig hebt: vanuit San Antonio langs de Caves of Love, vrije tijd op Cala Bassa en Cala Conta, en een watersportstop bij Cala Tarida. Open bar, eten, muziek en een zonnedek horen erbij.',
        'The Beach Hopper packs into one day what would otherwise take three beach trips: from San Antonio past the Caves of Love, free time at Cala Bassa and Cala Conta, and a water sports stop at Cala Tarida. Open bar, food, music and a sundeck included.',
        'The Beach Hopper schafft an einem Tag, wofür du sonst drei Strandausflüge bräuchtest: von San Antonio vorbei an den Caves of Love, freie Zeit an Cala Bassa und Cala Conta und ein Wassersportstopp an der Cala Tarida. Open Bar, Essen, Musik und Sonnendeck inklusive.',
        'The Beach Hopper mete en un día lo que de otro modo serían tres excursiones de playa: desde San Antonio frente a las Caves of Love, tiempo libre en Cala Bassa y Cala Conta, y una parada de deportes acuáticos en Cala Tarida. Barra libre, comida, música y solárium incluidos.',
        'The Beach Hopper concentre en une journée ce qui demanderait trois sorties plage : depuis San Antonio devant les Caves of Love, temps libre à Cala Bassa et Cala Conta, et un arrêt sports nautiques à Cala Tarida. Open bar, repas, musique et pont solarium compris.',
      ),
      L(
        'De afvaarten en actuele prijzen staan hieronder in de agenda.',
        'Departures and current prices are in the calendar below.',
        'Abfahrten und aktuelle Preise stehen unten im Kalender.',
        'Las salidas y los precios actuales están abajo en la agenda.',
        'Les départs et tarifs actuels figurent dans l’agenda ci-dessous.',
      ),
    ],
  },
}

/** De override voor een venue, of null als de feed-description gewoon goed is. */
export function venueCopyFor(venueSlug: string, locale: string): string[] | null {
  const entry = VENUE_COPY[venueSlug]
  if (!entry) return null
  const l = (['nl', 'en', 'de', 'es', 'fr'] as const).includes(locale as Locale) ? (locale as Locale) : 'en'
  return entry.paragraphs.map((p) => p[l])
}
