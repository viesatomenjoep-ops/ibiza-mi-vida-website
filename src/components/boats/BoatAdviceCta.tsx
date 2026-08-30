import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Advice CTA for the charter page.
 *
 * Choosing a boat is the step people stall on: the fleet page answers "which
 * boats exist", not "which one suits four adults and two children on a windy
 * Tuesday". That question is answered by a person, so this block exists to move
 * the visitor to WhatsApp with enough context that the first reply is useful.
 *
 * Written for a business audience rather than a party one — group charters,
 * client entertaining and events are a real slice of the demand on this page,
 * and nothing else on it speaks to them.
 *
 * The message is prefilled but deliberately incomplete: it names the three
 * things Simon needs (date, group size, budget) instead of pretending to know
 * them, so the visitor fills them in rather than sending a bare "hi".
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Advies', 'Advice', 'Beratung', 'Asesoramiento', 'Conseil')
const TITLE: T = L(
  'Niet zeker welke boot bij je dag past?',
  'Not sure which boat fits your day?',
  'Unsicher, welches Boot zu deinem Tag passt?',
  '¿No sabes qué barco encaja con tu día?',
  'Vous ne savez pas quel bateau convient à votre journée ?',
)
const BODY: T = L(
  'Vertel Simon je datum, met hoeveel mensen je bent en wat je wilt besteden, en je krijgt een gerichte selectie terug in plaats van een lijst van dertig boten. Hij vaart hier zelf en weet welke boot bij welke wind en welk gezelschap past — en zegt het ook als een dag beter een week later kan.',
  'Tell Simon your date, how many of you there are and what you want to spend, and you get a short list back instead of thirty boats. He is on the water here and knows which boat suits which wind and which group — and will say so when a day is better moved a week later.',
  'Nenne Simon dein Datum, eure Gruppengröße und dein Budget, und du bekommst eine gezielte Auswahl statt einer Liste mit dreißig Booten. Er ist hier selbst auf dem Wasser und weiß, welches Boot zu welchem Wind und welcher Gruppe passt — und sagt auch, wenn ein Tag besser eine Woche später liegt.',
  'Dile a Simon tu fecha, cuántos sois y qué quieres gastar, y recibirás una selección concreta en lugar de una lista de treinta barcos. Él navega aquí y sabe qué barco encaja con qué viento y qué grupo — y también te dirá si conviene mover el día una semana.',
  'Indiquez à Simon votre date, le nombre de personnes et votre budget, et vous recevrez une sélection ciblée plutôt qu’une liste de trente bateaux. Il navigue ici et sait quel bateau convient à quel vent et à quel groupe — et vous dira aussi s’il vaut mieux décaler la journée.',
)
const BUSINESS: T = L(
  'Ook voor zakelijke boekingen: klantendagen, teamuitjes en incentives. Voor grotere groepen of meerdere boten op dezelfde dag plannen we het liefst ruim vooraf.',
  'Business bookings too: client days, team outings and incentives. For larger groups or several boats on the same day we would rather plan well ahead.',
  'Auch für geschäftliche Buchungen: Kundentage, Team-Events und Incentives. Bei größeren Gruppen oder mehreren Booten am selben Tag planen wir am liebsten weit im Voraus.',
  'También para reservas de empresa: jornadas con clientes, salidas de equipo e incentivos. Para grupos grandes o varios barcos el mismo día preferimos planificar con antelación.',
  'Également pour les réservations professionnelles : journées clients, sorties d’équipe et incentives. Pour les grands groupes ou plusieurs bateaux le même jour, nous préférons planifier bien à l’avance.',
)
const BTN: T = L(
  'WhatsApp Simon', 'WhatsApp Simon', 'Simon per WhatsApp', 'WhatsApp a Simon', 'WhatsApp à Simon',
)
const NOTE: T = L(
  'Meestal binnen een paar uur antwoord, in het hoogseizoen soms later.',
  'Usually answered within a few hours, sometimes later in peak season.',
  'Antwort meist innerhalb weniger Stunden, in der Hochsaison manchmal später.',
  'Normalmente responde en unas horas, a veces más tarde en temporada alta.',
  'Réponse généralement en quelques heures, parfois plus tard en haute saison.',
)
const PREFILL: T = L(
  'Hoi Simon! Ik wil graag advies over een boot.\nDatum: \nAantal personen: \nBudget per dag: ',
  'Hi Simon! I’d like advice on a boat.\nDate: \nGroup size: \nBudget per day: ',
  'Hallo Simon! Ich hätte gern Beratung zu einem Boot.\nDatum: \nPersonen: \nBudget pro Tag: ',
  '¡Hola Simon! Quiero asesoramiento sobre un barco.\nFecha: \nPersonas: \nPresupuesto por día: ',
  'Salut Simon ! Je voudrais un conseil sur un bateau.\nDate : \nNombre de personnes : \nBudget par jour : ',
)

/** WhatsApp's glyph. Inline so it renders without a network request. */
function WhatsAppGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
    </svg>
  )
}

export function BoatAdviceCta({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL[l])}`

  return (
    <section className="border-y border-black/5 bg-neutral-50 py-14">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h2 className="mt-3 font-serif text-2xl font-black tracking-tight text-neutral-900 md:text-3xl">
          {TITLE[l]}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-700">{BODY[l]}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{BUSINESS[l]}</p>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-serif text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.03] active:scale-100"
        >
          <WhatsAppGlyph />
          {BTN[l]}
        </a>

        <p className="mt-3 text-xs text-black/60">{NOTE[l]}</p>
      </div>
    </section>
  )
}
