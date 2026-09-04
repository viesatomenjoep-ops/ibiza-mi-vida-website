import { describe, expect, it } from 'vitest'
import { mergeEventDates } from '@/lib/merge-event-dates'
import type { CTEventDate } from '@/lib/clubtickets'
import type { LiveEvent } from '@/lib/clubtickets-live'

const TODAY = '2026-09-10'

const ctDate = (over: Partial<CTEventDate> & Pick<CTEventDate, 'id' | 'date'>): CTEventDate => ({
  name: '',
  lineUp: '',
  prices: '',
  affLink: '',
  ...over,
})

const liveEvent = (dates: LiveEvent['dates'], soldOut = false): LiveEvent => ({
  id: 1,
  dates,
  soldOut,
})

describe('mergeEventDates', () => {
  it('overlays live volatile fields onto a matching date, keeps JSON structure', () => {
    const stat = [ctDate({ id: 1, date: '2026-09-12', prices: 'OLD', lineUp: 'old', affLink: 'old' })]
    const live = liveEvent([
      { id: 999, date: '2026-09-12', lineUp: 'new', prices: '85 € - 250 €', lowestAvailablePrice: 85, affLink: 'new' },
    ])
    const [d] = mergeEventDates(stat, live, TODAY)
    expect(d.id).toBe(1) // structure from JSON
    expect(d.prices).toBe('85 € - 250 €') // volatile from live
    expect(d.lineUp).toBe('new')
    expect(d.affLink).toBe('new')
    expect(d.lowestAvailablePrice).toBe(85)
    expect(d.soldOut).toBe(false)
    expect(d.live).toBe(true)
  })

  it('passes through a date the live feed omitted', () => {
    const stat = [ctDate({ id: 1, date: '2026-09-12', prices: '20 €', lowestAvailablePrice: 20 })]
    const live = liveEvent([
      { id: 2, date: '2026-09-19', lineUp: '', prices: '30 €', lowestAvailablePrice: 30, affLink: '' },
    ])
    const d = mergeEventDates(stat, live, TODAY).find((x) => x.id === 1)!
    expect(d.live).toBe(false)
    expect(d.prices).toBe('20 €')
    expect(d.lowestAvailablePrice).toBe(20)
  })

  it('appends a live-only date that is today or later', () => {
    const live = liveEvent([
      { id: 5, date: '2026-09-20', lineUp: 'x', prices: '40 €', lowestAvailablePrice: 40, affLink: 'a' },
    ])
    const merged = mergeEventDates([], live, TODAY)
    expect(merged).toHaveLength(1)
    expect(merged[0]).toMatchObject({ id: 5, date: '2026-09-20', prices: '40 €', live: true, name: '' })
  })

  it('keeps a live-only date that is exactly today', () => {
    const live = liveEvent([
      { id: 5, date: TODAY, lineUp: '', prices: '40 €', lowestAvailablePrice: 40, affLink: '' },
    ])
    expect(mergeEventDates([], live, TODAY)).toHaveLength(1)
  })

  it('drops a live-only date before today', () => {
    const live = liveEvent([
      { id: 5, date: '2026-09-01', lineUp: '', prices: '40 €', lowestAvailablePrice: 40, affLink: '' },
    ])
    expect(mergeEventDates([], live, TODAY)).toHaveLength(0)
  })

  it('passes every date through and sorts when live is null', () => {
    const stat = [
      ctDate({ id: 1, date: '2026-09-20', prices: '10 €' }),
      ctDate({ id: 2, date: '2026-09-05', prices: '20 €' }),
    ]
    const merged = mergeEventDates(stat, null, TODAY)
    expect(merged.map((d) => d.date)).toEqual(['2026-09-05', '2026-09-20'])
    expect(merged.every((d) => d.live === false)).toBe(true)
    expect(merged.every((d) => d.soldOut === false)).toBe(true)
    expect(merged[0].lowestAvailablePrice).toBeNull()
  })

  it('derives soldOut from empty prices + null lowestAvailablePrice', () => {
    const stat = [ctDate({ id: 1, date: '2026-09-12' }), ctDate({ id: 2, date: '2026-09-13' })]
    const live = liveEvent([
      { id: 1, date: '2026-09-12', lineUp: '', prices: '', lowestAvailablePrice: null, affLink: '' },
      { id: 2, date: '2026-09-13', lineUp: '', prices: '85 €', lowestAvailablePrice: 85, affLink: '' },
    ])
    const merged = mergeEventDates(stat, live, TODAY)
    expect(merged.find((d) => d.date === '2026-09-12')!.soldOut).toBe(true)
    expect(merged.find((d) => d.date === '2026-09-13')!.soldOut).toBe(false)
  })

  it('returns dates sorted regardless of input order, static + appended interleaved', () => {
    const stat = [ctDate({ id: 1, date: '2026-09-26' }), ctDate({ id: 2, date: '2026-09-12' })]
    const live = liveEvent([
      { id: 9, date: '2026-09-19', lineUp: '', prices: '1 €', lowestAvailablePrice: 1, affLink: '' },
    ])
    expect(mergeEventDates(stat, live, TODAY).map((d) => d.date)).toEqual([
      '2026-09-12',
      '2026-09-19',
      '2026-09-26',
    ])
  })

  it('preserves ClubTickets fields the live feed does not carry', () => {
    const stat = [
      ctDate({ id: 1, date: '2026-09-12', eventCover: 'cover.jpg', venueSlug: 'unvrs-ibiza', eventId: 1901 }),
    ]
    const live = liveEvent([
      { id: 1, date: '2026-09-12', lineUp: 'x', prices: '85 €', lowestAvailablePrice: 85, affLink: 'a' },
    ])
    const [d] = mergeEventDates(stat, live, TODAY)
    expect(d.eventCover).toBe('cover.jpg')
    expect(d.venueSlug).toBe('unvrs-ibiza')
    expect(d.eventId).toBe(1901)
  })

  it('keeps the static line-up when the live one is empty', () => {
    const stat = [ctDate({ id: 1, date: '2026-09-12', lineUp: 'static lineup' })]
    const live = liveEvent([
      { id: 1, date: '2026-09-12', lineUp: '', prices: '85 €', lowestAvailablePrice: 85, affLink: 'a' },
    ])
    expect(mergeEventDates(stat, live, TODAY)[0].lineUp).toBe('static lineup')
  })

  it('does not mutate the input array', () => {
    const stat = [ctDate({ id: 1, date: '2026-09-20' }), ctDate({ id: 2, date: '2026-09-05' })]
    const snapshot = JSON.stringify(stat)
    mergeEventDates(stat, null, TODAY)
    expect(JSON.stringify(stat)).toBe(snapshot)
  })
})
