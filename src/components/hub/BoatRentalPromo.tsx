import Link from 'next/link'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { slugFor } from '@/lib/route-slugs'
import { FLEET } from '@/data/fleet'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { localeTag } from '@/lib/date-label'

/**
 * Click&Boat block, the counterpart to CarRentalPromo.
 *
 * Every boat page on this site — /boats, /boat-trip, /water-sports,
 * /boat-party, /private-boat-charters — described boats at length and offered
 * no way to book one: a grep for a Click&Boat link across all of them returned
 * nothing. Readers arrived at the end of a page about chartering and found a
 * WhatsApp button, which works for a private charter but not for someone who
 * just wants to see what is free next Tuesday.
 *
 * ── Same background rule as CarRentalPromo ────────────────────────────────
 * It paints its own dark ground. These pages do not agree on a palette: the
 * homepage sits on the near-black body, several boat pages render white
 * sections. A block that inherited would be unreadable on half of them, which
 * is the bug that made the fleet prices invisible.
 *
 * ── The number is real ────────────────────────────────────────────────────
 * The "from" price is computed from FLEET, the same source the fleet price
 * block uses, rather than typed in here. Those are our own day rates. If the
 * fleet ever has no priced boat, the figure disappears instead of falling back
 * to something invented.
 */

type T = Record<Locale, string>

const KICKER: T = {
  nl: 'In samenwerking met Click&Boat',
  en: 'In partnership with Click&Boat',
  de: 'In Zusammenarbeit mit Click&Boat',
  es: 'En colaboración con Click&Boat',
  fr: 'En partenariat avec Click&Boat',
}

const HEADING: T = {
  nl: 'Zelf een boot uitzoeken',
  en: 'Pick a boat yourself',
  de: 'Selbst ein Boot aussuchen',
  es: 'Elige tu propio barco',
  fr: 'Choisissez votre bateau',
}

const LEAD: T = {
  nl: 'Met schipper, met eigen vaarbewijs, of zonder vaarbewijs tot 15 pk. Vertrek vanuit de jachthavens rond het eiland — bekijk wat er op jouw datum vrij is.',
  en: 'With a skipper, with your own licence, or licence-free up to 15 hp. Departures from marinas around the island — see what is free on your date.',
  de: 'Mit Skipper, mit eigenem Führerschein oder führerscheinfrei bis 15 PS. Ab Marinas rund um die Insel — sieh, was an deinem Datum frei ist.',
  es: 'Con patrón, con tu titulación o sin ella hasta 15 CV. Salidas desde los puertos de la isla: mira qué hay libre en tu fecha.',
  fr: 'Avec skipper, avec votre permis ou sans permis jusqu’à 15 ch. Départs des ports de l’île — voyez ce qui est libre à votre date.',
}

const READ_MORE: T = {
  nl: 'Prijzen, regels en routes',
  en: 'Prices, rules and routes',
  de: 'Preise, Regeln und Routen',
  es: 'Precios, normas y rutas',
  fr: 'Prix, règles et itinéraires',
}

const CTA: T = {
  nl: 'Bekijk beschikbare boten',
  en: 'See available boats',
  de: 'Verfügbare Boote ansehen',
  es: 'Ver barcos disponibles',
  fr: 'Voir les bateaux disponibles',
}

const FROM_LABEL: T = {
  nl: 'per dag, onze eigen vloot',
  en: 'per day, from our own fleet',
  de: 'pro Tag, aus unserer Flotte',
  es: 'por día, de nuestra flota',
  fr: 'par jour, notre propre flotte',
}

const POINTS: Record<Locale, string[]> = {
  nl: ['Met schipper, zelf varen, of zonder vaarbewijs', 'Jachthavens rond het hele eiland', 'Wij checken vooraf wat bij je groep past'],
  en: ['With a skipper, drive yourself, or licence-free', 'Marinas all around the island', 'We check what suits your group before you book'],
  de: ['Mit Skipper, selbst fahren oder führerscheinfrei', 'Marinas rund um die ganze Insel', 'Wir prüfen vorab, was zu deiner Gruppe passt'],
  es: ['Con patrón, navegas tú, o sin titulación', 'Puertos por toda la isla', 'Comprobamos antes qué encaja con tu grupo'],
  fr: ['Avec skipper, en autonomie, ou sans permis', 'Des ports tout autour de l’île', 'Nous vérifions ce qui convient à votre groupe'],
}

export function BoatRentalPromo({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const href = `/${l}/${slugFor('boat-rental', l)}`

  // Real lowest day rate from our own fleet, or nothing at all.
  const priced = FLEET.filter((b) => b?.price?.low)
  const from = priced.length ? Math.min(...priced.map((b) => b.price.low)) : null
  const nf = new Intl.NumberFormat(localeTag(l), { maximumFractionDigits: 0 })

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-obsidian p-7 text-white md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-soft">{KICKER[l]}</p>
            <h2 className="mt-3 font-serif text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
              {HEADING[l]}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">{LEAD[l]}</p>

            <ul className="mt-6 space-y-2">
              {POINTS[l].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] text-white/85">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 md:text-right">
            {from !== null && (
              <p className="font-serif text-3xl font-black text-white">
                €{nf.format(from)}
                <span className="mt-1 block font-sans text-[13px] font-normal text-white/60">{FROM_LABEL[l]}</span>
              </p>
            )}
            <div className="mt-6 flex flex-col items-start gap-4 md:items-end">
              <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={l}>
                {CTA[l]}
              </AffiliateLink>
              <Link
                href={href}
                className="text-[14px] font-semibold text-white underline underline-offset-4 hover:text-gold-soft"
              >
                {READ_MORE[l]} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
