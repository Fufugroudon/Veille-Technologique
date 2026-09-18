import { useEffect, useRef, useState } from 'react'

const PART1 = 'Leseigneur '
const PART2 = 'Léo'
const TOTAL_CHARS = PART1.length + PART2.length
const TYPE_SPEED_MS = 80
const START_DELAY_MS = 600
const CURSOR_FADE_DELAY_MS = 800

/** Ports Portfolio/script.js's initTypingEffect() + initGlitchEffect() for the hero <h1>. */
export function HeroTitle() {
  const [charsShown, setCharsShown] = useState(0)
  const [done, setDone] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const glitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    function typeNext(count: number) {
      if (cancelled) return
      if (count >= TOTAL_CHARS) {
        timer = setTimeout(() => {
          if (!cancelled) setDone(true)
        }, CURSOR_FADE_DELAY_MS)
        return
      }
      setCharsShown(count + 1)
      timer = setTimeout(() => typeNext(count + 1), TYPE_SPEED_MS)
    }

    timer = setTimeout(() => typeNext(0), START_DELAY_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  function triggerGlitch() {
    if (glitching) return
    setGlitching(true)
    glitchTimer.current = setTimeout(() => setGlitching(false), 620)
  }

  useEffect(() => () => {
    if (glitchTimer.current) clearTimeout(glitchTimer.current)
  }, [])

  const part1Shown = PART1.slice(0, Math.min(charsShown, PART1.length))
  const part2Shown = PART2.slice(0, Math.max(0, charsShown - PART1.length))

  return (
    <h1
      className={`hero-title hero-anim-2${glitching ? ' glitching' : ''}`}
      data-text={`${PART1}${PART2}`}
      onMouseOver={triggerGlitch}
      onTouchStart={triggerGlitch}
    >
      {part1Shown}
      <span className="text-gradient">{part2Shown}</span>
      <span className={`typing-cursor${done ? ' typing-cursor--done' : ''}`} aria-hidden="true" />
    </h1>
  )
}
