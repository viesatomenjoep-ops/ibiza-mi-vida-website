#!/usr/bin/env node
/**
 * Zoekt het Google Place ID (de ChIJ…-vorm) van een bedrijf op.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * GOOGLE_PLACE_ID is de variabele waar de reviewkoppeling het vaakst op
 * stukloopt, en de officiële route ernaartoe — de Place ID Finder van Google —
 * vindt een klein of service-area bedrijf regelmatig niet: die widget zoekt in
 * een andere index dan de Places API zelf, en zonder straatadres komt een
 * profiel er soms simpelweg niet in voor.
 *
 * De API die wij gebruiken kent het profiel wél. Dus vraag het die.
 *
 * Wat je NIET moet invullen, en wat iedereen probeert:
 *   • de CID uit een Maps-URL (maps.google.com/?cid=2584947247658109964)
 *   • het 0x…:0x…-nummer (de "feature id" uit een /maps/place/…-URL)
 * Allebei bestaan ze, allebei verwijzen ze naar hetzelfde bedrijf, en allebei
 * geeft de Places API (New) er een 404 op. Alleen de ChIJ-vorm werkt.
 *
 * ── Gebruik ───────────────────────────────────────────────────────────────
 *   GOOGLE_PLACES_API_KEY=AIza… node scripts/find-place-id.mjs "Ibiza Mi Vida"
 *
 * Zonder argument zoekt hij op de merknaam. Vindt hij meerdere kandidaten, dan
 * toont hij ze alle met adres en beoordeling erbij, zodat je zelf kiest — dit
 * script raadt niet welke van de twee jouw zaak is.
 */

const KEY = process.env.GOOGLE_PLACES_API_KEY
const QUERY = process.argv.slice(2).join(' ') || 'Ibiza Mi Vida'

if (!KEY) {
  console.error('GOOGLE_PLACES_API_KEY ontbreekt.\n')
  console.error('  GOOGLE_PLACES_API_KEY=AIza… node scripts/find-place-id.mjs "Ibiza Mi Vida"\n')
  console.error('De sleutel maak je in Google Cloud Console → APIs & Services → Credentials,')
  console.error('met "Places API (New)" ingeschakeld en billing aan op het project.')
  process.exit(1)
}

// Een Google-sleutel begint met AIza. Dit is geen validatie maar een
// vriendelijke waarschuwing: er is hier al eens een Stripe-sleutel (sk_live_…)
// in deze variabele beland, en dan krijg je een 403 die niets uitlegt.
if (!KEY.startsWith('AIza')) {
  console.warn('⚠  Deze sleutel begint niet met "AIza". Een Google API-sleutel doet dat wel —')
  console.warn('   controleer of je niet per ongeluk een sleutel van een andere dienst hebt geplakt.\n')
}

const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': KEY,
    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri',
  },
  body: JSON.stringify({ textQuery: QUERY, languageCode: 'en' }),
})

if (!res.ok) {
  const tekst = await res.text()
  console.error(`Google antwoordde HTTP ${res.status}.\n`)
  // De twee fouten die je hier in de praktijk krijgt, met hun oorzaak erbij.
  if (res.status === 403) {
    console.error('403 betekent bijna altijd één van deze drie:')
    console.error('  • "Places API (New)" staat niet aan op dit project')
    console.error('  • er staat geen billing op het project')
    console.error('  • de sleutel heeft een applicatiebeperking (HTTP-referrer) die een')
    console.error('    server-side aanroep blokkeert — zet die op None of gebruik een IP-beperking\n')
  }
  console.error(tekst.slice(0, 600))
  process.exit(1)
}

const { places = [] } = await res.json()

if (!places.length) {
  console.log(`Geen resultaat voor "${QUERY}".`)
  console.log('Probeer het met de plaatsnaam erbij, bijvoorbeeld: "Ibiza Mi Vida, Ibiza".')
  process.exit(0)
}

console.log(`${places.length} resultaat${places.length === 1 ? '' : 'en'} voor "${QUERY}":\n`)
for (const p of places) {
  const naam = p.displayName?.text || '(zonder naam)'
  const cijfer = p.rating ? `${p.rating} uit ${p.userRatingCount ?? 0} beoordelingen` : 'geen beoordelingen'
  console.log(`  ${naam}`)
  console.log(`  GOOGLE_PLACE_ID = ${p.id}`)
  console.log(`  ${p.formattedAddress || 'geen adres'} · ${cijfer}`)
  if (p.googleMapsUri) console.log(`  ${p.googleMapsUri}`)
  console.log()
}

if (places.length > 1) {
  console.log('Meerdere kandidaten. Kies zelf welke jouw profiel is — controleer het')
  console.log('adres en het aantal beoordelingen tegen wat je in Google Maps ziet.')
}
