import { useReveal } from '../../hooks/useReveal'

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
          <span className="section-number">05</span>
          <h2>Veille Technologique</h2>
          <p className="section-subtitle">Ordinateurs Quantiques vs Ordinateurs Classiques</p>
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
