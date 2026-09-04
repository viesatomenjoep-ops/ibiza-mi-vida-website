import { getFleetStats, boatLabel } from '@/lib/fleet-stats'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { localeTag } from '@/lib/date-label'
import type { Locale } from '@/lib/seo'

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const HEADING: T = L(
  'De vragen die het vaakst gesteld worden — met de cijfers erbij',
  'The questions people actually ask — answered with the numbers',
  'Die Fragen, die wirklich gestellt werden — mit den Zahlen',
  'Las preguntas que de verdad se hacen — con los números',
  'Les questions vraiment posées — avec les chiffres',
)
const INTRO: T = L(
  'Alle bedragen hieronder komen rechtstreeks uit onze eigen vloot en veranderen mee zodra de vloot verandert.',
  'Every figure below comes straight from our own fleet and moves with it.',
  'Alle Beträge unten stammen direkt aus unserer eigenen Flotte und ändern sich mit ihr.',
  'Todas las cifras siguientes salen directamente de nuestra flota y cambian con ella.',
  'Tous les montants ci-dessous proviennent directement de notre flotte et évoluent avec elle.',
)

/**
 * Berekende antwoorden op de zoekvragen rond prijs en keuze.
 *
 * ── Waarom dit er staat ───────────────────────────────────────────────────
 * "Goedkoopste boot huren Ibiza", "boot voor 10 personen", "wat kost een dag
 * op een boot" — dat zijn de zoekopdrachten waar iedere concurrent dezelfde
 * loze zin neerzet: de beste prijzen van het eiland. Een antwoordmachine kan
 * daar niets mee, want die zin staat overal.
 *
 * Hier staat in plaats daarvan het antwoord mét het getal en de bootnaam: de
 * goedkoopste boot is een Monterey 224 FS voor €680 per dag, uit Marina
 * Botafoc. Dat is te controleren, het is van ons, en het is precies het soort
 * zin die een model letterlijk kan citeren.
 *
 * ── Waarom geen "beste boot" ──────────────────────────────────────────────
 * We hebben geen beoordelingen per boot. Een lijstje "beste boten" zou dus een
 * mening zijn in de vermomming van een feit. Waar naar "beste" gezocht wordt,
 * geven we de meetbare variant: de meeste gasten per euro, de goedkoopste voor
 * een groep van tien, de laagste vanafprijs per haven. Zie fleet-stats.ts.
 *
 * ── Waarom het ook in JSON-LD staat ───────────────────────────────────────
 * Dezelfde tekst gaat als FAQPage mee, zodat Google en de antwoordmachines de
 * vraag-antwoordparen als paar zien in plaats van als losse alinea's. De
 * zichtbare tekst en het schema komen uit dezelfde variabelen; ze kunnen dus
 * niet uit elkaar lopen.
 */
