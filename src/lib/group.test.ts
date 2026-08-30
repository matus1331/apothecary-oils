import { describe, it, expect } from 'vitest'
import { groupByType } from './group'
import type { Oil } from '@/shared/schema'

const oil = (productType: Oil['productType'], name: string): Oil => ({
  id: Math.random(),
  productType,
  name,
  latinName: null,
  manufacturerId: null,
  manufacturerName: null,
  expiryDate: null,
  lowStock: false,
  note: null,
  createdAt: 0,
  updatedAt: 0,
})

describe('groupByType', () => {
  it('returns groups in fixed order essential → carrier → hydrosol → other', () => {
    const groups = groupByType([
      oil('other', 'O'),
      oil('hydrosol', 'H'),
      oil('essential', 'E'),
      oil('carrier', 'C'),
    ])
    expect(groups.map((g) => g.type)).toEqual(['essential', 'carrier', 'hydrosol', 'other'])
    expect(groups[0].label).toBe('Éterické oleje')
    expect(groups[3].label).toBe('Ostatní')
  })
  it('omits empty groups', () => {
    const groups = groupByType([oil('carrier', 'C')])
    expect(groups.map((g) => g.type)).toEqual(['carrier'])
  })
  it('preserves incoming order within a group (caller pre-sorts)', () => {
    const groups = groupByType([oil('essential', 'B'), oil('essential', 'A')])
    expect(groups[0].oils.map((o) => o.name)).toEqual(['B', 'A'])
  })
})
