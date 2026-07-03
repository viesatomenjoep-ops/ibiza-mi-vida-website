'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GlobalSearch } from './GlobalSearch'

const LOCALES = [
  { code: 'nl', label: 'NL' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]
  const base = `/${currentLocale.code}`

  // Ensure menu closes on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <div className="topbar">
        Insider deals & gastenlijst — <Link href={`${base}/guestlist`}>meld je aan via WhatsApp</Link>
      </div>

      {/* NAV: logo links, links midden, acties rechts */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <Link className="logo" href={base}>
            <img src="/logo-white.png" alt="Ibiza mi Vida logo" className="logo-img" />
            <strong>Ibiza mi Vida</strong>
          </Link>
          <div className="nav-links">
            <Link href={`${base}/calendar`}>Events</Link>
            <Link href={`${base}/deals-of-the-day`}>Deals</Link>
            <Link href={`${base}/clubs`}>Clubs</Link>
            <Link href={`${base}/boat-parties`}>Boat</Link>
          </div>
          <div className="nav-actions">
            <GlobalSearch locale={currentLocale.code} />
            <button className="burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <div className="burger-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBIEL MENU / ALLE 20 PAGINA'S */}
      <div className={`sheet ${menuOpen ? 'open' : ''}`} id="sheet">
        <div className="sheet-bg" onClick={() => setMenuOpen(false)}></div>
        <div className="sheet-panel">
          <button className="burger" style={{ marginLeft: 'auto' }} aria-label="Sluiten" onClick={() => setMenuOpen(false)}>✕</button>
          
          <h3>Events & Tickets</h3>
          <Link href={`${base}/calendar`}>Ibiza Calendar</Link>
          <Link href={`${base}/deals-of-the-day`}>Deals of the Day</Link>
          <Link href={`${base}/artists`}>Artiesten</Link>
          <Link href={`${base}/club-tickets`}>Club Tickets</Link>
          <Link href={`${base}/clubs`}>Clubs Ibiza</Link>
          
          <h3>Op het water</h3>
          <Link href={`${base}/boat-parties`}>Bootfeesten</Link>
          <Link href={`${base}/private-boat-charters`}>Private Boat Charters</Link>
          <Link href={`${base}/boat-parties`}>Ibiza Boat Party</Link>
          <Link href={`${base}/formentera-boat-trips`}>Shuttle Ferry</Link>
          <Link href={`${base}/formentera-boat-trips`}>Ferry Ibiza – Formentera</Link>
          
          <h3>Beleef het eiland</h3>
          <Link href={`${base}/activities`}>Activities</Link>
          <Link href={`${base}/activities`}>Tours</Link>
          <Link href={`${base}/water-sports`}>Water Sports</Link>
          <Link href={`${base}/drink-packages`}>Drankpakketten</Link>
          <Link href={`${base}/car-scooter-rental`}>Car & Scooter Rental</Link>
          
          <h3>Insider</h3>
          <Link href={`${base}/guestlist`}>Gastenlijst</Link>
          <Link href={`${base}/tips`}>Ibiza Tips</Link>
          <Link href={`${base}/blog`}>Blog</Link>
          <Link href={`${base}/free-discount-ibiza`}>Free & Discount Ibiza</Link>
        </div>
      </div>
    </>
  )
}
