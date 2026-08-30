import { useCallback, useState } from 'react'
import { cycleSort, DEFAULT_SORT, type SortKey, type SortState } from '@/lib/sort'

const KEYS: SortKey[] = ['name', 'latinName', 'manufacturerName', 'expiryDate', 'lowStock']

function read(): SortState | null {
  const p = new URLSearchParams(window.location.search)
  const key = p.get('sort')
  const dir = p.get('dir')
  if (!key || !KEYS.includes(key as SortKey)) return null
  if (dir !== 'asc' && dir !== 'desc') return null
  return { key: key as SortKey, dir }
}

function write(state: SortState | null): void {
  const p = new URLSearchParams(window.location.search)
  if (state) {
    p.set('sort', state.key)
    p.set('dir', state.dir)
  } else {
    p.delete('sort')
    p.delete('dir')
  }
  const qs = p.toString()
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

export function useSortState() {
  const [active, setActive] = useState<SortState | null>(() => read())

  const toggle = useCallback((key: SortKey) => {
    setActive((cur) => {
      const next = cycleSort(cur, key)
      write(next)
      return next
    })
  }, [])

  return { sort: active ?? DEFAULT_SORT, active, toggle }
}
