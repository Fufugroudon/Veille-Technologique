const STORAGE_KEY = 'theme'

/** Applied at module load (before React renders) to avoid a dark→light flash. */
export function applyStoredTheme(): void {
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'light') {
      document.body.classList.add('light-mode')
    }
  } catch {
    // localStorage unavailable — default dark theme stands
  }
}

export function isLightMode(): boolean {
  return document.body.classList.contains('light-mode')
}

export function setLightMode(light: boolean): void {
  document.body.classList.toggle('light-mode', light)
  try {
    localStorage.setItem(STORAGE_KEY, light ? 'light' : 'dark')
  } catch {
    // localStorage unavailable — preference won't persist across reloads
  }
}
