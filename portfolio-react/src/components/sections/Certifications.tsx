import { useReveal } from '../../hooks/useReveal'

// Extracted from the Profil prose in the original site, which only ever
// names these four vendors in one sentence — no dedicated section, no
// specific certificate titles or dates exist in the source content.
const VENDORS = ['Cisco', 'Microsoft', 'Google', 'Nvidia']

export function Certifications() {
  const header = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()

  return (
    <section id="certifications">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <h2>Certifications</h2>
          <p className="section-subtitle">Compétences en développement continu</p>
        </div>

        <p className="certifications-intro">
          Je développe activement mes compétences via des certifications, en parallèle de projets pratiques
          en infrastructure.
        </p>

        <div className={`certifications-grid ${grid.className}`} ref={grid.ref}>
          {VENDORS.map((vendor) => (
            <div className="certification-card" key={vendor}>
              <div className="certification-name">{vendor}</div>
              <div className="certification-status">En cours</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
