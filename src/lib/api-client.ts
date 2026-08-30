import {
  manufacturersResponseSchema,
  oilSchema,
  oilsResponseSchema,
  type Manufacturer,
  type Oil,
  type OilInput,
} from '@/shared/schema'

export class ApiError extends Error {
  status: number
  issues?: { path: string; message: string }[]
  constructor(status: number, message: string, issues?: { path: string; message: string }[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    })
  } catch {
    throw new ApiError(0, 'Bez připojení — změna se neuložila')
  }
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : null
  if (!res.ok) {
    const msg = (body && typeof body === 'object' && 'error' in body && String(body.error)) || 'Chyba serveru'
    const issues = body && typeof body === 'object' && 'issues' in body ? (body.issues as ApiError['issues']) : undefined
    throw new ApiError(res.status, msg, issues)
  }
  return body
}

export async function getOils(): Promise<Oil[]> {
  return oilsResponseSchema.parse(await request('/api/oils'))
}

export async function getManufacturers(): Promise<Manufacturer[]> {
  return manufacturersResponseSchema.parse(await request('/api/manufacturers'))
}

export async function createOil(input: OilInput): Promise<Oil> {
  return oilSchema.parse(await request('/api/oils', { method: 'POST', body: JSON.stringify(input) }))
}

export async function updateOil(id: number, input: OilInput): Promise<Oil> {
  return oilSchema.parse(
    await request(`/api/oils/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  )
}

export async function deleteOil(id: number): Promise<void> {
  await request(`/api/oils/${id}`, { method: 'DELETE' })
}
