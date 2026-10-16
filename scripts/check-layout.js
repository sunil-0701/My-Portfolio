import assert from 'node:assert/strict'
import { withBrowser, waitForReady } from './helpers/browser.js'

await withBrowser(async ({ page, url }) => {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(url, { waitUntil: 'networkidle0' })
  await waitForReady(page)

  const viewports = [[320, 568], [360, 640], [390, 844], [640, 480], [768, 1024], [844, 390], [1024, 768], [1366, 768], [1920, 1080]]
  const checkLayout = async (label) => {
    for (const [width, height] of viewports) {
      await page.setViewport({ width, height })
      const result = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth
        const heading = document.querySelector('h1')
        const range = document.createRange()
        range.selectNodeContents(heading)
        const headingBounds = range.getBoundingClientRect()
        const actions = [...document.querySelectorAll('.hero-copy a')]
        const rail = document.querySelector('nav[aria-label="Primary"]')
        return {
          noOverflow: document.documentElement.scrollWidth <= viewport,
          nameFits: headingBounds.left >= 0 && headingBounds.right <= viewport,
          actionsFit: actions.every((action) => {
            const bounds = action.getBoundingClientRect()
            return bounds.left >= 0 && bounds.right <= viewport && bounds.height >= 44
          }),
          railClear: getComputedStyle(rail).display === 'none' || rail.getBoundingClientRect().right <= heading.getBoundingClientRect().left,
        }
      })
      for (const [name, passes] of Object.entries(result)) {
        assert.ok(passes, `${label}: ${name} at ${width} × ${height}`)
      }
    }
  }

  await checkLayout('Web fonts')
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) request.abort()
    else request.continue()
  })
  await page.setCacheEnabled(false)
  await page.reload({ waitUntil: 'networkidle0' })
  await waitForReady(page)
  await checkLayout('Fallback fonts')
  console.log('Layout checks passed: nine viewports, heading containment, action targets, navigation clearance, and fallback fonts.')
})
