import assert from 'node:assert/strict'
import { withBrowser, waitForReady } from './helpers/browser.js'
import { SECTIONS } from '../src/config/site.js'

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
  await page.$eval('#mobile-menu a[href="#work"]', (link) => {
    // Stop the default browser action after React handles the modified click.
    document.addEventListener('click', (event) => event.preventDefault(), { once: true })
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true, button: 0 }))
  })
  assert.ok(await page.$('#mobile-menu[open]'), 'Modified link clicks must not close the menu')
  await page.click('#mobile-menu a[href="#home"]')
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')

  await page.click(trigger)
  await page.$eval('#mobile-menu a[href^="mailto:"]', (link) => {
    document.addEventListener('click', (event) => event.preventDefault(), { once: true })
    link.click()
  })
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '', 'Email contact must release the scroll lock')

  await page.click(trigger)
  await page.setViewport({ width: 1024, height: 768 })
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')
  const desktopHome = 'nav[aria-label="Primary"] a[href="#home"]'
  assert.ok(await page.$eval(desktopHome, (link) => link === document.activeElement), 'Resize should focus the visible active desktop link, not the hidden mobile trigger')
  await page.focus(desktopHome)
  await page.keyboard.press('Tab')
  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
  assert.equal(await page.$eval(desktopHome, (link) => link.getAttribute('aria-current')), 'location')
  const desktopLinks = await page.$$eval('nav[aria-label="Primary"] a', (links) => links.map((link) => ({
    href: link.getAttribute('href'),
    label: link.querySelector('.sr-only')?.textContent,
  })))
  assert.deepEqual(desktopLinks, SECTIONS.filter((section) => section.ready).map((section) => ({ href: `#${section.id}`, label: section.label })))
  console.log('Navigation checks passed: focus trap, Escape, native modified clicks, focus restoration, accessible section labels, and resize cleanup.')
})
