import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface Burst {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  r: number
}

const COUNT = 80
const MAX_DIST = 120
const REPEL_R = 150

function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

/** Ports Portfolio/script.js's initParticles(): a drifting particle field with cursor repulsion and click bursts. */
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement as HTMLElement | null
    if (!canvas || !section || !window.requestAnimationFrame) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let pts: Point[] = []
    const bursts: Burst[] = []
    let raf = 0
    let mouseX = -9999
    let mouseY = -9999

    function makePt(): Point {
      return {
        x: rand(0, canvas!.width),
        y: rand(0, canvas!.height),
        vx: rand(-0.35, 0.35),
        vy: rand(-0.35, 0.35),
        r: rand(1.5, 2.5),
      }
    }

    function init() {
      canvas!.width = section!.offsetWidth
      canvas!.height = section!.offsetHeight
      pts = []
      for (let i = 0; i < COUNT; i++) pts.push(makePt())
    }

    function canvasPos(clientX: number, clientY: number) {
      const r = canvas!.getBoundingClientRect()
      return { x: clientX - r.left, y: clientY - r.top }
    }

    function spawnBurst(cx: number, cy: number) {
      const n = 8 + Math.floor(Math.random() * 5)
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2
        const speed = rand(1.5, 3.5)
        bursts.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          r: rand(2, 4),
        })
      }
    }

    function frame() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]

        const mdx = p.x - mouseX
        const mdy = p.y - mouseY
        const md = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < REPEL_R && md > 0.5) {
          const force = ((REPEL_R - md) / REPEL_R) * 0.5
          p.vx += (mdx / md) * force
          p.vy += (mdy / md) * force
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
          if (spd > 2) {
            p.vx = (p.vx / spd) * 2
            p.vy = (p.vy / spd) * 2
          }
        }

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = 'rgba(96, 165, 250, 0.55)'
        ctx!.fill()

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_DIST) {
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(q.x, q.y)
            ctx!.strokeStyle = `rgba(96, 165, 250, ${((1 - dist / MAX_DIST) * 0.2).toFixed(3)})`
            ctx!.lineWidth = 1
            ctx!.stroke()
          }
        }
      }

      for (let b = bursts.length - 1; b >= 0; b--) {
        const bp = bursts[b]
        bp.x += bp.vx
        bp.y += bp.vy
        bp.vx *= 0.96
        bp.vy *= 0.96
        bp.alpha -= 0.018
        if (bp.alpha <= 0) {
          bursts.splice(b, 1)
          continue
        }
        ctx!.beginPath()
        ctx!.arc(bp.x, bp.y, bp.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(96, 165, 250, ${bp.alpha.toFixed(3)})`
        ctx!.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    function handleMouseMove(e: MouseEvent) {
      const p = canvasPos(e.clientX, e.clientY)
      mouseX = p.x
      mouseY = p.y
    }

    function handleMouseLeave() {
      mouseX = -9999
      mouseY = -9999
    }

    function handleClick(e: MouseEvent) {
      const p = canvasPos(e.clientX, e.clientY)
      spawnBurst(p.x, p.y)
    }

    function handleTouchMove(e: TouchEvent) {
      const t = e.touches[0]
      const p = canvasPos(t.clientX, t.clientY)
      mouseX = p.x
      mouseY = p.y
    }

    function handleTouchStart(e: TouchEvent) {
      const t = e.touches[0]
      const p = canvasPos(t.clientX, t.clientY)
      mouseX = p.x
      mouseY = p.y
      spawnBurst(p.x, p.y)
    }

    function handleTouchEnd() {
      mouseX = -9999
      mouseY = -9999
    }

    function handleResize() {
      cancelAnimationFrame(raf)
      init()
      frame()
    }

    section.addEventListener('mousemove', handleMouseMove, { passive: true })
    section.addEventListener('mouseleave', handleMouseLeave)
    section.addEventListener('click', handleClick)
    section.addEventListener('touchmove', handleTouchMove, { passive: true })
    section.addEventListener('touchstart', handleTouchStart, { passive: true })
    section.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    init()
    frame()

    return () => {
      cancelAnimationFrame(raf)
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', handleMouseLeave)
      section.removeEventListener('click', handleClick)
      section.removeEventListener('touchmove', handleTouchMove)
      section.removeEventListener('touchstart', handleTouchStart)
      section.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particles-canvas" aria-hidden="true" />
}
