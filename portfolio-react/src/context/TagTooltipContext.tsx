import { createContext, useContext, useRef, useState, type ReactNode } from 'react'

interface TagTooltipContextValue {
  show: (target: HTMLElement, text: string) => void
  hide: () => void
  scheduleHide: (delayMs: number) => void
}

const TagTooltipContext = createContext<TagTooltipContextValue | null>(null)

/**
 * Single global tooltip mounted on <body>, matching Portfolio/script.js's
 * initTagTooltips(): positioned via fixed coordinates so it is never
 * clipped by a card's overflow.
 */
export function TagTooltipProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState('')
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const tipRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function show(target: HTMLElement, tooltipText: string) {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setText(tooltipText)
    setVisible(true)

    // Position after the tooltip has rendered with its final text.
    requestAnimationFrame(() => {
      const tip = tipRef.current
      if (!tip) return
      const r = target.getBoundingClientRect()
      const tipW = tip.offsetWidth
      const tipH = tip.offsetHeight
      let left = r.left + r.width / 2 - tipW / 2
      let top = r.top - tipH - 10

      left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8))
      if (top < 8) top = r.bottom + 10

      setPos({ top, left })
    })
  }

  function hide() {
    setVisible(false)
  }

  function scheduleHide(delayMs: number) {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(hide, delayMs)
  }

  return (
    <TagTooltipContext.Provider value={{ show, hide, scheduleHide }}>
      {children}
      <div
        id="global-tooltip"
        role="tooltip"
        aria-hidden={!visible}
        className={visible ? 'visible' : ''}
        ref={tipRef}
        style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
      >
        {text}
      </div>
    </TagTooltipContext.Provider>
  )
}

export function useTagTooltip(): TagTooltipContextValue {
  const ctx = useContext(TagTooltipContext)
  if (!ctx) {
    throw new Error('useTagTooltip must be used within a TagTooltipProvider')
  }
  return ctx
}
