import type { Locale } from './seo'
import type { TripPageCopy } from '@/components/guides/TripCollectionGuide'

/**
 * Copy voor de Cruise Crush-merkpagina (routekey 'cruise-crush').
 *
 * Feed-gegrond (event ibiza-cruise-crush): 3 uur boat party vanaf Playa d'en
 * Bossa, open bar inbegrepen, DJ en muziek aan boord, op maandag, vrijdag en
 * zondag, van eind mei tot en met oktober.
 *
 * Gebouwd als 2027-voorbereiding (gap-plan, volgorde-advies punt 6): eind
 * september resteren er weinig afvaarten, dus de lege-agenda-melding is hier
 * geen randgeval maar de wintertoestand van de pagina — de noDates-tekst
 * benoemt daarom expliciet het seizoen uit de feed.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const CRUISE_CRUSH: TripPageCopy = {
  routeKey: 'cruise-crush',
  pageKey: 'cruise-crush',
  bylineTopic: 'the Cruise Crush boat party in Ibiza',
  title: L(
    'Cruise Crush boat party Ibiza',
    'Cruise Crush boat party Ibiza',
    'Cruise Crush Boat Party Ibiza',
    'Cruise Crush boat party Ibiza',
    'Cruise Crush boat party Ibiza',
  ),
  intro: L(
    'Cruise Crush is de boat party vanaf Playa d’en Bossa: drie uur op het water met open bar en een DJ aan boord, op maandag, vrijdag en zondagmiddag. Het seizoen loopt van eind mei tot en met oktober.',
    'Cruise Crush is the boat party out of Playa d’en Bossa: three hours on the water with an open bar and a DJ on board, on Monday, Friday and Sunday afternoons. The season runs from late May through October.',
    'Cruise Crush ist die Boat Party ab Playa d’en Bossa: drei Stunden auf dem Wasser mit Open Bar und DJ an Bord, montags, freitags und sonntags am Nachmittag. Die Saison läuft von Ende Mai bis Ende Oktober.',
    'Cruise Crush es la boat party desde Playa d’en Bossa: tres horas en el agua con barra libre y DJ a bordo, los lunes, viernes y domingos por la tarde. La temporada va de finales de mayo a octubre.',
    'Cruise Crush est la boat party au départ de Playa d’en Bossa : trois heures sur l’eau avec open bar et DJ à bord, les lundis, vendredis et dimanches après-midi. La saison court de fin mai à octobre.',
  ),
  events: [
    {
      eventSlug: 'ibiza-cruise-crush',
      body: L(
        'Drie uur varen met de open bar inbegrepen en muziek aan dek — de middagvariant onder de boat party’s, vanaf Playa d’en Bossa.',
        'Three hours of sailing with the open bar included and music on deck — the afternoon take on the boat party, from Playa d’en Bossa.',
        'Drei Stunden auf dem Wasser mit inbegriffener Open Bar und Musik an Deck — die Nachmittagsvariante unter den Boat Partys, ab Playa d’en Bossa.',
        'Tres horas de navegación con barra libre incluida y música en cubierta — la versión de tarde entre las boat parties, desde Playa d’en Bossa.',
        'Trois heures de navigation avec open bar compris et musique sur le pont — la version après-midi de la boat party, depuis Playa d’en Bossa.',
      ),
    },
  ],
  datesHeading: L('Komende afvaarten', 'Upcoming departures', 'Kommende Abfahrten', 'Próximas salidas', 'Prochains départs'),
  noDates: L(
    'Op dit moment staan er geen afvaarten in de agenda — Cruise Crush vaart van eind mei tot en met oktober. Zodra het nieuwe seizoen in de feed staat, verschijnen de data hier automatisch.',
    'There are no departures in the calendar right now — Cruise Crush sails from late May through October. As soon as the new season is in the feed, the dates appear here automatically.',
    'Im Moment stehen keine Abfahrten im Kalender — Cruise Crush fährt von Ende Mai bis Ende Oktober. Sobald die neue Saison im Feed steht, erscheinen die Termine hier automatisch.',
    'Ahora mismo no hay salidas en el calendario — Cruise Crush navega de finales de mayo a octubre. En cuanto la nueva temporada esté en el feed, las fechas aparecerán aquí automáticamente.',
    'Aucun départ au calendrier pour le moment — Cruise Crush navigue de fin mai à octobre. Dès que la nouvelle saison arrive dans le flux, les dates s’affichent ici automatiquement.',
  ),
  bookCta: L('Bekijk prijzen en boek', 'See prices and book', 'Preise ansehen und buchen', 'Ver precios y reservar', 'Voir les prix et réserver'),
  detailLinkLabel: L(
    'Alle details en voorwaarden',
    'All details and conditions',
    'Alle Details und Bedingungen',
    'Todos los detalles y condiciones',
    'Tous les détails et conditions',
  ),
  linksHeading: L('Verder lezen', 'Keep exploring', 'Weiterlesen', 'Sigue explorando', 'Pour aller plus loin'),
  links: [
    {
      href: '/boat-party',
      label: L('Alle boat party’s op Ibiza', 'All boat parties in Ibiza', 'Alle Boat Partys auf Ibiza', 'Todas las boat parties de Ibiza', 'Toutes les boat parties d’Ibiza'),
    },
    {
      href: '/boat-trip',
      label: L('Liever een dagtocht? Alle boottochten', 'Rather a day trip? All boat trips', 'Lieber ein Tagesausflug? Alle Bootstouren', '¿Mejor una excursión? Todas las salidas', 'Plutôt une excursion ? Toutes les sorties'),
    },
  ],
}
