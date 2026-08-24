# DEMO

现场演示脚本（可离线）。

## 启动

终端 1：`apps/api` → `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000`  
终端 2：`apps/web` → `npm run dev`  
浏览器：http://127.0.0.1:3000  

可选：首页 **Reset Demo** 恢复种子掌握度。

## Demo A — K-Means（主打）

1. Dashboard →「演示：K-Means 互动课」或 Atlas → K-Means  
2. Step 3 运行动画：下一步 / 自动运行 / 改 K  
3. Step 8 点「为什么要标准化？」看右侧 AI（应提到量纲/欧氏距离）  
4. 追问「那 DBSCAN 呢？」  
5. Step 10 完成至少 1 道 Quiz，观察 mastery 更新  

## Demo B — Gym Coach

1. Modeling Gym（自动 Coach Mode）  
2. 打开「城市末端配送路径」  
3. 逐步点「教练引导」：变量 → 目标 → 约束 → 类型 → 模型  
4. 强调：AI 反问，不直接给完整答案  

## Demo C — Competition

1. Competition Workbench → 创建项目  
2. 上传 `demo/data/customers.csv`（或站点 ` /demo/customers.csv` 先下载）  
3. 观察缺失、量纲警告与 Feature Cards  
4. Model Selector → Baseline / Main / Alternative  
5. Profile 查看低掌握度桥接提示  

## Demo D — Reviewer

1. Paper Lab（已预填弱论文）  
2. 运行 Reviewer  
3. 看总分、验证/特征低分、Gap 训练计划  
4. 转入 Daily Review  

## 演示数据

- `demo/data/customers.csv`  
- `demo/papers/weak_kmeans_paper.md`  
- `demo/gym/cases.json`  
