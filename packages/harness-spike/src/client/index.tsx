import type { ReactNode } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

const NAV_ITEMS = [
  'Dashboard',
  'Model Atlas',
  'Training',
  'Competition',
  'Problems',
  'Cases',
  'Paper',
  'Profile',
]

function MathModelNav() {
  return (
    <nav
      style={{
        padding: '12px 10px',
        fontSize: 13,
        lineHeight: 1.6,
        borderRight: '1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.25))',
        height: '100%',
        background: 'var(--dsw-specific-sidebar-fill, #111)',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 12 }}>📐 MathModel</div>
      {NAV_ITEMS.map((label) => (
        <div key={label} style={{ padding: '4px 6px', opacity: 0.85 }}>{label}</div>
      ))}
      <div style={{ marginTop: 16, fontSize: 11, opacity: 0.55 }}>Harness Spike layout</div>
    </nav>
  )
}

type FrameProps = {
  renderSlot: (key: string, owner: Record<string, unknown>) => ReactNode
}

/** Three columns: MathModel Nav | Workbench | DSH Conversation */
function HarnessFrame({ renderSlot }: FrameProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '220px minmax(0, 1fr) minmax(360px, 42vw)',
        height: '100%',
        background: 'var(--dsh-bg, #1a1a1a)',
        color: 'inherit',
      }}
    >
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        {renderSlot('mathmodel.nav', {})}
      </div>
      <div
        style={{
          minWidth: 0,
          overflow: 'auto',
          borderRight: '1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.25))',
        }}
      >
        {renderSlot('mathmodel.workbench', {})}
      </div>
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        {renderSlot('conversation', {})}
      </div>
      <div
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20 }}
        data-shell-overlay
      >
        {renderSlot('shell.overlay', {})}
      </div>
    </div>
  )
}

export const inject = ['slots']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const disposeRoot = ctx.slots.register(
      {
        name: 'root',
        children: {
          'mathmodel.nav': { kind: 'single', scope: 'root' },
          'mathmodel.workbench': { kind: 'single', scope: 'session' },
          conversation: { kind: 'single', scope: 'session-maybe' },
          'shell.overlay': { kind: 'list', scope: 'root' },
        },
        inject: () => ({}),
      },
      HarnessFrame,
    )

    const disposeNav = ctx.slots.register(
      { name: 'mathmodel.nav', id: 'mathmodel-harness-nav' },
      MathModelNav,
    )

    return () => {
      disposeNav()
      disposeRoot()
    }
  }, 'harness-spike: root layout')
}
