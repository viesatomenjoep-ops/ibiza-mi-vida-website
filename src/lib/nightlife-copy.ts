import type { Locale } from '@/lib/seo'

/**
 * Uitgaansgids Ibiza, vijf talen.
 *
 * Derde in de reeks na dress-code-copy.ts en getting-around-copy.ts, en de
 * grootste: deze pagina heeft vijf passages die uit live data worden gevuld
 * (gemeten entreeprijzen, de verdeling over prijsklassen, de vergelijking
 * tussen twee clubs, en het seizoensvenster). Die staan hier daarom als
 * functies met de getallen als argument, niet als vaste zinnen — precies zodat
 * een cijfer nooit in één taal blijft hangen terwijl het in de andere vier
 * meebeweegt.
 *
 * De feiten die géén data zijn maar wel bevestigd, staan hier één keer:
 * Hï voerde de DJ Mag-clubpoll aan van 2022 tot en met 2025, en UNVRS opende
 * op 30 mei 2025. Verder geen oordeel over welke club beter is — daar hebben
 * we geen grondslag voor, en een voorkeur die als feit wordt gepresenteerd
 * maakt de rest van de pagina minder betrouwbaar.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface NamedCopy { name: T; body: T }

export const META_TITLE: T = L(
  'Uitgaan op Ibiza 2026 — hoe het werkt',
  'Ibiza Nightlife Guide 2026',
  'Ibiza Nachtleben 2026 — so läuft es',
  'Vida nocturna en Ibiza 2026 — cómo va',
  'Vie nocturne à Ibiza 2026 — le guide',
)

/** 140-160 tekens. */
export const META_DESC: T = L(
  'Hoe uitgaan op Ibiza werkt: clubs open rond middernacht tot zes uur, de headliner tussen twee en vier, en beachclubs vullen de middag. Met gemeten prijzen.',
  'How Ibiza nightlife works: clubs open around midnight and run to six, the headline set lands between two and four, and beach clubs fill the afternoon.',
  'So funktioniert Ibizas Nachtleben: Clubs öffnen gegen Mitternacht und laufen bis sechs, der Headliner spielt zwischen zwei und vier, Beachclubs füllen den Tag.',
  'Cómo funciona la noche en Ibiza: los clubs abren hacia medianoche y cierran a las seis, y el cartel principal toca entre las dos y las cuatro de la madrugada.',
  "Comment marche la nuit à Ibiza : les clubs ouvrent vers minuit et ferment à six heures, et la tête d'affiche joue entre deux et quatre heures du matin.",
)

export const OG_DESC: T = L(
  'Hoe de avond in elkaar zit, van beachclub tot zes uur ’s ochtends.',
  'How the night fits together, from beach club to six in the morning.',
  'Wie der Abend zusammenhängt, vom Beachclub bis sechs Uhr morgens.',
  'Cómo encaja la noche, del beach club a las seis de la mañana.',
  "Comment la soirée s'articule, du beach club à six heures du matin.",
)

export const CRUMB_SELF: T = L('Uitgaan op Ibiza', 'Ibiza nightlife', 'Ibiza Nachtleben', 'Vida nocturna en Ibiza', 'Vie nocturne à Ibiza')

export const H1: T = L(
  'Uitgaan op Ibiza — de gids voor 2026',
  'Ibiza Nightlife Guide 2026',
  'Ibiza Nachtleben — der Guide für 2026',
  'Vida nocturna en Ibiza — guía 2026',
  'Vie nocturne à Ibiza — le guide 2026',
)

/** Eerste alinea. `clubs` mag 0 zijn; dan valt dat deel van de zin weg. */
export function lead1(l: Locale, clubs: number, n: number, mediaan: number, q1: number, q3: number, heeftPrijzen: boolean): string {
  const clubDeel: T = L(
    clubs ? ` Wij dekken ${clubs} clubs op het eiland` : ' De grote clubs',
    clubs ? ` We cover ${clubs} clubs on the island` : ' The major clubs',
    clubs ? ` Wir decken ${clubs} Clubs auf der Insel ab` : ' Die großen Clubs',
    clubs ? ` Cubrimos ${clubs} clubs de la isla` : ' Los grandes clubs',
    clubs ? ` Nous couvrons ${clubs} clubs sur l'île` : ' Les grands clubs',
  )
  const prijsDeel: T = L(
    heeftPrijzen ? `, en over ${n} gedateerde clubavonden is het goedkoopste ticket doorgaans €${mediaan}, met de helft van alle avonden tussen €${q1} en €${q3}.` : '.',
    heeftPrijzen ? `, and across ${n} dated club nights the median cheapest entry ticket is €${mediaan}, with half of all nights between €${q1} and €${q3}.` : '.',
    heeftPrijzen ? `, und über ${n} datierte Clubnächte liegt das günstigste Ticket im Median bei €${mediaan}, wobei die Hälfte aller Nächte zwischen €${q1} und €${q3} liegt.` : '.',
    heeftPrijzen ? `, y sobre ${n} noches con fecha la entrada más barata está en €${mediaan} de mediana, con la mitad de las noches entre €${q1} y €${q3}.` : '.',
    heeftPrijzen ? `, et sur ${n} soirées datées le billet le moins cher est à €${mediaan} en médiane, la moitié des soirées se situant entre €${q1} et €${q3}.` : '.',
  )
  const basis: T = L(
    'Het uitgaansleven op Ibiza draait op een schema dat nieuwkomers verrast: nachtclubs openen rond middernacht en sluiten om zes uur, de headliner speelt tussen twee en vier, en de uren daarvóór horen bij de beachclubs en een diner om tien uur.',
    'Ibiza nightlife runs on a schedule that surprises first-timers: night clubs open around midnight and close at six, the headline set lands between two and four, and the hours before that belong to beach clubs and a ten o’clock dinner.',
    'Ibizas Nachtleben läuft nach einem Zeitplan, der Neulinge überrascht: Nachtclubs öffnen gegen Mitternacht und schließen um sechs, der Headliner spielt zwischen zwei und vier, und die Stunden davor gehören den Beachclubs und einem Abendessen um zehn.',
    'La noche en Ibiza va con un horario que sorprende a quien viene por primera vez: los clubs abren hacia medianoche y cierran a las seis, el cabeza de cartel toca entre las dos y las cuatro, y las horas anteriores son de los beach clubs y de una cena a las diez.',
    "La vie nocturne à Ibiza suit un horaire qui surprend les nouveaux venus : les clubs ouvrent vers minuit et ferment à six heures, la tête d'affiche joue entre deux et quatre, et les heures d'avant appartiennent aux beach clubs et à un dîner à dix heures.",
  )
  return `${basis[l]}${clubDeel[l]}${prijsDeel[l]}`
}

export function lead2(l: Locale, onder40: number, boven80: number, heeftPrijzen: boolean): string {
  const meting: T = L(
    heeftPrijzen ? `Die cijfers zijn gemeten uit onze eigen live agenda in plaats van ergens overgenomen: ${onder40}% van de avonden komt onder €40 uit, ${boven80}% erboven. ` : '',
    heeftPrijzen ? `Those are measured from our own live agenda rather than quoted from anywhere: ${onder40}% of nights come in under €40, ${boven80}% over €80. ` : '',
    heeftPrijzen ? `Diese Zahlen sind aus unserem eigenen Live-Kalender gemessen statt irgendwo übernommen: ${onder40}% der Nächte liegen unter €40, ${boven80}% darüber. ` : '',
    heeftPrijzen ? `Esas cifras están medidas sobre nuestra propia agenda en directo y no copiadas de ningún sitio: un ${onder40}% de las noches baja de €40 y un ${boven80}% pasa de €80. ` : '',
    heeftPrijzen ? `Ces chiffres sont mesurés sur notre propre agenda en direct plutôt que repris ailleurs : ${onder40}% des soirées passent sous €40, ${boven80}% au-dessus de €80. ` : '',
  )
  const rest: T = L(
    'Deze pagina gaat over hoe de avond in elkaar zit. Voor wie er draait is er de agenda; voor wat een specifieke zaal kost, de prijzenpagina.',
    'This page is how the night fits together. For who is playing, use the calendar; for what a specific room costs, the prices page.',
    'Diese Seite erklärt, wie der Abend zusammenhängt. Wer auflegt, steht im Kalender; was ein bestimmter Raum kostet, auf der Preisseite.',
    'Esta página va de cómo encaja la noche. Para saber quién pincha está la agenda; para lo que cuesta una sala concreta, la página de precios.',
    "Cette page explique comment la soirée s'articule. Pour savoir qui joue, il y a l'agenda ; pour ce que coûte une salle précise, la page des prix.",
  )
  return `${meting[l]}${rest[l]}`
}

