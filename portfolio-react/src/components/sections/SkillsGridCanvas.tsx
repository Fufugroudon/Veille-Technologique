import { useEffect, useRef } from 'react'

interface Pulse {
  cx: number
  cy: number
  r: number
  growing: boolean
}

const GAP = 40
const DOT_R = 2

/** Ports Portfolio/script.js's initSkillsGridCanvas(): a static dot grid with slow random pulses. */
export function SkillsGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement as HTMLElement | null
    if (!canvas || !section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let pulses: Pulse[] = []
    let raf = 0

    function resize() {
      canvas!.width = section!.offsetWidth
      canvas!.height = section!.offsetHeight
    }

    function randomPulse(): Pulse {
      const cols = Math.floor(canvas!.width / GAP)
      const rows = Math.floor(canvas!.height / GAP)
      return {
        cx: (Math.floor(Math.random() * cols) + 0.5) * GAP,
        cy: (Math.floor(Math.random() * rows) + 0.5) * GAP,
        r: DOT_R,
        growing: true,
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      ctx!.fillStyle = 'rgba(59,130,246,0.08)'
      for (let x = GAP / 2; x < canvas!.width; x += GAP) {
        for (let y = GAP / 2; y < canvas!.height; y += GAP) {
          ctx!.beginPath()
          ctx!.arc(x, y, DOT_R, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      pulses = pulses.filter((p) => {
        ctx!.beginPath()
        ctx!.arc(p.cx, p.cy, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(59,130,246,0.3)'
        ctx!.fill()

        if (p.growing) {
          p.r += 0.12
          if (p.r >= 6) p.growing = false
        } else {
          p.r -= 0.12
        }

        return !(!p.growing && p.r <= DOT_R)
      })

      raf = requestAnimationFrame(draw)
    }

    const pulseInterval = setInterval(() => {
      if (pulses.length < 3) {
        pulses.push(randomPulse())
        pulses.push(randomPulse())
      }
    }, 3000)

    resize()
    window.addEventListener('resize', resize, { passive: true })
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(pulseInterval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="skills-grid-canvas" aria-hidden="true" />
}
