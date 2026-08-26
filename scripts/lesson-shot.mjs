import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
const errs = []
page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)))
await page.goto('http://127.0.0.1:3100', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-mm-shell="v3"]', { timeout: 25000 })
await page.click('[data-mm-navlist] div[role="tab"]:has-text("模型地图")')
await page.waitForTimeout(1200)
await page.click('[data-mm-atlas-card="topsis"]')
await page.waitForFunction(() => document.body.innerText.includes('30 秒直觉'), { timeout: 15000 })
await page.screenshot({ path: 'REVIEW/overnight/deep-lesson-dea.png' })
const txt = await page.evaluate(() => document.querySelector('[data-mm-section="lesson"]').innerText.slice(0, 300))
console.log('ERRORS:', errs.length)
console.log(txt)
await browser.close()

