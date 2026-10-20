import assert from 'node:assert/strict'
import { SITE } from '../src/config/site.js'
import { withBrowser, waitForReady } from './helpers/browser.js'

await withBrowser(async ({ page, url }) => {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (text) => { window.copiedEmail = text },
    } })
  })
  await page.click('.copy-email button')
  await page.waitForFunction(() => document.querySelector('[data-copy-feedback]').textContent === 'Email copied')
  assert.equal(await page.evaluate(() => window.copiedEmail), SITE.email)
  await page.evaluate(() => {
    window.copyCalls = 0
    navigator.clipboard.writeText = () => {
      window.copyCalls += 1
      return new Promise((resolve) => { window.finishCopy = resolve })
    }
  })
  await page.click('.copy-email button')
  assert.equal(await page.$eval('.copy-email button', (button) => button.getAttribute('aria-busy')), 'true')
  assert.ok(await page.$eval('.copy-email button', (button) => button === document.activeElement), 'Keep keyboard focus during the clipboard prompt')
  await page.click('.copy-email button')
  assert.equal(await page.evaluate(() => window.copyCalls), 1, 'Do not start duplicate clipboard requests')
  await page.evaluate(() => window.finishCopy())
  await page.waitForFunction(() => document.querySelector('.copy-email button').getAttribute('aria-busy') === 'false')
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => { throw new Error('Permission denied') }
  })
  await page.click('.copy-email button')
  await page.waitForFunction(() => document.querySelector('[data-copy-feedback]').textContent.startsWith('Copy unavailable.'))
  assert.ok((await page.$eval('[data-copy-feedback]', (element) => element.textContent)).includes(SITE.email))
  assert.equal(await page.$eval('.copy-email button', (button) => button.disabled), false)
  const profiles = await page.$$eval('.hero-rail a', (links) => links.map((link) => ({ href: link.href, announced: link.textContent.includes('opens in a new tab') })))
  assert.deepEqual(profiles, [{ href: SITE.github, announced: true }, { href: SITE.linkedin, announced: true }])
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (request.url().includes('profile-portrait')) request.abort()
    else request.continue()
  })
  await page.setCacheEnabled(false)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.portrait-fallback')
  assert.equal(await page.$eval('.portrait-fallback', (fallback) => fallback.textContent.trim()), 'SA')
  assert.equal(await page.$('.hero-copy a[href^="mailto:"]') !== null, true)
  console.log('Contact checks passed: clipboard success, permission denial, readable fallback, and retry.')
})
