import { useOnline } from '@/hooks/useOnline'

export function OfflineBadge() {
  const online = useOnline()
  if (online) return null
  return (
    <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">offline</span>
  )
}
