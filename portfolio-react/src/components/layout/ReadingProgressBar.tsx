import { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      setPercent(Math.min(pct, 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      id="reading-progress"
      aria-hidden="true"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      style={{ width: `${percent.toFixed(1)}%` }}
    />
  )
}
