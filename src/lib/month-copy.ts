import type { Locale } from '@/lib/seo'

/**
 * Localized copy for the "Ibiza in <month>" pages.
 *
 * Everything here is a template around numbers that come from the live feed —
 * there is deliberately no prose claiming what a given month "feels like",
 * no temperatures and no "best month to visit". Those would be invented, and
 * an answer engine quoting an invented average temperature back at a traveller
 * is exactly the failure this codebase keeps guarding against.
 *
 * `{month}`, `{year}`, `{events}` and `{venues}` are substituted at render time.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const MONTH_COPY = {
  title: L(
    'Ibiza in {month} {year}',
    'Ibiza in {month} {year}',
    'Ibiza im {month} {year}',
    'Ibiza en {month} {year}',
    'Ibiza en {month} {year}',
  ),
  kicker: L('Maandoverzicht', 'Month guide', 'Monatsüberblick', 'Guía del mes', 'Guide du mois'),
  intro: L(
    'Dit is het volledige programma voor {month} {year}: {events} events verdeeld over {venues} locaties. De lijst komt rechtstreeks uit onze agenda en wordt elke dag ververst, dus wat je hier ziet is wat er nu daadwerkelijk te boeken is.',
    'This is the full programme for {month} {year}: {events} events across {venues} venues. The list comes straight from our calendar and refreshes daily, so what you see here is what is genuinely bookable right now.',
    'Das ist das komplette Programm für {month} {year}: {events} Events an {venues} Locations. Die Liste kommt direkt aus unserem Kalender und wird täglich aktualisiert — was du hier siehst, ist auch wirklich buchbar.',
    'Este es el programa completo de {month} {year}: {events} eventos en {venues} locales. La lista sale directamente de nuestra agenda y se actualiza cada día, así que lo que ves es lo que realmente se puede reservar.',
    'Voici le programme complet de {month} {year} : {events} événements répartis sur {venues} lieux. La liste vient directement de notre agenda et se met à jour chaque jour — ce que vous voyez est donc réellement réservable.',
  ),
  venuesTitle: L(
    'Welke locaties open zijn in {month}',
    'Which venues are open in {month}',
    'Welche Locations im {month} geöffnet sind',
    'Qué locales abren en {month}',
    'Quels lieux sont ouverts en {month}',
  ),
  venuesIntro: L(
    'Gesorteerd op hoeveel er die maand te doen is. Het getal is het aantal events dat we voor die locatie in de agenda hebben staan.',
    'Sorted by how much is on that month. The number is how many events we have listed for that venue.',
    'Sortiert danach, wie viel dort in dem Monat läuft. Die Zahl ist die Anzahl der Events, die wir für die Location gelistet haben.',
    'Ordenados por cuánto hay ese mes. El número es la cantidad de eventos que tenemos listados para ese local.',
    'Classés selon ce qui s’y passe ce mois-là. Le chiffre correspond au nombre d’événements listés pour ce lieu.',
  ),
  artistsTitle: L(
    'Wie er speelt in {month}',
    'Who is playing in {month}',
    'Wer im {month} auflegt',
    'Quién pincha en {month}',
    'Qui joue en {month}',
  ),
  artistsIntro: L(
    'Namen zoals ze in de line-ups van die maand staan. Line-ups veranderen — de eventpagina is altijd leidend.',
    'Names as they appear in that month’s line-ups. Line-ups change — the event page is always the source of truth.',
    'Namen, wie sie in den Line-ups des Monats stehen. Line-ups ändern sich — maßgeblich ist immer die Event-Seite.',
    'Nombres tal como aparecen en los line-ups del mes. Los line-ups cambian — la página del evento manda siempre.',
    'Noms tels qu’ils apparaissent dans les line-ups du mois. Les line-ups changent — la page de l’événement fait foi.',
  ),
  eventsTitle: L(
    'Alle events in {month} {year}',
    'Every event in {month} {year}',
    'Alle Events im {month} {year}',
    'Todos los eventos de {month} {year}',
    'Tous les événements de {month} {year}',
  ),
  showingAll: L(
    'De eerste {shown} van {events} events. Bekijk de volledige agenda voor de rest.',
    'The first {shown} of {events} events. See the full calendar for the rest.',
    'Die ersten {shown} von {events} Events. Den Rest findest du im vollständigen Kalender.',
    'Los primeros {shown} de {events} eventos. Consulta la agenda completa para el resto.',
    'Les {shown} premiers des {events} événements. Voir l’agenda complet pour le reste.',
  ),
  fullCalendar: L('Volledige agenda', 'Full calendar', 'Ganzer Kalender', 'Agenda completa', 'Agenda complet'),
  otherMonths: L('Andere maanden', 'Other months', 'Andere Monate', 'Otros meses', 'Autres mois'),
  updated: L('Bijgewerkt op', 'Updated', 'Aktualisiert am', 'Actualizado el', 'Mis à jour le'),
  from: L('vanaf', 'from', 'ab', 'desde', 'dès'),
  metaDescription: L(
    'Alles wat er in {month} {year} te doen is op Ibiza: {events} events op {venues} locaties, met tickets. Dagelijks bijgewerkt.',
    'Everything on in Ibiza in {month} {year}: {events} events across {venues} venues, with tickets. Updated daily.',
    'Alles, was im {month} {year} auf Ibiza läuft: {events} Events an {venues} Locations, mit Tickets. Täglich aktualisiert.',
    'Todo lo que hay en Ibiza en {month} {year}: {events} eventos en {venues} locales, con entradas. Actualizado a diario.',
    'Tout ce qui se passe à Ibiza en {month} {year} : {events} événements sur {venues} lieux, avec billets. Mis à jour chaque jour.',
  ),
} satisfies Record<string, T>

/** Substitute `{placeholders}` in a localized string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
}
