import { handle } from 'hono/vercel'
import { createApp } from '../src/server/app.js'
import { getDb } from '../src/server/db.js'

export const config = { runtime: 'nodejs' }

const app = createApp(await getDb())

// Named HTTP-method exports = Web fetch-style handlers, which @vercel/node
// invokes and whose Response it sends. A `export default handle(app)` is
// treated as a Node `(req, res)` handler and its return value is dropped.
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const OPTIONS = handle(app)
