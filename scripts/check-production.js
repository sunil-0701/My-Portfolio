import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import { waitForReady } from './helpers/browser.js'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const files = new Map()
const load = async (directory, prefix = '') => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const key = `${prefix}${entry.name}`
    if (entry.isDirectory()) await load(join(directory, entry.name), `${key}/`)
    else files.set(key, await readFile(join(directory, entry.name)))
  }
}
await load(dist)

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }
let mount = '/'
const server = createServer((request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname
  const key = path.startsWith(mount) ? path.slice(mount.length) || 'index.html' : null
  const content = files.get(key)
  if (!content) {
    response.writeHead(404)
    response.end('Not found')
    return
  }
  response.writeHead(200, { 'Content-Type': types[extname(key)] ?? 'application/octet-stream' })
  response.end(content)
})
let browser
try {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setViewport({ width: 390, height: 844 })
  const errors = []
  const failedAssets = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.url().startsWith(origin) && response.status() >= 400) failedAssets.push(response.url())
  })
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(origin)) failedAssets.push(request.url())
  })

  for (const prefix of ['/', '/My-Portfolio/']) {
    mount = prefix
    const base = `${origin}${prefix}`
    const response = await page.goto(base, { waitUntil: 'networkidle0' })
    assert.equal(response.status(), 200)
    await waitForReady(page)
    await page.$eval('img', (image) => image.decode())
    const assets = await page.evaluate(() => ({
      script: document.querySelector('script[type="module"]').src,
      stylesheet: document.querySelector('link[rel="stylesheet"][href*="assets/"]').href,
      icon: document.querySelector('link[rel="icon"]').href,
      preview: new URL(document.querySelector('[property="og:image"]').content, document.baseURI).href,
      texture: getComputedStyle(document.querySelector('.technical-surface')).backgroundImage.match(/url\("?([^")]+)"?\)/)[1],
    }))
    for (const [name, url] of Object.entries(assets)) {
      assert.ok(url.startsWith(base), `${name} must remain inside ${prefix}`)
      assert.equal((await fetch(url)).status, 200, `${name} must load at ${prefix}`)
    }
    await page.click('button[aria-controls="mobile-menu"]')
    await page.waitForSelector('#mobile-menu[open]')
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.querySelector('#mobile-menu'))
  }
  assert.deepEqual(errors, [], 'Production JavaScript must run without errors')
  assert.deepEqual(failedAssets, [], 'Production assets must not escape their deployment folder')
  console.log('Production checks passed: real built assets, root and subfolder hosting, portrait decoding, sharing images, texture, and mobile navigation.')
} finally {
  if (browser) await browser.close()
  await new Promise((resolve) => server.close(resolve))
}
