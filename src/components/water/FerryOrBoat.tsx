import Link from 'next/link'
import { getPriceStats } from '@/lib/price-stats'
import { FLEET } from '@/data/fleet'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * "Ferry of privéboot naar Formentera?" — met beide bedragen erbij.
 *
 * ── Waarom deze sectie bestaat ────────────────────────────────────────────
 * Iemand die twee dingen vergelijkt staat vlak voor de boeking, en dit is de
 * vergelijking die bij Formentera het vaakst gemaakt wordt. Wij hebben allebei
 * de bedragen in huis — de overtochtprijs uit de agenda, de dagprijs uit onze
 * eigen vloot — en dat is precies wat een pagina die er alleen over schrijft
 * niet kan.
 *
 * ── Waarom het antwoord "de ferry" is, en dat ook zo staat ────────────────
 * De verleiding is om te schrijven dat een boot "met een groep goedkoper
 * uitpakt", want dat verkoopt beter en het staat op half internet. Het klopt
 * alleen niet: de goedkoopste boot in onze vloot komt vol bezet nog altijd op
 * een veelvoud van een ferryticket uit, en dan is de brandstof er niet eens
 * bij. Wie hier "boot is voordeliger" leest en dat gelooft, komt bedrogen uit —
 * en dat is precies het soort belofte dat één seizoen klikken oplevert en
 * daarna een reputatie kost.
 *
 * Dus staat het er andersom: de ferry wint op prijs, altijd, en een boot koopt
 * iets anders (je eigen tijd, de zandbanken, zwemstops, geen retourdeadline).
 * Wie dat wil weten heeft aan een eerlijk antwoord meer dan aan een verkoopzin,
 * en een antwoordmachine citeert de bron die de misvatting oplost.
 *
 * ── Alle getallen afgeleid ────────────────────────────────────────────────
 * De ferryprijs komt uit `getPriceStats()` (categorie `formentera-day-trip`,
 * met het bestemmingsfilter dat strandshuttles eruit houdt). De bootprijs en
 * het aantal gasten komen uit `FLEET`. De prijs per persoon en de verhouding
 * ertussen worden hier uitgerekend, niet overgetypt: wisselt de vloot of de
 * agenda, dan schuift de zin mee.
 *
 * Rendert niets zodra een van de twee kanten ontbreekt. Een vergelijking met
 * één bedrag erin is geen vergelijking.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const HEADING: T = L(
  'Ferry of privéboot naar Formentera?',
  'Ferry or private boat to Formentera?',
  'Fähre oder Privatboot nach Formentera?',
  '¿Ferry o barco privado a Formentera?',
  'Ferry ou bateau privé pour Formentera ?',
)

const H_FERRY: T = L('Neem de ferry als…', 'Take the ferry if…', 'Nimm die Fähre, wenn…', 'Coge el ferry si…', 'Prenez le ferry si…')
const H_BOAT: T = L('Neem een boot als…', 'Take a boat if…', 'Nimm ein Boot, wenn…', 'Coge un barco si…', 'Prenez un bateau si…')

const FERRY_POINTS: T[] = [
  L(
    'Formentera zelf het doel is: het strand, het dorp, een gehuurde scooter.',
    'Formentera itself is the point: the beach, the village, a rented scooter.',
    'Formentera selbst das Ziel ist: der Strand, das Dorf, ein gemieteter Roller.',
    'Formentera es el objetivo: la playa, el pueblo, una moto de alquiler.',
    'Formentera est le but : la plage, le village, un scooter de location.',
  ),
  L(
    'je met minder dan een handvol mensen bent.',
    'you are travelling with fewer than a handful of people.',
    'ihr weniger als eine Handvoll Leute seid.',
    'vais menos de un puñado de personas.',
    'vous êtes moins d’une poignée de personnes.',
  ),
  L(
    'je de dag niet hoeft te plannen — er vaart de hele dag door iets.',
    'you would rather not plan the day — something sails all day.',
    'du den Tag nicht planen willst — es fährt den ganzen Tag etwas.',
    'prefieres no planificar el día — hay salidas durante todo el día.',
    'vous préférez ne rien planifier — il y a des départs toute la journée.',
  ),
]

const BOAT_POINTS: T[] = [
  L(
    'de vaart zelf de dag is, en Formentera de bestemming onderweg.',
    'the sailing is the day, and Formentera the destination along the way.',
    'die Fahrt selbst der Tag ist und Formentera das Ziel unterwegs.',
    'la navegación es el día y Formentera el destino de paso.',
    'la navigation est la journée, et Formentera la destination en chemin.',
  ),
  L(
    'je bij de zandbanken wilt zwemmen waar geen ferry komt.',
    'you want to swim at the sandbanks no ferry reaches.',
    'du an den Sandbänken schwimmen willst, wo keine Fähre hinkommt.',
    'quieres bañarte en los bancos de arena a los que no llega el ferry.',
    'vous voulez nager aux bancs de sable qu’aucun ferry n’atteint.',
  ),
  L(
    'je zelf wilt bepalen wanneer je terugvaart.',
    'you want to decide yourself when you head back.',
    'du selbst bestimmen willst, wann es zurückgeht.',
    'quieres decidir tú cuándo volver.',
    'vous voulez choisir vous-même l’heure du retour.',
  ),
]

