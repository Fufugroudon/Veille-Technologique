import { useReveal } from '../../hooks/useReveal'

export function Profil() {
  const header = useReveal<HTMLDivElement>()
  const text = useReveal<HTMLDivElement>()
  const image = useReveal<HTMLDivElement>()

  return (
    <section id="profil">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">01</span>
          <h2>Profil</h2>
          <p className="section-subtitle">Qui suis-je ?</p>
        </div>

        <div className="profile-content">
          <div className={`profile-text ${text.className}`} ref={text.ref}>
            <h3>Un étudiant passionné</h3>
            <p>
              Actuellement en BTS Services Informatiques aux Organisations option SISR (Solutions
              d'Infrastructure, Systèmes et Réseaux), je me spécialise dans l'administration système, la
              configuration réseau et la cybersécurité.
            </p>
            <p>
              Passionné par les jeux vidéo, le développement (C#, Python) et la mythologie, je combine mes
              intérêts techniques avec une vision stratégique de carrière : intégrer l'Armée de l'air
              française après un master (BAC+5) et créer ma propre entreprise dans le domaine IT.
            </p>
            <p>
              Je développe activement mes compétences via des certifications (Cisco, Microsoft, Google,
              Nvidia) et des projets pratiques en infrastructure.
            </p>
            <div className="profile-tags">
              <span className="profile-tag">Infrastructure</span>
              <span className="profile-tag">Cybersécurité</span>
              <span className="profile-tag">Réseaux</span>
              <span className="profile-tag">Alternance</span>
              <span className="profile-tag">BAC+2</span>
            </div>
          </div>

          <div className={`profile-image ${image.className}`} ref={image.ref}>
            <div className="avatar-wrapper">
              <div className="avatar-ring" aria-hidden="true" />
              <div className="avatar-large">LL</div>
            </div>
            <a href="docs/Léo_CV.pdf" download data-doc="docs/Léo_CV" className="btn btn-primary cv-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger mon CV
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
