import type { Locale } from './seo'
import type { TripPageCopy } from '@/components/guides/TripCollectionGuide'

/**
 * Copy voor de Pukka Up-merkpagina (routekey 'pukka-up').
 *
 * Feed-gegrond: boat party vanuit San Antonio op di/do/za met een pre-party
 * en drie uur varen rond zonsondergang, 3 drankjes, DJ en live performance
 * (event pukka-up); A Day in Paradise: 5 uur vanaf de haven van San Antonio
 * op wo/vr/zo, 6 drankjes, graze board & fruit, Cala Bassa & Cala Conta,
 * snorkel/paddle/opblaasspeelgoed, DJ (event a-day-in-paradise-ibiza).
 *
 * BEWUST NIET beweerd: welke club bij welke dag hoort bij de duurdere
 * tickettiers — dat staat niet hard in de feed. De tekst verwijst daarvoor
 * naar de tickettypes in de checkout.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const PUKKA_UP: TripPageCopy = {
  routeKey: 'pukka-up',
  pageKey: 'pukka-up',
  bylineTopic: 'Pukka Up boat parties in Ibiza',
  title: L(
    'Pukka Up boat party Ibiza',
    'Pukka Up boat party Ibiza',
    'Pukka Up Boat Party Ibiza',
    'Pukka Up boat party Ibiza',
    'Pukka Up boat party Ibiza',
  ),
  // Per taal gemeten: 140–160 tekens (onpage-check).
  metaDescription: L(
    'Pukka Up boat party vanuit San Antonio op di, do en za: pre-party, drie uur varen rond zonsondergang, drie drankjes, DJ en live performance aan boord.',
    'Pukka Up boat party from San Antonio on Tue, Thu and Sat: a pre-party, three hours around sunset, three drinks, a DJ and a live performance on board.',
    'Pukka Up Boat Party ab San Antonio di, do und sa: Pre-Party am Kai, drei Stunden rund um den Sonnenuntergang, drei Getränke, DJ und Live-Act an Bord.',
    'Boat party de Pukka Up desde San Antonio los martes, jueves y sábados: pre-fiesta, tres horas al atardecer, tres bebidas, DJ y directo a bordo.',
    'Boat party Pukka Up depuis San Antonio les mar, jeu et sam : pré-soirée, trois heures au coucher du soleil, trois boissons, DJ et live à bord.',
  ),
  intro: L(
    'Pukka Up vaart al jaren de bekendste boat party vanuit San Antonio: een pre-party aan de kade en daarna drie uur varen terwijl de zon zakt, met drie drankjes, een DJ en live performance aan boord — op dinsdag, donderdag en zaterdag.',
    'Pukka Up has long run the best-known boat party out of San Antonio: a pre-party on the quay, then three hours on the water as the sun goes down, with three drinks, a DJ and a live performance on board — Tuesdays, Thursdays and Saturdays.',
    'Pukka Up fährt seit Jahren die bekannteste Boat Party ab San Antonio: Pre-Party am Kai, dann drei Stunden auf dem Wasser, während die Sonne sinkt — mit drei Getränken, DJ und Live-Performance an Bord, dienstags, donnerstags und samstags.',
    'Pukka Up lleva años con la boat party más conocida de San Antonio: pre-fiesta en el muelle y después tres horas navegando mientras cae el sol, con tres bebidas, DJ y actuación en directo a bordo — martes, jueves y sábado.',
    'Pukka Up organise depuis des années la boat party la plus connue de San Antonio : pré-soirée sur le quai, puis trois heures en mer au coucher du soleil, avec trois boissons, un DJ et un live à bord — les mardis, jeudis et samedis.',
  ),
  introSecond: L(
    'Er zijn meerdere tickettypes — van alleen de boot tot uitgebreidere combinaties. Wat elk type precies omvat voor jouw datum, zie je bij het boeken.',
    'There are several ticket types — from boat-only to fuller combinations. Exactly what each type covers for your date is shown at booking.',
    'Es gibt mehrere Tickettypen — vom reinen Bootsticket bis zu umfangreicheren Kombis. Was jeder Typ für dein Datum genau umfasst, siehst du beim Buchen.',
    'Hay varios tipos de entrada — desde solo barco hasta combinaciones más completas. Lo que incluye cada tipo para tu fecha lo ves al reservar.',
    'Plusieurs types de billets existent — du bateau seul aux formules plus complètes. Ce que chaque type couvre pour votre date s’affiche à la réservation.',
  ),
  events: [
    {
      eventSlug: 'pukka-up',
      body: L(
        'De klassieker: pre-party aan de kade van San Antonio en dan het water op voor drie uur boat party rond zonsondergang, met drie drankjes, DJ en live performance aan boord.',
        'The classic: a pre-party on the San Antonio quay, then out on the water for a three-hour boat party around sunset, with three drinks, a DJ and a live performance on board.',
        'Der Klassiker: Pre-Party am Kai von San Antonio, dann drei Stunden Boat Party rund um den Sonnenuntergang — mit drei Getränken, DJ und Live-Performance an Bord.',
        'El clásico: pre-fiesta en el muelle de San Antonio y después tres horas de boat party alrededor de la puesta de sol, con tres bebidas, DJ y actuación en directo a bordo.',
        'Le classique : pré-soirée sur le quai de San Antonio, puis trois heures de boat party autour du coucher du soleil, avec trois boissons, un DJ et un live à bord.',
      ),
    },
    {
      eventSlug: 'a-day-in-paradise-ibiza',
      body: L(
        'Het rustigere daytrip-alternatief van hetzelfde team: vijf uur langs de westkust vanaf de haven van San Antonio op woensdag, vrijdag en zondag, met Cala Bassa en Cala Conta, zes drankjes, een graze board met fruit, en snorkel-, paddle- en opblaasspullen aan boord.',
        'The calmer daytrip alternative from the same team: five hours along the west coast from San Antonio port on Wednesdays, Fridays and Sundays, taking in Cala Bassa and Cala Conta, with six drinks, a graze board with fruit, and snorkel, paddle and inflatable gear on board.',
        'Die ruhigere Daytrip-Alternative desselben Teams: fünf Stunden an der Westküste entlang ab dem Hafen von San Antonio, mittwochs, freitags und sonntags, mit Cala Bassa und Cala Conta, sechs Getränken, Graze Board mit Obst sowie Schnorchel-, Paddle- und Badespielzeug an Bord.',
        'La alternativa tranquila de día del mismo equipo: cinco horas por la costa oeste desde el puerto de San Antonio los miércoles, viernes y domingos, pasando por Cala Bassa y Cala Conta, con seis bebidas, tabla de picoteo con fruta y equipo de snorkel, paddle e hinchables a bordo.',
        'L’alternative plus calme, en journée, par la même équipe : cinq heures le long de la côte ouest depuis le port de San Antonio, les mercredis, vendredis et dimanches, avec Cala Bassa et Cala Conta, six boissons, une planche à grignoter avec fruits, et du matériel de snorkeling, paddle et bouées à bord.',
      ),
    },
  ],
  datesHeading: L('Komende afvaarten', 'Upcoming departures', 'Kommende Abfahrten', 'Próximas salidas', 'Prochains départs'),
  noDates: L(
    'Op dit moment staan er geen afvaarten in de agenda. Zodra er nieuwe data in de feed staan, verschijnen ze hier automatisch.',
    'There are no departures in the calendar right now. As soon as new dates appear in the feed, they show up here automatically.',
    'Im Moment stehen keine Abfahrten im Kalender. Sobald neue Termine im Feed stehen, erscheinen sie hier automatisch.',
    'Ahora mismo no hay salidas en el calendario. En cuanto haya fechas nuevas en el feed, aparecerán aquí automáticamente.',
    'Aucun départ au calendrier pour le moment. Dès que de nouvelles dates arrivent dans le flux, elles s’affichent ici automatiquement.',
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
