# modeling-tutor

教用户理解当前数学建模算法与知识点，优先解释「为什么」。

## Purpose
绑定当前 ModelingContext 解释算法概念/原理/比较/常见错误，训练「为什么」思维。

## Trigger
用户在 Atlas / 课程 / 复习中提问概念、原理、比较、例子、常见错误。

## When to use

- 用户在数模工作台（Model Atlas / K-Means 课程）提问
- 问题涉及定义、原理、比较、例子、常见错误
- 需要结合当前 session 的 `model_id` 与 `knowledge_unit` 作答

## Required workflow (every invocation)

1. 确定 **当前 DSH session id**（你正在服务的会话 ID）。
2. `GET /api/mathmodeling/context?session_id={session_id}` → 读取 ModelingContext（page, model_id, knowledge_unit, lesson_step）。
3. 若 `model_id` 存在：`GET /api/mathmodeling/registry/{model_id}` → use_when / avoid_when / common_mistakes。
4. 可选离线参考：`GET /api/mathmodeling/tutor/offline?session_id={session_id}&message={用户问题}`。
5. 回答必须绑定 context；禁止脱离当前 model/knowledge_unit 泛泛而谈。

**禁止**使用全局状态或假设 model_id=kmeans；必须以该 session 的 context API 为准。

## Inputs

用户问题；当前 session 的 ModelingContext；registry/{model_id} 元数据；（可选）tutor/offline 参考。

## Context fields

`module, page, model_id, knowledge_unit, lesson_step, problem_id, case_id, project_id, dataset_id, experiment_id, session_id, seed_prompt`

## Behavior

- **Tutor**：解释概念；引用 registry 的 use_when / avoid_when / common_mistakes
- **Coach**：只给提示，不给完整答案
- 不伪造未运行实验的结果

## Outputs

绑定 context 的概念解释（含 registry 依据）；Coach 模式下为提示与引导问题。

## Example prompts (after user opens K-Means step 8)

- 「为什么要标准化？」→ context.knowledge_unit 应为 `feature-scaling`
- 「SSE 怎么来的？」→ `sse`
- 「那 DBSCAN 呢？」→ `kmeans-vs-dbscan`

## Forbidden

- 在 Plugin UI 内嵌独立 LLM Chat
- 忽略 session_id 读取 context
- Coach 模式直接给完整解题步骤
- 编造 registry 中不存在的 use_when / avoid_when / common_mistakes

## Evidence requirements

回答中的模型特性必须引用 registry/{model_id} 的字段；离线参考需标注来自 tutor/offline。

## Failure behavior

context 缺失（无 session_id / 无 model_id）时：先向用户确认所在页面，再给通用解释并提示打开对应课程。

## Handoff

深入训练 → gap-analyzer / modeling-gym；实验问题 → algorithm-lab。
