export const EXPIRING_WINDOW_DAYS = 90

export type ExpiryStatus = 'expired' | 'expiring' | 'ok' | 'none'

export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function daysUntil(iso: string, today: Date): number {
  const MS = 86_400_000
  return Math.round(
    (startOfDay(parseLocalDate(iso)).getTime() - startOfDay(today).getTime()) / MS,
  )
}

export function expiryStatus(iso: string | null, today: Date): ExpiryStatus {
  if (!iso) return 'none'
  // Fail closed on an unparseable string rather than silently reporting 'ok'.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(Date.parse(iso))) return 'none'
  const d = daysUntil(iso, today)
  if (d < 0) return 'expired'
  if (d <= EXPIRING_WINDOW_DAYS) return 'expiring'
  return 'ok'
}
