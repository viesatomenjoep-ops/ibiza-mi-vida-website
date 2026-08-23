'use client'

import { useEffect, useRef, useState } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { HOME_BOUNDS, MAX_BOUNDS, MAP_CLUBS, MAP_ACTIVITIES, type MapPlace } from '@/data/ibiza-map-clubs'

const FALLBACK_TITLE: Record<string, string> = {
  nl: 'Kaart niet beschikbaar op dit toestel', en: 'Map unavailable on this device',
  de: 'Karte auf diesem Gerät nicht verfügbar', es: 'Mapa no disponible en este dispositivo',
  fr: 'Carte indisponible sur cet appareil',
}
const FALLBACK_BODY: Record<string, string> = {
  nl: 'Tik een naam hieronder aan om er direct heen te gaan', en: 'Tap a name below to jump straight there',
  de: 'Tippe unten einen Namen an, um direkt dorthin zu springen', es: 'Toca un nombre abajo para ir directo',
  fr: 'Touchez un nom ci-dessous pour y accéder directement',
}

/**
 * Real 3D map of Ibiza: MapLibre GL (open-source, no API key) over free Esri
 * satellite imagery + AWS open-data terrain elevation, with camera pitch/
 * bearing and a slow idle auto-rotation — genuinely 3D, not a flat pin map.
 * Ported from the original standalone widget (public/ibiza-kaart.html) into
 * a proper React component so it can be embedded both in the /m app shell
 * and the marketing site's mobile view, with click behaviour supplied by
 * the caller (open a sheet in the app, navigate to a page on the site).
 *
 * maplibre-gl touches the DOM/canvas at import time, so it's loaded via a
 * dynamic import inside useEffect — never at module scope — to stay SSR-safe.
 */
