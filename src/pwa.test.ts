// @vitest-environment node
import { describe, expect, it } from 'vitest'
import config from '../vite.config'

describe('vite config', () => {
  it('registers a proxy for /api in dev', () => {
    const c = config as { server?: { proxy?: Record<string, unknown> } }
    expect(c.server?.proxy && '/api' in c.server.proxy).toBe(true)
  })
})