export const CTA_LINK: T = L(
  'Bekijk wat er deze week draait',
  'See what is on this week',
  'Sieh, was diese Woche läuft',
  'Mira lo que hay esta semana',
  'Voyez ce qui se passe cette semaine',
)

export const H_SEQUENCE: T = L(
  'Hoe een dag hier werkelijk verloopt',
  'How a day here actually runs',
  'Wie ein Tag hier wirklich abläuft',
  'Cómo transcurre de verdad un día aquí',
  'Comment se déroule vraiment une journée ici',
)
export const INTRO_SEQUENCE: T = L(
  'Niets hiervan staat ergens opgeschreven als je aankomt, en het verkeerd doen is het verschil tussen drie goede avonden en één.',
  'Nothing about this is written down anywhere on arrival, and getting it wrong is the difference between three good nights and one.',
  'Nichts davon steht bei der Ankunft irgendwo geschrieben, und es falsch zu machen ist der Unterschied zwischen drei guten Nächten und einer.',
  'Nada de esto está escrito en ninguna parte cuando llegas, y equivocarte es la diferencia entre tres buenas noches y una.',
  "Rien de tout cela n'est écrit nulle part à l'arrivée, et se tromper fait la différence entre trois bonnes soirées et une.",
)

export const SEQUENCE: NamedCopy[] = [
  {
    name: L('Middag — beachclub', 'Afternoon — beach club', 'Nachmittag — Beachclub', 'Tarde — beach club', 'Après-midi — beach club'),
    body: L(
      'Van het eind van de ochtend tot zonsondergang. Je betaalt voor een bed of een tafel in plaats van entree, en de muziek bouwt door de middag op. Hier gaan de meeste daglichturen van het eiland heen, en hier beslist een groep ook wat ze die avond doet.',
      'From late morning to sunset. You pay for a bed or a table rather than entry, and the music builds through the afternoon. This is where most of the island’s daylight hours go, and it is also where a group decides what it is doing that night.',
      'Vom späten Vormittag bis Sonnenuntergang. Du zahlst für eine Liege oder einen Tisch statt Eintritt, und die Musik baut sich über den Nachmittag auf. Hier gehen die meisten Tagesstunden der Insel hin, und hier entscheidet eine Gruppe auch, was sie abends macht.',
      'De media mañana al atardecer. Pagas por una cama o una mesa, no por entrar, y la música va subiendo durante la tarde. Aquí se van la mayoría de las horas de luz de la isla, y aquí es donde un grupo decide qué hace esa noche.',
      "De la fin de matinée au coucher du soleil. On paie un lit ou une table plutôt qu'une entrée, et la musique monte au fil de l'après-midi. C'est là que passent la plupart des heures de jour de l'île, et là qu'un groupe décide de sa soirée.",
    ),
  },
  {
    name: L('Zonsondergang — de westkust', 'Sunset — the west coast', 'Sonnenuntergang — die Westküste', 'Atardecer — la costa oeste', 'Coucher de soleil — la côte ouest'),
    body: L(
      'De zonsondergangstrip van San Antonio en de westkustbaaien zijn hier een vast onderdeel van de dag, geen extraatje. Ruwweg een uur aan weerszijden van zonsondergang, en dan verplaatst iedereen zich. Doe je één niet-club-ding op het eiland, dan is het dit.',
      'San Antonio’s sunset strip and the west-coast bays are a fixed part of the day here, not an optional extra. Roughly an hour either side of sunset, and then everyone moves. If you are doing one non-club thing on the island, this is it.',
      'Die Sunset-Strip von San Antonio und die Westküstenbuchten sind hier ein fester Teil des Tages, kein Extra. Etwa eine Stunde vor und nach Sonnenuntergang, danach zieht alles weiter. Wenn du eine Sache abseits der Clubs machst, dann diese.',
      'La strip del atardecer de San Antonio y las calas del oeste son aquí parte fija del día, no un extra opcional. Aproximadamente una hora antes y después de la puesta de sol, y luego todo el mundo se mueve. Si haces una sola cosa que no sea club, que sea esta.',
      "La strip du coucher de soleil de San Antonio et les criques de l'ouest font ici partie intégrante de la journée, pas d'un extra. Environ une heure de part et d'autre du coucher, puis tout le monde bouge. Si vous ne faites qu'une chose hors club, c'est celle-là.",
    ),
  },
  {
    name: L('Avond — eten, rond tien uur', 'Evening — dinner, around ten', 'Abend — Essen, gegen zehn', 'Noche — cenar, hacia las diez', 'Soir — dîner, vers dix heures'),
    body: L(
      'Om acht uur eten verraadt je als toerist en laat je, praktischer gezien, met vier lege uren zitten. Tien is normaal. De dinner-showzalen draaien in dit tijdvak en zijn een avond op zich in plaats van een opwarmertje.',
      'Eating at eight marks you as a tourist and, more practically, leaves you with four empty hours. Ten is normal. The dinner-show venues run in this slot and are a night out in themselves rather than a warm-up.',
      'Um acht zu essen macht dich zum Touristen und lässt dich, praktischer gesehen, mit vier leeren Stunden zurück. Zehn ist normal. Die Dinner-Show-Locations laufen in diesem Zeitfenster und sind ein Abend für sich, kein Aufwärmen.',
      'Cenar a las ocho te delata como turista y, más práctico, te deja cuatro horas vacías. Las diez es lo normal. Los locales de cena-espectáculo funcionan en esta franja y son una noche en sí mismos, no un calentamiento.',
      "Dîner à huit heures vous désigne comme touriste et, plus concrètement, vous laisse quatre heures vides. Dix heures est la norme. Les dîners-spectacles occupent ce créneau et constituent une soirée en soi, pas un échauffement.",
    ),
  },
  {
    name: L('Middernacht tot zes — de club', 'Midnight to six — the club', 'Mitternacht bis sechs — der Club', 'De medianoche a las seis — el club', 'De minuit à six heures — le club'),
    body: L(
      'Deuren rond middernacht, headliner tussen twee en vier, om zes uur naar buiten. De uitzondering zijn de open-air zalen overdag, die van laat in de middag tot rond middernacht draaien — en daarom doen sommigen er één van elk op een dag en schrijven ze de volgende af.',
      'Doors around midnight, headline set between two and four, out at six. The exception is the open-air daytime venues, which run late afternoon to around midnight — which is why some people do one of each in a day and write off the next.',
      'Türen gegen Mitternacht, Headliner zwischen zwei und vier, um sechs raus. Die Ausnahme sind die Open-Air-Locations am Tag, die vom späten Nachmittag bis etwa Mitternacht laufen — weshalb manche eins von beiden an einem Tag machen und den nächsten abschreiben.',
      'Puertas hacia medianoche, cabeza de cartel entre las dos y las cuatro, fuera a las seis. La excepción son los locales al aire libre de día, que van de media tarde hasta cerca de medianoche — por eso hay quien hace uno de cada en un día y da el siguiente por perdido.',
      "Ouverture vers minuit, tête d'affiche entre deux et quatre, sortie à six heures. L'exception, ce sont les lieux en plein air de jour, qui tournent de la fin d'après-midi jusque vers minuit — d'où ceux qui font un de chaque dans la journée et sacrifient le lendemain.",
    ),
  },
]

