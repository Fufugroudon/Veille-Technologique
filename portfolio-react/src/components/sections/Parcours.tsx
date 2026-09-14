import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useI18n } from '../../i18n/I18nContext'

interface TimelineEntry {
  date: string
  badge: string
  badgeActive?: boolean
  title: string
  subtitle: string
  paragraphs: string[]
}

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
  const { t } = useI18n()
  const header = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()

  // Only the first (current) entry is still in progress — matches vanilla.
  const entries: TimelineEntry[] = t.parcours.entries.map((entry, i) => ({
    ...entry,
    badgeActive: i === 0,
  }))

  return (
    <section id="parcours">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">02</span>
          <h2 ref={titleRef}>{t.nav[2]}</h2>
          <p className="section-subtitle">{t.parcours.sectionSubtitle}</p>
        </div>

        <div className="timeline">
          {entries.map((entry) => (
            <TimelineItem key={entry.title} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
