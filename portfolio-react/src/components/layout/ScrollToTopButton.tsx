import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'

function smoothScrollToTop(duration: number) {
  const scroller = document.scrollingElement || document.documentElement
  const start = scroller.scrollTop
  const startTime = performance.now()

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 4)
    scroller.scrollTop = start * (1 - ease)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function ScrollToTopButton() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <button
      id="back-to-top"
      type="button"
      aria-label={t.backToTop}
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        smoothScrollToTop(800)
      }}
    >
      ↑
    </button>
  )
}
