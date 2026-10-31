import assert from 'node:assert/strict'
import { PROJECTS, SECTIONS, SITE } from '../src/config/site.js'
import { withBrowser, waitForReady } from './helpers/browser.js'

assert.equal(new Set(SECTIONS.map((section) => section.id)).size, SECTIONS.length)
assert.ok(SECTIONS.every((section) => section.ready && /^[a-z][a-z0-9-]*$/.test(section.id)))
assert.equal(new Set(PROJECTS.map((project) => project.id)).size, PROJECTS.length)
for (const project of PROJECTS) {
  assert.ok(project.title && project.description && project.technologies.length > 0)
  assert.equal(new URL(project.source).protocol, 'https:')
}

await withBrowser(async ({ page, url }) => {
  await page.setViewport({ width: 1366, height: 768 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  for (const id of ['work', 'about', 'contact']) {
    await page.click(`nav[aria-label="Primary"] a[href="#${id}"]`)
    await page.waitForFunction((sectionId) =>
      document.activeElement.id === `${sectionId}-heading` &&
      document.querySelector('nav[aria-label="Primary"] a[aria-current="location"]')?.getAttribute('href') === `#${sectionId}`,
    {}, id)
    assert.equal(await page.$eval(`#${id} .section-permalink`, (link) => link.getAttribute('href')), `#${id}`)
    await page.click(`#${id} .section-permalink`)
    await page.waitForFunction((sectionId) => document.activeElement.id === `${sectionId}-heading`, {}, id)
  }
  assert.equal(await page.$eval('#contact .contact-email', (link) => link.getAttribute('href')), `mailto:${SITE.email}`)
  assert.equal(await page.$$eval('#work article', (cards) => cards.length), PROJECTS.length)
  await page.goto(`${url}#about`, { waitUntil: 'domcontentloaded' })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  await page.waitForFunction(() => document.activeElement.id === 'about-heading')
  await page.setViewport({ width: 390, height: 844 })
  await page.click('button[aria-controls="mobile-menu"]')
  await page.waitForSelector('#mobile-menu[open]')
  await page.click('#mobile-menu a[href="#contact"]')
  await page.waitForFunction(() => !document.querySelector('#mobile-menu') && document.activeElement.id === 'contact-heading')
  console.log('Section checks passed: content contracts, real project links, scroll tracking, direct links, and mobile heading focus.')
})
