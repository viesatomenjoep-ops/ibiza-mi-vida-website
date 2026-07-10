/**
 * Pick the top N clubbing events for a given day.
 * Uses a date-seeded shuffle so the selection rotates daily but stays stable
 * within the same day. Big venues (UNVRS, Hï, Ushuaïa, Pacha, Lío…) are favoured.
 */
export function pickTopDayEvents<
  T extends { date?: string; ct_venues?: { slug?: string } },
>(events: T[], date: string, limit = 3): T[] {
  const TOP = ['unvrs-ibiza', 'hi-ibiza', 'ushuaia-ibiza', 'pacha-ibiza', 'lio-ibiza', 'privilege-ibiza', 'eden-ibiza']
  const day = events.filter((e) => (e.date || '').slice(0, 10) === date.slice(0, 10))
  if (day.length === 0) return []

  const shuffled = seededShuffle(day, date)
  shuffled.sort((a, b) => {
    const ap = TOP.includes(a.ct_venues?.slug || '') ? 0 : 1
    const bp = TOP.includes(b.ct_venues?.slug || '') ? 0 : 1
    return ap - bp
  })
  return shuffled.slice(0, limit)
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr]
  let h = seed.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0)
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0
    const j = h % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function priceFrom(prices?: string): string | null {
  if (!prices) return null
  const m = prices.match(/\d+([.,]\d+)?/)
  return m ? `€${m[0].replace(',', '.').replace(/\.00$/, '')}` : null
}

export function lineupArtists(lineUp?: string): string[] {
  if (!lineUp) return []
  const txt = lineUp
    .replace(/<[^>]+>/g, ' ')
    .replace(/\b(MAIN ROOM|THE BUNKER|CLUB ROOM|TERRACE|ROOM \d)\b/gi, ' ')
  return txt
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[,\-–|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
}
