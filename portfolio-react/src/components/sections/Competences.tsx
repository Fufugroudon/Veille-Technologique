import { useEffect, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useI18n } from '../../i18n/I18nContext'
import { SkillsGridCanvas } from './SkillsGridCanvas'

interface Skill {
  name: string
  pct: number
}

interface SkillCategoryDef {
  icon: string
  title: string
  skills: Skill[]
}

// Percentages and icons are decorative/numeric — not translated, only labels are.
const ICONS = ['⚙️', '🌐', '🔒', '💻']
const PCTS = [
  [90, 80, 85],
  [88, 75, 82],
  [70, 65, 78],
  [85, 80, 75],
]

function SkillCategoryCard({ category }: { category: SkillCategoryDef }) {
  const { ref: revealRef, className } = useReveal<HTMLDivElement>()
  const [barsTriggered, setBarsTriggered] = useState(false)

  useEffect(() => {
    const el = revealRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setBarsTriggered(true)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [revealRef])

  return (
    <div className={`skill-category ${className}`} ref={revealRef}>
      <div className="skill-category-header">
        <span className="skill-cat-icon" aria-hidden="true">
          {category.icon}
        </span>
        <h3>{category.title}</h3>
      </div>
      {category.skills.map((skill) => (
        <div className="skill-item" key={skill.name}>
          <div className="skill-name">
            <span>{skill.name}</span>
            <span className="skill-pct">{skill.pct}%</span>
          </div>
          <div className="skill-bar">
            <div className="skill-progress" style={{ width: barsTriggered ? `${skill.pct}%` : undefined }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Competences() {
  const { t } = useI18n()
  const header = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()

  const categories: SkillCategoryDef[] = t.competences.categories.map((cat, i) => ({
    icon: ICONS[i],
    title: cat.title,
    skills: cat.skills.map((name, j) => ({ name, pct: PCTS[i][j] })),
  }))

  return (
    <section id="competences">
      <SkillsGridCanvas />
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">03</span>
          <h2 ref={titleRef}>{t.nav[3]}</h2>
          <p className="section-subtitle">{t.competences.sectionSubtitle}</p>
        </div>

        <div className="skills-grid">
          {categories.map((category) => (
            <SkillCategoryCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
