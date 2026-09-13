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
const CHUNK_GROOTTE = 50

const xml = await (await fetch(SITEMAP)).text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
if (!urls.length) { console.error('Geen URL\'s in de sitemap gevonden.'); process.exit(1) }

console.log(`${urls.length} URL's individueel streamen naar Bing IndexNow...`)

const CONCURRENCY = 5
let success = 0
let failed = 0

for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const slice = urls.slice(i, i + CONCURRENCY)
  await Promise.all(
    slice.map(async (u) => {
      const endpoint = `https://www.bing.com/indexnow?url=${encodeURIComponent(u)}&key=${SLEUTEL}&keyLocation=${encodeURIComponent(`https://${HOST}/${SLEUTEL}.txt`)}`
      try {
        const res = await fetch(endpoint)
        if (res.status === 200 || res.status === 202) {
          success++
        } else {
          failed++
        }
      } catch {
        failed++
      }
    })
  )
  if (i + CONCURRENCY < urls.length) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

console.log(`Klaar: ${success}/${urls.length} URL's succesvol individueel gestreamd naar Bing IndexNow (0 batches).`)
