import { useEffect, useState } from 'react'

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function formatNow(): { time: string; date: string } {
  const tz = (() => {
    try {
      return localStorage.getItem('preferred_timezone') || undefined
    } catch {
      return undefined
    }
  })()
  const now = new Date()

  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...(tz ? { timeZone: tz } : {}),
  }
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(tz ? { timeZone: tz } : {}),
  }

  const tp = new Intl.DateTimeFormat('fr-FR', timeOpts).formatToParts(now)
  const h = tp.find((p) => p.type === 'hour')?.value ?? ''
  const m = tp.find((p) => p.type === 'minute')?.value ?? ''
  const s = tp.find((p) => p.type === 'second')?.value ?? ''

  const dp = new Intl.DateTimeFormat('fr-FR', dateOpts).formatToParts(now)
  const day = capitalize(dp.find((p) => p.type === 'weekday')?.value ?? '')
  const dateNum = dp.find((p) => p.type === 'day')?.value ?? ''
  const month = capitalize(dp.find((p) => p.type === 'month')?.value ?? '')
  const year = dp.find((p) => p.type === 'year')?.value ?? ''

  return { time: `${h}:${m}:${s}`, date: `${day} ${dateNum} ${month} ${year}` }
}

export function LiveClock() {
  const [now, setNow] = useState(formatNow)

  useEffect(() => {
    const interval = setInterval(() => setNow(formatNow()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="footer-clock">
      <div className="footer-clock-time">{now.time}</div>
      <div>{now.date}</div>
    </div>
  )
}
