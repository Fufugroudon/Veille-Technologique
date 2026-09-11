import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { useNavbarScrolled } from '../../hooks/useNavbarScrolled'
import { useActiveSection } from '../../hooks/useActiveSection'
import { SECTIONS } from '../../constants/sections'
import { ThemeToggle } from './ThemeToggle'

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function Header() {
  const { t } = useI18n()
  const scrolled = useNavbarScrolled()
  const activeId = useActiveSection(SECTION_IDS)
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLUListElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isOpen])

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <div className="container nav-container">
        <a href="#accueil" className="nav-brand">
          <span className="brand-badge" role="img" aria-label="Initiales de Léo Leseigneur">
            LL
          </span>
          <span className="brand-name">Leseigneur Léo</span>
        </a>

        <ul
          className={`nav-links${isOpen ? ' is-open' : ''}`}
          id="nav-menu"
          role="list"
          ref={navRef}
        >
          {SECTIONS.map((section, i) => {
            const isContact = section.id === 'contact'
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`nav-link${isContact ? ' nav-cta' : ''}${activeId === section.id ? ' active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {t.nav[i]}
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className="nav-toggle"
          id="nav-toggle"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          ref={toggleRef}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>

        <ThemeToggle />
      </div>
    </nav>
  )
}
