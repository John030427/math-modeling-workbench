window.__ModuleLoader__.load({
  id: "@math-modeling/dsh-mathmodeling",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react4 = require("react");

// ../ui/src/KMeansCanvas.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function mulberry32(a) {
  return function() {
    let t = a += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function genPoints(seed, k) {
  const rnd = mulberry32(seed);
  const centers = Array.from({ length: k }, () => ({
    x: 80 + rnd() * 440,
    y: 60 + rnd() * 280
  }));
  const pts = [];
  for (let i = 0; i < 90; i++) {
    const c = centers[i % k];
    pts.push({
      x: c.x + (rnd() - 0.5) * 90,
      y: c.y + (rnd() - 0.5) * 90,
      cluster: -1
    });
  }
  return pts;
}
function KMeansCanvas() {
  const canvasRef = (0, import_react.useRef)(null);
  const [k, setK] = (0, import_react.useState)(3);
  const [seed, setSeed] = (0, import_react.useState)(7);
  const [step, setStep] = (0, import_react.useState)(0);
  const [auto, setAuto] = (0, import_react.useState)(false);
  const points = (0, import_react.useMemo)(() => genPoints(seed, k), [seed, k]);
  const [centroids, setCentroids] = (0, import_react.useState)([]);
  const [assigned, setAssigned] = (0, import_react.useState)([]);
  const [phase, setPhase] = (0, import_react.useState)("init");
  (0, import_react.useEffect)(() => {
    const rnd = mulberry32(seed + 99);
    const cs = Array.from({ length: k }, () => ({
      x: 60 + rnd() * 480,
      y: 40 + rnd() * 320
    }));
    setCentroids(cs);
    setAssigned(points.map((p) => ({ ...p, cluster: -1 })));
    setPhase("init");
    setStep(0);
  }, [k, seed, points]);
  (0, import_react.useEffect)(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgba(128,128,128,0.12)";
    for (let x = 0; x < c.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, c.height);
      ctx.stroke();
    }
    for (let y = 0; y < c.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }
    const colors = ["#c45c26", "#1f7a6c", "#2a5085", "#8a4f2a", "#5b4b8a"];
    assigned.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = p.cluster < 0 ? "rgba(128,128,128,0.45)" : colors[p.cluster % colors.length];
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    centroids.forEach((ct, i) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.moveTo(ct.x - 8, ct.y);
      ctx.lineTo(ct.x + 8, ct.y);
      ctx.moveTo(ct.x, ct.y - 8);
      ctx.lineTo(ct.x, ct.y + 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ct.x, ct.y, 10, 0, Math.PI * 2);
      ctx.stroke();
    });
  }, [assigned, centroids]);
  function assignStep() {
    const next2 = assigned.map((p) => {
      let best = 0;
      let bestD = Infinity;
      centroids.forEach((c, i) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return { ...p, cluster: best };
    });
    setAssigned(next2);
    setPhase("assign");
    setStep((s) => s + 1);
  }
  function updateStep() {
    const next2 = centroids.map((_, i) => {
      const members = assigned.filter((p) => p.cluster === i);
      if (!members.length) return centroids[i];
      return {
        x: members.reduce((a, p) => a + p.x, 0) / members.length,
        y: members.reduce((a, p) => a + p.y, 0) / members.length
      };
    });
    const moved = next2.some((c, i) => Math.hypot(c.x - centroids[i].x, c.y - centroids[i].y) > 0.5);
    setCentroids(next2);
    setPhase(moved ? "update" : "done");
    setStep((s) => s + 1);
  }
  function next() {
    if (phase === "init" || phase === "update") assignStep();
    else if (phase === "assign") updateStep();
  }
  (0, import_react.useEffect)(() => {
    if (!auto || phase === "done") return;
    const t = setTimeout(next, 700);
    return () => clearTimeout(t);
  }, [auto, phase, step]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mm-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, alignItems: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "mm-muted", children: [
        "K=",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "number",
            min: 2,
            max: 5,
            value: k,
            onChange: (e) => setK(Number(e.target.value)),
            style: { marginLeft: 6, width: 48 }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mm-btn ghost", type: "button", onClick: () => setSeed((s) => s + 1), children: "\u968F\u673A\u521D\u59CB\u5316" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mm-btn ghost", type: "button", onClick: next, disabled: phase === "done", children: "\u4E0B\u4E00\u6B65" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mm-btn", type: "button", onClick: () => setAuto((a) => !a), children: auto ? "\u6682\u505C" : "\u81EA\u52A8\u8FD0\u884C" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "mm-chip", children: [
        "step ",
        step,
        " \xB7 ",
        phase
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref: canvasRef, width: 600, height: 400, style: { width: "100%", maxWidth: "100%" } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mm-muted", style: { marginTop: 8 }, children: "\u6D41\u7A0B\uFF1A\u968F\u673A\u521D\u59CB\u4E2D\u5FC3 \u2192 \u5206\u914D\u6700\u8FD1\u7C07 \u2192 \u66F4\u65B0\u4E2D\u5FC3 \u2192 \u91CD\u590D\u81F3\u6536\u655B\u3002\u53C9\u53F7\u4E3A\u8D28\u5FC3\u3002" })
  ] });
}

