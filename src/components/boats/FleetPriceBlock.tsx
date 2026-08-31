import { FLEET } from '@/data/fleet'
import type { Locale } from '@/lib/seo'
import { localeTag } from '@/lib/date-label'

type T = Record<Locale, string>

/**
 * Wat een privéboot bij ons kost, bovenaan de charterpagina.
 *
 * ── Waarom ranges en geen mediaan ─────────────────────────────────────────
 * Op /ibiza-prices publiceren we medianen, omdat daar 400 clubavonden achter
 * zitten. Hier gaat het om 16 jachten en 15 motorboten. Een mediaan over
 * zestien boten suggereert een marktprijs die er niet is: hij zegt alleen iets
 * over welke boten wij toevallig in de vloot hebben. Ranges zijn eerlijker en
 * beantwoorden bovendien de vraag die iemand echt heeft — waar begint het, en
 * waar houdt het op.
 *
 * ── Waarom "onze vloot" en niet "op Ibiza" ────────────────────────────────
 * Dit zijn onze eigen dagtarieven, geen meting van de markt. Het verschil is
 * wezenlijk: de clubprijzenpagina meet een externe markt waar wij zelf niet in
 * zitten, hier meten we onszelf. Dat als marktcijfer presenteren zou precies
 * de ongefundeerde stelligheid zijn waar de rest van deze site tegen ingaat.
 *
 * ── Wat er bewust niet staat ──────────────────────────────────────────────
 * Geen lijst van wat inbegrepen is. De oude paginabeschrijving beloofde
 * "inclusief brandstof, drankjes en snorkels"; dat verschilt per boot en per
 * boeking, en niemand hier kan het voor alle 31 boten bevestigen. Een
 * verkeerde belofte op dit punt eindigt in een verrassing op de rekening,
 * dus staat er wat wel klopt: het dagtarief is voor de boot, de rest hangt
 * ervan af en wordt vooraf bevestigd.
 *
 * Ook geen datumstempel. De vlootprijzen staan in de repo en veranderen niet
 * vanzelf; een datum erbij zou versheid suggereren die er niet is.
 */
