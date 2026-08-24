import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/client/index.tsx'],
  outDir: 'lib',
  format: 'esm',
  platform: 'browser',
  dts: false,
  external: [
    'react',
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-sidebar',
    '@deepseek-ai/dsh-client-ui-conversation',
    '@math-modeling/ui',
  ],
  banner: 'window.__ModuleLoader__.load({ id: "@math-modeling/dsh-mathmodeling", factory: (require) => {',
  footer: '});',
})
