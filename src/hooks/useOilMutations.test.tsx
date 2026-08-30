import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { createQueryClient } from '@/lib/query'
import * as api from '@/lib/api-client'
import { useOils } from './useOils'
import { useOilMutations } from './useOilMutations'

const baseOil = {
  id: 1, productType: 'essential' as const, name: 'Levandule', latinName: null,
  manufacturerId: null, manufacturerName: null, expiryDate: null,
  lowStock: false, note: null, createdAt: 0, updatedAt: 0,
}
const input = {
  productType: 'essential' as const, name: 'Máta', latinName: null,
  manufacturerName: null, expiryDate: null, lowStock: false, note: null,
}

afterEach(() => vi.restoreAllMocks())

function makeWrapper() {
  const client = createQueryClient()
  client.setQueryData(['oils'], [baseOil])
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('useOilMutations', () => {
  it('create optimistically appends then reconciles', async () => {
    vi.spyOn(api, 'getOils').mockResolvedValue([baseOil, { ...baseOil, id: 2, name: 'Máta' }])
    vi.spyOn(api, 'createOil').mockResolvedValue({ ...baseOil, id: 2, name: 'Máta' })
    const wrapper = makeWrapper()
    const { result } = renderHook(
      () => ({ list: useOils(), m: useOilMutations() }),
      { wrapper },
    )
    act(() => {
      result.current.m.create.mutate(input)
    })
    await waitFor(() => expect(result.current.list.data?.map((o) => o.name)).toContain('Máta'))
  })

  it('create rolls back on error', async () => {
    vi.spyOn(api, 'createOil').mockRejectedValue(new api.ApiError(500, 'Chyba serveru'))
    vi.spyOn(api, 'getOils').mockResolvedValue([baseOil])
    const wrapper = makeWrapper()
    const { result } = renderHook(() => ({ list: useOils(), m: useOilMutations() }), { wrapper })
    act(() => {
      result.current.m.create.mutate(input)
    })
    await waitFor(() => expect(result.current.m.create.isError).toBe(true))
    await waitFor(() => expect(result.current.list.data?.map((o) => o.name)).toEqual(['Levandule']))
  })

  it('remove optimistically drops the row', async () => {
    vi.spyOn(api, 'deleteOil').mockResolvedValue()
    vi.spyOn(api, 'getOils').mockResolvedValue([])
    const wrapper = makeWrapper()
    const { result } = renderHook(() => ({ list: useOils(), m: useOilMutations() }), { wrapper })
    act(() => {
      result.current.m.remove.mutate(1)
    })
    await waitFor(() => expect(result.current.list.data).toEqual([]))
  })
})