export const H_PRICES: T = L(
  'Wat entree kost, gemeten',
  'What entry costs, measured',
  'Was der Eintritt kostet, gemessen',
  'Lo que cuesta la entrada, medido',
  "Ce que coûte l'entrée, mesuré",
)
export const PRICE_CAPTION: T = L(
  'Gemeten entreeprijzen uit de live agenda',
  'Measured club entry prices from the live agenda',
  'Gemessene Eintrittspreise aus dem Live-Kalender',
  'Precios de entrada medidos desde la agenda en directo',
  "Prix d'entrée mesurés depuis l'agenda en direct",
)
export function priceIntro(l: Locale, n: number, venues: number, van: string, tot: string): string {
  const m: T = {
    nl: `Uit ${n} gedateerde clubavonden bij ${venues} zalen tussen ${van} en ${tot}. Alleen entree — drankjes, tafels en vervoer staan daarbuiten, en samen zijn die de grootste helft van de avond.`,
    en: `From ${n} dated club nights across ${venues} venues between ${van} and ${tot}. Entry only — drinks, tables and transport are separate, and together they are the larger half of the evening.`,
    de: `Aus ${n} datierten Clubnächten in ${venues} Locations zwischen ${van} und ${tot}. Nur Eintritt — Getränke, Tische und Transport kommen dazu, und zusammen sind sie die größere Hälfte des Abends.`,
    es: `De ${n} noches con fecha en ${venues} locales entre el ${van} y el ${tot}. Solo entrada — bebidas, mesas y transporte van aparte, y juntos son la mitad más grande de la noche.`,
    fr: `Sur ${n} soirées datées dans ${venues} établissements entre le ${van} et le ${tot}. Entrée seule — boissons, tables et transport sont à part, et ensemble ils représentent la plus grosse moitié de la soirée.`,
  }
  return m[l]
}
export const ROW_CHEAPEST: T = L('Goedkoopste avond in de agenda', 'Cheapest night in the agenda', 'Günstigste Nacht im Kalender', 'Noche más barata de la agenda', "Soirée la moins chère de l'agenda")
export const ROW_MEDIAN: T = L('Mediane avond', 'Median night', 'Median-Nacht', 'Noche mediana', 'Soirée médiane')
export const ROW_MEDIAN_NOTE: T = L('De helft van alle avonden kost minder', 'Half of all nights cost less than this', 'Die Hälfte aller Nächte kostet weniger', 'La mitad de las noches cuesta menos', 'La moitié des soirées coûte moins')
export const ROW_RANGE: T = L('Gebruikelijk bereik', 'Typical range', 'Übliche Spanne', 'Rango habitual', 'Fourchette habituelle')
export const ROW_RANGE_NOTE: T = L('De middelste helft van alle avonden', 'The middle half of all nights', 'Die mittlere Hälfte aller Nächte', 'La mitad central de todas las noches', 'La moitié centrale des soirées')
export const PER_PERSON: T = L('per persoon', 'per person', 'pro Person', 'por persona', 'par personne')

// ── Hï of UNVRS ────────────────────────────────────────────────────────────
export const H_COMPARE: T = L(
  'Hï Ibiza of UNVRS — welke?',
  'Hï Ibiza or UNVRS — which one?',
  'Hï Ibiza oder UNVRS — welcher?',
  'Hï Ibiza o UNVRS, ¿cuál?',
  'Hï Ibiza ou UNVRS — lequel ?',
)
export function compareLead(l: Locale, hiNaam: string, unNaam: string, hiMed: number, unMed: number, hiN: number, unN: number): string {
  const verschil = unMed - hiMed
  const prijs: T = {
    nl: verschil > 0
      ? `${unNaam} is de duurdere zaal: een typische avond kost €${unMed} tegen €${hiMed} bij ${hiNaam}, een verschil van €${verschil}, gemeten over ${unN} en ${hiN} gedateerde avonden in onze agenda. `
      : `Een typische avond kost €${unMed} bij ${unNaam} tegen €${hiMed} bij ${hiNaam}, gemeten over ${unN} en ${hiN} gedateerde avonden in onze agenda. `,
    en: verschil > 0
      ? `${unNaam} is the more expensive room: a typical night is €${unMed} against €${hiMed} at ${hiNaam}, a gap of €${verschil}, measured across ${unN} and ${hiN} dated nights in our agenda. `
      : `A typical night is €${unMed} at ${unNaam} against €${hiMed} at ${hiNaam}, measured across ${unN} and ${hiN} dated nights in our agenda. `,
    de: verschil > 0
      ? `${unNaam} ist der teurere Raum: Eine typische Nacht kostet €${unMed} gegenüber €${hiMed} im ${hiNaam}, ein Unterschied von €${verschil}, gemessen über ${unN} und ${hiN} datierte Nächte in unserem Kalender. `
      : `Eine typische Nacht kostet €${unMed} im ${unNaam} gegenüber €${hiMed} im ${hiNaam}, gemessen über ${unN} und ${hiN} datierte Nächte in unserem Kalender. `,
    es: verschil > 0
      ? `${unNaam} es la sala más cara: una noche típica son €${unMed} frente a €${hiMed} en ${hiNaam}, una diferencia de €${verschil}, medida sobre ${unN} y ${hiN} noches con fecha en nuestra agenda. `
      : `Una noche típica son €${unMed} en ${unNaam} frente a €${hiMed} en ${hiNaam}, medido sobre ${unN} y ${hiN} noches con fecha en nuestra agenda. `,
    fr: verschil > 0
      ? `${unNaam} est la salle la plus chère : une soirée type coûte €${unMed} contre €${hiMed} au ${hiNaam}, un écart de €${verschil}, mesuré sur ${unN} et ${hiN} soirées datées de notre agenda. `
      : `Une soirée type coûte €${unMed} au ${unNaam} contre €${hiMed} au ${hiNaam}, mesuré sur ${unN} et ${hiN} soirées datées de notre agenda. `,
  }
  const feiten: T = {
    nl: 'Hï voerde de clubpoll van DJ Mag aan van 2022 tot en met 2025; UNVRS opende op 30 mei 2025 en is de nieuwere, grotere productie.',
    en: 'Hï topped DJ Mag’s club poll every year from 2022 to 2025; UNVRS opened on 30 May 2025 and is the newer, larger production.',
    de: 'Hï führte die Club-Umfrage von DJ Mag von 2022 bis 2025 an; UNVRS öffnete am 30. Mai 2025 und ist die neuere, größere Produktion.',
    es: 'Hï encabezó la encuesta de clubs de DJ Mag de 2022 a 2025; UNVRS abrió el 30 de mayo de 2025 y es la producción más nueva y grande.',
    fr: "Hï a dominé le classement des clubs de DJ Mag de 2022 à 2025 ; UNVRS a ouvert le 30 mai 2025 et constitue la production la plus récente et la plus grande.",
  }
  return `${prijs[l]}${feiten[l]}`
}
export function compareAreas(l: Locale, hiNaam: string, hiGebied: string, unNaam: string, unGebied: string): string {
  const m: T = {
    nl: ` Buren zijn ze niet: ${hiNaam} staat in ${hiGebied} en ${unNaam} in ${unGebied}, landinwaarts. Dat bepaalt de rit naar huis sterker dan de ticketprijs — een taxi om zes uur ’s ochtends midden op het eiland is iets anders dan een wandeling over de strip.`,
    en: ` They are not neighbours: ${hiNaam} is in ${hiGebied} and ${unNaam} in ${unGebied}, inland. That decides the ride home more than the ticket price does — a taxi at six in the morning from the middle of the island is a different proposition from a walk along the strip.`,
    de: ` Nachbarn sind sie nicht: ${hiNaam} liegt in ${hiGebied} und ${unNaam} in ${unGebied}, im Landesinneren. Das entscheidet die Rückfahrt stärker als der Ticketpreis — ein Taxi um sechs Uhr morgens mitten auf der Insel ist etwas anderes als ein Spaziergang über die Strip.`,
    es: ` Vecinos no son: ${hiNaam} está en ${hiGebied} y ${unNaam} en ${unGebied}, tierra adentro. Eso decide la vuelta a casa más que el precio de la entrada — un taxi a las seis de la mañana desde el centro de la isla no es lo mismo que un paseo por la strip.`,
    fr: ` Ils ne sont pas voisins : ${hiNaam} est à ${hiGebied} et ${unNaam} à ${unGebied}, dans les terres. Cela décide du retour plus que le prix du billet — un taxi à six heures du matin depuis le centre de l'île n'a rien à voir avec une marche le long de la strip.`,
  }
  return m[l]
}
export const CMP_WHERE: T = L('Waar het ligt', 'Where it is', 'Wo es liegt', 'Dónde está', 'Où c’est')
export const CMP_TYPICAL: T = L('Typische entree', 'Typical entry', 'Typischer Eintritt', 'Entrada habitual', 'Entrée habituelle')
export const CMP_CHEAPEST: T = L('Goedkoopste avond gezien', 'Cheapest night seen', 'Günstigste gesehene Nacht', 'Noche más barata vista', 'Soirée la moins chère vue')
export const CMP_NIGHTS: T = L('Avonden in onze agenda', 'Nights in our agenda', 'Nächte in unserem Kalender', 'Noches en nuestra agenda', 'Soirées dans notre agenda')
export const CMP_LAST: T = L('Laatste avond die wij hebben', 'Last night we hold', 'Letzte Nacht, die wir haben', 'Última noche que tenemos', 'Dernière soirée que nous avons')
export const CMP_VERDICT: T = L(
  'We gaan je niet vertellen welke zaal beter is — daar hebben we geen grondslag voor, en niemand anders die het opschrijft ook. Wat wél verschilt en te controleren is, is de prijs, het aantal avonden en wie er op jouw avond draait. Kies eerst de line-up; in de meeste weken beslist die het al voordat de prijs eraan te pas komt.',
  'We are not going to tell you which room is better — we have no basis for that, and neither does anyone else writing it down. What differs and can be checked is the price, the number of nights and who is playing on yours. Pick the line-up first; on most weeks that decides it before the price does.',
  'Wir sagen dir nicht, welcher Raum besser ist — dafür haben wir keine Grundlage, und alle anderen, die es aufschreiben, auch nicht. Was sich unterscheidet und prüfbar ist: der Preis, die Zahl der Nächte und wer an deinem Abend spielt. Wähl zuerst das Line-up; in den meisten Wochen entscheidet das schon vor dem Preis.',
  'No te vamos a decir qué sala es mejor — no tenemos base para eso, y quien lo escribe tampoco. Lo que sí cambia y se puede comprobar es el precio, el número de noches y quién pincha en la tuya. Elige primero el cartel; casi todas las semanas eso lo decide antes que el precio.',
  "Nous n'allons pas vous dire quelle salle est meilleure — nous n'avons aucune base pour cela, et ceux qui l'écrivent non plus. Ce qui diffère et se vérifie, c'est le prix, le nombre de soirées et qui joue le soir qui vous intéresse. Choisissez d'abord le line-up ; la plupart des semaines, cela tranche avant le prix.",
)