// ../ui/src/AtlasView.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function AtlasView({
  models,
  onSelectModel
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: "mm-title", children: "\u6A21\u578B\u5730\u56FE" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "mm-muted", children: "\u6309 Registry \u6D4F\u89C8\u7B97\u6CD5\u6A21\u578B\u3002K-Means \u4E3A\u5B8C\u6574\u4E92\u52A8\u8BFE\u7A0B\u793A\u8303\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "mm-grid", style: { marginTop: 16 }, children: models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mm-card", onClick: () => onSelectModel(m.id), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: (m.category?.task || []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "mm-chip", children: t }, t)) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "mm-title", style: { fontSize: "1.1rem" }, children: m.name_zh || m.name }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "mm-muted", children: m.summary }),
      m.id === "kmeans" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "mm-muted", style: { marginTop: 8, color: "var(--mm-accent)" }, children: "\u2605 \u6F14\u793A\u91CD\u70B9\uFF1A\u4E92\u52A8\u8BFE\u7A0B" })
    ] }, m.id)) })
  ] });
}

// ../ui/src/KMeansLesson.tsx
var import_react2 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var STEPS = [
  "30\u79D2\u76F4\u89C9",
  "\u73B0\u5B9E\u6848\u4F8B",
  "\u4EA4\u4E92\u52A8\u753B",
  "\u6570\u5B66\u539F\u7406",
  "\u4EE3\u7801",
  "\u9002\u7528\u6761\u4EF6",
  "\u4E0D\u9002\u7528\u6761\u4EF6",
  "\u5E38\u89C1\u9519\u8BEF",
  "\u6A21\u578B\u6BD4\u8F83",
  "Mini Quiz"
];
function KMeansLesson({
  model,
  api,
  onBack,
  onAskTutor,
  sessionId
}) {
  const [step, setStep] = (0, import_react2.useState)(1);
  const [quizzes, setQuizzes] = (0, import_react2.useState)([]);
  const [selected, setSelected] = (0, import_react2.useState)({});
  const [results, setResults] = (0, import_react2.useState)({});
  (0, import_react2.useEffect)(() => {
    void api.patchContext({
      page: "lesson/kmeans",
      model_id: "kmeans",
      lesson_step: step,
      route: `/mathmodeling/atlas/kmeans`,
      session_id: sessionId
    });
  }, [step, sessionId, api]);
  (0, import_react2.useEffect)(() => {
    api.fetchQuizzes("kmeans").then((r) => setQuizzes(r.questions)).catch(() => setQuizzes([]));
  }, [api]);
  function goStep(n) {
    setStep(n);
    void api.patchContext({
      page: "lesson/kmeans",
      model_id: "kmeans",
      lesson_step: n,
      session_id: sessionId
    });
  }
  function ask(seedPrompt, knowledgeUnit) {
    void api.patchContext({
      page: "lesson/kmeans",
      model_id: "kmeans",
      knowledge_unit: knowledgeUnit ?? null,
      lesson_step: step,
      seed_prompt: seedPrompt,
      session_id: sessionId
    });
    onAskTutor({ seedPrompt, knowledgeUnit, lessonStep: step });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "mm-btn ghost", onClick: onBack, children: "\u2190 \u6A21\u578B\u5730\u56FE" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "mm-title", style: { marginTop: 12 }, children: model.name_zh || model.name }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "mm-muted", children: model.summary }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "mm-steps", children: STEPS.map((label, i) => {
      const n = i + 1;
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "button",
        {
          type: "button",
          className: `mm-chip ${step === n ? "active" : ""}`,
          style: { cursor: "pointer", border: "none" },
          onClick: () => goStep(n),
          children: [
            n,
            ". ",
            label
          ]
        },
        n
      );
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "mm-panel", children: [
      step === 1 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "30 \u79D2\u76F4\u89C9" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { marginTop: 12, lineHeight: 1.6 }, children: "\u5B83\u89E3\u51B3\u4EC0\u4E48\u95EE\u9898\uFF1F\u628A\u300C\u76F8\u4F3C\u300D\u7684\u6837\u672C\u5206\u5230\u540C\u4E00\u7EC4\uFF0C\u4F7F\u7EC4\u5185\u66F4\u7D27\u3001\u7EC4\u95F4\u66F4\u5206\u79BB\u2014\u2014\u7528\u5230\u7C07\u4E2D\u5FC3\u7684\u8DDD\u79BB\u6765\u8861\u91CF\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "mm-btn", type: "button", style: { marginTop: 12 }, onClick: () => ask("\u5B83\u5230\u5E95\u89E3\u51B3\u4EC0\u4E48\u95EE\u9898\uFF1F\u518D\u7B80\u5355\u4E00\u70B9\u3002"), children: "\u95EE Tutor\uFF1A\u518D\u7B80\u5355\u4E00\u70B9" })
      ] }),
      step === 2 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u73B0\u5B9E\u6848\u4F8B" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { marginTop: 12 }, children: "\u96F6\u552E\u5BA2\u6237\u5206\u7FA4\u3001\u4F01\u4E1A\u4FE1\u7528\u5206\u5C42\u3001\u95EE\u5377\u53D7\u8BBF\u8005\u753B\u50CF\u3002\u5148\u95EE\uFF1A\u5206\u7FA4\u540E\u8FD0\u8425\u52A8\u4F5C\u662F\u4EC0\u4E48\uFF1F\u5426\u5219 K \u53EA\u662F\u6570\u5B57\u6E38\u620F\u3002" })
      ] }),
      step === 3 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u4EA4\u4E92\u52A8\u753B" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "mm-muted", children: "\u968F\u673A\u4E2D\u5FC3 \u2192 \u5206\u914D \u2192 \u66F4\u65B0 \u2192 \u6536\u655B\u3002\u53EF\u6539 K\u3001\u81EA\u52A8\u8FD0\u884C\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(KMeansCanvas, {})
      ] }),
      step === 4 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u6570\u5B66\u539F\u7406" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("ul", { style: { marginTop: 12, lineHeight: 1.6, fontSize: "0.875rem" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: "\u8DDD\u79BB\uFF1A\u5E38\u7528\u6B27\u6C0F\u8DDD\u79BB \u2016x \u2212 c\u2016" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: "\u8D28\u5FC3\uFF1A\u7C07\u5185\u6837\u672C\u5747\u503C" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: "\u76EE\u6807\uFF1A\u6700\u5C0F\u5316 SSE = \u03A3 \u2016xi \u2212 c_zi\u2016\xB2" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: "\u8FED\u4EE3\u81F3\u5206\u914D\u4E0D\u518D\u53D8\u5316\u6216\u4F4D\u79FB\u5F88\u5C0F" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "mm-btn ghost", type: "button", style: { marginTop: 12 }, onClick: () => ask("SSE \u662F\u600E\u4E48\u6765\u7684\uFF1F", "sse"), children: "\u95EE Tutor\uFF1ASSE \u600E\u4E48\u6765\u7684\uFF1F" })
      ] }),
      step === 5 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u4EE3\u7801" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { className: "mm-code", children: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(raw_features)
