import Link from 'next/link'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { PartnerLogo } from '@/components/partner/PartnerLogo'
import type { PARTNER_LOGOS } from '@/lib/partners'
import { WIBER_URL, CLICKANDBOAT_URL } from '@/lib/partners'
import { slugFor } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { RENTALS_SECTION, BOAT_PROMO, CAR_PROMO } from '@/lib/rental-promo-copy'
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
 *
 * ── Waarom dit een banner is en geen uitleg ───────────────────────────────
 * De kaart droeg de hele pitch: een inleiding van twee zinnen, drie
 * voorwaarden op een rij, en daaronder vier chips met wat je kunt huren. Op
 * een telefoon was één kaart daarmee bijna twee schermen hoog, en er stonden
 * er twee onder elkaar — je scrolde vier schermen door een aanbod waar je nog
 * niet op geklikt had.
 *
 * Dat is ook de verkeerde plek voor die tekst. `/boat-rental-ibiza` en
 * `/wiber-car-rental-ibiza` zijn de pagina's die dié zoekintentie dragen, met
 * de voorwaarden, de prijzen en de FAQ. De homepage hoeft alleen te laten zien
 * dát het er is en wie de partner is. Dus: beeld, naam, vanafprijs, knop, en
 * een link naar de pagina die de rest vertelt.
 *
 * Wat er dus bewust NIET meer staat: `lead`, `points` en de categorie-chips
 * (`BOAT_CATEGORIES` / `CAR_CATEGORIES` / `CATEGORIES_LABEL` in
 * rental-promo-copy.ts). Die teksten zijn niet verwijderd — ze staan er nog
 * voor het geval de partnerpagina's ze willen overnemen — maar ze worden hier
 * niet meer gerenderd.
 */

interface CardData {
  kicker: string
  /** Foto boven de kaart. Alleen eigen beeld — nooit stock voor een partner. */
  photo?: { src: string; alt: string }
  /** Officiële partnerbanner. Rendert achter toestemming, of helemaal niet. */
  banner?: React.ReactNode
  /** Key in PARTNER_LOGOS — renders the logo once the asset exists. */
  logoKey: keyof typeof PARTNER_LOGOS
  logoName: string
  heading: string
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
      {/* Beeldband. Alleen als er ook echt beeld is: hier stond ooit een
          ontworpen verloop voor de kaart zonder foto zodat beide kaarten even
          hoog begonnen, en tweehonderd pixel bijna-zwart viel meer op dan het
          hoogteverschil dat het moest verbergen. 16/6 in plaats van 21/9 —
          een band, geen halve pagina. */}
      {data.photo && (
        <div className="relative aspect-[16/6] w-full overflow-hidden">
          <img
            src={data.photo.src}
            alt={data.photo.alt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Verloop, zodat witte tekst op elke foto leesbaar blijft in plaats
              van te hopen dat de onderkant toevallig donker is. */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white drop-shadow">{data.kicker}</p>
            <div className="flex h-4 items-center opacity-90">
              <PartnerLogo partner={data.logoKey} name={data.logoName} on="dark" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5">
        {!data.photo && (
          /* Kicker en merk op één regel: leest als een kop in plaats van als
             twee losse bovenkopjes onder elkaar, en scheelt een regel. */
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">{data.kicker}</p>
            <div className="flex h-4 items-center opacity-90">
              <PartnerLogo partner={data.logoKey} name={data.logoName} on="dark" />
            </div>
          </div>
        )}

        {/* Naam en vanafprijs op één regel — dat is wat de bezoeker hier moet
            weten. De voorwaarden staan op de pagina achter "meer info". */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-lg font-black leading-tight tracking-tight text-white md:text-xl">
            {data.heading}
          </h3>
          {data.price !== null && (
            <p className="shrink-0 text-right">
              <span className="font-serif text-xl font-black leading-none text-white">€{data.price}</span>
              <span className="mt-0.5 block text-[10px] font-normal leading-tight text-white/55">{data.priceLabel}</span>
            </p>
          )}
        </div>

        {/* De officiële partnerbanner. Bij Wiber is dit het enige echte beeld
            dat we van die partner mogen tonen, en het vervangt hier de foto. */}
        {data.banner}

        {/* mt-auto houdt de actieregels van beide kaarten op één lijn, ook als
            de ene een foto heeft en de andere een banner die pas na
            toestemming verschijnt. */}
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
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
    logoKey: 'clickandboat',
    logoName: 'Click&Boat',
    heading: BOAT_PROMO.heading[l],
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
    banner: <WiberBanner className="w-full" />,
    logoKey: 'wiber',
    logoName: 'Wiber Rent a Car',
    heading: CAR_PROMO.heading[l],
    price: RENTAL_PRICES.carPerDay.amount,
    priceLabel: CAR_PROMO.fromLabel[l],
    href: WIBER_URL,
    cta: CAR_PROMO.cta[l],
    partner: 'Wiber Rent a Car',
    readMore: CAR_PROMO.readMore[l],
    readMoreHref: `/${l}/${slugFor('car-rental', l)}`,
  }

  return (
    <section className="bg-white py-10 text-neutral-900 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{RENTALS_SECTION.eyebrow[l]}</p>
        <h2 className="mt-2 max-w-3xl font-serif text-[26px] font-black leading-[1.1] tracking-tight md:text-4xl">
          {RENTALS_SECTION.heading[l]}
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <RentalCard data={boat} locale={l} />
          <RentalCard data={car} locale={l} />
        </div>
      </div>
    </section>
  )
}
