import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeasonStats, type SeasonStats } from '@/lib/season-stats'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { localeTag } from '@/lib/date-label'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { DatasetJsonLd } from '@/components/seo/DatasetJsonLd'
import { AuthorByline } from '@/components/seo/AuthorByline'

export const revalidate = 3600

const loc = (l: string): Locale =>
  (LOCALES as readonly string[]).includes(l) ? (l as Locale) : DEFAULT_LOCALE

type L = Record<string, string>
const t = (m: L, l: string) => m[l] || m.en

const KICKER: L = {
  nl: 'Het seizoen', en: 'The season', de: 'Die Saison', es: 'La temporada', fr: 'La saison',
}
const TITLE: L = {
  nl: 'Wanneer sluit Ibiza? Welke clubs zijn nog open',
  en: 'When does Ibiza close? Which clubs are still open',
  de: 'Wann schließt Ibiza? Welche Clubs noch offen sind',
  es: '¿Cuándo cierra Ibiza? Qué clubs siguen abiertos',
  fr: 'Quand Ibiza ferme-t-elle ? Quels clubs sont encore ouverts',
}

/**
 * De titel in het zoekresultaat, los van de H1 hierboven.
 *
 * Twee dingen tegelijk. De H1 is een vraag en dat werkt op de pagina, maar hij
 * is 49 tekens en de layout plakt er ' | Ibiza mi vida' achter (16) — dus 65,
 * en Google kapte hem af. Dat stond als bekende fout in
 * scripts/seo-check/baseline.json.
 *
 * En hij droeg de commerciële term niet. Deze pagina heeft als enige op de site
 * de laatste geplande avond per club uit de echte agenda, en dat is precies het
 * antwoord op "best time to visit Ibiza" — een zoekterm die tien keer zo vaak
 * getypt wordt als "when does Ibiza close". Beide staan er nu in, op één URL,
 * want het is één vraag: wanneer moet ik komen.
 */
const META_TITLE: L = {
  nl: 'Beste reistijd Ibiza & wanneer clubs sluiten',
  en: 'Best Time to Visit Ibiza & When Clubs Close',
  de: 'Beste Reisezeit Ibiza & wann Clubs schließen',
  es: 'Mejor época para Ibiza y cuándo cierran',
  fr: 'Quand venir à Ibiza & fermeture des clubs',
}
const H_TABLE: L = {
  nl: 'Laatste geplande avond per club', en: 'Last scheduled night per club',
  de: 'Letzte geplante Nacht pro Club', es: 'Última noche programada por club',
  fr: 'Dernière soirée programmée par club',
}
/**
 * Aangekondigde closing parties. Aparte kop, want dit is een ánder feit dan de
 * tabel erboven: daar staat de laatste avond die wij hebben (een afleiding),
 * hier een avond die de club zelf zo genoemd heeft (een aankondiging). Het
 * verschil staat ook in de introzin, want dat is precies wat een bezoeker hier
 * uit elkaar moet kunnen houden.
 */
const H_CLOSINGS: L = {
  nl: 'Aangekondigde closing parties',
  en: 'Announced closing parties',
  de: 'Angekündigte Closing Partys',
  es: 'Closing parties anunciadas',
  fr: 'Closing parties annoncées',
}

const INTRO_CLOSINGS: L = {
  nl: 'Dit zijn geen afleidingen uit de agenda maar avonden die de club zelf een closing party noemt. Ze staan er zolang ze nog moeten komen; een verstreken closing verdwijnt vanzelf.',
  en: 'These are not inferred from the agenda: they are nights the club itself calls a closing party. They stay listed while they are still to come, and drop off once the date has passed.',
  de: 'Das sind keine Ableitungen aus dem Kalender, sondern Nächte, die der Club selbst Closing Party nennt. Sie stehen hier, solange sie noch bevorstehen, und verschwinden nach dem Termin.',
  es: 'No son deducciones de la agenda: son noches que el propio club llama closing party. Aparecen mientras están por venir y desaparecen una vez pasada la fecha.',
  fr: 'Ce ne sont pas des déductions tirées de l’agenda : ce sont des soirées que le club lui-même appelle closing party. Elles restent tant qu’elles sont à venir et disparaissent une fois la date passée.',
}

