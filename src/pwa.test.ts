// @vitest-environment node
import { describe, expect, it } from 'vitest'
import config from '../vite.config'

describe('vite config', () => {
  it('registers a proxy for /api in dev', () => {
    const c = config as { server?: { proxy?: Record<string, unknown> } }
    expect(c.server?.proxy && '/api' in c.server.proxy).toBe(true)
  })

  it('includes the PWA plugin so the build emits a service worker', () => {
    const c = config as { plugins?: unknown }
    const flat = (Array.isArray(c.plugins) ? c.plugins : []).flat(Infinity) as Array<{
      name?: string
    }>
    const names = flat.map((p) => p?.name).filter((n): n is string => typeof n === 'string')
    expect(names.some((n) => n.toLowerCase().includes('pwa'))).toBe(true)
  })

  // The VitePWA `manifest` / `workbox` options (manifest.name === 'Oleje'; the `/api/`
  // runtimeCaching entry with handler 'NetworkFirst' + method 'GET'; navigateFallbackDenylist
  // containing /^\/api\//) are not exposed on the resolved plugin objects, so they cannot be
  // introspected here. Invariant they encode: offline is read-only — only GET /api/ responses
  // are ever served from cache; mutations always require the network.
})
