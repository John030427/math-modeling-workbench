import * as esbuild from 'esbuild'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const entry = path.join(root, '../src/client/index.tsx')
const outfile = path.join(root, '../lib/client.js')

const result = await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  write: false,
  target: 'es2022',
  jsx: 'automatic',
  external: [
    'react',
    'react/jsx-runtime',
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-runtime/client',
  ],
  logLevel: 'info',
})

const cjsBody = result.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({
  id: "@math-modeling/harness-spike",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    ${cjsBody}
    return module.exports;
  }
});
`

writeFileSync(outfile, wrapped, 'utf8')
console.log('[harness-spike] built lib/client.js (ModuleLoader wrapper)')
