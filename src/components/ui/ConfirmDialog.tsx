import * as Dialog from '@radix-ui/react-dialog'
import { Button } from './Button'

type Props = {
  open: boolean
  title: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  confirmLabel = 'Potvrdit',
  cancelLabel = 'Zrušit',
  danger,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface p-5 shadow-xl"
        >
          <Dialog.Title className="font-serif text-lg text-ink">{title}</Dialog.Title>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
