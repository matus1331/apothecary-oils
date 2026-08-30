import { expiryStatus } from './expiry'
import type { Oil } from '@/shared/schema'

export function summarizeExpiry(oils: Oil[], today: Date): { expiring: number; expired: number } {
  let expiring = 0
  let expired = 0
  for (const o of oils) {
    const s = expiryStatus(o.expiryDate, today)
    if (s === 'expiring') expiring++
    else if (s === 'expired') expired++
  }
  return { expiring, expired }
}
