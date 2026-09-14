import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useCardTilt } from '../projects/useCardTilt'
import { Tag } from '../projects/Tag'
import { TagTooltipProvider } from '../../context/TagTooltipContext'
import { DocActions } from '../docviewer/DocActions'

interface ProjectDef {
  emoji: string
  title: string
  description: string
  tags: string[]
  docBase?: string
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
    docBase: 'docs/Docu_AD/AD_Documentation_Leo',
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
        {project.docBase && (
          <div className="project-download-btn">
            <DocActions base={project.docBase} />
          </div>
        )}
      </div>
      <div className="card-shine" ref={shineRef} />
    </div>
  )
}

export function Projets() {
  const header = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()

  return (
    <TagTooltipProvider>
      <section id="projets">
        <div className="container">
          <div className={header.className} ref={header.ref}>
            <span className="section-number">05</span>
            <h2 ref={titleRef}>Projets</h2>
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
