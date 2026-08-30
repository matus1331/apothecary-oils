import { forwardRef, useEffect, useRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { invalid, className, value, ...rest },
  ref,
) {
  const inner = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    const el = inner.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])
  return (
    <textarea
      ref={(node) => {
        inner.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      value={value}
      aria-invalid={invalid || undefined}
      rows={3}
      className={cn(
        'w-full resize-none rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/40',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...rest}
    />
  )
})
