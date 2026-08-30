import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { Manufacturer, Oil, OilInput } from '@/shared/schema'
import { IconButton } from './ui/IconButton'
import { OilForm } from './OilForm'

type Props = {
  open: boolean
  oil?: Oil
  manufacturers: Manufacturer[]
  submitting?: boolean
  onSubmit: (input: OilInput) => void
  onDelete?: () => void
  onClose: () => void
}

export function OilFormDrawer({ open, oil, manufacturers, submitting, onSubmit, onDelete, onClose }: Props) {
  const isDesktop = useMediaQuery('(min-width: 640px)')

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className={
                  isDesktop
                    ? 'fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-line bg-surface'
                    : 'fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-2xl border-t border-line bg-surface'
                }
                initial={isDesktop ? { x: '100%' } : { y: '100%' }}
                animate={isDesktop ? { x: 0 } : { y: 0 }}
                exit={isDesktop ? { x: '100%' } : { y: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <Dialog.Title className="font-serif text-lg text-ink">
                    {oil ? 'Upravit olej' : 'Přidat olej'}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <IconButton label="Zavřít">
                      <X size={18} />
                    </IconButton>
                  </Dialog.Close>
                </div>
                <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <OilForm
                    defaultOil={oil}
                    manufacturers={manufacturers}
                    submitting={submitting}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                    onCancel={onClose}
                  />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
