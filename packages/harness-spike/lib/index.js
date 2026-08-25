/** Host marker for harness spike — health endpoint (correct WebRoute shape). */
export const inject = ['webServer']

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'exact',
      path: '/api/mathmodeling/harness-spike/health',
      handler: (req, res) => {
        if (req.method !== 'GET') {
          res.writeHead(405, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ ok: false, error: 'method-not-allowed' }))
          return
        }
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
        res.end(
          JSON.stringify({
            ok: true,
            spike: 'mathmodel-harness',
            version: '0.1.0',
          }),
        )
      },
    })
    return () => dispose()
  }, 'harness-spike: health')
  ctx.logger.info('[harness-spike] mounted (custom layout experiment)')
}
