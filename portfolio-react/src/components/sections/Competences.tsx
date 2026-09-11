import { useEffect, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
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

const CATEGORIES: SkillCategoryDef[] = [
  {
    icon: '⚙️',
    title: 'Administration Système',
    skills: [
      { name: 'Linux (Debian, Ubuntu, Kali)', pct: 90 },
      { name: 'Windows Server', pct: 80 },
      { name: 'Virtualisation (VMware, Proxmox)', pct: 85 },
    ],
  },
  {
    icon: '🌐',
    title: 'Réseaux',
    skills: [
      { name: 'Configuration réseau (VLAN, routing)', pct: 88 },
      { name: 'Firewall (pfSense, iptables)', pct: 75 },
      { name: 'Services réseau (DNS, DHCP, VPN)', pct: 82 },
    ],
  },
  {
    icon: '🔒',
    title: 'Cybersécurité',
    skills: [
      { name: 'Audit de sécurité', pct: 70 },
      { name: 'Pentest (Kali, Nmap, Burp Suite)', pct: 65 },
      { name: 'SSL/TLS, certificats', pct: 78 },
    ],
  },
  {
    icon: '💻',
    title: 'Développement & Scripts',
    skills: [
      { name: 'Bash / Shell scripting', pct: 85 },
      { name: 'Python', pct: 80 },
      { name: 'C#', pct: 75 },
    ],
  },
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
  const header = useReveal<HTMLDivElement>()

  return (
    <section id="competences">
      <SkillsGridCanvas />
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">03</span>
          <h2>Compétences</h2>
          <p className="section-subtitle">Mes expertises techniques</p>
        </div>

        <div className="skills-grid">
          {CATEGORIES.map((category) => (
            <SkillCategoryCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
