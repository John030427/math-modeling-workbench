// src/client/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var NAV_ITEMS = [
  "Dashboard",
  "Model Atlas",
  "Training",
  "Competition",
  "Problems",
  "Cases",
  "Paper",
  "Profile"
];
function MathModelNav() {
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      style: {
        padding: "12px 10px",
        fontSize: 13,
        lineHeight: 1.6,
        borderRight: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.25))",
        height: "100%",
        background: "var(--dsw-specific-sidebar-fill, #111)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, marginBottom: 12 }, children: "\u{1F4D0} MathModel" }),
        NAV_ITEMS.map((label) => /* @__PURE__ */ jsx("div", { style: { padding: "4px 6px", opacity: 0.85 }, children: label }, label)),
        /* @__PURE__ */ jsx("div", { style: { marginTop: 16, fontSize: 11, opacity: 0.55 }, children: "Harness Spike layout" })
      ]
    }
  );
}
function HarnessFrame({ renderSlot }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "220px minmax(0, 1fr) minmax(360px, 42vw)",
        height: "100%",
        background: "var(--dsh-bg, #1a1a1a)",
        color: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { minWidth: 0, overflow: "hidden" }, children: renderSlot("mathmodel.nav", {}) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              minWidth: 0,
              overflow: "auto",
              borderRight: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.25))"
            },
            children: renderSlot("mathmodel.workbench", {})
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { minWidth: 0, overflow: "hidden" }, children: renderSlot("conversation", {}) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 20 },
            "data-shell-overlay": true,
            children: renderSlot("shell.overlay", {})
          }
        )
      ]
    }
  );
}
var inject = ["slots"];
function apply(ctx) {
  ctx.effect(() => {
    const disposeRoot = ctx.slots.register(
      {
        name: "root",
        children: {
          "mathmodel.nav": { kind: "single", scope: "root" },
          "mathmodel.workbench": { kind: "single", scope: "session" },
          conversation: { kind: "single", scope: "session-maybe" },
          "shell.overlay": { kind: "list", scope: "root" }
        },
        inject: () => ({})
      },
      HarnessFrame
    );
    const disposeNav = ctx.slots.register(
      { name: "mathmodel.nav", id: "mathmodel-harness-nav" },
      MathModelNav
    );
    return () => {
      disposeNav();
      disposeRoot();
    };
  }, "harness-spike: root layout");
}
export {
  apply,
  inject
};
