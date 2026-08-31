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
          'inline-flex w-fit items-center rounded-full bg-gold px-6 py-3 text-[15px] font-semibold text-neutral-900 hover:brightness-95'
        }
      >
        {children}
      </a>
      {showDisclosure && (
        <span className="text-[12px] leading-snug text-neutral-500">{DISCLOSURE[l](partner)}</span>
      )}
    </span>
  )
}
