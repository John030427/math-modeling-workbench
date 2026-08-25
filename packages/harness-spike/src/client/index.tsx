import type { ReactNode } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

const NAV_SECTIONS = [
  'Dashboard',
  'Model Atlas',
  'Training',
  'Competition',
  'Problems',
  'Cases',
  'Paper',
  'Profile',
]

type FrameProps = {
  renderSlot: (key: string, owner: Record<string, unknown>) => ReactNode
}

function HarnessFrame({ renderSlot }: FrameProps) {
  return (
    <div
      data-mathmodel-harness="true"
      style={{
        display: 'grid',
        gridTemplateColumns: '260px minmax(0, 1.1fr) minmax(360px, 1fr)',
        height: '100%',
        width: '100%',
        background: 'var(--dsh-bg, #141414)',
        color: 'inherit',
        overflow: 'hidden',
      }}
    >
      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          borderRight: '1px solid rgba(128,128,128,0.28)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '10px 12px',
            borderBottom: '1px solid rgba(128,128,128,0.28)',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          📐 MathModel Harness
          <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.6, marginTop: 2 }}>
            Live Gate · nav | workbench | chat
          </div>
        </div>
        <div
          style={{
            padding: '8px 10px',
            fontSize: 12,
            opacity: 0.85,
            borderBottom: '1px solid rgba(128,128,128,0.2)',
          }}
        >
          {NAV_SECTIONS.map((label) => (
            <div key={label} style={{ padding: '3px 4px' }}>
              {label}
            </div>
          ))}
        </div>
        {/* Official ui-sidebar fills this seat and declares footer.action children */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {renderSlot('sidebar', { collapsed: false, width: 260 })}
        </div>
      </aside>

      <main
        style={{
          minWidth: 0,
          overflow: 'auto',
          borderRight: '1px solid rgba(128,128,128,0.28)',
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(128,128,128,0.28)',
            fontSize: 12,
            opacity: 0.75,
          }}
        >
          MathModel Workbench
        </div>
        <div style={{ height: 'calc(100% - 37px)', overflow: 'auto' }}>
          {renderSlot('mathmodel.workbench', {})}
        </div>
      </main>

      <section style={{ minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(128,128,128,0.28)',
            fontSize: 12,
            opacity: 0.75,
          }}
        >
          DSH Conversation (native)
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>{renderSlot('conversation', {})}</div>
      </section>

      <div style={{ display: 'none' }} aria-hidden>
        {renderSlot('details', {})}
      </div>

      <div
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }}
        data-shell-overlay
      >
        {renderSlot('shell.overlay', {})}
      </div>
    </div>
  )
}

function createLayoutStub() {
  return {
    toggleSidebar() {},
    openDetails() {},
    closeDetails() {},
  }
}

export const inject = ['slots']

/**
 * Replace ui-layout root only. Keep ui-sidebar as the sidebar occupant so
 * sidebar.footer.action is declared by the official plugin (no double-register).
 * Provide ctx.layout stub so ui-sidebar inject resolves.
 * Package sets dsh.client.immediately=true so this runs before late footer plugins.
 */
export function apply(ctx: ClientContext): void {
  const disposeLayout = (
    ctx as unknown as { reflect: { provide: (n: string, v: unknown) => () => void } }
  ).reflect.provide('layout', createLayoutStub())

  const disposeRoot = ctx.slots.register(
    {
      name: 'root',
      children: {
        sidebar: { kind: 'single', scope: 'root' },
        conversation: { kind: 'single', scope: 'session-maybe' },
        details: { kind: 'single', scope: 'session' },
        'shell.overlay': { kind: 'list', scope: 'root' },
        'mathmodel.workbench': { kind: 'single', scope: 'session' },
      },
      inject: () => ({}),
    },
    HarnessFrame,
  )

  ctx.effect(
    () => () => {
      disposeRoot()
      disposeLayout()
    },
    'harness-spike: dispose',
  )
}
