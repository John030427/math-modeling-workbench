/**
 * Shell V2 live-check driver (playwright-core + system Edge).
 * Usage: node scripts/shell-v2-live.mjs <h3|h1|h2|h4|all> [baseUrl]
 * Artifacts: REVIEW/live/<gate>-*.png + REVIEW/live/<gate>-report.json
 */
import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'REVIEW', 'live')
mkdirSync(outDir, { recursive: true })

const gate = process.argv[2] ?? 'all'
const BASE = process.argv[3] ?? 'http://127.0.0.1:3080'

function mkPageTracker() {
  const consoleErrors = []
  const pageErrors = []
  const requests = []
  return {
    consoleErrors,
    pageErrors,
    requests,
    attach(page) {
      page.on('console', (m) => {
        if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 400))
      })
      page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 400)))
      page.on('request', (r) => {
        const u = r.url()
        if (u.includes('/api/mathmodeling')) requests.push(`${r.method()} ${new URL(u).pathname}`)
      })
    },
  }
}

async function launch() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1680, height: 950 } })
  const page = await ctx.newPage()
  return { browser, ctx, page }
}

const shot = (page, name) => page.screenshot({ path: path.join(outDir, `${name}.png`) })
const report = (name, data) => writeFileSync(path.join(outDir, `${name}-report.json`), JSON.stringify(data, null, 2))

/** Wait until the center header title equals `title`. */
async function waitTitle(page, title, timeout = 8000) {
  await page.waitForFunction(
    (t) => {
      const el = document.querySelector('[data-mm-title]')
      return el && el.textContent?.includes(t)
    },
    title,
    { timeout },
  )
}

/** Assert a section pane is the visible one. */
async function visibleSection(page, id, timeout = 5000) {
  await page.waitForFunction(
    (sid) => {
      const el = document.querySelector(`[data-mm-section="${sid}"]`)
      return el && getComputedStyle(el).display !== 'none'
    },
    id,
    { timeout },
  )
}

const navLabel = (label) => `[data-mm-shell] nav div[role="tab"]:has-text("${label}")`

/** Send composer text: Escape (dismiss command palette) → Enter → geometric send-button fallback. */
async function sendComposer(page, text) {
  const composer = page.locator('[data-mm-agent] textarea, [data-mm-agent] [role="textbox"], [data-mm-shell] section textarea').first()
  await composer.waitFor({ timeout: 20000 })
  await composer.click()
  await composer.fill(text)
  await composer.press('Escape')
  await page.waitForTimeout(300)
  await composer.press('Enter')
  await page.waitForTimeout(2500)
  let sent = await page
    .waitForFunction(
      (t) => document.body.innerText.includes(t),
      text,
      { timeout: 6000 },
    )
    .then(() => true)
    .catch(() => false)
  if (!sent) {
    // geometric fallback: any enabled button inside the chat column near/below the composer
    const box = await composer.boundingBox()
    if (box) {
      const btns = await page.locator('[data-mm-shell] section button').all()
      for (const b of btns) {
        const bb = await b.boundingBox().catch(() => null)
        if (!bb) continue
        const nearComposer =
          bb.y >= box.y - 60 && bb.y <= box.y + box.height + 140 && bb.x + bb.width >= box.x
        if (nearComposer && (await b.isEnabled())) {
          await b.click().catch(() => {})
          await page.waitForTimeout(2000)
          break
        }
      }
    }
    sent = await page
      .waitForFunction((t) => document.body.innerText.includes(t), text, { timeout: 10000 })
      .then(() => true)
      .catch(() => false)
  }
  return sent
}

/* ---------------- H3: shell render + nav ---------------- */

async function h3() {
  const { browser, page } = await launch()
  const t = mkPageTracker()
  t.attach(page)
  const result = { gate: 'H3', steps: [] }
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-mm-shell]', { timeout: 25000 })
    result.steps.push('shell frame mounted')

    const navCount = await page.locator('[data-mm-shell] nav div[role="tab"]').count()
    assert(navCount === 8, `nav tabs = ${navCount}, want 8`)
    result.steps.push(`nav tabs: ${navCount}`)

    // dashboard default: registry cards visible
    await waitTitle(page, '仪表盘')
    await page.waitForSelector('text=K-Means 聚类', { timeout: 10000 })
    const cards = await page.locator('text=/聚类|层次分析法|TOPSIS|线性回归/').count()
    result.steps.push(`dashboard cards matched: ${cards}`)
    await shot(page, 'h3-dashboard')

    // switch to workbench via nav
    await page.click(navLabel('建模工作台'))
    await waitTitle(page, '建模工作台')
    await visibleSection(page, 'workbench')
    await page.waitForTimeout(1200)
    result.steps.push('nav → workbench OK')
    await shot(page, 'h3-workbench')

    // placeholder section
    await page.click(navLabel('训练'))
    await waitTitle(page, '训练')
    await visibleSection(page, 'training')
    await page.waitForSelector('text=规划中', { timeout: 5000 })
    result.steps.push('placeholder section OK')

    // dashboard card click → context POST + auto-switch to workbench
    await page.click(navLabel('仪表盘'))
    await waitTitle(page, '仪表盘')
    await visibleSection(page, 'dashboard')
    await page.click('text=K-Means 聚类')
    await waitTitle(page, '建模工作台')
    await visibleSection(page, 'workbench')
    await page.waitForTimeout(1500)
    result.contextPost = t.requests.some((r) => r.startsWith('POST /api/mathmodeling/context'))
    result.steps.push(`card click → workbench, context POST = ${result.contextPost}`)
    await shot(page, 'h3-card-to-workbench')

    // three columns sanity
    const cols = await page.evaluate(() => {
      const f = document.querySelector('[data-mm-shell]')
      return f ? getComputedStyle(f).gridTemplateColumns.split(' ').length : 0
    })
    assert(cols === 3, `grid columns = ${cols}`)
    result.steps.push('three-column grid confirmed')

    result.consoleErrors = t.consoleErrors
    result.pageErrors = t.pageErrors
    result.pass = t.pageErrors.length === 0 && result.contextPost === true
    report('h3', result)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    result.error = String(e)
    result.consoleErrors = t.consoleErrors
    result.pageErrors = t.pageErrors
    result.pass = false
    report('h3', result)
    await shot(page, 'h3-failure').catch(() => {})
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await browser.close()
  }
}