export function FleetPriceBlock({ locale }: { locale: Locale }) {
  const priced = FLEET.filter(b => b?.price?.low)
  if (priced.length === 0) return null

  const of = (cat: string) => priced.filter(b => (b as any).category === cat)
  const yachts = of('yacht')
  const motor = of('motorboat')
  const lo = (arr: typeof priced) => Math.min(...arr.map(b => b.price.low))
  const hi = (arr: typeof priced) => Math.max(...arr.map(b => (b.price as any).high || b.price.low))

  const marinas = Array.from(new Set(priced.map(b => (b as any).marina).filter(Boolean)))
  // Per taal opmaken, niet hardgecodeerd Nederlands. Stond eerst op nl-NL,
  // waardoor een Engelse bezoeker "€2.057" zag — dat leest daar als twee komma
  // nul vijf zeven, oftewel een factor duizend ernaast op de duurste boot.
  const nf = new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 })
  const euro = (n: number) => `€${nf.format(n)}`

  const HEAD: T = {
    nl: 'Wat kost het?', en: 'What does it cost?', de: 'Was kostet es?',
    es: '¿Cuánto cuesta?', fr: 'Combien ça coûte ?',
  }

  const lead: T = {
    nl: `Onze vloot telt ${priced.length} boten vanaf ${marinas.length} jachthavens rond het eiland. Een motorboot begint bij ${euro(lo(motor))} per dag, een jacht bij ${euro(lo(yachts))}, en de grootste gaat tot ${euro(hi(yachts))}. Dat zijn onze eigen dagtarieven, geen gemiddelde van de markt.`,
    en: `Our fleet holds ${priced.length} boats from ${marinas.length} marinas around the island. A motorboat starts at ${euro(lo(motor))} a day, a yacht at ${euro(lo(yachts))}, and the largest runs to ${euro(hi(yachts))}. These are our own day rates, not an average of the market.`,
    de: `Unsere Flotte umfasst ${priced.length} Boote aus ${marinas.length} Marinas rund um die Insel. Ein Motorboot beginnt bei ${euro(lo(motor))} pro Tag, eine Yacht bei ${euro(lo(yachts))}, die größte reicht bis ${euro(hi(yachts))}. Das sind unsere eigenen Tagespreise, kein Marktdurchschnitt.`,
    es: `Nuestra flota tiene ${priced.length} barcos desde ${marinas.length} puertos de la isla. Una lancha empieza en ${euro(lo(motor))} al día, un yate en ${euro(lo(yachts))}, y el mayor llega a ${euro(hi(yachts))}. Son nuestras propias tarifas diarias, no una media del mercado.`,
    fr: `Notre flotte compte ${priced.length} bateaux au départ de ${marinas.length} ports de l'île. Un bateau à moteur démarre à ${euro(lo(motor))} par jour, un yacht à ${euro(lo(yachts))}, et le plus grand va jusqu'à ${euro(hi(yachts))}. Ce sont nos propres tarifs journaliers, pas une moyenne du marché.`,
  }

  const note: T = {
    nl: 'Het dagtarief is voor de boot. Of er een schipper bij zit, en wat er verder bij hoort, verschilt per boot en per datum — dat bevestigen we voordat je boekt, niet erna. Vraag het gerust vooraf; wij vinden een verrassing op de rekening ook niet leuk.',
    en: 'The day rate is for the boat. Whether a skipper is included, and what else comes with it, differs per boat and per date — we confirm that before you book, not after. Ask up front; we dislike a surprise on the bill as much as you do.',
    de: 'Der Tagespreis gilt für das Boot. Ob ein Skipper dabei ist und was sonst dazugehört, hängt vom Boot und vom Datum ab — das bestätigen wir vor der Buchung, nicht danach. Frag ruhig vorher; eine Überraschung auf der Rechnung finden wir auch nicht schön.',
    es: 'La tarifa diaria es por el barco. Si incluye patrón, y qué más entra, depende del barco y de la fecha: lo confirmamos antes de que reserves, no después. Pregunta sin problema; a nosotros tampoco nos gustan las sorpresas en la factura.',
    fr: "Le tarif journalier concerne le bateau. Skipper inclus ou non, et ce qui va avec, dépend du bateau et de la date : nous le confirmons avant votre réservation, pas après. N'hésitez pas à demander ; une surprise sur la facture ne nous plaît pas non plus.",
  }

  const CAT_Y: T = { nl: 'Jachten', en: 'Yachts', de: 'Yachten', es: 'Yates', fr: 'Yachts' }
  const CAT_M: T = { nl: 'Motorboten', en: 'Motorboats', de: 'Motorboote', es: 'Lanchas', fr: 'Bateaux à moteur' }
  const PER_DAY: T = { nl: 'per dag', en: 'per day', de: 'pro Tag', es: 'al día', fr: 'par jour' }
  const BOATS: T = { nl: 'boten', en: 'boats', de: 'Boote', es: 'barcos', fr: 'bateaux' }

  const cards = [
    { label: CAT_M[locale], arr: motor },
    { label: CAT_Y[locale], arr: yachts },
  ].filter(c => c.arr.length > 0)

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      {/* Licht op donker, want dit blok heeft zelf geen achtergrond.
          globals.css zet `body{background:var(--black)}` (#0D0509), en deze
          sectie zit daar direct op. De kop en de intro stonden op
          text-neutral-900 en text-neutral-800 — bijna zwart op bijna zwart,
          rond 1.1:1, in de praktijk onzichtbaar. Precies dezelfde fout als in
          de FAQ-accordeon, en om dezelfde reden: donkere tekstkleuren werken
          alleen in een blok dat zelf een lichte achtergrond meebrengt.
          Wit (#FAF3F5) op die body haalt 18,4:1; wit op 80% haalt 11,8:1.
          De kaarten en de notitie hieronder houden hun donkere tekst: die
          hebben wél een eigen lichte achtergrond (bg-ibiza-mint, bg-white). */}
      <h2 className="font-serif text-2xl font-black tracking-tight text-white">{HEAD[locale]}</h2>
      <p className="mt-4 text-lg leading-relaxed text-white/80">{lead[locale]}</p>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map(c => (
          <div key={c.label} className="rounded-2xl bg-ibiza-mint px-5 py-4">
            <dt className="text-sm font-bold text-neutral-800">
              {c.label} <span className="font-normal text-neutral-600">· {c.arr.length} {BOATS[locale]}</span>
            </dt>
            <dd className="mt-1 font-serif text-2xl font-black tabular-nums text-ibiza-green">
              {euro(lo(c.arr))} – {euro(hi(c.arr))}
              <span className="ml-2 font-sans text-xs font-semibold text-neutral-600">{PER_DAY[locale]}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 rounded-xl border-l-2 border-ibiza-green bg-white px-4 py-3 text-sm leading-relaxed text-neutral-700">
        {note[locale]}
      </p>
    </section>
  )
}
