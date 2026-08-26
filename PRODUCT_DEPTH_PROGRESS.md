# PRODUCT DEPTH PROGRESS

**Plan:** `PRODUCT_DEPTH_REBUILD_PLAN.md` · **Start commit:** `c48be46`

| Stage | 内容 | Commit | 结果 |
|---|---|---|---|
| 1 | czy 上游锁定（pin 33cb0440 精确 checkout + MIT 验证）+ Python JSON bridge runner + 44 方法机器清单 + Node 适配器 + 路由分发（双 provider） | `92e6b46` | 6 算法实机验证 ✓ |
| 2a | Atlas 扩到 54 方法 / 12 任务族（gen-depth-models.mjs，三种 YAML 风格）+ 6 个既有模型链接 czy 执行 | 同上 | registry API 54 ✓ |
| 2b | 11 个参考级深度课程（30秒直觉→场景→数学→流程→参数→适用/避免→baseline→失败→验证→Quiz→论文案例）+ 通用渲染器 + lessons API | `e1ff380` | 实机渲染 ✓ |
| 3 | CUMCM-Archive 归档索引 **5244 条**（34 年，外链策略）+ archive 查询 API + 旗舰 2023 A 国一案例（全 schema + 证据定位 + 反向训练）+ 案例页真题来源卡 | `9d48211` | 实机 ✓ |
| 4 | Literature Research（OpenAlex 真实检索 + 截止日隔离 + 方法族 + 假设生成 + UI）+ Gym 扩到 10 drills/8 类型（含旗舰反向训练 2 个） | 同上 | 实测 8 篇截止日前文献 ✓ |
| 5 | Stage 0 真相审计（PRODUCT_DEPTH_AUDIT.md）+ 反浅层 DEPTH_GATE 脚本 + 技能 API 路径契约 + 第 5 深度案例（MCM 2023 B）+ 上游清单/资源来源文档 | `da8c425` | DEPTH_GATE PASS |
| 6 | CI 修复（core deps）→ Actions 全绿 `32938970719`；全量回归（21 单测 + E2E 18/18 + UI gate + depth gate + web 隔离）；最终报告 | 本 commit | 全绿 |
