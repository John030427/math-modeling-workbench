import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1680, height: 950 } })
const errs = []
page.on('pageerror', (e) => errs.push(String(e).slice(0, 300)))
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)) })
await page.goto('http://127.0.0.1:3080', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(6000)
const text = await page.evaluate(() => document.body.innerText.slice(0, 600))
const shell = await page.locator('[data-mm-shell="v2"]').count()
console.log(JSON.stringify({ shell, errs, text }, null, 2))
await page.screenshot({ path: 'REVIEW/live/h5-debug-stock.png' })
await browser.close()
