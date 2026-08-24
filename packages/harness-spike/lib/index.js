/** Host marker for harness spike — health endpoint only. */
export const inject = ['webServer']

export function apply(ctx) {
  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      path: '/api/mathmodeling/harness-spike/health',
      method: 'GET',
      handler: () => ({ ok: true, spike: 'mathmodel-harness', version: '0.1.0' }),
    })
    return () => dispose()
  }, 'harness-spike: health')
  ctx.logger.info('[harness-spike] mounted (custom layout experiment)')
}
