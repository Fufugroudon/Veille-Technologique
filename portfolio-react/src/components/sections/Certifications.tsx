import { useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { DocActions } from '../docviewer/DocActions'

type Category = 'langue' | 'reseau' | 'cloud' | 'securite' | 'methode' | 'mooc'

interface CertDef {
  category: Category
  icon: string
  badgeLabel: string
  title: string
  issuer: string
  description: string
  level: string
  year: string
  docBase: string
}

const FILTERS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'langue', label: 'Langues' },
  { id: 'reseau', label: 'Réseau' },
  { id: 'cloud', label: 'Cloud & IA' },
  { id: 'securite', label: 'Sécurité' },
  { id: 'methode', label: 'Méthodes' },
  { id: 'mooc', label: 'MOOC' },
]

const CERTIFICATIONS: CertDef[] = [
  {
    category: 'langue',
    icon: '🇬🇧',
    badgeLabel: 'Langue',
    title: 'Cambridge English Certificate',
    issuer: 'Cambridge University Press & Assessment',
    description: "Attestation officielle de compétence en anglais délivrée par Cambridge.",
    level: 'B2 — Upper Intermediate',
    year: '2024',
    docBase: 'docs/certifications/cambridge',
  },
]

export function Certifications() {
  const header = useReveal<HTMLDivElement>()
  const filters = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all')

  return (
    <section id="certifications">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">04</span>
          <h2>Certifications</h2>
          <p className="section-subtitle">Mes accréditations et attestations</p>
        </div>

        <div className={`cert-filters ${filters.className}`} ref={filters.ref}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`cert-filter-btn${activeFilter === f.id ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={`cert-grid ${grid.className}`} ref={grid.ref}>
          {CERTIFICATIONS.map((cert) => (
            <article
              className={`cert-card${activeFilter !== 'all' && activeFilter !== cert.category ? ' hidden' : ''}`}
              key={cert.title}
            >
              <div className="cert-card-header">
                <div className="cert-icon-wrap">
                  <span className="cert-icon" aria-hidden="true">
                    {cert.icon}
                  </span>
                </div>
                <span className={`cert-badge cert-badge-${cert.category}`}>{cert.badgeLabel}</span>
              </div>
              <div className="cert-card-body">
                <h3>{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <p className="cert-desc">{cert.description}</p>
              </div>
              <div className="cert-card-footer">
                <span className="cert-level">{cert.level}</span>
                <span className="cert-year">{cert.year}</span>
                <DocActions base={cert.docBase} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
