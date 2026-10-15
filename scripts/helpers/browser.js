import assert from 'node:assert/strict'
import puppeteer from 'puppeteer'
import { createServer } from 'vite'

export async function withBrowser(check) {
  const server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
  let browser
  try {
    await server.listen()
    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await check({ page, browser, url: server.resolvedUrls.local[0] })
    assert.deepEqual(errors, [], 'There must be no browser runtime errors')
  } finally {
    if (browser) await browser.close()
    await server.close()
  }
}

export async function waitForReady(page) {
  await page.waitForFunction(() => !document.querySelector('[role="status"][aria-label="Loading"]'))
  await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1')
}
