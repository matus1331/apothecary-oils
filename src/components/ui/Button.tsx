import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

const styles: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-accent text-white hover:opacity-90',
  ghost: 'bg-transparent text-ink hover:bg-accent-weak',
  danger: 'bg-danger text-white hover:opacity-90',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-transform active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
        size === 'sm' ? 'h-8 px-3 text-sm' : 'h-10 px-4 text-sm',
        styles[variant],
        className,
      )}
      {...rest}
    />
  )
})