const FLEET_LINK: T = L(
  'Onze boten, met dagprijs en beschikbaarheid',
  'Our boats, with day rate and availability',
  'Unsere Boote, mit Tagespreis und Verfügbarkeit',
  'Nuestros barcos, con precio por día y disponibilidad',
  'Nos bateaux, avec tarif journalier et disponibilité',
)

export async function FerryOrBoat({ locale }: { locale: string }) {
  const stats = await getPriceStats(locale)
  const ferry = stats?.categories.find((c) => c.key === 'formentera-day-trip')

  const geprijsd = FLEET.filter((b) => b?.price?.low > 0 && b.pax > 0)
  const boot = geprijsd.length
    ? [...geprijsd].sort((a, b) => a.price.low - b.price.low)[0]
    : null

  // Eén kant zonder bedrag is geen vergelijking.
  if (!ferry || !boot) return null

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  const perPersoon = Math.round(boot.price.low / boot.pax)
  // Hoeveel keer een ferryticket. Naar beneden afgerond en als "ruim" gebracht,
  // zodat de zin klopt zolang de verhouding niet ónder dit getal zakt.
  const factor = Math.max(2, Math.floor(perPersoon / ferry.median))

  const antwoord: T = L(
    `Op prijs wint de ferry, en niet nipt. Een overtocht kost doorgaans €${ferry.median} per persoon, met €${ferry.min} als goedkoopste in de agenda. De goedkoopste boot in onze eigen vloot is €${boot.price.low} per dag voor ${boot.pax} gasten — vol bezet ongeveer €${perPersoon} per persoon, en dan is de brandstof er nog niet bij. Dat is ruim ${factor} keer een ferryticket, en de kleinste boten zijn ook niet de boten waarmee je die overtocht maakt. Een privéboot is dus geen goedkopere ferry; het is een andere dag.`,
    `On price the ferry wins, and not narrowly. A crossing typically costs €${ferry.median} per person, with €${ferry.min} as the cheapest in the agenda. The cheapest boat in our own fleet is €${boot.price.low} a day for ${boot.pax} guests — filled to capacity roughly €${perPersoon} each, and that is before fuel. That is more than ${factor} times a ferry fare, and the smallest boats are not the ones you would take on that crossing anyway. A private boat is not a cheaper ferry; it is a different day.`,
    `Beim Preis gewinnt die Fähre, und zwar deutlich. Eine Überfahrt kostet typischerweise €${ferry.median} pro Person, die günstigste im Kalender €${ferry.min}. Das günstigste Boot unserer eigenen Flotte kostet €${boot.price.low} pro Tag für ${boot.pax} Gäste — voll besetzt rund €${perPersoon} pro Person, und der Kraftstoff kommt noch dazu. Das ist mehr als das ${factor}-Fache eines Fährtickets, und die kleinsten Boote sind ohnehin nicht die, mit denen man diese Überfahrt macht. Ein Privatboot ist also keine günstigere Fähre, sondern ein anderer Tag.`,
    `En precio gana el ferry, y no por poco. Una travesía cuesta normalmente €${ferry.median} por persona, con €${ferry.min} como la más barata de la agenda. El barco más barato de nuestra flota son €${boot.price.low} al día para ${boot.pax} invitados — a plena ocupación, unos €${perPersoon} por persona, y el combustible va aparte. Es más de ${factor} veces un billete de ferry, y los barcos más pequeños tampoco son los que harían esa travesía. Un barco privado no es un ferry más barato: es otro día.`,
    `Sur le prix, le ferry gagne, et pas de peu. Une traversée coûte généralement €${ferry.median} par personne, la moins chère de l’agenda €${ferry.min}. Le bateau le moins cher de notre flotte est à €${boot.price.low} la journée pour ${boot.pax} invités — à pleine capacité, environ €${perPersoon} par personne, carburant non compris. C’est plus de ${factor} fois un billet de ferry, et les plus petits bateaux ne sont de toute façon pas ceux qu’on prend pour cette traversée. Un bateau privé n’est donc pas un ferry moins cher : c’est une autre journée.`,
  )

  const kolom = (kop: string, punten: T[]) => (
    <div className="rounded-2xl border border-black/8 bg-neutral-50 p-5">
      <h3 className="font-serif text-base font-black leading-snug text-neutral-900">{kop}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {punten.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700">
            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>{p[l]}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{HEADING[l]}</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">{antwoord[l]}</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {kolom(H_FERRY[l], FERRY_POINTS)}
          {kolom(H_BOAT[l], BOAT_POINTS)}
        </div>
        <p className="mt-5">
          <Link
            href={`/${l}/private-boat-charters`}
            className="font-semibold text-neutral-900 underline decoration-black/25 underline-offset-2 hover:decoration-ibiza-green"
          >
            {FLEET_LINK[l]} →
          </Link>
        </p>
      </div>
    </section>
  )
}
