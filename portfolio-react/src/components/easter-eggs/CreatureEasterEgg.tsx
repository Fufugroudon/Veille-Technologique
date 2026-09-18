import { useEffect, useRef, useState } from 'react'
import { CREATURES, CREATURE_LABELS, PARTICLE_COLORS } from './creatureData'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  dx: number
  dy: number
}

interface Creature {
  id: number
  x: number
  y: number
  emoji: string
  label: string
}

const CLICK_WINDOW_MS = 900

/** Ports Portfolio/script.js's triple-click mythological creature easter egg on #accueil. */
export function CreatureEasterEgg() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [risingIds, setRisingIds] = useState<Set<number>>(new Set())
  const [burstingIds, setBurstingIds] = useState<Set<number>>(new Set())
  const nextId = useRef(0)
  const clickTimes = useRef<number[]>([])

  function spawnExplosion(x: number, y: number) {
    const count = Math.floor(Math.random() * 5) + 12
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 6) + 5
      const angle = Math.random() * 2 * Math.PI
      const dist = Math.floor(Math.random() * 60) + 40
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
      newParticles.push({
        id: nextId.current++,
        x,
        y,
        size,
        color,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
      })
    }
    setParticles((prev) => [...prev, ...newParticles])

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBurstingIds((prev) => {
          const next = new Set(prev)
          newParticles.forEach((p) => next.add(p.id))
          return next
        })
      })
    })

    const ids = newParticles.map((p) => p.id)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !ids.includes(p.id)))
      setBurstingIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    }, 650)
  }

  function spawnCreature(x: number, y: number) {
    const emoji = CREATURES[Math.floor(Math.random() * CREATURES.length)]
    const label = CREATURE_LABELS[emoji] ?? ''
    const id = nextId.current++
    setCreatures((prev) => [...prev, { id, x, y, emoji, label }])

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRisingIds((prev) => new Set(prev).add(id))
      })
    })

    setTimeout(() => {
      setCreatures((prev) => prev.filter((c) => c.id !== id))
      setRisingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 2000)
  }

  useEffect(() => {
    const section = document.getElementById('accueil')
    if (!section) return

    function handleInteraction(x: number, y: number) {
      const now = Date.now()
      clickTimes.current.push(now)
      clickTimes.current = clickTimes.current.filter((t) => now - t <= CLICK_WINDOW_MS)

      if (clickTimes.current.length >= 3) {
        clickTimes.current = []
        spawnExplosion(x, y)
        spawnCreature(x, y)
      }
    }

    function handleClick(e: MouseEvent) {
      handleInteraction(e.clientX, e.clientY)
    }

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    section.addEventListener('click', handleClick)
    section.addEventListener('touchstart', handleTouchStart, { passive: true })
    return () => {
      section.removeEventListener('click', handleClick)
      section.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className={`creature-particle${burstingIds.has(p.id) ? ' creature-particle--burst' : ''}`}
          style={{
            left: `${p.x - p.size / 2}px`,
            top: `${p.y - p.size / 2}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            transform: burstingIds.has(p.id) ? `translate(${p.dx}px, ${p.dy}px) scale(0)` : undefined,
          }}
        />
      ))}
      {creatures.map((c) => (
        <div
          key={c.id}
          className={`creature-wrap${risingIds.has(c.id) ? ' creature-wrap--rising' : ''}`}
          style={{ left: `${c.x}px`, top: `${c.y}px` }}
        >
          <div>{c.emoji}</div>
          <div className="creature-label">{c.label}</div>
        </div>
      ))}
    </>
  )
}
