'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LOCALES = [
  { code: 'nl' },
  { code: 'en' },
  { code: 'es' },
]

export function Footer() {
  const pathname = usePathname()
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]
  const base = `/${currentLocale.code}`

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="logo" href={base} style={{ alignItems: 'flex-start' }}>
              <span className="mark">
                <img src="/logo-white.png" alt="Ibiza mi Vida logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </span>
              <strong>Ibiza mi Vida</strong>
            </Link>
            <p style={{ marginTop: '16px', fontSize: '.86rem', color: '#555555', maxWidth: '280px' }}>
              Het startpunt van jouw Ibiza-zomer. Events, tickets, boot & tips — allemaal op één eiland, allemaal op één site.
            </p>
          </div>
          
          <div>
            <h4>Events & Tickets</h4>
            <Link href={`${base}/calendar`}>Ibiza Calendar</Link>
            <Link href={`${base}/deals-of-the-day`}>Deals of the Day</Link>
            <Link href={`${base}/artists`}>Artiesten</Link>
            <Link href={`${base}/club-tickets`}>Club Tickets</Link>
            <Link href={`${base}/clubs`}>Clubs Ibiza</Link>
          </div>
          
          <div>
            <h4>Op het water</h4>
            <Link href={`${base}/boat-parties`}>Bootfeesten</Link>
            <Link href={`${base}/private-boat-charters`}>Private Boat Charters</Link>
            <Link href={`${base}/boat-parties`}>Ibiza Boat Party</Link>
            <Link href={`${base}/formentera-boat-trips`}>Shuttle Ferry</Link>
            <Link href={`${base}/formentera-boat-trips`}>Ferry Ibiza – Formentera</Link>
          </div>
          
          <div>
            <h4>Beleef & Insider</h4>
            <Link href={`${base}/activities`}>Activities</Link>
            <Link href={`${base}/water-sports`}>Water Sports</Link>
            <Link href={`${base}/drink-packages`}>Drankpakketten</Link>
            <Link href={`${base}/car-scooter-rental`}>Car & Scooter Rental</Link>
            <Link href={`${base}/guestlist`}>Gastenlijst</Link>
            <Link href={`${base}/tips`}>Ibiza Tips</Link>
            <Link href={`${base}/blog`}>Blog</Link>
          </div>
        </div>
        
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Ibiza mi Vida · Officiële Clubtickets-partner</span>
          <span>
            <Link href={`${base}/privacy-policy`}>Privacy</Link> ·{' '}
            <Link href={`${base}/cookie-policy`}>Cookies</Link> ·{' '}
            <Link href={`${base}/terms-and-conditions`}>Voorwaarden</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
