import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '@/hooks/useTheme'
import { IconButton } from './ui/IconButton'

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<Theme, string> = { system: 'systém', light: 'světlý', dark: 'tmavý' }

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  return (
    <IconButton label={`Motiv: ${LABEL[theme]}`} onClick={() => setTheme(NEXT[theme])}>
      <Icon size={18} />
    </IconButton>
  )
}
