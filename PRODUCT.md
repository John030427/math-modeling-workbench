# Product

## Positioning

AI 学习与竞赛工作台：教「为什么」与建模结构，而不是替代思考。

## Primary persona

参加过 0–2 次数模赛的本科生：知道部分算法名，但拆题/数据/特征/验证薄弱。

## Core loop

学习 → 训练 → 实战 → 评审 → 找差距 → 专项训练 → 再实战

## Module map

1. Model Atlas  
2. Modeling Gym  
3. Competition Workbench  
4. Daily Review  
5. Paper Lab  
6. Modeling Profile  
7. AI Assistant（全站）

## MVP success

现场可稳定跑通 DEMO.md 的 A–D；无 Critical；刷新不丢 demo 用户数据。

## Distribution (Phase 3 — decided)

| Surface | Content |
|---|---|
| `web` profile (3080) | 原版 DSH — 产品不注入 |
| `mathmodel` profile (3100) | 产品专用 DSH profile：dsh-base + dsh-web-app + dsh-mathmodeling + shell-v2 |

```powershell
scripts/mathmodel-profile-install.ps1   # 安装/刷新（幂等）
scripts/mathmodel-profile-start.ps1     # 启动 → http://127.0.0.1:3100
```

Gate: `PRODUCT_UI_GATE_REPORT.md`（G1–G7 PASS）。PRD 细节见 `PRODUCT_PRD.md`。
