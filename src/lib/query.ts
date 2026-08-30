import { QueryClient } from '@tanstack/react-query'

export const queryKeys = {
  oils: ['oils'] as const,
  manufacturers: ['manufacturers'] as const,
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  })
}
