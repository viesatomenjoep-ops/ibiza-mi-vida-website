'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { isFavourite, toggleFavourite, onFavouritesChange } from '@/lib/boat-favourites'

const LABEL_ADD: Record<string, string> = {
  nl: 'Bewaar als favoriet', en: 'Save as favourite', de: 'Als Favorit speichern',
  es: 'Guardar como favorito', fr: 'Enregistrer comme favori',
}
const LABEL_REMOVE: Record<string, string> = {
  nl: 'Verwijder uit favorieten', en: 'Remove from favourites', de: 'Aus Favoriten entfernen',
  es: 'Quitar de favoritos', fr: 'Retirer des favoris',
}

/**
 * Hartje om een boot te bewaren. Werkt op de vlootkaart én op de dossierpagina
 * en blijft via onFavouritesChange overal synchroon.
 *
 * De staat begint op false en wordt pas na mount uit localStorage gelezen:
 * de server weet niet wat de bezoeker bewaard heeft, dus direct lezen tijdens
 * de render zou een hydration-mismatch geven. Het hartje kleurt daardoor een
 * tel later in — dat is onzichtbaar snel en correct, in die volgorde.
 *
 * stopPropagation + preventDefault omdat het hartje bovenop klikbare vlakken
 * ligt (de fotoknop van de kaart opent de lightbox): een favoriet bewaren mag
 * nooit óók iets anders openen.
 */
export function FavouriteButton({ slug, locale, size = 18, className = '' }: {
  slug: string; locale: string; size?: number; className?: string
}) {
  const [fav, setFav] = useState(false)
  useEffect(() => {
    setFav(isFavourite(slug))
    return onFavouritesChange((favs) => setFav(favs.includes(slug)))
  }, [slug])

  const label = fav ? (LABEL_REMOVE[locale] || LABEL_REMOVE.en) : (LABEL_ADD[locale] || LABEL_ADD.en)

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavourite(slug) }}
      aria-label={label}
      aria-pressed={fav}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full bg-black/60 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:scale-110 active:scale-95 ${className}`}
    >
      <Heart
        size={size}
        className={fav ? 'fill-red-500 text-red-500' : 'text-white'}
      />
    </button>
  )
}
