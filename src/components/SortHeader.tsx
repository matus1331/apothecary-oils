import { ArrowDown, ArrowUp } from 'lucide-react'
import type { SortKey, SortState } from '@/lib/sort'

type Props = {
  label: string
  column: SortKey
  active: SortState | null
  onToggle: (k: SortKey) => void
}

export function SortHeader({ label, column, active, onToggle }: Props) {
  const on = active?.key === column
  const ariaSort = !on ? 'none' : active.dir === 'asc' ? 'ascending' : 'descending'
  return (
    <th aria-sort={ariaSort} className="px-3 py-2 text-left font-serif text-xs uppercase tracking-wider text-muted">
      <button
        type="button"
        onClick={() => onToggle(column)}
        className="inline-flex items-center gap-1 hover:text-ink"
      >
        {label}
        {on && (active.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
      </button>
    </th>
  )
}