// TH_CLUB staat verderop al; niet nog een keer.
const TH_DATE: L = { nl: 'Datum', en: 'Date', de: 'Datum', es: 'Fecha', fr: 'Date' }
const TH_PARTY: L = { nl: 'Avond', en: 'Night', de: 'Nacht', es: 'Noche', fr: 'Soirée' }
/** Voor de clubs die hun slotavond simpelweg naar zichzelf noemen. */
const PLAIN_CLOSING: L = {
  nl: 'Closing party', en: 'Closing party', de: 'Closing Party', es: 'Closing party', fr: 'Closing party',
}

const H_MONTHS: L = {
  nl: 'Hoeveel er per maand open is, en wat het kost',
  en: 'How much is open each month, and what it costs',
  de: 'Was pro Monat geöffnet ist — und was es kostet',
  es: 'Cuánto hay abierto cada mes y lo que cuesta',
  fr: 'Ce qui est ouvert chaque mois, et à quel prix',
}
const TH_FROM: L = { nl: 'Vanaf', en: 'From', de: 'Ab', es: 'Desde', fr: 'Dès' }
const TH_TYPICAL: L = {
  nl: 'Meestal', en: 'Typical', de: 'Üblich', es: 'Habitual', fr: 'Habituel',
}
/** Leeg vak in de prijskolom: te weinig geprijsde avonden die maand. */
const GEEN_PRIJS = '—'
const MONTHS_NOTE: L = {
  nl: 'Een streepje betekent dat die maand te weinig geprijsde avonden in de agenda heeft om er een middenprijs op te baseren — niet dat het gratis is. De bedragen zijn entree per avond, dezelfde telling als op onze prijzenpagina.',
  en: 'A dash means that month holds too few priced nights in the agenda to base a middle price on — not that it is free. The figures are entry per night, from the same count as our prices page.',
  de: 'Ein Strich heißt, dass dieser Monat zu wenige Abende mit Preis im Kalender hat, um einen mittleren Preis darauf zu stützen — nicht, dass es gratis ist. Die Beträge sind Eintritt pro Abend, aus derselben Zählung wie unsere Preisseite.',
  es: 'Un guion significa que ese mes tiene pocas noches con precio en la agenda para calcular un precio medio — no que sea gratis. Las cifras son entrada por noche, del mismo recuento que nuestra página de precios.',
  fr: "Un tiret signifie que ce mois compte trop peu de soirées avec prix dans l'agenda pour en tirer un prix médian — pas que c'est gratuit. Les montants sont l'entrée par soirée, issus du même décompte que notre page des prix.",
}
const MONTHS_LINK: L = {
  nl: 'Alle clubprijzen, per club geteld',
  en: 'All club prices, counted per venue',
  de: 'Alle Clubpreise, pro Club gezählt',
  es: 'Todos los precios de club, por local',
  fr: 'Tous les prix des clubs, par établissement',
}
const H_CAVEAT: L = {
  nl: 'Wat dit wel en niet zegt', en: 'What this does and does not tell you',
  de: 'Was das aussagt und was nicht', es: 'Lo que esto dice y lo que no',
  fr: "Ce que cela dit et ne dit pas",
}
const TH_CLUB: L = { nl: 'Club', en: 'Club', de: 'Club', es: 'Club', fr: 'Club' }
const TH_LAST: L = {
  nl: 'Laatste avond', en: 'Last night', de: 'Letzte Nacht', es: 'Última noche', fr: 'Dernière soirée',
}
const TH_LEFT: L = {
  nl: 'Nog te gaan', en: 'Still to come', de: 'Noch übrig', es: 'Aún por venir', fr: 'À venir',
}
const TH_MONTH: L = { nl: 'Maand', en: 'Month', de: 'Monat', es: 'Mes', fr: 'Mois' }
const TH_CLUBS: L = { nl: 'Clubs', en: 'Clubs', de: 'Clubs', es: 'Clubs', fr: 'Clubs' }
const TH_NIGHTS: L = {
  nl: 'Clubavonden', en: 'Club nights', de: 'Clubnächte', es: 'Noches', fr: 'Soirées',
}
const FAQ_H: L = {
  nl: 'Veelgestelde vragen', en: 'Frequently asked questions', de: 'Häufige Fragen',
  es: 'Preguntas frecuentes', fr: 'Questions fréquentes',
}

