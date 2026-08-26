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
      { id: "literature", label: "\u6587\u732E\u7814\u7A76", icon: "\u{1F4D6}" },
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
  review: { title: "\u4ECA\u65E5\u590D\u4E60", sub: "\u8584\u5F31\u77E5\u8BC6\u5355\u5143 \xB7 \u5230\u671F\u961F\u5217 \xB7 \u9519\u9898" },
  gym: { title: "\u4E13\u9879\u8BAD\u7EC3 Modeling Gym", sub: "\u63D0\u6848 \u2192 \u6559\u7EC3\u63D0\u793A \u2192 \u7EF4\u5EA6\u53CD\u9988" },
  competition: { title: "\u6BD4\u8D5B\u5DE5\u4F5C\u53F0", sub: "\u5951\u7EA6 \u2192 \u6570\u636E\u8BCA\u65AD \u2192 \u7279\u5F81 \u2192 \u9009\u578B \u2192 \u5B9E\u9A8C \u2192 \u9A8C\u8BC1" },
  problems: { title: "\u9898\u5E93 / \u771F\u9898", sub: "\u8D44\u6E90\u6CE8\u518C\u8868\uFF08\u5916\u94FE + \u5143\u6570\u636E\uFF09" },
  cases: { title: "\u4F18\u79C0\u6848\u4F8B", sub: "\u7ED3\u6784\u5316\u84B8\u998F\u6848\u4F8B" },
  lab: { title: "Algorithm Lab", sub: "\u72EC\u7ACB\u7B97\u6CD5\u5B9E\u9A8C\u53F0" },
  paper: { title: "Paper Lab", sub: "\u63D0\u7EB2 \xB7 \u8BC1\u636E\u58F0\u660E\uFF08claim \u2192 run \u94FE\uFF09" },
  literature: { title: "\u6587\u732E\u7814\u7A76", sub: "\u771F\u5B9E\u6587\u732E\u68C0\u7D22 \xB7 \u622A\u6B62\u65E5\u9694\u79BB \xB7 \u65B9\u6CD5\u65CF\u7EFC\u5408" },
  reviewer: { title: "\u8BBA\u6587\u8BC4\u5BA1", sub: "12 \u7EF4 Rubric \u2192 \u53D1\u73B0 \u2192 \u5DEE\u8DDD\u5206\u6790" },
  profile: { title: "\u80FD\u529B\u753B\u50CF", sub: "\u638C\u63E1\u5EA6 \xB7 \u9519\u9898 \xB7 \u8BC4\u5BA1\u5F31\u70B9 \xB7 \u8BAD\u7EC3\u8BB0\u5F55" }
};
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
    cardBg: light ? "rgba(255,255,255,0.85)" : rgba(fgC, 0.05),
    muted: rgba(fgC, 0.58),
    accent: light ? "#3f66f0" : "#7c9cff",
    accentSoft: rgba(light ? [63, 102, 240] : [124, 156, 255], 0.14),
    danger: "#cc4b4b",
    warn: "#c77c1d",
    ok: "#2e9e5b"
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
async function jget(url) {
  const r = await fetch(url);
  return r.json();
}
async function jsend(method, url, body) {
  const r = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {})
  });
  return r.json();
}
function useRegistry() {
  const [models, setModels] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let alive = true;
    jget(`${API}/registry`).then((d) => alive && setModels(d.models ?? []));
    return () => {
      alive = false;
    };
  }, []);
  return models;
}
function useMasteryMap() {
  const [rows, setRows] = (0, import_react.useState)(null);
  const refresh = () => jget(`${API}/mastery?user_id=demo`).then((d) => setRows(d.mastery ?? []));
  (0, import_react.useEffect)(() => {
    refresh();
  }, []);
  return { rows, refresh };
}
function masteryForModel(rows, m) {
  if (!rows || !m.knowledge_units || m.knowledge_units.length === 0) return null;
  const byId = new Map(rows.filter((r) => r.item_type === "ku").map((r) => [r.item_id, r.score]));
  const scores = m.knowledge_units.map((ku) => byId.get(ku)).filter((s) => typeof s === "number");
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((s, x) => s + x, 0) / scores.length * 10) / 10;
}
function Card(props) {
  const { pal } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      onClick: props.onClick,
      "data-mm-atlas-card": props["data-mm-atlas-card"],
      style: {
        border: `1px solid ${pal.border}`,
        borderRadius: 10,
        background: pal.cardBg,
        padding: "12px 14px",
        ...props.onClick ? { cursor: "pointer" } : {},
        ...props.style
      },
      onMouseEnter: (e) => props.onClick && (e.currentTarget.style.borderColor = pal.accent),
      onMouseLeave: (e) => props.onClick && (e.currentTarget.style.borderColor = pal.border),
      children: props.children
    }
  );
}
function Btn(props) {
  const { pal } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      type: "button",
      disabled: props.disabled,
      onClick: props.onClick,
      style: {
        padding: "6px 14px",
        fontSize: 12.5,
        borderRadius: 8,
        cursor: props.disabled ? "default" : "pointer",
        border: `1px solid ${props.primary ? pal.accent : pal.border}`,
        background: props.primary ? pal.accent : "transparent",
        color: props.primary ? "#fff" : pal.fg,
        opacity: props.disabled ? 0.5 : 1
      },
      children: props.children
    }
  );
}
function Field(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "block", fontSize: 12, marginBottom: 10 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { color: "inherit", opacity: 0.7, marginBottom: 4 }, children: props.label }),
    props.children
  ] });
}
var inputStyle = (pal) => ({
  width: "100%",
  padding: "7px 10px",
  fontSize: 12.5,
  borderRadius: 8,
  border: `1px solid ${pal.border}`,
  background: "transparent",
  color: pal.fg,
  outline: "none",
  boxSizing: "border-box"
});
function MasteryChip({ pal, value }) {
  if (value === null)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, color: pal.muted }, children: "\u638C\u63E1\u5EA6\uFF1A\u672A\u6D4B\u9A8C" });
  const color = value >= 70 ? pal.ok : value >= 45 ? pal.warn : pal.danger;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color }, children: [
    "\u638C\u63E1\u5EA6 ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
      value,
      "%"
    ] })
  ] });
}
function Dashboard({
  pal,
  onNavigate
}) {
  const [queue, setQueue] = (0, import_react.useState)([]);
  const [projects, setProjects] = (0, import_react.useState)([]);
  const [profile, setProfile] = (0, import_react.useState)(null);
  const models = useRegistry();
  const mastery = useMasteryMap();
  (0, import_react.useEffect)(() => {
    jget(`${API}/review/queue?limit=5`).then((d) => setQueue(d.queue ?? []));
    jget(`${API}/projects`).then((d) => setProjects(d.projects ?? []));
    jget(`${API}/profile?user_id=demo`).then((d) => setProfile(d));
  }, []);
  const weakest = (profile?.weak_units ?? []).slice(0, 3);
  const kmeans = models?.find((m) => m.id === "kmeans");
  const kmeansMastery = kmeans ? masteryForModel(mastery.rows, kmeans) : null;
  const primary = [
    { title: "\u7EE7\u7EED\u5B66\u4E60", desc: `K-Means \u53C2\u8003\u8BFE \xB7 \u638C\u63E1\u5EA6 ${kmeansMastery ?? "\u2014"}%`, target: "lesson", cta: "\u8FDB\u5165\u8BFE\u7A0B" },
    {
      title: "\u4ECA\u65E5\u590D\u4E60",
      desc: queue.length > 0 ? `${queue.length} \u9879\u5F85\u590D\u4E60\uFF1A${queue[0].item_id}` : "\u961F\u5217\u4E3A\u7A7A \u2014 \u5B8C\u6210 Quiz \u751F\u6210\u590D\u4E60\u9879",
      target: "review",
      cta: "\u5F00\u59CB\u590D\u4E60"
    },
    {
      title: "\u7EE7\u7EED\u6BD4\u8D5B\u9879\u76EE",
      desc: projects[0] ? `${projects[0].name} \xB7 \u9636\u6BB5 ${projects[0].stage}` : "\u6682\u65E0\u9879\u76EE \u2014 \u5728\u6BD4\u8D5B\u5DE5\u4F5C\u53F0\u521B\u5EFA",
      target: "competition",
      cta: projects[0] ? "\u7EE7\u7EED\u9879\u76EE" : "\u521B\u5EFA\u9879\u76EE"
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "22px 26px", overflow: "auto", height: "100%" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { style: { fontSize: 18, margin: "0 0 4px" }, children: "\u4ECA\u5929\u6700\u503C\u5F97\u7EE7\u7EED\u4EC0\u4E48\uFF1F" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12.5, color: pal.muted, margin: "0 0 18px" }, children: "\u5B66\u4E60 \u2192 \u8BAD\u7EC3 \u2192 \u5B9E\u6218 \u2192 \u8BC4\u5BA1 \u2192 \u8BCA\u65AD \u2192 \u518D\u8BAD\u7EC3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }, children: primary.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, onClick: () => onNavigate(c.target), style: { padding: "16px 18px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700 }, children: c.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted, marginTop: 5 }, children: c.desc }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.accent, marginTop: 10, fontWeight: 600 }, children: [
        c.cta,
        " \u2192"
      ] })
    ] }, c.title)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginTop: 24, marginBottom: 10 }, children: "\u6A21\u5757\u5165\u53E3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }, children: [
      { title: "\u6A21\u578B\u5730\u56FE", desc: "Task \xD7 Family \xD7 Algorithm", target: "atlas", icon: "\u{1F5FA}\uFE0F" },
      { title: "\u4E13\u9879\u8BAD\u7EC3", desc: "Gym \u62C6\u9898\u8BAD\u7EC3", target: "gym", icon: "\u{1F3CB}\uFE0F" },
      { title: "\u6BD4\u8D5B\u5DE5\u4F5C\u53F0", desc: "\u5951\u7EA6 \u2192 \u5B9E\u9A8C \u2192 \u9A8C\u8BC1", target: "competition", icon: "\u{1F3C6}" },
      { title: "\u9898\u5E93 / \u771F\u9898", desc: "\u8D44\u6E90\u6CE8\u518C\u8868", target: "problems", icon: "\u{1F4DD}" },
      { title: "\u4F18\u79C0\u6848\u4F8B", desc: "\u7ED3\u6784\u5316\u84B8\u998F", target: "cases", icon: "\u{1F4DA}" },
      { title: "\u8BBA\u6587\u8BC4\u5BA1", desc: "Rubric \u2192 \u5DEE\u8DDD", target: "reviewer", icon: "\u{1F50D}" }
    ].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, onClick: () => onNavigate(m.target), style: { padding: "12px 14px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 18 }, children: m.icon }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 600, marginTop: 6 }, children: m.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 3 }, children: m.desc })
    ] }, m.title)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginTop: 20, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700 }, children: "\u5F53\u524D\u8584\u5F31\u9879" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted, marginTop: 4 }, children: weakest.length > 0 ? weakest.map((w) => `${w.item_id} (${w.score}%)`).join(" \xB7 ") : "\u5B8C\u6210 Quiz \u4E0E\u8BC4\u5BA1\u540E\uFF0C\u8FD9\u91CC\u4F1A\u7ED9\u51FA\u6700\u503C\u5F97\u8BAD\u7EC3\u7684\u77E5\u8BC6\u5355\u5143" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: () => onNavigate("profile"), children: "\u80FD\u529B\u753B\u50CF \u2192" })
    ] })
  ] });
}
var TASK_LABEL = {
  clustering: "\u805A\u7C7B",
  evaluation: "\u8BC4\u4EF7 / \u51B3\u7B56",
  "time-series": "\u9884\u6D4B / \u65F6\u5E8F",
  prediction: "\u9884\u6D4B",
  optimization: "\u4F18\u5316",
  regression: "\u56DE\u5F52 / \u9884\u6D4B",
  classification: "\u5206\u7C7B",
  simulation: "\u4EFF\u771F",
  graph: "\u56FE / \u7F51\u7EDC",
  spatial: "\u7A7A\u95F4",
  preprocessing: "\u9884\u5904\u7406",
  "feature-engineering": "\u7279\u5F81\u5DE5\u7A0B",
  other: "\u5176\u4ED6"
};
function Atlas({ pal, onSelect }) {
  const S = styles(pal);
  const models = useRegistry();
  const mastery = useMasteryMap();
  const [query, setQuery] = (0, import_react.useState)("");
  const grouped = (0, import_react.useMemo)(() => {
    if (!models) return [];
    const q = query.trim().toLowerCase();
    const filtered = models.filter(
      (m) => !q || m.id.toLowerCase().includes(q) || (m.name ?? "").toLowerCase().includes(q) || (m.name_zh ?? "").includes(q) || (m.task ?? "").includes(q)
    );
    const byTask = /* @__PURE__ */ new Map();
    for (const m of filtered) {
      const t = TASK_LABEL[m.task ?? "other"] ?? m.task ?? "\u5176\u4ED6";
      if (!byTask.has(t)) byTask.set(t, []);
      byTask.get(t).push(m);
    }
    return [...byTask.entries()];
  }, [models, query]);
  if (!models) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24, fontSize: 13, color: pal.muted }, children: "\u52A0\u8F7D\u6CE8\u518C\u8868\u2026" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: "\u641C\u7D22\u7B97\u6CD5\uFF08\u5982 kmeans / \u805A\u7C7B / TOPSIS / \u4F18\u5316\uFF09",
        style: { ...inputStyle(pal), width: "min(420px, 100%)", marginBottom: 16 }
      }
    ),
    grouped.map(([task, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, fontWeight: 700, color: pal.muted, marginBottom: 8, letterSpacing: 0.4 }, children: [
        task.toUpperCase(),
        " \xB7 ",
        list.length
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }, children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, onClick: () => onSelect(m.id), "data-mm-atlas-card": m.id, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { fontSize: 13 }, children: m.name_zh || m.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 999, color: "#fff", background: m.difficulty === "beginner" ? pal.ok : m.difficulty === "advanced" ? pal.danger : pal.warn }, children: m.difficulty ?? "\u2014" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 2 }, children: [
          m.name,
          " \xB7 ",
          m.family ?? "\u2014"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, opacity: 0.8, margin: "7px 0 0", lineHeight: 1.5 }, children: m.summary }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, marginTop: 8, display: "flex", gap: 10, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasteryChip, { pal, value: masteryForModel(mastery.rows, m) }),
          m.id === "kmeans" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: pal.accent, fontWeight: 600 }, children: "\u53C2\u8003\u8BFE \u2192" })
        ] })
      ] }, m.id)) })
    ] }, task))
  ] });
}
function DailyReview({ pal }) {
  const [queue, setQueue] = (0, import_react.useState)([]);
  const [busy, setBusy] = (0, import_react.useState)(null);
  const load = () => jget(`${API}/review/queue?limit=30`).then((d) => setQueue(d.queue ?? []));
  (0, import_react.useEffect)(() => {
    load();
  }, []);
  const complete = async (item, correct) => {
    setBusy(item.item_id);
    await jsend("POST", `${API}/review/complete`, { item_type: item.item_type === "model" ? "model" : "ku", item_id: item.item_id, correct });
    await load();
    setBusy(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12.5, color: pal.muted, marginTop: 0 }, children: "\u961F\u5217\u6765\u6E90\uFF1A\u4F4E\u638C\u63E1\u5EA6 \xB7 \u5230\u671F\uFF08SRS\uFF09\xB7 Quiz \u9519\u9898 \xB7 \u8BC4\u5BA1\u53D1\u73B0\u3002\u5B8C\u6210\u540E\u6309\u8BB0\u5FC6\u66F2\u7EBF\u91CD\u6392\u3002" }),
    queue.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13 }, children: "\u961F\u5217\u4E3A\u7A7A \u2014 \u53BB Atlas \u5B8C\u6210 Quiz\uFF0C\u6216\u63D0\u4EA4 Gym/\u8BC4\u5BA1\u751F\u6210\u8584\u5F31\u9879\u3002" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gap: 10 }, children: queue.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 600 }, children: [
          item.item_id,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color: pal.muted, fontWeight: 400 }, children: [
            "(",
            item.item_type === "model" ? "\u6A21\u578B" : item.item_type === "ku" ? "\u77E5\u8BC6\u5355\u5143" : item.item_type,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 3 }, children: [
          item.score !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            "\u638C\u63E1\u5EA6 ",
            item.score,
            "% \xB7 "
          ] }),
          item.reasons.join(" \xB7 "),
          " \xB7 \u4F18\u5148\u7EA7 ",
          item.priority
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, disabled: busy === item.item_id, onClick: () => complete(item, true), children: "\u8BB0\u4F4F\u4E86" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, disabled: busy === item.item_id, onClick: () => complete(item, false), children: "\u8FD8\u4E0D\u4F1A" })
      ] })
    ] }) }, `${item.item_type}:${item.item_id}`)) })
  ] });
}
function Gym({ pal }) {
  const [cases, setCases] = (0, import_react.useState)([]);
  const [active, setActive] = (0, import_react.useState)(null);
  const [sections, setSections] = (0, import_react.useState)({});
  const [result, setResult] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    jget(`${API}/gym/cases`).then((d) => {
      setCases(d.cases ?? []);
      if ((d.cases ?? []).length > 0) setActive(d.cases[0]);
    });
  }, []);
  const pick = (c) => {
    setActive(c);
    setResult(null);
    setSections(Object.fromEntries((c.dimensions ?? []).map((d) => [d, ""])));
  };
  const submit = async () => {
    if (!active) return;
    const proposal = Object.fromEntries((active.dimensions ?? []).map((d) => [d, sections[d] ?? ""]));
    const r = await jsend("POST", `${API}/gym/submit/${active.id}`, { user_id: "demo", proposal });
    setResult(r);
  };
  if (!active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24, fontSize: 13, color: pal.muted }, children: "\u52A0\u8F7D Gym \u6848\u4F8B\u2026" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8, marginBottom: 14 }, children: cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: active.id === c.id, onClick: () => pick(c), children: c.title }, c.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "16px 18px", marginBottom: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 6 }, children: "\u9898\u76EE" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap" }, children: active.problem })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u4F60\u7684\u63D0\u6848\uFF08\u6309\u7EF4\u5EA6\u4F5C\u7B54\uFF09" }),
    (active.dimensions ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: `\u3010${d}\u3011`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "textarea",
      {
        rows: 3,
        style: inputStyle(pal),
        value: sections[d] ?? "",
        onChange: (e) => setSections({ ...sections, [d]: e.target.value })
      }
    ) }, d)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: submit, children: "\u63D0\u4EA4\u63D0\u6848\uFF08\u5148\u81EA\u8BC4\uFF0C\u53C2\u8003\u7B54\u6848\u5728\u53CD\u9988\u540E\u63ED\u793A\uFF09" }),
    result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 18 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, style: { padding: "14px 16px", marginBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 700 }, children: [
        "\u7EF4\u5EA6\u53CD\u9988 \xB7 \u603B\u5206 ",
        result.total,
        "/",
        result.max,
        "\uFF08",
        result.pct,
        "%\uFF09"
      ] }) }),
      result.dimensions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
          d.dimension,
          " \u2014",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: d.score === 2 ? pal.ok : d.score === 1 ? pal.warn : pal.danger }, children: d.score === 2 ? "\u8986\u76D6\u826F\u597D" : d.score === 1 ? "\u90E8\u5206\u8986\u76D6" : "\u672A\u8986\u76D6" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.muted, marginTop: 4 }, children: [
          "\u{1F4A1} ",
          d.hint
        ] }),
        d.missing?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: pal.muted, marginTop: 3 }, children: [
          "\u5EFA\u8BAE\u8865\u5145\u5173\u952E\u8BCD\uFF1A",
          d.missing.join("\u3001")
        ] })
      ] }, d.dimension)),
      result.reference_outline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "14px 16px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 6 }, children: "\u53C2\u8003\u601D\u8DEF\uFF08\u5DF2\u63ED\u793A\uFF09" }),
        Object.entries(result.reference_outline).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, marginBottom: 5, lineHeight: 1.6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
            k,
            "\uFF1A"
          ] }),
          v
        ] }, k)),
        result.training_recommendations?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.accent, marginTop: 8 }, children: [
          "\u8BAD\u7EC3\u5EFA\u8BAE\u77E5\u8BC6\u5355\u5143\uFF1A",
          result.training_recommendations.join("\u3001"),
          "\uFF08\u5DF2\u8FDB\u5165\u4ECA\u65E5\u590D\u4E60\u961F\u5217\uFF09"
        ] })
      ] })
    ] })
  ] });
}
var CLUSTER_COLORS = ["#3f66f0", "#2e9e5b", "#c77c1d", "#8e44ad", "#e05656", "#16a085"];
function FigureFrame({
  pal,
  caption,
  children,
  onSave
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "12px 14px", marginBottom: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { viewBox: "0 0 420 260", style: { width: "100%", maxWidth: 560, display: "block", margin: "0 auto", background: "rgba(128,128,128,0.04)", borderRadius: 6 }, children }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, gap: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: pal.muted, lineHeight: 1.5 }, children: caption }),
      onSave && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: onSave, children: "\u4FDD\u5B58\u56FE\u8868\u8BB0\u5F55" })
    ] })
  ] });
}
function axes(pal) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { stroke: pal.border, strokeWidth: 1, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: 40, y1: 220, x2: 400, y2: 220 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: 40, y1: 10, x2: 40, y2: 220 })
  ] });
}
function ScatterClusters({
  pal,
  points,
  labels,
  centroids
}) {
  const all = [...points, ...centroids];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const sx = (v) => 50 + (v - x0) / Math.max(1e-9, x1 - x0) * 340;
  const sy = (v) => 215 - (v - y0) / Math.max(1e-9, y1 - y0) * 195;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
    axes(pal),
    points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: sx(p[0]), cy: sy(p[1]), r: 4, fill: CLUSTER_COLORS[labels[i] % CLUSTER_COLORS.length], opacity: 0.85 }, i)),
    centroids.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: sx(c[0]) - 7, y1: sy(c[1]) - 7, x2: sx(c[0]) + 7, y2: sy(c[1]) + 7, stroke: CLUSTER_COLORS[i % CLUSTER_COLORS.length], strokeWidth: 2.5 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: sx(c[0]) - 7, y1: sy(c[1]) + 7, x2: sx(c[0]) + 7, y2: sy(c[1]) - 7, stroke: CLUSTER_COLORS[i % CLUSTER_COLORS.length], strokeWidth: 2.5 })
    ] }, `c${i}`)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: 220, y: 248, fontSize: 11, fill: pal.muted, textAnchor: "middle", children: "\u7279\u5F81\u7A7A\u95F4\u6563\u70B9\uFF08\u989C\u8272 = \u7C07\uFF0C\xD7 = \u8D28\u5FC3\uFF09" })
  ] });
}
function PredictedVsActual({
  pal,
  actual,
  predicted
}) {
  const all = [...actual, ...predicted, 0];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const s = (v) => 50 + (v - lo) / Math.max(1e-9, hi - lo) * 340;
  const sy = (v) => 215 - (v - lo) / Math.max(1e-9, hi - lo) * 195;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
    axes(pal),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: s(lo), y1: sy(lo), x2: s(hi), y2: sy(hi), stroke: pal.muted, strokeDasharray: "4 3" }),
    actual.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: s(a), cy: sy(predicted[i]), r: 4.5, fill: pal.accent, opacity: 0.9 }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: 230, y: 248, fontSize: 11, fill: pal.muted, textAnchor: "middle", children: "\u5B9E\u9645\u503C\uFF08x\uFF09vs \u9884\u6D4B\u503C\uFF08y\uFF09\xB7 \u865A\u7EBF = \u5B8C\u7F8E\u9884\u6D4B" })
  ] });
}
function ConvergenceCurve({ pal, curve, seed }) {
  const lo = Math.min(...curve);
  const hi = Math.max(...curve);
  const sx = (i) => 50 + i / Math.max(1, curve.length - 1) * 340;
  const sy = (v) => 215 - (v - lo) / Math.max(1e-9, hi - lo || 1) * 195;
  const path = curve.map((v, i) => `${i === 0 ? "M" : "L"}${sx(i)},${sy(v)}`).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
    axes(pal),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: path, fill: "none", stroke: pal.accent, strokeWidth: 2 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: sx(curve.length - 1), cy: sy(curve[curve.length - 1]), r: 4, fill: pal.ok }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", { x: 230, y: 248, fontSize: 11, fill: pal.muted, textAnchor: "middle", children: [
      "\u6536\u655B\u66F2\u7EBF\uFF08seed ",
      seed,
      "\uFF09\xB7 \u8FED\u4EE3 \u2192 \u6700\u4F18\u76EE\u6807\u503C"
    ] })
  ] });
}
function BarList({ pal, items }) {
  const max = Math.max(...items.map((i) => i.value), 1e-9);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: items.map((it, i) => {
    const w = it.value / max * 300;
    const y = 18 + i * (200 / Math.max(1, items.length));
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: 38, y: y + 12, fontSize: 10.5, fill: pal.muted, textAnchor: "end", children: it.label.length > 10 ? it.label.slice(0, 10) : it.label }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: 44, y, width: Math.max(2, w), height: 16, fill: pal.accent, opacity: 0.85, rx: 3 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: 44 + Math.max(2, w) + 6, y: y + 12, fontSize: 10.5, fill: pal.fg, children: it.value })
    ] }, i);
  }) });
}
function figureFromRun(run) {
  const a = run.artifacts ?? {};
  const p = run.parameters ?? {};
  if (run.algorithm === "kmeans" && a.labels && a.centroids) {
    return {
      type: "scatter-clusters",
      caption: `K-Means \u805A\u7C7B\u6563\u70B9\uFF08k=${p.k}\uFF0Cseeds=${(p.seeds ?? []).join("/")}\uFF0CSSE \u5747\u503C ${run.metrics.sse_mean}\uFF09`,
      data: { points: p.points ?? [], labels: JSON.parse(a.labels), centroids: JSON.parse(a.centroids) }
    };
  }
  if (run.algorithm === "linear-regression" && a.coefficients && a.residuals) {
    const w = JSON.parse(a.coefficients);
    const X = p.X ?? [];
    const actual = p.y ?? [];
    const predicted = X.map((row) => row.reduce((s, v, j) => s + v * w[j + 1], w[0]));
    return {
      type: "predicted-vs-actual",
      caption: `\u7EBF\u6027\u56DE\u5F52 \u5B9E\u9645 vs \u9884\u6D4B\uFF08R\xB2=${run.metrics.r2}\uFF0Cn=${run.metrics.n}\uFF09`,
      data: { actual, predicted }
    };
  }
  if (run.algorithm === "pso" && a.convergence_best_seed) {
    return {
      type: "convergence",
      caption: `PSO \u6536\u655B\u66F2\u7EBF\uFF08${p.objective}\uFF0Cdims=${p.dims}\uFF0C\u6700\u4F18 ${run.metrics.best_overall}\uFF09`,
      data: { curve: JSON.parse(a.convergence_best_seed), seed: run.seed }
    };
  }
  if (run.algorithm === "topsis" && a.closeness) {
    const closeness = JSON.parse(a.closeness);
    return {
      type: "bars",
      caption: `TOPSIS \u8D34\u8FD1\u5EA6\uFF08${run.metrics.alternatives} \u4E2A\u65B9\u6848\uFF09`,
      data: { items: closeness.map((c, i) => ({ label: `\u65B9\u6848${i + 1}`, value: c })) }
    };
  }
  if (run.algorithm === "entropy-weight" && a.weights) {
    const weights = JSON.parse(a.weights);
    return {
      type: "bars",
      caption: "\u71B5\u6743\u6CD5\u6743\u91CD\u5206\u5E03",
      data: { items: weights.map((w, i) => ({ label: `\u6307\u6807${i + 1}`, value: w })) }
    };
  }
  return null;
}
function RunFigure({ pal, run, onSave }) {
  const fig = (0, import_react.useMemo)(() => figureFromRun(run), [run]);
  if (!fig)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, style: { marginBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.muted }, children: [
      "\u8BE5 run \u65E0\u53EF\u7ED8\u5236\u4EA7\u7269\uFF08",
      run.algorithm,
      "\uFF09\u2014 \u56FE\u8868\u7C7B\u578B\uFF1A\u6563\u70B9\u805A\u7C7B / \u5B9E\u9645vs\u9884\u6D4B / \u6536\u655B\u66F2\u7EBF / \u6743\u91CD\u6761\u5F62\u3002"
    ] }) });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    FigureFrame,
    {
      pal,
      caption: `${fig.caption} \xB7 run ${run.run_id.slice(0, 8)}\u2026`,
      onSave: onSave ? () => onSave({ ...fig, run_id: run.run_id }) : void 0,
      children: [
        fig.type === "scatter-clusters" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScatterClusters, { pal, points: fig.data.points, labels: fig.data.labels, centroids: fig.data.centroids }),
        fig.type === "predicted-vs-actual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PredictedVsActual, { pal, actual: fig.data.actual, predicted: fig.data.predicted }),
        fig.type === "convergence" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConvergenceCurve, { pal, curve: fig.data.curve, seed: fig.data.seed }),
        fig.type === "bars" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarList, { pal, items: fig.data.items })
      ]
    }
  );
}
function DeepLesson({ pal, modelId }) {
  const [lesson, setLesson] = (0, import_react.useState)(null);
  const [missing, setMissing] = (0, import_react.useState)(false);
  const [picked, setPicked] = (0, import_react.useState)({});
  (0, import_react.useEffect)(() => {
    setLesson(null);
    setMissing(false);
    setPicked({});
    jget(`${API}/lessons/${modelId}`).then((d) => {
      if (d.ok) setLesson(d.lesson);
      else setMissing(true);
    });
  }, [modelId]);
  if (missing)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13 }, children: "\u8BE5\u6A21\u578B\u6682\u65E0\u6DF1\u5EA6\u8BFE\u7A0B\u9875 \u2014 \u53EF\u5728 Algorithm Lab \u76F4\u63A5\u6267\u884C\u5B9E\u9A8C\uFF0C\u6216\u4F7F\u7528\u4E0B\u65B9\u5DE5\u4F5C\u53F0\u3002" }) }) });
  if (!lesson) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24, fontSize: 13, color: pal.muted }, children: "\u52A0\u8F7D\u8BFE\u7A0B\u2026" });
  const q = lesson.quiz ?? [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { fontSize: 17, margin: "0 0 12px" }, children: lesson.title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u23F1 30 \u79D2\u76F4\u89C9" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, lineHeight: 1.7 }, children: lesson.intuition })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u{1F4CC} \u771F\u5B9E\u5EFA\u6A21\u573A\u666F" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, lineHeight: 1.7 }, children: lesson.scenario })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u{1F9EE} \u6570\u5B66\u5F62\u5F0F" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, lineHeight: 1.8, fontFamily: "Georgia, serif" }, children: lesson.math })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u{1F500} \u7B97\u6CD5\u6D41\u7A0B" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { style: { fontSize: 12.5, margin: 0, paddingLeft: 18, lineHeight: 1.9 }, children: (lesson.flow ?? []).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u2699\uFE0F \u53C2\u6570\u600E\u4E48\u8BBE" }),
      (lesson.params ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, marginBottom: 6, lineHeight: 1.6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.name }),
        "\uFF1A",
        p.meaning,
        " \u2014 ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: pal.muted }, children: p.how })
      ] }, p.name))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u2705 \u9002\u7528 / \u274C \u4E0D\u9002\u7528" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, lineHeight: 1.8 }, children: [
        (lesson.use_avoid?.use ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          "\u2705 ",
          u
        ] }, u)),
        (lesson.use_avoid?.avoid ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { color: pal.warn }, children: [
          "\u274C ",
          u
        ] }, u))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u2696\uFE0F Baseline \u5BF9\u7167" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, lineHeight: 1.7 }, children: lesson.baseline_comparison })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u{1F4A5} \u5E38\u89C1\u5931\u8D25" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { style: { fontSize: 12.5, margin: 0, paddingLeft: 18, lineHeight: 1.8 }, children: (lesson.failure_cases ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: f }, f)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u{1F52C} \u9A8C\u8BC1\u65B9\u6CD5" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { style: { fontSize: 12.5, margin: 0, paddingLeft: 18, lineHeight: 1.8 }, children: (lesson.validation ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: v }, v)) })
    ] }),
    (lesson.quiz ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u{1F4DD} Mini Quiz" }),
      q.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 600, marginBottom: 5 }, children: [
          i + 1,
          ". ",
          item.q
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: Object.entries(item.options).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, { pal, primary: picked[i] === k, onClick: () => setPicked({ ...picked, [i]: k }), children: [
          k,
          ". ",
          v
        ] }, k)) }),
        picked[i] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, marginTop: 6, color: picked[i] === item.answer ? pal.ok : pal.danger }, children: [
          picked[i] === item.answer ? "\u2713 \u6B63\u786E \u2014 " : `\u2717 \u6B63\u786E\u7B54\u6848 ${item.answer} \u2014 `,
          item.explanation
        ] })
      ] }, i))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 5 }, children: "\u{1F4C4} \u771F\u5B9E\u8BBA\u6587/\u6848\u4F8B" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, lineHeight: 1.7 }, children: [
        lesson.paper_case?.title,
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.muted }, children: [
          " \u2014 ",
          lesson.paper_case?.note
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.accent, marginTop: 8 }, children: [
        "\u{1F4A1} ",
        lesson.provider_note
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 20 } })
  ] });
}
var STAGES = ["problem", "decompose", "data", "features", "selector", "lab", "viz", "validation", "review"];
var STAGE_LABEL = {
  problem: "\u9898\u76EE",
  decompose: "\u95EE\u9898\u5951\u7EA6",
  data: "Data Doctor",
  features: "\u7279\u5F81\u5361",
  selector: "\u9009\u578B B/M/A",
  lab: "\u5B9E\u9A8C",
  viz: "\u53EF\u89C6\u5316",
  validation: "\u9A8C\u8BC1",
  review: "\u8BC4\u5BA1"
};
function Competition({ pal, onNavigate }) {
  const [projects, setProjects] = (0, import_react.useState)([]);
  const [activeId, setActiveId] = (0, import_react.useState)(null);
  const [detail, setDetail] = (0, import_react.useState)(null);
  const [stage, setStage] = (0, import_react.useState)("decompose");
  const [notice, setNotice] = (0, import_react.useState)(null);
  const loadProjects = () => jget(`${API}/projects`).then((d) => {
    setProjects(d.projects ?? []);
    return d.projects ?? [];
  });
  const openProject = (id) => {
    setActiveId(id);
    jget(`${API}/projects/${id}`).then((d) => {
      setDetail(d);
      setStage(d.project?.stage && STAGES.includes(d.project.stage) ? d.project.stage : "decompose");
    });
  };
  const refreshDetail = () => {
    if (!activeId) return;
    jget(`${API}/projects/${activeId}`).then(setDetail);
  };
  (0, import_react.useEffect)(() => {
    loadProjects().then((list) => {
      if (list.length > 0) openProject(list[0].project_id);
    });
  }, []);
  const createProject = async () => {
    const name = prompt("\u9879\u76EE\u540D\u79F0\uFF1A", "\u65B0\u6BD4\u8D5B\u9879\u76EE");
    if (!name) return;
    const d = await jsend("POST", `${API}/projects`, { name, session_id: "competition" });
    await loadProjects();
    openProject(d.project.project_id);
  };
  const say = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4e3);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "select",
        {
          value: activeId ?? "",
          onChange: (e) => openProject(e.target.value),
          style: { ...inputStyle(pal), width: 260 },
          children: [
            projects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\uFF08\u6682\u65E0\u9879\u76EE\uFF09" }),
            projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: p.project_id, children: [
              p.name,
              " \xB7 ",
              p.stage
            ] }, p.project_id))
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: createProject, children: "+ \u65B0\u5EFA\u9879\u76EE" }),
      detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11.5, color: pal.muted }, children: [
        "\u9636\u6BB5\uFF1A",
        STAGES.map((s) => s === detail.project.stage ? `\u3010${STAGE_LABEL[s]}\u3011` : STAGE_LABEL[s]).join(" \u2192 ")
      ] })
    ] }),
    notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.ok, marginBottom: 10 }, children: notice }),
    !detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13 }, children: "\u521B\u5EFA\u6216\u9009\u62E9\u4E00\u4E2A\u9879\u76EE\u5F00\u59CB\u3002\u9879\u76EE\u6570\u636E\u6301\u4E45\u5316\u5728 workspace/ \u4E0B\uFF0C\u5237\u65B0\u4E0D\u4E22\u3002" }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }, children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: stage === s, onClick: () => setStage(s), children: STAGE_LABEL[s] }, s)) }),
      stage === "decompose" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractStage, { pal, detail, onDone: refreshDetail, say }),
      stage === "data" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataStage, { pal, detail, onDone: refreshDetail, say }),
      stage === "features" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureStage, { pal, detail, onDone: refreshDetail, say }),
      stage === "selector" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorStage, { pal, detail }),
      stage === "lab" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabStage, { pal, detail, onDone: refreshDetail, say }),
      stage === "viz" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VizStage, { pal, detail, say }),
      stage === "validation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValidationStage, { pal, detail, onDone: refreshDetail, say }),
      stage === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ReviewStage,
        {
          pal,
          detail,
          onDone: refreshDetail,
          say,
          onNavigate
        }
      ),
      stage === "problem" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13 }, children: "\u7C98\u8D34/\u5BFC\u5165\u9898\u76EE\u6587\u672C\u540E\uFF0C\u8FDB\u5165\u300C\u95EE\u9898\u5951\u7EA6\u300D\u62C6\u89E3\u4E3A ReqID \u6761\u76EE\u3002\u53EF\u8BA9 Agent \u4F7F\u7528 /problem-reader \u6280\u80FD\u8F85\u52A9\u62C6\u9898\u3002" }) })
    ] })
  ] });
}
function ContractStage({ pal, detail, onDone, say }) {
  const contract = detail.contract;
  const [rows, setRows] = (0, import_react.useState)(
    contract?.entries ?? [{ req_id: "R1", question: "", objective: "", inputs: "", outputs: "", constraints: "", assumptions: "" }]
  );
  const save = async (freeze = false) => {
    const entries = rows.map((r, i) => ({ ...r, req_id: r.req_id || `R${i + 1}` }));
    if (freeze) {
      await jsend("POST", `${API}/projects/${detail.project.project_id}/contract/freeze`, {});
      say("\u5951\u7EA6\u5DF2\u51BB\u7ED3 \u2014 \u4E0B\u6E38\u5DF2\u6709\u5B9E\u9A8C\u6807\u8BB0 STALE");
    } else {
      await jsend("PUT", `${API}/projects/${detail.project.project_id}/contract`, { entries });
      say("\u5951\u7EA6\u5DF2\u4FDD\u5B58");
    }
    onDone();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, color: pal.muted, marginTop: 0 }, children: [
      "Problem Contract Lite\uFF1A\u6BCF\u6761 ReqID = \u4E00\u4E2A\u5FC5\u987B\u56DE\u7B54\u7684\u5B50\u95EE\u9898\u3002\u51BB\u7ED3\u540E\u4FEE\u6539\u4F1A\u89E6\u53D1\u4E0B\u6E38\u5B9E\u9A8C STALE\u3002",
      contract?.frozen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { style: { color: pal.warn }, children: [
        "\uFF08\u5DF2\u51BB\u7ED3 ",
        contract.frozen_at?.slice(0, 10),
        "\uFF09"
      ] })
    ] }),
    rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: 8, marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), value: r.req_id, onChange: (e) => setRows(rows.map((x, j) => j === i ? { ...x, req_id: e.target.value } : x)), placeholder: "ReqID" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), value: r.question, onChange: (e) => setRows(rows.map((x, j) => j === i ? { ...x, question: e.target.value } : x)), placeholder: "\u5B50\u95EE\u9898" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), value: r.objective, onChange: (e) => setRows(rows.map((x, j) => j === i ? { ...x, objective: e.target.value } : x)), placeholder: "\u76EE\u6807 / \u4EA7\u51FA" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), value: r.inputs, onChange: (e) => setRows(rows.map((x, j) => j === i ? { ...x, inputs: e.target.value } : x)), placeholder: "\u8F93\u5165\uFF08\u6570\u636E/\u5B57\u6BB5\uFF09" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), value: r.constraints, onChange: (e) => setRows(rows.map((x, j) => j === i ? { ...x, constraints: e.target.value } : x)), placeholder: "\u7EA6\u675F" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), value: r.assumptions, onChange: (e) => setRows(rows.map((x, j) => j === i ? { ...x, assumptions: e.target.value } : x)), placeholder: "\u5047\u8BBE" })
      ] })
    ] }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: () => setRows([...rows, { req_id: `R${rows.length + 1}`, question: "", objective: "", inputs: "", outputs: "", constraints: "", assumptions: "" }]), children: "+ \u6761\u76EE" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: () => save(false), children: "\u4FDD\u5B58\u5951\u7EA6" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: () => save(true), disabled: contract?.frozen, children: "\u51BB\u7ED3\u786E\u8BA4" })
    ] })
  ] });
}
function DataStage({ pal, detail, onDone, say }) {
  const [csv, setCsv] = (0, import_react.useState)(
    "month,sales,price,promo,target_sales\n1,1200,50,0,1180\n2,1350,50,1,1330\n3,1280,52,0,1290\n4,1500,49,1,1510\n5,900,55,0,880"
  );
  const [target, setTarget] = (0, import_react.useState)("target_sales");
  const [result, setResult] = (0, import_react.useState)(detail.datadoctor);
  const run = async () => {
    const r = await jsend("POST", `${API}/projects/${detail.project.project_id}/datadoctor`, { csv, target });
    setResult(r);
    say("Data Doctor \u8BCA\u65AD\u5B8C\u6210");
    onDone();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "end", marginBottom: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u76EE\u6807\u5217\uFF08\u53EF\u9009\uFF0C\u7528\u4E8E\u6CC4\u6F0F\u68C0\u6D4B\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle(pal), width: 200 }, value: target, onChange: (e) => setTarget(e.target.value) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: run, children: "\u8FD0\u884C Data Doctor" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "CSV \u6570\u636E\uFF08\u7C98\u8D34\u6216\u5BFC\u5165\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 6, style: { ...inputStyle(pal), fontFamily: "monospace" }, value: csv, onChange: (e) => setCsv(e.target.value) }) }),
    result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: [
        "\u8BCA\u65AD\u7ED3\u679C \xB7 ",
        result.row_count,
        " \u884C \xD7 ",
        result.columns.length,
        " \u5217"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, marginBottom: 12 }, children: result.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "10px 12px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
          c.name,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 10.5, color: pal.muted }, children: [
            "(",
            c.type,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 4, lineHeight: 1.6 }, children: [
          "\u7F3A\u5931 ",
          c.missing,
          "\uFF08",
          c.missing_pct,
          "%\uFF09\xB7 \u552F\u4E00 ",
          c.unique,
          c.type === "numeric" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
            "min ",
            c.min,
            " / max ",
            c.max,
            " \xB7 \u79BB\u7FA4 ",
            c.outliers ?? 0
          ] }),
          c.temporal_ordered !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
            "\u65F6\u95F4\u5E8F\uFF1A",
            c.temporal_ordered ? "\u5355\u8C03\u9012\u589E" : "\u975E\u5355\u8C03"
          ] })
        ] })
      ] }, c.name)) }),
      result.findings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u53D1\u73B0" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gap: 6, marginBottom: 12 }, children: result.findings.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, style: { padding: "9px 12px", borderLeft: `3px solid ${f.severity === "critical" ? pal.danger : f.severity === "high" ? pal.danger : f.severity === "medium" ? pal.warn : pal.border}` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
            "[",
            f.severity,
            "]"
          ] }),
          " ",
          f.column,
          "\uFF1A",
          f.detail
        ] }) }, i)) })
      ] }),
      result.recommendations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u5EFA\u8BAE\u52A8\u4F5C\uFF08why / risk / \u4F55\u65F6\u4E0D\u7528\uFF09" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gap: 6 }, children: result.recommendations.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "9px 12px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 600 }, children: r.action }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 3, lineHeight: 1.6 }, children: [
            "\u4E3A\u4EC0\u4E48\uFF1A",
            r.why,
            " \xB7 \u98CE\u9669\uFF1A",
            r.risk,
            " \xB7 \u4F55\u65F6\u4E0D\u7528\uFF1A",
            r.when_not
          ] })
        ] }, i)) })
      ] })
    ] })
  ] });
}
function FeatureStage({ pal, detail, onDone, say }) {
  const [cards, setCards] = (0, import_react.useState)(detail.features?.cards ?? []);
  const save = async () => {
    await jsend("PUT", `${API}/projects/${detail.project.project_id}/features`, { cards });
    say("\u7279\u5F81\u5361\u5DF2\u4FDD\u5B58");
    onDone();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, color: pal.muted, marginTop: 0 }, children: "\u5148\u81EA\u5DF1\u63D0\u51FA\u7279\u5F81\uFF0C\u518D\u8BA9 AI \u5EFA\u8BAE\uFF08/feature-engineering \u6280\u80FD\uFF09\u3002\u6BCF\u5F20\u5361\u5FC5\u987B\u56DE\u7B54\uFF1A\u516C\u5F0F/\u542B\u4E49/\u4E3A\u4EC0\u4E48/\u98CE\u9669/\u6CC4\u6F0F\u98CE\u9669/\u5982\u4F55\u9A8C\u8BC1\u3002" }),
    cards.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), placeholder: "\u7279\u5F81\u540D", value: c.name, onChange: (e) => setCards(cards.map((x, j) => j === i ? { ...x, name: e.target.value } : x)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), placeholder: "\u516C\u5F0F", value: c.formula, onChange: (e) => setCards(cards.map((x, j) => j === i ? { ...x, formula: e.target.value } : x)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), placeholder: "\u542B\u4E49", value: c.meaning, onChange: (e) => setCards(cards.map((x, j) => j === i ? { ...x, meaning: e.target.value } : x)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), placeholder: "\u4E3A\u4EC0\u4E48\u53EF\u80FD\u6709\u7528", value: c.why, onChange: (e) => setCards(cards.map((x, j) => j === i ? { ...x, why: e.target.value } : x)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 130px", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), placeholder: "\u98CE\u9669", value: c.risk, onChange: (e) => setCards(cards.map((x, j) => j === i ? { ...x, risk: e.target.value } : x)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), placeholder: "\u6CC4\u6F0F\u98CE\u9669", value: c.leakage_risk, onChange: (e) => setCards(cards.map((x, j) => j === i ? { ...x, leakage_risk: e.target.value } : x)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: inputStyle(pal), value: c.status, onChange: (e) => setCards(cards.map((x, j) => j === i ? { ...x, status: e.target.value } : x)), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "proposed", children: "\u63D0\u8BAE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "accepted", children: "\u91C7\u7EB3" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "rejected", children: "\u62D2\u7EDD" })
        ] })
      ] })
    ] }, i)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: () => setCards([...cards, { name: "", formula: "", meaning: "", why: "", risk: "", leakage_risk: "none", validation: "", status: "proposed" }]), children: "+ \u7279\u5F81\u5361" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: save, children: "\u4FDD\u5B58\u7279\u5F81\u5361" })
    ] })
  ] });
}
function SelectorStage({ pal, detail }) {
  const [modelId, setModelId] = (0, import_react.useState)("kmeans");
  const [cards, setCards] = (0, import_react.useState)(null);
  const models = useRegistry();
  const load = (id) => {
    setModelId(id);
    jget(`${API}/selector/${id}`).then((d) => setCards(d));
  };
  (0, import_react.useEffect)(() => {
    load(modelId);
  }, []);
  const roleCard = (c, title, color) => c && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { borderTop: `3px solid ${color}` }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: pal.muted, letterSpacing: 0.5 }, children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700, marginTop: 3 }, children: c.name }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11.5, color: pal.muted, marginTop: 4 }, children: c.summary }),
    c.use_when?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, marginTop: 7, lineHeight: 1.6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u9002\u7528\uFF1A" }),
      c.use_when.join("\uFF1B")
    ] }),
    c.avoid_when?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, marginTop: 4, lineHeight: 1.6, color: pal.warn }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u4E0D\u9002\u7528\uFF1A" }),
      c.avoid_when.join("\uFF1B")
    ] }),
    c.validation?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, marginTop: 4, lineHeight: 1.6, color: pal.ok }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u9A8C\u8BC1\uFF1A" }),
      c.validation.join("\u3001")
    ] })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u4E3B\u6A21\u578B\uFF08Main\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: { ...inputStyle(pal), width: 240 }, value: modelId, onChange: (e) => load(e.target.value), children: (models ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: m.id, children: m.name_zh || m.name }, m.id)) }) }) }),
    cards ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }, children: [
      roleCard(cards.baseline, "BASELINE \u57FA\u7EBF", pal.muted),
      roleCard(cards.main, "MAIN \u4E3B\u6A21\u578B", pal.accent),
      roleCard(cards.alternative, "ALTERNATIVE \u5907\u9009", pal.warn)
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: pal.muted }, children: "\u52A0\u8F7D\u9009\u578B\u2026" })
  ] });
}
var DEMO_POINTS = "[[1,1],[1.2,0.9],[5,5],[5.4,4.8],[9,9],[9.2,8.7]]";
function LabStage({ pal, detail, onDone, say }) {
  const [algorithm, setAlgorithm] = (0, import_react.useState)("kmeans");
  const [paramsText, setParamsText] = (0, import_react.useState)(`{
  "points": ${DEMO_POINTS},
  "k": 2,
  "seeds": [1,2,3,4,5]
}`);
  const [lastRun, setLastRun] = (0, import_react.useState)(null);
  const runs = detail.runs ?? [];
  const runIt = async () => {
    let parameters;
    try {
      parameters = JSON.parse(paramsText);
    } catch {
      say("\u53C2\u6570 JSON \u89E3\u6790\u5931\u8D25");
      return;
    }
    const r = await jsend("POST", `${API}/projects/${detail.project.project_id}/runs`, { algorithm, parameters });
    if (r.ok) {
      setLastRun(r.run);
      say(`\u5B9E\u9A8C\u5B8C\u6210\uFF1Arun_id ${r.run.run_id.slice(0, 8)}\u2026\uFF08\u5DF2\u5199\u5165 run-manifest\uFF09`);
      onDone();
    } else {
      say(`\u6267\u884C\u5931\u8D25\uFF1A${r.run?.warnings?.[0] ?? r.error}`);
      setLastRun(r.run);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "end", marginBottom: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u7B97\u6CD5\uFF08\u672C\u5730 Provider\uFF0C\u771F\u5B9E\u6267\u884C\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: { ...inputStyle(pal), width: 260 }, value: algorithm, onChange: (e) => setAlgorithm(e.target.value), children: ["kmeans", "topsis", "entropy-weight", "linear-regression", "pso"].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: a, children: a }, a)) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: runIt, children: "\u6267\u884C\u5B9E\u9A8C" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u53C2\u6570\uFF08JSON\uFF09\u2014 \u968F\u673A\u7B97\u6CD5\u8BF7\u7ED9\u591A\u4E2A seeds\uFF0C\u6307\u6807\u81EA\u52A8\u805A\u5408 mean/std/median/IQR", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 6, style: { ...inputStyle(pal), fontFamily: "monospace" }, value: paramsText, onChange: (e) => setParamsText(e.target.value) }) }),
    lastRun && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 12, padding: "12px 14px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
          "run ",
          lastRun.run_id.slice(0, 8),
          "\u2026 \xB7 ",
          lastRun.runtime_ms,
          "ms \xB7 input_hash ",
          lastRun.input_hash.slice(0, 10),
          "\u2026",
          lastRun.stale && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: pal.warn }, children: "\uFF08STALE\uFF09" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, marginTop: 6, lineHeight: 1.7 }, children: Object.entries(lastRun.metrics).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { marginRight: 14 }, children: [
          k,
          " = ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: String(v) })
        ] }, k)) }),
        lastRun.warnings?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.danger, marginTop: 6 }, children: [
          "\u26A0 ",
          lastRun.warnings.join("\uFF1B")
        ] })
      ] }),
      !lastRun.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        RunFigure,
        {
          pal,
          run: lastRun,
          onSave: async (fig) => {
            await jsend("POST", `${API}/projects/${detail.project.project_id}/figures`, fig);
            say(`\u56FE\u8868\u8BB0\u5F55\u5DF2\u4FDD\u5B58\uFF08${fig.type}\uFF0Crun ${lastRun.run_id.slice(0, 8)}\u2026\uFF09`);
            onDone();
          }
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: [
      "Run Manifest\uFF08",
      runs.length,
      "\uFF09"
    ] }),
    runs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted }, children: "\u5C1A\u65E0\u5B9E\u9A8C\u8BB0\u5F55\u3002" }),
    runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 6, padding: "9px 12px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.algorithm }),
        " \xB7 ",
        r.run_id.slice(0, 8),
        "\u2026 \xB7 ",
        r.runtime_ms,
        "ms \xB7 seed ",
        String(r.seed),
        " \xB7",
        " ",
        r.stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: pal.warn }, children: "STALE" }) : "fresh",
        r.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.danger }, children: [
          " \xB7 \u5931\u8D25: ",
          r.error
        ] }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 3 }, children: Object.entries(r.metrics).slice(0, 5).map(([k, v]) => `${k}=${String(v)}`).join(" \xB7 ") })
    ] }, r.run_id))
  ] });
}
function VizStage({ pal, detail, say }) {
  const runs = (detail.runs ?? []).filter((r) => !r.error);
  const [runId, setRunId] = (0, import_react.useState)(runs[0]?.run_id ?? "");
  const [caption, setCaption] = (0, import_react.useState)("");
  const run = runs.find((r) => r.run_id === runId);
  const saved = detail.figures ?? [];
  const save = async (fig) => {
    await jsend("POST", `${API}/projects/${detail.project.project_id}/figures`, { ...fig, caption: caption || fig.caption });
    say(`\u56FE\u8868\u8BB0\u5F55\u5DF2\u4FDD\u5B58\uFF08${fig.type}\uFF09`);
  };
  if (runs.length === 0)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: pal.muted }, children: "\u5148\u5728\u300C\u5B9E\u9A8C\u300D\u9636\u6BB5\u5B8C\u6210\u81F3\u5C11\u4E00\u6B21\u6210\u529F\u8FD0\u884C\uFF0C\u518D\u6765\u751F\u6210\u56FE\u8868\u3002" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "end", marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u9009\u62E9 run", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: { ...inputStyle(pal), width: 320 }, value: runId, onChange: (e) => setRunId(e.target.value), children: runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: r.run_id, children: [
        r.algorithm,
        " \xB7 ",
        r.run_id.slice(0, 8),
        "\u2026 \xB7 seed ",
        String(r.seed)
      ] }, r.run_id)) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u56FE\u8868\u8BF4\u660E\uFF08caption\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle(pal), width: 320 }, value: caption, onChange: (e) => setCaption(e.target.value), placeholder: "\u7559\u7A7A\u5219\u81EA\u52A8\u751F\u6210" }) })
    ] }),
    run && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunFigure, { pal, run, onSave: save }),
    saved.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 700, margin: "10px 0 8px" }, children: [
        "\u5DF2\u4FDD\u5B58\u56FE\u8868\u8BB0\u5F55\uFF08",
        saved.length,
        "\uFF09"
      ] }),
      saved.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, style: { marginBottom: 6, padding: "8px 12px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: f.figure_id }),
        " \xB7 ",
        f.type,
        " \xB7 run ",
        f.run_id?.slice(0, 8) ?? "\u2014",
        " \xB7 ",
        f.caption
      ] }) }, f.figure_id))
    ] })
  ] });
}
function ValidationStage({ pal, detail, onDone, say }) {
  const runs = detail.runs ?? [];
  const [runId, setRunId] = (0, import_react.useState)(runs[0]?.run_id ?? "");
  const [baselineId, setBaselineId] = (0, import_react.useState)("");
  const [result, setResult] = (0, import_react.useState)(detail.validation);
  const runIt = async () => {
    const r = await jsend("POST", `${API}/projects/${detail.project.project_id}/validation`, { run_id: runId, baseline_run_id: baselineId || null, method: "baseline-compare" });
    setResult(r.validation);
    say("\u9A8C\u8BC1\u68C0\u67E5\u5B8C\u6210");
    onDone();
  };
  if (runs.length === 0)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: pal.muted }, children: "\u5148\u5728\u300C\u5B9E\u9A8C\u300D\u9636\u6BB5\u6267\u884C\u81F3\u5C11\u4E00\u4E2A\u7B97\u6CD5\uFF0C\u518D\u505A\u9A8C\u8BC1\u3002" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "end", marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u76EE\u6807 run", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { style: { ...inputStyle(pal), width: 280 }, value: runId, onChange: (e) => setRunId(e.target.value), children: runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: r.run_id, children: [
        r.algorithm,
        " \xB7 ",
        r.run_id.slice(0, 8),
        "\u2026"
      ] }, r.run_id)) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Baseline run\uFF08\u53EF\u9009\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: { ...inputStyle(pal), width: 280 }, value: baselineId, onChange: (e) => setBaselineId(e.target.value), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\uFF08\u65E0\uFF09" }),
        runs.filter((r) => r.run_id !== runId).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: r.run_id, children: [
          r.algorithm,
          " \xB7 ",
          r.run_id.slice(0, 8),
          "\u2026"
        ] }, r.run_id))
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: runIt, children: "\u8FD0\u884C\u9A8C\u8BC1\u68C0\u67E5" })
    ] }),
    result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      result.checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, style: { marginBottom: 6, padding: "9px 12px", borderLeft: `3px solid ${c.ok ? pal.ok : pal.warn}` }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12.5 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: c.ok ? "\u2713" : "\u26A0" }),
        " ",
        c.name,
        "\uFF1A",
        c.note
      ] }) }, c.name)),
      result.comparison && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginTop: 10, padding: "12px 14px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 600, marginBottom: 6 }, children: [
          "Baseline vs Main\uFF08",
          result.comparison.metric,
          "\uFF09"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, lineHeight: 1.8 }, children: Object.entries(result.comparison.main).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          k,
          ": baseline ",
          String(result.comparison.baseline[k] ?? "\u2014"),
          " \u2192 main ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: String(v) })
        ] }, k)) })
      ] })
    ] })
  ] });
}
var REVIEW_DIMENSIONS = [
  "problem understanding",
  "data handling",
  "feature engineering",
  "model reasonableness",
  "mathematical rigor",
  "algorithm / solution",
  "validation",
  "result interpretation",
  "innovation",
  "visualization",
  "writing",
  "reproducibility"
];
function ReviewStage({ pal, detail, onDone, say, onNavigate }) {
  const [scores, setScores] = (0, import_react.useState)(
    Object.fromEntries(REVIEW_DIMENSIONS.map((d) => [d, { score: 2, note: "" }]))
  );
  const [claimsText, setClaimsText] = (0, import_react.useState)("");
  const [runId, setRunId] = (0, import_react.useState)(detail.runs?.[0]?.run_id ?? "");
  const [result, setResult] = (0, import_react.useState)(null);
  const submitReview = async () => {
    const r = await jsend("POST", `${API}/projects/${detail.project.project_id}/review`, { user_id: "demo", scores });
    setResult({ type: "review", ...r });
    say("\u8BC4\u5BA1\u5B8C\u6210 \u2014 \u5F31\u9879\u5DF2\u8FDB\u5165 Profile \u4E0E\u4ECA\u65E5\u590D\u4E60");
    onDone();
  };
  const submitClaims = async () => {
    const claims = claimsText.split("\n").filter((l) => l.trim()).map((l) => {
      const [claim, rid] = l.split("|").map((s) => s.trim());
      return { claim, run_id: rid || null };
    });
    const r = await jsend("PUT", `${API}/projects/${detail.project.project_id}/claims`, { claims });
    setResult({ type: "claims", unsupported: r.unsupported, claims: r.ledger.claims });
    say(`\u8BC1\u636E\u94FE\u4FDD\u5B58\uFF1A${r.unsupported > 0 ? `${r.unsupported} \u6761\u58F0\u660E\u7F3A\u5C11\u5B9E\u9A8C\u652F\u6491` : "\u5168\u90E8\u58F0\u660E\u6709\u652F\u6491"}`);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "Rubric \u8BC4\u5206\uFF080=\u5DEE 1=\u9700\u6539\u8FDB 2=\u8FBE\u6807\uFF09\u2014 \u8BAD\u7EC3\u7528\uFF0C\u975E\u5B98\u65B9\u8BC4\u5206" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8, marginBottom: 12 }, children: REVIEW_DIMENSIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "9px 12px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 600, marginBottom: 5 }, children: d }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
        [0, 1, 2].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: scores[d].score === s, onClick: () => setScores({ ...scores, [d]: { ...scores[d], score: s } }), children: s }, s)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: { ...inputStyle(pal), flex: 1 }, placeholder: "\u5907\u6CE8", value: scores[d].note, onChange: (e) => setScores({ ...scores, [d]: { ...scores[d], note: e.target.value } }) })
      ] })
    ] }, d)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: submitReview, children: "\u63D0\u4EA4\u8BC4\u5BA1 \u2192 \u751F\u6210\u5DEE\u8DDD\u5206\u6790" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, margin: "18px 0 8px" }, children: "\u8BC1\u636E\u58F0\u660E\u94FE\uFF08claim | run_id\uFF09\u2014 \u65E0 run \u652F\u6491\u7684\u58F0\u660E\u4F1A\u88AB\u6807\u8BB0" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u6BCF\u884C\u4E00\u6761\uFF1A\u58F0\u660E\u5185\u5BB9 | run_id\uFF08\u6765\u81EA\u5B9E\u9A8C\u6E05\u5355\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 3, style: { ...inputStyle(pal), fontFamily: "monospace" }, value: claimsText, onChange: (e) => setClaimsText(e.target.value), placeholder: "K-Means \u5728 k=2 \u65F6 SSE \u5747\u503C 31.0 | <\u7C98\u8D34 run_id>" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: submitClaims, children: "\u4FDD\u5B58\u8BC1\u636E\u94FE" }),
      detail.runs?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color: pal.muted }, children: [
        "\u53EF\u7528 run\uFF1A",
        detail.runs.map((r) => r.run_id.slice(0, 8)).join(", ")
      ] })
    ] }),
    result?.type === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginTop: 14, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 6 }, children: "\u5DEE\u8DDD\u5206\u6790" }),
      result.findings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, color: pal.ok }, children: "\u6240\u6709\u7EF4\u5EA6\u8FBE\u6807 \u2014 \u65E0\u8584\u5F31\u9879\u3002" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        result.findings.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, marginBottom: 6, lineHeight: 1.6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { style: { color: pal.warn }, children: [
            f.dimension,
            "\uFF08",
            f.score,
            "\uFF09"
          ] }),
          " ",
          f.note,
          f.knowledge_units.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.muted }, children: [
            " \u2192 \u77E5\u8BC6\u5355\u5143\uFF1A",
            f.knowledge_units.join("\u3001")
          ] })
        ] }, f.dimension)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.accent, marginTop: 8 }, children: [
          "\u5F31\u9879\u77E5\u8BC6\u5355\u5143 ",
          result.weak_units.join("\u3001"),
          " \u5DF2\u5199\u5165\u80FD\u529B\u753B\u50CF\u5E76\u8FDB\u5165\u4ECA\u65E5\u590D\u4E60\u961F\u5217\u3002"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8, display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: () => onNavigate("review"), children: "\u53BB\u4ECA\u65E5\u590D\u4E60 \u2192" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, onClick: () => onNavigate("profile"), children: "\u67E5\u770B\u80FD\u529B\u753B\u50CF \u2192" })
        ] })
      ] })
    ] }),
    result?.type === "claims" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginTop: 14, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 6 }, children: "\u8BC1\u636E\u94FE\u72B6\u6001" }),
      result.claims.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, marginBottom: 4 }, children: [
        c.supported ? "\u2705" : "\u274C",
        " ",
        c.claim,
        " ",
        c.run_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.muted }, children: [
          "\uFF08run ",
          c.run_id.slice(0, 8),
          "\u2026\uFF09"
        ] })
      ] }, i))
    ] })
  ] });
}
function PaperLab({ pal }) {
  const [projects, setProjects] = (0, import_react.useState)([]);
  const [activeId, setActiveId] = (0, import_react.useState)("");
  const [detail, setDetail] = (0, import_react.useState)(null);
  const [outline, setOutline] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    jget(`${API}/projects`).then((d) => {
      setProjects(d.projects ?? []);
      if ((d.projects ?? []).length > 0) setActiveId(d.projects[0].project_id);
    });
  }, []);
  (0, import_react.useEffect)(() => {
    if (activeId) jget(`${API}/projects/${activeId}`).then(setDetail);
  }, [activeId]);
  const contract = detail?.contract;
  const outlineSections = contract?.entries?.length ? contract.entries.map((e) => `## ${e.req_id} ${e.question}
\u76EE\u6807\uFF1A${e.objective}
\u8F93\u5165\uFF1A${e.inputs}
\u5047\u8BBE\uFF1A${e.assumptions}`) : ["## \u6458\u8981", "## \u95EE\u9898\u91CD\u8FF0", "## \u6A21\u578B\u5047\u8BBE", "## \u6A21\u578B\u5EFA\u7ACB", "## \u7ED3\u679C\u5206\u6790", "## \u6A21\u578B\u8BC4\u4EF7\u4E0E\u5C40\u9650"];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: { ...inputStyle(pal), width: 280 }, value: activeId, onChange: (e) => setActiveId(e.target.value), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\uFF08\u9009\u62E9\u9879\u76EE\uFF09" }),
        projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: p.project_id, children: p.name }, p.project_id))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11.5, color: pal.muted }, children: "\u6570\u503C\u7ED3\u8BBA\u5FC5\u987B\u6765\u81EA run \u8BC1\u636E\uFF08claim \u2192 run_id\uFF09\uFF0CPaper Writer \u4E0D\u5F97\u7F16\u9020\u6307\u6807\u3002" })
    ] }),
    detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u8BBA\u6587\u63D0\u7EB2\uFF08\u7531 Problem Contract \u81EA\u52A8\u751F\u6210\u9AA8\u67B6\uFF09" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, style: { marginBottom: 12 }, children: outlineSections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5, padding: "4px 0", whiteSpace: "pre-wrap", lineHeight: 1.6 }, children: s }, s)) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u8BC1\u636E\u58F0\u660E\uFF08\u6765\u81EA\u8BC4\u5BA1\u9636\u6BB5\uFF09" }),
      detail.claims?.claims?.length ? detail.claims.claims.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, marginBottom: 4 }, children: [
        c.supported ? "\u2705" : "\u274C",
        " ",
        c.claim
      ] }, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted }, children: "\u5C1A\u65E0\u58F0\u660E \u2014 \u5728\u6BD4\u8D5B\u5DE5\u4F5C\u53F0\u300C\u8BC4\u5BA1\u300D\u9636\u6BB5\u6DFB\u52A0 claim \u2192 run \u94FE\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u7ED3\u679C\u5206\u6790\u8349\u7A3F\uFF08\u4EC5\u5141\u8BB8\u5F15\u7528\u4E0A\u65B9 \u2705 \u58F0\u660E\u4E2D\u7684\u6570\u503C\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 5, style: inputStyle(pal), value: outline, onChange: (e) => setOutline(e.target.value), placeholder: "\u4F8B\u5982\uFF1A\u7531 run xxx\uFF0Ck=2 \u65F6 SSE \u5747\u503C 31.0\uFF083 seeds\uFF0Cstd 0\uFF09\u2026" }) })
    ] })
  ] });
}
function Reviewer({ pal }) {
  const [projects, setProjects] = (0, import_react.useState)([]);
  const [activeId, setActiveId] = (0, import_react.useState)("");
  const [scores, setScores] = (0, import_react.useState)(
    Object.fromEntries(REVIEW_DIMENSIONS.map((d) => [d, { score: 2, note: "" }]))
  );
  const [result, setResult] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    jget(`${API}/projects`).then((d) => {
      setProjects(d.projects ?? []);
      if ((d.projects ?? []).length > 0) setActiveId(d.projects[0].project_id);
    });
  }, []);
  const submit = async () => {
    if (!activeId) return;
    const r = await jsend("POST", `${API}/projects/${activeId}/review`, { user_id: "demo", scores });
    setResult(r);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { style: { ...inputStyle(pal), width: 280, marginBottom: 12 }, value: activeId, onChange: (e) => setActiveId(e.target.value), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\uFF08\u9009\u62E9\u9879\u76EE\uFF09" }),
      projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: p.project_id, children: p.name }, p.project_id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8, marginBottom: 12 }, children: REVIEW_DIMENSIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "9px 12px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 600, marginBottom: 5 }, children: d }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 6 }, children: [0, 1, 2].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: scores[d].score === s, onClick: () => setScores({ ...scores, [d]: { ...scores[d], score: s } }), children: s }, s)) })
    ] }, d)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: submit, disabled: !activeId, children: "\u63D0\u4EA4\u8BC4\u5BA1" }),
    result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginTop: 14, padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 6 }, children: [
        result.findings.length === 0 ? "\u5168\u90E8\u8FBE\u6807" : `${result.findings.length} \u4E2A\u5F85\u6539\u8FDB\u7EF4\u5EA6`,
        " \u2192 \u5F31\u9879\u77E5\u8BC6\u5355\u5143\uFF1A",
        result.weak_units.length > 0 ? result.weak_units.join("\u3001") : "\uFF08\u65E0\uFF09"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted }, children: "\u53D1\u73B0\u5DF2\u540C\u6B65\u5230\u80FD\u529B\u753B\u50CF\u4E0E\u4ECA\u65E5\u590D\u4E60\u961F\u5217\u3002" })
    ] })
  ] });
}
function LiteratureResearch({ pal }) {
  const [question, setQuestion] = (0, import_react.useState)("");
  const [cutoff, setCutoff] = (0, import_react.useState)("");
  const [extra, setExtra] = (0, import_react.useState)("");
  const [result, setResult] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const search = async () => {
    if (!question.trim()) return;
    setBusy(true);
    const r = await jsend("POST", `${API}/literature/search`, {
      question,
      cutoff_at: cutoff || null,
      extra_queries: extra.split("\n").map((s) => s.trim()).filter(Boolean)
    });
    setResult(r);
    setBusy(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12.5, color: pal.muted, marginTop: 0 }, children: "\u8D5B\u9898\u53D1\u5E03\u65F6\u95F4\u662F\u786C\u622A\u6B62\uFF1A\u622A\u6B62\u65E5\u540E\u7684\u6587\u732E\u88AB\u9694\u79BB\uFF08\u4EC5\u4F9B\u8D5B\u540E\u590D\u76D8\u5BF9\u7167\uFF09\u3002\u6570\u636E\u6E90\uFF1AOpenAlex \u771F\u5B9E\u6587\u732E\u5143\u6570\u636E\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u7814\u7A76\u95EE\u9898\uFF08\u82F1\u6587\u68C0\u7D22\u6548\u679C\u66F4\u4F73\uFF0C\u53EF\u4E2D\u6587\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { style: inputStyle(pal), value: question, onChange: (e) => setQuestion(e.target.value), placeholder: "heliostat field layout optimization solar thermal power" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "end", marginBottom: 10, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u622A\u6B62\u65E5\uFF08\u8D5B\u9898\u53D1\u5E03\u65E5\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "date", style: inputStyle(pal), value: cutoff, onChange: (e) => setCutoff(e.target.value) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: true, onClick: search, disabled: busy, children: busy ? "\u68C0\u7D22\u4E2D\u2026" : "\u7814\u7A76\u76F8\u5173\u6587\u732E" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "\u6269\u5C55\u68C0\u7D22\u8BCD\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF0C\u53EF\u9009\uFF09", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { rows: 2, style: inputStyle(pal), value: extra, onChange: (e) => setExtra(e.target.value) }) }),
    result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, marginBottom: 10 }, children: [
        "\u622A\u6B62\u6A21\u5F0F\uFF1A",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: result.cutoff_mode }),
        " \xB7 \u622A\u6B62\u65E5\u524D\u6587\u732E ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: result.pre_cutoff.length }),
        " \u7BC7 \xB7 \u5DF2\u9694\u79BB ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: pal.warn }, children: result.quarantined.length }),
        " \u7BC7",
        result.warnings?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.warn }, children: [
          "\uFF08",
          result.warnings.length,
          " \u6761\u68C0\u7D22\u8B66\u544A\uFF09"
        ] })
      ] }),
      result.method_families.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, margin: "10px 0 6px" }, children: "\u65B9\u6CD5\u65CF\uFF08\u622A\u6B62\u65E5\u524D\u6587\u732E\uFF09" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }, children: result.method_families.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12, padding: "4px 10px", borderRadius: 999, background: pal.accentSoft, color: pal.accent }, children: [
          f.family,
          " \xB7 ",
          f.papers,
          " \u7BC7"
        ] }, f.family)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, margin: "10px 0 6px" }, children: "\u622A\u6B62\u65E5\u524D\u6587\u732E\u65F6\u95F4\u7EBF" }),
      [...result.pre_cutoff].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 6, padding: "8px 12px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.muted }, children: [
            "[",
            p.date,
            "]"
          ] }),
          " ",
          p.title,
          p.method_families.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color: pal.accent }, children: [
            " \xB7 ",
            p.method_families.join("/")
          ] })
        ] }),
        p.doi && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: p.doi, target: "_blank", rel: "noreferrer", style: { fontSize: 11, color: pal.accent }, children: p.doi })
      ] }, p.id)),
      result.quarantined.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, margin: "12px 0 6px", color: pal.warn }, children: "\u5DF2\u9694\u79BB\uFF08\u622A\u6B62\u65E5\u540E \u2014 \u4EC5\u8D5B\u540E\u590D\u76D8\u53EF\u7528\uFF09" }),
        result.quarantined.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, style: { marginBottom: 6, padding: "8px 12px", opacity: 0.65 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.warn }, children: [
            "[",
            p.date,
            "]"
          ] }),
          " ",
          p.title
        ] }) }, p.id))
      ] }),
      result.hypotheses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, margin: "12px 0 6px" }, children: "\u5EFA\u6A21\u5047\u8BBE\uFF08\u7531\u771F\u5B9E\u6587\u732E\u65B9\u6CD5\u65CF\u751F\u6210\uFF09" }),
        result.hypotheses.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { marginBottom: 6, padding: "9px 12px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12.5 }, children: h.hypothesis }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 3 }, children: h.next })
        ] }, i))
      ] })
    ] })
  ] });
}
function Profile({ pal }) {
  const [data, setData] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    jget(`${API}/profile?user_id=demo`).then(setData);
  }, []);
  if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24, fontSize: 13, color: pal.muted }, children: "\u52A0\u8F7D\u753B\u50CF\u2026" });
  const models = (data.models ?? []).slice().sort((a, b) => a.score - b.score);
  const weak = data.weak_units ?? [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "14px 16px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 }, children: "\u6A21\u578B\u638C\u63E1\u5EA6\uFF08\u5347\u5E8F\uFF09" }),
      models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.item_id }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: m.score < 40 ? pal.danger : m.score < 60 ? pal.warn : pal.ok }, children: [
            m.score,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 5, borderRadius: 3, background: pal.border, marginTop: 3 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: `${m.score}%`, height: "100%", borderRadius: 3, background: m.score < 40 ? pal.danger : m.score < 60 ? pal.warn : pal.ok } }) })
      ] }, m.item_id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "14px 16px", marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u8584\u5F31\u77E5\u8BC6\u5355\u5143\uFF08<50%\uFF09" }),
        weak.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted }, children: "\u6682\u65E0" }),
        weak.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, marginBottom: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: pal.danger }, children: w.item_id }),
          " \xB7 ",
          w.score,
          "%"
        ] }, w.item_id))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "14px 16px", marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: [
          "\u8FD1\u671F\u9519\u9898\uFF08",
          data.quiz_total,
          " \u6B21\u6D4B\u9A8C\uFF09"
        ] }),
        (data.recent_mistakes ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted }, children: "\u6682\u65E0" }),
        (data.recent_mistakes ?? []).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, marginBottom: 4 }, children: [
          a.quiz_id,
          " \xB7 ",
          a.created_at?.slice(0, 16).replace("T", " ")
        ] }, i))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "14px 16px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "\u8BC4\u5BA1\u5F31\u70B9\uFF08\u6765\u81EA\u9879\u76EE\uFF09" }),
        (data.reviewer_findings ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted }, children: "\u6682\u65E0 \u2014 \u5B8C\u6210\u4E00\u6B21\u9879\u76EE\u8BC4\u5BA1\u540E\u663E\u793A" }),
        (data.reviewer_findings ?? []).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, marginBottom: 5 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: f.dimension }),
          "\uFF08",
          f.score,
          "\uFF09",
          f.note,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: pal.muted }, children: [
            "\u2192 ",
            f.knowledge_units?.join("\u3001")
          ] })
        ] }, i)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: pal.muted, marginTop: 6 }, children: [
          "Gym \u8BAD\u7EC3\uFF1A",
          data.gym?.attempts ?? 0,
          " \u6B21"
        ] })
      ] })
    ] })
  ] }) });
}
function Problems({ pal }) {
  const [resources, setResources] = (0, import_react.useState)([]);
  (0, import_react.useEffect)(() => {
    jget(`${API}/resources`).then((d) => setResources(d.resources ?? []));
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12.5, color: pal.muted, marginTop: 0 }, children: "\u8D44\u6E90\u6CE8\u518C\u8868\uFF1A\u5916\u94FE + \u5143\u6570\u636E\uFF08\u4E0D\u590D\u5236\u53D7\u7248\u6743\u4FDD\u62A4\u7684\u9898\u76EE\u5168\u6587\uFF09\u3002\u6765\u6E90\uFF1Achengziyue benchmark \u5143\u6570\u636E / \u5B98\u65B9\u9875\u9762 / zhanwen \u7D22\u5F15\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gap: 8 }, children: resources.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 13, fontWeight: 600 }, children: [
        r.title,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color: pal.muted, fontWeight: 400 }, children: [
          r.contest,
          " ",
          r.year
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11.5, color: pal.muted, marginTop: 4 }, children: [
        "\u7C7B\u578B ",
        r.type,
        " \xB7 \u6807\u7B7E ",
        (r.tags ?? []).join("\u3001"),
        " \xB7 \u8BB8\u53EF\uFF1A",
        r.license_note
      ] }),
      r.source_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: r.source_url, target: "_blank", rel: "noreferrer", style: { fontSize: 12, color: pal.accent }, children: "\u6253\u5F00\u6765\u6E90 \u2197" })
    ] }, r.id)) })
  ] });
}
function Cases({ pal }) {
  const [cases, setCases] = (0, import_react.useState)([]);
  const [active, setActive] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    jget(`${API}/cases`).then((d) => {
      setCases(d.cases ?? []);
      if ((d.cases ?? []).length > 0) setActive(d.cases[0]);
    });
  }, []);
  if (!active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24, fontSize: 13, color: pal.muted }, children: "\u52A0\u8F7D\u6848\u4F8B\u2026" });
  const ref = active.problem_ref ?? {};
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, { pal, primary: active.id === c.id, onClick: () => setActive(c), children: c.title }, c.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "12px 16px", marginBottom: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, fontWeight: 600 }, children: [
        "\u771F\u9898\u6765\u6E90\uFF1A",
        ref.contest,
        "\u300C",
        ref.title,
        "\u300D"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, marginTop: 6, display: "flex", gap: 16 }, children: [
        ref.official_link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: ref.official_link, target: "_blank", rel: "noreferrer", style: { color: pal.accent }, children: "\u5B98\u65B9\u8D5B\u9898\u5165\u53E3 \u2197" }),
        ref.paper_discovery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: ref.paper_discovery, target: "_blank", rel: "noreferrer", style: { color: pal.accent }, children: "\u83B7\u5956\u8BBA\u6587\u53D1\u73B0\uFF08\u83B7\u5956\u540D\u5355\u76EE\u5F55\uFF09\u2197" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: pal.muted, marginTop: 6 }, children: "\u672C\u6848\u4F8B\u4E3A\u6211\u4EEC\u5BF9\u516C\u5F00\u771F\u9898\u7684\u6559\u5B66\u84B8\u998F\uFF0C\u975E\u5B98\u65B9\u8BC4\u5206\uFF0C\u4E5F\u4E0D\u4EE3\u8868\u4EFB\u4F55\u4E00\u7BC7\u5177\u4F53\u83B7\u5956\u8BBA\u6587\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { pal, style: { padding: "16px 18px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 14, fontWeight: 700, marginBottom: 8 }, children: [
        active.title,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11.5, color: pal.muted, fontWeight: 400 }, children: active.problem_type })
      ] }),
      Object.entries(active.distillation ?? {}).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12.5, marginBottom: 8, lineHeight: 1.7 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
          k,
          "\uFF1A"
        ] }),
        Array.isArray(v) ? v.join("\uFF1B") : String(v)
      ] }, k)),
      active.knowledge_units?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, color: pal.accent, marginTop: 8 }, children: [
        "\u5173\u8054\u77E5\u8BC6\u5355\u5143\uFF1A",
        active.knowledge_units.join("\u3001")
      ] })
    ] })
  ] });
}
function Lab({ pal }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "18px 22px", height: "100%", overflow: "auto" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12.5, color: pal.muted, marginTop: 0 }, children: "\u72EC\u7ACB\u5B9E\u9A8C\u53F0\u4E0E\u6BD4\u8D5B\u5DE5\u4F5C\u53F0\u300C\u5B9E\u9A8C\u300D\u9636\u6BB5\u5171\u7528\u540C\u4E00 Provider\u3002\u5EFA\u8BAE\u5728\u9879\u76EE\u5185\u4F7F\u7528\u4EE5\u83B7\u5F97 manifest \u4E0E\u8BC1\u636E\u94FE\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { pal, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13 }, children: "\u53EF\u7528\u7B97\u6CD5\uFF1Akmeans\uFF08\u591A seed \u805A\u7C7B\uFF09\xB7 topsis \xB7 entropy-weight \xB7 linear-regression\uFF08OLS + \u6B8B\u5DEE\uFF09\xB7 pso\uFF08sphere/rastrigin/rosenbrock\uFF0C \u6536\u655B\u66F2\u7EBF\uFF09\u3002\u6BCF\u6B21\u8FD0\u884C\u8BB0\u5F55 run_id / input_hash / \u53C2\u6570 / seed / \u6307\u6807 / \u4EA7\u7269\u54C8\u5E0C \u2014 \u4E0D\u865A\u6784\u7ED3\u679C\u3002" }) })
  ] });
}
function styles(pal) {
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
      alignItems: "center"
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
    }
  };
}
var currentCtx;
function readCurrentSessionId() {
  try {
    return currentCtx?.sessions?.list?.getSnapshot?.()?.current;
  } catch {
    return void 0;
  }
}
function SessionSwitcher({ pal }) {
  const [current, setCurrent] = (0, import_react.useState)(null);
  const [sessions, setSessions] = (0, import_react.useState)([]);
  const [open, setOpen] = (0, import_react.useState)(false);
  const refresh = () => {
    try {
      const snap = currentCtx?.sessions?.list?.getSnapshot?.() ?? {};
      setCurrent(snap.current ?? null);
      const ids = snap.ids ?? Object.keys(snap.byId ?? {});
      setSessions(
        ids.slice(0, 12).map((id) => ({
          id,
          title: snap.byId?.[id]?.title || `${id.slice(0, 8)}\u2026`
        }))
      );
    } catch {
    }
  };
  (0, import_react.useEffect)(() => {
    refresh();
    const t = setInterval(refresh, 3e3);
    return () => clearInterval(t);
  }, []);
  const newSession = async () => {
    try {
      const mgr = currentCtx?.sessions;
      if (typeof mgr?.create === "function") {
        await mgr.create({});
      } else if (typeof mgr?.newSession === "function") {
        await mgr.newSession();
      }
      setTimeout(refresh, 600);
    } catch {
    }
  };
  const switchTo = async (id) => {
    try {
      const mgr = currentCtx?.sessions;
      if (typeof mgr?.open === "function") await mgr.open(id);
    } catch {
    }
    setOpen(false);
    setTimeout(refresh, 600);
  };
  const currentTitle = sessions.find((s) => s.id === current)?.title ?? current?.slice(0, 8) ?? "\u2026";
  const [contextLine, setContextLine] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    if (!current) return;
    jget(`${API}/context?session_id=${current}`).then((d) => {
      const c = d.context;
      if (c && (c.model_id || c.knowledge_unit)) {
        setContextLine(`context: ${c.model_id ?? "\u2014"}${c.knowledge_unit ? ` \xB7 ${c.knowledge_unit}` : ""}`);
      } else setContextLine("");
    });
  }, [current]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u6570\u6A21 Agent" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "button",
        {
          type: "button",
          onClick: () => {
            refresh();
            setOpen(!open);
          },
          style: { border: "none", background: "none", color: pal.muted, cursor: "pointer", fontSize: 11.5, padding: 0 },
          children: [
            "\u5F53\u524D\uFF1A",
            currentTitle,
            " \u25BE"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          onClick: newSession,
          title: "\u65B0\u5EFA\u4F1A\u8BDD",
          style: { border: "none", background: "none", color: pal.accent, cursor: "pointer", fontSize: 11.5, padding: 0 },
          children: "+ \u65B0\u4F1A\u8BDD"
        }
      )
    ] }),
    contextLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10.5, color: pal.muted, marginTop: 2 }, children: contextLine }),
    open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        style: {
          position: "absolute",
          top: "100%",
          left: 0,
          zIndex: 80,
          minWidth: 220,
          maxHeight: 260,
          overflow: "auto",
          background: pal.cardBg,
          border: `1px solid ${pal.border}`,
          borderRadius: 8,
          boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
          padding: 4
        },
        children: [
          sessions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, color: pal.muted, padding: 6 }, children: "\u6682\u65E0\u4F1A\u8BDD\u8BB0\u5F55" }),
          sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              onClick: () => switchTo(s.id),
              style: {
                fontSize: 12,
                padding: "6px 8px",
                borderRadius: 6,
                cursor: "pointer",
                background: s.id === current ? pal.accentSoft : "transparent",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              },
              children: s.title
            },
            s.id
          ))
        ]
      }
    )
  ] });
}
function ShellFrame({ renderSlot }) {
  const pal = useThemePalette();
  const S = styles(pal);
  const [active, setActive] = (0, import_react.useState)(loadSection);
  const [lessonModel, setLessonModel] = (0, import_react.useState)("kmeans");
  const [narrow, setNarrow] = (0, import_react.useState)(() => typeof window !== "undefined" ? window.innerWidth <= 1180 : false);
  const [agentOpen, setAgentOpen] = (0, import_react.useState)(() => typeof window !== "undefined" ? window.innerWidth > 1180 : true);
  (0, import_react.useEffect)(() => {
    const mq = window.matchMedia("(max-width: 1180px)");
    const onChange = () => {
      setNarrow(mq.matches);
      setAgentOpen(!mq.matches);
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
      body: JSON.stringify({ page: "lesson", module: "atlas", model_id: modelId, ...sid ? { session_id: sid } : {} })
    }).catch(() => {
    });
    setLessonModel(modelId);
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "lesson"), "data-mm-section": "lesson", children: lessonModel === "kmeans" ? renderSlot("mathmodel.workbench", {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepLesson, { pal, modelId: lessonModel ?? "" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "review"), "data-mm-section": "review", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyReview, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "gym"), "data-mm-section": "gym", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gym, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "competition"), "data-mm-section": "competition", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Competition, { pal, onNavigate: navigate }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "problems"), "data-mm-section": "problems", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Problems, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "cases"), "data-mm-section": "cases", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cases, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "lab"), "data-mm-section": "lab", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lab, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "paper"), "data-mm-section": "paper", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperLab, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "literature"), "data-mm-section": "literature", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiteratureResearch, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "reviewer"), "data-mm-section": "reviewer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviewer, { pal }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pane(active === "profile"), "data-mm-section": "profile", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Profile, { pal }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: agentStyle, "data-mm-agent": true, "data-mm-agent-open": agentOpen ? "1" : "0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.chatHeader, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionSwitcher, { pal }),
        narrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            onClick: () => setAgentOpen(false),
            style: { border: "none", background: "none", color: pal.fg, cursor: "pointer", fontSize: 12 },
            children: "\u2715"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.chatBody, children: renderSlot("conversation", {}) })
    ] }),
    narrow && !agentOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: S.fab, onClick: () => setAgentOpen(true), "data-mm-agent-fab": true, children: "\u{1F4AC} Agent" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "none" }, "aria-hidden": true, children: renderSlot("details", {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 40 }, "data-shell-overlay": true, children: renderSlot("shell.overlay", {}) })
  ] });
}
function loadSection() {
  try {
    const v = sessionStorage.getItem(NAV_KEY);
    if (v && ALL_ITEMS.some((n) => n.id === v)) return v;
  } catch {
  }
  return "dashboard";
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
