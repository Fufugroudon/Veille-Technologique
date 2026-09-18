import { useCallback } from 'react'

/** Eased smooth-scroll to an element, matching Portfolio/script.js's scroll-indicator/section-dots easing. */
export function useSmoothScrollTo() {
  return useCallback((target: HTMLElement, duration = 800) => {
    const scroller = document.scrollingElement || document.documentElement
    const startY = scroller.scrollTop
    const targetY = target.getBoundingClientRect().top + startY
    const distance = targetY - startY
    let startTime: number | null = null

    function step(now: number) {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      scroller.scrollTop = startY + distance * ease
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [])
}
