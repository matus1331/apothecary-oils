import type { Oil } from '@/shared/schema'

export type SortKey = 'name' | 'latinName' | 'manufacturerName' | 'expiryDate' | 'lowStock'
export type SortDir = 'asc' | 'desc'
export interface SortState {
  key: SortKey
  dir: SortDir
}

export const DEFAULT_SORT: SortState = { key: 'name', dir: 'asc' }

export function cycleSort(cur: SortState | null, key: SortKey): SortState | null {
  if (!cur || cur.key !== key) return { key, dir: 'asc' }
  if (cur.dir === 'asc') return { key, dir: 'desc' }
  return null
}

const collator = new Intl.Collator('cs', { numeric: true, sensitivity: 'base' })

function isEmpty(v: string | number | boolean | null): boolean {
  return v === null || v === ''
}

export function sortOils(oils: Oil[], { key, dir }: SortState): Oil[] {
  const factor = dir === 'asc' ? 1 : -1
  return [...oils].sort((a, b) => {
    const av = a[key] as string | number | boolean | null
    const bv = b[key] as string | number | boolean | null

    const aE = isEmpty(av)
    const bE = isEmpty(bv)
    if (aE && bE) return tieBreak(a, b)
    if (aE) return 1
    if (bE) return -1

    let cmp: number
    if (typeof av === 'boolean' && typeof bv === 'boolean') {
      cmp = av === bv ? 0 : av ? 1 : -1
    } else {
      cmp = collator.compare(String(av), String(bv))
    }
    return cmp !== 0 ? cmp * factor : tieBreak(a, b)
  })
}

function tieBreak(a: Oil, b: Oil): number {
  return collator.compare(a.name, b.name)
}