// ── Waar logeer je ─────────────────────────────────────────────────────────
export const H_BASE: T = L(
  'Waar je je basis kiest',
  'Where to base yourself',
  'Wo du dich einquartierst',
  'Dónde alojarte',
  'Où poser ses valises',
)
export const BASE: T[] = [
  L(
    'Playa d’en Bossa is het praktische antwoord als de grote zalen de reden zijn dat je komt. Drie van de grootste locaties van het eiland liggen aan of naast dezelfde strip, dus een avond eindigt met een wandeling in plaats van een onderhandeling, en de beachclubs die de middag vullen liggen op hetzelfde stuk strand. De ruil is dat het een strip is: je logeert ín het uitgaansleven in plaats van ernaast.',
    'Playa d’en Bossa is the practical answer if the big rooms are why you came. Three of the island’s largest venues sit on or beside the same strip, so a night out ends with a walk rather than a negotiation, and the beach clubs that fill the afternoon are on the same stretch of sand. The trade is that it is a strip: you are staying in the nightlife rather than near it.',
    'Playa d’en Bossa ist die praktische Antwort, wenn die großen Räume der Grund für deine Reise sind. Drei der größten Locations der Insel liegen an oder neben derselben Strip, ein Abend endet also mit einem Spaziergang statt einer Verhandlung, und die Beachclubs, die den Nachmittag füllen, liegen am gleichen Strandabschnitt. Der Preis: Es ist eine Strip — du wohnst im Nachtleben statt daneben.',
    'Playa d’en Bossa es la respuesta práctica si las salas grandes son el motivo del viaje. Tres de los locales más grandes de la isla están en la misma strip o al lado, así que la noche acaba en un paseo y no en una negociación, y los beach clubs que llenan la tarde están en el mismo tramo de arena. A cambio: es una strip, te alojas dentro del ambiente y no al lado.',
    "Playa d’en Bossa est la réponse pratique si les grandes salles sont la raison de votre venue. Trois des plus grands lieux de l'île sont sur la même strip ou à côté : la soirée se termine par une marche plutôt qu'une négociation, et les beach clubs qui remplissent l'après-midi sont sur la même portion de sable. En contrepartie, c'est une strip : vous logez dans la vie nocturne plutôt qu'à côté.",
  ),
  L(
    'Ibiza-Stad past bij een reis die niet alleen om clubben draait. Je krijgt de oude stad en de haven, een diner dat het tijdslot van tien uur waard is, en één grote club op loopafstand. De rest is een korte rit. Dit is de versie die de meeste mensen boven de dertig prettiger vinden, en het is ook de basis die een regenachtige dag overleeft.',
    'Ibiza Town suits a trip that is not only about clubbing. You get the old town and the harbour, dinner that is worth the ten o’clock slot, and one major club within walking distance. Everything else is a short ride. This is the version most people over thirty enjoy more, and it is also the base that survives a rainy day.',
    'Ibiza-Stadt passt zu einer Reise, bei der es nicht nur ums Feiern geht. Du bekommst die Altstadt und den Hafen, ein Abendessen, das den Zehn-Uhr-Slot wert ist, und einen großen Club zu Fuß erreichbar. Alles andere ist eine kurze Fahrt. Diese Variante gefällt den meisten über dreißig besser, und sie übersteht auch einen Regentag.',
    'Ibiza ciudad encaja con un viaje que no va solo de salir de club. Tienes el casco antiguo y el puerto, una cena que merece la franja de las diez, y un club grande a pie. Todo lo demás queda a un trayecto corto. Es la versión que más disfruta la mayoría de los mayores de treinta, y también la base que sobrevive a un día de lluvia.',
    "Ibiza-ville convient à un séjour qui ne tourne pas uniquement autour des clubs. Vous avez la vieille ville et le port, un dîner qui justifie le créneau de dix heures, et un grand club à pied. Tout le reste est à un court trajet. C'est la version que la plupart des plus de trente ans préfèrent, et c'est aussi la base qui survit à un jour de pluie.",
  ),
  L(
    'San Antonio is de goedkopere, jongere kant, en het bezit de zonsondergang. De keerzijde is afstand: de grootste zalen liggen aan de andere kant van het eiland, en de terugreis om zes uur ’s ochtends is een echte kostenpost die mensen op nacht twee ontdekken in plaats van bij het boeken.',
    'San Antonio is the cheaper, younger end, and it owns the sunset. The trade-off is distance: the biggest rooms are on the other side of the island, and the return journey at six in the morning is a real cost that people discover on night two rather than when booking.',
    'San Antonio ist das günstigere, jüngere Ende, und ihm gehört der Sonnenuntergang. Der Nachteil ist die Entfernung: Die größten Räume liegen auf der anderen Inselseite, und die Rückfahrt um sechs Uhr morgens ist ein echter Kostenpunkt, den man in Nacht zwei entdeckt statt beim Buchen.',
    'San Antonio es el lado más barato y más joven, y es dueño del atardecer. La contrapartida es la distancia: las salas más grandes están al otro lado de la isla, y la vuelta a las seis de la mañana es un coste real que la gente descubre la segunda noche y no al reservar.',
    "San Antonio, c'est le versant moins cher et plus jeune, et il possède le coucher de soleil. La contrepartie, c'est la distance : les plus grandes salles sont de l'autre côté de l'île, et le retour à six heures du matin est un coût réel qu'on découvre la deuxième nuit, pas au moment de réserver.",
  ),
  L(
    'Ergens anders — Santa Eulalia, het noorden, een villa in het binnenland — is een prachtige vakantie met een vervoersprobleem aan elke avond geplakt. Het werkt als iemand rijdt en niet drinkt. Het werkt niet als bijgedachte.',
    'Anywhere else — Santa Eulalia, the north, an inland villa — is a lovely holiday with a transport problem attached to every night out. It works if someone is driving and not drinking. It does not work as an afterthought.',
    'Alles andere — Santa Eulalia, der Norden, eine Finca im Landesinneren — ist ein schöner Urlaub mit einem Verkehrsproblem an jedem Abend. Es funktioniert, wenn jemand fährt und nicht trinkt. Als nachträglicher Einfall funktioniert es nicht.',
    'Cualquier otro sitio — Santa Eulalia, el norte, una villa en el interior — es unas vacaciones preciosas con un problema de transporte pegado a cada noche. Funciona si alguien conduce y no bebe. No funciona como ocurrencia de última hora.',
    "Ailleurs — Santa Eulalia, le nord, une villa dans les terres — c'est de belles vacances avec un problème de transport accroché à chaque soirée. Cela marche si quelqu'un conduit et ne boit pas. Cela ne marche pas en solution de repli.",
  ),
]

