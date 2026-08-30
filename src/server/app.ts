import { asc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { manufacturers, oils } from '../../db/schema'
import { oilInputSchema, type Oil } from '../shared/schema'
import type { Db } from './db'
import { rateLimit } from './rate-limit'

const rowToOil = (r: {
  id: number
  productType: 'essential' | 'carrier' | 'hydrosol'
  name: string
  latinName: string | null
  manufacturerId: number | null
  manufacturerName: string | null
  expiryDate: string | null
  lowStock: boolean
  note: string | null
  createdAt: number
  updatedAt: number
}): Oil => r

export function createApp(db: Db): Hono {
  const app = new Hono().basePath('/api')
  app.use('*', cors())

  const selectOils = () =>
    db
      .select({
        id: oils.id,
        productType: oils.productType,
        name: oils.name,
        latinName: oils.latinName,
        manufacturerId: oils.manufacturerId,
        manufacturerName: manufacturers.name,
        expiryDate: oils.expiryDate,
        lowStock: oils.lowStock,
        note: oils.note,
        createdAt: oils.createdAt,
        updatedAt: oils.updatedAt,
      })
      .from(oils)
      .leftJoin(manufacturers, eq(oils.manufacturerId, manufacturers.id))

  // Case-insensitive resolve/create of a manufacturer by name. NOTE: relies on the
  // `PRAGMA foreign_keys = ON` set by getDb() per connection; that is reliable for
  // local/:memory: but not guaranteed per-request against remote Turso over HTTP.
  // The spec has no path that deletes manufacturers, so the ON DELETE SET NULL FK
  // is low risk here.
  async function resolveManufacturerId(name: string | null): Promise<number | null> {
    if (!name) return null
    const existing = await db
      .select({ id: manufacturers.id })
      .from(manufacturers)
      .where(sql`lower(${manufacturers.name}) = lower(${name})`)
      .limit(1)
    if (existing[0]) return existing[0].id
    const [created] = await db
      .insert(manufacturers)
      .values({ name })
      .returning({ id: manufacturers.id })
    return created.id
  }

  app.get('/oils', async (c) => {
    const rows = await selectOils()
    return c.json(rows.map(rowToOil))
  })

  app.get('/manufacturers', async (c) => {
    const rows = await db
      .select({ id: manufacturers.id, name: manufacturers.name })
      .from(manufacturers)
      .orderBy(asc(sql`lower(${manufacturers.name})`))
    return c.json(rows)
  })

  app.post('/oils', rateLimit({ windowMs: 60_000, max: 60 }), async (c) => {
    const body = await c.req.json().catch(() => null)
    const parsed = oilInputSchema.safeParse(body)
    if (!parsed.success) {
      return c.json(
        {
          error: 'Neplatná data',
          issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
        400,
      )
    }
    const { manufacturerName, ...rest } = parsed.data
    const manufacturerId = await resolveManufacturerId(manufacturerName)
    const [row] = await db.insert(oils).values({ ...rest, manufacturerId }).returning({ id: oils.id })
    const [full] = await selectOils().where(eq(oils.id, row.id))
    return c.json(rowToOil(full), 201)
  })

  app.put('/oils/:id', rateLimit({ windowMs: 60_000, max: 60 }), async (c) => {
    const id = Number(c.req.param('id'))
    if (!Number.isInteger(id)) return c.json({ error: 'Neplatné ID' }, 400)
    const body = await c.req.json().catch(() => null)
    const parsed = oilInputSchema.safeParse(body)
    if (!parsed.success) {
      return c.json(
        {
          error: 'Neplatná data',
          issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
        400,
      )
    }
    const existing = await db.select({ id: oils.id }).from(oils).where(eq(oils.id, id)).limit(1)
    if (!existing[0]) return c.json({ error: 'Olej nenalezen' }, 404)
    const { manufacturerName, ...rest } = parsed.data
    const manufacturerId = await resolveManufacturerId(manufacturerName)
    await db
      .update(oils)
      .set({ ...rest, manufacturerId, updatedAt: Date.now() })
      .where(eq(oils.id, id))
    const [full] = await selectOils().where(eq(oils.id, id))
    return c.json(rowToOil(full))
  })

  app.delete('/oils/:id', rateLimit({ windowMs: 60_000, max: 60 }), async (c) => {
    const id = Number(c.req.param('id'))
    if (!Number.isInteger(id)) return c.json({ error: 'Neplatné ID' }, 400)
    const res = await db.delete(oils).where(eq(oils.id, id)).returning({ id: oils.id })
    if (!res[0]) return c.json({ error: 'Olej nenalezen' }, 404)
    return c.json({ ok: true })
  })

  return app
}
