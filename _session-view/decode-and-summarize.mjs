import { readFileSync, writeFileSync } from 'node:fs';
import { zstdDecompressSync } from 'node:zlib';

// usage: node decode-and-summarize.mjs <src.zstd> <outJsonl> <outSummary>
const [src, outJsonl, outSummary] = process.argv.slice(2);

const buf = readFileSync(src);
const MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);
const offs = [];
for (let i = buf.indexOf(MAGIC); i !== -1; i = buf.indexOf(MAGIC, i + 1)) offs.push(i);

const parts = [];
let cur = 0;
let failed = 0;
while (cur < buf.length) {
  const cands = offs.filter((o) => o > cur);
  let decoded = null;
  let end = -1;
  for (const c of cands) {
    try { decoded = zstdDecompressSync(buf.subarray(cur, c)); end = c; break; } catch {}
  }
  if (decoded === null) {
    try { decoded = zstdDecompressSync(buf.subarray(cur)); end = buf.length; }
    catch { failed++; break; }
  }
  parts.push(decoded);
  cur = end;
}
const text = Buffer.concat(parts).toString('utf8');
writeFileSync(outJsonl, text, 'utf8');

// ---- summarize ----
const lines = text.split('\n').filter((l) => l.trim());
const typeCount = {};
const samples = {};
const messages = []; // {idx, type, role, preview}
let idx = 0;
for (const l of lines) {
  let o;
  try { o = JSON.parse(l); } catch { typeCount['<badjson>'] = (typeCount['<badjson>'] ?? 0) + 1; continue; }
  const t = o.type ?? '<none>';
  typeCount[t] = (typeCount[t] ?? 0) + 1;
  if (!samples[t]) samples[t] = JSON.stringify(o).slice(0, 1200);
  idx++;
  let role = '', preview = '';
  const m = o.message;
  if (m) {
    role = m.role ?? '';
    const c = m.content;
    if (typeof c === 'string') preview = c;
    else if (Array.isArray(c)) preview = c.map((b) => {
      const bt = b.type ?? '?';
      if (bt === 'text') return b.text;
      if (bt === 'thinking') return '[thinking]';
      if (bt === 'tool_use') return `[tool_use:${b.name}]`;
      if (bt === 'tool_result') return '[tool_result]';
      return `[${bt}]`;
    }).join(' ');
    else if (c != null) preview = JSON.stringify(c);
  } else {
    preview = JSON.stringify(o).slice(0, 300);
  }
  preview = (preview ?? '').replace(/\s+/g, ' ').trim().slice(0, 220);
  messages.push({ i: idx, t, role, preview });
}

writeFileSync(outSummary, JSON.stringify({
  frames: parts.length,
  decodeFailures: failed,
  rawChars: text.length,
  lines: lines.length,
  typeCount,
  samples,
}, null, 2), 'utf8');

// message flow list
const flow = messages.map((m) =>
  `${String(m.i).padStart(4)} | ${m.t.padEnd(10)} | ${(m.role || '-').padEnd(9)} | ${m.preview}`
).join('\n');
writeFileSync(outSummary.replace(/\.json$/, '.flow.txt'), flow, 'utf8');
