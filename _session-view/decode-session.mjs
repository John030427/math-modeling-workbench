import { readFileSync, writeFileSync } from 'node:fs';
import { zstdDecompressSync } from 'node:zlib';

const src = process.argv[2];
const outPath = process.argv[3];

const buf = readFileSync(src);

// locate all zstd frame magic offsets (LE 0x28B52FFD)
const MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);
const offs = [];
for (let i = buf.indexOf(MAGIC); i !== -1; i = buf.indexOf(MAGIC, i + 1)) offs.push(i);
console.error(`[probe] file=${buf.length}B magicOffsets=${offs.length}`);

// greedy multi-frame decode: next frame starts at some magic offset
const parts = [];
let cur = 0;
while (cur < buf.length) {
  const cands = offs.filter((o) => o > cur);
  let decoded = null;
  let end = -1;
  for (const c of cands) {
    try { decoded = zstdDecompressSync(buf.subarray(cur, c)); end = c; break; } catch {}
  }
  if (decoded === null) {
    try { decoded = zstdDecompressSync(buf.subarray(cur)); end = buf.length; }
    catch (e) { console.error(`[probe] decode failed at ${cur}: ${e.message}`); break; }
  }
  parts.push(decoded);
  cur = end;
}
const text = Buffer.concat(parts).toString('utf8');
if (outPath) writeFileSync(outPath, text, 'utf8');
console.error(`[probe] decoded=${text.length} chars frames=${parts.length}`);

// structural probe
const lines = text.split('\n').filter((l) => l.trim());
console.error(`[probe] lines=${lines.length}`);
const typeCount = new Map();
const samples = {};
for (const l of lines) {
  let o;
  try { o = JSON.parse(l); } catch { typeCount.set('<badjson>', (typeCount.get('<badjson>') ?? 0) + 1); continue; }
  const t = o.type ?? '<none>';
  typeCount.set(t, (typeCount.get(t) ?? 0) + 1);
  if (!samples[t]) samples[t] = o;
}
for (const [t, c] of [...typeCount.entries()].sort((a, b) => b[1] - a[1])) console.error(`  ${t}: ${c}`);
for (const t of Object.keys(samples)) {
  const s = JSON.stringify(samples[t]);
  console.log(`=== SAMPLE type=${t} ===`);
  console.log(s.length > 1500 ? s.slice(0, 1500) + ' …<truncated>' : s);
}
