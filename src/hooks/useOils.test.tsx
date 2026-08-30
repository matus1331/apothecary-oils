import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { createQueryClient } from '@/lib/query'
import { useOils } from './useOils'

const sample = [
  {
    id: 1, productType: 'essential', name: 'Levandule', latinName: null,
    manufacturerId: null, manufacturerName: null, expiryDate: null,
    lowStock: false, note: null, createdAt: 0, updatedAt: 0,
  },
]

afterEach(() => vi.restoreAllMocks())

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
}

describe('useOils', () => {
  it('fetches and returns oils', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(sample), { headers: { 'content-type': 'application/json' } }),
    )
    const { result } = renderHook(() => useOils(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(sample)
  })
})
