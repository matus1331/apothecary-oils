import { cn } from '@/lib/cn'

type Props<T extends string> = {
  options: { value: T; label: string }[]
  value: T | null
  onChange: (v: T) => void
  name: string
  invalid?: boolean
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  name,
  invalid,
}: Props<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        'inline-flex rounded-lg border p-0.5',
        invalid ? 'border-danger' : 'border-line',
      )}
    >
      {options.map((o) => {
        const selected = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-serif transition-colors',
              selected ? 'bg-accent text-white' : 'text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
