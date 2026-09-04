import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { PartnerLogo } from '@/components/partner/PartnerLogo'
import { PARTNER_LOGOS } from '@/lib/partners'
import { WIBER_URL, CLICKANDBOAT_URL } from '@/lib/partners'
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
 * ── Kleur ────────────────────────────────────────────────────────────────
 * Witte kaarten met zwarte tekst. Ze waren obsidian met witte letters, en op
 * een telefoon stonden er dan twee bijna-zwarte blokken midden in een verder
 * witte pagina -- dat leest als een advertentie die per ongeluk is
 * meegeladen, niet als een aanbod van de site zelf. Alles wat op een donkere
 * ondergrond was uitgedacht (goud op zwart, witte doorverwijzingen, het
 * verloop over de foto) is meegegaan naar zwart op wit.
 *
 * ── Onder elkaar, niet naast elkaar ──────────────────────────────────────
 * Twee kaarten naast elkaar lezen als één keuze met twee opties. Dit zijn
 * twee losse dingen: een boot voor op het water, en daaronder een auto voor
 * op het land.
 *
 * ── Waarom dit een banner is en geen uitleg ───────────────────────────────
 * De kaart droeg de hele pitch: een inleiding van twee zinnen, drie
 * voorwaarden op een rij, en daaronder vier chips met wat je kunt huren. Op
 * een telefoon was één kaart daarmee bijna twee schermen hoog, en er stonden
 * er twee onder elkaar -- je scrolde vier schermen door een aanbod waar je nog
 * niet op geklikt had.
 *
 * Dat is ook de verkeerde plek voor die tekst. `/boats` en de autopagina zijn
 * de pagina's die dié zoekintentie dragen, met de voorwaarden, de prijzen en
 * de FAQ. De homepage hoeft alleen te laten zien dat het er is en wie de
 * partner is. Dus: beeld, naam, vanafprijs, knop. Verder niets.
 *
 * Wat er dus bewust NIET meer staat: `lead`, `points`, de categorie-chips, de
 * "meer info"-doorverwijzing en de Awin-banner van Wiber. Die teksten en dat
 * beeld zijn niet verwijderd uit de codebase -- ze staan er nog voor de
 * partnerpagina's -- maar ze worden hier niet meer gerenderd.
 */

interface CardData {
  kicker: string
  /** Foto boven de kaart. Alleen eigen beeld — nooit stock voor een partner. */
  photo?: { src: string; alt: string }
  /** Key in PARTNER_LOGOS — renders the logo once the asset exists. */
  logoKey: keyof typeof PARTNER_LOGOS
  logoName: string
  /** Is er een echt logobestand? Zo nee, dan valt het terug op de naam. */
  hasLogo: boolean
  heading: string
  price: number | null
  priceLabel: string
  href: string
  cta: string
  partner: string
}

function RentalCard({ data, locale }: { data: CardData; locale: Locale }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white text-neutral-900 shadow-[0_18px_40px_-32px_rgba(0,0,0,.5)]">
      {/* Beeldband. Alleen als er ook echt beeld is: voor Wiber hebben we geen
          eigen foto van hun vloot, en een stockauto naast een echte boot
          verkoopt een auto die niet bestaat. Die kaart begint dus meteen bij
          de tekst. */}
      {data.photo && (
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-neutral-100">
          <img
            src={data.photo.src}
            alt={data.photo.alt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">{data.kicker}</p>
          <div className="flex h-6 items-center">
            {/* Zonder eigen class valt de terugvalnaam in goud uit, en goud op
                wit is niet te lezen. Zwart dus, zolang een partner nog geen
                logobestand heeft aangeleverd. */}
            <PartnerLogo
              partner={data.logoKey}
              name={data.logoName}
              on="light"
              className={data.hasLogo ? 'h-6 w-auto object-contain' : 'text-[11px] font-black uppercase tracking-[0.2em] text-neutral-900'}
            />
          </div>
        </div>

        {/* Naam en vanafprijs op één regel — dat is wat de bezoeker hier moet
            weten. De voorwaarden staan op de pagina achter de knop. */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-black leading-tight tracking-tight text-neutral-900 md:text-2xl">
            {data.heading}
          </h3>
          {data.price !== null && (
            <p className="shrink-0 text-right">
              <span className="font-serif text-2xl font-black leading-none text-neutral-900">&euro;{data.price}</span>
              <span className="mt-0.5 block text-[10px] font-semibold leading-tight text-neutral-500">{data.priceLabel}</span>
            </p>
          )}
        </div>

        <div className="mt-auto pt-1">
          <AffiliateLink href={data.href} partner={data.partner} locale={locale}>
            {data.cta}
          </AffiliateLink>
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
    hasLogo: Boolean(PARTNER_LOGOS.clickandboat.light || PARTNER_LOGOS.clickandboat.dark),
    heading: BOAT_PROMO.heading[l],
    price: boatFrom === null ? null : Number(nf.format(boatFrom).replace(/\D/g, '')),
    priceLabel: BOAT_PROMO.fromLabel[l],
    href: CLICKANDBOAT_URL,
    cta: BOAT_PROMO.cta[l],
    partner: 'Click&Boat',
  }

  const car: CardData = {
    kicker: CAR_PROMO.kicker[l],
    // Geen foto: we hebben geen eigen beeld van Wiber's vloot, en een
    // stockauto naast een echte boot verkoopt een auto die niet bestaat.
    logoKey: 'wiber',
    logoName: 'Wiber Rent a Car',
    hasLogo: Boolean(PARTNER_LOGOS.wiber.light || PARTNER_LOGOS.wiber.dark),
    heading: CAR_PROMO.heading[l],
    price: RENTAL_PRICES.carPerDay.amount,
    priceLabel: CAR_PROMO.fromLabel[l],
    href: WIBER_URL,
    cta: CAR_PROMO.cta[l],
    partner: 'Wiber Rent a Car',
  }

  return (
    <section className="bg-white py-10 text-neutral-900 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{RENTALS_SECTION.eyebrow[l]}</p>
        <h2 className="mt-2 max-w-3xl font-serif text-[26px] font-black leading-[1.1] tracking-tight md:text-4xl">
          {RENTALS_SECTION.heading[l]}
        </h2>

        {/* Onder elkaar, niet naast elkaar. Naast elkaar leest als één keuze
            met twee opties; dit zijn twee losse dingen -- een boot voor op het
            water, en daaronder een auto voor op het land. */}
        <div className="mt-6 grid max-w-3xl gap-5">
          <RentalCard data={boat} locale={l} />
          <RentalCard data={car} locale={l} />
        </div>
      </div>
    </section>
  )
}
