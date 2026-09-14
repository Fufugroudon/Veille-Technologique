import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'

interface FeatureRow {
  label: string
  value: string
  highlight?: boolean
}

const CLASSIC_FEATURES: FeatureRow[] = [
  { label: 'Unité', value: 'Bit (0 ou 1)' },
  { label: 'Technologie', value: 'Transistors' },
  { label: 'Traitement', value: 'Séquentiel' },
  { label: '💪 Avantage', value: 'Fiable et mature', highlight: true },
]

const QUANTUM_FEATURES: FeatureRow[] = [
  { label: 'Unité', value: 'Qubit (0 et 1)' },
  { label: 'Technologie', value: 'Mécanique quantique' },
  { label: 'Traitement', value: 'Parallèle massif' },
  { label: '⚡ Avantage', value: 'Ultra-rapide', highlight: true },
]

const DOMAINES = [
  { icon: '🔐', label: 'Cryptographie' },
  { icon: '🧬', label: 'Médecine' },
  { icon: '🤖', label: 'IA' },
  { icon: '📊', label: 'Optimisation' },
]

const SOURCES = [
  { icon: '🔬', label: 'Recherche' },
  { icon: '🏢', label: 'Industrie' },
  { icon: '🎓', label: 'Formation' },
  { icon: '📰', label: 'Actualités' },
]

const METHODES = [
  { icon: '📰', label: 'Flux RSS' },
  { icon: '🔔', label: 'Feedly' },
  { icon: '💬', label: 'Communautés' },
  { icon: '📱', label: 'LinkedIn' },
]

function IconGrid({ items }: { items: { icon: string; label: string }[] }) {
  return (
    <div className="veille-icon-grid">
      {items.map((item) => (
        <div className="veille-icon-card" key={item.label}>
          <span aria-hidden="true">{item.icon}</span>
          <h4>{item.label}</h4>
        </div>
      ))}
    </div>
  )
}

function FeatureBoxes({ features }: { features: FeatureRow[] }) {
  return (
    <>
      {features.map((f) => (
        <div className={`feature-box${f.highlight ? ' highlight' : ''}`} key={f.label}>
          <span className="feature-label">{f.label}</span>
          <span className="feature-value">{f.value}</span>
        </div>
      ))}
    </>
  )
}

export function Veille() {
  const header = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()
  const intro = useReveal<HTMLDivElement>()
  const comparison = useReveal<HTMLDivElement>()
  const domaines = useReveal<HTMLDivElement>()
  const sources = useReveal<HTMLDivElement>()
  const methodes = useReveal<HTMLDivElement>()
  const conclusion = useReveal<HTMLDivElement>()

  return (
    <section id="veille">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">06</span>
          <h2 ref={titleRef}>Veille Technologique</h2>
          <p className="section-subtitle">Ordinateurs Quantiques vs Ordinateurs Classiques</p>
        </div>

        <div className="veille-github">
          <a
            href="https://github.com/Fufugroudon/Veille-Technologique"
            target="_blank"
            rel="noopener noreferrer"
            className="veille-github-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Voir le dépôt GitHub
          </a>
        </div>

        <div className={`veille-intro ${intro.className}`} ref={intro.ref}>
          <p>
            Mon sujet de veille technologique concerne la technologie quantique, plus précisément :{' '}
            <strong>
              les réelles différences entre un ordinateur dit "Quantique" et un ordinateur dit "Classique"
            </strong>
            .
          </p>
        </div>

        <div className={`comparison-grid ${comparison.className}`} ref={comparison.ref}>
          <div className="comparison-card classic">
            <div className="card-header">
              <div className="card-icon" aria-hidden="true">
                💻
              </div>
              <h4>Ordinateur Classique</h4>
            </div>
            <div className="card-content">
              <FeatureBoxes features={CLASSIC_FEATURES} />
            </div>
          </div>

          <div className="comparison-card quantum">
            <div className="card-header">
              <div className="card-icon" aria-hidden="true">
                ⚛️
              </div>
              <h4>Ordinateur Quantique</h4>
            </div>
            <div className="card-content">
              <FeatureBoxes features={QUANTUM_FEATURES} />
            </div>
          </div>
        </div>

        <div className={`veille-grid-section ${domaines.className}`} ref={domaines.ref}>
          <h3 className="veille-section-title">🎯 Domaines Impactés</h3>
          <IconGrid items={DOMAINES} />
        </div>

        <div className={`veille-grid-section ${sources.className}`} ref={sources.ref}>
          <h3 className="veille-section-title">📚 Mes Sources</h3>
          <IconGrid items={SOURCES} />
        </div>

        <div className={`veille-grid-section ${methodes.className}`} ref={methodes.ref}>
          <h3 className="veille-section-title">🔍 Mes Méthodes</h3>
          <IconGrid items={METHODES} />
        </div>

        <div className={`veille-conclusion ${conclusion.className}`} ref={conclusion.ref}>
          <h3>💡 Pourquoi ce Sujet ?</h3>
          <p>
            L'informatique quantique impactera directement la cybersécurité et l'infrastructure. Cette
            veille me permet d'anticiper les évolutions du chiffrement et de préparer la transition vers
            l'ère post-quantique.
          </p>
        </div>
      </div>
    </section>
  )
}
