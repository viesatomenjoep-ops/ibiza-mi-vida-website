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
 * afleiden. Alleen: staat hij er, staat het ID er, wat antwoordde Google,
 * hoeveel beoordelingen kwamen er terug en hoeveel daarvan zijn bruikbare
 * teksten. Geen reviewtekst zelf — die staan al openbaar op de site. Het Place ID zelf is openbaar --
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
          'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
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

    /**
     * Het aantal BRUIKBARE reviewteksten — en dat is iets anders dan
     * `aantalBeoordelingen` hierboven.
     *
     * Waarom dit erbij moest: deze route zei "alles werkt" zodra er een cijfer
     * was, terwijl `GoogleReviews` én `ReviewSchema` allebei pas renderen bij
     * `reviews.length > 0`. Een profiel met acht sterren maar zonder geschreven
     * reviews toont dus terecht wél een cijfer in de header en géén sectie en
     * géén Review-schema — en de diagnose kon dat verschil niet zien, want hij
     * vroeg de reviews niet eens op. Precies de situatie die je hier komt
     * uitzoeken.
     *
     * De telling past dezelfde volledigheidseis toe als google-reviews.ts:
     * zonder auteur, tekst, sterren én publicatietijd wordt een review daar
     * weggegooid in plaats van half getoond. Anders zou dit getal iets beloven
     * wat de site niet rendert.
     *
     * Places API (New) geeft maximaal vijf reviews per plaats terug. Staat hier
     * 5 terwijl het profiel er meer heeft, dan is dat die API-limiet en niet
     * een probleem met de koppeling.
     */
    const bruikbaar = (Array.isArray(data?.reviews) ? data.reviews : []).filter(
      (r: any) =>
        r?.authorAttribution?.displayName?.trim() &&
        (r?.text?.text ?? r?.originalText?.text ?? '').trim() &&
        typeof r?.rating === 'number' &&
        r?.publishTime,
    ).length
    uit.reviewteksten = bruikbaar
    uit.reviewsDoorGoogleGeleverd = Array.isArray(data?.reviews) ? data.reviews.length : 0

    const heeftCijfer = typeof data?.rating === 'number' && (data?.userRatingCount ?? 0) > 0
    uit.conclusie = !heeftCijfer
      ? 'De koppeling werkt, maar dit profiel heeft (nog) geen beoordelingen volgens Google.'
      : bruikbaar > 0
        ? `Alles werkt: cijfer én ${bruikbaar} reviewtekst${bruikbaar === 1 ? '' : 'en'}. Het cijfer staat in header, hero en footer, de teksten met Review-schema op de homepage en /about-us. Zie je het nog niet, dan staat er een pagina uit de cache; die is binnen zes uur ververst.`
        : 'Het cijfer werkt, maar Google levert geen bruikbare reviewTEKSTEN — beoordelingen zonder geschreven review, of te onvolledig om te tonen. Gevolg: het cijfer verschijnt wel in header, hero en footer, maar de reviewsectie en het Review-schema blijven leeg. Dat is correct gedrag, geen bug. Wil je ze wel: vraag klanten een review mét tekst te schrijven.'
    return NextResponse.json(uit)
  } catch (e) {
    uit.conclusie = `Aanroep mislukt: ${e instanceof Error ? e.message : String(e)}`
    return NextResponse.json(uit)
  }
}