export function FleetAnswers({ locale }: { locale: Locale }) {
  const s = getFleetStats()
  if (!s) return null

  const nf = new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 })
  const eur = (n: number) => `€${nf.format(n)}`

  const goedkoopste = s.cheapest
  const voor8 = s.cheapestFor(8)
  const voor12 = s.cheapestFor(12)
  const havenLijst = s.perMarina.map((m) => `${m.marina} (${m.count}, vanaf ${eur(m.from)})`).join(', ')
  const havenLijstEn = s.perMarina.map((m) => `${m.marina} (${m.count}, from ${eur(m.from)})`).join(', ')

  const qa: { q: string; a: string }[] = (() => {
    switch (locale) {
      case 'nl':
        return [
          { q: 'Wat is de goedkoopste boot die jullie verhuren op Ibiza?',
            a: `De ${boatLabel(goedkoopste)}, ${eur(goedkoopste.price.low)} per dag in het laagseizoen, voor ${goedkoopste.pax} gasten vanuit ${goedkoopste.marina}. Van onze ${s.total} boten liggen er ${s.under(1000)} onder ${eur(1000)} per dag en ${s.under(1500)} onder ${eur(1500)}.` },
          { q: 'Wat kost een dag op een privéboot op Ibiza?',
            a: `Bij ons loopt het van ${eur(s.cheapest.price.low)} tot ${eur(s.priciest.price.high)} per dag, afhankelijk van de boot en het seizoen. Dat zijn onze eigen dagtarieven, geen gemiddelde van de markt. Brandstof, schipper en btw verschillen per boot en staan in het dossier.` },
          { q: 'Welke boot geeft de meeste ruimte voor je geld?',
            a: `Gemeten in gasten per euro is dat de ${boatLabel(s.bestValue)}: ${s.bestValue.pax} gasten vanaf ${eur(s.bestValue.price.low)} per dag. Dat is een rekensom, geen oordeel over de boot — welke het prettigst vaart hangt van je plannen af.` },
          { q: 'Wat is de goedkoopste boot voor 8 personen?',
            a: voor8 ? `De ${boatLabel(voor8)}, vanaf ${eur(voor8.price.low)} per dag, met plaats voor ${voor8.pax} gasten.` : 'Vraag het ons via WhatsApp; de vloot wisselt.' },
          { q: 'Welke boot kan de grootste groep aan?',
            a: `Onze grootste boten nemen ${s.maxPax} gasten mee. De goedkoopste daarvan is ${voor12 ? `de ${boatLabel(voor12)} vanaf ${eur(voor12.price.low)} per dag` : 'op aanvraag'}.` },
          { q: 'Vanuit welke jachthavens vertrekken jullie boten?',
            a: `Uit ${s.marinas.length} havens op Ibiza: ${havenLijst}. Formentera is een bestemming waar je heen vaart, geen vertrekhaven.` },
          { q: 'Hoeveel boten hebben jullie?',
            a: `${s.total}: ${s.yachts} jachten en ${s.motorboats} motorboten. Van elke boot staat de beschikbaarheid per dag live op de site.` },
          { q: 'Kan ik zien of een boot op mijn datum vrij is?',
            a: 'Ja. Kies je datum in de balk bovenaan het vlootoverzicht en elke kaart toont beschikbaar, in optie of bezet, plus de dagprijs voor die datum. Die stand komt van onze vlootleverancier en wordt elk kwartier ververst.' },
        ]
      case 'de':
        return [
          { q: 'Was ist das günstigste Boot, das ihr auf Ibiza vermietet?',
            a: `Die ${boatLabel(goedkoopste)} für ${eur(goedkoopste.price.low)} pro Tag in der Nebensaison, für ${goedkoopste.pax} Gäste ab ${goedkoopste.marina}. Von unseren ${s.total} Booten liegen ${s.under(1000)} unter ${eur(1000)} und ${s.under(1500)} unter ${eur(1500)} pro Tag.` },
          { q: 'Was kostet ein Tag auf einem Privatboot auf Ibiza?',
            a: `Bei uns von ${eur(s.cheapest.price.low)} bis ${eur(s.priciest.price.high)} pro Tag, je nach Boot und Saison. Das sind unsere eigenen Tagespreise, kein Marktdurchschnitt.` },
          { q: 'Welches Boot bietet am meisten Platz fürs Geld?',
            a: `Gemessen in Gästen pro Euro die ${boatLabel(s.bestValue)}: ${s.bestValue.pax} Gäste ab ${eur(s.bestValue.price.low)} pro Tag.` },
          { q: 'Welches ist das günstigste Boot für 8 Personen?',
            a: voor8 ? `Die ${boatLabel(voor8)} ab ${eur(voor8.price.low)} pro Tag, für ${voor8.pax} Gäste.` : 'Frag uns per WhatsApp.' },
          { q: 'Welches Boot fasst die größte Gruppe?',
            a: `Unsere größten Boote nehmen ${s.maxPax} Gäste mit. Das günstigste davon ${voor12 ? `ist die ${boatLabel(voor12)} ab ${eur(voor12.price.low)} pro Tag` : 'auf Anfrage'}.` },
          { q: 'Aus welchen Marinas fahren eure Boote ab?',
            a: `Aus ${s.marinas.length} Häfen auf Ibiza: ${havenLijstEn}. Formentera ist ein Ziel, kein Abfahrtshafen.` },
          { q: 'Wie viele Boote habt ihr?',
            a: `${s.total}: ${s.yachts} Yachten und ${s.motorboats} Motorboote, mit tagesgenauer Verfügbarkeit auf der Seite.` },
          { q: 'Kann ich sehen, ob ein Boot an meinem Datum frei ist?',
            a: 'Ja. Wähle dein Datum oben in der Leiste; jede Karte zeigt verfügbar, auf Option oder belegt, samt Tagespreis. Der Stand kommt von unserem Flottenpartner und wird viertelstündlich aktualisiert.' },
        ]
      case 'es':
        return [
          { q: '¿Cuál es el barco más barato que alquiláis en Ibiza?',
            a: `El ${boatLabel(goedkoopste)}, ${eur(goedkoopste.price.low)} al día en temporada baja, para ${goedkoopste.pax} invitados desde ${goedkoopste.marina}. De nuestros ${s.total} barcos, ${s.under(1000)} están por debajo de ${eur(1000)} y ${s.under(1500)} por debajo de ${eur(1500)} al día.` },
          { q: '¿Cuánto cuesta un día en barco privado en Ibiza?',
            a: `Con nosotros de ${eur(s.cheapest.price.low)} a ${eur(s.priciest.price.high)} al día, según barco y temporada. Son nuestras propias tarifas, no una media del mercado.` },
          { q: '¿Qué barco da más espacio por su precio?',
            a: `Medido en invitados por euro, el ${boatLabel(s.bestValue)}: ${s.bestValue.pax} invitados desde ${eur(s.bestValue.price.low)} al día.` },
          { q: '¿Cuál es el barco más barato para 8 personas?',
            a: voor8 ? `El ${boatLabel(voor8)}, desde ${eur(voor8.price.low)} al día, para ${voor8.pax} invitados.` : 'Pregúntanos por WhatsApp.' },
          { q: '¿Qué barco admite el grupo más grande?',
            a: `Nuestros mayores barcos llevan ${s.maxPax} invitados. El más económico ${voor12 ? `es el ${boatLabel(voor12)} desde ${eur(voor12.price.low)} al día` : 'bajo petición'}.` },
          { q: '¿Desde qué puertos salen vuestros barcos?',
            a: `Desde ${s.marinas.length} puertos de Ibiza: ${havenLijstEn}. Formentera es un destino al que se navega, no un puerto de salida.` },
          { q: '¿Cuántos barcos tenéis?',
            a: `${s.total}: ${s.yachts} yates y ${s.motorboats} lanchas, con disponibilidad diaria en la web.` },
          { q: '¿Puedo ver si un barco está libre en mi fecha?',
            a: 'Sí. Elige tu fecha en la barra superior y cada ficha muestra disponible, en opción u ocupado, con la tarifa de ese día. El estado viene de nuestro proveedor y se actualiza cada cuarto de hora.' },
        ]
      case 'fr':
        return [
          { q: 'Quel est le bateau le moins cher que vous louez à Ibiza ?',
            a: `Le ${boatLabel(goedkoopste)}, ${eur(goedkoopste.price.low)} par jour en basse saison, pour ${goedkoopste.pax} invités au départ de ${goedkoopste.marina}. Sur nos ${s.total} bateaux, ${s.under(1000)} sont sous ${eur(1000)} et ${s.under(1500)} sous ${eur(1500)} par jour.` },
          { q: 'Combien coûte une journée en bateau privé à Ibiza ?',
            a: `Chez nous de ${eur(s.cheapest.price.low)} à ${eur(s.priciest.price.high)} par jour, selon le bateau et la saison. Ce sont nos propres tarifs, pas une moyenne du marché.` },
          { q: 'Quel bateau offre le plus de place pour son prix ?',
            a: `Mesuré en invités par euro, le ${boatLabel(s.bestValue)} : ${s.bestValue.pax} invités dès ${eur(s.bestValue.price.low)} par jour.` },
          { q: 'Quel est le bateau le moins cher pour 8 personnes ?',
            a: voor8 ? `Le ${boatLabel(voor8)}, dès ${eur(voor8.price.low)} par jour, pour ${voor8.pax} invités.` : 'Demandez-nous via WhatsApp.' },
          { q: 'Quel bateau accueille le plus grand groupe ?',
            a: `Nos plus grands bateaux embarquent ${s.maxPax} invités. Le moins cher ${voor12 ? `est le ${boatLabel(voor12)} dès ${eur(voor12.price.low)} par jour` : 'sur demande'}.` },
          { q: 'De quels ports partent vos bateaux ?',
            a: `De ${s.marinas.length} ports à Ibiza : ${havenLijstEn}. Formentera est une destination, pas un port de départ.` },
          { q: 'Combien de bateaux avez-vous ?',
            a: `${s.total} : ${s.yachts} yachts et ${s.motorboats} bateaux à moteur, avec la disponibilité au jour le jour sur le site.` },
          { q: 'Puis-je voir si un bateau est libre à ma date ?',
            a: 'Oui. Choisissez votre date dans la barre en haut ; chaque fiche indique disponible, en option ou réservé, avec le tarif du jour. L’état vient de notre partenaire et se rafraîchit tous les quarts d’heure.' },
        ]
      default:
        return [
          { q: 'What is the cheapest boat you charter in Ibiza?',
            a: `The ${boatLabel(goedkoopste)} at ${eur(goedkoopste.price.low)} a day in low season, for ${goedkoopste.pax} guests from ${goedkoopste.marina}. Of our ${s.total} boats, ${s.under(1000)} sit under ${eur(1000)} a day and ${s.under(1500)} under ${eur(1500)}.` },
          { q: 'How much does a day on a private boat in Ibiza cost?',
            a: `With us it runs from ${eur(s.cheapest.price.low)} to ${eur(s.priciest.price.high)} a day, depending on the boat and the season. These are our own day rates, not an average of the market. Fuel, skipper and VAT differ per boat and are in the dossier.` },
          { q: 'Which boat gives the most space for the money?',
            a: `Measured in guests per euro, the ${boatLabel(s.bestValue)}: ${s.bestValue.pax} guests from ${eur(s.bestValue.price.low)} a day. That is arithmetic, not a verdict on the boat — which one sails best depends on your plans.` },
          { q: 'What is the cheapest boat for 8 people?',
            a: voor8 ? `The ${boatLabel(voor8)}, from ${eur(voor8.price.low)} a day, seating ${voor8.pax} guests.` : 'Ask us over WhatsApp; the fleet changes.' },
          { q: 'Which boat takes the largest group?',
            a: `Our largest boats carry ${s.maxPax} guests. The cheapest of those ${voor12 ? `is the ${boatLabel(voor12)} from ${eur(voor12.price.low)} a day` : 'is on request'}.` },
          { q: 'Which marinas do your boats leave from?',
            a: `From ${s.marinas.length} marinas on Ibiza: ${havenLijstEn}. Formentera is a destination you sail to, not a departure port.` },
          { q: 'How many boats do you have?',
            a: `${s.total}: ${s.yachts} yachts and ${s.motorboats} motorboats, each with day-by-day availability on the site.` },
          { q: 'Can I see whether a boat is free on my date?',
            a: 'Yes. Pick your date in the bar above the fleet and every card shows available, on option or booked, with the rate for that day. That status comes from our fleet supplier and refreshes every fifteen minutes.' },
        ]
    }
  })()

  return (
    <section className="border-t border-black/5 bg-neutral-50 py-14">
      <FaqJsonLd faqs={qa} />
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-[1.25rem] font-black tracking-tight text-neutral-900 sm:text-[1.625rem]">
          {HEADING[locale]}
        </h2>
        <p className="mt-2 text-[14px] text-neutral-600">{INTRO[locale]}</p>
        <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {qa.map((item) => (
            <div key={item.q} className="py-4">
              <dt className="font-serif text-[15px] font-bold text-neutral-900">{item.q}</dt>
              <dd className="mt-1.5 text-[14px] leading-relaxed text-neutral-700">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
