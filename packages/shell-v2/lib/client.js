window.__ModuleLoader__.load({
  id: "@math-modeling/shell-v2",
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
var NAV_KEY = "mm-shell-v2.section";
var NAV = [
  { id: "dashboard", label: "\u4EEA\u8868\u76D8", icon: "\u{1F4CA}" },
  { id: "workbench", label: "\u5EFA\u6A21\u5DE5\u4F5C\u53F0", icon: "\u{1F9EA}" },
  { id: "training", label: "\u8BAD\u7EC3", icon: "\u{1F3AF}" },
  { id: "competition", label: "\u7ADE\u8D5B", icon: "\u{1F3C6}" },
  { id: "problems", label: "\u4E60\u9898", icon: "\u{1F4DD}" },
  { id: "cases", label: "\u6848\u4F8B", icon: "\u{1F4DA}" },
  { id: "paper", label: "\u8BBA\u6587", icon: "\u{1F4C4}" },
  { id: "profile", label: "\u753B\u50CF", icon: "\u{1F464}" }
];
var SECTION_META = {
  dashboard: { title: "\u4EEA\u8868\u76D8", sub: "\u6A21\u578B\u6CE8\u518C\u8868\u603B\u89C8 \xB7 \u70B9\u51FB\u5361\u7247\u8FDB\u5165\u5DE5\u4F5C\u53F0" },
  workbench: { title: "\u5EFA\u6A21\u5DE5\u4F5C\u53F0", sub: "Atlas \xB7 \u8BFE\u7A0B \xB7 \u6D4B\u9A8C \xB7 \u638C\u63E1\u5EA6" },
  training: { title: "\u8BAD\u7EC3", sub: "\u6BCF\u65E5\u590D\u4E60\u4E0E\u523B\u610F\u7EC3\u4E60" },
  competition: { title: "\u7ADE\u8D5B", sub: "\u8D5B\u7A0B \xB7 \u771F\u9898 \xB7 \u8BBA\u6587\u5199\u4F5C" },
  problems: { title: "\u4E60\u9898", sub: "\u6309\u77E5\u8BC6\u70B9\u7EC4\u7EC7\u7684\u5C0F\u9898" },
  cases: { title: "\u6848\u4F8B", sub: "\u5B8C\u6574\u5EFA\u6A21\u6848\u4F8B\u8D70\u8BFB" },
  paper: { title: "\u8BBA\u6587", sub: "\u8BBA\u6587\u7CBE\u8BFB\u4E0E\u5DEE\u8DDD\u5206\u6790" },
  profile: { title: "\u753B\u50CF", sub: "\u4E2A\u4EBA\u638C\u63E1\u5EA6\u753B\u50CF" }
};
var S = {
  frame: {
    display: "grid",
    gridTemplateColumns: "236px minmax(0, 1.15fr) minmax(380px, 1fr)",
    height: "100%",
    width: "100%",
    background: "var(--dsh-bg, #141414)",
    color: "inherit",
    overflow: "hidden"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    borderRight: "1px solid rgba(128,128,128,0.25)",
    overflow: "hidden"
  },
  brand: {
    padding: "14px 16px 12px",
    borderBottom: "1px solid rgba(128,128,128,0.22)"
  },
  brandTitle: {
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 0.2
  },
  brandSub: {
    fontSize: 11,
    opacity: 0.55,
    marginTop: 3
  },
  navList: {
    padding: "8px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    userSelect: "none",
    background: active ? "rgba(91,140,255,0.16)" : "transparent",
    boxShadow: active ? "inset 2px 0 0 var(--mm-accent, #5b8cff)" : "none",
    opacity: active ? 1 : 0.78,
    transition: "background 120ms ease, opacity 120ms ease"
  }),
  navSeat: {
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    borderTop: "1px solid rgba(128,128,128,0.18)"
  },
  main: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(128,128,128,0.25)",
    overflow: "hidden"
  },
  mainHeader: {
    padding: "10px 16px",
    borderBottom: "1px solid rgba(128,128,128,0.2)",
    display: "flex",
    alignItems: "baseline",
    gap: 10
  },
  mainTitle: { fontSize: 14, fontWeight: 600 },
  mainSub: { fontSize: 12, opacity: 0.55 },
  mainBody: { flex: 1, minHeight: 0, position: "relative" },
  sectionPane: (visible) => ({
    position: "absolute",
    inset: 0,
    overflow: "auto",
    display: visible ? "block" : "none"
  }),
  chat: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  chatHeader: {
    padding: "9px 14px",
    borderBottom: "1px solid rgba(128,128,128,0.2)",
    fontSize: 12,
    opacity: 0.65,
    display: "flex",
    justifyContent: "space-between"
  },
  chatBody: { flex: 1, minHeight: 0 }
};
function loadNav() {
  try {
    const v = sessionStorage.getItem(NAV_KEY);
    if (v && NAV.some((n) => n.id === v)) return v;
  } catch {
  }
  return "dashboard";
}
function saveNav(id) {
  try {
    sessionStorage.setItem(NAV_KEY, id);
  } catch {
  }
}
var DIFFICULTY_COLOR = {
  beginner: "#3fb26f",
  intermediate: "#d9913b",
  advanced: "#e05656"
};
function Dashboard({ onSelect }) {
  const [models, setModels] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let alive = true;
    fetch(`${API}/registry`).then((r) => r.json()).then((d) => {
      if (alive) setModels(d.models ?? []);
    }).catch((e) => {
      if (alive) setError(String(e));
    });
    return () => {
      alive = false;
    };
  }, []);
  if (error)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 24, fontSize: 13, opacity: 0.7 }, children: [
      "\u6CE8\u518C\u8868\u52A0\u8F7D\u5931\u8D25\uFF1A",
      error,
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "mm-btn ghost", style: { marginLeft: 12 }, onClick: () => location.reload(), children: "\u91CD\u8BD5" })
    ] });
  if (!models)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: 24, fontSize: 13, opacity: 0.55 }, children: "\u52A0\u8F7D\u6CE8\u518C\u8868\u2026" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      style: {
        padding: "18px 20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 14,
        alignContent: "start"
      },
      children: models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          onClick: () => onSelect(m.id),
          title: "\u70B9\u51FB\u8FDB\u5165\u5EFA\u6A21\u5DE5\u4F5C\u53F0",
          style: {
            border: "1px solid rgba(128,128,128,0.28)",
            borderRadius: 10,
            padding: "14px 16px",
            cursor: "pointer",
            background: "rgba(128,128,128,0.06)",
            transition: "border-color 120ms ease, background 120ms ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "var(--mm-accent, #5b8cff)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "rgba(128,128,128,0.28)";
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { fontSize: 14 }, children: m.name_zh || m.name }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "span",
                {
                  style: {
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 999,
                    color: "#fff",
                    background: DIFFICULTY_COLOR[m.difficulty ?? ""] ?? "rgba(128,128,128,0.6)"
                  },
                  children: m.difficulty ?? "\u2014"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, opacity: 0.5, marginTop: 2 }, children: m.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 12, opacity: 0.75, marginTop: 8, lineHeight: 1.5 }, children: m.summary ?? "" })
          ]
        },
        m.id
      ))
    }
  );
}
function Placeholder({ section }) {
  const meta = SECTION_META[section];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      style: {
        margin: 24,
        border: "1px dashed rgba(128,128,128,0.35)",
        borderRadius: 12,
        padding: "48px 32px",
        textAlign: "center"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 34 }, children: NAV.find((n) => n.id === section)?.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 600, marginTop: 10 }, children: meta.title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: 12, opacity: 0.6, marginTop: 6 }, children: [
          "\u89C4\u5212\u4E2D \u2014 \u5C06\u5728 Shell V2 \u95E8\u7981 H1\u2013H5 \u5168\u90E8\u901A\u8FC7\u540E\u542F\u52A8",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
          "\uFF08\u89C1 MATHMODEL_HARNESS_SHELL_V2_PLAN.md \xA73\uFF09"
        ] })
      ]
    }
  );
}
function ShellFrame({ renderSlot }) {
  const [active, setActive] = (0, import_react.useState)(loadNav);
  const navigate = (id) => {
    setActive(id);
    saveNav(id);
  };
  const selectModel = (modelId) => {
    const sid = readCurrentSessionId();
    void fetch(`${API}/context`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ page: "atlas", model_id: modelId, ...sid ? { session_id: sid } : {} })
    }).catch(() => {
    });
    navigate("workbench");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { "data-mm-shell": "v2", style: S.frame, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { style: S.nav, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.brand, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.brandTitle, children: "\u{1F4D0} MathModel \u5DE5\u4F5C\u53F0" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.brandSub, children: "Shell V2 \xB7 learn \u2192 practice \u2192 compete" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { style: S.navList, children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          style: S.navItem(active === n.id),
          onClick: () => navigate(n.id),
          role: "tab",
          "aria-selected": active === n.id,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 15 }, children: n.icon }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label })
          ]
        },
        n.id
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.navSeat, children: renderSlot("sidebar", { collapsed: false, width: 236 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { style: S.main, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.mainHeader, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.mainTitle, children: SECTION_META[active].title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.mainSub, children: SECTION_META[active].sub })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.mainBody, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.sectionPane(active === "dashboard"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, { onSelect: selectModel }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.sectionPane(active === "workbench"), children: renderSlot("mathmodel.workbench", {}) }),
        ["training", "competition", "problems", "cases", "paper", "profile"].map(
          (id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.sectionPane(active === id), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Placeholder, { section: id }) }, id)
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: S.chat, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.chatHeader, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Agent \u5BF9\u8BDD\uFF08\u539F\u751F\uFF09" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/modeling-tutor \u53EF\u7528" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.chatBody, children: renderSlot("conversation", {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "none" }, "aria-hidden": true, children: renderSlot("details", {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 40 }, "data-shell-overlay": true, children: renderSlot("shell.overlay", {}) })
  ] });
}
function createLayoutStub() {
  return {
    toggleSidebar() {
    },
    openDetails() {
    },
    closeDetails() {
    }
  };
}
function readCurrentSessionId() {
  try {
    return currentCtx?.sessions?.list?.getSnapshot?.()?.current;
  } catch {
    return void 0;
  }
}
var currentCtx;
var inject = ["slots", "sessions"];
function apply(ctx) {
  currentCtx = ctx;
  const disposeLayout = ctx.reflect.provide("layout", createLayoutStub());
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
    "shell-v2: dispose"
  );
}

    return module.exports;
  }
});
