import Link from 'next/link'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { PartnerLogo } from '@/components/partner/PartnerLogo'
import type { PARTNER_LOGOS } from '@/lib/partners'
import { WIBER_URL, CLICKANDBOAT_URL } from '@/lib/partners'
import { slugFor } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { RENTALS_SECTION, BOAT_PROMO, CAR_PROMO, BOAT_CATEGORIES, CAR_CATEGORIES, CATEGORIES_LABEL } from '@/lib/rental-promo-copy'
import { WiberBanner } from '@/components/partner/WiberBanner'
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
  /** Foto boven de kaart. Alleen eigen beeld — nooit stock voor een partner. */
  photo?: { src: string; alt: string }
  /** Wat je bij deze partner kunt huren. Het aanbod, niet de voorwaarden. */
  categories: string[]
  categoriesLabel: string
  /** Rendert onder de knop, achter toestemming. */
  banner?: React.ReactNode
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
    <div className="flex flex-col overflow-hidden rounded-3xl bg-obsidian text-white">
      {/* Alleen een band als er ook echt een foto is.
          Hier stond een ontworpen verloop voor de kaart zonder beeld, zodat
          beide kaarten even hoog begonnen. Dat werkte averechts: tweehonderd
          pixel bijna-zwart valt meer op dan een hoogteverschil. De kaart zonder
          foto begint nu bij de inhoud, en het raster laat de kaarten hun eigen
          hoogte houden in plaats van de kortste op te rekken. */}
      {data.photo && (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <img
            src={data.photo.src}
            alt={data.photo.alt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Verloop, zodat witte tekst op elke foto leesbaar blijft in plaats
              van te hopen dat de onderkant toevallig donker is. */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-6 pb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white drop-shadow">{data.kicker}</p>
            <div className="flex h-5 items-center opacity-90">
              <PartnerLogo partner={data.logoKey} name={data.logoName} on="dark" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col p-6 md:p-7">
        {!data.photo && (
          /* Kicker en merk op één regel: leest als een kop in plaats van als
             twee losse bovenkopjes onder elkaar, en scheelt een regel. */
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">{data.kicker}</p>
            <div className="flex h-5 items-center opacity-90">
              <PartnerLogo partner={data.logoKey} name={data.logoName} on="dark" />
            </div>
          </div>
        )}
        <div className="flex items-start justify-between gap-5">
          <h3 className="font-serif text-[22px] font-black leading-tight tracking-tight text-white md:text-2xl">
            {data.heading}
          </h3>
          {data.price !== null && (
            <p className="shrink-0 text-right">
              <span className="font-serif text-2xl font-black leading-none text-white">€{data.price}</span>
              <span className="mt-0.5 block text-[11px] font-normal leading-tight text-white/55">{data.priceLabel}</span>
            </p>
          )}
        </div>

        <p className="mt-3 text-[14px] leading-relaxed text-white/70">{data.lead}</p>

        {/* Voorwaarden op één regel in plaats van als opsomming: het waren drie
            korte feiten die drie volle regels kregen. */}
        <p className="mt-3 text-[13px] leading-relaxed text-white/55">{data.points.join(' · ')}</p>

        {/* Het aanbod zelf. De kaart noemde alleen voorwaarden, waardoor er
            nergens stond wat je hier eigenlijk kunt huren. */}
        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{data.categoriesLabel}</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {data.categories.map((c) => (
              <li
                key={c}
                className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[12px] font-medium text-white/85"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <AffiliateLink href={data.href} partner={data.partner} locale={locale}>
            {data.cta}
          </AffiliateLink>
          <Link
            href={data.readMoreHref}
            className="rounded-full text-[13px] font-semibold text-white/80 underline underline-offset-4 outline-none transition-colors hover:text-gold-soft focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          >
            {data.readMore} →
          </Link>
        </div>
        {data.banner}
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

  // Eigen vlootfoto, geen stock: de boot op de kaart is een boot die we echt
  // varen. Vast gekozen (niet willekeurig) zodat build en client hetzelfde
  // beeld renderen en er geen hydration-verschil ontstaat.
  const heroBoat = FLEET.find((b) => b.image?.includes('cap-camarat')) ?? priced[0] ?? FLEET[0]

  const boat: CardData = {
    kicker: BOAT_PROMO.kicker[l],
    photo: heroBoat?.image
      ? { src: heroBoat.image, alt: `${heroBoat.model} — ${heroBoat.marina}, Ibiza` }
      : undefined,
    categories: BOAT_CATEGORIES[l],
    categoriesLabel: CATEGORIES_LABEL[l],
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
    // Geen foto: we hebben geen eigen beeld van Wiber's vloot, en een
    // stockauto naast een echte boot verkoopt een auto die niet bestaat. De
    // officiële Awin-banner onderaan is wél echt beeld van de partner, en die
    // mogen we tonen — achter toestemming, omdat hij de vertoning meetelt.
    categories: CAR_CATEGORIES[l],
    categoriesLabel: CATEGORIES_LABEL[l],
    banner: <WiberBanner className="mt-1" />,
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
    <section className="bg-white py-12 text-neutral-900 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{RENTALS_SECTION.eyebrow[l]}</p>
        <h2 className="mt-2 max-w-3xl font-serif text-[26px] font-black leading-[1.1] tracking-tight md:text-4xl">
          {RENTALS_SECTION.heading[l]}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-600">{RENTALS_SECTION.lead[l]}</p>

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-2">
          <RentalCard data={boat} locale={l} />
          <RentalCard data={car} locale={l} />
        </div>
      </div>
    </section>
  )
}
