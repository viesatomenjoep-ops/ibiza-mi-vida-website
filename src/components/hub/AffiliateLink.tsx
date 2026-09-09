import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Every outbound link to a commercial partner goes through this component.
 *
 * The reason it exists is that `rel="sponsored"` was missing from all of them.
 * Not some — all: a grep for it across src/ returned nothing while the site
 * carried ClubTickets deeplinks throughout. Google asks that monetised
 * outbound links be qualified, and an unqualified affiliate link is a link
 * scheme in their guidelines. The fix that lasts is not "remember to add the
 * attribute": it is a component that cannot render without it.
 *
 * So this element hardcodes the whole set and exposes no way to override it:
 *
 *   rel="sponsored noopener noreferrer"   target="_blank"
 *
 * `noopener` is a security requirement rather than an SEO one — a target=_blank
 * link without it hands the opened page a `window.opener` reference back to
 * ours.
 *
 * `disclosure` renders a short visible note next to the link. Affiliate
 * relationships have to be disclosed to the reader, not only to the crawler,
 * and a component is the only place that stays consistent.
 *
 * NEVER replace a use of this with a bare <a> to a partner. If a partner link
 * needs behaviour this does not have, add it here.
 */

const DISCLOSURE: Record<Locale, (partner: string) => string> = {
  nl: (p) => `Partnerlink naar ${p}. Wij ontvangen een commissie; jij betaalt niets extra.`,
  en: (p) => `Partner link to ${p}. We earn a commission; it costs you nothing extra.`,
  de: (p) => `Partnerlink zu ${p}. Wir erhalten eine Provision; für dich ohne Aufpreis.`,
  es: (p) => `Enlace de afiliado a ${p}. Recibimos una comisión; a ti no te cuesta nada más.`,
  fr: (p) => `Lien partenaire vers ${p}. Nous percevons une commission, sans surcoût pour vous.`,
}

export interface AffiliateLinkProps {
  /** The partner's destination URL — a deeplink, never a copy of their page. */
  href: string
  /** Partner name, used in the visible disclosure, e.g. 'Click&Boat'. */
  partner: string
  locale: string
  children: React.ReactNode
  className?: string
  /** Set false only where a disclosure already appears next to the link. */
  showDisclosure?: boolean
}

export function AffiliateLink({
  href,
  partner,
  locale,
  children,
  className,
  showDisclosure = true,
}: AffiliateLinkProps) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  return (
    <span className="inline-flex flex-col gap-1.5">
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={
          className ??
          // Witte tekst en niet neutral-900. `bg-gold` rendert als #0E7C66
          // (het gold-token is ooit hergebruikt voor groen) en daar haalt
          // neutral-900 op 15px maar 3,49:1 -- onder de 4,5 van AA. Wit komt
          // op 5,13:1. Dit stond hier al voor de palletwissel.
          'inline-flex w-fit items-center rounded-full bg-gold px-6 py-3 text-[15px] font-semibold text-white hover:brightness-95'
        }
      >
        {children}
      </a>
      {showDisclosure && (
        <span
          /* Kleur erven in plaats van vastzetten. Deze mededeling staat op twee
             soorten ondergrond: op wit onder een partnerkaart, en op obsidian
             in de vlootsectie. Met een vaste grijstint gaat er altijd één mis --
             neutral-500 haalde 4,12 op wit en neutral-600 zakte op obsidian
             naar 2,50. Door de kleur van de omgeving te erven en alleen wat
             dekking weg te nemen klopt het op allebei: ongeveer 12,6 op wit en
             12,2 op obsidian. */
          className="text-[12px] leading-snug opacity-80"
        >{DISCLOSURE[l](partner)}</span>
      )}
    </span>
  )
}
