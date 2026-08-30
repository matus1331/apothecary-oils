import { describe, it, expect } from 'vitest'
import { cycleSort, DEFAULT_SORT, sortOils } from './sort'
import type { Oil } from '@/shared/schema'

const oil = (over: Partial<Oil>): Oil => ({
  id: Math.random(),
  productType: 'essential',
  name: 'A',
  latinName: null,
  manufacturerId: null,
  manufacturerName: null,
  expiryDate: null,
  lowStock: false,
  note: null,
  createdAt: 0,
  updatedAt: 0,
  ...over,
})

describe('cycleSort', () => {
  it('off → asc on new key', () => expect(cycleSort(null, 'name')).toEqual({ key: 'name', dir: 'asc' }))
  it('asc → desc on same key', () =>
    expect(cycleSort({ key: 'name', dir: 'asc' }, 'name')).toEqual({ key: 'name', dir: 'desc' }))
  it('desc → off on same key', () =>
    expect(cycleSort({ key: 'name', dir: 'desc' }, 'name')).toBeNull())
  it('switching key restarts at asc', () =>
    expect(cycleSort({ key: 'name', dir: 'desc' }, 'expiryDate')).toEqual({
      key: 'expiryDate',
      dir: 'asc',
    }))
})

describe('sortOils', () => {
  it('sorts by name using Czech collation', () => {
    const out = sortOils([oil({ name: 'Šalvěj' }), oil({ name: 'Citron' }), oil({ name: 'Áloe' })], {
      key: 'name',
      dir: 'asc',
    })
    expect(out.map((o) => o.name)).toEqual(['Áloe', 'Citron', 'Šalvěj'])
  })
  it('puts nulls/empties last in both directions', () => {
    const rows = [oil({ name: 'a', expiryDate: '2027-01-01' }), oil({ name: 'b', expiryDate: null })]
    expect(sortOils(rows, { key: 'expiryDate', dir: 'asc' }).map((o) => o.name)).toEqual(['a', 'b'])
    expect(sortOils(rows, { key: 'expiryDate', dir: 'desc' }).map((o) => o.name)).toEqual(['a', 'b'])
  })
  it('boolean lowStock: false before true when asc', () => {
    const rows = [oil({ name: 'a', lowStock: true }), oil({ name: 'b', lowStock: false })]
    expect(sortOils(rows, { key: 'lowStock', dir: 'asc' }).map((o) => o.name)).toEqual(['b', 'a'])
  })
  it('is stable via name as secondary key', () => {
    const rows = [oil({ name: 'z', lowStock: false }), oil({ name: 'a', lowStock: false })]
    expect(sortOils(rows, { key: 'lowStock', dir: 'asc' }).map((o) => o.name)).toEqual(['a', 'z'])
  })
  it('does not mutate input', () => {
    const rows = [oil({ name: 'b' }), oil({ name: 'a' })]
    sortOils(rows, { key: 'name', dir: 'asc' })
    expect(rows.map((o) => o.name)).toEqual(['b', 'a'])
  })
})

describe('DEFAULT_SORT', () => {
  it('is name asc', () => expect(DEFAULT_SORT).toEqual({ key: 'name', dir: 'asc' }))
})
