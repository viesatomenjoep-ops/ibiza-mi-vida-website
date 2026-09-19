'use client'

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { WeekDockBar } from '@/components/ui/WeekDockBar'
import { withDate } from '@/lib/event-date-param'
import { ScrollCue } from '@/components/ui/ScrollCue'
import {
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfDay, eachDayOfInterval, parseISO, isToday, isTomorrow,
} from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { MapPin, Calendar, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import type { PickerEvent } from '@/lib/picker-event'
import { optImg } from '@/lib/img'
import { eventBasePath } from '@/lib/event-path'
import { scrollSectionIntoView } from '@/lib/scroll-to-section'
import { ibizaToday } from '@/lib/date-label'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExEvent {
  id: string
  date: string
  // Optioneel: de server laat lege velden weg in plaats van ze als "" mee te
  // sturen. Van de 678 events in een venster hebben er 587 geen line-up en 655
  // geen eigen naam; die sleutels kostten wél ruimte in de HTML, twee keer.
  // Alles hieronder leest ze al met `?.` of `|| ''`, dus ontbreken gedraagt
  // zich precies als leeg.
  name?: string
  prices?: string
  lineUp?: string
  ct_events: { name?: string; slug?: string; cover?: string; blurb?: string }
  // Alleen naam en slug. whitelogo, picture en type_slug zijn eigenschappen van
  // de venue, niet van de avond, en werden 1566 keer herhaald voor 42 venues —
  // ruim een kwart van alles wat deze pagina naar de browser stuurde. Ze komen
  // nu uit allVenues, die toch al werd meegestuurd (en tot nu toe ongebruikt bleef).
  ct_venues: { name?: string; slug?: string }
}
interface LightVenue { name: string; slug: string; whitelogo: string; picture: string; type_slug: string }

/**
 * Welke venues deze verkenner toont.
 *
 * Dit stond als `type_slug === 'clubbing'` hard in de code, op twee plekken.
 * Zolang er één agenda was klopte dat. Sinds er ook een activiteitenagenda is
 * die dezelfde verkenner gebruikt, betekende het dat die pagina zijn eigen
 * inhoud wegfilterde: elk event daarop is per definitie géén clubavond, dus
 * de lijst was altijd leeg en de dag zei "geen events voor deze selectie",
 * terwijl er die vrijdag zesendertig boottochten en excursies waren.
 *
 * Een functie doorgeven kan niet -- dit is een client-component die zijn props
 * van een servercomponent krijgt -- dus het is een stand, geen predicaat.
 */
export type ExplorerMode = 'clubs' | 'activities'
const hoortErbij = (mode: ExplorerMode, typeSlug: string) =>
  mode === 'clubs' ? typeSlug === 'clubbing' : typeSlug !== 'clubbing'
interface Props {
  /** De dagen die de server al in de HTML heeft gezet. */
  events: ExEvent[]
  allVenues: LightVenue[]
  locale: string
  /** Laatste dag die in `events` zit, als yyyy-MM-dd. Alles daarna wordt geladen. */
  loadedThrough: string
  /** Vandaag (Ibiza-tijd) zoals de server hem berekende — zie ibizaToday(). */
  today: string
  /**
   * Elke dag van het seizoen waarop iets te doen is. Het dock bladert
   * hierlangs, ook door weken die nog niet geladen zijn — anders houdt de
   * agenda op bij de veertien dagen die de server meestuurt.
   */
  seasonDates: string[]
}

type Period = 'day' | 'week' | 'month' | 'year'

// Venue logos that are already light/coloured — keep as-is; all others get inverted to black on the white badge.
const KEEP_LOGO = ['o-beach-ibiza', 'playa-soleil', 'bambuku-ibiza']

// ── i18n ──────────────────────────────────────────────────────────────────────
const T_I18N: Record<string, {
  title: string; sub: string;
  day: string; week: string; month: string; year: string; whole: (p: string) => string;
  events: (n: number) => string; noEvents: string; loading: string; tickets: string; view: string; lineupMore: string;
  today: string; tomorrow: string; upcoming: string;
  allVenues: string; searchArtist: string; anyBudget: string; upToPrice: (v: number) => string;
  clearFilters: string; noMatchFiltered: string;
  filters: string; close: string; club: string; artist: string; budget: string; showResults: (n: number) => string;
}> = {
  en: { title: 'Ibiza club calendar 2026', sub: 'Discover what’s on across Ibiza — slide through the dates and grab your tickets.', day: 'Day', week: 'Week', month: 'Month', year: 'Year', whole: p => `All ${p}`, events: n => `${n} ${n === 1 ? 'event' : 'events'}`, loading: 'Loading the calendar…', noEvents: 'No events for this selection.', tickets: 'Tickets', view: 'View', lineupMore: 'more', today: 'Today', tomorrow: 'Tomorrow', upcoming: 'All upcoming events', allVenues: 'All clubs', searchArtist: 'Search an artist…', anyBudget: 'Any budget', upToPrice: v => `Up to €${v}`, clearFilters: 'Clear filters', noMatchFiltered: 'No events match your filters.', filters: 'Filters', close: 'Close', club: 'Club', artist: 'Artist', budget: 'Budget', showResults: n => `Show ${n} ${n === 1 ? 'event' : 'events'}` },
  nl: { title: 'Ibiza clubagenda 2026', sub: 'Ontdek wat er speelt op Ibiza — schuif door de data en scoor je tickets.', day: 'Dag', week: 'Week', month: 'Maand', year: 'Jaar', whole: p => `Hele ${p}`, events: n => `${n} ${n === 1 ? 'event' : 'events'}`, loading: 'Agenda laden…', noEvents: 'Geen events voor deze selectie.', tickets: 'Tickets', view: 'Bekijk', lineupMore: 'meer', today: 'Vandaag', tomorrow: 'Morgen', upcoming: 'Alle aankomende events', allVenues: 'Alle clubs', searchArtist: 'Zoek een artiest…', anyBudget: 'Elk budget', upToPrice: v => `Tot €${v}`, clearFilters: 'Filters wissen', noMatchFiltered: 'Geen events gevonden voor deze filters.', filters: 'Filters', close: 'Sluiten', club: 'Club', artist: 'Artiest', budget: 'Budget', showResults: n => `Toon ${n} ${n === 1 ? 'event' : 'events'}` },
  de: { title: 'Ibiza Clubkalender 2026', sub: 'Entdecke, was auf Ibiza los ist — wische durch die Daten und sichere dir deine Tickets.', day: 'Tag', week: 'Woche', month: 'Monat', year: 'Jahr', whole: p => `Ganze ${p}`, events: n => `${n} ${n === 1 ? 'Event' : 'Events'}`, loading: 'Kalender wird geladen…', noEvents: 'Keine Events für diese Auswahl.', tickets: 'Tickets', view: 'Ansehen', lineupMore: 'mehr', today: 'Heute', tomorrow: 'Morgen', upcoming: 'Alle kommenden Events', allVenues: 'Alle Clubs', searchArtist: 'Künstler suchen…', anyBudget: 'Jedes Budget', upToPrice: v => `Bis €${v}`, clearFilters: 'Filter zurücksetzen', noMatchFiltered: 'Keine Events für diese Filter.', filters: 'Filter', close: 'Schließen', club: 'Club', artist: 'Künstler', budget: 'Budget', showResults: n => `${n} Event${n === 1 ? '' : 's'} anzeigen` },
  es: { title: 'Agenda de clubs Ibiza 2026', sub: 'Descubre qué hay en Ibiza — desliza por las fechas y consigue tus entradas.', day: 'Día', week: 'Semana', month: 'Mes', year: 'Año', whole: p => `Todo el/la ${p}`, events: n => `${n} ${n === 1 ? 'evento' : 'eventos'}`, loading: 'Cargando la agenda…', noEvents: 'No hay eventos para esta selección.', tickets: 'Entradas', view: 'Ver', lineupMore: 'más', today: 'Hoy', tomorrow: 'Mañana', upcoming: 'Todos los próximos eventos', allVenues: 'Todos los clubs', searchArtist: 'Buscar un artista…', anyBudget: 'Cualquier presupuesto', upToPrice: v => `Hasta €${v}`, clearFilters: 'Borrar filtros', noMatchFiltered: 'Ningún evento coincide con tus filtros.', filters: 'Filtros', close: 'Cerrar', club: 'Club', artist: 'Artista', budget: 'Presupuesto', showResults: n => `Ver ${n} ${n === 1 ? 'evento' : 'eventos'}` },
  fr: { title: 'Agenda des clubs Ibiza 2026', sub: 'Découvrez ce qui se passe à Ibiza — faites défiler les dates et prenez vos billets.', day: 'Jour', week: 'Semaine', month: 'Mois', year: 'Année', whole: p => `Tout le/la ${p}`, events: n => `${n} ${n === 1 ? 'événement' : 'événements'}`, loading: 'Chargement de l’agenda…', noEvents: 'Aucun événement pour cette sélection.', tickets: 'Billets', view: 'Voir', lineupMore: 'plus', today: 'Aujourd’hui', tomorrow: 'Demain', upcoming: 'Tous les événements à venir', allVenues: 'Tous les clubs', searchArtist: 'Rechercher un artiste…', anyBudget: 'Tout budget', upToPrice: v => `Jusqu'à €${v}`, clearFilters: 'Effacer les filtres', noMatchFiltered: 'Aucun événement ne correspond à vos filtres.', filters: 'Filtres', close: 'Fermer', club: 'Club', artist: 'Artiste', budget: 'Budget', showResults: n => `Voir ${n} ${n === 1 ? 'événement' : 'événements'}` },
}
const getLoc = (l: string) => ({ nl, de, es, fr, en: enUS } as Record<string, Locale>)[l] || enUS
type Locale = typeof enUS

function priceFrom(prices?: string): string | null {
  if (!prices) return null
  const m = prices.match(/\d+([.,]\d+)?/)
  return m ? `€${m[0].replace(',', '.').replace(/\.00$/, '')}` : null
}
/** Zelfde regex als priceFrom(), maar als getal — voor het prijsfilter. */
function priceFromNumber(prices?: string): number | null {
  if (!prices) return null
  const m = prices.match(/\d+([.,]\d+)?/)
  return m ? parseFloat(m[0].replace(',', '.')) : null
}
function lineupArtists(lineUp?: string): string[] {
  if (!lineUp) return []
  const txt = lineUp.replace(/<[^>]+>/g, ' ').replace(/\b(MAIN ROOM|THE BUNKER|CLUB ROOM|TERRACE|ROOM \d)\b/gi, ' ')
  return txt.replace(/\s+/g, ' ').trim().split(/[,\-–|]/)
    // Sommige feeds zetten een starttijd voor het stukje line-up, bijv.
    // "23:00) Richie Hawtin" — dat hoort niet bij de artiestennaam.
    .map(s => s.trim().replace(/^\d{1,2}:\d{2}\)\s*/, '').trim())
    .filter(s => s.length > 1)
}

