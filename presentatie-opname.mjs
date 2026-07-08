/**
 * Presentatie-opname van de Ibiza Mi Vida website.
 *
 * Neemt automatisch een walkthrough op als .webm (om te zetten naar .mp4).
 *
 * ── Zo draai je het (op je eigen Mac, niet in de sandbox) ──
 *   1) In de projectmap:  npm i -D playwright
 *   2) Browser ophalen:   npx playwright install chromium
 *   3) Opnemen:           node presentatie-opname.mjs
 *   4) De video staat in:  ./opname/  (een .webm-bestand)
 *   5) Naar mp4 (optioneel, met ffmpeg):
 *        ffmpeg -i opname/*.webm -c:v libx264 -pix_fmt yuv420p presentatie.mp4
 *
 * Tip: selectors kunnen iets afwijken; pas ze gerust aan als een stap niet klikt.
 */
import { chromium } from 'playwright'
import { execSync } from 'node:child_process'
import { readdirSync, existsSync } from 'node:fs'

const URL = 'https://ibiza-mi-vida-website-two.vercel.app/nl'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Zachte, filmische scroll naar een absolute Y-positie.
async function smoothScrollTo(page, targetY, ms = 1600) {
  await page.evaluate(async ({ targetY, ms }) => {
    const startY = window.scrollY
    const dist = targetY - startY
    const start = performance.now()
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    await new Promise((res) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / ms)
        window.scrollTo(0, startY + dist * ease(t))
        t < 1 ? requestAnimationFrame(step) : res()
      }
      requestAnimationFrame(step)
    })
  }, { targetY, ms })
}

// Sleep-beweging (voor cover-flow carrousels): van rechts naar links vegen.
async function swipe(page, box, dir = -1) {
  const y = box.y + box.height / 2
  const x1 = box.x + box.width * (dir < 0 ? 0.8 : 0.2)
  const x2 = box.x + box.width * (dir < 0 ? 0.2 : 0.8)
  await page.mouse.move(x1, y)
  await page.mouse.down()
  for (let i = 1; i <= 20; i++) await page.mouse.move(x1 + ((x2 - x1) * i) / 20, y)
  await page.mouse.up()
}

const run = async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 412, height: 900 },       // telefoon-formaat
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: 'opname', size: { width: 412, height: 900 } },
  })
  const page = await context.newPage()

  // 1) Homepage — laat de intro (typende tekst) even lopen.
  await page.goto(URL, { waitUntil: 'networkidle' })
  await wait(4500)

  // 2) Open een van de vijf tabs (bv. de middelste) → half-page preview.
  const tabs = page.locator('.hdock-tile')
  if (await tabs.count()) {
    await tabs.nth(2).click().catch(() => {})
    await wait(2200)
    await tabs.nth(0).click().catch(() => {}) // volgende advertentie
    await wait(2000)
    await page.locator('button[aria-label="Close"]').first().click().catch(() => {})
    await wait(800)
  }

  // 3) Rustig naar beneden scrollen tot Deals of the Day en even stilstaan.
  await smoothScrollTo(page, 900, 1800); await wait(1200)
  const deals = page.locator('#deals')
  const dy = await deals.evaluate((el) => el.getBoundingClientRect().top + window.scrollY).catch(() => 1400)
  await smoothScrollTo(page, dy - 40, 1800); await wait(1800)

  // 4) Van links naar rechts door de carrousels (Club Tickets, Private Boats).
  const rows = page.locator('#deals .hide-scrollbar')
  const n = await rows.count()
  for (let i = 0; i < Math.min(n, 2); i++) {
    const box = await rows.nth(i).boundingBox()
    if (box) { await swipe(page, box, -1); await wait(1100); await swipe(page, box, -1); await wait(1400) }
  }

  // 5) Nog wat verder naar onder.
  await smoothScrollTo(page, dy + 900, 2000); await wait(1400)

  // 6) Hamburgermenu openen.
  await smoothScrollTo(page, 0, 1400); await wait(600)
  await page.locator('.burger').click().catch(() => {})
  await wait(2600)

  // 7) Naar Private Boat Charters via het menu.
  await page.getByRole('link', { name: /Private Boat/i }).first().click().catch(async () => {
    await page.goto(URL.replace('/nl', '/nl/private-boat-charters'), { waitUntil: 'networkidle' })
  })
  await page.waitForLoadState('networkidle').catch(() => {})
  await wait(2500)

  // 8) Budget-filter: klik een preset (≤ €5.000) en scroll naar de vloot.
  await page.getByRole('button', { name: /5[.,]?000/ }).first().click().catch(() => {})
  await wait(1500)
  await smoothScrollTo(page, 1200, 2000); await wait(1200)

  // 9) Open een bootfoto (lightbox), even bekijken, dan sluiten.
  await page.locator('article button[aria-label], article button').first().click().catch(() => {})
  await wait(2400)
  await page.locator('button[aria-label="Close"]').first().click().catch(() => page.keyboard.press('Escape'))
  await wait(1000)

  // 10) Terug naar de homepage.
  await page.goto(URL, { waitUntil: 'networkidle' })
  await wait(3500)

  await context.close()   // schrijft de video (.webm) weg
  await browser.close()

  // ── Automatisch omzetten naar MP4 (vereist ffmpeg: `brew install ffmpeg`) ──
  const webm = existsSync('opname') ? readdirSync('opname').find((f) => f.endsWith('.webm')) : null
  if (!webm) { console.log('Geen opname gevonden.'); return }
  try {
    execSync(`ffmpeg -y -i "opname/${webm}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart presentatie.mp4`, { stdio: 'inherit' })
    console.log('Klaar! → presentatie.mp4')
  } catch {
    console.log(`Video opgenomen: opname/${webm}\nffmpeg niet gevonden — installeer het (brew install ffmpeg) en draai:\n  ffmpeg -i "opname/${webm}" -c:v libx264 -pix_fmt yuv420p presentatie.mp4`)
  }
}

run().catch((e) => { console.error(e); process.exit(1) })
