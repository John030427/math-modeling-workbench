import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1680, height: 950 } })
await page.goto('http://127.0.0.1:3080', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-mm-shell="v2"]', { timeout: 25000 })

const info = await page.evaluate(() => {
  const rootStyle = getComputedStyle(document.documentElement)
  const bodyStyle = getComputedStyle(document.body)
  const vars = {}
  for (const sheet of document.styleSheets) {
    let rules
    try {
      rules = sheet.cssRules
    } catch {
      continue
    }
    for (const rule of rules) {
      if (rule.style) {
        for (const prop of rule.style) {
          if (prop.startsWith('--') && /color|bg|background|surface|fg|foreground|border|theme|text/i.test(prop)) {
            vars[prop] = rule.style.getPropertyValue(prop).trim()
          }
        }
      }
    }
  }
  const frame = document.querySelector('[data-mm-shell="v2"]')
  return {
    bodyBg: bodyStyle.backgroundColor,
    bodyColor: bodyStyle.color,
    rootBg: rootStyle.backgroundColor,
    rootColor: rootStyle.color,
    frameBg: frame ? getComputedStyle(frame).backgroundColor : null,
    frameColor: frame ? getComputedStyle(frame).color : null,
    htmlClass: document.documentElement.className,
    bodyClass: document.body.className,
    varCount: Object.keys(vars).length,
    vars,
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
