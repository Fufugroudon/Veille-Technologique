import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useI18n } from '../../i18n/I18nContext'
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

// Emoji/tags are language-independent (tags are technical terms, kept as-is
// like vanilla); title/description come from i18n.
const EMOJIS = ['🖥️', '🌐', '🐍', '💻', '🔒', '🌍', '🗂️']
const TAGS = [
  ['Linux', 'Apache', 'Bash', 'SSL'],
  ['VMware', 'Réseau', 'pfSense', 'VLAN'],
  ['Python', 'TI-Python', 'JSON'],
  ['C#', '.NET', 'Debugging'],
  ['Kali Linux', 'Nmap', 'Pentesting'],
  ['HTML/CSS', 'Apache', 'o2switch'],
  ['Active Directory', 'Windows Server', 'GPO', 'DNS'],
]
const DOC_BASE = 'docs/Docu_AD/AD_Documentation_Leo'

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
  const { t } = useI18n()
  const header = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()

  const projects: ProjectDef[] = t.projets.items.map((item, i) => ({
    emoji: EMOJIS[i],
    title: item.title,
    description: item.description,
    tags: TAGS[i],
    docBase: i === TAGS.length - 1 ? DOC_BASE : undefined,
  }))

  return (
    <TagTooltipProvider>
      <section id="projets">
        <div className="container">
          <div className={header.className} ref={header.ref}>
            <span className="section-number">05</span>
            <h2 ref={titleRef}>{t.nav[5]}</h2>
            <p className="section-subtitle">{t.projets.sectionSubtitle}</p>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>
    </TagTooltipProvider>
  )
}
