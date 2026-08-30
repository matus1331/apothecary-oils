import { createClient } from '@libsql/client'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import * as schema from '../../db/schema.js'
import type { Db } from './db.js'

export async function createTestDb(): Promise<Db> {
  const client = createClient({ url: ':memory:' })
  const db = drizzle(client, { schema })
  await migrate(db, { migrationsFolder: './db/migrations' })
  await db.run(sql`PRAGMA foreign_keys = ON`)
  return db
}