km = KMeans(n_clusters=3, n_init=10, random_state=0)
labels = km.fit_predict(X)` })
      ] }),
      step === 6 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u4EC0\u4E48\u65F6\u5019\u9002\u5408" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { style: { marginTop: 12, paddingLeft: 20 }, children: (model.use_when || []).map((x) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: x }, x)) })
      ] }),
      step === 7 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u4EC0\u4E48\u65F6\u5019\u4E0D\u9002\u5408" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { style: { marginTop: 12, paddingLeft: 20 }, children: (model.avoid_when || []).map((x) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: x }, x)) })
      ] }),
      step === 8 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u5E38\u89C1\u9519\u8BEF" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { style: { marginTop: 12, paddingLeft: 20 }, children: (model.common_mistakes || []).map((x) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: x }, x)) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "mm-btn", type: "button", style: { marginTop: 12 }, onClick: () => ask("\u4E3A\u4EC0\u4E48\u8981\u6807\u51C6\u5316\uFF1F", "feature-scaling"), children: "\u95EE Tutor\uFF1A\u4E3A\u4EC0\u4E48\u8981\u6807\u51C6\u5316\uFF1F" })
      ] }),
      step === 9 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "\u6A21\u578B\u6BD4\u8F83" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { marginTop: 12 }, children: [
          "\u5907\u9009\uFF1A",
          (model.alternatives || []).join(", ") || "\u2014"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "mm-btn ghost", type: "button", style: { marginTop: 12 }, onClick: () => ask("\u90A3 DBSCAN \u5462\uFF1F", "kmeans-vs-dbscan"), children: "\u95EE Tutor\uFF1A\u90A3 DBSCAN \u5462\uFF1F" })
      ] }),
      step === 10 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "mm-title", children: "Mini Quiz" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "mm-muted", children: "\u63D0\u4EA4\u540E\u66F4\u65B0 knowledge-unit mastery \u5E76\u6301\u4E45\u5316\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { marginTop: 16 }, children: [
          quizzes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { borderTop: "1px solid var(--mm-line)", paddingTop: 16, marginTop: 16 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "mm-chip", children: [
              "L",
              q.level,
              " \xB7 ",
              q.knowledge_unit
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontWeight: 500, marginTop: 8 }, children: q.prompt }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginTop: 8, display: "grid", gap: 6 }, children: Object.entries(q.options).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { style: { display: "flex", gap: 8, fontSize: "0.875rem", cursor: "pointer" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "input",
                {
                  type: "radio",
                  name: q.id,
                  checked: selected[q.id] === k,
                  onChange: () => setSelected((s) => ({ ...s, [q.id]: k }))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("b", { children: [
                  k,
                  "."
                ] }),
                " ",
                v
              ] })
            ] }, k)) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                className: "mm-btn ghost",
                type: "button",
                style: { marginTop: 8 },
                disabled: !selected[q.id],
                onClick: async () => {
                  const r = await api.submitQuiz({
                    quiz_id: `kmeans:${q.id}`,
                    selected: selected[q.id],
                    item_type: "ku",
                    item_id: q.knowledge_unit,
                    session_id: sessionId
                  });
                  setResults((old) => ({ ...old, [q.id]: r }));
                },
                children: "\u63D0\u4EA4"
              }
            ),
            results[q.id] && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
              "p",
              {
                className: "mm-muted",
                style: {
                  marginTop: 8,
                  color: results[q.id].correct ? "var(--mm-accent-2)" : "var(--mm-accent)"
                },
                children: [
                  results[q.id].correct ? "\u6B63\u786E" : `\u4E0D\u5BF9\u3002\u7B54\u6848 ${results[q.id].answer}`,
                  " \u2014 ",
                  results[q.id].explanation,
                  " \xB7 mastery ",
                  results[q.id].mastery.toFixed(1)
                ]
              }
            )
          ] }, q.id)),
          !quizzes.length && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "mm-muted", children: "\u9898\u5E93\u52A0\u8F7D\u4E2D\u2026" })
        ] })
      ] })
    ] })
  ] });
}

// ../ui/src/ModelingWorkbench.tsx
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var NAV = [
  { id: "dashboard", label: "Dashboard", phase: "P1" },
  { id: "atlas", label: "\u6A21\u578B\u5730\u56FE", phase: "P1" },
  { id: "lesson", label: "K-Means \u8BFE\u7A0B", phase: "P1" },
  { id: "gym", label: "\u4E13\u9879\u8BAD\u7EC3", phase: "P2+" },
  { id: "competition", label: "\u6BD4\u8D5B\u5DE5\u4F5C\u53F0", phase: "P6" },
  { id: "problem-library", label: "\u9898\u5E93/\u771F\u9898", phase: "P4" },
  { id: "case-library", label: "\u4F18\u79C0\u6848\u4F8B", phase: "P5" },
  { id: "paper-reviewer", label: "\u8BBA\u6587\u8BC4\u5BA1", phase: "P7" },
  { id: "profile", label: "\u80FD\u529B\u753B\u50CF", phase: "P8" }
];
function Placeholder({ title, phase }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mm-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "mm-title", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "mm-muted", children: [
      "\u8FC1\u79FB\u81F3 conversation.view \u5185\u5BFC\u822A \xB7 ",
      phase
    ] })
  ] });
}
function ModelingWorkbench({
  api,
  sessionId,
  onAskTutor,
  initialSection = "atlas"
}) {
  const [section, setSection] = (0, import_react3.useState)(initialSection);
  const [models, setModels] = (0, import_react3.useState)([]);
  const [lessonModel, setLessonModel] = (0, import_react3.useState)(null);
  const [loading, setLoading] = (0, import_react3.useState)(true);
  (0, import_react3.useEffect)(() => {
    api.fetchRegistry().then((r) => setModels(r.models)).catch(() => setModels([])).finally(() => setLoading(false));
  }, [api]);
  (0, import_react3.useEffect)(() => {
    const pageMap = {
      dashboard: "dashboard",
      atlas: "atlas",
      lesson: "lesson/kmeans",
      gym: "gym",
      competition: "competition",
      "problem-library": "problem-library",
      "case-library": "case-library",
      "paper-reviewer": "paper-reviewer",
      profile: "profile"
    };
    void api.patchContext({
      page: pageMap[section] ?? section,
      model_id: section === "lesson" ? "kmeans" : null,
      lesson_step: section === "lesson" ? 1 : null,
      route: `/mathmodeling/${section}`,
      session_id: sessionId
    });
  }, [section, sessionId, api]);
  async function openModel(id) {
    if (id === "kmeans") {
      const m = await api.fetchModel(id);
      setLessonModel(m);
      setSection("lesson");
    } else {
      void api.patchContext({ page: "atlas", model_id: id, session_id: sessionId });
    }
  }
  if (loading) return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "mm-muted", children: "\u52A0\u8F7D\u4E2D\u2026" });
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mm-root", style: { padding: "16px 20px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "mm-muted", style: { marginBottom: 12 }, children: [
      "\u4F1A\u8BDD\u5185\u5DE5\u4F5C\u53F0 \xB7 Tutor \u8BF7\u7528\u4E0B\u65B9 DSH \u5BF9\u8BDD + ",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: "/modeling-tutor" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("nav", { className: "mm-steps", style: { marginBottom: 16 }, children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "button",
      {
        type: "button",
        className: `mm-chip ${section === item.id ? "active" : ""}`,
        style: { cursor: "pointer", border: "none" },
        onClick: () => {
          setSection(item.id);
          if (item.id !== "lesson") setLessonModel(null);
        },
        children: item.label
      },
      item.id
    )) }),
    section === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { className: "mm-title", children: "\u6570\u6A21\u5DE5\u4F5C\u53F0" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "mm-muted", children: "\u901A\u8FC7\u4F1A\u8BDD\u6807\u7B7E\u300C\u6570\u6A21\u5DE5\u4F5C\u53F0\u300D\u8BBF\u95EE\uFF08\u975E\u5168\u5C40\u9875\u9762\uFF09\u3002\u4E0E\u300C\u5BF9\u8BDD\u300D\u300C\u8F68\u8FF9\u300D\u5E76\u5217\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "mm-grid", style: { marginTop: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mm-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "mm-title", children: "\u6A21\u578B\u5730\u56FE" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "mm-muted", children: [
          models.length,
          " \u4E2A\u6A21\u578B"
        ] })
      ] }) })
    ] }),
    section === "atlas" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AtlasView, { models, onSelectModel: (id) => void openModel(id) }),
    section === "lesson" && lessonModel && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      KMeansLesson,
      {
        model: lessonModel,
        api,
        sessionId,
        onBack: () => {
          setSection("atlas");
          setLessonModel(null);
        },
        onAskTutor
      }
    ),
    section === "lesson" && !lessonModel && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "mm-muted", children: "\u8BF7\u4ECE\u6A21\u578B\u5730\u56FE\u6253\u5F00 K-Means \u8BFE\u7A0B\u3002" }),
    section === "gym" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { title: "\u4E13\u9879\u8BAD\u7EC3 (Gym)", phase: "P2+" }),
    section === "competition" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { title: "\u6BD4\u8D5B\u5DE5\u4F5C\u53F0", phase: "P6" }),
    section === "problem-library" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { title: "\u9898\u5E93/\u771F\u9898", phase: "P4" }),
    section === "case-library" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { title: "\u4F18\u79C0\u6848\u4F8B", phase: "P5" }),
    section === "paper-reviewer" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { title: "\u8BBA\u6587\u8BC4\u5BA1", phase: "P7" }),
    section === "profile" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { title: "\u80FD\u529B\u753B\u50CF", phase: "P8" })
  ] });
}

// src/client/index.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var API = "/api/mathmodeling";
var STYLE_ID = "dsh-mathmodeling-ui-styles";
var OVERLAY_EVENT = "dsh-mathmodeling:overlay";
function ensureUiStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement("link");
  link.id = STYLE_ID;
  link.rel = "stylesheet";
  link.href = "/api/mathmodeling/assets/ui.css";
  document.head.appendChild(link);
}
function createApi(sessionId) {
  return {
    fetchRegistry: async () => {
      const res = await fetch(`${API}/registry`);
      const data = await res.json();
      return { models: data.models ?? [] };
    },
    fetchModel: async (id) => {
      const res = await fetch(`${API}/registry/${id}`);
      const data = await res.json();
      return data.model;
    },
    fetchQuizzes: async (modelId) => {
      const res = await fetch(`${API}/quizzes/${modelId}`);
      const data = await res.json();
      return { questions: data.questions ?? [] };
    },
    submitQuiz: async (body) => {
      const res = await fetch(`${API}/quiz/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, session_id: sessionId, user_id: "demo" })
      });
      const data = await res.json();
      return {
        correct: data.correct,
        explanation: data.explanation,
        mastery: data.mastery,
        answer: data.answer
      };
    },
    patchContext: async (patch) => {
      await fetch(`${API}/context`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...patch, session_id: sessionId })
      });
    }
  };
}
function MathModelingView({ sessionId, setDraft }) {
  (0, import_react4.useEffect)(() => {
    ensureUiStyles();
  }, []);
  const api = createApi(sessionId);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    ModelingWorkbench,
    {
      sessionId,
      api,
      onAskTutor: ({ seedPrompt }) => {
        const text = `/modeling-tutor ${seedPrompt}`;
        if (setDraft) setDraft(text);
      }
    }
  );
}
function OverlayFallback({
  sessionId,
  open,
  onClose,
  setDraft
}) {
  (0, import_react4.useEffect)(() => {
    if (open) ensureUiStyles();
  }, [open]);
  if (!open) return null;
  const api = createApi(sessionId);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 99990,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.35)",
        pointerEvents: "auto"
      },
      onClick: onClose,
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "div",
        {
          style: {
            width: "min(920px, 96vw)",
            height: "100%",
            background: "var(--dsh-bg, #1a1a1a)",
            color: "inherit",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.35)"
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { padding: "12px 16px", borderBottom: "1px solid rgba(128,128,128,0.25)" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("strong", { children: "\u6570\u6A21\u5DE5\u4F5C\u53F0" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { marginLeft: 12, fontSize: 12, opacity: 0.7 }, children: "Fallback overlay \u2014 \u4F18\u5148\u4F7F\u7528\u4F1A\u8BDD\u6807\u7B7E\u300C\u6570\u6A21\u5DE5\u4F5C\u53F0\u300D" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "mm-btn ghost", style: { float: "right" }, onClick: onClose, children: "\u5173\u95ED" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              ModelingWorkbench,
              {
                sessionId,
                api,
                onAskTutor: ({ seedPrompt }) => {
                  const text = `/modeling-tutor ${seedPrompt}`;
                  if (setDraft) setDraft(text);
                }
              }
            )
          ]
        }
      )
    }
  );
}
var overlaySessionId = "overlay-fallback";
function OverlayHost({ setDraft }) {
  const [open, setOpen] = (0, import_react4.useState)(false);
  (0, import_react4.useEffect)(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener(OVERLAY_EVENT, onOpen);
    return () => document.removeEventListener(OVERLAY_EVENT, onOpen);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    OverlayFallback,
    {
      sessionId: overlaySessionId,
      open,
      onClose: () => setOpen(false),
      setDraft
    }
  );
}
function MathModelingFooter({
  wide,
  setView,
  openOverlay
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "button",
    {
      type: "button",
      title: "\u6570\u6A21\u5DE5\u4F5C\u53F0\uFF08\u4F1A\u8BDD\u6807\u7B7E\uFF09",
      onClick: () => {
        if (setView) setView("mathmodeling");
        else openOverlay?.();
      },
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: wide ? "flex-start" : "center",
        gap: 6,
        width: "100%",
        border: 0,
        background: "transparent",
        color: "inherit",
        cursor: "pointer",
        padding: "8px 10px"
      },
      children: wide ? "\u{1F4D0} \u6570\u6A21\u5DE5\u4F5C\u53F0" : "\u{1F4D0}"
    }
  );
}
function getSessionHelpers(ctx, sessionId) {
  if (!sessionId) return {};
  const binding = ctx.sessions.binding(sessionId);
  const session = binding?.session;
  return {
    sessionId,
    setDraft: (text) => {
      try {
        const store = session?.getSnapshot?.();
        if (store?.inputActions?.setDraft) store.inputActions.setDraft(text);
      } catch {
      }
    },
    setView: (viewId) => {
      try {
        const store = session?.getSnapshot?.();
        if (store?.actions?.setView) store.actions.setView(viewId);
      } catch {
      }
    }
  };
}
var inject = ["slots", "sessions"];
function apply(ctx) {
  ctx.slots.inject(
    "conversation.view",
    () => ctx.slots.register(
      {
        name: "conversation.view",
        id: "mathmodeling",
        order: 50,
        label: () => "\u6570\u6A21\u5DE5\u4F5C\u53F0",
        inject: (sessionId) => getSessionHelpers(ctx, sessionId)
      },
      MathModelingView
    )
  );
  ctx.slots.inject(
    "mathmodel.workbench",
    () => ctx.slots.register(
      {
        name: "mathmodel.workbench",
        id: "mathmodeling",
        order: 50,
        inject: (sessionId) => getSessionHelpers(ctx, sessionId)
      },
      MathModelingView
    )
  );
  ctx.slots.inject("shell.overlay", () => {
    const unregister = ctx.slots.register(
      {
        name: "shell.overlay",
        id: "dsh-mathmodeling-overlay",
        order: 100,
        inject: () => getSessionHelpers(ctx, overlaySessionId)
      },
      OverlayHost
    );
    const onOverlay = () => {
      const current = ctx.sessions.list.getSnapshot?.()?.current;
      if (current) overlaySessionId = current;
      document.dispatchEvent(new CustomEvent(OVERLAY_EVENT));
    };
    document.addEventListener("dsh-mathmodeling:request-overlay", onOverlay);
    return () => {
      document.removeEventListener("dsh-mathmodeling:request-overlay", onOverlay);
      unregister();
    };
  });
  ctx.slots.inject(
    "sidebar.footer.action",
    () => ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: "dsh-mathmodeling",
        order: 100,
        inject: () => {
          const current = ctx.sessions.list.getSnapshot?.()?.current;
          const helpers = current ? getSessionHelpers(ctx, current) : {};
          return {
            setView: helpers.setView,
            openOverlay: () => document.dispatchEvent(new CustomEvent("dsh-mathmodeling:request-overlay"))
          };
        }
      },
      MathModelingFooter
    )
  );
}

    return module.exports;
  }
});
