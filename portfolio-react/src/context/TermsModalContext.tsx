import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n/I18nContext'

type Source = 'form' | 'footer' | null

interface TermsModalContextValue {
  requestSubmit: (onAccept: () => void) => void
  showInfo: () => void
}

const TermsModalContext = createContext<TermsModalContextValue | null>(null)

const BODY_TEXT = {
  fr: [
    <>
      Les informations transmises via ce formulaire sont utilisées <strong>uniquement</strong> pour vous
      répondre. Elles ne sont ni partagées, ni vendues à des tiers.
    </>,
    <>
      Vos données sont conservées au maximum <strong>1 an</strong>, puis supprimées. Vous pouvez demander
      leur suppression à tout moment en me contactant directement.
    </>,
    <>
      Conformément au <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr>, vous
      disposez d'un droit d'accès, de rectification et d'effacement de vos données personnelles.
    </>,
  ],
  en: [
    <>
      Information submitted through this form is used <strong>solely</strong> to reply to you. It is never
      shared or sold to third parties.
    </>,
    <>
      Your data is kept for a maximum of <strong>1 year</strong>, then deleted. You may request its
      deletion at any time by contacting me directly.
    </>,
    <>
      Under the <abbr title="General Data Protection Regulation">GDPR</abbr>, you have the right to access,
      rectify and erase your personal data.
    </>,
  ],
}

export function TermsModalProvider({ children }: { children: ReactNode }) {
  const { t, lang } = useI18n()
  const [source, setSource] = useState<Source>(null)
  const onAcceptRef = useRef<(() => void) | null>(null)

  function requestSubmit(onAccept: () => void) {
    onAcceptRef.current = onAccept
    setSource('form')
  }

  function showInfo() {
    onAcceptRef.current = null
    setSource('footer')
  }

  function close() {
    setSource(null)
    onAcceptRef.current = null
  }

  function accept() {
    const callback = onAcceptRef.current
    close()
    if (callback) callback()
  }

  const isOpen = source !== null

  return (
    <TermsModalContext.Provider value={{ requestSubmit, showInfo }}>
      {children}
      <div
        className={`terms-overlay${isOpen ? ' terms-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className="terms-card">
          <h2 id="terms-title" className="terms-title">
            {t.terms.title}
          </h2>
          <div className="terms-body">
            {BODY_TEXT[lang].map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="terms-actions">
            {source === 'footer' && (
              <button type="button" className="btn btn-primary" onClick={close}>
                {t.terms.close}
              </button>
            )}
            {source === 'form' && (
              <>
                <button type="button" className="btn btn-primary" onClick={accept}>
                  {t.terms.accept}
                </button>
                <button type="button" className="btn btn-outline" onClick={close}>
                  {t.terms.refuse}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </TermsModalContext.Provider>
  )
}

export function useTermsModal(): TermsModalContextValue {
  const ctx = useContext(TermsModalContext)
  if (!ctx) {
    throw new Error('useTermsModal must be used within a TermsModalProvider')
  }
  return ctx
}
