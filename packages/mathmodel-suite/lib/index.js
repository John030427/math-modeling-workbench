/** MathModel Suite host — composition marker + health endpoint. */
export const inject = ['webServer']

const VERSION = '0.1.0'

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'exact',
      path: '/api/mathmodeling/suite-health',
      handler: (req, res) => {
        if (req.method !== 'GET') {
          res.writeHead(405, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ ok: false, error: 'method-not-allowed' }))
          return
        }
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ ok: true, suite: 'mathmodel-suite', version: VERSION }))
      },
    })
    return () => dispose()
  }, 'mathmodel-suite: health')
  ctx.logger.info('[mathmodel-suite] mounted (product composition)')
}