// ── Seizoen ────────────────────────────────────────────────────────────────
export const H_SEASON: T = L(
  'Wanneer het seizoen loopt',
  'When the season runs',
  'Wann die Saison läuft',
  'Cuándo va la temporada',
  'Quand se déroule la saison',
)
export function season1(l: Locale, van: string, tot: string, open: number, totaal: number): string {
  const m: T = {
    nl: `De gepubliceerde agenda loopt nu van ${van} tot ${tot}, met ${open} van de ${totaal} clubs die nog avonden voor de boeg hebben. Juli en augustus zijn de dichtstbezette maanden en ook de duurste; mei, juni, september en oktober zijn goedkoper, rustiger en voor veel mensen beter.`,
    en: `The published agenda currently runs from ${van} to ${tot}, with ${open} of ${totaal} clubs still having nights ahead. July and August are the densest months and also the most expensive; May, June, September and October are cheaper, quieter and, for a lot of people, better.`,
    de: `Der veröffentlichte Kalender läuft derzeit von ${van} bis ${tot}, wobei ${open} von ${totaal} Clubs noch Termine vor sich haben. Juli und August sind die dichtesten Monate und auch die teuersten; Mai, Juni, September und Oktober sind günstiger, ruhiger und für viele besser.`,
    es: `La agenda publicada va ahora del ${van} al ${tot}, con ${open} de ${totaal} clubs que aún tienen noches por delante. Julio y agosto son los meses más densos y también los más caros; mayo, junio, septiembre y octubre son más baratos, más tranquilos y, para mucha gente, mejores.`,
    fr: `L'agenda publié va actuellement du ${van} au ${tot}, avec ${open} clubs sur ${totaal} qui ont encore des soirées devant eux. Juillet et août sont les mois les plus denses et aussi les plus chers ; mai, juin, septembre et octobre sont moins chers, plus calmes et, pour beaucoup, meilleurs.`,
  }
  return m[l]
}
export const SEASON_REST: T[] = [
  L(
    'De twee data die zich anders gedragen zijn de openings en de closings. Openingsfeesten in mei en closings eind september en oktober verkopen het eerst uit, trekken de sterkste line-ups, en zijn de avonden waar mensen hun vlucht omheen plannen in plaats van ze ertussen te proppen. Is een van die twee de reden van je reis, boek dan het ticket vóór de vlucht.',
    'The two dates that behave differently are the openings and the closings. Opening parties in May and closing parties in late September and October sell out earliest, draw the strongest line-ups, and are the nights people plan flights around rather than fit in. If one of them is the reason for your trip, book the ticket before the flight.',
    'Die beiden Termine, die sich anders verhalten, sind die Openings und die Closings. Opening-Partys im Mai und Closings Ende September und im Oktober sind zuerst ausverkauft, ziehen die stärksten Line-ups an und sind die Nächte, um die herum man Flüge plant, statt sie einzuschieben. Ist eine davon der Grund deiner Reise, buche das Ticket vor dem Flug.',
    'Las dos fechas que se comportan distinto son las openings y las closings. Las fiestas de apertura de mayo y los closings de finales de septiembre y octubre se agotan antes, atraen los mejores carteles y son las noches alrededor de las cuales la gente planifica el vuelo en vez de encajarlas. Si una de ellas es el motivo del viaje, compra la entrada antes que el vuelo.',
    "Les deux dates qui se comportent différemment sont les openings et les closings. Les soirées d'ouverture en mai et les closings fin septembre et en octobre affichent complet en premier, attirent les meilleurs line-ups et sont les soirées autour desquelles on organise son vol plutôt que de les caser. Si l'une d'elles est la raison de votre voyage, achetez le billet avant le vol.",
  ),
  L(
    'De laatst geplande avond van een club in onze agenda is geen bewijs dat hij daarna dicht is — programma’s worden verlengd. Het is de laatste datum die wij eerlijk kunnen tonen, en dat is een andere bewering; de seizoenspagina zet hem per club op een rij.',
    'A club’s last scheduled night in our agenda is not proof it is shut afterwards — programmes get extended. It is the last date we can honestly show you, which is a different claim, and the season page lists it per club.',
    'Die letzte geplante Nacht eines Clubs in unserem Kalender ist kein Beweis, dass danach geschlossen ist — Programme werden verlängert. Es ist das letzte Datum, das wir ehrlich zeigen können, und das ist eine andere Aussage; die Saisonseite listet es pro Club auf.',
    'La última noche programada de un club en nuestra agenda no prueba que después cierre — los programas se amplían. Es la última fecha que podemos mostrar honestamente, que es otra afirmación distinta; la página de temporada la lista club por club.',
    "La dernière soirée programmée d'un club dans notre agenda ne prouve pas qu'il ferme ensuite — les programmations sont prolongées. C'est la dernière date que nous pouvons montrer honnêtement, ce qui est une autre affirmation ; la page saison la donne club par club.",
  ),
]

