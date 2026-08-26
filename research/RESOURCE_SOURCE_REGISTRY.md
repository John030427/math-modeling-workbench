# Resource Source Registry — 来源与层级策略

**Policy:** 只索引/外链，不批量转载版权内容（Tier C/D 策略，见 PRODUCT_DEPTH_REBUILD_PLAN.md §9）。

## Tier C — GitHub 归档索引（已接入）

| Source | 内容 | 记录数 | 接入方式 |
|---|---|---|---|
| `yushugulao/CUMCM-Archive` | 1992–2025 历年赛题 + 优秀论文（PDF） | **5244**（1793 赛题 + 3451 优秀论文） | `scripts/gen-cumcm-archive.mjs` 解析 manifest.csv → `registry/resources/cumcm-archive.json`；查询 API `GET /api/mathmodeling/resources/archive?year=&problem=&kind=&q=&page=` |
| `zhanwen/MathModel` | 历年获奖名单目录 / 模板 / 官方文件 | 目录级外链 | 案例与题库的「获奖论文发现」入口（GitHub API 验证存在的路径） |
| `chengziyue1222/math-model-agent` | benchmark 题组元数据 | 1 条 + 算法库 | 见 ALGORITHM_UPSTREAM_INVENTORY.md |

## Tier A/B — 官方与人工精选

| Source | 用途 |
|---|---|
| mcm.edu.cn（CUMCM 官方） | 赛题发布入口（外链） |
| comap.com（MCM/ICM 官方） | 国际赛入口（外链） |
| `registry/resources/resources.json` | 人工精选 10 条（含 3 条与深度案例互链的真题） |

## Tier D — 网盘补充（预留）

字段已预留（availability / license_note / extraction code），暂无已验证的网盘条目——接入时必须标注「网盘补充 · 非本产品托管」。

## 刷新

```powershell
Invoke-WebRequest https://raw.githubusercontent.com/yushugulao/CUMCM-Archive/main/manifest.csv -OutFile $env:TEMP\cumcm-manifest.csv
node scripts/gen-cumcm-archive.mjs $env:TEMP\cumcm-manifest.csv
```
