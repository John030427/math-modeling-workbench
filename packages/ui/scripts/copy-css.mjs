import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
mkdirSync(join(ROOT, 'dist'), { recursive: true })
copyFileSync(join(ROOT, 'src/styles.css'), join(ROOT, 'dist/styles.css'))
