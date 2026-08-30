import { migrate } from 'drizzle-orm/libsql/migrator'
import { getDb } from './db.js'

await migrate(await getDb(), { migrationsFolder: './db/migrations' })
console.log('migrations applied')
