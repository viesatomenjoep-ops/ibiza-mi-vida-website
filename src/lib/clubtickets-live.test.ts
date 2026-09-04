import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLiveEvent } from '@/lib/clubtickets-live'
import normalFixture from '@/lib/__fixtures__/clubtickets-event-1901.json'
import soldOutFixture from '@/lib/__fixtures__/clubtickets-event-soldout.synthetic.json'

// warn() fires a fire-and-forget `import('@sentry/nextjs')`; stub it so the test
// never touches the real SDK.
vi.mock('@sentry/nextjs', () => ({ captureMessage: vi.fn() }))

const ok = (body: unknown): Partial<Response> => ({
  ok: true,
  status: 200,
  json: async () => body,
})

function stubFetch(impl: (url: string) => Partial<Response>) {
  const spy = vi.fn(async (url: string) => impl(url) as Response)
  vi.stubGlobal('fetch', spy)
  return spy
}

let warnSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
})
afterEach(() => {
  warnSpy.mockRestore()
  vi.unstubAllGlobals()
})

describe('getLiveEvent', () => {
  it('maps a normal response', async () => {
    const fetchSpy = stubFetch(() => ok(normalFixture))
    const live = await getLiveEvent(319, 1901, 'en')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy.mock.calls[0][0]).toContain('/venue/319/event/1901?locale=en')

    expect(live).not.toBeNull()
    expect(live!.id).toBe(1901)
    expect(live!.startAt).toBe('23:30')
    expect(live!.endAt).toBe('00:00')
    expect(live!.dates).toHaveLength(5)
    expect(live!.soldOut).toBe(false)

    const d0 = live!.dates[0]
    expect(d0.date).toBe('2026-09-05')
    expect(d0.lowestAvailablePrice).toBe(85)
    expect(d0.prices).toBe('85 € - 250 €')
    expect(d0.lineUp).not.toContain('<') // HTML stripped
    expect(d0.lineUp).toContain('Bastian Bux')
    expect(d0.affLink).toContain('?aff=CT219')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('handles a sold-out date (prices "" / lowestAvailablePrice null)', async () => {
    stubFetch(() => ok(soldOutFixture))
    const live = await getLiveEvent(319, 1975, 'en')

    expect(live).not.toBeNull()
    expect(live!.dates).toHaveLength(2)
    expect(live!.dates[0].prices).toBe('')
    expect(live!.dates[0].lowestAvailablePrice).toBeNull()
    expect(live!.dates[1].lowestAvailablePrice).toBe(85)
    expect(live!.soldOut).toBe(false) // not every date is sold out
  })

  it('marks soldOut when every date is sold out', async () => {
    stubFetch(() =>
      ok({
        data: {
          id: 42,
          dates: [
            { id: 1, date: '2026-09-05', prices: '', lowestAvailablePrice: null },
            { id: 2, date: '2026-09-12', prices: '', lowestAvailablePrice: null },
          ],
        },
      }),
    )
    const live = await getLiveEvent(1, 42, 'en')
    expect(live!.soldOut).toBe(true)
  })

  it('trims a datetime date to YYYY-MM-DD', async () => {
    stubFetch(() =>
      ok({
        data: {
          id: 7,
          dates: [{ id: 1, date: '2026-09-05T23:30:00', prices: '10 €', lowestAvailablePrice: 10 }],
        },
      }),
    )
    const live = await getLiveEvent(1, 7, 'en')
    expect(live!.dates[0].date).toBe('2026-09-05')
  })

  it('returns null + warns on a response without data', async () => {
    stubFetch(() => ok({ locale: 'en' }))
    expect(await getLiveEvent(319, 1901, 'en')).toBeNull()
    expect(warnSpy).toHaveBeenCalledOnce()
  })

  it('returns null on data without a dates array', async () => {
    stubFetch(() => ok({ data: { id: 1901 } }))
    expect(await getLiveEvent(319, 1901, 'en')).toBeNull()
  })

  it('returns null + warns on HTTP 500', async () => {
    stubFetch(() => ({ ok: false, status: 500, json: async () => ({}) }))
    expect(await getLiveEvent(319, 1901, 'en')).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('HTTP 500'))
  })

  it('returns null + warns when fetch rejects (timeout)', async () => {
    const err = Object.assign(new Error('The operation timed out'), { name: 'TimeoutError' })
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(err))
    expect(await getLiveEvent(319, 1901, 'en')).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('timed out'))
  })

  it('skips the call when ids are missing', async () => {
    const fetchSpy = stubFetch(() => ok(normalFixture))
    expect(await getLiveEvent(0, 1901, 'en')).toBeNull()
    expect(await getLiveEvent(319, 0, 'en')).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
