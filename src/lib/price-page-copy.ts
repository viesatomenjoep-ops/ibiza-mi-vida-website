import type { PriceStats } from '@/lib/price-stats'
import { localeTag } from '@/lib/date-label'

/**
 * Copy for the Ibiza price page, in five languages.
 *
 * Every sentence that carries a number takes it from PriceStats rather than
 * hardcoding it, so the prose cannot drift away from the table underneath it.
 * The opening paragraph is written to be lifted verbatim: one claim per
 * sentence, the figure and its scope in the same sentence, and the caveat
 * ("ticket prices only") attached rather than buried three paragraphs down.
 * An answer engine quoting half of a hedged sentence should still be quoting
 * something true.
 */

type L = Record<string, string>
const pick = (m: L, l: string) => m[l] || m.en

const euro = (n: number) => `€${n}`

function longDate(iso: string, locale: string): string {
  const [y, m, d] = String(iso || '').split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(localeTag(locale), {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

export const KICKER: L = {
  nl: 'Wat kost het echt', en: 'What it actually costs', de: 'Was es wirklich kostet',
  es: 'Lo que cuesta de verdad', fr: 'Ce que ça coûte vraiment',
}

export const TITLE: L = {
  nl: 'Wat kost een avond uit op Ibiza?',
  en: 'What does a night out in Ibiza cost?',
  de: 'Was kostet ein Abend auf Ibiza?',
  es: '¿Cuánto cuesta una noche en Ibiza?',
  fr: 'Combien coûte une soirée à Ibiza ?',
}

export const META_TITLE: L = {
  nl: 'Wat kost een avond uit op Ibiza? Echte ticketprijzen per club',
  en: 'What does a night out in Ibiza cost? Real ticket prices per club',
  de: 'Was kostet ein Abend auf Ibiza? Echte Ticketpreise pro Club',
  es: '¿Cuánto cuesta una noche en Ibiza? Precios reales por club',
  fr: 'Combien coûte une soirée à Ibiza ? Prix réels par club',
}

export function metaDescription(s: PriceStats, l: string): string {
  const m: L = {
    nl: `Entree voor een club op Ibiza kost ${euro(s.clubMin)} tot ${euro(s.clubMax)}; het goedkoopste ticket is doorgaans ${euro(s.clubMedian)}. Gemeten aan ${s.clubN} clubavonden, met de mediaan per club.`,
    en: `Club entry in Ibiza costs ${euro(s.clubMin)} to ${euro(s.clubMax)}; the typical cheapest ticket is ${euro(s.clubMedian)}. Measured across ${s.clubN} club nights, with the median for each venue.`,
    de: `Clubeintritt auf Ibiza kostet ${euro(s.clubMin)} bis ${euro(s.clubMax)}; das günstigste Ticket liegt typischerweise bei ${euro(s.clubMedian)}. Gemessen an ${s.clubN} Clubnächten, mit Median je Club.`,
    es: `La entrada a un club en Ibiza cuesta entre ${euro(s.clubMin)} y ${euro(s.clubMax)}; la entrada más barata suele ser de ${euro(s.clubMedian)}. Medido sobre ${s.clubN} noches, con la mediana por local.`,
    fr: `L'entrée en club à Ibiza coûte de ${euro(s.clubMin)} à ${euro(s.clubMax)} ; le billet le moins cher est généralement de ${euro(s.clubMedian)}. Mesuré sur ${s.clubN} soirées, avec la médiane par établissement.`,
  }
  return pick(m, l)
}

/** The answer, first thing on the page. Written to be quoted as-is. */
export function answer(s: PriceStats, l: string): string {
  const venues = s.venues.length
  const from = longDate(s.from, l)
  const to = longDate(s.to, l)
  const m: L = {
    nl: `Entree voor een club op Ibiza kost ${euro(s.clubMin)} tot ${euro(s.clubMax)}, en het goedkoopste ticket is doorgaans ${euro(s.clubMedian)}. De helft van alle clubavonden zit tussen ${euro(s.clubQ1)} en ${euro(s.clubQ3)}. Dit zijn uitsluitend ticketprijzen: drankjes, tafels en vervoer zitten er niet bij. De cijfers komen uit ${s.clubN} gedateerde clubevents bij ${venues} venues in ons eigen boekingssysteem, over de periode ${from} tot ${to}.`,
    en: `Club entry in Ibiza costs ${euro(s.clubMin)} to ${euro(s.clubMax)}, and the typical cheapest ticket is ${euro(s.clubMedian)}. Half of all club nights fall between ${euro(s.clubQ1)} and ${euro(s.clubQ3)}. These are ticket prices only: drinks, tables and transport are not included. The figures come from ${s.clubN} dated club events across ${venues} venues in our own booking system, covering ${from} to ${to}.`,
    de: `Clubeintritt auf Ibiza kostet ${euro(s.clubMin)} bis ${euro(s.clubMax)}, das günstigste Ticket liegt typischerweise bei ${euro(s.clubMedian)}. Die Hälfte aller Clubnächte liegt zwischen ${euro(s.clubQ1)} und ${euro(s.clubQ3)}. Das sind reine Ticketpreise: Getränke, Tische und Transport sind nicht enthalten. Die Zahlen stammen aus ${s.clubN} datierten Clubevents in ${venues} Locations in unserem eigenen Buchungssystem, im Zeitraum ${from} bis ${to}.`,
    es: `La entrada a un club en Ibiza cuesta entre ${euro(s.clubMin)} y ${euro(s.clubMax)}, y la entrada más barata suele costar ${euro(s.clubMedian)}. La mitad de las noches se sitúan entre ${euro(s.clubQ1)} y ${euro(s.clubQ3)}. Son solo precios de entrada: bebidas, mesas y transporte no están incluidos. Las cifras proceden de ${s.clubN} eventos con fecha en ${venues} locales de nuestro propio sistema de reservas, del ${from} al ${to}.`,
    fr: `L'entrée en club à Ibiza coûte de ${euro(s.clubMin)} à ${euro(s.clubMax)}, et le billet le moins cher est généralement de ${euro(s.clubMedian)}. La moitié des soirées se situent entre ${euro(s.clubQ1)} et ${euro(s.clubQ3)}. Ce sont uniquement des prix de billet : boissons, tables et transport ne sont pas inclus. Les chiffres proviennent de ${s.clubN} événements datés dans ${venues} établissements de notre propre système de réservation, du ${from} au ${to}.`,
  }
  return pick(m, l)
}

export const H_VENUES: L = {
  nl: 'Ticketprijs per club', en: 'Ticket price per club', de: 'Ticketpreis pro Club',
  es: 'Precio de entrada por club', fr: 'Prix du billet par club',
}
export const H_CATEGORIES: L = {
  nl: 'En de rest van het eiland', en: 'And the rest of the island',
  de: 'Und der Rest der Insel', es: 'Y el resto de la isla', fr: "Et le reste de l'île",
}
export const H_NOT_INCLUDED: L = {
  nl: 'Wat er níét in zit', en: 'What is not included',
  de: 'Was nicht enthalten ist', es: 'Lo que no está incluido', fr: "Ce qui n'est pas inclus",
}
export const H_METHOD: L = {
  nl: 'Hoe we dit meten', en: 'How we measure this', de: 'Wie wir das messen',
  es: 'Cómo lo medimos', fr: 'Comment nous mesurons',
}

export const FROM_LABEL: L = {
  nl: 'vanaf', en: 'from', de: 'ab', es: 'desde', fr: 'dès',
}

export const TH_VENUE: L = { nl: 'Club', en: 'Club', de: 'Club', es: 'Club', fr: 'Club' }
export const TH_TYPICAL: L = {
  nl: 'Meestal', en: 'Typical', de: 'Üblich', es: 'Habitual', fr: 'Habituel',
}
export const TH_RANGE: L = {
  nl: 'Bereik', en: 'Range', de: 'Spanne', es: 'Rango', fr: 'Fourchette',
}
export const TH_DATES: L = {
  nl: 'Avonden', en: 'Nights', de: 'Nächte', es: 'Noches', fr: 'Soirées',
}

export const CATEGORY_LABEL: Record<string, L> = {
  clubbing: { nl: 'Clubentree', en: 'Club entry', de: 'Clubeintritt', es: 'Entrada a club', fr: 'Entrée en club' },
  boat: { nl: 'Boottocht & boat party', en: 'Boat trip & boat party', de: 'Bootstour & Boat Party', es: 'Excursión en barco y boat party', fr: 'Sortie en bateau & boat party' },
  'formentera-day-trip': { nl: 'Ferry naar Formentera', en: 'Ferry to Formentera', de: 'Fähre nach Formentera', es: 'Ferry a Formentera', fr: 'Ferry pour Formentera' },
  activities: { nl: 'Activiteiten & excursies', en: 'Activities & excursions', de: 'Aktivitäten & Ausflüge', es: 'Actividades y excursiones', fr: 'Activités & excursions' },
}

export function notIncluded(l: string): string {
  const m: L = {
    nl: 'Deze pagina telt ticketprijzen, want dat is de data die wij hebben. Een echte avond kost meer: drankjes aan de bar, een taxi terug, en een tafel als je die wilt. Voor die posten publiceren we bewust geen bedragen — we meten ze niet, en een geloofwaardig ogende schatting wordt later als feit teruggeciteerd. Vraag het ons via WhatsApp en we vertellen je wat een specifieke avond werkelijk kost.',
    en: 'This page counts ticket prices, because that is the data we hold. A real evening costs more: drinks at the bar, a taxi back, and a table if you want one. We deliberately publish no figures for those — we do not measure them, and a plausible-looking guess gets quoted back as fact. Ask us on WhatsApp and we will tell you what a specific night actually runs to.',
    de: 'Diese Seite zählt Ticketpreise, denn das sind die Daten, die wir haben. Ein echter Abend kostet mehr: Getränke an der Bar, ein Taxi zurück und ein Tisch, wenn du einen willst. Dafür veröffentlichen wir bewusst keine Zahlen — wir messen sie nicht, und eine plausibel wirkende Schätzung wird später als Tatsache zitiert. Frag uns über WhatsApp, dann sagen wir dir, was ein konkreter Abend wirklich kostet.',
    es: 'Esta página cuenta precios de entrada, porque son los datos que tenemos. Una noche real cuesta más: copas en la barra, un taxi de vuelta y una mesa si la quieres. Para esos conceptos no publicamos cifras a propósito: no los medimos, y una estimación con buena pinta acaba citándose como un hecho. Pregúntanos por WhatsApp y te decimos lo que cuesta de verdad una noche concreta.',
    fr: "Cette page compte des prix de billets, car ce sont les données dont nous disposons. Une vraie soirée coûte davantage : les consommations au bar, un taxi au retour, et une table si vous en voulez une. Nous ne publions volontairement aucun chiffre pour ces postes : nous ne les mesurons pas, et une estimation crédible finit par être citée comme un fait. Demandez-nous sur WhatsApp et nous vous dirons ce que coûte réellement une soirée précise.",
  }
  return pick(m, l)
}

export function method(s: PriceStats, l: string): string {
  const from = longDate(s.from, l)
  const to = longDate(s.to, l)
  const m: L = {
    nl: `Alle bedragen komen uit de live agenda van onze ticketpartner: ${s.total} gedateerde events met een prijs, van ${from} tot ${to}. De feed geeft prijzen als bereik ("40 € - 50 €"); wij nemen de onderkant, want dat is wat "wat kost het om binnen te komen" betekent. De bovenkant is meestal een VIP- of tafelproduct en staat in de kolom Bereik. We rapporteren de mediaan en niet het gemiddelde, omdat een handvol tafels van duizend euro een gemiddelde ergens brengt waar geen bezoeker zich in herkent. Clubs met minder dan tien avonden in de data krijgen geen eigen regel${s.venuesOmitted > 0 ? ` (${s.venuesOmitted} nu niet getoond)` : ''}. De mediaan hierboven telt elke speeldatum apart, want de vraag is wat je betaalt op een willekeurige avond. Tel je elke residency eenmaal, ongeacht hoe vaak hij draait, dan komt de mediaan op ${euro(s.clubMedianByEvent)} over ${s.clubEvents} residencies — een ander cijfer omdat het een andere vraag beantwoordt, en daarom staan ze allebei genoemd. Deze pagina rekent zichzelf opnieuw uit zodra de agenda verandert.`,
    en: `All figures come from our ticketing partner's live agenda: ${s.total} dated events carrying a price, from ${from} to ${to}. The feed gives prices as ranges ("40 € - 50 €"); we take the low end, because that is what "what does it cost to get in" means. The high end is usually a VIP or table product and appears in the Range column. We report the median rather than the mean, because a handful of thousand-euro tables drags an average somewhere no visitor recognises. Clubs with fewer than ten nights in the data get no row of their own${s.venuesOmitted > 0 ? ` (${s.venuesOmitted} currently held back)` : ''}. The median above counts every playing date separately, because the question is what you pay on a night picked at random. Count each residency once instead, however often it runs, and the median comes to ${euro(s.clubMedianByEvent)} across ${s.clubEvents} residencies — a different figure because it answers a different question, which is why both are stated. This page recalculates itself whenever the agenda changes.`,
    de: `Alle Beträge stammen aus dem Live-Kalender unseres Ticketpartners: ${s.total} datierte Events mit Preis, von ${from} bis ${to}. Der Feed liefert Preise als Spanne ("40 € - 50 €"); wir nehmen den unteren Wert, denn das meint die Frage "was kostet der Eintritt". Der obere Wert ist meist ein VIP- oder Tischprodukt und steht in der Spalte Spanne. Wir nennen den Median statt des Durchschnitts, weil einige Tische zu tausend Euro einen Mittelwert dorthin ziehen, wo ihn kein Besucher wiedererkennt. Clubs mit weniger als zehn Nächten in den Daten bekommen keine eigene Zeile${s.venuesOmitted > 0 ? ` (${s.venuesOmitted} derzeit nicht gezeigt)` : ''}. Der Median oben zählt jeden Spieltag einzeln, denn die Frage ist, was du an einem zufällig gewählten Abend zahlst. Zählt man jede Residency einmal, unabhängig davon wie oft sie läuft, liegt der Median bei ${euro(s.clubMedianByEvent)} über ${s.clubEvents} Residencies — eine andere Zahl, weil sie eine andere Frage beantwortet, deshalb stehen beide da. Diese Seite berechnet sich neu, sobald sich der Kalender ändert.`,
    es: `Todas las cifras proceden de la agenda en directo de nuestro socio de entradas: ${s.total} eventos con fecha y precio, del ${from} al ${to}. El feed da los precios como rango ("40 € - 50 €"); tomamos el extremo bajo, porque es lo que significa "cuánto cuesta entrar". El extremo alto suele ser un producto VIP o de mesa y aparece en la columna Rango. Damos la mediana y no la media, porque unas pocas mesas de mil euros llevan el promedio a un lugar que ningún visitante reconoce. Los clubs con menos de diez noches en los datos no tienen fila propia${s.venuesOmitted > 0 ? ` (${s.venuesOmitted} ahora mismo fuera)` : ''}. La mediana de arriba cuenta cada fecha por separado, porque la pregunta es qué pagas una noche cualquiera. Si cuentas cada residencia una sola vez, sin importar cuántas veces se celebre, la mediana queda en ${euro(s.clubMedianByEvent)} sobre ${s.clubEvents} residencias — otra cifra porque responde a otra pregunta, y por eso están las dos. Esta página se recalcula sola cuando cambia la agenda.`,
    fr: `Tous les montants proviennent de l'agenda en direct de notre partenaire billetterie : ${s.total} événements datés avec un prix, du ${from} au ${to}. Le flux donne les prix sous forme de fourchette (« 40 € - 50 € ») ; nous retenons la borne basse, car c'est ce que signifie « combien coûte l'entrée ». La borne haute est généralement un produit VIP ou table et figure dans la colonne Fourchette. Nous indiquons la médiane et non la moyenne, car quelques tables à mille euros emmènent une moyenne là où aucun visiteur ne se reconnaît. Les clubs comptant moins de dix soirées dans les données n'ont pas de ligne propre${s.venuesOmitted > 0 ? ` (${s.venuesOmitted} actuellement écartés)` : ''}. La médiane ci-dessus compte chaque date séparément, car la question est ce que vous payez un soir pris au hasard. En comptant chaque résidence une seule fois, quel que soit son nombre de dates, la médiane s'établit à ${euro(s.clubMedianByEvent)} sur ${s.clubEvents} résidences — un autre chiffre parce qu'il répond à une autre question, d'où la mention des deux. Cette page se recalcule dès que l'agenda change.`,
  }
  return pick(m, l)
}

/** FAQs built from the same numbers as the page body, so the two cannot diverge. */
export function faqs(s: PriceStats, l: string): { q: string; a: string }[] {
  const cheapest = s.venues[s.venues.length - 1]
  const dearest = s.venues[0]
  const cat = (k: string) => s.categories.find(c => c.key === k)
  const boat = cat('boat')
  const ferry = cat('formentera-day-trip')
  const act = cat('activities')
  const from = longDate(s.from, l)
  const to = longDate(s.to, l)

  const out: { q: string; a: string }[] = []
  const add = (q: L, a: L) => out.push({ q: pick(q, l), a: pick(a, l) })

  add(
    {
      nl: 'Hoeveel kost entree voor een club op Ibiza?',
      en: 'How much does it cost to get into a club in Ibiza?',
      de: 'Wie viel kostet der Eintritt in einen Club auf Ibiza?',
      es: '¿Cuánto cuesta entrar en un club en Ibiza?',
      fr: "Combien coûte l'entrée en club à Ibiza ?",
    },
    {
      nl: `Het goedkoopste ticket is doorgaans ${euro(s.clubMedian)}. De helft van alle clubavonden zit tussen ${euro(s.clubQ1)} en ${euro(s.clubQ3)}, met een totaalbereik van ${euro(s.clubMin)} tot ${euro(s.clubMax)}. Gemeten aan ${s.clubN} gedateerde clubevents.`,
      en: `The typical cheapest ticket is ${euro(s.clubMedian)}. Half of all club nights fall between ${euro(s.clubQ1)} and ${euro(s.clubQ3)}, with a full range of ${euro(s.clubMin)} to ${euro(s.clubMax)}. Measured across ${s.clubN} dated club events.`,
      de: `Das günstigste Ticket liegt typischerweise bei ${euro(s.clubMedian)}. Die Hälfte aller Clubnächte liegt zwischen ${euro(s.clubQ1)} und ${euro(s.clubQ3)}, die Gesamtspanne reicht von ${euro(s.clubMin)} bis ${euro(s.clubMax)}. Gemessen an ${s.clubN} datierten Clubevents.`,
      es: `La entrada más barata suele costar ${euro(s.clubMedian)}. La mitad de las noches se sitúan entre ${euro(s.clubQ1)} y ${euro(s.clubQ3)}, con un rango total de ${euro(s.clubMin)} a ${euro(s.clubMax)}. Medido sobre ${s.clubN} eventos con fecha.`,
      fr: `Le billet le moins cher est généralement de ${euro(s.clubMedian)}. La moitié des soirées se situent entre ${euro(s.clubQ1)} et ${euro(s.clubQ3)}, pour une fourchette totale de ${euro(s.clubMin)} à ${euro(s.clubMax)}. Mesuré sur ${s.clubN} événements datés.`,
    },
  )

  if (cheapest && dearest && cheapest.slug !== dearest.slug) {
    add(
      {
        nl: 'Welke club op Ibiza is het goedkoopst?',
        en: 'Which club in Ibiza is the cheapest?',
        de: 'Welcher Club auf Ibiza ist am günstigsten?',
        es: '¿Qué club de Ibiza es el más barato?',
        fr: 'Quel club est le moins cher à Ibiza ?',
      },
      {
        nl: `Van de clubs met genoeg avonden in onze agenda heeft ${cheapest.name} de laagste mediaan: ${euro(cheapest.median)}. Aan de andere kant staat ${dearest.name} met ${euro(dearest.median)}. Prijzen verschillen per avond en per line-up, dus dit is een middenwaarde en geen vaste prijs.`,
        en: `Of the clubs with enough nights in our agenda, ${cheapest.name} has the lowest median at ${euro(cheapest.median)}. At the other end sits ${dearest.name} at ${euro(dearest.median)}. Prices vary by night and by line-up, so this is a midpoint rather than a fixed price.`,
        de: `Unter den Clubs mit genügend Nächten in unserem Kalender hat ${cheapest.name} den niedrigsten Median: ${euro(cheapest.median)}. Am anderen Ende steht ${dearest.name} mit ${euro(dearest.median)}. Preise schwanken je Abend und Line-up, das ist also ein Mittelwert und kein Festpreis.`,
        es: `Entre los clubs con suficientes noches en nuestra agenda, ${cheapest.name} tiene la mediana más baja: ${euro(cheapest.median)}. En el otro extremo está ${dearest.name} con ${euro(dearest.median)}. Los precios varían por noche y por cartel, así que es un valor central y no un precio fijo.`,
        fr: `Parmi les clubs comptant assez de soirées dans notre agenda, ${cheapest.name} affiche la médiane la plus basse : ${euro(cheapest.median)}. À l'autre extrémité, ${dearest.name} à ${euro(dearest.median)}. Les prix varient selon la soirée et le line-up : c'est une valeur centrale, pas un tarif fixe.`,
      },
    )
  }

  if (boat && ferry) {
    add(
      {
        nl: 'Wat kost een boottocht of de ferry naar Formentera?',
        en: 'What does a boat trip or the Formentera ferry cost?',
        de: 'Was kostet eine Bootstour oder die Fähre nach Formentera?',
        es: '¿Cuánto cuesta una excursión en barco o el ferry a Formentera?',
        fr: 'Combien coûte une sortie en bateau ou le ferry pour Formentera ?',
      },
      {
        nl: `Een boottocht of boat party begint doorgaans rond ${euro(boat.median)}, met de goedkoopste vanaf ${euro(boat.min)}. De ferry naar Formentera zit doorgaans rond ${euro(ferry.median)}, vanaf ${euro(ferry.min)}. Gemeten aan ${boat.n} respectievelijk ${ferry.n} gedateerde afvaarten.`,
        en: `A boat trip or boat party typically starts around ${euro(boat.median)}, with the cheapest from ${euro(boat.min)}. The Formentera ferry typically sits around ${euro(ferry.median)}, from ${euro(ferry.min)}. Measured across ${boat.n} and ${ferry.n} dated departures respectively.`,
        de: `Eine Bootstour oder Boat Party beginnt typischerweise bei rund ${euro(boat.median)}, die günstigsten ab ${euro(boat.min)}. Die Fähre nach Formentera liegt typischerweise bei rund ${euro(ferry.median)}, ab ${euro(ferry.min)}. Gemessen an ${boat.n} bzw. ${ferry.n} datierten Abfahrten.`,
        es: `Una excursión en barco o boat party suele partir de unos ${euro(boat.median)}, y las más baratas desde ${euro(boat.min)}. El ferry a Formentera ronda los ${euro(ferry.median)}, desde ${euro(ferry.min)}. Medido sobre ${boat.n} y ${ferry.n} salidas con fecha respectivamente.`,
        fr: `Une sortie en bateau ou boat party démarre généralement autour de ${euro(boat.median)}, les moins chères dès ${euro(boat.min)}. Le ferry pour Formentera tourne autour de ${euro(ferry.median)}, dès ${euro(ferry.min)}. Mesuré sur respectivement ${boat.n} et ${ferry.n} départs datés.`,
      },
    )
  }

  if (act) {
    add(
      {
        nl: 'Wat kosten activiteiten zoals buggy, quad of jetski?',
        en: 'What do activities like buggy, quad or jet ski cost?',
        de: 'Was kosten Aktivitäten wie Buggy, Quad oder Jetski?',
        es: '¿Cuánto cuestan actividades como buggy, quad o moto de agua?',
        fr: 'Combien coûtent les activités comme buggy, quad ou jet-ski ?',
      },
      {
        nl: `Activiteiten en excursies liggen doorgaans rond ${euro(act.median)}, met de goedkoopste vanaf ${euro(act.min)}. Dat is een brede categorie — een grottour en een privé-buggytour van een halve dag staan er allebei in — dus kijk naar de losse aanbieder voor de prijs die voor jou geldt. Gemeten aan ${act.n} gedateerde activiteiten.`,
        en: `Activities and excursions typically sit around ${euro(act.median)}, with the cheapest from ${euro(act.min)}. It is a broad category — a cave tour and a half-day private buggy tour both sit in it — so check the individual operator for the price that applies to you. Measured across ${act.n} dated activities.`,
        de: `Aktivitäten und Ausflüge liegen typischerweise bei rund ${euro(act.median)}, die günstigsten ab ${euro(act.min)}. Das ist eine breite Kategorie — eine Höhlentour und eine halbtägige private Buggy-Tour stehen beide darin — schau also beim einzelnen Anbieter nach dem für dich geltenden Preis. Gemessen an ${act.n} datierten Aktivitäten.`,
        es: `Las actividades y excursiones rondan los ${euro(act.median)}, y las más baratas desde ${euro(act.min)}. Es una categoría amplia — una visita a una cueva y un tour privado en buggy de medio día están las dos dentro — así que consulta cada proveedor para el precio que te aplica. Medido sobre ${act.n} actividades con fecha.`,
        fr: `Les activités et excursions tournent autour de ${euro(act.median)}, les moins chères dès ${euro(act.min)}. C'est une catégorie large — une visite de grotte et un tour privé en buggy d'une demi-journée y figurent toutes deux — consultez donc chaque prestataire pour le prix qui vous concerne. Mesuré sur ${act.n} activités datées.`,
      },
    )
  }

  add(
    {
      nl: 'Zitten drankjes bij de ticketprijs in?',
      en: 'Are drinks included in the ticket price?',
      de: 'Sind Getränke im Ticketpreis enthalten?',
      es: '¿Las bebidas están incluidas en la entrada?',
      fr: 'Les boissons sont-elles comprises dans le billet ?',
    },
    {
      nl: 'Nee. Alle bedragen op deze pagina zijn alleen entree. Drankjes, tafels en vervoer komen daar bovenop. We publiceren bewust geen schatting voor die posten, omdat we ze niet meten.',
      en: 'No. Every figure on this page is entry only. Drinks, tables and transport come on top. We deliberately publish no estimate for those, because we do not measure them.',
      de: 'Nein. Alle Beträge auf dieser Seite sind reiner Eintritt. Getränke, Tische und Transport kommen dazu. Für diese Posten veröffentlichen wir bewusst keine Schätzung, weil wir sie nicht messen.',
      es: 'No. Todas las cifras de esta página son solo entrada. Bebidas, mesas y transporte van aparte. No publicamos ninguna estimación de esos conceptos a propósito, porque no los medimos.',
      fr: "Non. Tous les montants de cette page correspondent à l'entrée seule. Boissons, tables et transport viennent en plus. Nous ne publions volontairement aucune estimation pour ces postes, car nous ne les mesurons pas.",
    },
  )

  add(
    {
      nl: 'Veranderen de prijzen door het seizoen heen?',
      en: 'Do prices change through the season?',
      de: 'Ändern sich die Preise im Saisonverlauf?',
      es: '¿Cambian los precios a lo largo de la temporada?',
      fr: 'Les prix changent-ils au fil de la saison ?',
    },
    {
      nl: `Onze data loopt van ${from} tot ${to}, en over die periode zien we geen groot verschil in de mediaan. Dat is te kort om iets te zeggen over hoogzomer versus voor- of naseizoen, dus dat doen we ook niet. Zodra de agenda verder vooruit loopt, rekent deze pagina het opnieuw uit.`,
      en: `Our data runs from ${from} to ${to}, and across that window we see no large shift in the median. That is too short a window to say anything about peak summer versus shoulder season, so we do not. As the agenda extends further ahead, this page recalculates.`,
      de: `Unsere Daten laufen von ${from} bis ${to}, und in diesem Fenster sehen wir keine große Verschiebung des Medians. Das ist zu kurz, um etwas über Hochsommer gegenüber Vor- und Nachsaison zu sagen, also tun wir es nicht. Sobald der Kalender weiter reicht, rechnet diese Seite neu.`,
      es: `Nuestros datos van del ${from} al ${to} y en esa ventana no vemos un cambio grande en la mediana. Es un periodo demasiado corto para decir nada sobre pleno verano frente a temporada media, así que no lo hacemos. Cuando la agenda se extienda, esta página se recalcula.`,
      fr: `Nos données vont du ${from} au ${to}, et sur cette fenêtre nous ne voyons pas d'écart important sur la médiane. C'est une période trop courte pour dire quoi que ce soit sur le plein été face à l'avant ou l'arrière-saison, donc nous nous en abstenons. Dès que l'agenda s'étendra, cette page se recalculera.`,
    },
  )

  return out
}
