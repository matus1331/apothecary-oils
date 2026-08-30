import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast, type Toast } from './toast'
import { cn } from '@/lib/cn'

export function ToastHost() {
  const [list, setList] = useState<Toast[]>([])
  useEffect(() => toast.subscribe(setList), [])
  useEffect(() => {
    if (!list.length) return
    const timers = list.map((t) => setTimeout(() => toast.dismiss(t.id), 4000))
    return () => timers.forEach(clearTimeout)
  }, [list])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {list.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            role="status"
            className={cn(
              'pointer-events-auto max-w-sm rounded-lg border px-4 py-2 text-sm shadow-lg',
              t.kind === 'error'
                ? 'border-danger/40 bg-danger-bg text-danger'
                : 'border-accent/30 bg-accent-weak text-ink',
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
