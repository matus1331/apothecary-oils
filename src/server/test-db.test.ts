import { describe, it, expect } from 'vitest'
import { sql } from 'drizzle-orm'
import { createTestDb } from './test-db'
import { manufacturers, oils } from '../../db/schema'

describe('test db', () => {
  it('has both tables and applies FK set null', async () => {
    const db = await createTestDb()
    await db.run(sql`PRAGMA foreign_keys = ON`)

    const [m] = await db.insert(manufacturers).values({ name: 'Nobilis' }).returning()
    const [o] = await db
      .insert(oils)
      .values({ productType: 'essential', name: 'Levandule', manufacturerId: m.id })
      .returning()
    expect(o.lowStock).toBe(false)
    expect(o.createdAt).toBeGreaterThan(0)
    expect(o.updatedAt).toBeGreaterThan(0)

    await db.delete(manufacturers).where(sql`id = ${m.id}`)
    const rows = await db.select().from(oils)
    expect(rows).toHaveLength(1)
    expect(rows[0].manufacturerId).toBeNull()
  })
})
