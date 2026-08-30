import { daysUntil, expiryStatus } from '@/lib/expiry'
import { cn } from '@/lib/cn'
import { plural } from '@/shared/plural'

export function ExpiryPill({ date, today = new Date() }: { date: string | null; today?: Date }) {
  if (!date) return <span className="text-muted">—</span>
  const status = expiryStatus(date, today)
  const d = daysUntil(date, today)
  return (
    <span className="inline-flex items-center gap-1.5">
      {status === 'expiring' && <span className="h-2 w-2 rounded-full bg-warn" />}
      <span
        className={cn(
          status === 'expired' && 'text-danger',
          status === 'expiring' && 'text-warn',
          (status === 'ok' || status === 'none') && 'text-ink',
        )}
      >
        {date}
      </span>
      {status === 'expired' && <span className="text-xs font-medium text-danger">po expiraci</span>}
      {status === 'expiring' && (
        <span className="text-xs text-warn">za {d} {plural(d, ['den', 'dny', 'dní'])}</span>
      )}
    </span>
  )
}
