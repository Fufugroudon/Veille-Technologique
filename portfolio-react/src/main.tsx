import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n/I18nContext'
import { ToastProvider } from './context/ToastContext'
import { applyStoredTheme } from './utils/theme'
import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/toast.css'
import './styles/hero.css'
import './styles/itec.css'
import './styles/profil.css'
import './styles/parcours.css'

// Applied before the first render to avoid a dark→light flash for users
// who previously chose the light theme.
applyStoredTheme()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <I18nProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </StrictMode>,
)
