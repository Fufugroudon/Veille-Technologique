import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle() {
  const { light, toggle } = useTheme()

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={light}
      aria-label={light ? 'Activer le mode nuit' : 'Activer le mode jour'}
      onClick={toggle}
    >
      {light ? '🌙' : '☀️'}
    </button>
  )
}
