import { useEffect, useState } from 'react'
import { ItecInfoModal } from './ItecInfoModal'
import { PartnerLogo } from './PartnerLogo'

type ModalState = 'closed' | 'open' | 'closing'

interface Props {
  state: ModalState
  onClose: () => void
}

export function ItecBlockModal({ state, onClose }: Props) {
  const [infoState, setInfoState] = useState<ModalState>('closed')

  useEffect(() => {
    if (state === 'closed') return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && infoState === 'closed') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [state, infoState, onClose])

  function openInfo() {
    setInfoState('open')
  }

  function closeInfo() {
    setInfoState('closing')
    setTimeout(() => setInfoState('closed'), 260)
  }

  if (state === 'closed') return null

  return (
    <>
      <div
        className={`itec-block-modal-overlay${state === 'open' ? ' is-open' : ''}${state === 'closing' ? ' is-closing' : ''}`}
        id="itec-block-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div
          className="itec-block-modal"
          id="itec-block-modal"
          role="dialog"
          aria-modal="true"
          aria-label="ITEC Engineering"
        >
          <button
            className="itec-block-modal-close"
            id="itec-block-modal-close"
            type="button"
            aria-label="Fermer"
            onClick={onClose}
          >
            ✕
          </button>
          <div className="itec-block-modal-body">
            <div className="itec-wrap">
              <div className="itec-content-grid">
                <div className="itec-hero">
                  <img
                    src="docs/images/Itec-enginneering-logo.png"
                    alt="ITEC Engineering"
                    className="itec-hero-logo"
                  />
                  <div className="itec-hero-text">
                    <h2>
                      ITEC Engineering{' '}
                      <button className="itec-drawer-btn" id="itec-modal-btn" type="button" onClick={openInfo}>
                        → En savoir plus
                      </button>
                    </h2>
                    <p>
                      Société française d'ingénierie industrielle spécialisée dans les solutions clé en main,
                      de la conception jusqu'à la mise en service sur site, pour les secteurs pétroliers,
                      énergétiques et les services aux collectivités.
                    </p>
                    <div className="itec-tags">
                      <span className="itec-tag itec-tag-green">Oil &amp; Gas</span>
                      <span className="itec-tag itec-tag-blue">Énergie</span>
                      <span className="itec-tag itec-tag-gray">Utilities</span>
                    </div>
                  </div>
                </div>

                <div className="itec-row2-grid">
                  <div>
                    <p className="itec-section-title">Informations générales</p>
                    <div className="itec-info-card">
                      <div className="itec-info-row">
                        <span className="itec-info-key">Siège social</span>
                        <span className="itec-info-val">8 Rue de Vignoru, 60110 Esches, France</span>
                      </div>
                      <div className="itec-info-row">
                        <span className="itec-info-key">Secteurs</span>
                        <span className="itec-info-val">Oil &amp; Gas · Énergie · Utilities</span>
                      </div>
                      <div className="itec-info-row">
                        <span className="itec-info-key">Téléphone</span>
                        <span className="itec-info-val">+33 (1) 30 28 81 90</span>
                      </div>
                      <div className="itec-info-row">
                        <span className="itec-info-key">Site web</span>
                        <span className="itec-info-val">
                          <a href="http://www.itec-engineering.com" target="_blank" rel="noreferrer">
                            itec-engineering.com
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="itec-section-title">Pôles d'activité</p>
                    <div className="itec-poles">
                      <div className="itec-pole" data-tooltip="FEED, P&ID, études de détail">
                        <div className="itec-pole-icon itec-pole-icon--engineering">✏️</div>
                        <h3>Engineering</h3>
                        <p>
                          Études process, électricité, instrumentation et automatisme. Du FEED jusqu'à
                          l'exécution complète.
                        </p>
                      </div>
                      <div className="itec-pole" data-tooltip="Conception 3D, livraison clé en main">
                        <div className="itec-pole-icon itec-pole-icon--shelters">🏗️</div>
                        <h3>Shelters</h3>
                        <p>
                          Fabrication de shelters techniques sur mesure et conteneurs modifiés pour sites
                          industriels.
                        </p>
                      </div>
                      <div className="itec-pole" data-tooltip="Siemens, Rockwell, Schneider">
                        <div className="itec-pole-icon itec-pole-icon--automatisme">⚙️</div>
                        <h3>Automatisme</h3>
                        <p>
                          Intégration PLC/DCS, SIS, F&amp;G, SCADA, réseaux industriels et transformation
                          digitale IIoT.
                        </p>
                      </div>
                      <div className="itec-pole" data-tooltip="Certification Ex — IEC 60079">
                        <div className="itec-pole-icon itec-pole-icon--armoires">⚡</div>
                        <h3>Armoires électriques</h3>
                        <p>HTA/HTB/BT, tableaux MCC, armoires ATEX certifiées Ex d / Ex p / Ex e.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="itec-section-title">Couverture projet de A à Z</p>
                  <div className="itec-timeline">
                    <div className="itec-step" data-tooltip="Étude de faisabilité et définition du périmètre">
                      <div className="itec-step-num">01</div>
                      <span className="itec-step-label">FEED</span>
                    </div>
                    <div className="itec-step-arrow">›</div>
                    <div className="itec-step" data-tooltip="Plans détaillés, schémas et spécifications">
                      <div className="itec-step-num">02</div>
                      <span className="itec-step-label">Conception détaillée</span>
                    </div>
                    <div className="itec-step-arrow">›</div>
                    <div className="itec-step" data-tooltip="Assemblage en atelier sous contrôle qualité">
                      <div className="itec-step-num">03</div>
                      <span className="itec-step-label">Fabrication atelier</span>
                    </div>
                    <div className="itec-step-arrow">›</div>
                    <div className="itec-step" data-tooltip="Factory Acceptance Test — validation avant livraison">
                      <div className="itec-step-num">04</div>
                      <span className="itec-step-label">Tests FAT</span>
                    </div>
                    <div className="itec-step-arrow">›</div>
                    <div className="itec-step" data-tooltip="Installation et démarrage sur site client">
                      <div className="itec-step-num last">05</div>
                      <span className="itec-step-label">Mise en service</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="itec-section-title">Services proposés</p>
                  <div className="itec-pills">
                    <span className="itec-pill" data-tooltip="Pilotage planning, budget et équipes">
                      Gestion de projet
                    </span>
                    <span className="itec-pill" data-tooltip="Analyse de faisabilité en phase amont">
                      Consulting FEED
                    </span>
                    <span className="itec-pill" data-tooltip="Bilans de puissance, schémas unifilaires">
                      Études électriques
                    </span>
                    <span className="itec-pill" data-tooltip="Capteurs, vannes, boucles de régulation">
                      Instrumentation
                    </span>
                    <span className="itec-pill" data-tooltip="Habilitation zones explosibles IEC 60079">
                      Personnel certifié ATEX
                    </span>
                    <span className="itec-pill" data-tooltip="Sourcing, appels d'offres, contrôle qualité">
                      Services achat
                    </span>
                    <span className="itec-pill" data-tooltip="Supervision et dépannage à distance">
                      Télémaintenance
                    </span>
                    <span className="itec-pill" data-tooltip="VPN industriel, accès crypté aux équipements">
                      Accès distant sécurisé
                    </span>
                    <span className="itec-pill" data-tooltip="Archivage, monitoring et reporting en ligne">
                      Support cloud
                    </span>
                    <span className="itec-pill" data-tooltip="Formation des opérateurs sur le site client">
                      Formation on-site
                    </span>
                  </div>
                </div>

                <div className="itec-certif">
                  <div className="itec-certif-icon">✓</div>
                  <p>
                    <strong>Intégrateur certifié Rockwell Automation</strong>
                    <br />
                    Certification internationale attestant du niveau d'expertise d'ITEC Engineering dans
                    l'intégration de systèmes d'automatisme industriels.
                  </p>
                </div>

                <div className="itec-partners-full">
                  <p className="itec-section-title">Partenaires &amp; Clients</p>
                  <div className="itec-partners">
                    <a
                      href="https://www.perenco.com"
                      target="_blank"
                      rel="noopener"
                      className="itec-partner-card"
                    >
                      <PartnerLogo
                        src="docs/images/perenco-logo.png"
                        alt="Perenco"
                        fallback="P"
                        className="itec-partner-logo itec-partner-logo--perenco"
                      />
                      <span className="itec-partner-name">Perenco</span>
                      <span className="itec-partner-desc">Opérateur pétrolier international</span>
                    </a>
                    <a href="https://www.se.com" target="_blank" rel="noopener" className="itec-partner-card">
                      <PartnerLogo
                        src="docs/images/logo-Schneider-Electric.webp"
                        alt="Schneider Electric"
                        fallback="SE"
                        className="itec-partner-logo itec-partner-logo--schneider"
                      />
                      <span className="itec-partner-name">Schneider Electric</span>
                      <span className="itec-partner-desc">Partenaire énergie &amp; automatisme</span>
                    </a>
                    <a
                      href="https://www.rockwellautomation.com"
                      target="_blank"
                      rel="noopener"
                      className="itec-partner-card"
                    >
                      <PartnerLogo
                        src="docs/images/rockwell-automation-logo.png"
                        alt="Rockwell Automation"
                        fallback="RA"
                        className="itec-partner-logo itec-partner-logo--rockwell"
                      />
                      <span className="itec-partner-name">Rockwell Automation</span>
                      <span className="itec-partner-desc">Intégrateur certifié</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ItecInfoModal state={infoState} onClose={closeInfo} />
    </>
  )
}
