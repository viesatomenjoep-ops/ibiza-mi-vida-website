'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { LOCALES } from './LanguageSelector'
import { SpotifyButton } from './SpotifyButton'
import { MenuYachtSlider } from './MenuYachtSlider'
import { FLEET } from '@/data/fleet'
import { slugFor } from '@/lib/route-slugs'
import { localeTag } from '@/lib/date-label'
import { DEFAULT_LOCALE, LOCALES as SEO_LOCALES, type Locale } from '@/lib/seo'

import en from '@/dictionaries/en.json'
import nl from '@/dictionaries/nl.json'
import es from '@/dictionaries/es.json'
import de from '@/dictionaries/de.json'
import fr from '@/dictionaries/fr.json'

const dicts: Record<string, any> = { en, nl, es, de, fr }
const YACHT_ONLY = FLEET.filter(b => (b as any).category === 'yacht').map(b => b.image).filter(Boolean)
const YACHT_IMAGES = YACHT_ONLY.length >= 5 ? YACHT_ONLY : FLEET.map(b => b.image).filter(Boolean)

// Brightness-probe results per image URL ('failed' = host without CORS headers).
// Module-level so a URL is probed at most once per session, across route changes.
const probeCache = new Map<string, number | 'failed' | 'pending'>()

const OFFICIAL_PARTNER: Record<string, string> = {
  en: 'Official ticket partner',
  nl: 'Officiële ticketpartner',
  de: 'Offizieller Ticketpartner',
  es: 'Socio oficial de entradas',
  fr: 'Partenaire officiel de billetterie',
}

/**
 * Voorleeslabel bij de beoordeling in de partnerbalk.
 *
 * Zichtbaar staat er "★ 5,0 · 13" — kort genoeg voor een balk van 0,66rem,
 * maar als losse tekens zegt dat een schermlezer niets. Vandaar een volzin,
 * mét de bron erin: dat dit Google's cijfer is en niet ons eigen praatje is
 * precies waarom het er staat.
 */
const RATING_LABEL: Record<string, (r: string, n: number) => string> = {
  en: (r, n) => `Google rating ${r} out of 5, based on ${n} reviews`,
  nl: (r, n) => `Google-beoordeling ${r} van 5, op basis van ${n} reviews`,
  de: (r, n) => `Google-Bewertung ${r} von 5, basierend auf ${n} Rezensionen`,
  es: (r, n) => `Valoración de Google ${r} sobre 5, basada en ${n} reseñas`,
  fr: (r, n) => `Note Google ${r} sur 5, basée sur ${n} avis`,
}

export interface NavRating {
  /** Gemiddelde zoals Google het teruggeeft, bijv. 5 of 4.6. */
  value: number
  /** Aantal beoordelingen waarop dat gemiddelde rust. */
  count: number
}

/**
 * Labels that are read aloud but never drawn.
 *
 * Every one of these used to be a bare Dutch string, so a French or Spanish
 * visitor using a screen reader heard "Navigatiemenu" and "Menu sluiten" on an
 * otherwise fully translated page. Because the text is invisible, no amount of
 * looking at the site would have surfaced it — which is exactly why it survived
 * this long. Two more ("Language", "Official ticket partner") were stranded in
 * English for the same reason.
 */
const A11Y: Record<string, Record<string, string>> = {
  openMenu: {
    en: 'Open menu', nl: 'Menu openen', de: 'Menü öffnen',
    es: 'Abrir menú', fr: 'Ouvrir le menu',
  },
  closeMenu: {
    en: 'Close menu', nl: 'Menu sluiten', de: 'Menü schließen',
    es: 'Cerrar menú', fr: 'Fermer le menu',
  },
  navMenu: {
    en: 'Navigation menu', nl: 'Navigatiemenu', de: 'Navigationsmenü',
    es: 'Menú de navegación', fr: 'Menu de navigation',
  },
  mainNav: {
    en: 'Main navigation', nl: 'Hoofdnavigatie', de: 'Hauptnavigation',
    es: 'Navegación principal', fr: 'Navigation principale',
  },
  chat: {
    en: 'Chat with us', nl: 'Chat met ons', de: 'Schreib uns',
    es: 'Chatea con nosotros', fr: 'Discutez avec nous',
  },
  language: {
    en: 'Language', nl: 'Taal', de: 'Sprache',
    es: 'Idioma', fr: 'Langue',
  },
}

