import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/40',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...rest}
    />
  )
})
