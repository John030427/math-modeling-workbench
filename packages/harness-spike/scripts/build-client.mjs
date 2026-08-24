import * as esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const entry = path.join(root, '../src/client/index.tsx')
const outfile = path.join(root, '../lib/client.js')

await esbuild.build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  external: [
    'react',
    'react/jsx-runtime',
    '@deepseek-ai/dsh-client-runtime/client',
  ],
  logLevel: 'info',
})

console.log('[harness-spike] built lib/client.js')