export function Navbar({ rating = null }: { rating?: NavRating | null }) {
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
  // De keyword-pillars (boot, auto) hebben per taal een eigen slug en stonden
  // in geen enkel menu — ze waren dus alleen via de sitemap te vinden.
  const l: Locale = (SEO_LOCALES as readonly string[]).includes(currentLocale.code) ? (currentLocale.code as Locale) : DEFAULT_LOCALE

  const NAV_CATEGORIES = [
    {
      id: 'events',
      label: t.nav_events_tickets || 'Events & Tickets',
      items: [
        { label: t.nav_club_calendar || 'Ibiza Club Calendar', href: '/calendar' },
        { label: t.nav_this_week || 'This week', href: '/this-week' },
        { label: t.nav_artists || 'Artiesten', href: '/artists' },
        { label: t.nav_clubs_ibiza || 'Clubs Ibiza', href: '/clubs' },
      ],
    },
    {
      id: 'water',
      label: t.nav_on_the_water || 'Op het Water',
      items: [
        { label: t.nav_private_charters || 'Private Boat Charters', href: '/private-boat-charters' },
        // 'Boat Rental Ibiza' stond hier als losse pillar; die is in /boats
        // opgegaan, dus het menu wijst naar de hub.
        { label: t.nav_boats_hub || 'Ibiza by boat', href: '/boats' },
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
        // Twee items, niet één: 'auto huren' en 'scooter huren' zijn andere
        // zoekopdrachten. Auto's gaan naar de pillar met het echte aanbod.
        { label: t.nav_car_rental || 'Car Rental Ibiza', href: `/${slugFor('car-rental', l)}` },
      ],
    },
    {
      id: 'insider',
      label: t.nav_insider || 'Insider',
      items: [
        // Twee items, niet één. "Ibiza guestlist" en "Ibiza package deals"
        // zijn verschillende zoekopdrachten met verschillende intentie; één
        // menu-item naar één gedeelde pagina liet ze om elkaars plek vechten.
        { label: t.nav_guestlist || 'Guestlist', href: '/guestlist' },
        { label: t.nav_packages || 'Package deals', href: '/package-deals' },
        { label: t.nav_tips || 'Ibiza Tips', href: '/tips' },
        { label: t.nav_prices || 'Ibiza Prices', href: '/ibiza-prices' },
        { label: t.nav_season || 'Ibiza Season', href: '/ibiza-season' },
      ],
    },
  ]

  // Taalkiezer: één zichtbare taal, uitklappen om te wisselen. Vijf pillen
  // naast elkaar pasten niet op een telefoon en stonden daar dus op
  // display:none — de taalkeuze was op mobiel onbereikbaar buiten het menu.
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [fadeOn, setFadeOn] = useState(false)
  const [onLight, setOnLight] = useState(false)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => { setLangOpen(false) }, [pathname])
  useEffect(() => {
    if (!langOpen) return
    const buiten = (e: MouseEvent) => { if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setLangOpen(false) }
    document.addEventListener('mousedown', buiten)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', buiten); document.removeEventListener('keydown', esc) }
  }, [langOpen])

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
        // Tainted (cross-origin without CORS). Retry ONCE per URL with an anonymous
        // request (works for Cloudinary). Hosts without CORS headers (e.g. the
        // ucarecdn event covers) fail — cache that so measure() (scroll/interval)
        // doesn't hammer the network with an endless stream of CORS errors.
        const src = (hero as HTMLImageElement).currentSrc || (hero as HTMLImageElement).src
        const cached = probeCache.get(src)
        if (cached === 'failed' || cached === 'pending') { if (cached === 'failed') applyFallback(navH); return }
        if (typeof cached === 'number') { setOnLight(cached > 200); return }
        probeCache.set(src, 'pending')
        const probe = new Image()
        probe.crossOrigin = 'anonymous'
        probe.onload = () => {
          const l = brightnessFromDraw((ctx, w, h) => ctx.drawImage(probe, 0, 0, probe.naturalWidth, Math.max(1, Math.round(probe.naturalHeight * 0.22)), 0, 0, w, h))
          probeCache.set(src, l !== null ? l : 'failed')
          if (cancelled) return
          if (l !== null) setOnLight(l > 200)
          else applyFallback(navH)
        }
        probe.onerror = () => { probeCache.set(src, 'failed'); if (!cancelled) applyFallback(navH) }
        probe.src = src
        return
      }

      if (lum !== null) setOnLight(lum > 200)
      else applyFallback(navH)
    }

    measure()
    // Re-measure rapidly right after a route change so the colour flips almost instantly
    // (the new page's hero image may need a frame or two to decode). De latere
    // slagen (1–4 s) vangen een hero die traag binnenkomt — dat deed eerst een
    // setInterval van 600 ms die nooit stopte.
    const quick = [30, 90, 180, 320, 500, 1000, 2000, 4000].map(ms => setTimeout(measure, ms))

    // PERF: measure() draaide bij élke scroll-event én elke 600 ms. Het loopt
    // alle <img>/<video> op de pagina af, leest per element de layout uit
    // (getBoundingClientRect → forced reflow) en tekent een canvas. Op de
    // vlootpagina zijn dat 100+ foto's, op de agenda 300+ — per scrollframe.
    // Dat was de hoofdoorzaak van het haperen op mobiel.
    //
    // De kleur hangt alleen af van wat er bovenaan achter de balk staat, en dat
    // verandert niet door te scrollen. Dus: tijdens scrollen alleen de goedkope
    // drempelcheck (bovenaan ↔ gescrold), en pas opnieuw meten bij terugkeer
    // naar de bovenkant. Eén rAF per scroll-burst, geen layout-lezen.
    let raf = 0
    let wasTop = true
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const atTop = window.scrollY <= Math.max(120, window.innerHeight * 0.55)
        if (atTop === wasTop) return
        wasTop = atTop
        if (atTop) measure()
        else setOnLight(false)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelled = true
      quick.forEach(clearTimeout)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  // Spin the logo fluidly as you scroll (rAF-eased toward a scroll-driven angle).
  //
  // PERF: dit was een requestAnimationFrame-lus die nooit stopte — 60 tot 120
  // keer per seconde een transform schrijven, ook als de pagina stilstond. Een
  // pagina die nooit idle wordt, kan op een telefoon niets anders vloeiend
  // doen. Nu start de lus bij een scroll-event en stopt hij zodra het logo op
  // zijn doelhoek staat; stilstaand kost dit nul frames.
  useEffect(() => {
    let raf = 0
    let current = 0
    const loop = () => {
      const target = window.scrollY * 0.35 // degrees
      current += (target - current) * 0.12 // easing = fluid trailing motion
      const el = logoRef.current
      if (el) el.style.transform = `rotate(${current.toFixed(2)}deg)`
      raf = Math.abs(target - current) > 0.05 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
    kick()
    window.addEventListener('scroll', kick, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
    }
  }, [])
  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleCat = (id: string) => setOpenCat(prev => prev === id ? null : id)

  /**
   * De Google-beoordeling naast de partnertekst.
   *
   * Eén keer opgebouwd en op twee plekken gebruikt: de balk bestaat namelijk
   * in twee gedaanten — bovenaan op de meeste pagina's, en als vaste onderbalk
   * op de ClubTickets-categorieën en op de homepage zodra je scrolt. Twee
   * kopieën van deze opmaak zouden vanzelf uit elkaar gaan lopen.
   *
   * `null` wanneer er geen cijfer is. Geen plaatshouder, geen "nog geen
   * beoordelingen", geen skelet: de balk ziet er dan precies zo uit als nu.
   *
   * Het getal wordt per taal opgemaakt. Hardgecodeerd zou een Nederlander
   * "5.0" zien en een Engelsman "5,0" — in beide gevallen het decimaalteken
   * van de ander. Met minimumFractionDigits blijft het bovendien "5,0" en
   * verspringt de balk niet zodra het gemiddelde ooit 4,9 wordt.
   */
  const ratingMark = (() => {
    if (!rating) return null
    const shown = new Intl.NumberFormat(localeTag(currentLocale.code), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(rating.value)
    const label = (RATING_LABEL[currentLocale.code] || RATING_LABEL.en)(shown, rating.count)
    return (
      <span className="nav-topbar-rating">
        <span aria-hidden="true" className="nav-topbar-sep">·</span>
        <span aria-hidden="true" className="nav-topbar-star">★</span>
        <span aria-hidden="true">{shown}</span>
        <span aria-hidden="true" className="nav-topbar-count">({rating.count})</span>
        <span className="sr-only">{label}</span>
      </span>
    )
  })()

  return (
    <>
      <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''} ${fadeOn ? 'site-header--fade' : ''} ${onLight ? 'site-header--onlight' : ''} ${isPrivateBoat && !fadeOn ? 'site-header--forcewhite' : ''}`}>
        {/* Topbar strip: official ticket partner — at the top everywhere EXCEPT the
            ClubTickets categories, where it is shown as a fixed bottom bar instead. */}
        {!isClubCat && !isPrivateBoat && !(isHome && fadeOn) && (
          <div className="nav-topbar">
            <span className="nav-topbar-inner">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="#5FA37E" />
                <path d="M7 12.5l3.2 3.2L17 9" stroke="#0D0509" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {OFFICIAL_PARTNER[currentLocale.code] || OFFICIAL_PARTNER.en}
              {ratingMark}
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

            {/* Right: language selector (desktop) + hamburger */}
            <div className="nav-right">
            <div
              ref={langRef}
              className={`nav-langs${langOpen ? ' is-open' : ''}`}
              aria-label={A11Y.language[currentLocale.code] || A11Y.language.en}
            >
              {/* De huidige taal is altijd zichtbaar en is tegelijk de knop die
                  de rest uitklapt. De andere talen zijn echte links, zodat ze
                  crawlbaar blijven en met een middenklik in een nieuw tabblad
                  openen. */}
              <button
                type="button"
                onClick={() => setLangOpen(v => !v)}
                className="nav-lang active nav-lang-toggle"
                aria-expanded={langOpen}
                aria-label={`${A11Y.language[currentLocale.code] || A11Y.language.en}: ${currentLocale.label}`}
              >
                {currentLocale.label}
                <ChevronDown size={11} aria-hidden className="nav-lang-chev" />
              </button>
              {LOCALES.filter(l => l.code !== currentLocale.code).map(l => (
                <Link
                  key={l.code}
                  href={pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${l.code}`) || `/${l.code}`}
                  className="nav-lang nav-lang-item"
                  hrefLang={l.code}
                  onClick={() => { document.cookie = `imv_locale=${l.code}; max-age=31536000; path=/; samesite=lax` }}
                  tabIndex={langOpen ? undefined : -1}
                  aria-hidden={langOpen ? undefined : true}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <button
              className="burger"
              aria-label={(menuOpen ? A11Y.closeMenu : A11Y.openMenu)[currentLocale.code] || (menuOpen ? A11Y.closeMenu : A11Y.openMenu).en}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <div className="burger-lines">
                  <span /><span /><span />
                </div>
              )}
            </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Fixed bottom "official ticket partner" bar — on ClubTickets categories, and on the
          homepage once you start scrolling (it drops from the top so the navbar gets slimmer). */}
      {(isClubCat || (isHome && fadeOn)) && (
        <div className="nav-partner-bottom" aria-label={OFFICIAL_PARTNER[currentLocale.code] || OFFICIAL_PARTNER.en}>
          <span className="nav-topbar-inner">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="#5FA37E" />
              <path d="M7 12.5l3.2 3.2L17 9" stroke="#0D0509" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {OFFICIAL_PARTNER[currentLocale.code] || OFFICIAL_PARTNER.en}
            {ratingMark}
          </span>
        </div>
      )}

      {/* ── FULLSCREEN MENU OVERLAY ── */}
      {/* `inert` in plaats van `aria-hidden`, en niet allebei.
          aria-hidden zegt tegen een schermlezer "negeer dit", maar laat de
          knoppen en links erin gewoon focusbaar — dat is precies de combinatie
          die axe afkeurt, en terecht: je tabt dan naar iets wat niemand ziet.
          `inert` haalt de hele subtree uit de tabvolgorde én uit de
          toegankelijkheidsboom, dus het doet wat aria-hidden beloofde. React 18
          typt het attribuut nog niet, vandaar de spread; `visibility:hidden` in
          globals.css dekt dezelfde bodem voor browsers zonder inert. */}
      <div
        className={`fs-menu${menuOpen ? ' fs-menu--open' : ''}`}
        {...(menuOpen ? {} : ({ inert: '' } as Record<string, string>))}
        role="dialog"
        aria-modal="true"
        aria-label={A11Y.navMenu[currentLocale.code] || A11Y.navMenu.en}
      >
        {/* Close button */}
        <button className="fs-close" aria-label={A11Y.closeMenu[currentLocale.code] || A11Y.closeMenu.en} onClick={() => setMenuOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="fs-logo">
          <img src="/logo-clean.png" alt="IBZMV" />
          <span className="fs-brand">
            <span className="fs-brand-name">IBIZA MI VIDA</span>
            <span className="fs-brand-sub">TICKETS · PRIVATE BOATS</span>
            <span className="fs-brand-sub">RENTAL · EVENTS</span>
          </span>
        </div>

        {/* Categories */}
        <nav className="fs-nav" aria-label={A11Y.mainNav[currentLocale.code] || A11Y.mainNav.en}>
          {NAV_CATEGORIES.map((cat, ci) => (
            <div
              key={cat.id}
              data-cat={cat.id}
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
              <div
                className="fs-items"
                {...(openCat === cat.id ? {} : ({ inert: '' } as Record<string, string>))}
              >
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

          {/* Yacht photo slider — fills the space down to the language selector.
              Only mounted while the menu is open: the fs-menu markup is always in
              the DOM (CSS-hidden), and an always-mounted slider kept cycling and
              downloading the entire fleet's photos on every page in the background. */}
          {menuOpen && <MenuYachtSlider images={YACHT_IMAGES} />}
        </nav>

        {/* Footer row */}
        <div className="fs-footer">
          <div className="fs-langs">
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
          </div>
          <div className="fs-actions">
            <SpotifyButton />
            <a
              href="https://wa.me/33666528412"
              target="_blank"
              rel="noreferrer"
              className="fs-wa-btn"
              aria-label={A11Y.chat[currentLocale.code] || A11Y.chat.en}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
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
