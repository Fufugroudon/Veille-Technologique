import { SECTIONS } from '../../constants/sections'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useSmoothScrollTo } from '../../hooks/useSmoothScrollTo'

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function SectionDots() {
  const activeId = useActiveSection(SECTION_IDS)
  const scrollTo = useSmoothScrollTo()

  return (
    <nav id="section-dots" aria-label="Navigation par sections">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          className={`section-dot${activeId === section.id ? ' active' : ''}`}
          aria-label={`Aller à ${section.labelFr}`}
          aria-current={activeId === section.id}
          data-section={section.id}
          onClick={() => {
            const el = document.getElementById(section.id)
            if (el) scrollTo(el)
          }}
        >
          <span className="section-dot-label">{section.labelFr}</span>
        </button>
      ))}
    </nav>
  )
}
