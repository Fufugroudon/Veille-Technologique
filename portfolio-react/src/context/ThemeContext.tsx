import { createContext, useContext, useState, type ReactNode } from 'react'
import { isLightMode, setLightMode } from '../utils/theme'

interface ThemeContextValue {
  light: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Shared light/dark state so the nav toggle button and the terminal's `theme` command stay in sync. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [light, setLight] = useState(isLightMode)

  function toggle() {
    const next = !light
    setLightMode(next)
    setLight(next)
  }

  return <ThemeContext.Provider value={{ light, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
