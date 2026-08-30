import type { SortKey, SortState } from '@/lib/sort'

const LABELS: Record<SortKey, string> = {
  name: 'Název',
  latinName: 'Latinský název',
  manufacturerName: 'Výrobce',
  expiryDate: 'Datum expirace',
  lowStock: 'Dochází',
}
const KEYS = Object.keys(LABELS) as SortKey[]

export function SortSelect({ value, onChange }: { value: SortState; onChange: (s: SortState) => void }) {
  const current = `${value.key}:${value.dir}`
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      Seřadit podle
      <select
        value={current}
        onChange={(e) => {
          const [key, dir] = e.target.value.split(':') as [SortKey, 'asc' | 'desc']
          onChange({ key, dir })
        }}
        className="h-9 rounded-lg border border-line bg-surface px-2 text-sm text-ink"
      >
        {KEYS.flatMap((k) => [
          <option key={`${k}:asc`} value={`${k}:asc`}>{`${LABELS[k]} ↑`}</option>,
          <option key={`${k}:desc`} value={`${k}:desc`}>{`${LABELS[k]} ↓`}</option>,
        ])}
      </select>
    </label>
  )
}
