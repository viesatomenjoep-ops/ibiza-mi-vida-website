'use client'

/**
 * Favoriete boten, bewaard in localStorage.
 *
 * localStorage en niet een account of de server: er is geen inlogsysteem en
 * een favorietenlijst is precies het soort laagdrempelige staat die je niet
 * achter een drempel wilt zetten. De lijst overleeft de sessie, maar blijft
 * per apparaat — dat is voor "welke boten vond ik mooi" de juiste afweging.
 *
 * Een eigen event ('imv:favs') naast het storage-event: storage vuurt alleen
 * in ándere tabbladen, terwijl de vlootpagina en de dossierpagina in hetzelfde
 * tabblad allebei live moeten bijwerken wanneer er een hartje bij komt.
 *
 * Alles is defensief: privémodus zonder localStorage of een corrupt JSON mag
 * nooit een pagina breken — dan doet de favorietenknop gewoon even niets.
 */

const KEY = 'imv_boat_favs'
export const FAVS_EVENT = 'imv:favs'

export function getFavourites(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}

export function isFavourite(slug: string): boolean {
  return getFavourites().includes(slug)
}

export function toggleFavourite(slug: string): string[] {
  const huidige = getFavourites()
  const volgende = huidige.includes(slug) ? huidige.filter((s) => s !== slug) : [...huidige, slug]
  try {
    localStorage.setItem(KEY, JSON.stringify(volgende))
    window.dispatchEvent(new CustomEvent(FAVS_EVENT))
  } catch {
    /* privémodus — de knop doet dan niets, de pagina blijft heel */
  }
  return volgende
}

/** Abonneer op wijzigingen (dit tabblad én andere). Geeft een opruimfunctie terug. */
export function onFavouritesChange(cb: (favs: string[]) => void): () => void {
  const handler = () => cb(getFavourites())
  window.addEventListener(FAVS_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(FAVS_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}
