import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
const outMd = process.argv[3];

const lines = readFileSync(src, 'utf8').split('\n').filter((l) => l.trim());

const fmtT = (ms) => {
  const d = new Date(Number(ms));
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

const md = [];
let turn = 0;
let stats = { user: 0, assistantText: 0, toolCalls: 0, goals: 0 };
let firstT = null, lastT = null;

for (const l of lines) {
  let o;
  try { o = JSON.parse(l); } catch { continue; }
  if (o.time) { firstT ??= o.time; lastT = o.time; }
  const t = o.type;
  const d = o.data ?? {};

  if (t === 'session') {
    md.push(`# 会话记录 ${o.id}`, '', `- 工作区：\`${o.cwd}\``, `- 创建：${fmtT(o.createdAt)}`, '');
    continue;
  }
  if (t === 'session/title') { md.push(`- 标题：${d.title}（${d.source?.kind ?? ''}）`, ''); continue; }
  if (t === 'turn/start') {
    turn = d.turn;
    md.push(`\n---\n\n## ▶️ Turn ${turn}\n`);
    continue;
  }

  if (t === 'user/message') {
    const kind = d.source?.kind ?? '?';
    const texts = (Array.isArray(d.content) ? d.content : []).filter((b) => b.type === 'text').map((b) => b.text);
    const txt = texts.join('\n').trim();
    if (!txt) continue;
    if (kind === 'user') {
      stats.user++;
      md.push(`### 👤 用户 · ${fmtT(o.time)}\n`, txt, '');
    } else {
      md.push(`> 📎 [系统注入/${kind}] ${txt.replace(/\n/g, ' ').slice(0, 300)}`, '');
    }
    continue;
  }

  if (t === 'command/run') {
    md.push(`> ⌨️ 斜杠命令：\`/${d.name} ${String(d.args ?? '').trim()}\``, '');
    continue;
  }

  if (t === 'goal/change') {
    stats.goals++;
    const g = d.goal;
    md.push(`### 🎯 Goal ${d.operation.toUpperCase()} · ${fmtT(o.time)}`, '', `- id: \`${g.id}\``, `- phase: ${g.phase}, 上限轮数: ${g.maxGoalRounds}`, '', '**目标**：', '', g.objective, '');
    continue;
  }

  if (t === 'todo/write') {
    const items = (d.todos ?? []).map((x) => `${x.status === 'completed' ? '[x]' : x.status === 'in_progress' ? '[~]' : '[ ]'} ${x.content}`);
    md.push(`<details><summary>📋 Todo 更新</summary>\n\n${items.join('\n')}\n\n</details>`, '');
    continue;
  }

  if (t === 'assistant/message') {
    const blocks = d.message?.content ?? [];
    let out = [];
    for (const b of blocks) {
      if (b.type === 'text' && b.text.trim()) { stats.assistantText++; out.push(b.text.trim()); }
      else if (b.type === 'tool-call') {
        stats.toolCalls++;
        let desc = '';
        try { desc = JSON.parse(b.arguments ?? '{}').description ?? ''; } catch {}
        out.push(`> 🔧 \`${b.name}\`${desc ? ' — ' + desc : ''}`);
      }
      // reasoning blocks skipped
    }
    if (out.length) md.push(out.join('\n\n'), '');
    continue;
  }

  if (t === 'tool/result') {
    try {
      const tr = d.message?.content?.[0];
      if (tr?.isError) {
        const etxt = (tr.content ?? []).filter((x) => x.type === 'text').map((x) => x.text).join(' ').replace(/\s+/g, ' ').slice(0, 260);
        md.push(`> ❌ 工具报错：${etxt}`, '');
      }
    } catch {}
    continue;
  }
}

md.push(`\n---\n`, `## 统计`, '', `- 时间范围：${fmtT(firstT)} → ${fmtT(lastT)}`, `- Turns：${turn}`, `- 用户消息：${stats.user}`, `- 助手文本块：${stats.assistantText}`, `- 工具调用：${stats.toolCalls}`, `- Goal 变更事件：${stats.goals}`, '');

writeFileSync(outMd, md.join('\n'), 'utf8');
