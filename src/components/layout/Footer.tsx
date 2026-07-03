'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
              {t.footer_slogan || "Het startpunt van jouw Ibiza-zomer. Events, tickets, boot & tips — allemaal op één eiland, allemaal op één site."}
            </p>
          </div>
          
          <div>
            <h4>{t.nav_events_tickets || 'Events & Tickets'}</h4>
            <Link href={`${base}/calendar`}>{t.nav_ibiza_calendar || 'Ibiza Calendar'}</Link>
            <Link href={`${base}/deals-of-the-day`}>{t.nav_deals || 'Deals of the Day'}</Link>
            <Link href={`${base}/artists`}>{t.nav_artists || 'Artiesten'}</Link>
            <Link href={`${base}/club-tickets`}>{t.nav_club_tickets || 'Club Tickets'}</Link>
            <Link href={`${base}/clubs`}>{t.nav_clubs_ibiza || 'Clubs Ibiza'}</Link>
          </div>
          
          <div>
            <h4>{t.nav_on_the_water || 'Op het water'}</h4>
            <Link href={`${base}/boat-parties`}>{t.nav_boatparties || 'Bootfeesten'}</Link>
            <Link href={`${base}/private-boat-charters`}>{t.nav_private_charters || 'Private Boat Charters'}</Link>
            <Link href={`${base}/boat-parties`}>{t.nav_ibiza_boat_party || 'Ibiza Boat Party'}</Link>
            <Link href={`${base}/formentera-boat-trips`}>{t.nav_shuttle_ferry || 'Shuttle Ferry'}</Link>
            <Link href={`${base}/formentera-boat-trips`}>{t.nav_ferry_formentera || 'Ferry Ibiza – Formentera'}</Link>
          </div>
          
          <div>
            <h4>{t.nav_experience_island || 'Beleef & Insider'}</h4>
            <Link href={`${base}/activities`}>{t.nav_activities || 'Activities'}</Link>
            <Link href={`${base}/water-sports`}>{t.nav_water_sports || 'Water Sports'}</Link>
            <Link href={`${base}/drink-packages`}>{t.nav_drink_packages || 'Drankpakketten'}</Link>
            <Link href={`${base}/car-scooter-rental`}>{t.nav_car_scooter || 'Car & Scooter Rental'}</Link>
            <Link href={`${base}/guestlist`}>{t.nav_guestlist || 'Gastenlijst'}</Link>
            <Link href={`${base}/tips`}>{t.nav_tips || 'Ibiza Tips'}</Link>
            <Link href={`${base}/blog`}>{t.nav_blog || 'Blog'}</Link>
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
