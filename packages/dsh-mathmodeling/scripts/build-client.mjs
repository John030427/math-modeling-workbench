import * as esbuild from 'esbuild'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const UI_CSS = join(ROOT, '../ui/dist/styles.css')
const ASSETS = join(ROOT, 'assets')

mkdirSync(ASSETS, { recursive: true })
copyFileSync(UI_CSS, join(ASSETS, 'ui.css'))

const result = await esbuild.build({
  entryPoints: [join(ROOT, 'src/client/index.tsx')],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  write: false,
  external: [
    'react',
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-runtime/client',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-sidebar',
    '@deepseek-ai/dsh-client-ui-conversation',
  ],
  alias: {
    '@math-modeling/ui': join(ROOT, '../ui/src/index.ts'),
  },
  jsx: 'automatic',
  logLevel: 'warning',
})

const cjsBody = result.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({
  id: "@math-modeling/dsh-mathmodeling",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    ${cjsBody}
    return module.exports;
  }
});
`

writeFileSync(join(ROOT, 'lib/client.js'), wrapped, 'utf8')
console.log('[dsh-mathmodeling] built lib/client.js')
