export type Toast = { id: number; kind: 'success' | 'error'; message: string }

let toasts: Toast[] = []
let seq = 0
const listeners = new Set<(t: Toast[]) => void>()

function emit() {
  for (const l of listeners) l(toasts)
}

function push(kind: Toast['kind'], message: string) {
  const t: Toast = { id: ++seq, kind, message }
  toasts = [...toasts, t]
  emit()
  return t.id
}

export const toast = {
  success: (message: string) => push('success', message),
  error: (message: string) => push('error', message),
  dismiss: (id: number) => {
    toasts = toasts.filter((t) => t.id !== id)
    emit()
  },
  subscribe: (fn: (t: Toast[]) => void) => {
    listeners.add(fn)
    fn(toasts)
    return () => {
      listeners.delete(fn)
    }
  },
}
