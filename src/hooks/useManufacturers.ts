import { useQuery } from '@tanstack/react-query'
import { getManufacturers } from '@/lib/api-client'
import { queryKeys } from '@/lib/query'

export function useManufacturers() {
  return useQuery({ queryKey: queryKeys.manufacturers, queryFn: getManufacturers })
}
