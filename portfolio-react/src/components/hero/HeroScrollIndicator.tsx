import { useEffect, useRef, useState } from 'react'
import { useSmoothScrollTo } from '../../hooks/useSmoothScrollTo'

export function HeroScrollIndicator() {
  const scrollTo = useSmoothScrollTo()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hero = document.getElementById('accueil')
    if (!hero) return

    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <button
      ref={btnRef}
      type="button"
      className={`scroll-indicator${visible ? '' : ' scroll-indicator--hidden'}`}
      aria-label="Descendre vers le profil"
      onClick={() => {
        const target = document.getElementById('profil')
        if (target) scrollTo(target)
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )
}
