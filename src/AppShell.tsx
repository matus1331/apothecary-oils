import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { ExpiryBanner } from '@/components/ExpiryBanner'
import { OilFormDrawer } from '@/components/OilFormDrawer'
import { OilsView } from '@/components/OilsView'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { IconButton } from '@/components/ui/IconButton'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/Button'
import { useManufacturers } from '@/hooks/useManufacturers'
import { useOilMutations } from '@/hooks/useOilMutations'
import { useOils } from '@/hooks/useOils'
import { useSortState } from '@/hooks/useSortState'
import { EmptyState } from '@/screens/EmptyState'
import { LoadingScreen } from '@/screens/LoadingScreen'
import type { Oil, OilInput } from '@/shared/schema'

type Drawer = { mode: 'closed' } | { mode: 'add' } | { mode: 'edit'; oil: Oil }

export function AppShell() {
  const oils = useOils()
  const manufacturers = useManufacturers()
  const { create, update, remove } = useOilMutations()
  const { sort, active, toggle, setSort } = useSortState()
  const today = useMemo(() => new Date(), [])

  const [drawer, setDrawer] = useState<Drawer>({ mode: 'closed' })
  const [confirmDelete, setConfirmDelete] = useState<Oil | null>(null)

  const close = () => setDrawer({ mode: 'closed' })
  const mfNames = manufacturers.data ?? []

  const handleCreate = (input: OilInput) =>
    create.mutate(input, {
      onSuccess: () => {
        close()
        toast.success('Uloženo')
      },
      onError: (e) => toast.error(e.message),
    })

  const handleUpdate = (id: number, input: OilInput) =>
    update.mutate(
      { id, input },
      {
        onSuccess: () => {
          close()
          toast.success('Uloženo')
        },
        onError: (e) => toast.error(e.message),
      },
    )

  const handleDelete = () => {
    if (!confirmDelete) return
    const id = confirmDelete.id
    setConfirmDelete(null)
    close()
    remove.mutate(id, {
      onSuccess: () => toast.success('Smazáno'),
      onError: (e) => toast.error(e.message),
    })
  }

  if (oils.isLoading) return <LoadingScreen />

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg">
      <AppHeader onAdd={() => setDrawer({ mode: 'add' })} />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {oils.isFetching && !oils.isLoading && (
          <Skeleton className="mb-3 h-1 w-full" />
        )}
        {oils.isError ? (
          <div className="rounded-xl border border-danger/40 bg-danger-bg p-4 text-sm text-danger">
            Nepodařilo se načíst data.
            <Button variant="ghost" size="sm" className="ml-2" onClick={() => void oils.refetch()}>
              Zkusit znovu
            </Button>
          </div>
        ) : (oils.data ?? []).length === 0 ? (
          <EmptyState onAdd={() => setDrawer({ mode: 'add' })} />
        ) : (
          <>
            <ExpiryBanner
              oils={oils.data ?? []}
              today={today}
              onShow={() => setSort({ key: 'expiryDate', dir: 'asc' })}
            />
            <OilsView
              oils={oils.data ?? []}
              sort={sort}
              active={active}
              onToggle={toggle}
              onSortChange={setSort}
              onOpen={(oil) => {
                if (oil.id > 0) setDrawer({ mode: 'edit', oil })
              }}
              today={today}
            />
          </>
        )}
      </main>

      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 sm:hidden">
        <IconButton
          label="Přidat olej"
          onClick={() => setDrawer({ mode: 'add' })}
          className="h-14 w-14 rounded-full bg-accent text-white shadow-lg hover:bg-accent"
        >
          <Plus size={22} />
        </IconButton>
      </div>

      <OilFormDrawer
        open={drawer.mode !== 'closed'}
        oil={drawer.mode === 'edit' ? drawer.oil : undefined}
        manufacturers={mfNames}
        submitting={create.isPending || update.isPending}
        onSubmit={(input) =>
          drawer.mode === 'edit' ? handleUpdate(drawer.oil.id, input) : handleCreate(input)
        }
        onDelete={drawer.mode === 'edit' ? () => setConfirmDelete(drawer.oil) : undefined}
        onClose={close}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        title={`Opravdu smazat «${confirmDelete?.name ?? ''}»?`}
        confirmLabel="Smazat"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
