import { useEffect, useRef, useState } from 'react'

const CHARS =
  'ァアィイゥウェエォオカガキギクグケゲコゴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
const FONT = 14
const AUTO_DISMISS_MS = 4000

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // AudioContext blocked — silent fallback
  }
}

/** Ports Portfolio/script.js's initMatrixEasterEgg(): Konami code (desktop) or triple-tap the logo (mobile). */
export function MatrixRain() {
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const konamiIdx = useRef(0)
  const tapCount = useRef(0)
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  function launch() {
    if (visibleRef.current) return
    playBeep()
    setVisible(true)
  }

  function dismiss() {
    setVisible(false)
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.keyCode === KONAMI[konamiIdx.current]) {
        konamiIdx.current++
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0
          launch()
        }
      } else {
        konamiIdx.current = 0
      }
    }

    function onBrandTouch(e: TouchEvent) {
      e.preventDefault()
      tapCount.current++
      if (tapTimer.current) clearTimeout(tapTimer.current)
      tapTimer.current = setTimeout(() => {
        tapCount.current = 0
      }, 1000)
      if (tapCount.current >= 3) {
        tapCount.current = 0
        launch()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const brand = document.querySelector('.nav-brand')
    brand?.addEventListener('touchstart', onBrandTouch as EventListener, { passive: false })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      brand?.removeEventListener('touchstart', onBrandTouch as EventListener)
      if (tapTimer.current) clearTimeout(tapTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    dismissTimer.current = setTimeout(dismiss, AUTO_DISMISS_MS)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let cols = 0
    let drops: number[] = []
    let raf = 0

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      cols = Math.floor(canvas!.width / FONT)
      drops = []
      for (let i = 0; i < cols; i++) drops[i] = Math.floor((Math.random() * -canvas!.height) / FONT)
    }

    function drawFrame() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
      ctx!.fillStyle = '#00ff41'
      ctx!.font = `${FONT}px monospace`

      for (let c = 0; c < cols; c++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx!.fillText(ch, c * FONT, drops[c] * FONT)
        if (drops[c] * FONT > canvas!.height && Math.random() > 0.975) drops[c] = 0
        drops[c]++
      }
      raf = requestAnimationFrame(drawFrame)
    }

    resize()
    drawFrame()

    return () => {
      cancelAnimationFrame(raf)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [visible])

  return (
    <div
      id="matrix-overlay"
      className={visible ? 'matrix-visible' : ''}
      onClick={dismiss}
      onTouchStart={dismiss}
    >
      {visible && <canvas id="matrix-canvas" ref={canvasRef} />}
      <div id="matrix-message">ACCÈS AUTORISÉ</div>
    </div>
  )
}
