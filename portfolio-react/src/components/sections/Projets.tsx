import { useReveal } from '../../hooks/useReveal'
import { useCardTilt } from '../projects/useCardTilt'
import { Tag } from '../projects/Tag'
import { TagTooltipProvider } from '../../context/TagTooltipContext'

interface ProjectDef {
  emoji: string
  title: string
  description: string
  tags: string[]
  download?: { href: string; dataDoc: string; label: string }
}

const PROJECTS: ProjectDef[] = [
  {
    emoji: '🖥️',
    title: 'Serveur Web LAMP',
    description: "Déploiement d'un serveur Linux Apache MariaDB PHP avec backup automatisé et monitoring.",
    tags: ['Linux', 'Apache', 'Bash', 'SSL'],
  },
  {
    emoji: '🌐',
    title: 'Infrastructure réseau VM',
    description: 'Configuration VMware complète avec routage VLAN, firewall pfSense et segmentation réseau.',
    tags: ['VMware', 'Réseau', 'pfSense', 'VLAN'],
  },
  {
    emoji: '🐍',
    title: 'Application Python',
    description:
      'Développement d\'un outil Python pour différentes tâches. Tel que créer des comptes Admin Local, etc...',
    tags: ['Python', 'TI-Python', 'JSON'],
  },
  {
    emoji: '💻',
    title: 'Maintenance code C#',
    description: "Correction de bugs et ajout de fonctionnalités sur une application de gestion.",
    tags: ['C#', '.NET', 'Debugging'],
  },
  {
    emoji: '🔒',
    title: 'Audit de sécurité',
    description: "Scan de vulnérabilités et tests d'intrusion sur infrastructure test avec Kali Linux.",
    tags: ['Kali Linux', 'Nmap', 'Pentesting'],
  },
  {
    emoji: '🌍',
    title: 'Portfolio Web',
    description: 'Création de ce portfolio hébergé sur o2switch avec configuration Apache et SSL.',
    tags: ['HTML/CSS', 'Apache', 'o2switch'],
  },
  {
    emoji: '🗂️',
    title: 'Active Directory & GPO',
    description:
      "Documentation technique E6 : configuration d'un annuaire Active Directory et de stratégies de groupes sur Windows Server 2025.",
    tags: ['Active Directory', 'Windows Server', 'GPO', 'DNS'],
    download: {
      href: 'docs/Docu_AD/AD_Documentation_Leo.pdf',
      dataDoc: 'docs/Docu_AD/AD_Documentation_Leo',
      label: 'Télécharger la documentation',
    },
  },
]

function ProjectCard({ project }: { project: ProjectDef }) {
  const { ref: revealRef, className } = useReveal<HTMLDivElement>()
  const { cardRef, shineRef } = useCardTilt<HTMLDivElement>()

  return (
    <div
      className={`project-card ${className}`}
      ref={(node) => {
        revealRef.current = node
        cardRef.current = node
      }}
    >
      <div className="project-image" aria-hidden="true">
        <span className="project-emoji">{project.emoji}</span>
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
        {project.download && (
          <a
            href={project.download.href}
            download
            data-doc={project.download.dataDoc}
            className="btn btn-outline project-download-btn"
          >
            <svg
              width="14"
              height="14"
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
            {project.download.label}
          </a>
        )}
      </div>
      <div className="card-shine" ref={shineRef} />
    </div>
  )
}

export function Projets() {
  const header = useReveal<HTMLDivElement>()

  return (
    <TagTooltipProvider>
      <section id="projets">
        <div className="container">
          <div className={header.className} ref={header.ref}>
            <span className="section-number">04</span>
            <h2>Projets</h2>
            <p className="section-subtitle">Mes réalisations techniques</p>
          </div>

          <div className="projects-grid">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>
    </TagTooltipProvider>
  )
}