/**
 * Deterministische pseudo-random (mulberry32) uit een tekstzaad. Zelfde zaad →
 * zelfde reeks, op server én client; zie de shuffle in `grouped`.
 */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function EventsExplorer({ events: initialEvents, allVenues, locale, loadedThrough, today: todayProp, seasonDates, heading, sub, mode = 'clubs' }: Props & { heading?: string; sub?: string; mode?: ExplorerMode }) {
  const loc = getLoc(locale)
  /** Venue op slug — de bron voor logo, foto en type, in plaats van elk veld
      per avond mee te sturen. */
  const venueBySlug = useMemo(
    () => new Map((allVenues ?? []).map(v => [v.slug, v])),
    [allVenues],
  )
  const venueOf = (e: ExEvent) => venueBySlug.get(e.ct_venues?.slug ?? '')
  const T = T_I18N[locale] || T_I18N.en
  const base = `/${locale}`
  // Van de server, niet `new Date()`: die is hier lokale tijd en op de server
  // UTC — een andere dag rond middernacht, en dus een hydration-mismatch
  // waarna React de complete agenda opnieuw rendert.
  const todayStr = todayProp
  const today = useMemo(() => parseISO(todayStr), [todayStr])

  const [period, setPeriod] = useState<Period>('week')
  const [activeDay, setActiveDay] = useState<string | null>(null)

  // ── Filters: venue, artist, budget ─────────────────────────────────────
  // Alle drie parsen uit data die deze component toch al binnenkrijgt — geen
  // nieuwe fetch, geen nieuw veld. Ze staan los van period/activeDay: wie op
  // een club filtert en dan van week naar maand bladert, wil die club
  // aanhouden, niet opnieuw kiezen.
  const [venueFilter, setVenueFilter] = useState<string>('all')
  const [artistQuery, setArtistQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  // Eigen dropdown voor de club-kiezer in plaats van een kale <select> — de
  // rest van de filterrij (chips, zoekvak) is al custom gestyled, en een
  // systeem-dropdown ertussen valt uit de toon. Sluit op een klik erbuiten of
  // Escape, zoals DatePickerModal elders op de site.
  const [venueOpen, setVenueOpen] = useState(false)
  const venueDropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!venueOpen) return
    const onClick = (e: MouseEvent) => {
      if (venueDropdownRef.current && !venueDropdownRef.current.contains(e.target as Node)) setVenueOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setVenueOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [venueOpen])

  // Zelfde patroon voor het artiestenveld: een intikvak dat ook een lijst met
  // de artiesten uit dit venster opent (gefilterd op wat je typt) — sneller
  // dan een kale dropdown bij honderden namen, maar je kunt nog steeds
  // bladeren zonder een naam te hoeven kennen.
  const [artistOpen, setArtistOpen] = useState(false)
  const artistDropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!artistOpen) return
    const onClick = (e: MouseEvent) => {
      if (artistDropdownRef.current && !artistDropdownRef.current.contains(e.target as Node)) setArtistOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setArtistOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [artistOpen])

  // ── Mobiel filtermenu ──────────────────────────────────────────────────
  // Op mobiel is er geen ruimte voor de filterrij naast elkaar (dat werd drie
  // regels vol pillen); die staat op mobiel verborgen en een vast knopje
  // rechts opent dezelfde filters in een sheet — zelfde chrome als
  // DatePickerModal: focus, Escape sluit, achtergrond niet scrollbaar.
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const filterModalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!filterModalOpen) return
    const prevFocus = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setFilterModalOpen(false) } }
    document.addEventListener('keydown', onKey)
    const body = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    filterModalRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = body
      prevFocus?.focus?.()
    }
  }, [filterModalOpen])

  /**
   * De agenda voorbij wat de server meestuurde.
   *
   * De pagina rendert veertien dagen; dat dekt de dag- en weekweergave, en dat
   * is waar iedereen op binnenkomt. Schakelt iemand naar 'maand' of 'jaar', dan
   * halen we het ontbrekende stuk erbij in plaats van het bij elke bezoeker
   * mee te sturen — ook bij de bezoekers die die tabs nooit aanraken.
   *
   * `extra` staat los van de server-props zodat een bijlading nooit overschrijft
   * wat er al stond; ze worden hieronder samengevoegd.
   */
  const [extra, setExtra] = useState<ExEvent[]>([])
  const [loadedTo, setLoadedTo] = useState(loadedThrough)
  const [loading, setLoading] = useState(false)
  const events = useMemo(
    () => (extra.length ? [...initialEvents, ...extra] : initialEvents),
    [initialEvents, extra],
  )

  // Normalised events for the iOS-style picker wheel
  const pickerEvents: PickerEvent[] = useMemo(() => events
    .filter(e => hoortErbij(mode, venueOf(e)?.type_slug || '') && (e.date || '') >= todayStr)
    .map(e => {
      const m = String(e.prices || '').match(/\d+([.,]\d+)?/)
      return {
        id: e.id,
        clubSlug: e.ct_venues?.slug || '',
        clubName: e.ct_venues?.name || '',
        // real logos only — a photo forced to brightness-0 becomes a black square
        clubLogo: venueOf(e)?.whitelogo || '',
        eventSlug: e.ct_events?.slug || '',
        eventName: e.ct_events?.name || e.name || '',
        image: e.ct_events?.cover || venueOf(e)?.picture || '',
        date: e.date || '',
        price: m ? parseFloat(m[0].replace(',', '.')) : 0,
        lineUp: e.lineUp || '',
        // eventBasePath: alleen clubbing woont onder /club-tickets. Een
        // boottocht daarheen sturen is een gegarandeerde 404.
        href: withDate(`/${locale}/${eventBasePath(venueOf(e)?.type_slug || '')}/${e.ct_venues?.slug}/${e.ct_events?.slug}`, e.date),
        affLink: (e as any).affLink || '',
      }
    }), [events, locale, todayStr, mode])

  // Alles wat bij deze stand hoort, vanaf vandaag.
  const clubEvents = useMemo(
    () => events.filter(e => hoortErbij(mode, venueOf(e)?.type_slug || '') && e.date >= todayStr),
    [events, todayStr, mode]
  )

  // ── Filter opties, afgeleid van wat er ook echt staat ────────────────────
  // Venues uit clubEvents zelf, niet uit allVenues: anders biedt de kiezer een
  // club aan met nul events in het geladen venster — een dode optie.
  const venueOptions = useMemo(() => {
    const seen = new Map<string, string>()
    clubEvents.forEach(e => {
      const slug = e.ct_venues?.slug
      if (slug && !seen.has(slug)) seen.set(slug, e.ct_venues?.name || venueOf(e)?.name || slug)
    })
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [clubEvents])
  const venueLabel = venueFilter === 'all' ? T.allVenues : (venueOptions.find(([slug]) => slug === venueFilter)?.[1] || T.allVenues)

  // Het artiestenfilter alleen tonen als er in dit venster ook echt een
  // line-up gepubliceerd staat — op de activiteitenagenda (boottochten,
  // tours) is dat vrijwel nooit zo, en een zoekvak dat nooit iets kan vinden
  // is geen filter.
  const hasAnyLineup = useMemo(
    () => clubEvents.some(e => lineupArtists(e.lineUp).length > 0),
    [clubEvents]
  )
  // Alle artiesten die in dit venster op een line-up staan, dubbelen eruit op
  // naam (niet op hoofdletters — dezelfde artiest komt met wisselende casing
  // uit de feed), gesorteerd. Bron voor de dropdown onder het zoekvak.
  const artistOptions = useMemo(() => {
    const seen = new Map<string, string>() // lowercase -> weergavenaam (eerste keer gezien)
    clubEvents.forEach(e => {
      lineupArtists(e.lineUp).forEach(name => {
        const key = name.toLowerCase()
        if (!seen.has(key)) seen.set(key, name)
      })
    })
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b))
  }, [clubEvents])
  // Wat de dropdown toont: alles bij een leeg zoekveld, anders alleen de
  // namen die matchen — begrensd op 50 zodat het paneel niet honderden rijen
  // lang wordt bij een seizoen met veel line-ups.
  const artistSuggestions = useMemo(() => {
    const q = artistQuery.trim().toLowerCase()
    const list = q ? artistOptions.filter(a => a.toLowerCase().includes(q)) : artistOptions
    return list.slice(0, 50)
  }, [artistOptions, artistQuery])

  // Bereik van de prijsslider: de echte min/max van dit venster, afgerond op
  // hele tientallen — 5€ te ruim aan weerskanten is beter dan een slider die
  // precies op de goedkoopste avond begint en bij de duurste ophoudt zonder
  // speling om te zien dat dat de grens is.
  const priceBounds = useMemo(() => {
    const vals = clubEvents.map(e => priceFromNumber(e.prices)).filter((v): v is number => v != null)
    if (!vals.length) return null
    return { min: Math.floor(Math.min(...vals) / 10) * 10, max: Math.ceil(Math.max(...vals) / 10) * 10 }
  }, [clubEvents])
  // "Alle budgetten" = de schuif helemaal rechts; alleen dan is er geen filter.
  const sliderValue = maxPrice ?? priceBounds?.max ?? 0
  const pricePct = priceBounds && priceBounds.max > priceBounds.min
    ? ((sliderValue - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100
    : 100

  const filteredEvents = useMemo(() => {
    if (venueFilter === 'all' && !artistQuery.trim() && maxPrice == null) return clubEvents
    const q = artistQuery.trim().toLowerCase()
    return clubEvents.filter(e => {
      const matchVenue = venueFilter === 'all' || e.ct_venues?.slug === venueFilter
      const matchArtist = !q || lineupArtists(e.lineUp).some(a => a.toLowerCase().includes(q))
      const price = priceFromNumber(e.prices)
      const matchPrice = maxPrice == null || price == null || price <= maxPrice
      return matchVenue && matchArtist && matchPrice
    })
  }, [clubEvents, venueFilter, artistQuery, maxPrice])

  const activeFilterCount = (venueFilter !== 'all' ? 1 : 0) + (artistQuery.trim() ? 1 : 0) + (maxPrice != null ? 1 : 0)
  const clearFilters = useCallback(() => {
    setVenueFilter('all'); setArtistQuery(''); setMaxPrice(null)
  }, [])

  // Date range for the current period
  const { rangeStart, rangeEnd, stripDays, showStrip } = useMemo(() => {
    let s = today, e = today, strip = true
    if (period === 'day') { s = today; e = addDays(today, 13) }
    else if (period === 'week') { s = startOfWeek(today, { weekStartsOn: 1 }); e = endOfWeek(today, { weekStartsOn: 1 }) }
    else if (period === 'month') { s = startOfMonth(today); e = endOfMonth(today) }
    else { s = today; e = addDays(today, 365); strip = false }
    const days = strip ? eachDayOfInterval({ start: s, end: e }) : []
    return { rangeStart: s, rangeEnd: e, stripDays: days, showStrip: strip }
  }, [period, today])

  const rangeStartStr = format(rangeStart, 'yyyy-MM-dd')
  const rangeEndStr = format(rangeEnd, 'yyyy-MM-dd')

  // Welke week het dock toont. Staat hier en niet verderop omdat het
  // laad-effect hieronder hem nodig heeft.
  const [dockWeekStart, setDockWeekStart] = useState<string>(() => {
    const eerste = seasonDates.find(d => d >= todayStr) || todayStr
    return format(startOfWeek(parseISO(eerste), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  })
  const dockWeekEnd = useMemo(
    () => format(addDays(parseISO(dockWeekStart), 6), 'yyyy-MM-dd'),
    [dockWeekStart],
  )

  /**
   * Tot welke dag we events nodig hebben.
   *
   * Twee dingen bepalen dat, en eerder telde alleen het eerste mee: de
   * periodeknoppen (week/maand) én het weekdock. Bladerde je met het dock naar
   * een week voorbij de veertien geladen dagen, dan werd er niets bijgeladen en
   * bleef die week leeg — de agenda hield zichtbaar op halverwege september.
   */
  const nodigTot = rangeEndStr > dockWeekEnd ? rangeEndStr : dockWeekEnd

  /**
   * Haal het stuk agenda op dat de huidige weergave nodig heeft en dat nog niet
   * geladen is.
   *
   * Alleen het ontbrekende stuk: schakel je van week naar maand en daarna naar
   * jaar, dan komt de maand er één keer bij en daarna alleen de rest van het
   * jaar. Faalt het verzoek, dan blijft staan wat er al was — een kalender die
   * twee weken toont is beter dan een lege.
   */
  useEffect(() => {
    if (!nodigTot || nodigTot <= loadedTo) return
    let cancelled = false
    const from = format(addDays(parseISO(loadedTo), 1), 'yyyy-MM-dd')
    setLoading(true)
    fetch(`/api/calendar-window?locale=${encodeURIComponent(locale)}&from=${from}&to=${nodigTot}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { events?: ExEvent[] }) => {
        if (cancelled) return
        setExtra(prev => [...prev, ...(d.events ?? [])])
        setLoadedTo(nodigTot)
      })
      .catch(() => { /* wat al geladen is blijft staan */ })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [nodigTot, loadedTo, locale])

  const changePeriod = useCallback((p: Period) => {
    setPeriod(p)
    setActiveDay(p === 'day' ? todayStr : null)
  }, [todayStr])

  // Telt filteredEvents, niet clubEvents: anders belooft het dock een dag met
  // events die de gefilterde lijst eronder dan als leeg laat zien.
  const countForDay = useCallback((ds: string) => {
    return filteredEvents.filter(e => e.date === ds).length
  }, [filteredEvents])

  // Fixed bottom week dock (blurred event photos) — day-select filters the list
  const listRef = useRef<HTMLDivElement>(null)
  const imgByDate = useMemo(() => { const m = new Map<string, string>(); pickerEvents.forEach(e => { if (!m.has(e.date) && e.image) m.set(e.date, e.image) }); return m }, [pickerEvents])
  const imagePool = useMemo(() => Array.from(new Set(pickerEvents.map(e => e.image).filter(Boolean))).slice(0, 12) as string[], [pickerEvents])
  // Even wachten tot React de nieuwe dag gerenderd heeft, dan pas scrollen —
  // anders meten we de hoogte van de vorige lijst. scrollSectionIntoView rekent
  // de vaste kop mee én gaat naar de bovenkant wanneer er nauwelijks te
  // scrollen valt; scrollIntoView sneed hier de H1 doormidden.
  useEffect(() => {
    if (!activeDay || !listRef.current) return
    const el = listRef.current
    const t = setTimeout(() => scrollSectionIntoView(el, { gap: 24 }), 90)
    return () => clearTimeout(t)
  }, [activeDay])

  // Tiles: all upcoming events, or just the day picked in the dock
  const rangeEvents = activeDay ? filteredEvents.filter(e => e.date === activeDay) : filteredEvents

  // Grouped by date — shuffled per day, with the biggest clubs favoured toward the
  // top (in random order among themselves), so it's never always "Universe first".
  //
  // PERF/HYDRATION: de shuffle liep op Math.random(). De server schudde dus in
  // een andere volgorde dan de browser, elke tegel stond op een andere plek
  // dan in de HTML, en React gooide bij élke paginalading de complete
  // server-HTML weg ("Hydration failed … the entire root will switch to client
  // rendering") om de agenda — 800 kB, 350 foto's — helemaal opnieuw te
  // renderen. Dat is de agenda die op een telefoon bevroor. Nu is het zaad de
  // datum: nog steeds een andere volgorde per dag, maar server en client
  // komen op hetzelfde uit, en de volgorde van een dag verspringt niet meer
  // bij elke render.
  const grouped = useMemo(() => {
    const TOP = ['unvrs-ibiza', 'hi-ibiza', 'ushuaia-ibiza']
    const m: Record<string, ExEvent[]> = {}
    rangeEvents.forEach(e => { (m[e.date] ||= []).push(e) })
    Object.entries(m).forEach(([ds, a]) => {
      const rnd = seededRandom(ds)
      // shuffle first, then a stable sort that only lifts the top clubs above the rest
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
      a.sort((x, y) => (TOP.includes(x.ct_venues?.slug || '') ? 0 : 1) - (TOP.includes(y.ct_venues?.slug || '') ? 0 : 1))
    })
    return m
  }, [rangeEvents])
  const dateKeys = useMemo(() => Object.keys(grouped).sort(), [grouped])
  const totalCount = useMemo(() => dateKeys.reduce((n, k) => n + grouped[k].length, 0), [dateKeys, grouped])

  const dayHeader = (ds: string) => {
    const d = parseISO(ds)
    if (isToday(d)) return `${T.today} · ${format(d, 'd MMM', { locale: loc })}`
    if (isTomorrow(d)) return `${T.tomorrow} · ${format(d, 'd MMM', { locale: loc })}`
    return format(d, 'EEEE d MMMM', { locale: loc })
  }

  const periods: { key: Period; label: string }[] = [
    { key: 'day', label: T.day }, { key: 'week', label: T.week },
    { key: 'month', label: T.month },
    // 'year' removed — the server only ships a 31-day window now (shipping the
    // full season froze the page).
  ]
  const periodIdx = periods.findIndex(p => p.key === period)

  // overflow-x-clip en niet overflow-hidden. `hidden` maakt van dit element
  // een scrollcontainer, en dan werkt `position: sticky` bij alles wat eronder
  // hangt niet meer -- de dagkoppen bleven zo gewoon meescrollen. `clip` op
  // alleen de horizontale as knipt nog steeds wat buiten beeld steekt, maar
  // laat de verticale as `visible` en dus blijft sticky werken.
  return (
    <div className="theme-monaco-vip bg-neutral-50 text-[var(--color-ink)] min-h-screen relative overflow-x-clip">

      {/* ── Header (house style) ── */}
      <section className="pt-[calc(var(--nav-h)+12px)] pb-0 relative z-10 flex flex-col items-center text-center px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-col gap-1 text-center mb-0">
            {/* De kop is overschrijfbaar: dezelfde verkenner draait op de
                clubagenda en op de activiteitenagenda, en "Ibiza clubagenda"
                boven een lijst buggytours klopt niet. */}
            <h1 className="text-4xl md:text-7xl font-black font-serif text-black leading-tight uppercase m-0 tracking-tight drop-shadow-sm">
              {heading || T.title}
            </h1>
            <p className="hidden md:block font-sans text-base md:text-lg text-neutral-600 max-w-2xl mx-auto mt-5">
              {sub || T.sub}
            </p>
          </div>
        </div>
      </section>


      <div ref={listRef} style={{ scrollMarginTop: 'calc(var(--nav-h) + 32px)', minHeight: activeDay ? 'calc(100svh - var(--nav-h))' : undefined }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-40 pt-8">

        {/* Scroll-down cue — appears once a day is picked in the dock */}
        {activeDay && <ScrollCue className="mb-2" />}

        {/* ── Filters: venue, artist, budget ──────────────────────────────
            Los van de dagkiezer eronder: wie op een club filtert en dan door
            de weken bladert wil die club aanhouden. Het artiestenveld staat
            er alleen als er in dit venster ook echt een line-up gepubliceerd
            is (zie hasAnyLineup) — op de activiteitenagenda is dat zo goed
            als nooit, en een zoekvak dat nooit iets vindt is geen filter. */}
        {/* dangerouslySetInnerHTML en niet <style>{`…`}</style>: die laatste
            vorm laat React de CSS-tekst als gewone child-tekst behandelen
            (HTML-escaped tijdens SSR, bijv. bootpagina's -> bootpagina&#x27;s),
            en dat gaf een text-content mismatch bij hydration -- exact de
            fout die elders op deze site "the entire root will switch to
            client rendering" veroorzaakte. FleetShowcase.tsx gebruikt om
            dezelfde reden ook dangerouslySetInnerHTML voor zijn <style>. */}
        <style dangerouslySetInnerHTML={{ __html: `
          .cal-range { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 9999px; outline: none; cursor: pointer; background: transparent; }
          .cal-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 9999px; background: #fff; border: 3px solid #000; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: grab; transition: transform .15s ease; margin-top: -8px; }
          .cal-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
          .cal-range::-webkit-slider-runnable-track { height: 6px; border-radius: 9999px; }
          .cal-range::-moz-range-thumb { width: 22px; height: 22px; border-radius: 9999px; background: #fff; border: 3px solid #000; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: grab; }
          .cal-range::-moz-range-track { height: 6px; border-radius: 9999px; background: transparent; }
        ` }} />
        {/* Op mobiel drie regels pillen -- verborgen tot sm; daar staat de
            vaste filterknop + sheet (zie onder de WeekDockBar) voor in de
            plaats. */}
        <div className="mb-5 hidden flex-wrap items-center gap-2 sm:flex">
          {/* Club — eigen dropdown in plaats van een systeem-<select>, zodat hij
              bij de rest van de filterrij past. */}
          <div ref={venueDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setVenueOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={venueOpen}
              // border-solid is nodig naast border: de site heeft een globale
              // `button { border: none }`-reset (border-style: none), en
              // border-width rekent zich terug naar 0 zodra border-style
              // "none" wint — ook als een andere regel border-width: 1px zet.
              // Op een <div> of <input> speelt dit niet, alleen op <button>.
              className={`inline-flex items-center gap-1.5 rounded-full border border-solid px-4 py-2 text-xs font-bold transition-colors ${venueFilter !== 'all' ? 'border-ibiza-green bg-ibiza-green text-white' : 'border-black/15 bg-white text-black hover:border-ibiza-green'}`}
            >
              <span className="max-w-[10rem] truncate">{venueLabel}</span>
              <ChevronDown size={14} className={`shrink-0 transition-transform ${venueOpen ? 'rotate-180' : ''}`} />
            </button>
            {venueOpen && (
              <div role="listbox" aria-label={T.allVenues} className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-72 w-60 overflow-y-auto rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl">
                <button
                  type="button"
                  role="option"
                  aria-selected={venueFilter === 'all'}
                  onClick={() => { setVenueFilter('all'); setVenueOpen(false) }}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${venueFilter === 'all' ? 'bg-ibiza-green text-white' : 'text-black hover:bg-black/5'}`}
                >
                  {T.allVenues}
                </button>
                {venueOptions.map(([slug, name]) => (
                  <button
                    key={slug}
                    type="button"
                    role="option"
                    aria-selected={venueFilter === slug}
                    onClick={() => { setVenueFilter(slug); setVenueOpen(false) }}
                    className={`block w-full truncate rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${venueFilter === slug ? 'bg-ibiza-green text-white' : 'text-black hover:bg-black/5'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasAnyLineup && (
            <div ref={artistDropdownRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={artistQuery}
                  onChange={e => { setArtistQuery(e.target.value); setArtistOpen(true) }}
                  onFocus={() => setArtistOpen(true)}
                  placeholder={T.searchArtist}
                  aria-label={T.searchArtist}
                  role="combobox"
                  aria-expanded={artistOpen}
                  aria-haspopup="listbox"
                  aria-controls="calendar-artist-listbox"
                  className="w-44 rounded-full border border-black/15 bg-white py-2 pl-4 pr-8 text-xs font-semibold text-black outline-none transition-colors placeholder:text-black/40 hover:border-ibiza-green focus:border-ibiza-green sm:w-56"
                />
                {artistQuery && (
                  <button
                    type="button"
                    onClick={() => { setArtistQuery(''); setArtistOpen(false) }}
                    aria-label={T.clearFilters}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                  >
                    ×
                  </button>
                )}
              </div>
              {/* Dropdown met de artiesten uit dit venster, gefilterd op wat je
                  typt — geen aparte knop, het zoekvak zelf opent hem. */}
              {artistOpen && artistSuggestions.length > 0 && (
                <div id="calendar-artist-listbox" role="listbox" aria-label={T.searchArtist} className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-72 w-44 overflow-y-auto rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl sm:w-56">
                  {artistSuggestions.map(name => (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      aria-selected={artistQuery === name}
                      onClick={() => { setArtistQuery(name); setArtistOpen(false) }}
                      className={`block w-full truncate rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${artistQuery === name ? 'bg-ibiza-green text-white' : 'text-black hover:bg-black/5'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Budget — schuif in plaats van pillen. Helemaal rechts = geen filter. */}
          {priceBounds && priceBounds.max > priceBounds.min && (
            <div className="flex min-w-[190px] flex-1 items-center gap-3 rounded-full border border-black/15 bg-white py-2 pl-4 pr-3 sm:max-w-[16rem]">
              <span className="shrink-0 whitespace-nowrap text-xs font-bold text-black">
                {maxPrice == null ? T.anyBudget : T.upToPrice(maxPrice)}
              </span>
              <input
                type="range"
                className="cal-range flex-1"
                style={{ background: `linear-gradient(to right, #000 ${pricePct}%, #e5e5e5 ${pricePct}%)` }}
                min={priceBounds.min}
                max={priceBounds.max}
                step={5}
                value={sliderValue}
                onChange={e => {
                  const v = Number(e.target.value)
                  setMaxPrice(v >= (priceBounds?.max ?? 0) ? null : v)
                }}
                aria-label={T.anyBudget}
              />
            </div>
          )}

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold uppercase tracking-widest text-ibiza-green hover:underline"
            >
              {T.clearFilters}
            </button>
          )}
        </div>

        {/* ── Section label (Deals-of-the-Day style) ── */}
        <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-ibiza-green animate-ping shrink-0" />
            <h2 className="text-xl md:text-2xl font-serif font-black text-black uppercase tracking-wide">
              {activeDay ? dayHeader(activeDay) : T.upcoming}
            </h2>
          </div>
          <span className="hidden sm:inline text-xs font-bold text-black/60 uppercase tracking-widest">{T.events(totalCount)}</span>
        </div>

        {/* ── Tiles ── */}
        {totalCount === 0 && loading ? (
          /* Nog niets te tonen omdat de maand of het jaar nog binnenkomt. Zonder
             dit stond er "geen events" op het moment dat er juist geladen werd —
             het ene bericht dat je hier níét wilt geven. */
          <div
            role="status"
            aria-live="polite"
            className="col-span-full text-center py-20 text-black/60 bg-black/5 rounded-3xl border border-black/10"
          >
            <Calendar className="w-12 h-12 mx-auto mb-4 animate-pulse opacity-30 text-ibiza-green" />
            <p className="font-semibold text-base">{T.loading}</p>
          </div>
        ) : totalCount === 0 ? (
          /* Twee verschillende "niets" — het onderscheid maakt uit: geen
             programma die avond is een feit over Ibiza, een leeg filter is
             "zet je zoekopdracht ruimer" en verdient een uitweg. */
          <div className="col-span-full text-center py-20 text-black/60 bg-black/5 rounded-3xl border border-black/10">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30 text-ibiza-green" />
            <p className="font-semibold text-base">{activeFilterCount > 0 ? T.noMatchFiltered : T.noEvents}</p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center rounded-full border-2 border-black bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
              >
                {T.clearFilters}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {dateKeys.map(ds => (
              <div key={ds} className="[contain-intrinsic-size:auto_640px] [content-visibility:auto]">
                {/* Day group header (only meaningful for multi-day ranges) */}
                {!activeDay && (
                  <h3 className="sticky top-[var(--nav-h-min)] z-20 -mx-2 mb-4 flex items-center gap-3 rounded-xl bg-neutral-50/95 px-2 py-2.5 font-serif text-lg font-black capitalize text-black backdrop-blur-sm md:text-xl">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-ibiza-green/15 text-ibiza-green"><Calendar size={16} /></span>
                    {dayHeader(ds)}
                    <span className="text-sm font-bold text-black/60">· {grouped[ds].length}</span>
                  </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {grouped[ds].map(ev => {
                    const image = ev.ct_events?.cover || venueOf(ev)?.picture || ''
                    const logoSrc = venueOf(ev)?.whitelogo
                    const slug = ev.ct_venues?.slug || ''
                    const artists = lineupArtists(ev.lineUp).slice(0, 3)
                    const extra = Math.max(0, lineupArtists(ev.lineUp).length - 3)
                    const price = priceFrom(ev.prices)
                    // De avond waarop geklikt wordt gaat mee: deze lijst is per dag,
                    // en zonder datum opent de detailpagina op de eerstvolgende.
                    const href = withDate(`${base}/${eventBasePath(venueOf(ev)?.type_slug || '')}/${slug || 'club'}/${ev.ct_events?.slug || 'event'}`, ev.date)
                    return (
                      <Link
                        key={ev.id}
                        href={href}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-black/8 hover:border-gold/60 transition-all duration-300 group flex flex-col hover:-translate-y-1 hover:scale-[1.01]"
                      >
                        <div className="h-48 relative bg-[#0D0509] overflow-hidden shrink-0">
                          {image ? (
                            <img src={optImg(image, 500)} loading="lazy" alt={ev.ct_events?.name || ev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-[#0D0509] to-neutral-900" />
                          )}

                          {/* Price badge */}
                          {price && (
                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white border border-white/30 font-black text-sm px-4 py-1.5 rounded-lg shadow-lg">
                              {price}
                            </div>
                          )}

                          {/* Club logo badge */}
                          {logoSrc && (
                            <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl bg-white border border-white/20 p-1.5 flex items-center justify-center shadow-lg z-10">
                              <img
                                src={logoSrc}
                                alt={`${venueOf(ev)?.name || 'Ibiza club'} logo`}
                                style={{ filter: KEEP_LOGO.includes(slug) ? 'none' : 'brightness(0)' }}
                                className="object-contain max-w-full max-h-full"
                              />
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1 text-black">
                          <div className="text-ibiza-green text-[10px] font-black tracking-widest uppercase mb-1.5">
                            {ev.date}
                          </div>
                          <h3 className="text-lg font-bold text-black leading-snug mb-1 group-hover:text-ibiza-green transition-colors line-clamp-2">
                            {ev.ct_events?.name || ev.name}
                          </h3>
                          {artists.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {artists.map((a, i) => (
                                <span key={i} className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/70 ring-1 ring-black/10">{a}</span>
                              ))}
                              {extra > 0 && <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-ibiza-green">+{extra} {T.lineupMore}</span>}
                            </div>
                          ) : ev.ct_events?.blurb ? (
                            /* Geen line-up in de feed -- dat is bij negen van de tien
                               avonden zo, en dan staat er letterlijk een leeg
                               alineablokje. Deze kaarten toonden dus alleen een titel
                               en een prijs. De eerste zin uit de eventbeschrijving
                               zegt wel wat voor avond het is, en die hebben ze
                               allemaal. Niets verzonnen: dit is de tekst van
                               ClubTickets zelf, in de taal van de pagina. */
                            <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-black/55">{ev.ct_events.blurb}</p>
                          ) : null}
                          <div className="text-xs font-semibold text-black/60 flex items-center gap-1.5 mb-5 mt-auto pt-3">
                            <MapPin size={14} className="text-black/60" /> {ev.ct_venues?.name || 'Ibiza'}
                          </div>
                          <div className="pt-4 border-t border-black/10 w-full mt-auto flex justify-between items-center">
                            <span className="text-xs font-bold text-black/60 uppercase tracking-widest">{T.tickets}</span>
                            <span className="bg-ibiza-green text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider group-hover:brightness-95 transition-all">
                              {T.view}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed bottom week dock — blurred event photos, white text; pick a day to open it */}
      {seasonDates.length > 0 && (
        <WeekDockBar
          /* Het hele seizoen, niet alleen wat geladen is — anders kun je niet
             verder bladeren dan de veertien dagen uit de HTML. */
          eventDates={seasonDates}
          today={todayStr}
          weekStart={dockWeekStart}
          setWeekStart={setDockWeekStart}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          locale={locale}
          variant="photo"
          photoDim={false}
          imageFor={(iso) => imgByDate.get(iso) || ''}
          imagePool={imagePool}
        />
      )}

      {/* Mobiel: vaste filterknop rechts, halverwege het scherm (niet
          onderin -- daar zit de weekdock al). Opent dezelfde drie filters
          als de rij hierboven, maar als sheet. Badge toont hoeveel filters
          al aanstaan. */}
      <button
        type="button"
        onClick={() => setFilterModalOpen(true)}
        aria-label={T.filters}
        // border-solid om dezelfde reden als de club-pil hierboven: de
        // globale `button { border:none }`-reset wint anders van border-width.
        // bottom-[130px] en niet top-1/2: op het midden van het scherm viel
        // de knop over een kaart heen (prijsbadge eronder), en verschoof
        // steeds naar iets anders zodra je scrolde. Onderin zit al de vaste
        // weekdock (111px hoog); 130px erboven is boven die dock met marge.
        className="fixed bottom-[130px] right-4 z-[60] grid h-14 w-14 place-items-center rounded-full border border-solid border-black/10 bg-black text-white shadow-lg transition-transform hover:scale-105 sm:hidden"
      >
        <SlidersHorizontal size={20} />
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ibiza-green text-[10px] font-black text-white ring-2 ring-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filtermenu als sheet -- zelfde chrome als DatePickerModal (focus,
          Escape sluit, achtergrond niet scrollbaar; zie het effect hierboven). */}
      {filterModalOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:hidden"
          onClick={() => setFilterModalOpen(false)}
          role="presentation"
        >
          <div
            ref={filterModalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={T.filters}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85svh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 text-black shadow-2xl outline-none"
            style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-xl font-black tracking-tight">{T.filters}</h2>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                aria-label={T.close}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-solid border-black/15 bg-white text-black transition-colors hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Club — als pillenrij in plaats van een geneste dropdown: in
                een sheet is er al ruimte, en dat scheelt een extra tik. */}
            <div className="mt-6">
              <div className="mb-2 text-xs font-black uppercase tracking-widest text-black/50">{T.club}</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setVenueFilter('all')}
                  className={`rounded-full border border-solid px-3.5 py-2 text-xs font-bold transition-colors ${venueFilter === 'all' ? 'border-ibiza-green bg-ibiza-green text-white' : 'border-black/15 bg-white text-black'}`}
                >
                  {T.allVenues}
                </button>
                {venueOptions.map(([slug, name]) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => setVenueFilter(slug)}
                    className={`rounded-full border border-solid px-3.5 py-2 text-xs font-bold transition-colors ${venueFilter === slug ? 'border-ibiza-green bg-ibiza-green text-white' : 'border-black/15 bg-white text-black'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {hasAnyLineup && (
              <div className="mt-6">
                <div className="mb-2 text-xs font-black uppercase tracking-widest text-black/50">{T.artist}</div>
                <input
                  type="text"
                  value={artistQuery}
                  onChange={e => setArtistQuery(e.target.value)}
                  placeholder={T.searchArtist}
                  aria-label={T.searchArtist}
                  className="w-full rounded-full border border-solid border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-black outline-none placeholder:text-black/40 focus:border-ibiza-green"
                />
                {/* Alleen suggesties tonen zodra er getypt is — niet meteen
                    alle namen uit dit venster, dat is een muur van pillen
                    voordat je iets hebt ingetikt. */}
                {artistQuery.trim() && artistSuggestions.length > 0 && (
                  <div className="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
                    {artistSuggestions.map(name => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setArtistQuery(name)}
                        className={`rounded-full border border-solid px-3 py-1.5 text-[11px] font-bold transition-colors ${artistQuery === name ? 'border-ibiza-green bg-ibiza-green text-white' : 'border-black/15 bg-white text-black'}`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {priceBounds && priceBounds.max > priceBounds.min && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest text-black/50">
                  <span>{T.budget}</span>
                  <span className="text-black normal-case tracking-normal">{maxPrice == null ? T.anyBudget : T.upToPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  className="cal-range w-full"
                  style={{ background: `linear-gradient(to right, #000 ${pricePct}%, #e5e5e5 ${pricePct}%)` }}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={5}
                  value={sliderValue}
                  onChange={e => {
                    const v = Number(e.target.value)
                    setMaxPrice(v >= (priceBounds?.max ?? 0) ? null : v)
                  }}
                  aria-label={T.anyBudget}
                />
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold uppercase tracking-widest text-ibiza-green hover:underline"
                >
                  {T.clearFilters}
                </button>
              )}
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="ml-auto inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black text-white transition-colors hover:brightness-95"
              >
                {T.showResults(rangeEvents.length)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
