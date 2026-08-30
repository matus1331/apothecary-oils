import { useState } from 'react'
import { Download, Share } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { Button } from './ui/Button'

// iOS Safari never fires `beforeinstallprompt` and has no JS install API, so the
// prompt-based button can't work there. Detect an iOS browser that isn't already
// running standalone and show manual instructions instead.
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
        Na plochu
      </Button>
      {hintOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setHintOpen(false)} />
          <div
            role="dialog"
            aria-label="Přidat aplikaci na plochu"
            className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-line bg-surface p-4 text-sm shadow-xl"
          >
            <p className="font-serif text-ink">Přidat na plochu iPhonu</p>
            <p className="mt-1 text-muted">
              iOS neumožňuje instalaci tlačítkem. V Safari to uděláš ručně:
            </p>
            <ol className="mt-2 space-y-1.5 text-muted">
              <li className="flex items-center gap-2">
                <span className="font-medium text-ink">1.</span>
                <span className="inline-flex items-center gap-1">
                  klepni na <Share size={14} className="text-accent" /> Sdílet
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-ink">2.</span>
                <span>zvol „Přidat na plochu"</span>
              </li>
            </ol>
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
