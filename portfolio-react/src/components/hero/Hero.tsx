import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { HeroParticles } from './HeroParticles'
import { HeroTitle } from './HeroTitle'
import { HeroStats } from './HeroStats'
import { HeroScrollIndicator } from './HeroScrollIndicator'
import { ItecBlockModal } from '../itec/ItecBlockModal'

type ModalState = 'closed' | 'open' | 'closing'

export function Hero() {
  const { t } = useI18n()
  const [itecState, setItecState] = useState<ModalState>('closed')

  function closeItec() {
    setItecState('closing')
    setTimeout(() => setItecState('closed'), 350)
  }

  return (
    <section id="accueil">
      <HeroParticles />
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid" />
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge hero-anim-1">
            <span className="badge-pulse" />
            {t.heroBadge}
          </div>

          <HeroTitle />

          <p className="hero-subtitle hero-anim-3">{t.heroSubtitle}</p>

          <div id="availability-badge">
            <span className="pulse-dot" />
            {t.availabilityBadge}
          </div>

          <p className="hero-subtitle hero-anim-3">
            {t.itecPrefix}{' '}
            <button
              className="itec-entry-trigger"
              type="button"
              id="itec-entry-trigger"
              onClick={() => setItecState('open')}
            >
              ITEC Engineering <span aria-hidden="true">›</span>
            </button>
          </p>

          <p className="hero-description hero-anim-4">{t.heroDesc}</p>

          <div className="hero-cta hero-anim-5">
            <a href="#projets" className="btn btn-primary">
              {t.heroCtaProjects}
            </a>
            <a href="#contact" className="btn btn-outline">
              {t.heroCtaContact}
            </a>
          </div>

          <HeroStats />
        </div>
      </div>

      <HeroScrollIndicator />

      <ItecBlockModal state={itecState} onClose={closeItec} />
    </section>
  )
}
