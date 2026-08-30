import { Download } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { Button } from './ui/Button'

export function InstallButton() {
  const { canInstall, promptInstall } = useInstallPrompt()
  if (!canInstall) return null
  return (
    <Button variant="ghost" size="sm" onClick={() => void promptInstall()}>
      <Download size={16} />
      Nainstalovat
    </Button>
  )
}
