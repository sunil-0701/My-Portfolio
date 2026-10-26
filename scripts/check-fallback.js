import assert from 'node:assert/strict'
import { SITE } from '../src/config/site.js'
import { withBrowser, waitForReady } from './helpers/browser.js'

await withBrowser(async ({ page, url }) => {
  await page.setJavaScriptEnabled(false)
  await page.setViewport({ width: 320, height: 568 })
  await page.goto(url, { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('.no-script h1', (heading) => heading.textContent), `${SITE.name}.`)
  assert.ok((await page.$eval('.no-script', (main) => main.textContent)).includes(SITE.summary))
  assert.equal(await page.$eval('.no-script a[href^="mailto:"]', (link) => link.getAttribute('href')), `mailto:${SITE.email}`)
  assert.equal(await page.$eval(`.no-script a[href="${SITE.github}"]`, (link) => link.href), SITE.github)
  for (const id of ['work', 'about', 'contact']) assert.ok(await page.$(`.no-script #${id}`), `Fallback must include ${id}`)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Fallback must fit a narrow screen')

  await page.setJavaScriptEnabled(true)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.reload({ waitUntil: 'domcontentloaded' })
  await waitForReady(page)
  assert.equal(await page.$('.no-script'), null, 'Do not duplicate content when JavaScript runs')
  assert.equal(await page.$$eval('main', (elements) => elements.length), 1)
  console.log('Fallback checks passed: no-JavaScript identity, contact links, narrow layout, and normal-page isolation.')
})
