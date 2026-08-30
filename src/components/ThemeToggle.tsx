import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { IconButton } from './ui/IconButton'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <IconButton label={dark ? 'Přepnout na světlý motiv' : 'Přepnout na tmavý motiv'} onClick={toggle}>
      {dark ? <Moon size={18} /> : <Sun size={18} />}
    </IconButton>
  )
}
