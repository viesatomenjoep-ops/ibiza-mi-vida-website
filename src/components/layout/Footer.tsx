'use client'

import { GoogleRatingLine, type GoogleRating } from '@/components/reviews/GoogleRatingLine'
import { FLEET } from '@/data/fleet'

/**
 * Drie vlootfoto's als heel lichte achtergrond in de footer.
 *
 * Decoratie, geen inhoud: aria-hidden, pointer-events none, en een opacity
 * van 5–7% zodat de linkkolommen erbovenop gewoon AA blijven halen — de
 * footer is wit en de tekst donker, en 5% beeld daaronder verandert de
 * gemeten contrastwaarden niet noemenswaardig. Grayscale zodat felle
 * bootkleuren niet alsnog doorschemeren.
 *
 * Vaste indexen uit de vloot (duurste, middelste, goedkoopste) in plaats
 * van willekeur: dezelfde build toont dezelfde footer, en de mix van groot
 * en klein is precies het verhaal van de vloot. De footer heeft in
 * globals.css al position:relative en overflow:hidden, dus de absolute
 * lagen kunnen nergens buiten de footer lekken.
 */
const FOOT_BOATS = (() => {
  const opPrijs = [...FLEET].sort((a, b) => b.price.high - a.price.high)
  return [opPrijs[0], opPrijs[Math.floor(opPrijs.length / 2)], opPrijs[opPrijs.length - 1]].filter(Boolean)
})()

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

export function Footer({ rating = null }: { rating?: GoogleRating | null }) {
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
      {/* Achtergrondboten — zie FOOT_BOATS hierboven. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {FOOT_BOATS[0] && (
          <img src={FOOT_BOATS[0].image} alt="" loading="lazy"
            className="absolute -right-24 -top-10 w-[46rem] max-w-none opacity-[0.07] grayscale" />
        )}
        {FOOT_BOATS[1] && (
          <img src={FOOT_BOATS[1].image} alt="" loading="lazy"
            className="absolute -left-32 bottom-24 hidden w-[38rem] max-w-none opacity-[0.06] grayscale md:block" />
        )}
        {FOOT_BOATS[2] && (
          <img src={FOOT_BOATS[2].image} alt="" loading="lazy"
            className="absolute -bottom-16 right-1/4 hidden w-[30rem] max-w-none opacity-[0.05] grayscale lg:block" />
        )}
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
