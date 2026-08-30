import { Plus } from 'lucide-react'
import { Button } from './ui/Button'
import { InstallButton } from './InstallButton'
import { OfflineBadge } from './OfflineBadge'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <h1 className="font-serif text-xl text-ink">Olejovník</h1>
        <div className="ml-auto flex items-center gap-2">
          <OfflineBadge />
          <InstallButton />
          <ThemeToggle />
          <Button size="sm" onClick={onAdd} className="hidden sm:inline-flex">
            <Plus size={16} />
            Přidat olej
          </Button>
        </div>
      </div>
    </header>
  )
}
