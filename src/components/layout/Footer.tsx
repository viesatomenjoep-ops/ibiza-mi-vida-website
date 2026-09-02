'use client'

import { GoogleRatingLine, type GoogleRating } from '@/components/reviews/GoogleRatingLine'
import { FLEET } from '@/data/fleet'
import { optImg } from '@/lib/img'

/**
 * Achtergrondmozaïek van boten en activiteiten, over de hele footer.
 *
 * Hier stonden drie losse vlootfoto's absoluut gepositioneerd — één
 * rechtsboven, één linksonder, één onderin. Op elk ander formaat dan waarop
 * ze waren neergezet vielen ze half buiten beeld of lieten ze de helft van de
 * footer leeg, en dat zag eruit als een afbeelding die niet geladen was.
 *
 * Nu een raster dat `inset-0` vult: 3 kolommen op mobiel, 6 op desktop, met
 * `auto-rows-fr` zodat de rijen samen altijd precies de hoogte van de footer
 * innemen — geen gaten, geen overloop, op elk formaat. Twaalf tegels: op
 * desktop 6×2, op mobiel 3×4, beide gevuld.
 *
 * De tegels wisselen boten (uit de eigen vloot) af met activiteiten en
 * boottochten uit de ClubTickets-feed, die de layout server-side meegeeft.
 * Decoratie, geen inhoud: aria-hidden, pointer-events none, grayscale, en
 * 7% dekking — de footer is wit met donkere tekst, en 7% beeld daaronder
 * verandert de gemeten contrastwaarden niet noemenswaardig. Kleine
 * afmetingen via optImg: twaalf plaatjes op 7% hoeven geen megabytes te zijn.
 *
 * Vaste keuze uit de vloot (op prijs gesorteerd, gelijk verdeeld) in plaats
 * van willekeur: dezelfde build toont dezelfde footer en er is geen
 * hydration-verschil.
 */
const FOOT_TILES = 12
const FOOT_BOATS = (() => {
  const opPrijs = [...FLEET].sort((a, b) => b.price.high - a.price.high)
  const stap = Math.max(1, Math.floor(opPrijs.length / 6))
  return Array.from({ length: 6 }, (_, i) => opPrijs[i * stap]).filter(Boolean).map(b => b.image)
})()

/** Boten en activiteiten om en om, tot FOOT_TILES tegels. */
function footTiles(activities: string[]): string[] {
  const out: string[] = []
  const a = [...FOOT_BOATS], b = [...activities]
  while (out.length < FOOT_TILES && (a.length || b.length)) {
    const x = a.shift(); if (x) out.push(x)
    const y = b.shift(); if (y && out.length < FOOT_TILES) out.push(y)
  }
  // Te weinig bronbeeld? Dan herhalen tot het raster vol is — een gat in het
  // mozaïek valt meer op dan een tegel die twee keer voorkomt.
  let i = 0
  while (out.length < FOOT_TILES && out.length) out.push(out[i++ % out.length])
  return out
}

import { clearConsent } from '@/lib/consent'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { slugFor } from '@/lib/route-slugs'
import { DEFAULT_LOCALE, LOCALES as SEO_LOCALES, type Locale } from '@/lib/seo'

import en from '@/dictionaries/en.json'
import nl from '@/dictionaries/nl.json'
import es from '@/dictionaries/es.json'
import de from '@/dictionaries/de.json'
import fr from '@/dictionaries/fr.json'

const dicts: Record<string, any> = { en, nl, es, de, fr }

const LOCALES = [
  { code: 'nl' },
  { code: 'en' },
  { code: 'es' },
  { code: 'de' },
  { code: 'fr' },
]

