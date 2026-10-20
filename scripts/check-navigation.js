import assert from 'node:assert/strict'
import { withBrowser, waitForReady } from './helpers/browser.js'

await withBrowser(async ({ page, url }) => {
  await page.setViewport({ width: 390, height: 844 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  const trigger = 'button[aria-controls="mobile-menu"]'
  const headingLeft = await page.$eval('h1', (heading) => heading.getBoundingClientRect().left)
  await page.click(trigger)
  await page.waitForSelector('#mobile-menu[open]')
  assert.equal(await page.$eval('h1', (heading) => heading.getBoundingClientRect().left), headingLeft, 'Opening navigation must not shift the page')
  assert.equal(await page.$eval('#mobile-menu', (menu) => getComputedStyle(menu).overscrollBehavior), 'contain')
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Close menu')
  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
  assert.ok(await page.evaluate(() => document.activeElement.matches('#mobile-menu a[href^="mailto:"]')))
  await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Close menu')
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.ok(await page.$eval(trigger, (button) => button === document.activeElement))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')

  await page.click(trigger)
  await page.click('#mobile-menu a[href="#home"]')
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')

  await page.click(trigger)
  await page.$eval('#mobile-menu a[href^="mailto:"]', (link) => {
    link.addEventListener('click', (event) => event.preventDefault(), { once: true })
    link.click()
  })
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '', 'Email contact must release the scroll lock')

  await page.click(trigger)
  await page.setViewport({ width: 1024, height: 768 })
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')
  console.log('Navigation checks passed: focus trap, Escape, focus restoration, link close, and resize cleanup.')
})
