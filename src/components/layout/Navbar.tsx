'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES } from './LanguageSelector'
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
  // ClubTickets ecosystem (clubs, events, artists) — the official-partner strip moves
  // to a fixed bottom bar here; everywhere else it stays at the top.
  const CLUB_CAT_SEGMENTS = ['club-tickets', 'clubs', 'artists', 'calendar', 'deals-of-the-day']
  const isClubCat = CLUB_CAT_SEGMENTS.some(seg => pathname.startsWith(`${base}/${seg}`) || pathname.startsWith(`/${seg}`))
  // Private Boat Charters: dark hero — force the whole navbar white and drop the top partner strip.
  const isPrivateBoat = pathname.startsWith(`${base}/private-boat-charters`) || pathname.startsWith('/private-boat-charters')
  const isHome = pathname === base || pathname === `${base}/` || pathname === '/'
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
  const [fadeOn, setFadeOn] = useState(false)
  const [onLight, setOnLight] = useState(false)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Shrink navbar on scroll + activate the top dissolve/blur zone as soon as you scroll a touch
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > Math.max(120, window.innerHeight * 0.55))
      setFadeOn(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detect whether the hero behind the transparent navbar is light or dark,
  // so the logo + wordmark can flip to black on light backgrounds and stay white on dark ones.
  useEffect(() => {
    let cancelled = false

    const brightnessFromDraw = (draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): number | null => {
      try {
        const w = 32, h = 12
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        const ctx = c.getContext('2d', { willReadFrequently: true })
        if (!ctx) return null
        draw(ctx, w, h)
        const data = ctx.getImageData(0, 0, w, h).data
        let sum = 0, n = 0
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 10) continue // skip transparent
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          n++
        }
        return n ? sum / n : null
      } catch { return null } // cross-origin taint → give up
    }

    // Fallback for pages without a hero image: read the solid background colour
    // sitting directly under the navbar and judge its brightness.
    const solidBgBrightness = (navH: number): number | null => {
      const x = Math.round(window.innerWidth / 2)
      const y = Math.round(navH + 6)
      let el = document.elementFromPoint(x, y) as HTMLElement | null
      while (el && el !== document.documentElement) {
        const bg = getComputedStyle(el).backgroundColor
        const m = bg.match(/rgba?\(([^)]+)\)/)
        if (m) {
          const p = m[1].split(',').map(s => parseFloat(s))
          const a = p[3] === undefined ? 1 : p[3]
          if (a > 0.5) return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
        }
        el = el.parentElement
      }
      // Nothing opaque found → assume the page's own (usually white) background.
      const bodyBg = getComputedStyle(document.body).backgroundColor
      const bm = bodyBg.match(/rgba?\(([^)]+)\)/)
      if (bm) {
        const p = bm[1].split(',').map(s => parseFloat(s))
        return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
      }
      return null
    }

    const applyFallback = (navH: number) => {
      const b = solidBgBrightness(navH)
      setOnLight(b !== null ? b > 150 : false)
    }

    const measure = () => {
      if (cancelled) return
      // Only relevant while transparent (not scrolled). When scrolled the navbar is solid dark.
      if (window.scrollY > Math.max(120, window.innerHeight * 0.55)) { setOnLight(false); return }

      const header = document.querySelector('.site-header') as HTMLElement | null
      const navH = header?.offsetHeight || 120

      // Find the top-most full-width media (img/video) sitting behind the navbar.
      const medias = Array.from(document.querySelectorAll('img, video')) as (HTMLImageElement | HTMLVideoElement)[]
      let hero: HTMLImageElement | HTMLVideoElement | null = null
      for (const m of medias) {
        if (m === logoRef.current) continue
        const r = m.getBoundingClientRect()
        if (r.top <= navH * 0.5 && r.bottom > navH * 0.6 && r.width > window.innerWidth * 0.55 && r.height > 120) {
          hero = m; break
        }
      }
      if (!hero) { applyFallback(navH); return }

      const isImg = hero.tagName === 'IMG'
      const nw = isImg ? (hero as HTMLImageElement).naturalWidth : (hero as HTMLVideoElement).videoWidth
      const nh = isImg ? (hero as HTMLImageElement).naturalHeight : (hero as HTMLVideoElement).videoHeight
      if (!nw || !nh) { applyFallback(navH); return }
      const stripH = Math.max(1, Math.round(nh * 0.22)) // top strip behind the navbar

      // Try the live element first.
      let lum = brightnessFromDraw((ctx, w, h) => ctx.drawImage(hero as CanvasImageSource, 0, 0, nw, stripH, 0, 0, w, h))

      if (lum === null && isImg) {
        // Tainted (cross-origin without CORS). Retry with an anonymous request (works for Cloudinary etc.).
        const probe = new Image()
        probe.crossOrigin = 'anonymous'
        probe.onload = () => {
          if (cancelled) return
          const l = brightnessFromDraw((ctx, w, h) => ctx.drawImage(probe, 0, 0, probe.naturalWidth, Math.max(1, Math.round(probe.naturalHeight * 0.22)), 0, 0, w, h))
          if (l !== null) setOnLight(l > 200)
          else applyFallback(navH)
        }
        probe.onerror = () => { if (!cancelled) applyFallback(navH) }
        probe.src = (hero as HTMLImageElement).currentSrc || (hero as HTMLImageElement).src
        return
      }

      if (lum !== null) setOnLight(lum > 200)
      else applyFallback(navH)
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    const iv = setInterval(measure, 700) // catch late-loading hero media
    return () => {
      cancelled = true
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      clearInterval(iv)
    }
  }, [pathname])

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
      <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''} ${fadeOn ? 'site-header--fade' : ''} ${onLight ? 'site-header--onlight' : ''} ${isPrivateBoat ? 'site-header--forcewhite' : ''}`}>
        {/* Topbar strip: official ticket partner — at the top everywhere EXCEPT the
            ClubTickets categories, where it is shown as a fixed bottom bar instead. */}
        {!isClubCat && !isPrivateBoat && !(isHome && fadeOn) && (
          <div className="nav-topbar">
            <span className="nav-topbar-inner">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="#14FF00" />
                <path d="M7 12.5l3.2 3.2L17 9" stroke="#0D0509" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {OFFICIAL_PARTNER[currentLocale.code] || OFFICIAL_PARTNER.en}
            </span>
          </div>
        )}

        <nav className="nav">
          <div className="wrap nav-inner">
            {/* Left: logo + wordmark */}
            <Link className="nav-brand-c" href={base} aria-label="IBIZA MI VIDA">
              <span className="nav-logo-btn">
                <img ref={logoRef} className="logo-spin" src="/logo-clean.png" alt="IBIZA MI VIDA logo" />
              </span>
              <span className="nav-brand-name">IBIZA MI VIDA</span>
              <span className="nav-brand-subs">
                <span className="nav-brand-sub">TICKETS · PRIVATE BOATS</span>
                <span className="nav-brand-sub">RENTAL · EVENTS</span>
              </span>
            </Link>

            {/* Right: hamburger */}
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
        </nav>
      </header>

      {/* Fixed bottom "official ticket partner" bar — on ClubTickets categories, and on the
          homepage once you start scrolling (it drops from the top so the navbar gets slimmer). */}
      {(isClubCat || (isHome && fadeOn)) && (
        <div className="nav-partner-bottom" aria-label="Official ticket partner">
          <span className="nav-topbar-inner">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="#14FF00" />
              <path d="M7 12.5l3.2 3.2L17 9" stroke="#0D0509" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {OFFICIAL_PARTNER[currentLocale.code] || OFFICIAL_PARTNER.en}
          </span>
        </div>
      )}

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
            <span className="fs-brand-sub">TICKETS · PRIVATE BOATS</span>
            <span className="fs-brand-sub">RENTAL · EVENTS</span>
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
