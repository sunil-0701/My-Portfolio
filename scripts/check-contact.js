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
    navigator.clipboard.writeText = async () => { throw new Error('Permission denied') }
  })
  await page.click('.copy-email button')
  await page.waitForFunction(() => document.querySelector('[data-copy-feedback]').textContent.startsWith('Copy unavailable.'))
  assert.ok((await page.$eval('[data-copy-feedback]', (element) => element.textContent)).includes(SITE.email))
  assert.equal(await page.$eval('.copy-email button', (button) => button.disabled), false)
  const profiles = await page.$$eval('.hero-rail a', (links) => links.map((link) => ({ href: link.href, announced: link.textContent.includes('opens in a new tab') })))
  assert.deepEqual(profiles, [{ href: SITE.github, announced: true }, { href: SITE.linkedin, announced: true }])
  console.log('Contact checks passed: clipboard success, permission denial, readable fallback, and retry.')
})
