import Link from 'next/link'
import { FLEET, dossierHref, type Boat } from '@/data/fleet'
import { boatLabel } from '@/lib/fleet-stats'
import { localeTag } from '@/lib/date-label'
import type { Locale } from '@/lib/seo'

/**
 * "Welke boot kun je op Ibiza huren voor minder dan €1000 per dag?"
 *
 * ── Waarom deze sectie bestaat ────────────────────────────────────────────
 * "Goedkoopste boot huren Ibiza" en "boot huren Ibiza prijs" zijn eigen
 * zoekopdrachten, en het antwoord stond wél in huis maar nergens als antwoord:
 * het getal zat als losse zin in een FAQ op /private-boat-charters ("van onze
 * 94 boten liggen er 6 onder €1000"). Een aantal is geen antwoord — de vraag
 * is wélke, voor hoeveel mensen en uit welke haven.
 *
 * ── Waarom niets hier is overgetypt ───────────────────────────────────────
 * De lijst, het aantal, de vanafprijs, het gastenbereik en de havens komen
 * allemaal uit FLEET. Een boot erbij of een tarief eraf en de sectie schuift
 * mee; een gekopieerd rijtje zou stil achterlopen op de broker. Dat is precies
 * de fout die hier eerder met de vanaf-prijs op de homepage gemaakt is.
 *
 * ── Waarom twee prijskolommen en geen één ─────────────────────────────────
 * De vlootkaarten tonen bewust één prijs, die van de gekozen datum. Hier is
 * geen datum: dit is de vraag "wat kost het" in het algemeen. Dan is één
 * bedrag zonder seizoen misleidend — dezelfde boot kost in augustus meer — dus
 * staan de twee banden naast elkaar met de maanden erboven. Beide komen uit
 * price.low en price.high; er wordt niets tussenin geschat.
 *
 * ── Geen eigen FAQ-schema ─────────────────────────────────────────────────
 * /boats zendt al één FAQPage uit via <SchemaMarkup> in de verhuurgids. Een
 * tweede FAQPage op dezelfde URL is geen extra zichtbaarheid maar een
 * conflict, dus dit blok is zichtbare tekst met een vraag als kop en verder
 * niets.
 */

/** De drempel waaronder een boot in dit lijstje valt. Bewust een rond bedrag:
 *  het is de grens waarop mensen zoeken, niet een grens in de data. */
const DREMPEL = 1000

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const HEADING = (bedrag: string): T => L(
  `Welke boot kun je op Ibiza huren voor minder dan ${bedrag} per dag?`,
  `Which boats can you rent in Ibiza for under ${bedrag} a day?`,
  `Welches Boot kannst du auf Ibiza für unter ${bedrag} pro Tag mieten?`,
  `¿Qué barco puedes alquilar en Ibiza por menos de ${bedrag} al día?`,
  `Quel bateau louer à Ibiza pour moins de ${bedrag} par jour ?`,
)

const TH_BOAT: T = L('Boot', 'Boat', 'Boot', 'Barco', 'Bateau')
const TH_PAX: T = L('Gasten', 'Guests', 'Gäste', 'Invitados', 'Invités')
const TH_MARINA: T = L('Haven', 'Marina', 'Hafen', 'Puerto', 'Port')
const TH_LOW: T = L('Laagseizoen', 'Low season', 'Nebensaison', 'Temporada baja', 'Basse saison')
const TH_HIGH: T = L('Juli–augustus', 'July–August', 'Juli–August', 'Julio–agosto', 'Juillet–août')

const NOTE: T = L(
  'Bedragen zijn per boot per dag, niet per persoon. Brandstof, schipper en btw verschillen per boot en staan in het dossier van die boot.',
  'Figures are per boat per day, not per person. Fuel, skipper and VAT vary per boat and are stated in that boat’s dossier.',
  'Beträge gelten pro Boot und Tag, nicht pro Person. Kraftstoff, Skipper und Mehrwertsteuer sind je Boot verschieden und stehen im Dossier des Bootes.',
  'Los importes son por barco y día, no por persona. Combustible, patrón e IVA varían según el barco y constan en el dosier de cada uno.',
  'Les montants sont par bateau et par jour, pas par personne. Carburant, skipper et TVA varient selon le bateau et figurent dans son dossier.',
)

const FLEET_LINK: T = L(
  'Alle boten met beschikbaarheid per dag',
  'The full fleet, with availability per day',
  'Die ganze Flotte, mit Verfügbarkeit pro Tag',
  'Toda la flota, con disponibilidad por día',
  'Toute la flotte, avec la disponibilité par jour',
)

const DOSSIER: T = L('dossier', 'dossier', 'Dossier', 'dosier', 'dossier')