export function Footer({ rating = null, activityImages = [] }: {
  rating?: GoogleRating | null
  /** Covers van boot- en activiteitenvenues uit de ClubTickets-feed; zie layout.tsx. */
  activityImages?: string[]
}) {
  const tiles = footTiles(activityImages)
  const pathname = usePathname()
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]
  const base = `/${currentLocale.code}`
  const t = dicts[currentLocale.code] || dicts['en']
  const l: Locale = (SEO_LOCALES as readonly string[]).includes(currentLocale.code) ? (currentLocale.code as Locale) : DEFAULT_LOCALE

  const groups = [
    {
      id: 'events',
      title: t.nav_events_tickets || 'Events & Tickets',
      links: [
        { href: `${base}/artists`, label: t.nav_artists || 'Artiesten' },
        { href: `${base}/club-tickets`, label: t.nav_club_tickets || 'Club Tickets' },
        { href: `${base}/clubs`, label: t.nav_clubs_ibiza || 'Clubs Ibiza' },
      ],
    },
    {
      id: 'water',
      title: t.nav_on_the_water || 'Op het water',
      links: [
        { href: `${base}/boats`, label: t.nav_boats_hub || 'Ibiza per boot' },
        { href: `${base}/${slugFor('boat-rental', l)}`, label: t.nav_boat_rental || 'Boat Rental Ibiza' },
        { href: `${base}/private-boat-charters`, label: t.nav_private_charters || 'Private Boat Charters' },
        { href: `${base}/boat-party`, label: t.nav_boat_party || 'Boat Parties' },
        { href: `${base}/shuttle-ferry`, label: t.nav_shuttle_ferry || 'Shuttle Ferry' },
        { href: `${base}/ferry-formentera`, label: t.nav_ferry_formentera || 'Ferry Ibiza – Formentera' },
      ],
    },
    {
      id: 'island',
      title: t.nav_experience_island || 'Beleef & Insider',
      links: [
        { href: `${base}/activities`, label: t.nav_activities || 'Activities' },
        { href: `${base}/water-sports`, label: t.nav_water_sports || 'Water Sports' },
        { href: `${base}/beach-clubs`, label: t.nav_beach_clubs || 'Beach Clubs' },
        { href: `${base}/${slugFor('car-rental', l)}`, label: t.nav_car_rental || 'Car Rental Ibiza' },
        { href: `${base}/guestlist`, label: t.nav_guestlist || 'Guestlist' },
        { href: `${base}/package-deals`, label: t.nav_packages || 'Package deals' },
        { href: `${base}/tips`, label: t.nav_tips || 'Ibiza Tips' },
        { href: `${base}/locations`, label: t.nav_locations || 'Gebieden op Ibiza' },
      ],
    },
    {
      // E-E-A-T: About and Contact had ZERO internal links anywhere on the
      // site, so the two pages Google's quality guidelines look at to decide
      // whether a business is real were effectively orphaned. The footer is
      // where users and crawlers both expect them.
      id: 'company',
      title: t.nav_company || 'Ibiza Mi Vida',
      links: [
        { href: `${base}/about-us`, label: t.nav_about || 'Over ons' },
        { href: `${base}/contact`, label: t.nav_contact || 'Contact' },
        { href: `${base}/faq`, label: t.nav_faq || 'FAQ' },
        { href: `${base}/privacy-policy`, label: t.nav_privacy || 'Privacybeleid' },
        { href: `${base}/terms-&-conditions`, label: t.nav_terms || 'Voorwaarden' },
        // Toestemming moet net zo makkelijk in te trekken zijn als te geven —
        // dat is een eis, geen extraatje. Dit wist de keuze en laat de balk
        // opnieuw verschijnen.
        { onClick: clearConsent, label: t.footer_cookie_settings || 'Cookievoorkeuren' },
      ],
    },
  ]

  // Desktop: columns always open. Mobile: tap a heading to expand/collapse.
  const [isDesktop, setIsDesktop] = useState(true)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setIsDesktop(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  const shown = (id: string) => isDesktop || !!open[id]

  return (
    <footer>
      {/* Achtergrondmozaïek — zie footTiles hierboven. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid select-none auto-rows-fr grid-cols-3 overflow-hidden lg:grid-cols-6">
        {tiles.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={optImg(src, 384)} alt="" loading="lazy" decoding="async"
            className="h-full w-full object-cover opacity-[0.07] grayscale" />
        ))}
      </div>
      <div className="wrap relative">
        <div className="foot-grid">
          <div>
            <Link className="foot-brand-c" href={base}>
              <span className="foot-logo">
                <img src="/logo-clean.png" alt="Ibiza mi Vida logo" />
              </span>
              <span className="foot-brand">
                <strong>IBIZA MI VIDA</strong>
                <span className="foot-brand-sub">TICKETS · PRIVATE BOATS</span>
                <span className="foot-brand-sub">RENTAL · EVENTS</span>
              </span>
            </Link>
            <p className="foot-slogan" style={{ marginTop: '16px' }}>
              {t.footer_slogan || "Het startpunt van jouw Ibiza-zomer. Events, tickets, boot & tips — allemaal op één eiland, allemaal op één site."}
            </p>
          </div>

          {groups.map(g => (
            <div className="foot-col" key={g.id}>
              <button
                type="button"
                className="foot-col-head"
                aria-expanded={shown(g.id)}
                onClick={() => setOpen(p => ({ ...p, [g.id]: !p[g.id] }))}
              >
                <h3>{g.title}</h3>
                <ChevronDown size={18} className="foot-chev" style={{ transform: shown(g.id) ? 'rotate(180deg)' : 'none' }} />
              </button>
              {shown(g.id) && (
                <div className="foot-links">
                  {g.links.map(l =>
                    // Eén item in deze lijst is geen navigatie maar een actie
                    // (toestemming intrekken). Dat hoort een <button> te zijn
                    // en geen link naar nergens.
                    'onClick' in l && l.onClick ? (
                      <button key={l.label} type="button" onClick={l.onClick} className="text-left">
                        {l.label}
                      </button>
                    ) : (
                      <Link key={(l as any).href + l.label} href={(l as any).href}>{l.label}</Link>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Ibiza mi Vida · {t.footer_partner || 'Official ClubTickets partner'}</span>
          {/* Naast de copyrightregel, niet als eigen blok met een kop erboven.
              Op elke pagina, dus het moet terughoudend blijven — het is een
              bewijsstuk voor wie het zoekt, geen tweede reclameboodschap. */}
          {rating && <GoogleRatingLine {...rating} locale={l} />}
        </div>
      </div>
    </footer>
  )
}