export const FAQS: { q: T; a: T }[] = [
  {
    q: L('Hoe laat begint het uitgaan op Ibiza?', 'What time does Ibiza nightlife start?', 'Wann beginnt das Nachtleben auf Ibiza?', '¿A qué hora empieza la noche en Ibiza?', 'À quelle heure commence la nuit à Ibiza ?'),
    a: L(
      'Later dan vrijwel overal. Nachtclubs openen rond middernacht en draaien tot zes uur ’s ochtends, met de headliner meestal tussen twee en vier. Daarvóór draait het eiland op beachclubs en dagzalen vanaf het middaguur, en wordt er rond tien uur gegeten. Bij opening in een nachtclub aankomen betekent naar een warming-up in een lege zaal kijken.',
      'Later than almost anywhere else. Night clubs open around midnight and run to six in the morning, with the headline set usually between two and four. Before that, the island runs on beach clubs and daytime venues from lunchtime onwards, and dinner happens around ten. Turning up at a night club at opening means watching a warm-up in an empty room.',
      'Später als fast überall sonst. Nachtclubs öffnen gegen Mitternacht und laufen bis sechs Uhr morgens, der Headliner spielt meist zwischen zwei und vier. Davor läuft die Insel ab Mittag auf Beachclubs und Tages-Locations, gegessen wird gegen zehn. Zur Öffnung in einem Nachtclub aufzutauchen heißt, ein Warm-up im leeren Raum zu sehen.',
      'Más tarde que casi en cualquier sitio. Los clubs abren hacia medianoche y funcionan hasta las seis de la mañana, con el cabeza de cartel normalmente entre las dos y las cuatro. Antes, la isla va de beach clubs y locales de día desde el mediodía, y se cena hacia las diez. Llegar a un club a la hora de apertura es ver un calentamiento en una sala vacía.',
      "Plus tard que presque partout ailleurs. Les clubs ouvrent vers minuit et tournent jusqu'à six heures, la tête d'affiche jouant en général entre deux et quatre. Avant cela, l'île vit au rythme des beach clubs et des lieux de jour dès midi, et l'on dîne vers dix heures. Arriver à l'ouverture d'un club, c'est regarder un warm-up dans une salle vide.",
    ),
  },
  {
    q: L('Hoeveel nachten heb ik nodig op Ibiza?', 'How many nights do I need in Ibiza?', 'Wie viele Nächte brauche ich auf Ibiza?', '¿Cuántas noches necesito en Ibiza?', "Combien de nuits faut-il à Ibiza ?"),
    a: L(
      'Vier is het eerlijke minimum als clubben het doel is, en dat gaat niet over het aantal clubs. Een clubavond eindigt om zes uur en kost je de dag erna, dus drie avonden op rij is twee avonden uit en één afschrijving. Met vier nachten doe je twee grote avonden, één beachclubdag en één hersteldag zonder dat de reis een uithoudingsproef wordt.',
      'Four is the honest minimum if clubbing is the point, and it is not about the number of clubs. A club night ends at six and costs you the following day, so three consecutive nights out is two nights out and one write-off. Four nights lets you do two big nights, one beach-club day and one recovery day without the trip becoming an endurance test.',
      'Vier ist das ehrliche Minimum, wenn Feiern der Zweck ist, und es geht nicht um die Zahl der Clubs. Eine Clubnacht endet um sechs und kostet dich den Folgetag, drei Nächte hintereinander sind also zwei Nächte aus und eine Abschreibung. Vier Nächte erlauben zwei große Nächte, einen Beachclub-Tag und einen Erholungstag, ohne dass die Reise zur Ausdauerprüfung wird.',
      'Cuatro es el mínimo honesto si el objetivo es salir, y no tiene que ver con el número de clubs. Una noche de club acaba a las seis y te cuesta el día siguiente, así que tres noches seguidas son dos noches fuera y un día perdido. Cuatro noches permiten dos noches grandes, un día de beach club y un día de recuperación sin que el viaje sea una prueba de resistencia.',
      "Quatre est le minimum honnête si le clubbing est le but, et cela ne tient pas au nombre de clubs. Une soirée en club se termine à six heures et vous coûte le lendemain : trois soirées d'affilée, ce sont deux soirées et une journée perdue. Quatre nuits permettent deux grandes soirées, une journée beach club et une journée de récupération sans que le séjour devienne une épreuve d'endurance.",
    ),
  },
  {
    q: L('Wat is het verschil tussen een beachclub en een nachtclub?', 'What is the difference between a beach club and a night club here?', 'Was ist der Unterschied zwischen Beachclub und Nachtclub?', '¿Qué diferencia hay entre un beach club y un club de noche?', 'Quelle différence entre un beach club et un club de nuit ?'),
    a: L(
      'Het tijdstip en waar je voor betaalt. Beachclubs draaien van het eind van de ochtend tot zonsondergang, en je betaalt voor een ligbed of een tafel in plaats van entree. Nachtclubs openen om middernacht en vragen toegangsgeld. De open-air dagzalen zitten daartussenin: die draaien bij daglicht, van laat in de middag tot rond middernacht, met een ticket zoals een club.',
      'Time of day and what you are paying for. Beach clubs run from late morning to sunset, and you pay for a sunbed or a table rather than entry. Night clubs open at midnight and charge admission. The open-air daytime venues sit between the two: they run in daylight, from late afternoon to around midnight, with a ticket like a club.',
      'Die Tageszeit und wofür du zahlst. Beachclubs laufen vom späten Vormittag bis Sonnenuntergang, und du zahlst für eine Liege oder einen Tisch statt Eintritt. Nachtclubs öffnen um Mitternacht und verlangen Eintritt. Die Open-Air-Locations am Tag liegen dazwischen: Sie laufen bei Tageslicht, vom späten Nachmittag bis etwa Mitternacht, mit einem Ticket wie ein Club.',
      'La hora del día y lo que pagas. Los beach clubs van de media mañana al atardecer, y pagas por una hamaca o una mesa, no por entrar. Los clubs de noche abren a medianoche y cobran entrada. Los locales al aire libre de día están entre medias: funcionan con luz, de media tarde hasta cerca de medianoche, con entrada como un club.',
      "L'heure de la journée et ce que vous payez. Les beach clubs vont de la fin de matinée au coucher du soleil, et vous payez un transat ou une table plutôt qu'une entrée. Les clubs de nuit ouvrent à minuit et font payer l'entrée. Les lieux en plein air de jour sont entre les deux : ils tournent en plein jour, de la fin d'après-midi jusque vers minuit, avec un billet comme un club.",
    ),
  },
  {
    q: L('Moet ik clubtickets vooraf boeken?', 'Do I need to book Ibiza club tickets in advance?', 'Muss ich Clubtickets vorher buchen?', '¿Hay que reservar las entradas con antelación?', "Faut-il réserver les billets à l'avance ?"),
    a: L(
      'Voor de avonden die ertoe doen wel. Openingsfeesten in mei, closings eind september en oktober, en elke zaterdag in augustus met een grote naam verkopen echt uit. Een doordeweekse avond in juni doorgaans niet. Is je reis om één specifieke avond gebouwd, koop hem dan wanneer je de vlucht boekt en niet wanneer je landt.',
      'For the nights that matter, yes. Opening parties in May, closing parties in late September and October, and any headline Saturday in August genuinely sell out. A midweek night in June generally does not. If your trip is built around one specific night, buy it when you book the flight rather than when you land.',
      'Für die Nächte, auf die es ankommt, ja. Opening-Partys im Mai, Closings Ende September und im Oktober und jeder Samstag im August mit großem Namen sind tatsächlich ausverkauft. Ein Abend unter der Woche im Juni in der Regel nicht. Ist deine Reise um einen bestimmten Abend gebaut, kauf ihn beim Flug und nicht bei der Landung.',
      'Para las noches que importan, sí. Las openings de mayo, los closings de finales de septiembre y octubre, y cualquier sábado de agosto con un nombre grande se agotan de verdad. Una noche entre semana en junio, por lo general no. Si tu viaje gira en torno a una noche concreta, cómprala cuando reserves el vuelo y no cuando aterrices.',
      "Pour les soirées qui comptent, oui. Les openings de mai, les closings de fin septembre et d'octobre, et n'importe quel samedi d'août avec une tête d'affiche affichent vraiment complet. Une soirée en semaine en juin, généralement non. Si votre séjour est bâti autour d'une soirée précise, achetez-la en réservant le vol, pas en atterrissant.",
    ),
  },
  {
    q: L('In welk gebied kun je het beste logeren om uit te gaan?', 'Which area should I stay in for nightlife?', 'In welcher Gegend übernachtet man fürs Nachtleben?', '¿En qué zona alojarse para salir de noche?', 'Dans quel quartier loger pour la vie nocturne ?'),
    a: L(
      'Playa d’en Bossa als de grote clubs het doel zijn — de grootste zalen liggen daar op loopafstand of een korte rit, en je komt thuis zonder het te hoeven plannen. Ibiza-Stad als je diner en de oude stad naast de clubs wilt. San Antonio voor zonsondergangbars en een jongere, goedkopere scene. Ergens anders, en elke avond eindigt met een taxigesprek.',
      'Playa d\'en Bossa if the big clubs are the point — the largest rooms are walkable or a short ride, and you can get home without planning it. Ibiza Town if you want dinner and the old town alongside the clubs. San Antonio for sunset bars and a younger, cheaper scene. Anywhere else and every night out ends with a taxi conversation.',
      'Playa d’en Bossa, wenn die großen Clubs der Zweck sind — die größten Räume sind zu Fuß oder mit einer kurzen Fahrt erreichbar, und du kommst nach Hause, ohne es zu planen. Ibiza-Stadt, wenn du Abendessen und Altstadt neben den Clubs willst. San Antonio für Sunset-Bars und eine jüngere, günstigere Szene. Überall sonst endet jeder Abend mit einem Taxigespräch.',
      'Playa d’en Bossa si el objetivo son los clubs grandes — las salas mayores están a pie o a un trayecto corto, y vuelves a casa sin tener que planificarlo. Ibiza ciudad si quieres cena y casco antiguo junto a los clubs. San Antonio para bares de atardecer y un ambiente más joven y barato. En cualquier otro sitio, cada noche acaba en una conversación sobre taxis.',
      "Playa d’en Bossa si les grands clubs sont le but — les plus grandes salles sont accessibles à pied ou en court trajet, et vous rentrez sans avoir à le prévoir. Ibiza-ville si vous voulez le dîner et la vieille ville à côté des clubs. San Antonio pour les bars de coucher de soleil et une scène plus jeune et moins chère. Ailleurs, chaque soirée se termine par une conversation sur les taxis.",
    ),
  },
  {
    q: L('Hoeveel moet ik rekenen voor een avond uit?', 'How much should I budget for a night out?', 'Wie viel sollte ich für einen Abend einplanen?', '¿Cuánto presupuesto para una noche?', 'Quel budget pour une soirée ?'),
    a: L(
      'Entree is de kleinste helft. Drankjes in de grote clubs zijn navenant geprijsd, en de barrekening haalt het ticket sneller in dan mensen verwachten — dát onderschatten eerste bezoekers, niet het ticket. Tel de rit naar huis erbij op, die bij een club aan een weg om sluitingstijd geen afrondingsverschil is. Onze prijzenpagina publiceert gemeten entreeprijzen per club, opnieuw berekend uit de live agenda.',
      'Entry is the smaller half. Drinks inside the major clubs are priced accordingly, and the bar bill overtakes the ticket faster than people expect — that is the part first-timers underestimate, not the ticket. Add the ride home, which on a road-location club at closing time is not a rounding error. Our Ibiza prices page publishes measured entry prices per club, recomputed from the live agenda.',
      'Der Eintritt ist die kleinere Hälfte. Getränke in den großen Clubs sind entsprechend bepreist, und die Barrechnung überholt das Ticket schneller als gedacht — das unterschätzen Erstbesucher, nicht das Ticket. Rechne die Rückfahrt dazu, die bei einem Club an einer Landstraße zur Sperrstunde kein Rundungsfehler ist. Unsere Preisseite veröffentlicht gemessene Eintrittspreise pro Club, neu berechnet aus dem Live-Kalender.',
      'La entrada es la mitad pequeña. Las copas en los clubs grandes están a precio acorde, y la cuenta de la barra adelanta a la entrada antes de lo que la gente espera — eso es lo que subestima quien viene por primera vez, no la entrada. Suma la vuelta a casa, que en un club a pie de carretera a la hora de cierre no es un redondeo. Nuestra página de precios publica precios de entrada medidos por club, recalculados desde la agenda en directo.',
      "L'entrée est la plus petite moitié. Les consommations dans les grands clubs sont tarifées en conséquence, et l'addition au bar dépasse le billet plus vite qu'on ne le pense — c'est ce que sous-estiment les primo-visiteurs, pas le billet. Ajoutez le retour, qui pour un club en bord de route à la fermeture n'est pas une erreur d'arrondi. Notre page des prix publie des prix d'entrée mesurés par club, recalculés depuis l'agenda en direct.",
    ),
  },
  {
    q: L('Is de gastenlijst op Ibiza gratis?', 'Is the Ibiza guestlist free?', 'Ist die Gästeliste auf Ibiza kostenlos?', '¿La guestlist en Ibiza es gratis?', 'La guestlist à Ibiza est-elle gratuite ?'),
    a: L(
      'Niet standaard, en wie anders beweert verkoopt iets. Op een lijst staan betekent één van drie dingen, afhankelijk van de club en de avond: vrije entree vóór een bepaald tijdstip, een lagere deurprijs, of een snellere rij. Bijna elke lijst heeft een sluitingstijd, en daarna betaal je de gewone deurprijs. Aanmelden via ons is gratis en de voorwaarden worden bevestigd voordat je erop rekent.',
      'Not by default, and anyone telling you otherwise is selling something. Being on a list means one of three things depending on the club and the night: free entry before a cut-off time, a reduced door price, or a faster queue. Nearly every list has a cut-off, and after it you pay the normal door price. Signing up through us is free and the terms are confirmed before you rely on them.',
      'Nicht standardmäßig, und wer etwas anderes behauptet, verkauft etwas. Auf einer Liste zu stehen bedeutet je nach Club und Abend eines von drei Dingen: freier Eintritt vor einer bestimmten Uhrzeit, ein reduzierter Türpreis oder eine schnellere Schlange. Fast jede Liste hat einen Schluss, danach zahlst du den normalen Türpreis. Die Anmeldung über uns ist kostenlos, und die Bedingungen werden bestätigt, bevor du dich darauf verlässt.',
      'No por defecto, y quien diga lo contrario está vendiendo algo. Estar en lista significa una de tres cosas según el club y la noche: entrada libre antes de cierta hora, un precio de puerta reducido, o una cola más rápida. Casi toda lista tiene hora límite, y después pagas el precio normal. Apuntarse con nosotros es gratis y las condiciones se confirman antes de que cuentes con ellas.',
      "Pas par défaut, et quiconque prétend le contraire vend quelque chose. Être sur une liste signifie l'une de trois choses selon le club et la soirée : entrée libre avant une heure limite, un tarif réduit à l'entrée, ou une file plus rapide. Presque toutes les listes ont une heure limite, après quoi vous payez le tarif normal. S'inscrire via nous est gratuit et les conditions sont confirmées avant que vous ne comptiez dessus.",
    ),
  },
  {
    q: L('Wat is de dresscode?', 'What is the dress code?', 'Was ist der Dresscode?', '¿Cuál es el código de vestimenta?', 'Quel est le dress code ?'),
    a: L(
      'Bij de meeste zalen minder streng dan mensen verwachten, en aan de bovenkant strenger dan mensen aannemen. Strandkleding, voetbalshirts en slippers worden bij de grote clubs geweigerd; sneakers mogen overal en niemand heeft een colbert nodig. De uitzondering zijn de dinner-showzalen, die wél een echt kledingvoorschrift handhaven. Daar hebben we een pagina over.',
      'Less strict than people expect at most venues, and stricter than people assume at the top end. Beachwear, football shirts and flip-flops get refused at the main clubs; trainers are fine everywhere and nobody needs a jacket. The exceptions are the dinner-show venues, which do enforce a real dress code. We have a page on this.',
      'In den meisten Locations weniger streng als erwartet, am oberen Ende strenger als angenommen. Strandkleidung, Fußballtrikots und Flipflops werden in den großen Clubs abgewiesen; Sneaker gehen überall und ein Sakko braucht niemand. Die Ausnahme sind die Dinner-Show-Locations, die eine echte Kleiderordnung durchsetzen. Dazu haben wir eine eigene Seite.',
      'En casi todos los locales, menos estricto de lo que la gente espera, y más estricto de lo que se supone en la gama alta. La ropa de playa, las camisetas de fútbol y las chanclas se rechazan en los clubs principales; las zapatillas valen en todas partes y nadie necesita americana. La excepción son los locales de cena-espectáculo, que sí aplican un código real. Tenemos una página sobre esto.',
      "Moins strict qu'on ne le croit dans la plupart des lieux, et plus strict qu'on ne le suppose dans le haut de gamme. Tenue de plage, maillots de foot et tongs sont refusés dans les grands clubs ; les baskets passent partout et personne n'a besoin d'une veste. Les exceptions sont les dîners-spectacles, qui appliquent un vrai dress code. Nous avons une page à ce sujet.",
    ),
  },
  {
    q: L('Geldt er een leeftijdsgrens?', 'Is there an age limit?', 'Gibt es eine Altersgrenze?', '¿Hay límite de edad?', "Y a-t-il une limite d'âge ?"),
    a: L(
      'Achttien, gecontroleerd met een fysiek identiteitsbewijs aan de deur van elke grote club, ongeacht tickets, tafels of lijsten. Een foto van je paspoort op een telefoon wordt bij de meeste zalen niet geaccepteerd. Dit is Spaanse wet en geen clubbeleid, dus de deur heeft geen ruimte en er valt om vier uur ’s nachts niets over te discussiëren.',
      'Eighteen, checked with physical photo ID at the door of every major club regardless of tickets, tables or lists. A photo of your passport on a phone is not accepted at most venues. This is Spanish law rather than club policy, so the door has no discretion and there is no point arguing it at four in the morning.',
      'Achtzehn, kontrolliert mit physischem Lichtbildausweis an der Tür jedes großen Clubs, unabhängig von Tickets, Tischen oder Listen. Ein Passfoto auf dem Handy wird in den meisten Locations nicht akzeptiert. Das ist spanisches Gesetz und keine Clubregel, die Tür hat also keinen Spielraum, und um vier Uhr nachts darüber zu diskutieren bringt nichts.',
      'Dieciocho, comprobado con documento físico con foto en la puerta de todos los clubs grandes, sin importar entradas, mesas o listas. Una foto del pasaporte en el móvil no se acepta en casi ningún local. Es ley española y no política del club, así que la puerta no tiene margen y discutirlo a las cuatro de la mañana no lleva a nada.',
      "Dix-huit ans, vérifié avec une pièce d'identité physique à l'entrée de tous les grands clubs, quels que soient les billets, tables ou listes. Une photo du passeport sur le téléphone n'est pas acceptée dans la plupart des lieux. C'est la loi espagnole et non une règle de club : la porte n'a aucune marge, et discuter à quatre heures du matin ne sert à rien.",
    ),
  },
]