export function CheapBoats({ locale }: { locale: Locale }) {
  const geprijsd = FLEET.filter((b) => b?.price?.low > 0)
  const onder: Boat[] = geprijsd
    .filter((b) => b.price.low < DREMPEL)
    .sort((a, b) => a.price.low - b.price.low)

  // Onder de drie is dit geen lijstje maar een uitzondering, en dan is een kop
  // die "welke boten" vraagt een belofte die de tabel niet waarmaakt.
  if (onder.length < 3) return null

  const nf = new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 })
  const eur = (n: number) => `€${nf.format(Math.round(n))}`
  const drempel = eur(DREMPEL)

  const laagste = onder[0]
  const hoogste = onder[onder.length - 1]
  const paxMin = Math.min(...onder.map((b) => b.pax))
  const paxMax = Math.max(...onder.map((b) => b.pax))
  const havens = Array.from(new Set(onder.map((b) => b.marina)))

  const havenLijst = (voegwoord: string) =>
    havens.length === 1
      ? havens[0]
      : `${havens.slice(0, -1).join(', ')} ${voegwoord} ${havens[havens.length - 1]}`

  const lead: T = L(
    `${onder.length} van onze ${geprijsd.length} boten. De goedkoopste is de ${boatLabel(laagste)}: ${eur(laagste.price.low)} per dag in het laagseizoen en ${eur(laagste.price.high)} in juli en augustus, voor ${laagste.pax} gasten vanuit ${laagste.marina}. De duurste van dit rijtje is de ${boatLabel(hoogste)} vanaf ${eur(hoogste.price.low)}. Ze nemen ${paxMin} tot ${paxMax} gasten mee en vertrekken uit ${havenLijst('en')}.`,
    `${onder.length} of our ${geprijsd.length} boats. The cheapest is the ${boatLabel(laagste)}: ${eur(laagste.price.low)} a day in low season and ${eur(laagste.price.high)} in July and August, for ${laagste.pax} guests from ${laagste.marina}. The dearest in this group is the ${boatLabel(hoogste)} from ${eur(hoogste.price.low)}. They carry ${paxMin} to ${paxMax} guests and leave from ${havenLijst('and')}.`,
    `${onder.length} von unseren ${geprijsd.length} Booten. Das günstigste ist die ${boatLabel(laagste)}: ${eur(laagste.price.low)} pro Tag in der Nebensaison und ${eur(laagste.price.high)} im Juli und August, für ${laagste.pax} Gäste ab ${laagste.marina}. Das teuerste dieser Gruppe ist die ${boatLabel(hoogste)} ab ${eur(hoogste.price.low)}. Sie nehmen ${paxMin} bis ${paxMax} Gäste mit und starten ab ${havenLijst('und')}.`,
    `${onder.length} de nuestros ${geprijsd.length} barcos. El más barato es el ${boatLabel(laagste)}: ${eur(laagste.price.low)} al día en temporada baja y ${eur(laagste.price.high)} en julio y agosto, para ${laagste.pax} invitados desde ${laagste.marina}. El más caro de este grupo es el ${boatLabel(hoogste)} desde ${eur(hoogste.price.low)}. Llevan de ${paxMin} a ${paxMax} invitados y salen de ${havenLijst('y')}.`,
    `${onder.length} de nos ${geprijsd.length} bateaux. Le moins cher est le ${boatLabel(laagste)} : ${eur(laagste.price.low)} par jour en basse saison et ${eur(laagste.price.high)} en juillet et août, pour ${laagste.pax} invités au départ de ${laagste.marina}. Le plus cher de ce groupe est le ${boatLabel(hoogste)} à partir de ${eur(hoogste.price.low)}. Ils embarquent ${paxMin} à ${paxMax} invités et partent de ${havenLijst('et')}.`,
  )

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">
          {HEADING(drempel)[locale]}
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">{lead[locale]}</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/15 text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <th scope="col" className="py-2 pr-3 font-black">{TH_BOAT[locale]}</th>
                <th scope="col" className="py-2 px-3 text-right font-black">{TH_PAX[locale]}</th>
                <th scope="col" className="py-2 px-3 font-black">{TH_MARINA[locale]}</th>
                <th scope="col" className="py-2 px-3 text-right font-black">{TH_LOW[locale]}</th>
                <th scope="col" className="py-2 pl-3 text-right font-black">{TH_HIGH[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {onder.map((b) => (
                <tr key={b.slug} className="border-b border-black/5">
                  <th scope="row" className="py-2.5 pr-3 font-semibold">
                    {/* Een dossier is een bestand, geen pagina: gewone <a>, nooit
                        een <Link> — client-side navigatie kan geen PDF laden. */}
                    <a
                      href={dossierHref(b.slug)}
                      className="text-neutral-900 underline decoration-black/20 underline-offset-2 hover:decoration-ibiza-green"
                    >
                      {boatLabel(b)}
                      <span className="sr-only"> — {DOSSIER[locale]}</span>
                    </a>
                  </th>
                  <td className="py-2.5 px-3 text-right tabular-nums text-neutral-600">{b.pax}</td>
                  <td className="py-2.5 px-3 text-neutral-600">{b.marina}</td>
                  <td className="py-2.5 px-3 text-right font-black tabular-nums text-ibiza-green">{eur(b.price.low)}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums text-neutral-600">{eur(b.price.high)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{NOTE[locale]}</p>
        <p className="mt-4">
          <Link
            href={`/${locale}/private-boat-charters`}
            className="font-semibold text-neutral-900 underline decoration-black/25 underline-offset-2 hover:decoration-ibiza-green"
          >
            {FLEET_LINK[locale]} →
          </Link>
        </p>
      </div>
    </section>
  )
}
