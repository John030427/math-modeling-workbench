import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { makeMathModelingRoutes } from './routes.js'
import { makeContextRoutes, makeLearningRoutes } from './learning-routes.js'
import { makeProductRoutes } from './product-routes.js'
import { MODELING_TUTOR_SKILL } from './skill.js'

const PACKAGE_JSON = fileURLToPath(new URL('../package.json', import.meta.url))
const VERSION = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8')).version ?? '0.0.0'

/** @type {string[]} */
export const inject = ['webServer', 'skills']

/**
 * Mount math-modeling host routes, session context, mastery, and modeling-tutor skill.
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  /** @type {(() => void) | undefined} */
  let unregisterSkill

  ctx.effect(() => {
    unregisterSkill = ctx.skills.register(MODELING_TUTOR_SKILL)
    return () => {
      unregisterSkill?.()
      unregisterSkill = undefined
    }
  }, 'dsh-mathmodeling: skill')

  ctx.effect(() => {
    const disposers = [
      ...makeMathModelingRoutes({ version: VERSION }).map((route) => ctx.webServer.register(route)),
      ...makeContextRoutes().map((route) => ctx.webServer.register(route)),
      ...makeLearningRoutes().map((route) => ctx.webServer.register(route)),
      ...makeProductRoutes().map((route) => ctx.webServer.register(route)),
    ]
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'dsh-mathmodeling: routes')

  ctx.logger.info('[dsh-mathmodeling] mounted v%s (session context + mastery + modeling-tutor)', VERSION)
}
