import { useEffect } from 'react'

type ModalState = 'closed' | 'open' | 'closing'

interface Props {
  state: ModalState
  onClose: () => void
}

export function ItecInfoModal({ state, onClose }: Props) {
  useEffect(() => {
    if (state === 'closed') return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [state, onClose])

  if (state === 'closed') return null

  return (
    <div
      className={`itec-modal-overlay${state === 'open' ? ' is-open' : ''}${state === 'closing' ? ' is-closing' : ''}`}
      id="itec-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="itec-modal"
        id="itec-modal"
        role="dialog"
        aria-modal="true"
        aria-label="En savoir plus — ITEC Engineering"
      >
        <button
          className="itec-modal-close"
          id="itec-modal-close"
          type="button"
          aria-label="Fermer"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="itec-modal-title">ITEC Engineering</h3>
        <p className="itec-modal-desc">
          ITEC Engineering est une société française d'ingénierie industrielle fondée en 2005, spécialisée
          dans les projets clé en main pour les secteurs{' '}
          <a
            href="https://fr.wikipedia.org/wiki/Industrie_p%C3%A9troli%C3%A8re"
            target="_blank"
            rel="noopener"
            className="itec-modal-link"
          >
            <span className="itec-highlight">Oil &amp; Gas</span>
          </a>
          , Énergie et Utilities. Ses équipes interviennent de la phase{' '}
          <span className="itec-highlight">FEED</span> jusqu'à la mise en service, couvrant l'engineering
          procédé, électrique et instrumentation, la fabrication de shelters sur mesure, l'intégration de
          systèmes d'<span className="itec-highlight">automatisme</span> (
          <a href="https://fr.wikipedia.org/wiki/SCADA" target="_blank" rel="noopener" className="itec-modal-link">
            SCADA
          </a>
          ,{' '}
          <a
            href="https://fr.wikipedia.org/wiki/Internet_des_objets"
            target="_blank"
            rel="noopener"
            className="itec-modal-link"
          >
            IIoT
          </a>
          ) ainsi que la conception d'armoires électriques{' '}
          <a href="https://fr.wikipedia.org/wiki/ATEX" target="_blank" rel="noopener" className="itec-modal-link">
            <span className="itec-highlight">ATEX</span>
          </a>{' '}
          certifiées. Active en{' '}
          <a href="https://fr.wikipedia.org/wiki/Europe" target="_blank" rel="noopener" className="itec-modal-link">
            <span className="itec-highlight">Europe</span>
          </a>
          ,{' '}
          <a href="https://fr.wikipedia.org/wiki/Afrique" target="_blank" rel="noopener" className="itec-modal-link">
            <span className="itec-highlight">Afrique</span>
          </a>{' '}
          et{' '}
          <a
            href="https://fr.wikipedia.org/wiki/Moyen-Orient"
            target="_blank"
            rel="noopener"
            className="itec-modal-link"
          >
            <span className="itec-highlight">Moyen-Orient</span>
          </a>
          , la société s'appuie sur des partenariats stratégiques avec Schneider Electric et{' '}
          <a href="https://www.rockwellautomation.com" target="_blank" rel="noopener" className="itec-modal-link">
            Rockwell Automation
          </a>{' '}
          pour accompagner des opérateurs de premier plan tels que{' '}
          <a href="https://www.perenco.com" target="_blank" rel="noopener" className="itec-modal-link">
            Perenco
          </a>
          .
        </p>
        <ul className="itec-modal-list">
          <li>
            <span className="itec-modal-key">Présence internationale</span>
            <span className="itec-modal-val">Projets actifs sur 4 continents</span>
          </li>
          <li>
            <span className="itec-modal-key">Effectif</span>
            <span className="itec-modal-val">~50 collaborateurs</span>
          </li>
          <li>
            <span className="itec-modal-key">Zones d'intervention</span>
            <span className="itec-modal-val">Europe, Afrique, Moyen-Orient</span>
          </li>
          <li>
            <span className="itec-modal-key">Langues</span>
            <span className="itec-modal-val">Français, Anglais</span>
          </li>
          <li>
            <span className="itec-modal-key">Chiffre d'affaires estimé</span>
            <span className="itec-modal-val">~10 M€</span>
          </li>
          <li>
            <span className="itec-modal-key">Projets réalisés</span>
            <span className="itec-modal-val">+200 installations dans 30 pays</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
