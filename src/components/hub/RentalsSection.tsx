import Link from 'next/link'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { PartnerLogo } from '@/components/partner/PartnerLogo'
import type { PARTNER_LOGOS } from '@/lib/partners'
import { WIBER_URL, CLICKANDBOAT_URL } from '@/lib/partners'
import { slugFor } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { RENTALS_SECTION, BOAT_PROMO, CAR_PROMO } from '@/lib/rental-promo-copy'
import { FLEET } from '@/data/fleet'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { localeTag } from '@/lib/date-label'

/**
 * Boat and car hire, as one section rather than two afterthoughts.
 *
 * The two promos previously sat at the very bottom of the homepage — below
 * Instagram, the newsletter and the category grid — stacked as two identical
 * full-width dark blocks. Two problems: almost nobody scrolls that far, and two
 * identical blocks in a row read as the same thing repeated rather than as two
 * offers.
 *
 * So they are one section now, with a shared heading that says why they belong
 * together ("a boat for the water, a car for the island"), and a 2-up pair
 * instead of a stack. A pair is not the three-equal-cards trap: these are
 * genuinely parallel, and putting them side by side is what lets a reader
 * compare rather than scroll past the second one.
 *
 * ── Prices ────────────────────────────────────────────────────────────────
 * The boat figure is the real minimum day rate from FLEET, the same source the
 * fleet price block reads. The car figure comes from RENTAL_PRICES and is null
 * until confirmed — the block then renders without a number rather than with an
 * invented one.
 *
 * ── Colour ────────────────────────────────────────────────────────────────
 * Dark cards on a white section, so the pair reads as a distinct block in a
 * page that is otherwise light. `gold` fills, `gold-soft` writes on dark: the
 * config measures gold on obsidian at 3.68:1, which fails AA for text.
 */

interface CardData {
  kicker: string
  /** Key in PARTNER_LOGOS — renders the logo once the asset exists. */
  logoKey: keyof typeof PARTNER_LOGOS
  logoName: string
  heading: string
  lead: string
  points: string[]
  price: number | null
  priceLabel: string
  href: string
  cta: string
  partner: string
  readMore: string
  readMoreHref: string
}

function RentalCard({ data, locale }: { data: CardData; locale: Locale }) {
  return (
    <div className="flex flex-col rounded-3xl bg-obsidian p-7 text-white md:p-8">
      {/* Toont het echte logo zodra het in public/partners staat; tot die tijd
          de naam als wordmark. Zie PARTNER_LOGOS in lib/partners.ts. */}
      <div className="flex h-7 items-center">
        <PartnerLogo partner={data.logoKey} name={data.logoName} on="dark" />
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{data.kicker}</p>

      <div className="mt-4 flex items-start justify-between gap-5">
        <h3 className="font-serif text-2xl font-black leading-tight tracking-tight text-white">{data.heading}</h3>
        {data.price !== null && (
          <p className="shrink-0 text-right">
            <span className="font-serif text-2xl font-black leading-none text-white">€{data.price}</span>
            <span className="mt-1 block text-[12px] font-normal leading-tight text-white/55">{data.priceLabel}</span>
          </p>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-white/75">{data.lead}</p>

      <ul className="mt-5 flex-1 space-y-2">
        {data.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-[14px] leading-relaxed text-white/85">
            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-soft" />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-col gap-4">
        <AffiliateLink href={data.href} partner={data.partner} locale={locale}>
          {data.cta}
        </AffiliateLink>
        <Link
          href={data.readMoreHref}
          className="w-fit rounded-full text-[14px] font-semibold text-white underline underline-offset-4 outline-none transition-colors hover:text-gold-soft focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
        >
          {data.readMore} →
        </Link>
      </div>
    </div>
  )
}

export function RentalsSection({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  // Real lowest day rate from our own fleet, or nothing at all.
  const priced = FLEET.filter((b) => b?.price?.low)
  const boatFrom = priced.length ? Math.min(...priced.map((b) => b.price.low)) : null
  const nf = new Intl.NumberFormat(localeTag(l), { maximumFractionDigits: 0 })

  const boat: CardData = {
    kicker: BOAT_PROMO.kicker[l],
    logoKey: 'clickandboat',
    logoName: 'Click&Boat',
    heading: BOAT_PROMO.heading[l],
    lead: BOAT_PROMO.lead[l],
    points: BOAT_PROMO.points[l],
    price: boatFrom === null ? null : Number(nf.format(boatFrom).replace(/\D/g, '')),
    priceLabel: BOAT_PROMO.fromLabel[l],
    href: CLICKANDBOAT_URL,
    cta: BOAT_PROMO.cta[l],
    partner: 'Click&Boat',
    readMore: BOAT_PROMO.readMore[l],
    readMoreHref: `/${l}/${slugFor('boat-rental', l)}`,
  }

  const car: CardData = {
    kicker: CAR_PROMO.kicker[l],
    logoKey: 'wiber',
    logoName: 'Wiber Rent a Car',
    heading: CAR_PROMO.heading[l],
    lead: CAR_PROMO.lead[l],
    points: CAR_PROMO.points[l],
    price: RENTAL_PRICES.carPerDay.amount,
    priceLabel: CAR_PROMO.fromLabel[l],
    href: WIBER_URL,
    cta: CAR_PROMO.cta[l],
    partner: 'Wiber Rent a Car',
    readMore: CAR_PROMO.readMore[l],
    readMoreHref: `/${l}/${slugFor('car-rental', l)}`,
  }

  return (
    <section className="bg-white py-16 text-neutral-900 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{RENTALS_SECTION.eyebrow[l]}</p>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-black leading-[1.1] tracking-tight md:text-4xl">
          {RENTALS_SECTION.heading[l]}
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-neutral-600">{RENTALS_SECTION.lead[l]}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <RentalCard data={boat} locale={l} />
          <RentalCard data={car} locale={l} />
        </div>
      </div>
    </section>
  )
}
