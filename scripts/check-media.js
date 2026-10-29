import assert from 'node:assert/strict'
import { withBrowser, waitForReady } from './helpers/browser.js'

await withBrowser(async ({ page, url }) => {
  await page.setViewport({ width: 794, height: 1123 })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  await page.emulateMediaType('print')
  const printed = await page.evaluate(() => ({
    ink: getComputedStyle(document.querySelector('h1')).color,
    paper: getComputedStyle(document.body).backgroundColor,
    hiddenControls: ['header', '.copy-email', '.save-contact', 'nav'].every((selector) => getComputedStyle(document.querySelector(selector)).display === 'none'),
    destinations: [...document.querySelectorAll('.hero-copy a')].filter((link) => link.getClientRects().length > 0).every((link) => getComputedStyle(link, '::after').content.includes(link.getAttribute('href'))),
    noOverflow: document.documentElement.scrollWidth <= innerWidth,
    headingVisible: getComputedStyle(document.querySelector('h1')).opacity === '1',
  }))
  assert.deepEqual(printed, { ink: 'rgb(0, 0, 0)', paper: 'rgb(255, 255, 255)', hiddenControls: true, destinations: true, noOverflow: true, headingVisible: true })
  assert.ok(await page.$$eval('.content-section h2', (headings) => headings.length === 3 && headings.every((heading) => getComputedStyle(heading).color === 'rgb(0, 0, 0)')))
  const pdf = await page.pdf({ format: 'A4', printBackground: false })
  assert.equal(Buffer.from(pdf).subarray(0, 4).toString(), '%PDF')

  await page.emulateMediaType('screen')
  const client = await page.createCDPSession()
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] })
  assert.ok(await page.evaluate(() => matchMedia('(forced-colors: active)').matches))
  assert.equal(await page.$eval('h1', (heading) => getComputedStyle(heading).textShadow), 'none')
  assert.equal(await page.$eval('.name-period', (period) => period.getAnimations().length), 0)
  await page.setViewport({ width: 1366, height: 768 })
  assert.equal(await page.$eval('.hero-linework', (linework) => linework.getAnimations({ subtree: true }).length), 0, 'High-contrast linework must stay static')
  console.log('Media checks passed: printable links, ink-friendly A4 PDF, hidden controls, and static high-contrast presentation.')
})
