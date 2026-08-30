import { expiryStatus } from '@/lib/expiry'
import { cn } from '@/lib/cn'
import type { Oil } from '@/shared/schema'
import { ExpiryPill } from './ExpiryPill'
import { LowStockDot } from './LowStockDot'

type Props = { oil: Oil; today: Date; onOpen: (oil: Oil) => void }

export function OilCard({ oil, today, onOpen }: Props) {
  const status = expiryStatus(oil.expiryDate, today)
  return (
    <button
      type="button"
      onClick={() => onOpen(oil)}
      className={cn(
        'flex w-full flex-col gap-1 rounded-xl border border-line bg-surface p-4 text-left',
        status === 'expiring' && 'border-warn/40 bg-warn-bg',
        status === 'expired' && 'border-danger/40 bg-danger-bg',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-ink">{oil.name}</div>
          {oil.latinName && <div className="text-xs italic text-muted">{oil.latinName}</div>}
        </div>
        <LowStockDot low={oil.lowStock} />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-muted">
        <span>{oil.manufacturerName ?? '—'}</span>
        <ExpiryPill date={oil.expiryDate} today={today} />
      </div>
    </button>
  )
}
