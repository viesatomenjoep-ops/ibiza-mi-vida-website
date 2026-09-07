import { getPriceStats } from '@/lib/price-stats'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Wat een overtocht naar Formentera kost — gemeten, niet geclaimd.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * "Formentera ferry price" is een van de meest getypte zoekopdrachten rond dit
 * eiland, en de pagina die hem moet beantwoorden had nergens een getal staan.
 * Het nachtplan wilde er een aparte URL voor met "vanaf ~€29" erin. Twee dingen
 * mis daarmee: een tweede eigen URL op dezelfde intentie als /ferry-formentera,
 * en een prijs die niemand had bevestigd.
 *
 * Dat hoeft ook niet, want we hebben het antwoord al: de agenda bevat gedateerde
 * overtochten mét prijs, en `getPriceStats()` rekent daar per categorie een
 * minimum en een mediaan uit. Dat is geen marktschatting maar een telling van
 * wat er in ons eigen aanbod staat — en het is een cijfer dat geen enkele
 * concurrent kan leveren.
 *
 * ── De eerlijkheidsgrenzen ────────────────────────────────────────────────
 * `catOf()` in price-stats.ts geeft `null` zodra er te weinig gedateerde
 * overtochten met prijs in de agenda staan. Dan rendert dit component niets,
 * en dat is de goede uitkomst: buiten het seizoen drijft zo'n mediaan op een
 * handvol afvaarten en wordt hij een bewering in plaats van een meting.
 *
 * De prijs is de láágste per overtocht (retour, per persoon, zoals de operator
 * hem publiceert). Wat er wel en niet bij inbegrepen zit verschilt per rederij;
 * dat staat er met zoveel woorden bij in plaats van dat we het gladstrijken.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const HEADING: T = L(
  'Wat een overtocht kost',
  'What a crossing costs',
  'Was eine Überfahrt kostet',
  'Cuánto cuesta la travesía',
  'Combien coûte la traversée',
)

const LABEL_FROM: T = L('Goedkoopste overtocht in de agenda', 'Cheapest crossing in the agenda', 'Günstigste Überfahrt im Kalender', 'Travesía más barata en la agenda', 'Traversée la moins chère de l’agenda')
const LABEL_MEDIAN: T = L('Mediaan', 'Median', 'Median', 'Mediana', 'Médiane')
const NOTE_MEDIAN: T = L(
  'De helft van de afvaarten kost minder dan dit',
  'Half of all departures cost less than this',
  'Die Hälfte aller Abfahrten kostet weniger',
  'La mitad de las salidas cuesta menos',
  'La moitié des départs coûte moins',
)
const PER_PERSON: T = L('per persoon', 'per person', 'pro Person', 'por persona', 'par personne')

/** `${n}` = aantal gedateerde overtochten, `${from}`/`${to}` = periode. */
function intro(l: Locale, n: number, from: string, to: string): string {
  const map: Record<Locale, string> = {
    nl: `Gemeten aan ${n} gedateerde overtochten met prijs in onze eigen agenda, tussen ${from} en ${to}. Dit is geen marktschatting maar een telling van wat er daadwerkelijk te boeken staat. Wat er bij de prijs inbegrepen zit — retour of enkel, havengeld, bagage — verschilt per rederij en staat per afvaart vermeld.`,
    en: `Measured across ${n} dated crossings with a published price in our own agenda, between ${from} and ${to}. This is a count of what is actually bookable rather than a market estimate. What a fare includes — return or single, port fees, luggage — differs per operator and is stated per departure.`,
    de: `Gemessen an ${n} datierten Überfahrten mit Preis in unserem eigenen Kalender, zwischen ${from} und ${to}. Das ist eine Auszählung des tatsächlich buchbaren Angebots, keine Marktschätzung. Was im Preis enthalten ist — Hin- und Rückfahrt oder einfach, Hafengebühren, Gepäck — unterscheidet sich je Reederei und steht pro Abfahrt dabei.`,
    es: `Medido sobre ${n} travesías con fecha y precio publicado en nuestra propia agenda, entre ${from} y ${to}. Es un recuento de lo que se puede reservar de verdad, no una estimación del mercado. Lo que incluye el precio — ida y vuelta o solo ida, tasas portuarias, equipaje — varía según la naviera y se indica en cada salida.`,
    fr: `Mesuré sur ${n} traversées datées avec un prix publié dans notre propre agenda, entre ${from} et ${to}. C’est un décompte de ce qui est réellement réservable, pas une estimation du marché. Ce que le prix comprend — aller-retour ou aller simple, taxes portuaires, bagages — varie selon la compagnie et figure à chaque départ.`,
  }
  return map[l]
}

export async function MeasuredCrossingPrices({ locale }: { locale: string }) {
  const stats = await getPriceStats(locale)
  const cat = stats?.categories.find((c) => c.key === 'formentera-day-trip')
  // Te weinig gedateerde overtochten met prijs: liever niets dan een mediaan
  // die op een handvol afvaarten drijft.
  if (!stats || !cat) return null

  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{HEADING[l]}</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
          {intro(l, cat.n, stats.from, stats.to)}
        </p>

        <div className="mt-7 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[15px]">
            <caption className="sr-only">{HEADING[l]}</caption>
            <tbody className="divide-y divide-black/8 border-y border-black/8">
              <tr>
                <th scope="row" className="py-4 pr-4 align-top font-serif text-[15px] font-bold text-neutral-900">
                  {LABEL_FROM[l]}
                </th>
                <td className="whitespace-nowrap py-4 text-right align-top">
                  <span className="font-serif text-lg font-black text-neutral-900">€{cat.min}</span>
                  <span className="mt-1 block text-[13px] text-neutral-500">{PER_PERSON[l]}</span>
                </td>
              </tr>
              <tr>
                <th scope="row" className="py-4 pr-4 align-top font-serif text-[15px] font-bold text-neutral-900">
                  {LABEL_MEDIAN[l]}
                  <span className="mt-1 block text-[13px] font-normal text-neutral-500">{NOTE_MEDIAN[l]}</span>
                </th>
                <td className="whitespace-nowrap py-4 text-right align-top">
                  <span className="font-serif text-lg font-black text-neutral-900">€{cat.median}</span>
                  <span className="mt-1 block text-[13px] text-neutral-500">{PER_PERSON[l]}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
