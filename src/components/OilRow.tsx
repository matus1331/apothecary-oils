import { expiryStatus } from '@/lib/expiry'
import { cn } from '@/lib/cn'
import type { Oil } from '@/shared/schema'
import { ExpiryPill } from './ExpiryPill'
import { LowStockDot } from './LowStockDot'

type Props = { oil: Oil; today: Date; onOpen: (oil: Oil) => void }

export function OilRow({ oil, today, onOpen }: Props) {
  const status = expiryStatus(oil.expiryDate, today)
  return (
    <tr
      tabIndex={0}
      role="button"
      onClick={() => onOpen(oil)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(oil)
        }
      }}
      className={cn(
        'cursor-pointer border-t border-line outline-none focus:bg-accent-weak',
        status === 'expiring' && 'bg-warn-bg',
        status === 'expired' && 'bg-danger-bg',
      )}
    >
      <td className="px-3 py-2.5 text-sm text-ink">{oil.name}</td>
      <td className="px-3 py-2.5 text-sm italic text-muted">{oil.latinName ?? '—'}</td>
      <td className="px-3 py-2.5 text-sm text-ink">{oil.manufacturerName ?? '—'}</td>
      <td className="px-3 py-2.5 text-sm">
        <ExpiryPill date={oil.expiryDate} today={today} />
      </td>
      <td className="px-3 py-2.5 text-center">
        <LowStockDot low={oil.lowStock} />
      </td>
    </tr>
  )
}
