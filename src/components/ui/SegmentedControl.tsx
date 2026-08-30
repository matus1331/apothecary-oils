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
        'flex flex-wrap gap-1 rounded-lg border p-1 sm:inline-flex sm:gap-0 sm:p-0.5',
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
              'flex-1 basis-[calc(50%-0.25rem)] whitespace-nowrap rounded-md px-2 py-2 text-center font-serif text-sm transition-colors sm:flex-none sm:basis-auto sm:px-3 sm:py-1.5',
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
