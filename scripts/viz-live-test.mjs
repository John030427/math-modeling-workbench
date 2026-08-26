/** Viz live test v2: pick e2e project → lab run → chart → save → viz stage → cases. */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'REVIEW', 'overnight')
mkdirSync(outDir, { recursive: true })
const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))
await page.goto(BASE, { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-mm-shell="v3"]', { timeout: 25000 })

await page.click('[data-mm-navlist] div[role="tab"]:has-text("比赛工作台")')
await page.waitForTimeout(1500)

const sel = page.locator('select').first()
const value = await sel.evaluate((el) => {
  const opt = [...el.options].find((o) => (o.textContent ?? '').includes('overnight-e2e'))
  return opt ? opt.value : ''
})
console.log('project value:', value)
if (value) {
  await sel.selectOption(value)
  await page.waitForTimeout(1200)
}

await page.click('button:has-text("实验")')
await page.waitForTimeout(500)
await page.click('button:has-text("执行实验")')
await page.waitForSelector('button:has-text("保存图表记录")', { timeout: 30000 })
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'lab-chart.png') })

await page.click('button:has-text("保存图表记录")')
await page.waitForTimeout(1200)

await page.click('button:has-text("可视化")')
await page.waitForTimeout(1000)
await page.screenshot({ path: path.join(outDir, 'viz-stage.png') })

await page.click('[data-mm-navlist] div[role="tab"]:has-text("优秀案例")')
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(outDir, 'cases-real.png') })

console.log('viz live test done; pageErrors:', errors.length, errors.slice(0, 2))
await browser.close()