export const H_LINKS: T = L('Volgende stappen', 'Next steps', 'Nächste Schritte', 'Siguientes pasos', 'Étapes suivantes')

export const LINKS: { key: string; localized: boolean; label: T; body: T }[] = [
  {
    key: 'calendar', localized: false,
    label: L('Ibiza clubagenda', 'Ibiza club calendar', 'Ibiza Clubkalender', 'Agenda de clubs de Ibiza', "Agenda des clubs d'Ibiza"),
    body: L('Elke gedateerde avond op het eiland, per dag en per zaal.', 'Every dated night on the island, by day and by venue.', 'Jede datierte Nacht der Insel, nach Tag und Location.', 'Cada noche con fecha de la isla, por día y por local.', "Chaque soirée datée de l'île, par jour et par lieu."),
  },
  {
    key: 'club-tickets-hub', localized: true,
    label: L('Ibiza clubtickets 2026', 'Ibiza club tickets 2026', 'Ibiza Clubtickets 2026', 'Entradas discotecas Ibiza 2026', 'Billets clubs Ibiza 2026'),
    body: L('Wat entree per zaal kost, en wanneer avonden uitverkopen.', 'What entry costs per room, and when nights sell out.', 'Was der Eintritt je Raum kostet und wann Nächte ausverkauft sind.', 'Lo que cuesta la entrada por sala y cuándo se agotan las noches.', "Le prix de l'entrée par salle, et quand les soirées affichent complet."),
  },
  {
    key: 'clubs', localized: false,
    label: L('Alle clubs', 'All clubs', 'Alle Clubs', 'Todos los clubs', 'Tous les clubs'),
    body: L('Elke zaal die wij dekken, elk met een eigen live programma.', 'Every venue we cover, each with its own live programme.', 'Jede Location, die wir abdecken, mit eigenem Live-Programm.', 'Cada local que cubrimos, con su propio programa en directo.', "Chaque lieu que nous couvrons, avec son programme en direct."),
  },
  {
    key: 'dress-code', localized: true,
    label: L('Ibiza dresscode', 'Ibiza club dress code', 'Ibiza Dresscode', 'Código de vestimenta en Ibiza', 'Dress code des clubs à Ibiza'),
    body: L('Wat er aan de deur geweigerd wordt, per soort zaal.', 'What actually gets refused at the door, venue by venue.', 'Was an der Tür abgewiesen wird, je nach Location.', 'Lo que rechazan en la puerta, local por local.', "Ce qui est refusé à l'entrée, lieu par lieu."),
  },
  {
    key: 'getting-around', localized: true,
    label: L('Vervoer op Ibiza', 'Getting around Ibiza', 'Fortbewegung auf Ibiza', 'Cómo moverse por Ibiza', 'Se déplacer à Ibiza'),
    body: L('Bus, taxi, huurauto of boot — en de rit om zes uur.', 'Bus, taxi, hire car or boat — and the ride home at six.', 'Bus, Taxi, Mietwagen oder Boot — und die Rückfahrt um sechs.', 'Bus, taxi, coche o barco — y la vuelta a las seis.', "Bus, taxi, voiture ou bateau — et le retour à six heures."),
  },
  {
    key: 'guestlist', localized: false,
    label: L('Ibiza gastenlijst', 'Ibiza guestlist', 'Ibiza Gästeliste', 'Lista de invitados Ibiza', 'Guestlist Ibiza'),
    body: L('Wat een lijstplek oplevert, per club en per avond.', 'What a list gets you, per club and per night.', 'Was ein Listenplatz bringt, je Club und Abend.', 'Lo que te da la lista, por club y por noche.', "Ce qu'apporte une place sur la liste, par club et par soirée."),
  },
]

export const BYLINE_TOPIC: T = L(
  'uitgaan op Ibiza',
  'Ibiza nightlife',
  'das Nachtleben auf Ibiza',
  'la vida nocturna en Ibiza',
  'la vie nocturne à Ibiza',
)
