import { createContext, useContext, useRef, useState, type ReactNode } from 'react'

type Source = 'form' | 'footer' | null

interface TermsModalContextValue {
  requestSubmit: (onAccept: () => void) => void
  showInfo: () => void
}

const TermsModalContext = createContext<TermsModalContextValue | null>(null)

const TERMS_TITLE = "Conditions d'utilisation"

export function TermsModalProvider({ children }: { children: ReactNode }) {
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
            {TERMS_TITLE}
          </h2>
          <div className="terms-body">
            <p>
              Les informations transmises via ce formulaire sont utilisées <strong>uniquement</strong> pour
              vous répondre. Elles ne sont ni partagées, ni vendues à des tiers.
            </p>
            <p>
              Vos données sont conservées au maximum <strong>1 an</strong>, puis supprimées. Vous pouvez
              demander leur suppression à tout moment en me contactant directement.
            </p>
            <p>
              Conformément au <abbr title="Règlement Général sur la Protection des Données">RGPD</abbr>,
              vous disposez d'un droit d'accès, de rectification et d'effacement de vos données
              personnelles.
            </p>
          </div>
          <div className="terms-actions">
            {source === 'footer' && (
              <button type="button" className="btn btn-primary" onClick={close}>
                Fermer
              </button>
            )}
            {source === 'form' && (
              <>
                <button type="button" className="btn btn-primary" onClick={accept}>
                  J'accepte
                </button>
                <button type="button" className="btn btn-outline" onClick={close}>
                  Refuser
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
