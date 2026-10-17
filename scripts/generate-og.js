import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import puppeteer from 'puppeteer'
import { createServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/og.png')
let browser
let server

try {
  let targetURL = process.env.OG_URL
  if (!targetURL) {
    server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
    await server.listen()
    targetURL = server.resolvedUrls.local[0]
  }
  browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(15000)
  await page.setViewport({ width: 1600, height: 840, deviceScaleFactor: 0.75 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.evaluateOnNewDocument(() => {
    try { sessionStorage.setItem('portfolio:intro-seen', 'true') } catch {}
  })
  await page.goto(targetURL, { waitUntil: 'networkidle0' })

  await page.waitForFunction(() => !document.querySelector('[role="status"]'), {
    timeout: 15000,
  })
  await page.waitForFunction(() =>
    document.fonts.status === 'loaded' &&
    [...document.querySelectorAll('h1, header, .hero-rail')].every((element) => getComputedStyle(element).opacity === '1'),
  )
  await page.$eval('img', (image) => image.decode())

  await page.screenshot({ path: OUT })
  console.log(`og image written to ${OUT}`)
} finally {
  if (browser) await browser.close()
  if (server) await server.close()
}
