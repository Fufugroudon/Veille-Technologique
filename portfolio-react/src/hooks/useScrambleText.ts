import { useEffect, useRef } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'
const DURATION = 800 // ms total scramble phase
const STEP_MS = 40 // repaint interval

function randChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)]
}

function scramble(el: HTMLElement) {
  const original = el.textContent ?? ''
  const length = original.length
  if (length === 0) return
  const resolveInterval = DURATION / length
  let elapsed = 0

  const timer = setInterval(() => {
    elapsed += STEP_MS
    const resolved = Math.min(Math.floor(elapsed / resolveInterval), length)

    let out = ''
    for (let i = 0; i < length; i++) {
      if (i < resolved) out += original[i]
      else if (original[i] === ' ') out += ' '
      else out += randChar()
    }
    el.textContent = out

    if (resolved >= length) {
      clearInterval(timer)
      el.textContent = original
    }
  }, STEP_MS)
}

/**
 * Scrambles a heading's letters into random characters then resolves them
 * left-to-right once it scrolls into view, mirroring Portfolio/script.js's
 * initScrambleText(). Mutates el.textContent imperatively (DOM-only, runs
 * once per element) rather than through React state, matching the vanilla
 * one-shot animation exactly.
 */
export function useScrambleText<T extends HTMLElement = HTMLHeadingElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          scramble(entry.target as HTMLElement)
        })
      },
      { threshold: 0.6 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
