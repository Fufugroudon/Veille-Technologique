import { useState } from 'react'
import { isLightMode, setLightMode } from '../../utils/theme'

export function ThemeToggle() {
  const [light, setLight] = useState(isLightMode)

  function handleClick() {
    const next = !light
    setLightMode(next)
    setLight(next)
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={light}
      aria-label={light ? 'Activer le mode nuit' : 'Activer le mode jour'}
      onClick={handleClick}
    >
      {light ? '🌙' : '☀️'}
    </button>
  )
}
