import { createClient } from '@libsql/client'
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql'
import * as schema from '../../db/schema.js'

export type Db = LibSQLDatabase<typeof schema>

export async function getDb(): Promise<Db> {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) throw new Error('TURSO_DATABASE_URL is not set')
  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  await client.execute('PRAGMA foreign_keys = ON')
  return drizzle(client, { schema })
}
