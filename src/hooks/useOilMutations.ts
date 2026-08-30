import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOil, deleteOil, updateOil } from '@/lib/api-client'
import { queryKeys } from '@/lib/query'
import type { Oil, OilInput } from '@/shared/schema'

export function useOilMutations() {
  const qc = useQueryClient()

  const snapshot = () => qc.getQueryData<Oil[]>(queryKeys.oils) ?? []
  const setOils = (rows: Oil[]) => qc.setQueryData(queryKeys.oils, rows)
  const rollback = (ctx?: { prev: Oil[] }) => ctx && setOils(ctx.prev)
  const settleOils = () => {
    void qc.invalidateQueries({ queryKey: queryKeys.oils })
  }
  const settleAll = () => {
    settleOils()
    void qc.invalidateQueries({ queryKey: queryKeys.manufacturers })
  }

  const optimisticRow = (input: OilInput): Oil => ({
    id: -Date.now(),
    productType: input.productType,
    name: input.name,
    latinName: input.latinName,
    manufacturerId: null,
    manufacturerName: input.manufacturerName,
    expiryDate: input.expiryDate,
    lowStock: input.lowStock,
    note: input.note,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })

  const create = useMutation<Oil, Error, OilInput, { prev: Oil[] }>({
    mutationFn: createOil,
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: queryKeys.oils })
      const prev = snapshot()
      setOils([...prev, optimisticRow(input)])
      return { prev }
    },
    onError: (_e, _v, ctx) => rollback(ctx),
    onSettled: settleAll,
  })

  const update = useMutation<Oil, Error, { id: number; input: OilInput }, { prev: Oil[] }>({
    mutationFn: ({ id, input }) => updateOil(id, input),
    onMutate: async ({ id, input }) => {
      await qc.cancelQueries({ queryKey: queryKeys.oils })
      const prev = snapshot()
      setOils(prev.map((o) => (o.id === id ? { ...o, ...input, updatedAt: Date.now() } : o)))
      return { prev }
    },
    onError: (_e, _v, ctx) => rollback(ctx),
    onSettled: settleAll,
  })

  const remove = useMutation<void, Error, number, { prev: Oil[] }>({
    mutationFn: deleteOil,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.oils })
      const prev = snapshot()
      setOils(prev.filter((o) => o.id !== id))
      return { prev }
    },
    onError: (_e, _v, ctx) => rollback(ctx),
    onSettled: settleOils,
  })

  return { create, update, remove }
}
