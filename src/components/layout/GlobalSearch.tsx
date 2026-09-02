'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  open: T('Zoeken', 'Search', 'Suchen', 'Buscar', 'Rechercher'),
  placeholder: T(
    'Zoek een club, event, artiest of boot',
    'Search a club, event, artist or boat',
    'Club, Event, Künstler oder Boot suchen',
    'Busca un club, evento, artista o barco',
    'Cherchez un club, événement, artiste ou bateau',
  ),
  suggesties: T('Suggesties', 'Suggestions', 'Vorschläge', 'Sugerencias', 'Suggestions'),
  resultaten: T('Resultaten', 'Results', 'Ergebnisse', 'Resultados', 'Résultats'),
  niets: T('Niets gevonden', 'Nothing found', 'Nichts gefunden', 'Sin resultados', 'Aucun résultat'),
  sluit: T('Sluiten', 'Close', 'Schließen', 'Cerrar', 'Fermer'),
  zoeken: T('Zoeken…', 'Searching…', 'Suche…', 'Buscando…', 'Recherche…'),
}

interface Treffer {
  id: string
  type: string
  title: string
  subtitle?: string | null
  image?: string | null
  url: string
}

/**
 * Zoeken over de hele site, vanuit de navigatiebalk.
 *
 * ── Wat dit oplost ────────────────────────────────────────────────────────
 * De site heeft honderden clubavonden, tweeënveertig aanbieders,
 * vierennegentig boten en een stuk of vijftien vaste pagina's, en er was geen
 * enkele manier om iets te zóeken. Wie wist dat "Garage Nation" bestond moest
 * het via het menu en de juiste dag zien te vinden.
 *
 * ── Vorm ──────────────────────────────────────────────────────────────────
 * De knop is dezelfde zwarte pil als de taalkiezer en staat ernaast, tussen
 * het logo en het hamburgermenu. Aanklikken vervangt de balk niet maar legt er
 * een vlak overheen: het veld pakt de volle breedte, de resultaten hangen
 * eronder.
 *
 * ── Suggesties ────────────────────────────────────────────────────────────
 * Een leeg zoekveld met een knipperende cursor legt het werk bij de bezoeker.
 * Zodra het paneel opengaat halen we daarom de eerstvolgende avonden en de
 * vaste ingangen op, uit dezelfde feed als de zoekresultaten zelf — er staat
 * dus nooit iets tussen dat niet bestaat.
 *
 * ── Zuinigheid ────────────────────────────────────────────────────────────
 * Er gaat geen enkel verzoek uit tot je de knop indrukt. Daarna wordt er 250 ms
 * gewacht na je laatste toetsaanslag, en elk nieuw verzoek breekt het vorige af
 * met een AbortController — anders kan een traag antwoord op "gar" over het
 * snelle antwoord op "garage" heen komen te staan.
 */
export function GlobalSearch({ locale = 'nl' }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const [vraag, setVraag] = useState('')
  const [treffers, setTreffers] = useState<Treffer[]>([])
  const [bezig, setBezig] = useState(false)
  const [isSuggestie, setIsSuggestie] = useState(true)
  const router = useRouter()
  const veldRef = useRef<HTMLInputElement>(null)
  const paneelRef = useRef<HTMLDivElement>(null)
  const lopend = useRef<AbortController | null>(null)

  const haal = useCallback(async (term: string) => {
    lopend.current?.abort()
    const ac = new AbortController()
    lopend.current = ac
    setBezig(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&locale=${locale}`, { signal: ac.signal })
      const data = await res.json()
      setTreffers(Array.isArray(data.results) ? data.results : [])
      setIsSuggestie(term.length === 0)
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setTreffers([])
    } finally {
      if (!ac.signal.aborted) setBezig(false)
    }
  }, [locale])

  // Openen: focus in het veld en meteen de suggesties ophalen.
  useEffect(() => {
    if (!open) return
    veldRef.current?.focus()
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const buiten = (e: MouseEvent) => {
      if (paneelRef.current && !paneelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', esc)
    document.addEventListener('mousedown', buiten)
    return () => { document.removeEventListener('keydown', esc); document.removeEventListener('mousedown', buiten) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const term = vraag.trim()
    const timer = setTimeout(() => haal(term), term ? 250 : 0)
    return () => clearTimeout(timer)
  }, [vraag, open, haal])

  const ga = (r: Treffer) => {
    setOpen(false)
    setVraag('')
    router.push(r.url)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // Dezelfde klassen als de taalpil, zodat hij automatisch meekleurt met
        // elke navbarstand (wit op donker, zwart op licht) zonder dat die
        // regels hier herhaald worden.
        className="nav-lang active nav-search-btn"
        aria-label={t(L.open, locale)}
        aria-expanded={open}
      >
        <Search size={13} aria-hidden />
      </button>

      {open && (
        <div className="nav-search-overlay" role="dialog" aria-modal="true" aria-label={t(L.open, locale)}>
          <div ref={paneelRef} className="nav-search-panel">
            <div className="nav-search-row">
              <Search size={18} aria-hidden className="shrink-0 text-neutral-400" />
              <input
                ref={veldRef}
                type="search"
                value={vraag}
                onChange={e => setVraag(e.target.value)}
                placeholder={t(L.placeholder, locale)}
                className="nav-search-input"
                autoComplete="off"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label={t(L.sluit, locale)} className="nav-search-close">
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="nav-search-body">
              <p className="nav-search-label">
                {bezig ? t(L.zoeken, locale) : isSuggestie ? t(L.suggesties, locale) : t(L.resultaten, locale)}
              </p>
              {!bezig && treffers.length === 0 && (
                <p className="px-1 py-6 text-center text-sm text-neutral-500">{t(L.niets, locale)}</p>
              )}
              <ul className="nav-search-list">
                {treffers.map(r => (
                  <li key={r.id}>
                    <button type="button" onClick={() => ga(r)} className="nav-search-hit">
                      <span className="nav-search-thumb">
                        {r.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.image} alt="" loading="lazy" decoding="async" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-[14px] font-bold text-neutral-900">{r.title}</span>
                        {r.subtitle ? (
                          <span className="block truncate text-[12px] text-neutral-500">{r.subtitle}</span>
                        ) : null}
                      </span>
                      <span className="nav-search-type">{r.type}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
