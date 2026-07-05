'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSelector, LOCALES } from './LanguageSelector'
import { SpotifyButton } from './SpotifyButton'

import en from '@/dictionaries/en.json'
import nl from '@/dictionaries/nl.json'
import es from '@/dictionaries/es.json'
import de from '@/dictionaries/de.json'
import fr from '@/dictionaries/fr.json'

const dicts: Record<string, any> = { en, nl, es, de, fr }

const OFFICIAL_PARTNER: Record<string, string> = {
  en: 'Official ticket partner',
  nl: 'Officiële ticketpartner',
  de: 'Offizieller Ticketpartner',
  es: 'Socio oficial de entradas',
  fr: 'Partenaire officiel de billetterie',
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openCat, setOpenCat] = useState<string | null>('events') // default open
  const pathname = usePathname()
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]
  const base = `/${currentLocale.code}`
  const t = dicts[currentLocale.code] || dicts['en']

  const NAV_CATEGORIES = [
    {
      id: 'events',
      label: t.nav_events_tickets || 'Events & Tickets',
      items: [
        { label: t.nav_ibiza_calendar || 'Ibiza Calendar', href: '/calendar' },
        { label: t.nav_deals || 'Deals of the Day', href: '/deals-of-the-day' },
        { label: t.nav_artists || 'Artiesten', href: '/artists' },
        { label: t.nav_club_tickets || 'Club Tickets', href: '/club-tickets' },
        { label: t.nav_clubs_ibiza || 'Clubs Ibiza', href: '/clubs' },
      ],
    },
    {
      id: 'water',
      label: t.nav_on_the_water || 'Op het Water',
      items: [
        { label: t.nav_private_charters || 'Private Boat Charters', href: '/private-boat-charters' },
        { label: t.nav_shuttle_ferry || 'Shuttle Ferry', href: '/shuttle-ferry' },
        { label: t.nav_ferry_formentera || 'Ferry Ibiza – Formentera', href: '/ferry-formentera' },
      ],
    },
    {
      id: 'island',
      label: t.nav_experience_island || 'Beleef het Eiland',
      items: [
        { label: t.nav_activities || 'Activities', href: '/activities' },
        { label: t.nav_tours || 'Tours', href: '/tours' },
        { label: t.nav_water_sports || 'Water Sports', href: '/water-sports' },
        { label: t.nav_drink_packages || 'Drankpakketten', href: '/drink-packages' },
        { label: t.nav_car_scooter || 'Car & Scooter Rental', href: '/car-scooter-rental' },
      ],
    },
    {
      id: 'insider',
      label: t.nav_insider || 'Insider',
      items: [
        { label: t.nav_guestlist || 'Gastenlijst', href: '/guestlist' },
        { label: t.nav_tips || 'Ibiza Tips', href: '/tips' },
        { label: t.nav_blog || 'Blog', href: '/blog' },
        { label: t.nav_free_discount || 'Free & Discount Ibiza', href: '/free-discount-ibiza' },
      ],
    },
  ]

  const [isScrolled, setIsScrolled] = useState(false)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Spin the logo fluidly as you scroll (rAF-eased toward a scroll-driven angle)
  useEffect(() => {
    let raf = 0
    let current = 0
    const loop = () => {
      const target = window.scrollY * 0.35 // degrees
      current += (target - current) * 0.12 // easing = fluid trailing motion
      const el = logoRef.current
      if (el) el.style.transform = `rotate(${current.toFixed(2)}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleCat = (id: string) => setOpenCat(prev => prev === id ? null : id)

  return (
    <>
      <nav className={`nav ${isScrolled ? 'nav--scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <Link className="nav-logo-btn" href={base} aria-label="IBIZA MI VIDA">
            <img ref={logoRef} className="logo-spin" src="/logo-clean.png" alt="IBIZA MI VIDA logo" />
          </Link>
          <Link className="nav-wordmark" href={base}>
            <span className="nav-brand-name">IBIZA MI VIDA</span>
            <span className="nav-brand-sub">TICKETS · PRIVATE BOATS · RENTAL</span>
            <span className="nav-brand-cert">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="#14FF00" />
                <path d="M7 12.5l3.2 3.2L17 9" stroke="#0D0509" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {OFFICIAL_PARTNER[currentLocale.code] || OFFICIAL_PARTNER.en}
            </span>
          </Link>
          <div className="nav-actions">
            <span className="nav-lang"><LanguageSelector /></span>
            <button
              className="burger"
              aria-label="Menu openen"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <div className="burger-lines">
                <span /><span /><span />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── FULLSCREEN MENU OVERLAY ── */}
      <div
        className={`fs-menu${menuOpen ? ' fs-menu--open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigatiemenu"
      >
        {/* Close button */}
        <button
          className="fs-close"
          aria-label="Menu sluiten"
          onClick={() => setMenuOpen(false)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Logo in overlay */}
        <div className="fs-logo">
          <img src="/logo-clean.png" alt="IBZMV" />
          <span className="fs-brand">
            <span className="fs-brand-name">IBIZA MI VIDA</span>
            <span className="fs-brand-sub">TICKETS · PRIVATE BOATS · RENTAL</span>
          </span>
        </div>

        {/* Spotify player — between the logo and the categories */}
        <SpotifyButton />

        {/* Categories */}
        <nav className="fs-nav" aria-label="Hoofdnavigatie">
          {NAV_CATEGORIES.map((cat, ci) => (
            <div
              key={cat.id}
              className={`fs-cat${openCat === cat.id ? ' fs-cat--open' : ''}`}
              style={{ '--ci': ci } as React.CSSProperties}
            >
              {/* Category header — accordion trigger */}
              <button
                className="fs-cat-btn"
                onClick={() => toggleCat(cat.id)}
                aria-expanded={openCat === cat.id}
              >
                <span className="fs-cat-label">{cat.label}</span>
                <span className="fs-cat-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              {/* Sub-items */}
              <div className="fs-items" aria-hidden={openCat !== cat.id}>
                <div className="fs-items-inner">
                  {cat.items.map((item, ii) => (
                    <Link
                      key={item.href}
                      href={`${base}${item.href}`}
                      className="fs-item"
                      style={{ '--ii': ii } as React.CSSProperties}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                      <svg className="fs-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Footer row */}
        <div className="fs-footer">
          {LOCALES.map(l => (
            <Link
              key={l.code}
              href={pathname.replace(/^\/[a-z]{2}/, `/${l.code}`)}
              className={`fs-lang${currentLocale.code === l.code ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/31612345678"
            target="_blank"
            rel="noreferrer"
            className="fs-wa-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat met ons
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fs-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
