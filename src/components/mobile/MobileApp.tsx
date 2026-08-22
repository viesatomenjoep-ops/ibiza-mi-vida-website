'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AppEvent, AppVenue, SheetState, TabId, AgendaView } from './types'
import type { AppLabels } from './i18n'
import { BottomNav } from './BottomNav'
import { BottomSheet } from './BottomSheet'
import { EventSheet } from './EventSheet'
import { VenueSheet } from './VenueSheet'
import { AgendaScreen } from './screens/AgendaScreen'
import { EventsScreen } from './screens/EventsScreen'
import { SearchScreen } from './screens/SearchScreen'
import { MapScreen } from './screens/MapScreen'
import { GuestlistScreen } from './screens/GuestlistScreen'

export interface ScreenProps {
  events: AppEvent[]
  venues: AppVenue[]
  t: AppLabels
  locale: string
  openEvent: (e: AppEvent) => void
  openVenue: (v: AppVenue) => void
}

/**
 * App shell. One piece of state drives everything:
 *  - `tab`   → which bottom-nav screen is mounted
 *  - `sheet` → the half-screen drawer (event detail / venue detail / date picker).
 * The sheet is a discriminated union: whichever screen wants a drawer calls
 * openEvent/openVenue and the single BottomSheet host at the root renders it.
 * Screens stay mounted per tab switch is cheap (plain conditional render); the
 * sheet host lives OUTSIDE the scroll containers so backdrop + slide-up are
 * never clipped by an ancestor.
 */
export function MobileApp({
  events,
  venues,
  labels: t,
  locale,
}: {
  events: AppEvent[]
  venues: AppVenue[]
  labels: AppLabels
  locale: string
}) {
  const [tab, setTab] = useState<TabId>('agenda')
  const [agendaView, setAgendaView] = useState<AgendaView>('calendar')
  const [sheet, setSheet] = useState<SheetState>(null)

  const openEvent = useCallback((event: AppEvent) => setSheet({ kind: 'event', event }), [])
  const openVenue = useCallback((venue: AppVenue) => setSheet({ kind: 'venue', venue }), [])
  const closeSheet = useCallback(() => setSheet(null), [])

  // Lock body scroll while a sheet is open (native-app behaviour).
  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheet])

  const screenProps: ScreenProps = { events, venues, t, locale, openEvent, openVenue }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col">
      {/* Screens — pb clears the fixed bottom nav + iOS home indicator */}
      <main className="flex-1 pb-[calc(76px+env(safe-area-inset-bottom))]">
        {tab === 'agenda' && (
          <AgendaScreen {...screenProps} view={agendaView} setView={setAgendaView} />
        )}
        {tab === 'events' && <EventsScreen {...screenProps} />}
        {tab === 'search' && <SearchScreen {...screenProps} />}
        {tab === 'map' && <MapScreen {...screenProps} />}
        {tab === 'guestlist' && <GuestlistScreen {...screenProps} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} t={t} />

      <BottomSheet open={sheet !== null} onClose={closeSheet} label={
        sheet?.kind === 'event' ? sheet.event.name : sheet?.kind === 'venue' ? sheet.venue.name : t.selectDate
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
      </BottomSheet>
    </div>
  )
}
