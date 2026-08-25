/**
 * H5 rollback gate — verify stock UI or shell UI after hot assembly flips.
 * Usage: node scripts/shell-v2-h5.mjs <stock|shell> [baseUrl]
 */
import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'REVIEW', 'live')
mkdirSync(outDir, { recursive: true })

const mode = process.argv[2] ?? 'stock'
const BASE = process.argv[3] ?? 'http://127.0.0.1:3080'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1680, height: 950 } })
const consoleErrors = []
const pageErrors = []
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300))
})
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)))

const result = { mode, checks: {} }
try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('text=新会话', { timeout: 25000 })
  await page.waitForTimeout(2500)

  const shellMounted = await page.locator('[data-mm-shell="v2"]').count()
  const composerCount = await page
    .locator('textarea, [contenteditable="true"], [role="textbox"]')
    .count()
  const bodyText = await page.evaluate(() => document.body.innerText)
  result.checks.shellMounted = shellMounted > 0
  result.checks.composerPresent = composerCount > 0
  result.checks.sidebarVisible = /新建会话|设置/.test(bodyText)

  if (mode === 'stock') {
    result.pass = !result.checks.shellMounted && result.checks.composerPresent && result.checks.sidebarVisible
    await page.screenshot({ path: path.join(outDir, 'h5-stock-restored.png') })
  } else {
    // shell mode: three-column frame + nav + conversation all present
    const navTabs = await page.locator('[data-mm-shell="v2"] nav div[role="tab"]').count()
    result.checks.navTabs = navTabs
    result.pass = result.checks.shellMounted && navTabs === 8 && result.checks.composerPresent
    await page.screenshot({ path: path.join(outDir, 'h5-shell-reenabled.png') })
  }
  result.consoleErrors = consoleErrors
  result.pageErrors = pageErrors
} catch (e) {
  result.error = String(e).slice(0, 400)
  result.pass = false
  await page.screenshot({ path: path.join(outDir, `h5-${mode}-failure.png`) }).catch(() => {})
}

writeFileSync(path.join(outDir, `h5-${mode}-report.json`), JSON.stringify(result, null, 2))
console.log(JSON.stringify(result, null, 2))
await browser.close()
process.exit(result.pass ? 0 : 1)
