/**
 * Prijzen uit de ClubTickets-feed lezen, en er een middenwaarde uit halen.
 *
 * Deze drie functies stonden als private helpers in `price-stats.ts`. Ze staan
 * hier los omdat `season-stats.ts` er nu ook uit rekent (de prijs per maand op
 * /ibiza-season), en twee keer dezelfde parser schrijven is precies hoe twee
 * pagina's uit dezelfde feed op verschillende bedragen uitkomen.
 *
 * De feed levert een prijs als tekstbereik ("40 € - 50 €"). `priceNumbers`
 * geeft alle getallen terug in de volgorde waarin ze staan; wie de entreeprijs
 * wil, neemt daarvan het eerste. De bovenkant is meestal een VIP- of
 * tafelproduct en is dus geen antwoord op "wat kost het om binnen te komen".
 *
 * Overal de mediaan en nergens het gemiddelde: een handvol tafels van duizend
 * euro trekt een gemiddelde naar een bedrag waar geen bezoeker zich in
 * herkent.
 */

/** Alle bedragen in een prijsveld, in de volgorde waarin de feed ze zet. */
export function priceNumbers(raw: unknown): number[] {
  const m = String(raw ?? '').match(/\d+(?:[.,]\d+)?/g)
  if (!m) return []
  return m.map(s => parseFloat(s.replace(',', '.'))).filter(n => n > 0)
}

export function median(xs: number[]): number {
  if (xs.length === 0) return 0
  const s = [...xs].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/** Nearest-rank quantile. Fine at these sample sizes and easy to explain. */
export function quantile(xs: number[], q: number): number {
  if (xs.length === 0) return 0
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil(q * s.length) - 1))]
}
