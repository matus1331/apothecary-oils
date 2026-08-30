import { handle } from 'hono/vercel'
import { createApp } from '../src/server/app'
import { getDb } from '../src/server/db'

export const config = { runtime: 'nodejs' }

const app = createApp(await getDb())

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