/* ---------------- H1: native agent reply ---------------- */

async function h1() {
  const { browser, page } = await launch()
  const t = mkPageTracker()
  t.attach(page)
  const result = { gate: 'H1', steps: [] }
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-mm-shell]', { timeout: 25000 })

    // composer lives in right column; type and send
    const ok = await sendComposer(page, '请原样回复四个字符：OK-H1')
    assert(ok, 'message echo not found after send')
    result.steps.push('message sent')

    // wait for REPLY: token must appear ≥2 times (user bubble + assistant reply)
    await page.waitForFunction(
      () => document.body.innerText.split('OK-H1').length >= 3,
      { timeout: 180000 },
    )
    await page.waitForTimeout(2500)
    await shot(page, 'h1-reply')
    result.steps.push('agent replied OK-H1')

    result.consoleErrors = t.consoleErrors
    result.pageErrors = t.pageErrors
    result.pass = true
    report('h1', result)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    result.error = String(e).slice(0, 500)
    result.consoleErrors = t.consoleErrors
    result.pageErrors = t.pageErrors
    result.pass = false
    report('h1', result)
    await shot(page, 'h1-failure').catch(() => {})
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await browser.close()
  }
}

/* ---------------- H2: session restore + context isolation ---------------- */

async function h2() {
  const { browser, page } = await launch()
  const t = mkPageTracker()
  t.attach(page)
  const result = { gate: 'H2', steps: [] }
  const B = BASE
  try {
    // API-level ModelingContext isolation with two explicit sessions
    await fetch(`${B}/api/mathmodeling/context`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ session_id: 'gateA', page: 'atlas', model_id: 'kmeans' }),
    })
    await fetch(`${B}/api/mathmodeling/context`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ session_id: 'gateB', page: 'atlas', model_id: 'topsis' }),
    })
    const a = await (await fetch(`${B}/api/mathmodeling/context?session_id=gateA`)).json()
    const b = await (await fetch(`${B}/api/mathmodeling/context?session_id=gateB`)).json()
    result.ctxA = a.context?.model_id ?? a.model_id ?? null
    result.ctxB = b.context?.model_id ?? b.model_id ?? null
    assert(result.ctxA === 'kmeans', `session A model = ${result.ctxA}`)
    assert(result.ctxB === 'topsis', `session B model = ${result.ctxB}`)
    result.steps.push('context isolation A=kmeans, B=topsis')

    // UI-level: shell up → new session → reload → shell still up (restore)
    await page.goto(B, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-mm-shell]', { timeout: 25000 })
    await shot(page, 'h2-before-reload')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-mm-shell]', { timeout: 25000 })
    result.steps.push('reload restored shell UI')
    await shot(page, 'h2-after-reload')

    // create second session via sidebar 新建会话
    const newBtn = page.locator('button:has-text("新建会话")').first()
    if (await newBtn.isVisible().catch(() => false)) {
      await newBtn.click()
      await page.waitForTimeout(1200)
      result.steps.push('second session created')
    }
    await shot(page, 'h2-second-session')

    result.pass = true
    report('h2', result)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    result.error = String(e).slice(0, 500)
    result.pass = false
    report('h2', result)
    await shot(page, 'h2-failure').catch(() => {})
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await browser.close()
  }
}

/* ---------------- H4: modeling-tutor ---------------- */

async function h4() {
  const { browser, page } = await launch()
  const t = mkPageTracker()
  t.attach(page)
  const result = { gate: 'H4', steps: [] }
  try {
    // seed session context so tutor has model context
    await fetch(`${BASE}/api/mathmodeling/context`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ session_id: 'gateTutor', page: 'atlas', model_id: 'kmeans' }),
    })
    result.offline = await (await fetch(
      `${BASE}/api/mathmodeling/tutor/offline?session_id=gateTutor&message=为什么要做特征标准化？`,
    )).json()
    result.steps.push('offline tutor answered')

    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-mm-shell]', { timeout: 25000 })
    // slash-commands may render as chips (no raw-text echo) — ignore echo, judge by reply
    await sendComposer(page, '/modeling-tutor 当前模型是K-Means，它的核心思想是什么？')
    result.steps.push('/modeling-tutor dispatched')

    await page.waitForFunction(
      () => /簇|质心|标准化|SSE/i.test(document.body.innerText),
      { timeout: 180000 },
    )
    await page.waitForTimeout(2000)
    await shot(page, 'h4-tutor-reply')
    result.steps.push('tutor replied with kmeans pedagogy')
    result.pass = true
    report('h4', result)
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    result.error = String(e).slice(0, 500)
    result.pass = false
    report('h4', result)
    await shot(page, 'h4-failure').catch(() => {})
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await browser.close()
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(`assert failed: ${msg}`)
}

const runners = { h3, h1, h2, h4 }
const which = gate === 'all' ? ['h3', 'h1', 'h2', 'h4'] : [gate]
for (const g of which) {
  console.log(`\n===== RUN ${g.toUpperCase()} =====`)
  await runners[g]()
}


