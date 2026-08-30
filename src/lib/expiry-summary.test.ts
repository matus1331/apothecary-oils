import { describe, it, expect } from 'vitest'
import { summarizeExpiry } from './expiry-summary'
import type { Oil } from '@/shared/schema'

const today = new Date(2026, 7, 30)
const mk = (expiryDate: string | null): Oil => ({
  id: Math.random(), productType: 'essential', name: 'X', latinName: null,
  manufacturerId: null, manufacturerName: null, expiryDate, lowStock: false,
  note: null, createdAt: 0, updatedAt: 0,
})

describe('summarizeExpiry', () => {
  it('counts expiring and expired', () => {
    const res = summarizeExpiry(
      [mk('2026-08-01'), mk('2026-09-15'), mk('2026-10-01'), mk('2028-01-01'), mk(null)],
      today,
    )
    expect(res).toEqual({ expired: 1, expiring: 2 })
  })
})
