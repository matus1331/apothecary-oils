import { handle } from 'hono/vercel'
import { createApp } from '../src/server/app.js'
import { getDb } from '../src/server/db.js'

export const config = { runtime: 'nodejs' }

const app = createApp(await getDb())

export default handle(app)
