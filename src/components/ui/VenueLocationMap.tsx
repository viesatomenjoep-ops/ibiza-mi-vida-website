'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Maximize2, X, ExternalLink, Navigation } from 'lucide-react'

interface VenueLocationMapProps {
  /** Venue / club name — used to build the Google Maps query */
  venueName: string
  /** Locale for the UI labels (en, nl, de, es, fr) */
  locale?: string
  /** Extra location hint appended to the query (defaults to "Ibiza, Spain") */
  region?: string
  /** Optional dark theme (light text on dark card) */
  dark?: boolean
}

interface MapLabels {
  title: string
  subtitle: string
  enlarge: string
  close: string
  openInMaps: string
  directions: string
}

const LABELS: Record<string, MapLabels> = {
  en: {
    title: 'Location',
    subtitle: 'Zoom, drag and explore the map',
    enlarge: 'Enlarge',
    close: 'Close',
    openInMaps: 'Open in Google Maps',
    directions: 'Get directions',
  },
  nl: {
    title: 'Locatie',
    subtitle: 'Zoom, sleep en verken de kaart',
    enlarge: 'Vergroten',
    close: 'Sluiten',
    openInMaps: 'Openen in Google Maps',
    directions: 'Route bekijken',
  },
  de: {
    title: 'Standort',
    subtitle: 'Zoomen, ziehen und Karte erkunden',
    enlarge: 'Vergrößern',
    close: 'Schließen',
    openInMaps: 'In Google Maps öffnen',
    directions: 'Route anzeigen',
  },
  es: {
    title: 'Ubicación',
    subtitle: 'Amplía, arrastra y explora el mapa',
    enlarge: 'Ampliar',
    close: 'Cerrar',
    openInMaps: 'Abrir en Google Maps',
    directions: 'Cómo llegar',
  },
  fr: {
    title: 'Emplacement',
    subtitle: 'Zoomez, déplacez et explorez la carte',
    enlarge: 'Agrandir',
    close: 'Fermer',
    openInMaps: 'Ouvrir dans Google Maps',
    directions: 'Itinéraire',
  },
}

export function VenueLocationMap({
  venueName,
  locale = 'en',
  region = 'Ibiza, Spain',
  dark = false,
}: VenueLocationMapProps) {
  const [expanded, setExpanded] = useState(false)
  const L = LABELS[locale] || LABELS.en

  const query = `${venueName}, ${region}`.trim()
  const encoded = encodeURIComponent(query)
  // Keyless embed — interactive: zoom (+/-), drag, satellite. Works for every venue automatically.
  const embedSrc = `https://maps.google.com/maps?q=${encoded}&z=14&output=embed`
  const embedSrcLarge = `https://maps.google.com/maps?q=${encoded}&z=15&output=embed`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encoded}`
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`

  // Lock body scroll while the fullscreen map is open + close on Escape
  useEffect(() => {
    if (!expanded) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [expanded])

  const cardBg = dark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'
  const titleColor = dark ? 'text-white' : 'text-black'
  const subColor = dark ? 'text-white/50' : 'text-black/50'
  const chipBg = dark
    ? 'bg-white/10 text-white hover:bg-white/20'
    : 'bg-black text-white hover:bg-black/80'

  return (
    <div className={`rounded-3xl border ${cardBg} p-4 md:p-5 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-ibiza-green flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-black" />
          </div>
          <div className="min-w-0">
            <h3 className={`text-base md:text-lg font-black leading-tight truncate ${titleColor}`}>
              {L.title} — {venueName}
            </h3>
            <p className={`text-xs font-medium ${subColor} truncate`}>{L.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(true)}
          aria-label={L.enlarge}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${chipBg}`}
        >
          <Maximize2 size={14} />
          <span className="hidden sm:inline">{L.enlarge}</span>
        </button>
      </div>

      {/* Inline map */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-black/10">
        <iframe
          title={`${L.title} — ${venueName}`}
          src={embedSrc}
          className="w-full h-[280px] md:h-[340px]"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={directionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ibiza-green px-4 py-2.5 text-sm font-bold text-white transition-all hover:brightness-95"
        >
          <Navigation size={16} /> {L.directions}
        </a>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
            dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'
          }`}
        >
          <ExternalLink size={16} /> {L.openInMaps}
        </a>
      </div>

      {/* Fullscreen modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/80 p-3 md:p-6 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-ibiza-green flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-black" />
                </div>
                <span className="truncate text-base md:text-lg font-black text-black">
                  {L.title} — {venueName}
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                aria-label={L.close}
                className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-black/80"
              >
                <X size={15} /> {L.close}
              </button>
            </div>
            <div className="relative flex-1">
              <iframe
                title={`${L.title} — ${venueName} (large)`}
                src={embedSrcLarge}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-black/10 px-5 py-4">
              <a
                href={directionsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ibiza-green px-4 py-2.5 text-sm font-bold text-white transition-all hover:brightness-95"
              >
                <Navigation size={16} /> {L.directions}
              </a>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-black/10"
              >
                <ExternalLink size={16} /> {L.openInMaps}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
