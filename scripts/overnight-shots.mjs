/** Overnight surface screenshots — review/gym/competition/profile at 1920x1080. */
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
await page.goto(BASE, { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-mm-shell="v3"]', { timeout: 25000 })

const nav = (label) => `[data-mm-navlist] div[role="tab"]:has-text("${label}")`

await page.click(nav('今日复习'))
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(outDir, 'daily-review.png') })

await page.click(nav('专项训练'))
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(outDir, 'gym.png') })

await page.click(nav('比赛工作台'))
await page.waitForTimeout(2000)
await page.screenshot({ path: path.join(outDir, 'competition.png') })

await page.click(nav('能力画像'))
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(outDir, 'profile.png') })

await page.click(nav('模型地图'))
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(outDir, 'atlas.png') })

await browser.close()
console.log('overnight screenshots done →', outDir)
