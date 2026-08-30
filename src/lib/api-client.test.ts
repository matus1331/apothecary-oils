import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOil, getOils } from './api-client'

const okJson = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))

afterEach(() => vi.restoreAllMocks())

const sampleOil = {
  id: 1,
  productType: 'essential',
  name: 'Levandule',
  latinName: null,
  manufacturerId: null,
  manufacturerName: null,
  expiryDate: null,
  lowStock: false,
  note: null,
  createdAt: 0,
  updatedAt: 0,
}

describe('api-client', () => {
  it('getOils parses an array of oils', async () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(okJson([sampleOil]) as unknown as Promise<Response>)
    await expect(getOils()).resolves.toEqual([sampleOil])
  })

  it('createOil throws ApiError with issues on 400', async () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(
      okJson({ error: 'Neplatná data', issues: [{ path: 'name', message: 'Zadejte název' }] }, 400) as unknown as Promise<Response>,
    )
    await expect(
      createOil({
        productType: 'essential',
        name: '',
        latinName: null,
        manufacturerName: null,
        expiryDate: null,
        lowStock: false,
        note: null,
      }),
    ).rejects.toMatchObject({ status: 400, issues: [{ path: 'name', message: 'Zadejte název' }] })
  })
})
