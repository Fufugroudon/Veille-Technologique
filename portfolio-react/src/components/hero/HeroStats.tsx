import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { useReveal } from '../../hooks/useReveal'

interface StatDef {
  target: number
  suffix: string
}

const STATS: StatDef[] = [
  { target: 10, suffix: '+' },
  { target: 5, suffix: '+' },
  { target: 2, suffix: '' },
  { target: 100, suffix: '%' },
]

const DURATION_MS = 1600

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function StatCounter({ target, suffix }: StatDef) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(`0${suffix}`)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)

          let startTs: number | null = null
          function tick(timestamp: number) {
            if (startTs === null) startTs = timestamp
            const elapsed = timestamp - startTs
            const progress = Math.min(elapsed / DURATION_MS, 1)
            const current = Math.floor(easeOutCubic(progress) * target)
            setDisplay(`${current}${suffix}`)
            if (progress < 1) requestAnimationFrame(tick)
            else setDisplay(`${target}${suffix}`)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.6 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix])

  return (
    <span className="stat-number" ref={ref}>
      {display}
    </span>
  )
}

function StatBox({ index }: { index: number }) {
  const { t } = useI18n()
  const { ref, className } = useReveal<HTMLDivElement>()
  const stat = STATS[index]

  return (
    <div className={`stat-box ${className}`} ref={ref}>
      <StatCounter target={stat.target} suffix={stat.suffix} />
      <span className="stat-label">{t.statLabels[index]}</span>
    </div>
  )
}

export function HeroStats() {
  return (
    <div className="stats hero-anim-6">
      {STATS.map((_, i) => (
        <StatBox key={i} index={i} />
      ))}
    </div>
  )
}
