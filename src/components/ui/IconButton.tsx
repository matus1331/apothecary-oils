import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-transform active:scale-[0.95] hover:bg-accent-weak disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
