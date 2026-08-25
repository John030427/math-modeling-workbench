window.__ModuleLoader__.load({
  id: "@math-modeling/mathmodel-shell",
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
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var API = "/api/mathmodeling";
var NAV_KEY = "mm-shell.section";
if (typeof window !== "undefined") {
  ;
  window.__MM_SHELL_HOST__ = true;
  document.documentElement.dataset.mmShellHost = "1";
}
var NAV = [
  { group: "\u6982\u89C8", items: [{ id: "dashboard", label: "Dashboard", icon: "\u{1F3E0}" }] },
  {
    group: "\u5B66\u4E60",
    items: [
      { id: "atlas", label: "\u6A21\u578B\u5730\u56FE", icon: "\u{1F5FA}\uFE0F" },
      { id: "review", label: "\u4ECA\u65E5\u590D\u4E60", icon: "\u{1F501}" }
    ]
  },
  { group: "\u8BAD\u7EC3", items: [{ id: "gym", label: "\u4E13\u9879\u8BAD\u7EC3", icon: "\u{1F3CB}\uFE0F" }] },
  {
    group: "\u7ADE\u8D5B",
    items: [
      { id: "competition", label: "\u6BD4\u8D5B\u5DE5\u4F5C\u53F0", icon: "\u{1F3C6}" },
      { id: "problems", label: "\u9898\u5E93 / \u771F\u9898", icon: "\u{1F4DD}" },
      { id: "cases", label: "\u4F18\u79C0\u6848\u4F8B", icon: "\u{1F4DA}" },
      { id: "lab", label: "Algorithm Lab", icon: "\u{1F9EE}" }
    ]
  },
  {
    group: "\u8BBA\u6587",
    items: [
      { id: "paper", label: "Paper Lab", icon: "\u270D\uFE0F" },
      { id: "reviewer", label: "\u8BBA\u6587\u8BC4\u5BA1", icon: "\u{1F50D}" }
    ]
  },
  { group: "\u4E2A\u4EBA", items: [{ id: "profile", label: "\u80FD\u529B\u753B\u50CF", icon: "\u{1F464}" }] }
];
var ALL_ITEMS = NAV.flatMap((g) => g.items);
var SECTION_META = {
  dashboard: { title: "Dashboard", sub: "\u4ECA\u5929\u6700\u503C\u5F97\u7EE7\u7EED\u4EC0\u4E48\uFF1F" },
  atlas: { title: "\u6A21\u578B\u5730\u56FE", sub: "Task \xD7 Family \xD7 Algorithm \xB7 \u641C\u7D22\u4E0E\u638C\u63E1\u5EA6" },
  lesson: { title: "\u8BFE\u7A0B", sub: "\u53C2\u8003\u8BFE\uFF1AK-Means \xB7 \u4EA4\u4E92 Demo \xB7 Quiz \xB7 \u638C\u63E1\u5EA6" },
  review: { title: "\u4ECA\u65E5\u590D\u4E60", sub: "\u8584\u5F31\u77E5\u8BC6\u5355\u5143\u9A71\u52A8" },
  gym: { title: "\u4E13\u9879\u8BAD\u7EC3 Modeling Gym", sub: "\u62C6\u9898 \u2192 \u63D0\u6848 \u2192 \u53CD\u9988" },
  competition: { title: "\u6BD4\u8D5B\u5DE5\u4F5C\u53F0", sub: "\u8BFB\u9898 \u2192 \u62C6\u89E3 \u2192 Data Doctor \u2192 \u9009\u578B \u2192 \u9A8C\u8BC1" },
  problems: { title: "\u9898\u5E93 / \u771F\u9898", sub: "\u6309\u8D5B\u9898\u7C7B\u578B\u7EC4\u7EC7" },
  cases: { title: "\u4F18\u79C0\u6848\u4F8B", sub: "\u83B7\u5956\u8BBA\u6587\u7684\u7ED3\u6784\u5316\u84B8\u998F" },
  lab: { title: "Algorithm Lab", sub: "\u5B9E\u9A8C\u8BB0\u5F55\uFF1A\u53C2\u6570 \xB7 \u79CD\u5B50 \xB7 \u6307\u6807 \xB7 \u4EA7\u7269" },
  paper: { title: "Paper Lab", sub: "\u8BBA\u6587\u5199\u4F5C\u4E0E\u6A21\u677F" },
  reviewer: { title: "\u8BBA\u6587\u8BC4\u5BA1", sub: "\u8BAD\u7EC3\u7528\u8BC4\u5206 Rubric \xB7 \u5DEE\u8DDD\u5206\u6790" },
  profile: { title: "\u80FD\u529B\u753B\u50CF", sub: "\u7EF4\u5EA6\u638C\u63E1\u5EA6\u4E0E\u8BAD\u7EC3\u5EFA\u8BAE" }
};
function loadSection() {
  try {
    const v = sessionStorage.getItem(NAV_KEY);
    if (v && ALL_ITEMS.some((n) => n.id === v)) return v;
  } catch {
  }
  return "dashboard";
}
function parseRgb(color) {
  const m = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const hex = color.replace("#", "");
  if (hex.length >= 6)
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  return [255, 255, 255];
}
var lum = ([r, g, b]) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
var rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;
function derivePalette() {
  const cs = getComputedStyle(document.body);
  const bg = cs.backgroundColor || "rgb(255,255,255)";
  const fg = cs.color || "rgb(15,17,21)";
  const bgC = parseRgb(bg);
  const fgC = parseRgb(fg);
  const light = lum(bgC) > 0.5;
  return {
    bg,
    fg,
    border: rgba(fgC, light ? 0.14 : 0.16),
    subtle: rgba(fgC, light ? 0.05 : 0.06),
    cardBg: light ? "rgba(255,255,255,0.85)" : rgba(fgC, 0.05),
    muted: rgba(fgC, 0.58),
    accent: light ? "#3f66f0" : "#7c9cff",
    accentSoft: rgba(light ? [63, 102, 240] : [124, 156, 255], 0.14)
  };
}
function useThemePalette() {
  const [pal, setPal] = (0, import_react.useState)(derivePalette);
  (0, import_react.useEffect)(() => {
    const obs = new MutationObserver(() => setPal(derivePalette()));
    obs.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    return () => obs.disconnect();
  }, []);
  return pal;
}
var TASK_GROUPS = [
  { task: "\u805A\u7C7B", match: /kmeans|dbscan|hierarchical/i },
  { task: "\u9884\u6D4B / \u65F6\u5E8F", match: /arima|forecast|time.?series/i },
  { task: "\u8BC4\u4EF7 / \u51B3\u7B56", match: /ahp|topsis|entropy/i },
  { task: "\u4F18\u5316", match: /\blp\b|milp|pso|optim/i },
  { task: "\u673A\u5668\u5B66\u4E60", match: /regression|forest|xgboost|boost/i }
];
function taskOf(id) {
  for (const g of TASK_GROUPS) if (g.match.test(id)) return g.task;
  return "\u5176\u4ED6";
}
var DIFF_COLOR = {
  beginner: "#2e9e5b",
  intermediate: "#c77c1d",
  advanced: "#cc4b4b"
};
function useRegistry() {
  const [models, setModels] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let alive = true;
    fetch(`${API}/registry`).then((r) => r.json()).then((d) => alive && setModels(d.models ?? [])).catch((e) => alive && setError(String(e)));
    return () => {
      alive = false;
    };
  }, []);
  return { models, error };
}
function Dashboard({
  pal,
  onNavigate
}) {
  const S = styles(pal);
  const primary = [
    { title: "\u7EE7\u7EED\u5B66\u4E60", desc: "K-Means \u53C2\u8003\u8BFE \xB7 feature-scaling", target: "lesson", cta: "\u8FDB\u5165\u8BFE\u7A0B" },
    { title: "\u4ECA\u65E5\u590D\u4E60", desc: "\u8584\u5F31\u77E5\u8BC6\u5355\u5143 \xB7 \u5230\u671F\u961F\u5217", target: "review", cta: "\u5F00\u59CB\u590D\u4E60" },
    { title: "\u7EE7\u7EED\u6BD4\u8D5B\u9879\u76EE", desc: "\u6682\u65E0\u8FDB\u884C\u4E2D\u9879\u76EE", target: "competition", cta: "\u67E5\u770B\u5DE5\u4F5C\u53F0" }
  ];
  const modules = [
    { title: "\u6A21\u578B\u5730\u56FE", desc: "Task \xD7 Family \xD7 Algorithm", target: "atlas", icon: "\u{1F5FA}\uFE0F" },
    { title: "\u4E13\u9879\u8BAD\u7EC3", desc: "Modeling Gym \u62C6\u9898\u8BAD\u7EC3", target: "gym", icon: "\u{1F3CB}\uFE0F" },
    { title: "\u6BD4\u8D5B\u5DE5\u4F5C\u53F0", desc: "Data Doctor \xB7 \u9009\u578B \xB7 \u9A8C\u8BC1", target: "competition", icon: "\u{1F3C6}" },
    { title: "\u9898\u5E93 / \u771F\u9898", desc: "\u6309\u8D5B\u9898\u7C7B\u578B\u7EC4\u7EC7", target: "problems", icon: "\u{1F4DD}" },
    { title: "\u4F18\u79C0\u6848\u4F8B", desc: "\u83B7\u5956\u8BBA\u6587\u7ED3\u6784\u5316\u84B8\u998F", target: "cases", icon: "\u{1F4DA}" },
    { title: "\u8BBA\u6587\u8BC4\u5BA1", desc: "Rubric \u8BC4\u5206 \xB7 \u5DEE\u8DDD\u5206\u6790", target: "reviewer", icon: "\u{1F50D}" }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "22px 26px", overflow: "auto", height: "100%" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { style: { fontSize: 18, margin: "0 0 4px" }, children: "\u4ECA\u5929\u6700\u503C\u5F97\u7EE7\u7EED\u4EC0\u4E48\uFF1F" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12.5, color: pal.muted, margin: "0 0 18px" }, children: "\u5B66\u4E60 \u2192 \u8BAD\u7EC3 \u2192 \u5B9E\u6218 \u2192 \u8BC4\u5BA1 \u2192 \u8BCA\u65AD \u2192 \u518D\u8BAD\u7EC3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }, children: primary.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        style: { ...S.card, padding: "16px 18px", borderColor: rgba(parseRgb(pal.accent.startsWith("#") ? pal.accent : "#3f66f0"), 0.35), cursor: "pointer" },
        onClick: () => onNavigate(c.target),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700 }, children: c.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted, marginTop: 5 }, children: c.desc }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.accent, marginTop: 10, fontWeight: 600 }, children: [
            c.cta,
            " \u2192"
          ] })
        ]
      },
      c.title
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginTop: 24, marginBottom: 10 }, children: "\u6A21\u5757\u5165\u53E3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }, children: modules.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { ...S.card, padding: "12px 14px", cursor: "pointer" }, onClick: () => onNavigate(m.target), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 18 }, children: m.icon }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 600, marginTop: 6 }, children: m.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 3 }, children: m.desc })
    ] }, m.title)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        style: { ...S.card, marginTop: 20, padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" },
        onClick: () => onNavigate("profile"),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700 }, children: "\u5F53\u524D\u8584\u5F31\u9879" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted, marginTop: 3 }, children: "\u5B8C\u6210 Quiz \u4E0E\u8BC4\u5BA1\u540E\uFF0C\u8FD9\u91CC\u4F1A\u7ED9\u51FA\u6700\u503C\u5F97\u8BAD\u7EC3\u7684\u77E5\u8BC6\u5355\u5143" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.accent, fontWeight: 600 }, children: "\u80FD\u529B\u753B\u50CF \u2192" })
        ]
      }
    )
  ] });
}
function Atlas({
  pal,
  onSelect
}) {
  const S = styles(pal);
  const { models, error } = useRegistry();
  const [query, setQuery] = (0, import_react.useState)("");
  const grouped = (0, import_react.useMemo)(() => {
    if (!models) return [];
    const q = query.trim().toLowerCase();
    const filtered = models.filter(
      (m) => !q || m.id.toLowerCase().includes(q) || (m.name ?? "").toLowerCase().includes(q) || (m.name_zh ?? "").includes(q)
    );
    const byTask = /* @__PURE__ */ new Map();
    for (const m of filtered) {
      const t = taskOf(m.id);
      if (!byTask.has(t)) byTask.set(t, []);
      byTask.get(t).push(m);
    }
    return [...byTask.entries()];
  }, [models, query]);
  if (error)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 24, fontSize: 13, color: pal.muted }, children: [
      "\u6CE8\u518C\u8868\u52A0\u8F7D\u5931\u8D25\uFF1A",
      error
    ] });
  if (!models) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24, fontSize: 13, color: pal.muted }, children: "\u52A0\u8F7D\u6CE8\u518C\u8868\u2026" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: "\u641C\u7D22\u7B97\u6CD5\uFF08\u5982 kmeans / \u805A\u7C7B / TOPSIS\uFF09",
        style: {
          width: "min(420px, 100%)",
          padding: "8px 12px",
          fontSize: 13,
          borderRadius: 8,
          border: `1px solid ${pal.border}`,
          background: pal.cardBg,
          color: pal.fg,
          outline: "none",
          marginBottom: 16
        }
      }
    ),
    grouped.map(([task, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, fontWeight: 700, color: pal.muted, marginBottom: 8, letterSpacing: 0.4 }, children: [
        task.toUpperCase(),
        " \xB7 ",
        list.length
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }, children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          "data-mm-atlas-card": m.id,
          style: { ...S.card, padding: "12px 14px", cursor: "pointer" },
          onClick: () => onSelect(m.id),
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = pal.accent;
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = pal.border;
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { fontSize: 13 }, children: m.name_zh || m.name }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.badge(DIFF_COLOR[m.difficulty ?? ""] ?? pal.muted), children: m.difficulty ?? "\u2014" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 2 }, children: m.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, opacity: 0.8, margin: "7px 0 0", lineHeight: 1.5 }, children: m.summary }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 8, display: "flex", gap: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u638C\u63E1\u5EA6\uFF1A\u672A\u6D4B\u9A8C" }),
              m.id === "kmeans" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: pal.accent, fontWeight: 600 }, children: "\u53C2\u8003\u8BFE \u2192" })
            ] })
          ]
        },
        m.id
      )) })
    ] }, task))
  ] });
}
function Placeholder({ pal, section }) {
  const meta = SECTION_META[section];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles(pal).placeholder, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 34 }, children: ALL_ITEMS.find((n) => n.id === section)?.icon }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 600, marginTop: 10 }, children: meta.title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: pal.muted, marginTop: 6 }, children: "\u89C4\u5212\u4E2D \u2014 \u5C06\u5728 PRODUCT_UI_GATE \u901A\u8FC7\u540E\u6309 Phase 3 P7 \u8DEF\u7EBF\u4EA4\u4ED8" })
  ] });
}
function styles(pal) {
  const bordered = {
    border: `1px solid ${pal.border}`,
    borderRadius: 10,
    background: pal.cardBg
  };
  return {
    frame: {
      display: "grid",
      gridTemplateColumns: "232px minmax(0, 1fr) 400px",
      height: "100%",
      width: "100%",
      background: pal.bg,
      color: pal.fg,
      overflow: "hidden"
    },
    frameNarrow: {
      display: "grid",
      gridTemplateColumns: "220px minmax(0, 1fr)",
      height: "100%",
      width: "100%",
      background: pal.bg,
      color: pal.fg,
      overflow: "hidden"
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      borderRight: `1px solid ${pal.border}`,
      overflow: "hidden"
    },
    brand: { padding: "14px 16px 12px", borderBottom: `1px solid ${pal.border}` },
    brandTitle: { fontWeight: 700, fontSize: 15 },
    brandSub: { fontSize: 11, color: pal.muted, marginTop: 3 },
    navList: { padding: "6px 8px 12px", flex: 1, overflow: "auto" },
    navGroup: {
      fontSize: 10.5,
      fontWeight: 700,
      color: pal.muted,
      letterSpacing: 0.8,
      padding: "10px 10px 4px"
    },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "6px 10px",
      borderRadius: 8,
      fontSize: 13,
      cursor: "pointer",
      userSelect: "none",
      color: active ? pal.accent : pal.fg,
      background: active ? pal.accentSoft : "transparent",
      fontWeight: active ? 600 : 400,
      opacity: active ? 1 : 0.82
    }),
    main: {
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    },
    mainHeader: {
      padding: "10px 16px",
      borderBottom: `1px solid ${pal.border}`,
      display: "flex",
      alignItems: "baseline",
      gap: 10
    },
    mainTitle: { fontSize: 14, fontWeight: 600 },
    mainSub: { fontSize: 12, color: pal.muted },
    mainBody: { flex: 1, minHeight: 0, position: "relative" },
    pane: (visible) => ({
      position: "absolute",
      inset: 0,
      overflow: "auto",
      display: visible ? "block" : "none"
    }),
    chatCol: {
      minWidth: 0,
      borderLeft: `1px solid ${pal.border}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    },
    chatHeader: {
      padding: "8px 14px",
      borderBottom: `1px solid ${pal.border}`,
      fontSize: 12,
      color: pal.muted,
      display: "flex",
      justifyContent: "space-between",
      paddingRight: 16
    },
    chatBody: { flex: 1, minHeight: 0 },
    fab: {
      position: "fixed",
      right: 18,
      bottom: 18,
      zIndex: 60,
      borderRadius: 999,
      border: `1px solid ${pal.border}`,
      background: pal.cardBg,
      color: pal.fg,
      padding: "9px 16px",
      fontSize: 13,
      cursor: "pointer",
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)"
    },
    card: { ...bordered, transition: "border-color 120ms ease" },
    badge: (color) => ({
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 999,
      color: "#fff",
      background: color,
      whiteSpace: "nowrap"
    }),
    placeholder: {
      margin: 24,
      border: `1px dashed ${rgba(parseRgb(pal.fg), 0.3)}`,
      borderRadius: 12,
      padding: "44px 30px",
      textAlign: "center"
    }
  };
}
function ShellFrame({ renderSlot }) {
  const pal = useThemePalette();
  const S = styles(pal);
  const [active, setActive] = (0, import_react.useState)(loadSection);
  const [narrow, setNarrow] = (0, import_react.useState)(
    () => typeof window !== "undefined" ? window.innerWidth <= 1180 : false
  );
  const [agentOpen, setAgentOpen] = (0, import_react.useState)(
    () => typeof window !== "undefined" ? window.innerWidth > 1180 : true
  );
  (0, import_react.useEffect)(() => {
    const mq = window.matchMedia("(max-width: 1180px)");
    const onChange = () => {
      setNarrow(mq.matches);
      if (!mq.matches) setAgentOpen(true);
      else setAgentOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const navigate = (id) => {
    setActive(id);
    try {
      sessionStorage.setItem(NAV_KEY, id);
    } catch {
    }
  };
  const selectModel = (modelId) => {
    const sid = readCurrentSessionId();
    void fetch(`${API}/context`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ page: "atlas", model_id: modelId, ...sid ? { session_id: sid } : {} })
    }).catch(() => {
    });
    navigate("lesson");
  };
  const agentStyle = narrow ? {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(400px, 92vw)",
    zIndex: 70,
    background: pal.bg,
    display: agentOpen ? "flex" : "none",
    flexDirection: "column",
    boxShadow: "-8px 0 28px rgba(0,0,0,0.22)"
  } : { ...S.chatCol, display: "flex" };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { "data-mm-shell": "v3", style: narrow ? S.frameNarrow : S.frame, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { style: S.nav, "data-mm-nav": "single", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.brand, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.brandTitle, children: "\u{1F4D0} MathModel Harness" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.brandSub, children: "learn \u2192 practice \u2192 solve \u2192 review" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { style: S.navList, "data-mm-navlist": true, children: NAV.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.navGroup, children: g.group }),
        g.items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            style: S.navItem(active === n.id),
            onClick: () => navigate(n.id),
            role: "tab",
            "aria-selected": active === n.id,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14 }, children: n.icon }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label })
            ]
          },
          n.id
        ))
      ] }, g.group)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { style: S.main, "data-mm-main": true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.mainHeader, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.mainTitle, "data-mm-title": true, children: SECTION_META[active].title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.mainSub, children: SECTION_META[active].sub })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.mainBody, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "dashboard"), "data-mm-section": "dashboard", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, { pal, onNavigate: navigate }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "atlas"), "data-mm-section": "atlas", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atlas, { pal, onSelect: selectModel }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "lesson"), "data-mm-section": "lesson", children: renderSlot("mathmodel.workbench", {}) }),
        ["review", "gym", "competition", "problems", "cases", "lab", "paper", "reviewer", "profile"].map(
          (id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === id), "data-mm-section": id, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Placeholder, { pal, section: id }) }, id)
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: agentStyle, "data-mm-agent": true, "data-mm-agent-open": agentOpen ? "1" : "0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.chatHeader, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Modeling Agent\uFF08\u539F\u751F\uFF09" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: narrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            onClick: () => setAgentOpen(false),
            style: { border: "none", background: "none", color: pal.fg, cursor: "pointer", fontSize: 12 },
            children: "\u6536\u8D77 \u2715"
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.chatBody, children: renderSlot("conversation", {}) })
    ] }),
    narrow && !agentOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: S.fab, onClick: () => setAgentOpen(true), "data-mm-agent-fab": true, children: "\u{1F4AC} Agent" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "none" }, "aria-hidden": true, children: renderSlot("details", {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 40 }, "data-shell-overlay": true, children: renderSlot("shell.overlay", {}) })
  ] });
}
var currentCtx;
function readCurrentSessionId() {
  try {
    return currentCtx?.sessions?.list?.getSnapshot?.()?.current;
  } catch {
    return void 0;
  }
}
var inject = ["slots", "sessions"];
function apply(ctx) {
  currentCtx = ctx;
  const disposeLayout = ctx.reflect.provide("layout", { toggleSidebar() {
  }, openDetails() {
  }, closeDetails() {
  } });
  const disposeRoot = ctx.slots.register(
    {
      name: "root",
      children: {
        sidebar: { kind: "single", scope: "root" },
        conversation: { kind: "single", scope: "session-maybe" },
        details: { kind: "single", scope: "session" },
        "shell.overlay": { kind: "list", scope: "root" },
        "mathmodel.workbench": { kind: "single", scope: "session" }
      },
      inject: () => ({})
    },
    ShellFrame
  );
  ctx.effect(
    () => () => {
      disposeRoot();
      disposeLayout();
      if (currentCtx === ctx) currentCtx = void 0;
    },
    "mathmodel-shell: dispose"
  );
}

    return module.exports;
  }
});
