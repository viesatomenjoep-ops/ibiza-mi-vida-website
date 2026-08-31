import Link from 'next/link'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * The layout for a partner dossier page.
 *
 * ── Art direction: "dossier" ──────────────────────────────────────────────
 * A deliberately different rhythm from the hub pages, which run
 * hero → three cards → table → grids. That shape is fine for a category page
 * and wrong here: a reader on a partner page is doing due diligence, not
 * browsing, and three equal cards is the layout that says "we had nothing
 * specific to tell you".
 *
 * So: a dark masthead carrying the facts a sceptic checks first, then a light
 * editorial body — a real spec table, a numbered pick-up sequence, and a
 * candid two-column "suits / does not suit" split that says out loud who
 * should book elsewhere. The verdict block ends it, because that is the
 * question the visitor arrived with.
 *
 * ── Tokens ────────────────────────────────────────────────────────────────
 * Taken from the codebase, not invented: obsidian ground, `gold` for fills and
 * `gold-soft` for accent TEXT on dark. That split is load-bearing — the
 * tailwind config measures `gold` on obsidian at 3.68:1, which fails AA for
 * text, while `gold-soft` reads 8.30:1.
 *
 * ── Honesty ───────────────────────────────────────────────────────────────
 * `disclaimer` is required, not optional. A page titled after somebody else's
 * company on our domain has to say plainly that it is ours and not theirs,
 * or it reads as the partner's own site.
 */

export interface Fact {
  label: string
  value: string
}

export interface Step {
  title: string
  body: string
}

export interface PartnerDossierProps {
  locale: string
  /** Partner name as they write it, e.g. 'Wiber Rent a Car'. */
  partner: string
  /** Short label above the H1, e.g. 'Our car rental partner'. */
  kicker: string
  h1: string
  /** Answer-first opening. Must carry a concrete figure. */
  lead: React.ReactNode
  /** The three or four numbers a sceptic checks first. */
  headline: Fact[]
  /** Full spec table. */
  factsHeading: string
  facts: Fact[]
  /** Numbered sequence — booking or pick-up. */
  stepsHeading: string
  steps: Step[]
  /** Honest split. */
  suitsHeading: string
  suits: string[]
  notSuitsHeading: string
  notSuits: string[]
  /** Closing judgement, in our own voice. */
  verdictHeading: string
  verdict: string[]
  /** Outbound affiliate link. */
  href: string
  cta: string
  /** Locale-agnostic path of the pillar this dossier hangs under. */
  pillarPath: string
  pillarLabel: string
  /** Required: states that this page is ours, not the partner's. */
  disclaimer: string
  children?: React.ReactNode
}

export function PartnerDossier({
  locale,
  partner,
  kicker,
  h1,
  lead,
  headline,
  factsHeading,
  facts,
  stepsHeading,
  steps,
  suitsHeading,
  suits,
  notSuitsHeading,
  notSuits,
  verdictHeading,
  verdict,
  href,
  cta,
  pillarPath,
  pillarLabel,
  disclaimer,
  children,
}: PartnerDossierProps) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <section className="bg-obsidian text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-soft">{kicker}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-3xl font-black leading-[1.08] tracking-tight md:text-5xl">
            {h1}
          </h1>
          <div className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">{lead}</div>

          {/* Fact strip — asymmetric on purpose, not a card triptych. */}
          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {headline.map((f) => (
              <div key={f.label} className="bg-obsidian-card px-5 py-4">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{f.label}</dt>
                <dd className="mt-1.5 font-serif text-lg font-black leading-tight text-white">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <AffiliateLink href={href} partner={partner} locale={l}>
              {cta}
            </AffiliateLink>
            <Link
              href={`/${l}/${pillarPath.replace(/^\//, '')}`}
              className="rounded-full px-1 py-1 text-[14px] font-semibold text-white underline underline-offset-4 outline-none transition-colors hover:text-gold-soft focus-visible:ring-2 focus-visible:ring-gold-soft"
            >
              {pillarLabel} →
            </Link>
          </div>

          <p className="mt-8 max-w-2xl border-l-2 border-white/15 pl-4 text-[13px] leading-relaxed text-white/50">
            {disclaimer}
          </p>
        </div>
      </section>

      {/* ── Spec table ───────────────────────────────────────────────────── */}
      <section className="bg-white py-14 text-neutral-900">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{factsHeading}</h2>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[15px]">
              <tbody className="divide-y divide-black/8 border-y border-black/8">
                {facts.map((f) => (
                  <tr key={f.label}>
                    <th scope="row" className="w-2/5 py-4 pr-6 align-top font-serif text-[15px] font-bold text-neutral-900">
                      {f.label}
                    </th>
                    <td className="py-4 align-top leading-relaxed text-neutral-600">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Numbered sequence ────────────────────────────────────────────── */}
      <section className="border-t border-black/5 bg-neutral-50 py-14 text-neutral-900">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{stepsHeading}</h2>
          <ol className="mt-8 space-y-7">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-serif text-[14px] font-black text-white"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-base font-black leading-snug text-neutral-900">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Suits / does not suit ────────────────────────────────────────── */}
      <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
        <div className="mx-auto grid max-w-4xl gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl font-black tracking-tight text-neutral-900">{suitsHeading}</h2>
            <ul className="mt-5 space-y-3">
              {suits.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-neutral-700">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:border-l md:border-black/8 md:pl-10">
            <h2 className="font-serif text-xl font-black tracking-tight text-neutral-900">{notSuitsHeading}</h2>
            <ul className="mt-5 space-y-3">
              {notSuits.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-neutral-700">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {children}

      {/* ── Verdict ──────────────────────────────────────────────────────── */}
      <section className="border-t border-black/5 bg-white pb-16 pt-14 text-neutral-900">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{verdictHeading}</h2>
          {verdict.map((p, i) => (
            <p key={i} className="mt-4 text-[16px] leading-relaxed text-neutral-700">
              {p}
            </p>
          ))}
          <div className="mt-9">
            <AffiliateLink href={href} partner={partner} locale={l}>
              {cta}
            </AffiliateLink>
          </div>
        </div>
      </section>
    </>
  )
}
