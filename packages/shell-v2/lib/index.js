/** Shell V2 host — health endpoint (WebRoute exact shape, Live-Gate lesson). */
export const inject = ['webServer']

const VERSION = '0.1.0'

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'exact',
      path: '/api/mathmodeling/shell-v2/health',
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
            shell: 'shell-v2',
            version: VERSION,
          }),
        )
      },
    })
    return () => dispose()
  }, 'shell-v2: health')
  ctx.logger.info('[shell-v2] mounted (MathModel Shell V2)')
}
