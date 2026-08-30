import { useQuery } from '@tanstack/react-query'
import { getOils } from '@/lib/api-client'
import { queryKeys } from '@/lib/query'

export function useOils() {
  return useQuery({ queryKey: queryKeys.oils, queryFn: getOils })
}
