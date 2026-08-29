'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

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

export function Footer() {
  const pathname = usePathname()
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]
  const base = `/${currentLocale.code}`
  const t = dicts[currentLocale.code] || dicts['en']

  const groups = [
    {
      id: 'events',
      title: t.nav_events_tickets || 'Events & Tickets',
      links: [
        { href: `${base}/calendar`, label: t.nav_ibiza_calendar || 'Ibiza Calendar' },
        { href: `${base}#deals`, label: t.nav_deals || 'Deals of the Day' },
        { href: `${base}/artists`, label: t.nav_artists || 'Artiesten' },
        { href: `${base}/club-tickets`, label: t.nav_club_tickets || 'Club Tickets' },
        { href: `${base}/clubs`, label: t.nav_clubs_ibiza || 'Clubs Ibiza' },
      ],
    },
    {
      id: 'water',
      title: t.nav_on_the_water || 'Op het water',
      links: [
        { href: `${base}/private-boat-charters`, label: t.nav_private_charters || 'Private Boat Charters' },
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
        { href: `${base}/drink-packages`, label: t.nav_drink_packages || 'Drankpakketten' },
        { href: `${base}/car-scooter-rental`, label: t.nav_car_scooter || 'Car & Scooter Rental' },
        { href: `${base}/guestlist`, label: t.nav_guestlist || 'Package Deals' },
        { href: `${base}/tips`, label: t.nav_tips || 'Ibiza Tips' },
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
      <div className="wrap">
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
                <h4>{g.title}</h4>
                <ChevronDown size={18} className="foot-chev" style={{ transform: shown(g.id) ? 'rotate(180deg)' : 'none' }} />
              </button>
              {shown(g.id) && (
                <div className="foot-links">
                  {g.links.map(l => (
                    <Link key={l.href + l.label} href={l.href}>{l.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Ibiza mi Vida · {t.footer_partner || 'Official ClubTickets partner'}</span>
        </div>
      </div>
    </footer>
  )
}
