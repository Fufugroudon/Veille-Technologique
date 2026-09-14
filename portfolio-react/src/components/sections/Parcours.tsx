import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'

interface TimelineEntry {
  date: string
  badge: string
  badgeActive?: boolean
  title: string
  subtitle: string
  paragraphs: string[]
}

const ENTRIES: TimelineEntry[] = [
  {
    date: "Sept 2025 — Aujourd'hui",
    badge: 'En cours',
    badgeActive: true,
    title: 'BTS SIO — Option SISR',
    subtitle: 'BTS Services Informatiques aux Organisations',
    paragraphs: [
      'Ensitech, Cergy',
      "Option Solutions d'Infrastructure, Systèmes et Réseaux",
      "Formation en alternance axée sur l'administration système, la gestion réseau et la cybersécurité.",
    ],
  },
  {
    date: 'Sept 2022 — Juin 2025',
    badge: 'Obtenu avec mention',
    title: 'Baccalauréat Général',
    subtitle: 'Spécialités Scientifiques',
    paragraphs: [
      'Spécialités AMC (Anglais Monde Contemporain) et NSI (Numérique et Sciences Informatiques)',
      "Formation aux bases de l'informatique et de la programmation.",
    ],
  },
  {
    date: '2018 — 2022',
    badge: 'Obtenu avec mention',
    title: 'Collège',
    subtitle: 'Brevet des collèges',
    paragraphs: ['Obtention du diplôme national du brevet avec mention.'],
  },
]

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const { ref, className } = useReveal<HTMLDivElement>()

  return (
    <div className={`timeline-item ${className}`} ref={ref}>
      <div className="timeline-dot" aria-hidden="true" />
      <div className="timeline-body">
        <time className="timeline-date">{entry.date}</time>
        <div className="timeline-content">
          <span className={`timeline-badge${entry.badgeActive ? ' badge-active' : ''}`}>{entry.badge}</span>
          <h3>{entry.title}</h3>
          <h4>{entry.subtitle}</h4>
          {entry.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Parcours() {
  const header = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()

  return (
    <section id="parcours">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">02</span>
          <h2 ref={titleRef}>Parcours</h2>
          <p className="section-subtitle">Mon chemin académique</p>
        </div>

        <div className="timeline">
          {ENTRIES.map((entry) => (
            <TimelineItem key={entry.title} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
