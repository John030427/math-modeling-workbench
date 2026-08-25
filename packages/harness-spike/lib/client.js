window.__ModuleLoader__.load({
  id: "@math-modeling/harness-spike",
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
var import_jsx_runtime = require("react/jsx-runtime");
var NAV_SECTIONS = [
  "Dashboard",
  "Model Atlas",
  "Training",
  "Competition",
  "Problems",
  "Cases",
  "Paper",
  "Profile"
];
function HarnessFrame({ renderSlot }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      "data-mathmodel-harness": "true",
      style: {
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1.1fr) minmax(360px, 1fr)",
        height: "100%",
        width: "100%",
        background: "var(--dsh-bg, #141414)",
        color: "inherit",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "aside",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              borderRight: "1px solid rgba(128,128,128,0.28)",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  style: {
                    padding: "10px 12px",
                    borderBottom: "1px solid rgba(128,128,128,0.28)",
                    fontWeight: 700,
                    fontSize: 14
                  },
                  children: [
                    "\u{1F4D0} MathModel Harness",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, fontWeight: 400, opacity: 0.6, marginTop: 2 }, children: "Live Gate \xB7 nav | workbench | chat" })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "div",
                {
                  style: {
                    padding: "8px 10px",
                    fontSize: 12,
                    opacity: 0.85,
                    borderBottom: "1px solid rgba(128,128,128,0.2)"
                  },
                  children: NAV_SECTIONS.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "3px 4px" }, children: label }, label))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: renderSlot("sidebar", { collapsed: false, width: 260 }) })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "main",
          {
            style: {
              minWidth: 0,
              overflow: "auto",
              borderRight: "1px solid rgba(128,128,128,0.28)"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "div",
                {
                  style: {
                    padding: "8px 12px",
                    borderBottom: "1px solid rgba(128,128,128,0.28)",
                    fontSize: 12,
                    opacity: 0.75
                  },
                  children: "MathModel Workbench"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "calc(100% - 37px)", overflow: "auto" }, children: renderSlot("mathmodel.workbench", {}) })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: { minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              style: {
                padding: "8px 12px",
                borderBottom: "1px solid rgba(128,128,128,0.28)",
                fontSize: 12,
                opacity: 0.75
              },
              children: "DSH Conversation (native)"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, minHeight: 0 }, children: renderSlot("conversation", {}) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "none" }, "aria-hidden": true, children: renderSlot("details", {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 40 },
            "data-shell-overlay": true,
            children: renderSlot("shell.overlay", {})
          }
        )
      ]
    }
  );
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
var inject = ["slots"];
function apply(ctx) {
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
    HarnessFrame
  );
  ctx.effect(
    () => () => {
      disposeRoot();
      disposeLayout();
    },
    "harness-spike: dispose"
  );
}

    return module.exports;
  }
});
