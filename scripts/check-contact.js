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
  assert.ok(await page.$eval('.copy-email button', (button) => button === document.activeElement), 'A failed request must not steal focus')
  assert.equal(await page.$eval('.copy-email input', (input) => input.value), SITE.email)
  assert.ok(await page.$eval('.copy-email input', (input) => input.readOnly))
  await page.click('[data-select-email]')
  assert.equal(await page.$eval('.copy-email input', (input) => input.value.slice(input.selectionStart, input.selectionEnd)), SITE.email)
  assert.ok(await page.$eval('.copy-email input', (input) => input === document.activeElement))
  await page.evaluate(() => { navigator.clipboard.writeText = async () => {} })
  await page.click('.copy-email button')
  await page.waitForFunction(() => document.querySelector('[data-copy-feedback]').textContent === 'Email copied')
  assert.equal(await page.$('.copy-email input'), null, 'Successful retries should remove the manual fallback')
  const profiles = await page.$$eval('.hero-rail a[target="_blank"]', (links) => links.map((link) => ({ href: link.href, announced: link.textContent.includes('opens in a new tab') })))
  assert.deepEqual(profiles, [{ href: SITE.github, announced: true }, { href: SITE.linkedin, announced: true }])
  const savedContact = await page.$eval('.save-contact', (link) => ({ filename: link.download, content: decodeURIComponent(link.getAttribute('href').split(',').slice(1).join(',')) }))
  assert.equal(savedContact.filename, 'sunil-amarthya.vcf')
  assert.ok(savedContact.content.includes(`EMAIL;TYPE=INTERNET:${SITE.email}`))
  await page.evaluate(() => {
    window.connectionNotice = document.querySelector('.connection-notice')
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false })
    window.dispatchEvent(new Event('offline'))
  })
  await page.waitForFunction(() => document.querySelector('.connection-notice').textContent.includes('Your browser reports that you are offline.'))
  assert.equal(await page.$eval('.connection-notice', (notice) => notice.getAttribute('role')), 'status')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })
    window.dispatchEvent(new Event('online'))
  })
  await page.waitForFunction(() => document.querySelector('.connection-notice').textContent.trim() === '')
  assert.ok(await page.evaluate(() => window.connectionNotice === document.querySelector('.connection-notice')), 'Keep the live region mounted across connectivity changes')
  await page.evaluate(() => { delete navigator.onLine })
  await page.setRequestInterception(true)
  let failPortrait = true
  page.on('request', (request) => {
    if (failPortrait && request.resourceType() === 'image' && request.url().includes('profile-portrait')) request.abort()
    else request.continue()
  })
  await page.setCacheEnabled(false)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.portrait-fallback')
  assert.equal(await page.$eval('[data-portrait-initials]', (fallback) => fallback.textContent.trim()), 'SA')
  failPortrait = false
  await page.$eval('.portrait-fallback button', (button) => button.click())
  await page.waitForSelector('img')
  await page.$eval('img', (image) => image.decode())
  assert.equal(await page.$('.portrait-fallback'), null)
  assert.equal(await page.$('#contact a[href^="mailto:"]') !== null, true)
  console.log('Contact checks passed: clipboard success, permission denial, readable fallback, and retry.')
})
