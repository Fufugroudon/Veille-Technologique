import { useEffect, useRef, useState } from 'react'

/**
 * Per-element scroll-reveal, mirroring Portfolio/script.js's global
 * IntersectionObserver (threshold 0.08, rootMargin -40px bottom):
 * fades an element in once it enters the viewport, then stops observing.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, className: `reveal${visible ? ' visible' : ''}` }
}
