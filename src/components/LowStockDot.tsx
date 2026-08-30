import { cn } from '@/lib/cn'

export function LowStockDot({ low }: { low: boolean }) {
  if (!low) return <span className="inline-block h-2.5 w-2.5 rounded-full border border-line" />
  return (
    <span
      aria-label="Dochází"
      title="Dochází"
      className={cn('inline-block h-2.5 w-2.5 rounded-full bg-warn')}
    />
  )
}
