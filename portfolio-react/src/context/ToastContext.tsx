import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type ToastType = 'error' | 'warning' | 'success' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
  linkTarget?: string
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, linkTarget?: string) => void
}

const ICONS: Record<ToastType, string> = {
  error: '✕',
  warning: '⚠',
  success: '✓',
  info: 'ℹ',
}

const AUTO_DISMISS_MS = 15000
const MAX_VISIBLE = 10

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [dismissing, setDismissing] = useState<Set<number>>(new Set())
  const nextId = useRef(0)
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const remove = useCallback((id: number) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setDismissing((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
      setDismissing((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', linkTarget?: string) => {
      const id = nextId.current++
      setToasts((prev) => {
        const next = [...prev, { id, message, type, linkTarget }]
        if (next.length > MAX_VISIBLE) {
          const [oldest, ...rest] = next
          const oldestTimer = timers.current.get(oldest.id)
          if (oldestTimer) {
            clearTimeout(oldestTimer)
            timers.current.delete(oldest.id)
          }
          return rest
        }
        return next
      })

      const timer = setTimeout(() => remove(id), AUTO_DISMISS_MS)
      timers.current.set(id, timer)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container" aria-label="Notifications">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}${dismissing.has(toast.id) ? ' dismissing' : ''}`}
            role="alert"
            aria-live="polite"
          >
            <span className="toast-icon" aria-hidden="true">
              {ICONS[toast.type]}
            </span>
            <div className="toast-body">
              <p className="toast-message">{toast.message}</p>
              {toast.linkTarget && (
                <button
                  type="button"
                  className="toast-link"
                  onClick={() => {
                    const el = document.querySelector(toast.linkTarget as string)
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' })
                      history.pushState({}, '', location.pathname)
                    }
                    remove(toast.id)
                  }}
                >
                  → En savoir plus
                </button>
              )}
            </div>
            <button
              type="button"
              className="toast-close"
              aria-label="Fermer la notification"
              onClick={() => remove(toast.id)}
            >
              ×
            </button>
            <div className="toast-progress" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
