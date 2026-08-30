import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const manufacturers = sqliteTable(
  'manufacturers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    createdAt: integer('created_at')
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    nameUnique: uniqueIndex('manufacturers_name_unique').on(t.name),
  }),
)

export const oils = sqliteTable('oils', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productType: text('product_type', { enum: ['essential', 'carrier', 'hydrosol'] }).notNull(),
  name: text('name').notNull(),
  latinName: text('latin_name'),
  manufacturerId: integer('manufacturer_id').references(() => manufacturers.id, {
    onDelete: 'set null',
  }),
  expiryDate: text('expiry_date'),
  lowStock: integer('low_stock', { mode: 'boolean' }).notNull().default(false),
  note: text('note'),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})
