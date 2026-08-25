/**
 * PRODUCT_UI_GATE driver (MATHMODEL_PROFILE_PHASE3_PLAN.md P6).
 * Multi-viewport screenshots + U1-U7 automated checks.
 * Usage: node scripts/product-ui-gate.mjs [baseUrl] (default http://127.0.0.1:3100)
 */
import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'REVIEW', 'product-ui-gate')
mkdirSync(outDir, { recursive: true })

const BASE = process.argv[2] ?? 'http://127.0.0.1:3100'
const VIEWPORTS = [
  { w: 1920, h: 1080 },
  { w: 1680, h: 900 },
  { w: 1440, h: 900 },
  { w: 1024, h: 768 },
]

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const report = { base: BASE, viewports: {}, checks: {}, errors: [] }

function assert(cond, msg, errors) {
  if (!cond) errors.push(msg)
}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  const pageErrors = []
  const consoleErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)))
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300))
  })
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-mm-shell="v3"]', { timeout: 25000 })
    await page.waitForTimeout(1800)

    const m = {}
    m.shell = (await page.locator('[data-mm-shell="v3"]').count()) > 0
    m.navCount = await page.locator('[data-mm-nav]').count()
    m.navGroups = await page.locator('[data-mm-navlist] > div').count()
    m.agentCol = (await page.locator('[data-mm-agent]').count()) > 0
    m.agentOpen = (await page.locator('[data-mm-agent][data-mm-agent-open="1"]').count()) > 0

    // U2: agent column width at desktop widths
    if (vp.w >= 1440 && m.agentOpen) {
      const box = await page.locator('[data-mm-agent]').boundingBox()
      m.agentWidth = box ? Math.round(box.width) : 0
    }

    // U4: duplicate 数模工作台 tab inside conversation area
    const convText = await page.locator('[data-mm-agent]').innerText()
    m.duplicateWorkbenchTab = convText.includes('数模工作台')

    // dashboard content (U6)
    const mainText = await page.locator('[data-mm-main]').innerText()
    m.dashboardHasHero = mainText.includes('今天最值得继续什么')
    m.dashboardHasModules = ['模型地图', '专项训练', '比赛工作台', '题库', '优秀案例', '论文评审'].every((t) =>
      mainText.includes(t),
    )

    await page.screenshot({ path: path.join(outDir, `${vp.w}x${vp.h}-dashboard.png`) })

    // atlas page (U7)
    await page.click('[data-mm-navlist] div[role="tab"]:has-text("模型地图")')
    await page.waitForTimeout(1200)
    const atlasText = await page.locator('[data-mm-section="atlas"]').innerText()
    m.atlasGroups = /聚类/.test(atlasText) && /评价/.test(atlasText)
    m.atlasSearch = (await page.locator('[data-mm-section="atlas"] input').count()) > 0
    m.atlasKmeansRef = atlasText.includes('参考课')
    await page.screenshot({ path: path.join(outDir, `${vp.w}x${vp.h}-atlas.png`) })

    // lesson pane (workbench slot)
    await page.click('[data-mm-atlas-card="kmeans"]')
    await page.waitForTimeout(1800)
    m.lessonPaneVisible = await page.evaluate(
      () => getComputedStyle(document.querySelector('[data-mm-section="lesson"]')).display !== 'none',
    )
    await page.screenshot({ path: path.join(outDir, `${vp.w}x${vp.h}-lesson.png`) })

    m.pageErrors = pageErrors
    m.consoleErrors = consoleErrors
    report.viewports[`${vp.w}x${vp.h}`] = m
  } catch (e) {
    report.viewports[`${vp.w}x${vp.h}`] = { error: String(e).slice(0, 300), pageErrors, consoleErrors }
    await page.screenshot({ path: path.join(outDir, `${vp.w}x${vp.h}-failure.png`) }).catch(() => {})
  }
  await page.close()
}

// ── aggregate checks ──
const errs = report.errors
const first = report.viewports['1920x1080'] ?? {}
const v1024 = report.viewports['1024x768'] ?? {}

report.checks.U1_singleSidebar = first.navCount === 1
report.checks.U2_workbenchDominance =
  first.agentWidth >= 380 && first.agentWidth <= 430 && first.agentCol === true
report.checks.U3_iaAlignment =
  first.navGroups === 6 && first.dashboardHasHero && first.dashboardHasModules
report.checks.U4_noDuplicateWorkbenchTab = first.duplicateWorkbenchTab === false
report.checks.U5_agentContextUX = first.agentCol === true && v1024.agentCol === true
report.checks.U6_productDashboard = first.dashboardHasHero && first.dashboardHasModules
report.checks.U7_atlasQuality =
  first.atlasGroups && first.atlasSearch && first.atlasKmeansRef
report.checks.zeroErrors = Object.values(report.viewports).every(
  (v) => (v.pageErrors ?? []).length === 0 && (v.consoleErrors ?? []).length === 0,
)

report.gate = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL'
writeFileSync(path.join(outDir, 'product-ui-gate-report.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checks: report.checks, gate: report.gate, errors: errs.slice(0, 10) }, null, 2))
await browser.close()
process.exit(report.gate === 'PASS' ? 0 : 1)