function fmtDay(iso: string, l: string): string {
  const [y, m, d] = String(iso || '').split('-').map(Number)
  if (!y) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(localeTag(l), {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}
function fmtMonth(ym: string, l: string): string {
  const [y, m] = String(ym || '').split('-').map(Number)
  if (!y) return ym
  const s = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(localeTag(l), {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  })
  // Only English and German capitalise month names.
  return ['en', 'de'].includes(l) ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function answer(s: SeasonStats, l: string): string {
  const last = s.venues[0]
  const firstToClose = s.venues[s.venues.length - 1]
  const n = s.venues.length
  const m: L = {
    nl: `Van de ${n} clubs in onze agenda sluit ${firstToClose.name} als eerste, met ${fmtDay(firstToClose.lastScheduled, l)} als laatste geplande avond; ${last.name} gaat het langst door, tot ${fmtDay(last.lastScheduled, l)}. Het seizoen dooft dus geleidelijk uit in plaats van op één datum te stoppen. Op dit moment hebben ${s.openNow} clubs nog avonden staan. Dit zijn de data die de clubs zelf gepubliceerd hebben, niet onze schatting.`,
    en: `Of the ${n} clubs in our agenda, ${firstToClose.name} finishes first with ${fmtDay(firstToClose.lastScheduled, l)} as its last scheduled night; ${last.name} runs longest, to ${fmtDay(last.lastScheduled, l)}. The season therefore fades out gradually rather than stopping on one date. Right now ${s.openNow} clubs still have nights on the books. These are the dates the clubs themselves have published, not our estimate.`,
    de: `Von den ${n} Clubs in unserem Kalender endet ${firstToClose.name} zuerst, mit ${fmtDay(firstToClose.lastScheduled, l)} als letzter geplanter Nacht; ${last.name} macht am längsten weiter, bis ${fmtDay(last.lastScheduled, l)}. Die Saison läuft also allmählich aus statt an einem Datum zu enden. Aktuell haben ${s.openNow} Clubs noch Termine stehen. Das sind die von den Clubs selbst veröffentlichten Daten, keine Schätzung von uns.`,
    es: `De los ${n} clubs de nuestra agenda, ${firstToClose.name} termina primero, con ${fmtDay(firstToClose.lastScheduled, l)} como última noche programada; ${last.name} es el que más aguanta, hasta el ${fmtDay(last.lastScheduled, l)}. La temporada se apaga por tanto poco a poco en lugar de parar en una sola fecha. Ahora mismo ${s.openNow} clubs siguen teniendo noches en agenda. Son las fechas que los propios clubs han publicado, no una estimación nuestra.`,
    fr: `Sur les ${n} clubs de notre agenda, ${firstToClose.name} termine en premier, avec le ${fmtDay(firstToClose.lastScheduled, l)} comme dernière soirée programmée ; ${last.name} tient le plus longtemps, jusqu'au ${fmtDay(last.lastScheduled, l)}. La saison s'éteint donc progressivement plutôt qu'à une date unique. Actuellement ${s.openNow} clubs ont encore des dates. Ce sont les dates publiées par les clubs eux-mêmes, pas notre estimation.`,
  }
  return t(m, l)
}

/**
 * "In welke maand is Ibiza het goedkoopst?" — voor zover de agenda dat kán zeggen.
 *
 * Dit is de plek waar overclaimen het makkelijkst is. De agenda loopt maar een
 * paar maanden vooruit, dus in september kent hij september en oktober en
 * verder niets. Uit twee maanden "de goedkoopste maand van het seizoen"
 * afleiden is een bewering over mei tot en met augustus op basis van nul
 * waarnemingen daarover — precies het soort geloofwaardig ogende schatting die
 * daarna als feit wordt teruggeciteerd.
 *
 * Dus: bij drie of meer gemeten maanden noemen we de goedkoopste en de duurste
 * van het seizoen. Bij twee zeggen we welke van de twéé goedkoper is, en dat
 * het over die twee gaat. Bij één alleen wat die maand doet. Bij nul rendert
 * er niets. De zin groeit vanzelf mee zodra de agenda verder vooruit loopt.
 */
function monthPrices(s: SeasonStats, l: string): string | null {
  const gemeten = s.months.filter(m => m.median !== null && m.low !== null)
  if (gemeten.length === 0) return null

  const opPrijs = [...gemeten].sort((a, b) => (a.median as number) - (b.median as number))
  const goedkoopst = opPrijs[0]
  const duurst = opPrijs[opPrijs.length - 1]
  const g = fmtMonth(goedkoopst.month, l)
  const d = fmtMonth(duurst.month, l)
  const gm = `€${goedkoopst.median}`
  const gl = `€${goedkoopst.low}`
  const dm = `€${duurst.median}`
  const n = gemeten.length

  if (n === 1) {
    const m: L = {
      nl: `Voor ${g} — de enige maand waarover onze agenda genoeg geprijsde avonden heeft — is de typische entree ${gm}, met ${gl} als goedkoopste ticket. Zodra de agenda verder vooruit loopt, komen er maanden bij en rekent deze tabel ze mee.`,
      en: `For ${g} — the only month our agenda holds enough priced nights for — typical entry is ${gm}, with ${gl} as the cheapest ticket. As the agenda extends further ahead, more months appear and this table counts them in.`,
      de: `Für ${g} — den einzigen Monat, für den unser Kalender genug Abende mit Preis hat — liegt der typische Eintritt bei ${gm}, mit ${gl} als günstigstem Ticket. Sobald der Kalender weiter reicht, kommen Monate dazu und diese Tabelle rechnet sie mit.`,
      es: `Para ${g} — el único mes del que nuestra agenda tiene bastantes noches con precio — la entrada habitual es ${gm}, con ${gl} como entrada más barata. Cuando la agenda se extienda, se sumarán más meses y esta tabla los incluirá.`,
      fr: `Pour ${g} — le seul mois pour lequel notre agenda compte assez de soirées avec prix — l'entrée habituelle est de ${gm}, avec ${gl} comme billet le moins cher. Dès que l'agenda s'étendra, d'autres mois s'ajouteront et ce tableau les comptera.`,
    }
    return t(m, l)
  }

  if (n === 2) {
    const m: L = {
      nl: `Van de twee maanden die onze agenda nu geprijsd heeft is ${g} de goedkoopste: typisch ${gm} tegen ${dm} in ${d}, met ${gl} als laagste ticket. Dat is een vergelijking van twee maanden en geen uitspraak over het hele seizoen — de agenda loopt niet verder vooruit dan dit. Zodra dat wel zo is, rekent deze tabel de rest mee.`,
      en: `Of the two months our agenda currently has priced, ${g} is the cheaper: typically ${gm} against ${dm} in ${d}, with ${gl} as the lowest ticket. That is a comparison of two months and not a statement about the whole season — the agenda does not reach further ahead than this. Once it does, this table counts the rest in.`,
      de: `Von den zwei Monaten, für die unser Kalender derzeit Preise hat, ist ${g} der günstigere: typisch ${gm} gegenüber ${dm} im ${d}, mit ${gl} als niedrigstem Ticket. Das ist ein Vergleich zweier Monate und keine Aussage über die ganze Saison — weiter reicht der Kalender nicht. Sobald er das tut, rechnet diese Tabelle den Rest mit.`,
      es: `De los dos meses con precio en nuestra agenda, ${g} es el más barato: normalmente ${gm} frente a ${dm} en ${d}, con ${gl} como entrada más baja. Es una comparación de dos meses y no una afirmación sobre toda la temporada — la agenda no llega más lejos. Cuando lo haga, esta tabla incluirá el resto.`,
      fr: `Des deux mois pour lesquels notre agenda a des prix, ${g} est le moins cher : environ ${gm} contre ${dm} en ${d}, avec ${gl} comme billet le plus bas. C'est une comparaison de deux mois, pas une affirmation sur toute la saison — l'agenda ne va pas plus loin. Dès qu'il ira plus loin, ce tableau comptera le reste.`,
    }
    return t(m, l)
  }

  const m: L = {
    nl: `Over de ${n} maanden die onze agenda geprijsd heeft, is ${g} de goedkoopste maand om uit te gaan: typisch ${gm} entree, met ${gl} als laagste ticket. Het duurst is ${d}, met ${dm}. Dat zijn onze eigen clubavonden geteld, geen schatting van het seizoen.`,
    en: `Across the ${n} months our agenda has priced, ${g} is the cheapest month to go out: typically ${gm} entry, with ${gl} as the lowest ticket. The dearest is ${d} at ${dm}. That is our own club nights counted, not an estimate of the season.`,
    de: `Über die ${n} Monate, für die unser Kalender Preise hat, ist ${g} der günstigste Monat zum Ausgehen: typisch ${gm} Eintritt, mit ${gl} als niedrigstem Ticket. Am teuersten ist ${d} mit ${dm}. Das sind unsere eigenen Clubnächte gezählt, keine Schätzung der Saison.`,
    es: `De los ${n} meses con precio en nuestra agenda, ${g} es el mes más barato para salir: normalmente ${gm} de entrada, con ${gl} como entrada más baja. El más caro es ${d}, con ${dm}. Son nuestras propias noches contadas, no una estimación de la temporada.`,
    fr: `Sur les ${n} mois pour lesquels notre agenda a des prix, ${g} est le mois le moins cher pour sortir : environ ${gm} l'entrée, avec ${gl} comme billet le plus bas. Le plus cher est ${d}, à ${dm}. Ce sont nos propres soirées comptées, pas une estimation de la saison.`,
  }
  return t(m, l)
}

function caveat(l: string): string {
  const m: L = {
    nl: 'De laatste avond in deze tabel is de laatste avond die wíj hebben. Dat is niet hetzelfde als "daarna dicht". Clubs kondigen hun closing party ruim van tevoren aan, dus in de praktijk vallen die twee meestal samen — maar een club die zijn laatste data nog niet heeft vrijgegeven ziet er in deze data precies hetzelfde uit. Twijfel je over een specifieke datum, app ons dan even; we checken het bij de club zelf voordat je iets boekt.',
    en: 'The last night in this table is the last night WE hold. That is not the same as "shut after that". Clubs announce their closing party well in advance, so in practice the two usually coincide — but a club that has not yet released its final dates looks identical in this data. If a specific date matters, message us and we will check it with the club before you book anything.',
    de: 'Die letzte Nacht in dieser Tabelle ist die letzte Nacht, die WIR haben. Das ist nicht dasselbe wie "danach geschlossen". Clubs kündigen ihre Closing Party lange vorher an, in der Praxis fällt beides also meist zusammen — aber ein Club, der seine letzten Termine noch nicht veröffentlicht hat, sieht in diesen Daten genauso aus. Wenn ein bestimmtes Datum wichtig ist, schreib uns: wir fragen beim Club nach, bevor du etwas buchst.',
    es: 'La última noche de esta tabla es la última noche que TENEMOS nosotros. No es lo mismo que "cerrado a partir de ahí". Los clubs anuncian su closing con mucha antelación, así que en la práctica suelen coincidir — pero un club que aún no ha publicado sus últimas fechas se ve exactamente igual en estos datos. Si una fecha concreta te importa, escríbenos y lo confirmamos con el club antes de que reserves nada.',
    fr: "La dernière soirée de ce tableau est la dernière soirée que NOUS avons. Ce n'est pas la même chose que « fermé ensuite ». Les clubs annoncent leur closing longtemps à l'avance, donc en pratique les deux coïncident généralement — mais un club qui n'a pas encore publié ses dernières dates paraît identique dans ces données. Si une date précise compte, écrivez-nous : nous vérifions auprès du club avant que vous réserviez.",
  }
  return t(m, l)
}

function faqs(s: SeasonStats, l: string): { q: string; a: string }[] {
  const last = s.venues[0]
  const firstToClose = s.venues[s.venues.length - 1]
  const oct = s.months.find(m => m.month.endsWith('-10'))
  const out: { q: string; a: string }[] = []
  const add = (q: L, a: L) => out.push({ q: t(q, l), a: t(a, l) })

  add(
    { nl: 'Wanneer sluit het clubseizoen op Ibiza?', en: 'When does the Ibiza club season end?', de: 'Wann endet die Clubsaison auf Ibiza?', es: '¿Cuándo termina la temporada de clubs en Ibiza?', fr: "Quand se termine la saison des clubs à Ibiza ?" },
    {
      nl: `De laatste geplande clubavond in onze agenda is ${fmtDay(last.lastScheduled, l)}, bij ${last.name}. De eerste clubs sluiten al vanaf ${fmtDay(firstToClose.lastScheduled, l)}, dus het seizoen dooft geleidelijk uit in plaats van op één datum te stoppen.`,
      en: `The last scheduled club night in our agenda is ${fmtDay(last.lastScheduled, l)}, at ${last.name}. The first clubs finish as early as ${fmtDay(firstToClose.lastScheduled, l)}, so the season fades out gradually rather than stopping on one date.`,
      de: `Die letzte geplante Clubnacht in unserem Kalender ist ${fmtDay(last.lastScheduled, l)} bei ${last.name}. Die ersten Clubs schließen schon ab ${fmtDay(firstToClose.lastScheduled, l)}, die Saison läuft also allmählich aus statt an einem Datum zu enden.`,
      es: `La última noche programada en nuestra agenda es el ${fmtDay(last.lastScheduled, l)}, en ${last.name}. Los primeros clubs cierran ya desde el ${fmtDay(firstToClose.lastScheduled, l)}, así que la temporada se apaga poco a poco en lugar de parar en una sola fecha.`,
      fr: `La dernière soirée programmée dans notre agenda est le ${fmtDay(last.lastScheduled, l)}, au ${last.name}. Les premiers clubs terminent dès le ${fmtDay(firstToClose.lastScheduled, l)} : la saison s'éteint progressivement plutôt qu'à une date unique.`,
    },
  )

  if (oct) {
    add(
      { nl: 'Welke clubs zijn in oktober nog open op Ibiza?', en: 'Which clubs are still open in October in Ibiza?', de: 'Welche Clubs haben im Oktober auf Ibiza noch offen?', es: '¿Qué clubs siguen abiertos en octubre en Ibiza?', fr: 'Quels clubs sont encore ouverts en octobre à Ibiza ?' },
      {
        nl: `In oktober staan er nog ${oct.nights} clubavonden gepland bij ${oct.clubs} clubs. De tabel hierboven laat per club zien tot welke datum er geprogrammeerd is.`,
        en: `In October there are still ${oct.nights} club nights scheduled across ${oct.clubs} clubs. The table above shows, per club, the date the programming runs to.`,
        de: `Im Oktober sind noch ${oct.nights} Clubnächte in ${oct.clubs} Clubs geplant. Die Tabelle oben zeigt pro Club, bis wann programmiert ist.`,
        es: `En octubre quedan ${oct.nights} noches programadas en ${oct.clubs} clubs. La tabla de arriba muestra, por club, hasta qué fecha hay programación.`,
        fr: `En octobre il reste ${oct.nights} soirées programmées dans ${oct.clubs} clubs. Le tableau ci-dessus indique, par club, jusqu'à quelle date la programmation va.`,
      },
    )
  }

  // "In welke maand is Ibiza het goedkoopst" is een eigen zoekopdracht. Het
  // antwoord is dezelfde zin die boven de maandtabel staat — één bron, zodat
  // de FAQ en de tabel niet uit elkaar kunnen lopen — en die zin zegt zelf
  // hoeveel maanden hij overziet. Ontbreken de prijzen, dan valt de vraag weg
  // in plaats van een leeg antwoord te geven.
  const prijszin = monthPrices(s, l)
  if (prijszin) {
    add(
      {
        nl: 'In welke maand is uitgaan op Ibiza het goedkoopst?',
        en: 'Which month is cheapest to go out in Ibiza?',
        de: 'In welchem Monat ist Ausgehen auf Ibiza am günstigsten?',
        es: '¿En qué mes sale más barato salir en Ibiza?',
        fr: 'Quel mois est le moins cher pour sortir à Ibiza ?',
      },
      { nl: prijszin, en: prijszin, de: prijszin, es: prijszin, fr: prijszin },
    )
  }

  add(
    { nl: 'Is Ibiza in de winter helemaal dicht?', en: 'Is Ibiza completely closed in winter?', de: 'Ist Ibiza im Winter komplett geschlossen?', es: '¿Ibiza está completamente cerrada en invierno?', fr: "Ibiza est-elle complètement fermée en hiver ?" },
    {
      nl: 'De grote clubs sluiten na hun closing party en gaan pas in het voorjaar weer open. Het eiland zelf niet: bars, restaurants en de stranden blijven, en de ferry naar Formentera vaart door. Wij programmeren in die periode geen clubtickets, dus deze pagina toont dan alleen wat er wél is.',
      en: 'The big clubs shut after their closing party and reopen in spring. The island itself does not: bars, restaurants and the beaches stay, and the Formentera ferry keeps running. We list no club tickets in that period, so this page then shows only what genuinely is on.',
      de: 'Die großen Clubs schließen nach ihrer Closing Party und öffnen erst im Frühjahr wieder. Die Insel selbst nicht: Bars, Restaurants und Strände bleiben, und die Fähre nach Formentera fährt weiter. Wir führen in dieser Zeit keine Clubtickets, diese Seite zeigt dann nur, was tatsächlich läuft.',
      es: 'Los grandes clubs cierran tras su closing y no reabren hasta la primavera. La isla no: bares, restaurantes y playas siguen, y el ferry a Formentera continúa. En ese periodo no vendemos entradas de club, así que esta página muestra solo lo que realmente hay.',
      fr: "Les grands clubs ferment après leur closing et rouvrent au printemps. L'île, elle, non : bars, restaurants et plages restent, et le ferry pour Formentera continue. Nous ne proposons pas de billets de club à cette période : cette page n'affiche alors que ce qui a réellement lieu.",
    },
  )

  return out
}

/**
 * "When does Ibiza close?" — read off the agenda instead of recalled.
 *
 * Companion to /ibiza-prices and built on the same principle: the one thing we
 * hold that nobody else does is the published, dated programme for every major
 * venue, so the questions worth writing pages about are the ones that data can
 * answer and a travel blog cannot.
 *
 * The load-bearing caution is in season-stats.ts and repeated in the visible
 * copy: a venue's last scheduled night is the last night WE HAVE, which is not
 * the same as the club being shut afterwards. That distinction is carried in
 * the field name, in the column header, in the answer paragraph and in its own
 * section, because it is the one error here that would actually cost a visitor
 * their night out.
 */
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = loc(params.locale)
  const s = await getSeasonStats(params.locale)
  const desc: L = s
    ? {
        nl: `De laatste geplande clubavond is ${fmtDay(s.venues[0].lastScheduled, l)} bij ${s.venues[0].name}. Per club de laatste avond en hoeveel er nog te gaan is, uit de gepubliceerde agenda.`,
        en: `The last scheduled club night is ${fmtDay(s.venues[0].lastScheduled, l)} at ${s.venues[0].name}. Per club: the final night and how much is still to come, from the published agenda.`,
        de: `Die letzte geplante Clubnacht ist ${fmtDay(s.venues[0].lastScheduled, l)} im ${s.venues[0].name}. Pro Club die letzte Nacht und was noch aussteht, aus dem veröffentlichten Kalender.`,
        es: `La última noche programada es el ${fmtDay(s.venues[0].lastScheduled, l)} en ${s.venues[0].name}. Por club: la última noche y lo que queda, según la agenda publicada.`,
        fr: `La dernière soirée programmée est le ${fmtDay(s.venues[0].lastScheduled, l)} au ${s.venues[0].name}. Par club : la dernière soirée et ce qu'il reste, d'après l'agenda publié.`,
      }
    : TITLE
  return pageMetadata({
    locale: l,
    path: 'ibiza-season',
    title: t(META_TITLE, l),
    description: t(desc, l),
  })
}

export default async function IbizaSeasonPage({ params }: { params: { locale: string } }) {
  const l = loc(params.locale)
  const s = await getSeasonStats(params.locale)

  if (!s) {
    return (
      <main className="bg-white text-neutral-900">
        <section className="mx-auto max-w-3xl px-4 pb-24 pt-[calc(var(--nav-h)+64px)]">
          <h1 className="font-serif text-3xl font-black">{t(TITLE, l)}</h1>
        </section>
      </main>
    )
  }

  const questions = faqs(s, l)
  const maandPrijzen = monthPrices(s, l)

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd locale={l} items={[{ name: homeLabel(l), path: '' }, { name: t(TITLE, l) }]} />
      <FaqJsonLd faqs={questions} />
      <DatasetJsonLd
        locale={l}
        path="ibiza-season"
        name={`Ibiza club season dates ${s.from.slice(0, 4)}`}
        description={`Scheduled club nights per venue in Ibiza: first and last published date for ${s.venues.length} clubs, and how many nights each month holds. Read off a live ticketing agenda.`}
        from={s.from}
        to={s.to}
        variable="Scheduled club nights per venue, with first and last published date"
        observations={s.venues.reduce((n, v) => n + v.upcoming, 0)}
        technique="Read off the published agenda of an official ticketing partner; the last date held is not proof a venue closes after it."
      />

      <section className="mx-auto max-w-3xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{t(KICKER, l)}</p>
        <h1 className="mt-3 font-serif text-[2rem] font-black leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
          {t(TITLE, l)}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-800">{answer(s, l)}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_TABLE, l)}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <th scope="col" className="py-2 pr-3 font-black">{t(TH_CLUB, l)}</th>
                <th scope="col" className="py-2 px-3 font-black">{t(TH_LAST, l)}</th>
                <th scope="col" className="py-2 pl-3 text-right font-black">{t(TH_LEFT, l)}</th>
              </tr>
            </thead>
            <tbody>
              {s.venues.map(v => (
                <tr key={v.slug} className="border-b border-black/5">
                  <th scope="row" className="py-2.5 pr-3 font-semibold">
                    <Link href={`/${l}/club-tickets/${v.slug}`} className="flex items-center gap-2.5 text-neutral-900 hover:text-ibiza-green">
                      {/* Vaste doos, zodat een breed en een smal merk dezelfde
                          voetafdruk krijgen en de namen op één lijn blijven. */}
                      {v.logo ? (
                        <span className="relative hidden h-5 w-14 shrink-0 items-center justify-start sm:inline-flex">
                          <img
                            src={v.logo}
                            alt=""
                            aria-hidden
                            className="max-h-full max-w-full object-contain object-left opacity-75 brightness-0"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      ) : null}
                      <span className="underline decoration-black/20 underline-offset-2">{v.name}</span>
                    </Link>
                  </th>
                  <td className="py-2.5 px-3 font-semibold tabular-nums text-ibiza-green">{fmtDay(v.lastScheduled, l)}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums text-neutral-600">{v.upcoming}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Niets renderen buiten het seizoen: dan is de lijst leeg en is een lege
          kop met een lege tabel slechter dan geen sectie. */}
      {s.closings.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-12">
          <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_CLOSINGS, l)}</h2>
          <p className="mt-4 leading-relaxed text-neutral-700">{t(INTRO_CLOSINGS, l)}</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                  <th scope="col" className="py-2 pr-3 font-black">{t(TH_DATE, l)}</th>
                  <th scope="col" className="py-2 px-3 font-black">{t(TH_CLUB, l)}</th>
                  <th scope="col" className="py-2 pl-3 font-black">{t(TH_PARTY, l)}</th>
                </tr>
              </thead>
              <tbody>
                {s.closings.map((c) => (
                  <tr key={`${c.venueSlug}-${c.date}-${c.name}`} className="border-b border-black/5">
                    <th scope="row" className="whitespace-nowrap py-2.5 pr-3 font-semibold">
                      {fmtDay(c.date, l)}
                    </th>
                    <td className="py-2.5 px-3">
                      <Link
                        href={`/${l}/club-tickets/${c.venueSlug}`}
                        className="underline underline-offset-2 hover:text-neutral-500"
                      >
                        {c.venueName}
                      </Link>
                    </td>
                    <td className="py-2.5 pl-3 text-neutral-600">{c.name || t(PLAIN_CLOSING, l)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Per maand: hoeveel er open is én wat het kost ────────────────
          "Wanneer is Ibiza het goedkoopst" is een optelsom die alleen te maken
          is als je de prijzen én de datums hebt, en die hebben we allebei. De
          twee prijskolommen komen uit dezelfde parser als /ibiza-prices, dus
          dezelfde avond levert hier geen ander bedrag op. Wat de agenda niet
          draagt, staat er niet: een maand met te weinig geprijsde avonden
          krijgt een streepje, en de zin erboven zegt zelf hoeveel maanden hij
          overziet. */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_MONTHS, l)}</h2>
        {maandPrijzen && (
          <p className="mt-4 leading-relaxed text-neutral-700">{maandPrijzen}</p>
        )}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <th scope="col" className="py-2 pr-3 font-black">{t(TH_MONTH, l)}</th>
                <th scope="col" className="py-2 px-3 font-black">{t(TH_CLUBS, l)}</th>
                <th scope="col" className="py-2 px-3 text-right font-black">{t(TH_NIGHTS, l)}</th>
                <th scope="col" className="py-2 px-3 text-right font-black">{t(TH_FROM, l)}</th>
                <th scope="col" className="py-2 pl-3 text-right font-black">{t(TH_TYPICAL, l)}</th>
              </tr>
            </thead>
            <tbody>
              {s.months.map(m => (
                <tr key={m.month} className="border-b border-black/5">
                  <th scope="row" className="py-2.5 pr-3 font-semibold">{fmtMonth(m.month, l)}</th>
                  <td className="py-2.5 px-3 tabular-nums">{m.clubs}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-neutral-600">{m.nights}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-neutral-600">
                    {m.low === null ? GEEN_PRIJS : `€${m.low}`}
                  </td>
                  <td className="py-2.5 pl-3 text-right font-black tabular-nums text-ibiza-green">
                    {m.median === null ? GEEN_PRIJS : `€${m.median}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{t(MONTHS_NOTE, l)}</p>
        <p className="mt-4">
          <Link
            href={`/${l}/ibiza-prices`}
            className="font-semibold text-neutral-900 underline decoration-black/25 underline-offset-2 hover:decoration-ibiza-green"
          >
            {t(MONTHS_LINK, l)} →
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(H_CAVEAT, l)}</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">{caveat(l)}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="font-serif text-2xl font-black tracking-tight">{t(FAQ_H, l)}</h2>
        <div className="mt-5 space-y-6">
          {questions.map(f => (
            <div key={f.q}>
              <h3 className="font-serif text-lg font-black leading-snug">{f.q}</h3>
              <p className="mt-1.5 leading-relaxed text-neutral-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <AuthorByline locale={l} topic="the Ibiza club season" />
    </main>
  )
}
