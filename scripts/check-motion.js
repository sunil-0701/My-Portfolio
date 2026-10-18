import assert from 'node:assert/strict'
import puppeteer from 'puppeteer'
import { createServer } from 'vite'

const server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
let browser

try {
  await server.listen()
  const url = server.resolvedUrls.local[0]
  browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.evaluateOnNewDocument(() => {
    window.loaderCounts = []
    const observer = new MutationObserver(() => {
      const count = document.querySelector('[role="status"] .tabular.font-display')
      if (!count) return
      const value = Number(count.textContent)
      if (window.loaderCounts.at(-1) !== value) window.loaderCounts.push(value)
    })
    observer.observe(document, { subtree: true, childList: true, characterData: true })
  })

  await page.setViewport({ width: 1366, height: 768 })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[role="status"]')
  await page.waitForFunction(() => !document.querySelector('[role="status"]'))
  await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1')

  const counts = await page.evaluate(() => window.loaderCounts)
  assert.ok(counts.length > 2, 'The loading counter must still animate')
  assert.equal(counts.at(-1), 100, 'The loading counter must finish at 100')
  assert.ok(counts.every((count, index) => index === 0 || count >= counts[index - 1]))
  assert.ok(counts.length <= 101, 'Only update the count when its integer changes')

  const effects = await page.evaluate(() => ({
    expensiveSurfaces: [...document.querySelectorAll('*')].filter((element) => {
      const style = getComputedStyle(element)
      return style.filter !== 'none' || style.backdropFilter !== 'none'
    }).length,
    unexpectedLoops: document.getAnimations().filter((animation) =>
      animation.effect.getTiming().iterations === Infinity &&
      !animation.effect.target.matches('.name-period'),
    ).length,
    nativeScroll: getComputedStyle(document.documentElement).scrollBehavior === 'auto',
  }))
  assert.equal(effects.expensiveSurfaces, 0, 'Do not reintroduce filter/backdrop surfaces')
  assert.equal(effects.unexpectedLoops, 0, 'Only the requested name punctuation may loop')
  assert.ok(effects.nativeScroll, 'Keep native scrolling')

  const period = await page.$eval('.name-period', (element) => {
    const animation = element.getAnimations()[0]
    animation.pause()
    animation.currentTime = 100
    const visible = getComputedStyle(element).opacity
    const width = element.getBoundingClientRect().width
    animation.currentTime = 700
    const hidden = getComputedStyle(element).opacity
    const stableWidth = element.getBoundingClientRect().width === width
    animation.play()
    return { text: element.textContent, decorative: element.getAttribute('aria-hidden'), visible, hidden, stableWidth }
  })
  assert.deepEqual(period, { text: '.', decorative: 'true', visible: '1', hidden: '0', stableWidth: true })
  await page.click('.blink-toggle')
  assert.equal(await page.$eval('.blink-toggle', (button) => button.getAttribute('aria-pressed')), 'true')
  assert.equal(await page.$eval('.name-period', (element) => getComputedStyle(element).opacity), '1')
  assert.equal(await page.$eval('.name-period', (element) => element.getAnimations().length), 0)
  await page.click('.blink-toggle')
  assert.equal(await page.$eval('.name-period', (element) => element.getAnimations().length), 1)

  await page.mouse.move(0, 0)
  await page.mouse.move(1000, 500, { steps: 10 })
  assert.equal(await page.evaluate(() => document.documentElement.style.getPropertyValue('--px')), '')

  assert.ok(await page.$eval('main', (main) => main.textContent.includes('SPRING BOOT')), 'Expertise remains visible without rotation')

  for (const [width, height] of [[1440, 900], [390, 844], [360, 640]]) {
    await page.setViewport({ width, height })
    assert.ok(await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ), `No horizontal overflow at ${width} × ${height}`)
  }

  await page.mouse.move(180, 320)
  await page.mouse.wheel({ deltaY: 400 })
  const scrollable = await page.evaluate(() => document.documentElement.scrollHeight > innerHeight)
  if (scrollable) await page.waitForFunction(() => window.scrollY > 0)
  await page.click('button[aria-controls="mobile-menu"]')
  await page.waitForSelector('#mobile-menu')
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden')
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => !document.querySelector('[role="status"]'), { timeout: 2000 })
  await page.waitForFunction(() => document.querySelector('main').textContent.includes('BACKEND ENGINEER'))
  assert.equal(await page.$eval('.name-period', (element) => getComputedStyle(element).opacity), '1')
  assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.effect.getTiming().iterations === Infinity).length), 0, 'Reduced motion must disable blinking')
  assert.deepEqual(errors, [], 'There must be no browser runtime errors')

  console.log('Motion checks passed: blinking period, counter, native scrolling, static backgrounds, responsive layout, mobile menu, and reduced motion.')
} finally {
  if (browser) await browser.close()
  await server.close()
}
