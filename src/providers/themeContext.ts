import { createContext, useContext } from 'react'
export type Theme = 'dark' | 'light'
export const themeStorageKey = 'enzo-nukui:theme:v1'
export const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null)
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme precisa estar dentro de ThemeProvider.')
  return context
}
