'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppEvent, AppVenue, AppArtist, AppBoat, SheetState, TabId, AgendaView } from './types'
import type { AppLabels } from './i18n'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'
import { BottomSheet } from './BottomSheet'
import { EventSheet } from './EventSheet'
import { VenueSheet } from './VenueSheet'
import { ArtistSheet } from './ArtistSheet'
import { BoatSheet } from './BoatSheet'
import { DatePickerSheet } from './DatePickerSheet'
import { PlannerScreen } from './PlannerScreen'
import { AgendaScreen } from './screens/AgendaScreen'
import { EventsScreen } from './screens/EventsScreen'
import { BoatsScreen } from './screens/BoatsScreen'
import { SearchScreen } from './screens/SearchScreen'
import { MapScreen } from './screens/MapScreen'
import { GuestlistScreen } from './screens/GuestlistScreen'

export interface ScreenProps {
  events: AppEvent[]
  venues: AppVenue[]
  artists: AppArtist[]
  t: AppLabels
  locale: string
  openEvent: (e: AppEvent) => void
  openVenue: (v: AppVenue) => void
  openArtist: (a: AppArtist) => void
  heroVideoSrc: string
  heroVideoPoster: string
}

/**
 * App shell. Two pieces of state drive everything:
 *  - `tab`     → which bottom-nav screen is mounted (6 tabs, see BottomNav)
 *  - `sheet`   → the half-screen drawer (event/venue/artist/boat detail, or
 *                the shared date picker — resolved via a pending-promise ref
 *                so ANY caller, including the full-screen Planner, can await
 *                a date pick without owning sheet state itself)
 * The Planner is a separate full-screen overlay (`plannerOpen`), not a tab —
 * it's reached via the header pill or an Explore banner, and can itself open
 * the shared date-picker sheet on top of it.
 */
export function MobileApp({
  events,
  venues,
  artists,
  boats,
  labels: t,
  locale,
  heroVideoSrc,
  heroVideoPoster,
}: {
  events: AppEvent[]
  venues: AppVenue[]
  artists: AppArtist[]
  boats: AppBoat[]
  labels: AppLabels
  locale: string
  heroVideoSrc: string
  heroVideoPoster: string
}) {
  const [tab, setTab] = useState<TabId>('agenda')
  const [agendaView, setAgendaView] = useState<AgendaView>('calendar')
  const [sheet, setSheet] = useState<SheetState>(null)
  const [plannerOpen, setPlannerOpen] = useState(false)
  const pickResolver = useRef<((iso: string | null) => void) | null>(null)

  const openEvent = useCallback((event: AppEvent) => setSheet({ kind: 'event', event }), [])
  const openVenue = useCallback((venue: AppVenue) => setSheet({ kind: 'venue', venue }), [])
  const openArtist = useCallback((artist: AppArtist) => setSheet({ kind: 'artist', artist }), [])
  const openBoat = useCallback((boat: AppBoat) => setSheet({ kind: 'boat', boat }), [])

  const closeSheet = useCallback(() => {
    setSheet(null)
    pickResolver.current?.(null)
    pickResolver.current = null
  }, [])

  /** Opens the shared date-picker sheet and resolves once a date is chosen (or the sheet is dismissed → null). */
  const pickDate = useCallback((opts: { selected?: string; min?: string; max?: string }) => {
    return new Promise<string | null>(resolve => {
      pickResolver.current = resolve
      setSheet({
        kind: 'datePicker',
        selected: opts.selected,
        min: opts.min,
        max: opts.max,
        onPick: iso => {
          pickResolver.current?.(iso)
          pickResolver.current = null
          setSheet(null)
        },
      })
    })
  }, [])

  // Lock body scroll while a sheet or the planner overlay is open (native-app behaviour).
  useEffect(() => {
    document.body.style.overflow = sheet || plannerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheet, plannerOpen])

  const screenProps: ScreenProps = {
    events, venues, artists, t, locale, openEvent, openVenue, openArtist, heroVideoSrc, heroVideoPoster,
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col">
      <AppHeader t={t} locale={locale} onOpenPlanner={() => setPlannerOpen(true)} />

      {/* Screens — pb clears the floating single-row nav capsule + its travelling
          label + iOS home indicator */}
      <main className="flex-1 pb-[calc(118px+env(safe-area-inset-bottom))]">
        {tab === 'agenda' && (
          <AgendaScreen {...screenProps} view={agendaView} setView={setAgendaView} onOpenPlanner={() => setPlannerOpen(true)} />
        )}
        {tab === 'events' && <EventsScreen {...screenProps} />}
        {tab === 'boats' && <BoatsScreen boats={boats} t={t} onOpen={openBoat} />}
        {tab === 'search' && <SearchScreen {...screenProps} />}
        {tab === 'map' && <MapScreen {...screenProps} />}
        {tab === 'guestlist' && <GuestlistScreen {...screenProps} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} t={t} />

      {plannerOpen && (
        <PlannerScreen
          events={events}
          t={t}
          locale={locale}
          onClose={() => setPlannerOpen(false)}
          onOpenEvent={openEvent}
          onPickDate={pickDate}
        />
      )}

      <BottomSheet open={sheet !== null} onClose={closeSheet} label={
        sheet?.kind === 'event' ? sheet.event.name
        : sheet?.kind === 'venue' ? sheet.venue.name
        : sheet?.kind === 'artist' ? sheet.artist.name
        : sheet?.kind === 'boat' ? sheet.boat.name
        : t.selectDate
      }>
        {sheet?.kind === 'event' && (
          <EventSheet
            event={sheet.event}
            venueLogo={venues.find(v => v.slug === sheet.event.venueSlug)?.whitelogo || ''}
            t={t}
            locale={locale}
          />
        )}
        {sheet?.kind === 'venue' && (
          <VenueSheet
            venue={sheet.venue}
            events={events.filter(e => e.venueSlug === sheet.venue.slug)}
            t={t}
            locale={locale}
            onPickEvent={openEvent}
          />
        )}
        {sheet?.kind === 'artist' && <ArtistSheet artist={sheet.artist} t={t} locale={locale} />}
        {sheet?.kind === 'boat' && <BoatSheet boat={sheet.boat} t={t} />}
        {sheet?.kind === 'datePicker' && (
          <DatePickerSheet t={t} locale={locale} selected={sheet.selected} min={sheet.min} max={sheet.max} onPick={sheet.onPick} />
        )}
      </BottomSheet>
    </div>
  )
}
