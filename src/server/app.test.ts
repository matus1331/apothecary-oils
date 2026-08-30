import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from './app'
import { createTestDb } from './test-db'
import type { Hono } from 'hono'

let app: Hono

beforeEach(async () => {
  app = createApp(await createTestDb())
})

const post = (path: string, body: unknown) =>
  app.request(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

const base = {
  productType: 'essential',
  name: 'Levandule',
  latinName: 'Lavandula angustifolia',
  manufacturerName: 'Nobilis',
  expiryDate: '2027-01-01',
  lowStock: false,
  note: null,
}

describe('POST /api/oils', () => {
  it('creates an oil and the manufacturer, returns 201 with joined name', async () => {
    const res = await post('/api/oils', base)
    expect(res.status).toBe(201)
    const oil = await res.json()
    expect(oil).toMatchObject({ name: 'Levandule', manufacturerName: 'Nobilis', lowStock: false })
    expect(oil.id).toBeTypeOf('number')

    const mres = await app.request('/api/manufacturers')
    expect(await mres.json()).toEqual([{ id: oil.manufacturerId, name: 'Nobilis' }])
  })

  it('reuses a manufacturer case-insensitively', async () => {
    const a = await (await post('/api/oils', base)).json()
    const b = await (await post('/api/oils', { ...base, name: 'Máta', manufacturerName: 'NOBILIS' })).json()
    expect(b.manufacturerId).toBe(a.manufacturerId)
    expect((await (await app.request('/api/manufacturers')).json()).length).toBe(1)
  })

  it('rejects invalid body with 400 + issues', async () => {
    const res = await post('/api/oils', { ...base, name: '', productType: 'wax' })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.issues.map((i: { path: string }) => i.path)).toEqual(
      expect.arrayContaining(['name', 'productType']),
    )
  })
})

describe('GET /api/oils', () => {
  it('lists oils with null manufacturerName when none set', async () => {
    await post('/api/oils', { ...base, manufacturerName: null })
    const rows = await (await app.request('/api/oils')).json()
    expect(rows).toHaveLength(1)
    expect(rows[0].manufacturerName).toBeNull()
  })
})

describe('PUT /api/oils/:id', () => {
  it('updates fields and bumps updatedAt', async () => {
    const oil = await (await post('/api/oils', base)).json()
    const res = await app.request(`/api/oils/${oil.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...base, lowStock: true, note: 'dochází' }),
    })
    expect(res.status).toBe(200)
    const updated = await res.json()
    expect(updated.lowStock).toBe(true)
    expect(updated.note).toBe('dochází')
    expect(updated.updatedAt).toBeGreaterThanOrEqual(oil.updatedAt)
  })

  it('404 on missing id', async () => {
    const res = await app.request('/api/oils/999', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(base),
    })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/oils/:id', () => {
  it('deletes and keeps the manufacturer', async () => {
    const oil = await (await post('/api/oils', base)).json()
    const res = await app.request(`/api/oils/${oil.id}`, { method: 'DELETE' })
    expect(res.status).toBe(200)
    expect(await (await app.request('/api/oils')).json()).toHaveLength(0)
    expect(await (await app.request('/api/manufacturers')).json()).toHaveLength(1)
  })

  it('404 on missing id', async () => {
    expect((await app.request('/api/oils/999', { method: 'DELETE' })).status).toBe(404)
  })
})
