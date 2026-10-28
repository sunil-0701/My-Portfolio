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
  assert.ok(await page.$eval('.hero-portrait', (element) => {
    const offset = new DOMMatrixReadOnly(getComputedStyle(element).transform).m42
    return offset >= element.offsetHeight - 1
  }), 'The portrait must start below the hero while the intro is visible')
  await page.waitForFunction(() => {
    const portrait = document.querySelector('.hero-portrait')
    const offset = new DOMMatrixReadOnly(getComputedStyle(portrait).transform).m42
    return document.querySelector('[aria-label="Loading"]') &&
      !document.querySelector('main').closest('[inert]') &&
      offset > 0 && offset < portrait.offsetHeight - 1
  })
  await page.waitForFunction(() => !document.querySelector('[role="status"]'))
  await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1')
  await page.waitForFunction(() => {
    const style = getComputedStyle(document.querySelector('.hero-portrait'))
    return new DOMMatrixReadOnly(style.transform).m42 === 0 && style.opacity === '1'
  })

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
      !animation.effect.target.matches('.name-period, .hero-linework-scan, .location-track'),
    ).length,
    nativeScroll: getComputedStyle(document.documentElement).scrollBehavior === 'auto',
  }))
  assert.equal(effects.expensiveSurfaces, 0, 'Do not reintroduce filter/backdrop surfaces')
  assert.equal(effects.unexpectedLoops, 0, 'Only the requested name punctuation, decorative line scan, and city names may loop')
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
  assert.equal(await page.$('.blink-toggle'), null, 'The blinking-dot pause button must be removed')

  const linework = await page.$eval('.hero-linework', (element) => {
    const rail = element.querySelector('.hero-linework-vertical')
    const crossbar = element.querySelector('.hero-linework-crossbar')
    const scan = element.querySelector('.hero-linework-scan')
    const animation = scan.getAnimations()[0]
    animation.pause()
    animation.currentTime = 1000
    const start = new DOMMatrixReadOnly(getComputedStyle(scan).transform).m42
    animation.currentTime = 3800
    const raised = new DOMMatrixReadOnly(getComputedStyle(scan).transform).m42
    animation.currentTime = 6600
    const lowered = new DOMMatrixReadOnly(getComputedStyle(scan).transform).m42
    const square = scan.lastElementChild.getBoundingClientRect()
    const bar = crossbar.getBoundingClientRect()
    const railBounds = rail.getBoundingClientRect()
    const connected = Math.abs(square.top + square.height / 2 - bar.top - bar.height / 2) < 1 &&
      Math.abs(square.left + square.width / 2 - railBounds.right) < 1
    animation.play()
    return {
      decorative: element.getAttribute('aria-hidden'),
      drawIn: rail.getAnimations().some((effect) => effect.animationName === 'hero-linework-draw-vertical') &&
        crossbar.getAnimations().some((effect) => effect.animationName === 'hero-linework-draw-horizontal'),
      start, raised, lowered, connected,
    }
  })
  assert.equal(linework.decorative, 'true')
  assert.ok(linework.drawIn, 'The vertical and horizontal lines must draw into view')
  assert.equal(linework.start, 0)
  assert.ok(linework.raised < 0 && linework.lowered > 0, 'The line and square must scan gently up and down')
  assert.ok(linework.connected, 'Keep the square connected to both lines while moving')
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.waitForFunction(() =>
    getComputedStyle(document.querySelector('.hero-linework-scan')).animationPlayState === 'paused',
  )
  await page.evaluate(() => {
    delete document.visibilityState
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.waitForFunction(() =>
    getComputedStyle(document.querySelector('.hero-linework-scan')).animationPlayState === 'running',
  )

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
  assert.equal(await page.$eval('.hero-portrait', (element) =>
    new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
  ), 0, 'Reduced motion must show the portrait without a slide')
  assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.effect.getTiming().iterations === Infinity).length), 0, 'Reduced motion must disable blinking')
  await page.setViewport({ width: 1366, height: 768 })
  assert.equal(await page.$eval('.hero-linework', (element) => element.getAnimations({ subtree: true }).length), 0, 'Reduced motion must keep the desktop linework static')
  assert.deepEqual(errors, [], 'There must be no browser runtime errors')

  console.log('Motion checks passed: animated linework, portrait slide-in, blinking period, counter, native scrolling, static backgrounds, responsive layout, mobile menu, and reduced motion.')
} finally {
  if (browser) await browser.close()
  await server.close()
}
