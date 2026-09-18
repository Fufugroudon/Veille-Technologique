import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { translations, type Lang, type Translation } from './translations'

const STORAGE_KEY = 'preferred_lang'

interface I18nContextValue {
  lang: Lang
  t: Translation
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'en' ? 'en' : 'fr'
  } catch {
    return 'fr'
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage unavailable — language still applies for this session
    }
  }

  const value = useMemo<I18nContextValue>(
    () => ({ lang, t: translations[lang], setLang }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}
