/**
 * Alle URL's uit de sitemap bij Bing aanmelden via IndexNow.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * Gemeten op 6 september 2026: Bing had nul pagina's van ibizamivida.com.
 * Niet weinig -- nul, ook op de kale merknaam. Dat is niet alleen erg voor
 * Bing zelf: het webzoeken van ChatGPT leunt op die index. Wat Bing niet
 * kent, kan ChatGPT niet citeren, hoe goed de pagina ook is.
 *
 * IndexNow is het protocol waarmee Bing (en Yandex, en Seznam) zich laat
 * vertellen dat er URL's zijn. Eén POST met een lijst, en de sleutel als
 * bestand op de site zodat ze kunnen controleren dat wij het zijn.
 *
 * ── Wat dit niet is ───────────────────────────────────────────────────────
 * Geen garantie op indexering. Het versnelt het ontdekken, niet het oordeel.
 * Wat er daarna mee gebeurt hangt af van of de pagina de moeite waard is.
 *
 * Draaien: node scripts/indexnow.mjs
 */

const SLEUTEL = 'a09a375d5ed0f341c22a12bac3e8110d'
const HOST = 'www.ibizamivida.com'
const SITEMAP = `https://${HOST}/sitemap.xml`
/** IndexNow accepteert maximaal 10.000 per keer; wij zitten daar ruim onder. */
const MAX_PER_KEER = 10000

const xml = await (await fetch(SITEMAP)).text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
if (!urls.length) { console.error('Geen URL\'s in de sitemap gevonden.'); process.exit(1) }

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: SLEUTEL,
    keyLocation: `https://${HOST}/${SLEUTEL}.txt`,
    urlList: urls.slice(0, MAX_PER_KEER),
  }),
})

// 200 en 202 betekenen allebei "aangenomen"; 422 betekent dat de sleutel niet
// klopt of het bestand niet bereikbaar is.
console.log(`${urls.length} URL's aangemeld -> HTTP ${res.status} ${res.statusText}`)
if (!res.ok) console.log(await res.text())