export function Map3D({
  height = '420px',
  onSelectPlace,
  className = '',
  locale = 'en',
}: {
  height?: string
  /** Called when a marker or chip is tapped — caller decides navigate vs. open a sheet. */
  onSelectPlace: (place: MapPlace) => void
  className?: string
  locale?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('maplibre-gl').Map | null>(null)
  const markersRef = useRef<import('maplibre-gl').Marker[]>([])
  const [group, setGroup] = useState<'clubs' | 'activities'>('clubs')
  const [active, setActive] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  // Mobile GPUs (especially with the raster-dem terrain layer active) are the
  // realistic failure point for MapLibre — WebGL context creation can throw,
  // tile/style loading can error out, or `load` can simply never fire. None
  // of that was previously caught, so a failure just left "Loading map…"
  // stuck forever with no way out. `failed` drives a real fallback instead.
  const [failed, setFailed] = useState(false)
  const groupRef = useRef(group)
  groupRef.current = group

  const list = group === 'clubs' ? MAP_CLUBS : MAP_ACTIVITIES

  useEffect(() => {
    let cancelled = false
    let rafId = 0
    let succeeded = false
    let loadTimer: ReturnType<typeof setTimeout> | undefined

    // `fail` can be called from a timer queued well before the map actually
    // finishes loading — if that timer's callback runs AFTER a genuine
    // success (a slow-but-eventually-successful load, or scheduling jitter
    // under load), it must never be allowed to stomp a working map back into
    // the error state. `succeeded` is the one-way latch that guarantees that.
    const fail = (why: unknown) => { if (!cancelled && !succeeded) setFailed(true) }

    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (cancelled || !containerRef.current) return

      // If `load` never fires (WebGL context wedged, tiles never resolve at
      // all) fall back instead of an infinite spinner. Generous on purpose —
      // this is fetching satellite AND terrain tiles for the initial view,
      // which can genuinely take a while on real mobile data; the
      // `succeeded` latch above means a late-but-real success can never be
      // undone by this firing, so there's no real cost to waiting it out.
      loadTimer = setTimeout(() => fail('load-timeout'), 20000)

      const PADDING = { top: 28, bottom: 28, left: 28, right: 28 }
      let map: import('maplibre-gl').Map
      try {
        map = new maplibregl.Map({
          container: containerRef.current,
          bounds: HOME_BOUNDS,
          fitBoundsOptions: { padding: PADDING },
          interactive: false,
          pitch: 0,
          bearing: 0,
          antialias: true,
          // Capped at 2x, not 3x — a 3D terrain layer at full retina density on
          // real mobile GPUs is a common cause of dropped frames or a wedged
          // context; 2x is visually indistinguishable on a phone screen.
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          attributionControl: false,
          style: {
            version: 8,
            sources: {
              satellite: {
                type: 'raster',
                tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                tileSize: 128,
                maxzoom: 19,
                attribution: 'Esri, Maxar',
              },
              dem: {
                type: 'raster-dem',
                tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
                encoding: 'terrarium',
                tileSize: 256,
                maxzoom: 13,
              },
            },
            layers: [{ id: 'satellite', type: 'raster', source: 'satellite' }],
          },
        })
      } catch (err) {
        // WebGL context creation itself threw — e.g. "Failed to initialize
        // WebGL" on a browser/device that reports support but can't actually
        // allocate a context (seen on some Android WebViews and low-memory
        // conditions on iOS Safari).
        fail(err)
        return
      }
      mapRef.current = map

      // Deliberately not wiring 'error' or 'webglcontextlost' to `fail()` —
      // both fire for non-fatal, often-recoverable hiccups too (a single
      // tile 404, a transient context loss under memory pressure that the
      // browser silently recovers from), and a false-positive fallback that
      // kills a map which would've been fine is worse than the rare genuine
      // failure. The try/catch above catches hard construction failures; the
      // load-timeout below is the generic backstop for "never became usable,
      // whatever the reason" — that's a safer signal than any single event.

      // Black & white "ink" look, matching the app's obsidian/app-accent theme
      // (raw satellite colour would clash badly with the rest of the UI).
      map.getCanvas().style.filter = 'grayscale(1) contrast(1.16) brightness(1.06)'

      let overviewZoom = 9
      let selected = false

      const buildMarkers = (places: MapPlace[]) => {
        markersRef.current.forEach(m => m.remove())
        markersRef.current = places.map(place => {
          const el = document.createElement('button')
          el.type = 'button'
          el.setAttribute('aria-label', place.name)
          el.style.cssText =
            'display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:rgba(11,12,16,.92);border:1.5px solid rgba(255,255,255,.55);cursor:pointer;box-shadow:0 10px 26px -8px rgba(0,0,0,.6);overflow:hidden;transition:transform .2s;'
          const media = place.logo || place.img
          el.innerHTML = media
            ? `<img src="${media}" alt="" style="max-width:74%;max-height:64%;object-fit:contain;${place.photo ? 'width:100%;height:100%;max-width:none;max-height:none;object-fit:cover;' : 'filter:brightness(0) invert(1);'}">`
            : `<span style="color:#EFEDEA;font-weight:800;font-size:10px;">${(place.ini || place.name.slice(0, 2)).toUpperCase()}</span>`
          el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.12)' })
          el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
          el.addEventListener('click', e => {
            e.stopPropagation()
            selected = true
            setActive(place.name)
            onSelectPlace(place)
            map.flyTo({ center: place.coords, zoom: 13.7, pitch: 58, bearing: -14, duration: 1800, essential: true, padding: PADDING })
          })
          return new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(place.coords).addTo(map)
        })
      }

      const showAll = (places: MapPlace[], instant = false) => {
        selected = false
        setActive(null)
        buildMarkers(places)
        map.fitBounds(HOME_BOUNDS, { padding: PADDING, pitch: 38, bearing: -12, duration: instant ? 0 : 1400 })
      }

      map.on('load', () => {
        if (cancelled) return
        succeeded = true
        clearTimeout(loadTimer)
        // Terrain (raster-dem elevation) is the single heaviest feature here
        // and the most likely to fail on an older/weaker mobile GPU. Degrade
        // to the flat satellite map instead of failing the whole component —
        // still pitched/rotating/interactive, just without 3D relief.
        try { map.setTerrain({ source: 'dem', exaggeration: 1.15 }) } catch { /* flat satellite still works without terrain */ }
        try {
          map.setSky({
            'sky-color': '#9EC1DA',
            'horizon-color': '#0B0C10',
            'fog-color': '#0B0C10',
            'sky-horizon-blend': 0.5,
            'horizon-fog-blend': 0.5,
            'fog-ground-blend': 0.85,
          } as maplibregl.SkySpecification)
        } catch { /* setSky unsupported on this GL context — non-fatal, cosmetic only */ }
        try { overviewZoom = map.cameraForBounds(HOME_BOUNDS, { padding: PADDING })?.zoom ?? overviewZoom } catch { /* fitBounds fallback already applied */ }
        showAll(groupRef.current === 'clubs' ? MAP_CLUBS : MAP_ACTIVITIES, true)
        setReady(true)

        // Slow idle rotation — stops once a place is picked.
        const spin = () => {
          if (!cancelled && !selected && !map.isEasing()) {
            try { map.setBearing(map.getBearing() - 0.006) } catch { /* map torn down mid-frame */ }
          }
          rafId = requestAnimationFrame(spin)
        }
        spin()
      })

      // Expose a group-switch handle for the effect below (avoids re-creating the map).
      ;(map as unknown as { __showGroup?: (g: 'clubs' | 'activities') => void }).__showGroup = g =>
        showAll(g === 'clubs' ? MAP_CLUBS : MAP_ACTIVITIES)
    }).catch(err => fail(err)) // chunk failed to load — flaky mobile connection, etc.

    return () => {
      cancelled = true
      clearTimeout(loadTimer)
      cancelAnimationFrame(rafId)
      markersRef.current.forEach(m => m.remove())
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map is created once; group switches go through the ref-based handle
  }, [])

  useEffect(() => {
    const handle = (mapRef.current as unknown as { __showGroup?: (g: 'clubs' | 'activities') => void } | null)?.__showGroup
    handle?.(group)
  }, [group])

  return (
    // Self-contained dark "instrument console" card — this component is used
    // on both the all-dark /m shell and the light marketing site, so it never
    // relies on the host page's background/text colour to read correctly.
    <div className={`rounded-[32px] border border-white/10 bg-obsidian-card p-4 ${className}`}>
      <div
        className="relative overflow-hidden rounded-[24px] border border-white/10 bg-obsidian"
        style={{ height }}
      >
        <div ref={containerRef} className="absolute inset-0" />
        {/* HUD chrome */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #EFEDEA 0 1px, transparent 1px 90px), repeating-linear-gradient(90deg, #EFEDEA 0 1px, transparent 1px 90px)' }} />
          <div className="absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.45)]" />
          {[['top-3 left-3', 'border-t-2 border-l-2'], ['top-3 right-3', 'border-t-2 border-r-2'], ['bottom-3 left-3', 'border-b-2 border-l-2'], ['bottom-3 right-3', 'border-b-2 border-r-2']].map(([pos, border]) => (
            <span key={pos} className={`absolute ${pos} h-5 w-5 ${border} border-white/40`} />
          ))}
          <div className={`absolute bottom-3 left-3 flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-[10px] tracking-wide text-white backdrop-blur-sm ${active ? 'bg-black/80' : 'bg-black/70'}`}>
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-white" />
            {active || `EIVISSA · ${list.length} ${group === 'clubs' ? 'CLUBS' : 'ACTIVITIES'}`}
          </div>
        </div>
        {!ready && !failed && (
          <div className="absolute inset-0 grid place-items-center bg-obsidian text-[11px] font-bold uppercase tracking-widest text-white/30">
            Loading map…
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-obsidian px-6 text-center">
            <span className="text-[13px] font-bold text-white/60">{FALLBACK_TITLE[locale] || FALLBACK_TITLE.en}</span>
            <span className="text-[11px] text-white/35">{FALLBACK_BODY[locale] || FALLBACK_BODY.en}</span>
          </div>
        )}
      </div>

      {/* Group toggle */}
      <div className="mt-3 flex gap-2">
        {(['clubs', 'activities'] as const).map(g => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            aria-pressed={group === g}
            className={`rounded-full border px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100 ${
              group === g ? 'border-app-accent bg-app-accent text-white' : 'border-white/15 text-white/50 hover:text-white/80'
            }`}
          >
            {g === 'clubs' ? 'Clubs' : 'Activities'}
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map(place => (
          <button
            key={place.name}
            type="button"
            onClick={() => {
              setActive(place.name)
              onSelectPlace(place)
              mapRef.current?.flyTo({ center: place.coords, zoom: 13.7, pitch: 58, bearing: -14, duration: 1800, essential: true })
            }}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100 ${
              active === place.name ? 'border-app-accent bg-app-accent text-white' : 'border-white/10 bg-obsidian-card text-white/70 hover:border-white/25'
            }`}
          >
            {place.name}
          </button>
        ))}
      </div>
    </div>
  )
}
