/**
 * Renders public/og.png (1200x630) from the live dev server.
 * Run the dev server first, then:  node scripts/generate-og.js
 */
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const URL = process.env.OG_URL ?? 'http://localhost:5173/'
const OUT = resolve(__dirname, '../public/og.png')

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

try {
  const page = await browser.newPage()
  // Render at a roomier CSS viewport of the same 1.905 ratio and scale down,
  // so the hero has vertical room and the CTA is not clipped at the fold.
  await page.setViewport({ width: 1600, height: 840, deviceScaleFactor: 0.75 })
  await page.goto(URL, { waitUntil: 'networkidle0' })

  // Wait for the intro loader to hand over before capturing.
  await page.waitForFunction(() => !document.querySelector('[role="status"]'), {
    timeout: 15000,
  })
  await new Promise((r) => setTimeout(r, 1800))

  await page.screenshot({ path: OUT })
  console.log(`og image written to ${OUT}`)
} finally {
  await browser.close()
}
