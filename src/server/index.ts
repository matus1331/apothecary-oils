import { serve } from '@hono/node-server'
import { createApp } from './app.js'
import { getDb } from './db.js'

const app = createApp(await getDb())
serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`api on http://localhost:${info.port}`)
})
