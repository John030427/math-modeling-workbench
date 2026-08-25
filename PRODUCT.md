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

## Distribution (Phase 3 — decided, suite composition)

| Surface | Content |
|---|---|
| `web` profile (3080) | 原版 DSH — 产品不注入 |
| `mathmodel` profile (3100) | dsh-base + dsh-web-app + **@math-modeling/mathmodel-suite**（组合 mathmodel-shell + dsh-mathmodeling） |

```powershell
scripts/mathmodel-profile-init.ps1      # 安装/刷新（幂等）
scripts/mathmodel-start.ps1             # 启动 → http://127.0.0.1:3100
scripts/mathmodel-profile-verify.ps1    # 组合校验（--dump-config + 健康探针）
scripts/mathmodel-remove.ps1            # 停止并删除（web 不受影响）
```

Gate: `REVIEW/PRODUCT_UI_REVIEW.md`（PRODUCT_UI_GATE U1–U7 PASS）。PRD 见 `PRODUCT_PRD.md`（v0.3 权威版）。
