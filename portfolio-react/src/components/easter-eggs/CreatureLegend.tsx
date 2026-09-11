import { useEffect, useRef, useState } from 'react'
import { CREATURE_BESTIARY } from './creatureData'

export function CreatureLegend() {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) closeBtnRef.current?.focus()
  }, [open])

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (!open) return
      const target = e.target as Node
      if (panelRef.current && !panelRef.current.contains(target) && target !== btnRef.current) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false)
    }

    document.addEventListener('click', handleOutside)
    document.addEventListener('touchstart', handleOutside, { passive: true })
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <>
      <button
        id="creature-legend-btn"
        type="button"
        aria-label="Ouvrir le bestiaire mythologique"
        title="Bestiaire mythologique"
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        🐉
        <span className="creature-legend-badge">?</span>
      </button>

      <div
        id="creature-legend-panel"
        className={open ? 'creature-legend-open' : ''}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Bestiaire mythologique"
        ref={panelRef}
      >
        <div className="creature-legend-header">
          <span className="creature-legend-title">📚 Bestiaire Mythologique</span>
          <button
            type="button"
            className="creature-legend-close"
            aria-label="Fermer"
            ref={closeBtnRef}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              btnRef.current?.focus()
            }}
          >
            ✕
          </button>
        </div>

        <p className="creature-legend-hint">
          💡 Triple-clic sur le fond de l'accueil pour invoquer une créature
        </p>

        <div className="creature-legend-list">
          {CREATURE_BESTIARY.map((entry, i) => (
            <div
              className={`creature-legend-row${i === CREATURE_BESTIARY.length - 1 ? ' last' : ''}`}
              key={entry.emoji}
            >
              <span className="creature-legend-emoji">{entry.emoji}</span>
              <div className="creature-legend-info">
                <span className="creature-legend-name">{entry.name}</span>
                <span className="creature-legend-desc">{entry.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
