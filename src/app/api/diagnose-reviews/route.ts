import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Waarom de Google-beoordeling niet verschijnt — in één oogopslag.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * `getGoogleReviews()` geeft bij elk probleem hetzelfde antwoord: null. Dat is
 * precies goed voor de site (nooit een verzonnen cijfer tonen) en precies
 * waardeloos als je wil weten wáárom er niets staat. Ontbreekt de sleutel? Is
 * het Place ID verkeerd? Weigert Google? Van buitenaf zie je in alle vier de
 * gevallen een lege plek.
 *
 * Deze route stelt dezelfde vraag als de site en vertelt wél wat er misging.
 *
 * ── Wat er NIET uit komt ──────────────────────────────────────────────────
 * Geen sleutel, geen deel van een sleutel, geen lengte waaruit je iets kunt
 * afleiden. Alleen: staat hij er, staat het ID er, wat antwoordde Google, en
 * hoeveel beoordelingen kwamen er terug. Het Place ID zelf is openbaar --
 * het staat in elke Google Maps-URL -- dus dat mag wel terug, en het is juist
 * het veld waar de fout meestal in zit.
 *
 * Verwijderbaar zodra de koppeling staat. Tot die tijd scheelt hij een avond
 * gokken.
 */
export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  const uit: Record<string, unknown> = {
    sleutelIngesteld: Boolean(key),
    placeIdIngesteld: Boolean(placeId),
    placeId: placeId || null,
    // Een geldig Place ID begint met ChIJ, GhIJ, EhIJ of Eh/Ei/Eg. Een CID
    // (het lange getal uit maps.google.com/?cid=...) is iets anders en werkt
    // hier niet -- dat is de meest gemaakte fout.
    lijktGeldig: placeId ? /^[A-Za-z0-9_-]{20,}$/.test(placeId) && !/^\d+$/.test(placeId) : false,
  }

  if (!key || !placeId) {
    uit.conclusie = !key && !placeId
      ? 'Beide omgevingsvariabelen ontbreken in deze omgeving.'
      : !key
        ? 'GOOGLE_PLACES_API_KEY ontbreekt in deze omgeving.'
        : 'GOOGLE_PLACE_ID ontbreekt in deze omgeving.'
    return NextResponse.json(uit)
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,googleMapsUri',
        },
        cache: 'no-store',
      },
    )
    uit.httpStatus = res.status
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      uit.googleFout = data?.error?.message || 'onbekend'
      uit.conclusie =
        res.status === 403
          ? 'Google weigert de sleutel. Meestal: de Places API (New) staat niet aan, of de sleutel is beperkt tot websites/apps in plaats van tot API\'s.'
          : res.status === 404
            ? 'Dit Place ID bestaat niet. Controleer of je een Place ID hebt gekopieerd en geen CID-getal.'
            : 'Google antwoordde met een fout, zie googleFout.'
      return NextResponse.json(uit)
    }

    uit.naam = data?.displayName?.text ?? null
    uit.cijfer = data?.rating ?? null
    uit.aantalBeoordelingen = data?.userRatingCount ?? null
    uit.mapsUrl = data?.googleMapsUri ?? null
    uit.conclusie =
      typeof data?.rating === 'number' && (data?.userRatingCount ?? 0) > 0
        ? 'Alles werkt. Verschijnt het op de site nog niet, dan staat er nog een pagina uit de cache; die is binnen zes uur ververst.'
        : 'De koppeling werkt, maar dit profiel heeft (nog) geen beoordelingen volgens Google.'
    return NextResponse.json(uit)
  } catch (e) {
    uit.conclusie = `Aanroep mislukt: ${e instanceof Error ? e.message : String(e)}`
    return NextResponse.json(uit)
  }
}
