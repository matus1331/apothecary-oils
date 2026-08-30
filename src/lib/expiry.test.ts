import { describe, it, expect } from 'vitest'
import { daysUntil, expiryStatus } from './expiry'

const today = new Date(2026, 7, 30) // 2026-08-30, local

describe('daysUntil', () => {
  it('counts calendar days ignoring time of day', () => {
    expect(daysUntil('2026-08-30', today)).toBe(0)
    expect(daysUntil('2026-09-01', today)).toBe(2)
    expect(daysUntil('2026-08-25', today)).toBe(-5)
  })
})

describe('expiryStatus', () => {
  it('none when no date', () => expect(expiryStatus(null, today)).toBe('none'))
  it('expired strictly before today', () =>
    expect(expiryStatus('2026-08-29', today)).toBe('expired'))
  it('expiring today and through +90 inclusive', () => {
    expect(expiryStatus('2026-08-30', today)).toBe('expiring')
    expect(expiryStatus('2026-11-28', today)).toBe('expiring') // +90
  })
  it('ok beyond +90', () => expect(expiryStatus('2026-11-29', today)).toBe('ok')) // +91
})
