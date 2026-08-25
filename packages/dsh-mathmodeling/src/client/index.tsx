import { useEffect, useState } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar'
import type {} from '@deepseek-ai/dsh-client-ui-conversation'
import type {} from '@deepseek-ai/dsh-client-ui-layout'
import { ModelingWorkbench, type ModelingApi } from '@math-modeling/ui'

const API = '/api/mathmodeling'
const STYLE_ID = 'dsh-mathmodeling-ui-styles'
const OVERLAY_EVENT = 'dsh-mathmodeling:overlay'

function ensureUiStyles() {
  if (document.getElementById(STYLE_ID)) return
  const link = document.createElement('link')
  link.id = STYLE_ID
  link.rel = 'stylesheet'
  link.href = '/api/mathmodeling/assets/ui.css'
  document.head.appendChild(link)
}

function createApi(sessionId: string): ModelingApi {
  return {
    fetchRegistry: async () => {
      const res = await fetch(`${API}/registry`)
      const data = await res.json()
      return { models: data.models ?? [] }
    },
    fetchModel: async (id: string) => {
      const res = await fetch(`${API}/registry/${id}`)
      const data = await res.json()
      return data.model
    },
    fetchQuizzes: async (modelId: string) => {
      const res = await fetch(`${API}/quizzes/${modelId}`)
      const data = await res.json()
      return { questions: data.questions ?? [] }
    },
    submitQuiz: async (body) => {
      const res = await fetch(`${API}/quiz/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...body, session_id: sessionId, user_id: 'demo' }),
      })
      const data = await res.json()
      return {
        correct: data.correct,
        explanation: data.explanation,
        mastery: data.mastery,
        answer: data.answer,
      }
    },
    patchContext: async (patch) => {
      await fetch(`${API}/context`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...patch, session_id: sessionId }),
      })
    },
  }
}

type SessionInject = {
  sessionId: string
  setDraft?: (text: string) => void
  setView?: (id: string) => void
}

type ViewProps = SessionInject

/** Primary surface: conversation.view tab「数模工作台」. */
function MathModelingView({ sessionId, setDraft }: ViewProps) {
  useEffect(() => {
    ensureUiStyles()
  }, [])

  const api = createApi(sessionId)

  return (
    <ModelingWorkbench
      sessionId={sessionId}
      api={api}
      initialSection={isShellHost() ? 'lesson' : 'atlas'}
      onAskTutor={({ seedPrompt }) => {
        const text = `/modeling-tutor ${seedPrompt}`
        if (setDraft) setDraft(text)
      }}
    />
  )
}

/** Fallback: shell.overlay drawer when session tab path unavailable. */
function OverlayFallback({
  sessionId,
  open,
  onClose,
  setDraft,
}: {
  sessionId: string
  open: boolean
  onClose: () => void
  setDraft?: (text: string) => void
}) {
  useEffect(() => {
    if (open) ensureUiStyles()
  }, [open])

  if (!open) return null

  const api = createApi(sessionId)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.35)',
        pointerEvents: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(920px, 96vw)',
          height: '100%',
          background: 'var(--dsh-bg, #1a1a1a)',
          color: 'inherit',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(128,128,128,0.25)' }}>
          <strong>数模工作台</strong>
          <span style={{ marginLeft: 12, fontSize: 12, opacity: 0.7 }}>
            Fallback overlay — 优先使用会话标签「数模工作台」
          </span>
          <button type="button" className="mm-btn ghost" style={{ float: 'right' }} onClick={onClose}>
            关闭
          </button>
        </div>
        <ModelingWorkbench
          sessionId={sessionId}
          api={api}
          onAskTutor={({ seedPrompt }) => {
            const text = `/modeling-tutor ${seedPrompt}`
            if (setDraft) setDraft(text)
          }}
        />
      </div>
    </div>
  )
}

/** Fallback overlay binds to session active when overlay opens. */
let overlaySessionId = 'overlay-fallback'

function OverlayHost({ setDraft }: { setDraft?: (text: string) => void }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onOpen = () => setOpen(true)
    document.addEventListener(OVERLAY_EVENT, onOpen)
    return () => document.removeEventListener(OVERLAY_EVENT, onOpen)
  }, [])
  return (
    <OverlayFallback
      sessionId={overlaySessionId}
      open={open}
      onClose={() => setOpen(false)}
      setDraft={setDraft}
    />
  )
}

function MathModelingFooter({
  wide,
  setView,
  openOverlay,
}: {
  wide: boolean
  setView?: (id: string) => void
  openOverlay?: () => void
}) {
  return (
    <button
      type="button"
      title="数模工作台（会话标签）"
      onClick={() => {
        if (setView) setView('mathmodeling')
        else openOverlay?.()
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: wide ? 'flex-start' : 'center',
        gap: 6,
        width: '100%',
        border: 0,
        background: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
        padding: '8px 10px',
      }}
    >
      {wide ? '📐 数模工作台' : '📐'}
    </button>
  )
}

function getSessionHelpers(ctx: ClientContext, sessionId: string | undefined) {
  if (!sessionId) return {}
  const binding = ctx.sessions.binding(sessionId)
  const session = binding?.session
  return {
    sessionId,
    setDraft: (text: string) => {
      try {
        const store = session?.getSnapshot?.()
        if (store?.inputActions?.setDraft) store.inputActions.setDraft(text)
      } catch {
        /* composer not ready */
      }
    },
    setView: (viewId: string) => {
      try {
        const store = session?.getSnapshot?.()
        if (store?.actions?.setView) store.actions.setView(viewId)
      } catch {
        /* view switch unavailable */
      }
    },
  }
}

/** @type {readonly ['slots', 'sessions']} */
export const inject = ['slots', 'sessions']

/**
 * Compat mode = running under the STOCK web profile (no dedicated shell).
 * The MathModel Shell sets window.__MM_SHELL_HOST__ at module-evaluation time
 * (suite patch orders it before this entry). In dedicated-shell mode we must
 * NOT register conversation.view「数模工作台」/ footer / overlay (U4: no
 * duplicate workbench tab); only the `mathmodel.workbench` seat is provided.
 */
function isShellHost(): boolean {
  try {
    return (window as unknown as Record<string, unknown>).__MM_SHELL_HOST__ === true
  } catch {
    return false
  }
}

/**
 * DSH UI (official contracts only):
 * - Primary: sidebar.footer.action → conversation.view「数模工作台」
 * - Fallback: shell.overlay drawer
 * - Tutor: DSH Chat + /modeling-tutor (no fourth column)
 */
export function apply(ctx: ClientContext): void {
  if (!isShellHost()) {
    ctx.slots.inject('conversation.view', () =>
      ctx.slots.register(
        {
          name: 'conversation.view',
          id: 'mathmodeling',
          order: 50,
          label: () => '数模工作台',
          inject: (sessionId: string) => getSessionHelpers(ctx, sessionId),
        },
        MathModelingView,
      ),
    )

    // Fallback overlay — binds to active session when opened
    ctx.slots.inject('shell.overlay', () => {
      const unregister = ctx.slots.register(
        {
          name: 'shell.overlay',
          id: 'dsh-mathmodeling-overlay',
          order: 100,
          inject: () => getSessionHelpers(ctx, overlaySessionId),
        },
        OverlayHost,
      )
      const onOverlay = () => {
        const current = ctx.sessions.list.getSnapshot?.()?.current
        if (current) overlaySessionId = current
        document.dispatchEvent(new CustomEvent(OVERLAY_EVENT))
      }
      document.addEventListener('dsh-mathmodeling:request-overlay', onOverlay)
      return () => {
        document.removeEventListener('dsh-mathmodeling:request-overlay', onOverlay)
        unregister()
      }
    })

    // Must inject (not bare register): under a custom shell, sidebar.footer.action
    // is declared by ui-sidebar only after ctx.layout is provided — race otherwise.
    ctx.slots.inject('sidebar.footer.action', () =>
      ctx.slots.register(
        {
          name: 'sidebar.footer.action',
          id: 'dsh-mathmodeling',
          order: 100,
          inject: () => {
            const current = ctx.sessions.list.getSnapshot?.()?.current
            const helpers = current ? getSessionHelpers(ctx, current) : {}
            return {
              setView: helpers.setView,
              openOverlay: () =>
                document.dispatchEvent(new CustomEvent('dsh-mathmodeling:request-overlay')),
            }
          },
        },
        MathModelingFooter,
      ),
    )
  }

  // Dedicated-shell workbench pane / lesson surface. Registered in BOTH modes.
  ctx.slots.inject('mathmodel.workbench', () =>
    ctx.slots.register(
      {
        name: 'mathmodel.workbench',
        id: 'mathmodeling',
        order: 50,
        inject: (sessionId: string) => getSessionHelpers(ctx, sessionId),
      },
      MathModelingView,
    ),
  )
}
