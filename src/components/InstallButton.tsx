import { useState } from 'react'
import { Download } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { Button } from './ui/Button'

// iOS Safari never fires `beforeinstallprompt`, so the prompt-based button can never
// show there. Detect an iOS browser that isn't already running standalone and offer a
// manual hint instead.
function isIosInstallCandidate(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const standalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true
  return isIos && !standalone
}

export function InstallButton() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [hintOpen, setHintOpen] = useState(false)

  if (canInstall) {
    return (
      <Button variant="ghost" size="sm" onClick={() => void promptInstall()}>
        <Download size={16} />
        Nainstalovat
      </Button>
    )
  }

  if (!isIosInstallCandidate()) return null

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setHintOpen((o) => !o)}>
        <Download size={16} />
        Nainstalovat
      </Button>
      {hintOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setHintOpen(false)} />
          <div
            role="dialog"
            aria-label="Nainstalovat aplikaci"
            className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-line bg-surface p-3 text-sm shadow-xl"
          >
            <p className="font-serif text-ink">Nainstalovat aplikaci</p>
            <p className="mt-1 text-muted">Sdílet → Přidat na plochu</p>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setHintOpen(false)}>
                Rozumím
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
