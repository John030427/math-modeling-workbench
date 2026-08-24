# 数学建模 AI 学习与竞赛工作台

AI-Native Mathematical Modeling Learning & Competition Workbench（DSH 生态友好）。

## 产品是什么

把数学建模的**学习、专项训练、比赛实战、论文评审、能力画像**连成闭环：

```text
Learn → Practice → Solve → Review → Diagnose → Retrain → Learn
```

不是「上传赛题自动吐论文」，也不是算法 Markdown 堆砌。

## 为什么做

目标用户：参加过 0–2 次数模赛、知识碎片化、拿到题不会拆题/预处理/特征/选模/验证/写论文的本科生。

## 核心用户

本科数模参赛者（经验分享现场 Demo 优先）。

## 功能（MVP）

- **Dashboard**：六大板块入口 + 全站 AI Dock
- **Model Atlas**：Task × Family × Algorithm Registry（8+ 模型）
- **K-Means 互动课**：直觉 → 动画 → 公式 → Quiz + Tutor
- **Daily Review**：基于 mastery 的到期/薄弱优先
- **Modeling Gym**：配送题 Coach Mode 结构化引导
- **Competition Workbench**：拆题 / Data Doctor / Feature Cards / Model Selector
- **Paper Lab**：Training Rubric 评审 + Gap → 训练计划
- **Modeling Profile**：维度与模型掌握度桥接

## 架构

```text
apps/web     Next.js 15 + TypeScript
apps/api     FastAPI + SQLite
registry/    YAML Model Registry + quizzes
skills/      Skill contracts
demo/        Demo 数据与弱论文
workspace/   比赛项目产物目录
```

AI：**一个主助手 + Skill 路由**；三档 `coach | copilot | agent`。无 API Key 时自动离线降级，保证演示稳定。

## 安装

```bash
# API
cd apps/api
python -m pip install -r requirements.txt
set PYTHONPATH=.
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Web（新终端）
cd apps/web
npm install
npm run dev
```

打开 http://127.0.0.1:3000  

可选 LLM：设置 `OPENCODE_GO_API_KEY` 或 `OPENAI_API_KEY`（及可选 `OPENAI_BASE_URL`）。

## DSH 集成

- 本机 DSH：`~/.dsh`，默认模型 deepseek-v4-flash
- MVP **独立进程**运行，Skill 合约位于 `skills/`，便于后续打成 DSH bundle
- 不硬编码赛事规则；AI Usage Ledger 已预留

## Demo

见 [DEMO.md](./DEMO.md)。快速路径：

1. Atlas → K-Means → 动画 → 「为什么要标准化？」→ Quiz  
2. Gym → 配送题 → Coach  
3. Competition → 上传 `demo/data/customers.csv` → Data Doctor → Selector  
4. Paper → 评审弱论文 → Gap

## 目录

见仓库树；审查文档在 `REVIEW/`。

## Skills

`skills/01-tutor`、`11-modeling-coach`、`12-data-doctor`、`20-model-selector`、`41-paper-reviewer` 等。

## Model Registry

`registry/models/*.yaml`，机器可读，供 Tutor / Selector 共用。

## Roadmap

见 [ROADMAP.md](./ROADMAP.md)。
