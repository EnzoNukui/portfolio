import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, themeStorageKey, type Theme } from './themeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  useLayoutEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const toggleTheme = useCallback(() => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
    try { localStorage.setItem(themeStorageKey, next) } catch {
      // O tema continua funcionando quando o navegador bloqueia a persistência.
    }
  }, [])
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === themeStorageKey || event.key === null) {
        if (event.newValue === 'light' || event.newValue === 'dark') setTheme(event.newValue)
        else if (event.newValue === null) setTheme('dark')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext value={value}>{children}</ThemeContext>
}
