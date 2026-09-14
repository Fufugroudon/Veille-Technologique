import { useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useI18n } from '../../i18n/I18nContext'
import { DocActions } from '../docviewer/DocActions'

type Category = 'langue' | 'reseau' | 'cloud' | 'securite' | 'methode' | 'mooc'

// Extracted from vanilla: category/icon/year/docBase are not translated
// (icons and dates are language-independent); labels come from i18n.
const ICONS = ['🇬🇧']
const CATEGORIES: Category[] = ['langue']
const YEARS = ['2024']
const DOC_BASES = ['docs/certifications/cambridge']

export function Certifications() {
  const { t } = useI18n()
  const header = useReveal<HTMLDivElement>()
  const filters = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all')

  return (
    <section id="certifications">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">04</span>
          <h2 ref={titleRef}>{t.nav[4]}</h2>
          <p className="section-subtitle">{t.certifications.sectionSubtitle}</p>
        </div>

        <div className={`cert-filters ${filters.className}`} ref={filters.ref}>
          {t.certifications.filters.map((f) => (
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
          {t.certifications.items.map((cert, i) => {
            const category = CATEGORIES[i]
            return (
              <article
                className={`cert-card${activeFilter !== 'all' && activeFilter !== category ? ' hidden' : ''}`}
                key={cert.title}
              >
                <div className="cert-card-header">
                  <div className="cert-icon-wrap">
                    <span className="cert-icon" aria-hidden="true">
                      {ICONS[i]}
                    </span>
                  </div>
                  <span className={`cert-badge cert-badge-${category}`}>{cert.badgeLabel}</span>
                </div>
                <div className="cert-card-body">
                  <h3>{cert.title}</h3>
                  <p className="cert-issuer">{cert.issuer}</p>
                  <p className="cert-desc">{cert.description}</p>
                </div>
                <div className="cert-card-footer">
                  <span className="cert-level">{cert.level}</span>
                  <span className="cert-year">{YEARS[i]}</span>
                  <DocActions base={DOC_BASES[i]} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
