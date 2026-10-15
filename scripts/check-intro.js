import assert from 'node:assert/strict'
import { withBrowser, waitForReady } from './helpers/browser.js'

await withBrowser(async ({ page, browser, url }) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[aria-label="Loading"]')
  assert.ok(await page.$eval('main', (main) => main.closest('[inert]') !== null))
  await page.click('[aria-label="Loading"] button')
  await waitForReady(page)
  assert.equal(await page.$('main[inert]'), null)
  assert.equal(await page.evaluate(() => sessionStorage.getItem('portfolio:intro-seen')), 'true')

  await page.evaluateOnNewDocument(() => {
    window.introAppeared = false
    new MutationObserver(() => {
      if (document.querySelector('[aria-label="Loading"]')) window.introAppeared = true
    }).observe(document, { childList: true, subtree: true })
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  assert.equal(await page.evaluate(() => window.introAppeared), false, 'Do not replay on reload')

  const fresh = await browser.newPage()
  try {
    await fresh.evaluateOnNewDocument(() => {
      Storage.prototype.getItem = () => { throw new Error('Storage blocked') }
      Storage.prototype.setItem = () => { throw new Error('Storage blocked') }
    })
    await fresh.goto(url, { waitUntil: 'domcontentloaded' })
    await fresh.waitForSelector('[aria-label="Loading"]')
    await fresh.click('[aria-label="Loading"] button')
    await waitForReady(fresh)
    assert.equal(await fresh.evaluate(() => document.querySelector('main').closest('[inert]')), null)
  } finally {
    await fresh.close()
  }
  console.log('Intro checks passed: skip, inert background, session persistence, and blocked-storage recovery.')
})
