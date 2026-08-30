import type { MiddlewareHandler } from 'hono'

export function rateLimit(opts: { windowMs: number; max: number }): MiddlewareHandler {
  const hits = new Map<string, { count: number; reset: number }>()
  return async (c, next) => {
    const key =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
      c.req.header('x-real-ip') ||
      'local'
    const now = Date.now()
    const entry = hits.get(key)
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + opts.windowMs })
    } else if (entry.count >= opts.max) {
      return c.json({ error: 'Příliš mnoho požadavků' }, 429)
    } else {
      entry.count++
    }
    await next()
  }
}
