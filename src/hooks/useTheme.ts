import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'
const KEY = 'oils.theme'

function apply(theme: Theme): void {
  const el = document.documentElement
  if (theme === 'system') el.removeAttribute('data-theme')
  else el.setAttribute('data-theme', theme)
}

function initial(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* ignore */
  }
  return 'system'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(initial)

  useEffect(() => {
    apply(theme)
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    try {
      localStorage.setItem(KEY, t)
    } catch {
      /* ignore */
    }
    setThemeState(t)
  }, [])

  return { theme, setTheme }
}
