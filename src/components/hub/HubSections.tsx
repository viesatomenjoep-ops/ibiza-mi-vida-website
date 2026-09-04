import Link from 'next/link'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * The shared furniture for a commercial hub page.
 *
 * Every one of these is a server component rendering plain semantic HTML. That
 * is a hard requirement rather than a preference: the answer engines this site
 * is built to be cited by (OAI-SearchBot, PerplexityBot, ClaudeBot) do not run
 * JavaScript, so anything that only appears after hydration is, to them,
 * content that does not exist. No "use client" belongs in this file.
 *
 * Structure follows the same reasoning as SailingRoutes: real <h2>/<h3>,
 * genuine <table>, <ol> and <dl> elements, so a reader that strips CSS still
 * gets the hierarchy. Divs styled to look like a table lose all of it.
 *
 * Contrast note, inherited from the rest of the site: these sections sit on
 * white and the legacy theme sets a near-white link colour. Every <a> here
 * carries an explicit text colour — never rely on the inherited one.
 */

const loc = (locale: string): Locale =>
  (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

const ON_REQUEST: Record<Locale, string> = {
  nl: 'op aanvraag',
  en: 'on request',
  de: 'auf Anfrage',
  es: 'a consultar',
  fr: 'sur demande',
}

const UPDATED_LABEL: Record<Locale, string> = {
  nl: 'Laatst bijgewerkt',
  en: 'Last updated',
  de: 'Zuletzt aktualisiert',
  es: 'Última actualización',
  fr: 'Dernière mise à jour',
}

/** Locale-aware long date, e.g. "31 August 2026". */
function formatDate(iso: string, l: Locale): string {
  const tag = { nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' }[l]
  try {
    return new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(`${iso}T00:00:00Z`))
  } catch {
    return iso
  }
}

/**
 * Visible "last updated" stamp.
 *
 * Rendered as a <time datetime> so the date is machine-readable as well as
 * visible. Takes an explicit ISO date from CONTENT_UPDATED rather than a build
 * timestamp — see src/lib/content-dates.ts for why a build date would be a
 * uniformly false signal.
 */
export function LastUpdated({ iso, locale }: { iso?: string; locale: string }) {
  if (!iso) return null
  const l = loc(locale)
  return (
    <p className="mt-6 text-[13px] text-neutral-500">
      {UPDATED_LABEL[l]}: <time dateTime={iso}>{formatDate(iso, l)}</time>
    </p>
  )
}

export interface Crumb {
  name: string
  /** Locale-agnostic path; omit on the current page. */
  path?: string
}

/**
 * Visible breadcrumb trail.
 *
 * Pairs with the BreadcrumbList in SchemaMarkup and must be built from the
 * same array — markup describing a trail the page does not show is exactly the
 * mismatch structured-data guidelines forbid. The last crumb is the current
 * page: rendered as plain text with aria-current, never as a link.
 */
export function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: string }) {
  const l = loc(locale)
  if (items.length < 2) return null
  return (
    // pt-[calc(var(--nav-h)+…)] omdat dit het EERSTE element op de pagina is en
    // .site-header `position:fixed` staat: 134px op desktop, 116px op mobiel
    // (globals.css). Zonder die compensatie schuift het kruimelpad — en daarmee
    // de hele pagina — onder de navigatie, precies zoals het logo op de oude
    // bootpagina over de kicker viel. --nav-h is de enige bron van waarheid;
    // gebruik nooit een vast getal.
    <nav aria-label="Breadcrumb" className="border-b border-black/5 bg-white">
      <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-2 gap-y-1 px-4 pb-3 pt-[calc(var(--nav-h)+16px)] text-[13px] text-neutral-500">
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {last || !c.path ? (
                <span aria-current="page" className="text-neutral-900">{c.name}</span>
              ) : (
                <Link href={`/${l}${c.path ? `/${c.path.replace(/^\//, '')}` : ''}`} className="text-neutral-600 underline underline-offset-2 hover:text-neutral-900">
                  {c.name}
                </Link>
              )}
              {!last && <span aria-hidden className="text-neutral-300">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Page opening: the single H1 and, waar die er is, de antwoord-eerst alinea.
 *
 * `lead` must answer the page's core question inside the first 40–60 words and
 * carry a concrete figure. That is the site's content rule, and it is also what
 * makes a paragraph quotable: answer engines lift a self-contained opening far
 * more readily than one that builds up to a point.
 *
 * Optioneel, want die regel botst met een tweede: op een telefoon staat een
 * alinea van zestig woorden tussen de kop en álles wat je kunt aanklikken. Op
 * de autohuurpagina's stonden dezelfde feiten twee schermen lager nog eens, per
 * punt uitgesplitst, en dan is de lopende versie bovenaan alleen nog een
 * drempel. Zonder `lead` rendert de hero de alinea niet in plaats van een lege
 * marge te laten staan.
 */
export function HubHero({
  h1,
  lead,
  locale,
  updated,
  children,
  as: Heading = 'h1',
}: {
  h1: string
  lead?: React.ReactNode
  locale: string
  updated?: string
  children?: React.ReactNode
  /**
   * Kopniveau. 'h2' wanneer de hero als sectie ín een andere pagina staat —
   * de bootverhuurgids onderaan /boats — want die pagina heeft zijn eigen H1
   * en twee H1's op één pagina is er één te veel.
   */
  as?: 'h1' | 'h2'
}) {
  return (
    <section className="bg-white py-12 text-neutral-900 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Heading className="font-serif text-3xl font-black leading-tight tracking-tight md:text-5xl">{h1}</Heading>
        {lead ? <div className="mt-5 text-[17px] leading-relaxed text-neutral-700">{lead}</div> : null}
        {children}
        <LastUpdated iso={updated} locale={locale} />
      </div>
    </section>
  )
}

export interface ChoiceCard {
  title: string
  body: string
  /** Locale-agnostic path. */
  href: string
  cta: string
  /** Short qualifier line, e.g. "max 15 hp · 18+ · briefing included". */
  meta?: string
}

/** The two-to-four route-choice cards near the top of a hub page. */
export function ChoiceCards({ heading, cards, locale }: { heading: string; cards: ChoiceCard[]; locale: string }) {
  const l = loc(locale)
  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.href} className="flex flex-col rounded-2xl border border-black/10 bg-neutral-50 p-6">
              <h3 className="font-serif text-lg font-black leading-snug tracking-tight text-neutral-900">{c.title}</h3>
              {c.meta && <p className="mt-2 text-[13px] font-medium text-gold">{c.meta}</p>}
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-neutral-600">{c.body}</p>
              <Link
                href={`/${l}/${c.href.replace(/^\//, '')}`}
                className="mt-5 inline-flex w-fit items-center rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-neutral-700"
              >
                {c.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export interface PriceRow {
  label: string
  /** Amount in euros, or null when unconfirmed — renders "on request". */
  amount: number | null
  unit: string
  note?: string
}

/**
 * The "from" price table.
 *
 * A null amount renders the localised "on request" and never a placeholder,
 * a zero, or an invented figure — see the null contract in
 * src/lib/rental-prices.ts. The same nulls are what stop SchemaMarkup emitting
 * an Offer, so the visible table and the structured data agree by construction.
 */
export function PriceTable({
  heading,
  intro,
  rows,
  locale,
  caption,
}: {
  heading: string
  intro?: string
  rows: PriceRow[]
  locale: string
  caption?: string
}) {
  const l = loc(locale)
  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        {intro && <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">{intro}</p>}
        <div className="mt-7 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[15px]">
            {caption && <caption className="sr-only">{caption}</caption>}
            <tbody className="divide-y divide-black/8 border-y border-black/8">
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="py-4 pr-4 align-top font-serif text-[15px] font-bold text-neutral-900">
                    {r.label}
                    {r.note && <span className="mt-1 block text-[13px] font-normal text-neutral-500">{r.note}</span>}
                  </th>
                  <td className="whitespace-nowrap py-4 text-right align-top">
                    <span className="font-serif text-lg font-black text-neutral-900">
                      {r.amount === null ? ON_REQUEST[l] : `€${r.amount}`}
                    </span>
                    <span className="mt-1 block text-[13px] text-neutral-500">{r.unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export interface NamedItem {
  name: string
  body: string
}

/** A generic heading + intro + card-grid section (departure points, routes, conditions). */
export function ItemGrid({
  heading,
  intro,
  items,
  columns = 3,
  id,
}: {
  heading: string
  intro?: string
  items: NamedItem[]
  columns?: 2 | 3
  id?: string
}) {
  return (
    <section id={id} className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        {intro && <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">{intro}</p>}
        <div className={`mt-8 grid gap-5 ${columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {items.map((it) => (
            <div key={it.name} className="rounded-2xl border border-black/10 bg-neutral-50 p-6">
              <h3 className="font-serif text-base font-black leading-snug tracking-tight text-neutral-900">{it.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** A prose section: heading plus paragraphs. Used for first-hand/advice blocks. */
export function ProseSection({
  heading,
  paragraphs,
  id,
}: {
  heading: string
  paragraphs: string[]
  id?: string
}) {
  return (
    <section id={id} className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="mt-4 text-[16px] leading-relaxed text-neutral-700">{p}</p>
        ))}
      </div>
    </section>
  )
}

export interface LinkItem {
  label: string
  /** Locale-agnostic path. */
  href: string
  body?: string
}

/**
 * Internal links out of this page.
 *
 * Kept as an explicit component so the link graph is visible in the page source
 * rather than scattered through prose, which is what makes the matrix in
 * docs/internal-links.md auditable.
 */
export function InternalLinks({ heading, links, locale }: { heading: string; links: LinkItem[]; locale: string }) {
  const l = loc(locale)
  if (!links.length) return null
  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        <ul className="mt-7 grid gap-4 md:grid-cols-3">
          {links.map((lk) => (
            <li key={lk.href} className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
              <Link
                href={`/${l}/${lk.href.replace(/^\//, '')}`}
                className="font-serif text-[15px] font-bold text-neutral-900 underline underline-offset-2"
              >
                {lk.label}
              </Link>
              {lk.body && <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{lk.body}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
