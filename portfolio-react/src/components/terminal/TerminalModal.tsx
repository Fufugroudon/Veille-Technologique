import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../context/ThemeContext'
import { useI18n } from '../../i18n/I18nContext'
import { downloadFile } from '../docviewer/docUtils'
import { COMMANDS, TIMEZONE_MAP, FORTUNES, BLAGUES } from './terminalData'

interface Props {
  open: boolean
  onClose: () => void
}

interface OutputLine {
  id: number
  node: ReactNode
}

const MATRIX_CHARS = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', '0', '1']

function buildAsciiBox(lines: string[]): string[] {
  const maxLen = lines.reduce((m, l) => Math.max(m, l.length), 0)
  const bar = '─'.repeat(maxLen + 2)
  const rows = lines.map((l) => `│ ${l}${' '.repeat(maxLen - l.length)} │`)
  return [`┌${bar}┐`, ...rows, `└${bar}┘`]
}

export function TerminalModal({ open, onClose }: Props) {
  const { light, toggle: toggleTheme } = useTheme()
  const { setLang } = useI18n()

  const [output, setOutput] = useState<OutputLine[]>([])
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lineIdRef = useRef(0)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  function print(node: ReactNode) {
    const id = lineIdRef.current++
    setOutput((prev) => [...prev, { id, node }])
  }

  function printLine(text: string, className?: string) {
    print(<div className={`term-line${className ? ` ${className}` : ''}`}>{text}</div>)
  }

  function printBlank() {
    printLine('')
  }

  function schedule(fn: () => void, delay: number) {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer)
      fn()
    }, delay)
    timersRef.current.add(timer)
    return timer
  }

  useEffect(() => {
    if (!open) return
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
  }, [output, open])

  useEffect(() => {
    if (!open) return
    if (window.innerWidth > 768) inputRef.current?.focus()
    if (output.length === 0) printWelcome()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [])

  function printWelcome() {
    printLine('  _____                   _             _ ', 'term-line-accent')
    printLine(" |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |", 'term-line-accent')
    printLine("   | |/ _ \\ '__| '_ ` _ \\| | '_ \\ / _` | |", 'term-line-accent')
    printLine('   | |  __/ |  | | | | | | | | | | (_| | |', 'term-line-accent')
    printLine("   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|", 'term-line-accent')
    printLine('  Bienvenue ! Tapez "help" pour voir les commandes.', 'term-line-muted')
    printBlank()
    printBlank()
  }

  // ── Command handlers ──────────────────────────────────────────────────
  function cmdHelp() {
    printBlank()
    printLine('Commandes disponibles :', 'term-line-accent')
    Object.entries(COMMANDS).forEach(([cmd, desc]) => {
      print(
        <div className="term-line help-row" key={cmd}>
          <span className="terminal-cmd-name">{cmd}</span>
          <span>{desc}</span>
        </div>,
      )
    })
    printBlank()
  }

  function cmdWhoami() {
    printBlank()
    buildAsciiBox(['Leseigneur Léo', 'Étudiant BTS SIO option SISR', 'Ensitech, Cergy']).forEach((l) =>
      printLine(`  ${l}`),
    )
    printBlank()
    printLine('  Passions  : Infrastructure, réseaux, cybersécurité')
    printLine("  Fun fact  : Passionné par l'informatique de manière générale")
    printLine('  Stack     : Linux, Apache, pfSense, Python, C#')
    printBlank()
  }

  function cmdSkills() {
    const skills = [
      { name: 'Linux / Bash', pct: 80 },
      { name: 'Réseaux / VLAN', pct: 75 },
      { name: 'Sécurité / CTF', pct: 70 },
      { name: 'Python', pct: 65 },
      { name: 'C# / .NET', pct: 60 },
      { name: 'HTML/CSS', pct: 72 },
    ]
    const lines = skills.map((s) => {
      const bars = Math.round(s.pct / 5)
      const filled = '█'.repeat(bars)
      const empty = '░'.repeat(20 - bars)
      return `${s.name.padEnd(16)} [${filled}${empty}] ${s.pct}%`
    })
    printBlank()
    printLine('  Compétences :', 'term-line-accent')
    buildAsciiBox(lines).forEach((l) => printLine(`  ${l}`))
    printBlank()
  }

  function cmdContact() {
    printBlank()
    printLine('  ✉  Email  : leo.leseigneur@orange.fr', 'term-line-accent')
    print(
      <div className="term-line">
        {'  🔗 GitHub : '}
        <button
          type="button"
          className="term-line-link"
          onClick={() => window.open('https://github.com/Fufugroudon', '_blank')}
        >
          github.com/Fufugroudon
        </button>
      </div>,
    )
    print(
      <div className="term-line">
        {'  🌐 Site   : '}
        <button
          type="button"
          className="term-line-link"
          onClick={() => window.open('https://lesnorrys.com', '_blank')}
        >
          lesnorrys.com
        </button>
      </div>,
    )
    printBlank()
  }

  function cmdSecret() {
    printBlank()
    buildAsciiBox(['     SÉQUENCE SECRÈTE     ']).forEach((l) => printLine(`  ${l}`))
    printBlank()
    printLine('  ► Étape 1 — Konami Code (desktop)', 'term-line-accent')
    printLine('    Appuyez sur : ↑ ↑ ↓ ↓ ← → ← → B A')
    printBlank()
    printLine('  ► Étape 2 — Triple Tap (mobile)', 'term-line-accent')
    printLine('    Appuyez 3 fois sur le logo du site')
    printBlank()
    printLine('  ► Résultat', 'term-line-accent')
    printLine("    La pluie Matrix envahit l'écran pendant 4 secondes.")
    printLine('    Message : "ACCÈS AUTORISÉ"')
    printBlank()
  }

  function cmdHack() {
    printLine('  Initialisation de la connexion...', 'term-line-muted')
    const ips = ['192.168.1.1', '10.0.0.1', '172.16.4.2', '203.0.113.42', '198.51.100.7']
    const msgs = [
      'PORT SCAN en cours...',
      "Tentative d'intrusion sur /etc/passwd...",
      'Escalade de privilèges...',
      'Exécution du payload...',
      'Téléchargement des données sensibles...',
      'Détecté par le système de défense !',
    ]

    function step(i: number) {
      if (i < 5) {
        printLine(`  > ${ips[i]} ... ${msgs[i]}`)
      } else if (i === 5) {
        printLine(`  > ${msgs[5]}`, 'term-line-error')
      } else {
        printBlank()
        printLine('  ⛔ ACCÈS REFUSÉ. Cible trop forte.', 'term-line-error')
        printBlank()
        return
      }
      schedule(() => step(i + 1), 380)
    }

    schedule(() => step(0), 380)
  }

  async function cmdWeather() {
    const WMO: Record<number, string> = {
      0: 'Ciel dégagé ☀️',
      1: 'Principalement dégagé',
      2: 'Partiellement nuageux ⛅',
      3: 'Couvert ☁️',
      45: 'Brouillard 🌫️',
      48: 'Brouillard givrant',
      51: 'Bruine légère',
      61: 'Pluie légère 🌧️',
      71: 'Neige légère ❄️',
      95: 'Orage ⛈️',
      99: 'Orage + grêle',
    }

    async function fetchAndDisplay(lat: number, lon: number, cityLabel: string) {
      const tz = localStorage.getItem('preferred_timezone') || 'Europe/Paris'
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=${encodeURIComponent(tz)}`

      try {
        const d = await fetch(url).then((r) => r.json())
        const c = d.current
        const cond = WMO[c.weather_code] ?? `Code ${c.weather_code}`
        printBlank()
        buildAsciiBox([`Météo — ${cityLabel}`, `Temp.  : ${c.temperature_2m}°C`, `Vent   : ${c.wind_speed_10m} km/h`, cond]).forEach(
          (l) => printLine(`  ${l}`),
        )
        printBlank()
      } catch {
        printLine('  ⚠️ Impossible de récupérer la météo.', 'term-line-error')
      }
    }

    function fallback() {
      return fetchAndDisplay(49.2333, 2.1333, 'Méru, FR (position par défaut)')
    }

    if (!navigator.geolocation) {
      printLine('  Géolocalisation non disponible. Utilisation de Méru...', 'term-line-muted')
      await fallback()
      return
    }

    printLine('  Récupération de la position...', 'term-line-muted')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`).then((r) =>
            r.json(),
          )
          const addr = geo.address || {}
          const city = addr.city || addr.town || addr.village || addr.county || 'Position'
          const country = addr.country_code ? addr.country_code.toUpperCase() : ''
          await fetchAndDisplay(lat, lon, `${city}${country ? `, ${country}` : ''}`)
        } catch {
          await fetchAndDisplay(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`)
        }
      },
      async () => {
        printLine('  Accès refusé. Utilisation de Méru...', 'term-line-muted')
        await fallback()
      },
      { timeout: 8000 },
    )
  }

  function cmdTimezone(arg: string) {
    if (!arg) {
      const current = localStorage.getItem('preferred_timezone') || 'Europe/Paris (défaut)'
      printBlank()
      printLine('  Usage: timezone <zone>', 'term-line-accent')
      printBlank()
      printLine(`  Zone active : ${current}`)
      printBlank()
      printLine('  Zones disponibles :')
      Object.keys(TIMEZONE_MAP).forEach((k) => {
        const displayKey =
          k === 'utc' ? 'UTC' : k.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
        printLine(`    ${displayKey.padEnd(12)}→ ${TIMEZONE_MAP[k]}`)
      })
      printBlank()
      return
    }

    const iana = TIMEZONE_MAP[arg]
    if (!iana) {
      printLine(`  Zone inconnue : "${arg}". Tapez "timezone" pour la liste.`, 'term-line-error')
      return
    }

    localStorage.setItem('preferred_timezone', iana)
    printLine(`  ✓ Fuseau horaire défini sur ${iana}`, 'term-line-accent')
  }

  const fortunesRef = useRef(FORTUNES)
  function cmdFortune() {
    const list = fortunesRef.current
    const q = list[Math.floor(Math.random() * list.length)]
    printBlank()
    printLine(`  "${q.text}"`)
    printLine(`  ${q.src}`, 'term-line-accent')
    printBlank()
  }

  function cmdBlague() {
    const joke = BLAGUES[Math.floor(Math.random() * BLAGUES.length)]
    printBlank()
    printLine(`  ${joke}`, 'term-line-accent')
    printBlank()
  }

  async function cmdPing() {
    printLine('  PING lesnorrys.fr…', 'term-line-accent')
    const t0 = performance.now()
    const controller = new AbortController()
    const timer = schedule(() => controller.abort(), 5000)
    try {
      await fetch('https://lesnorrys.fr', { mode: 'no-cors', signal: controller.signal })
      clearTimeout(timer)
      timersRef.current.delete(timer)
      const ms = Math.round(performance.now() - t0)
      printLine(`  PING lesnorrys.fr — réponse en ${ms}ms [OK]`, 'term-line-accent')
    } catch {
      clearTimeout(timer)
      timersRef.current.delete(timer)
      printLine('  PING lesnorrys.fr — [TIMEOUT]', 'term-line-error')
    }
  }

  function cmdCountdown() {
    const end = new Date('2027-05-31T00:00:00').getTime()
    const diff = end - Date.now()
    printBlank()
    if (diff <= 0) {
      printLine('  BTS terminé ! 🎓', 'term-line-accent')
      printBlank()
      return
    }
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    buildAsciiBox(['Fin du BTS SIO SISR — 31 mai 2027', '', `${days} jours, ${hours} heures, ${minutes} minutes, ${seconds} secondes`]).forEach(
      (l) => printLine(`  ${l}`),
    )
    printBlank()
  }

  function cmdHistory() {
    if (history.length === 0) {
      printLine('  Aucune commande dans l’historique.', 'term-line-accent')
      return
    }
    printBlank()
    history
      .slice()
      .reverse()
      .forEach((cmd, i) => printLine(`  ${String(i + 1).padStart(3)}  ${cmd}`))
    printBlank()
  }

  function cmdRefresh() {
    printLine('  Rechargement…', 'term-line-accent')
    schedule(() => location.reload(), 600)
  }

  function cmdTheme() {
    toggleTheme()
    printLine(`  Thème : ${!light ? 'clair ☀️' : 'sombre 🌙'}`, 'term-line-accent')
  }

  function cmdLang(arg: string) {
    const current = localStorage.getItem('preferred_lang') || 'fr'
    if (!arg) {
      printBlank()
      printLine('  Usage : lang <fr|en>', 'term-line-accent')
      printLine(`  Langue actuelle : ${current}`)
      printBlank()
      return
    }
    if (arg !== 'fr' && arg !== 'en') {
      printLine('  Langue inconnue. Utilisez "lang fr" ou "lang en".', 'term-line-error')
      return
    }
    setLang(arg)
    printLine(`  ✓ Langue définie sur : ${arg}`, 'term-line-accent')
  }

  function cmdMatrix() {
    const rowCount = 12
    printBlank()

    function nextRow(row: number) {
      if (row >= rowCount) {
        schedule(() => printLine('  Simulation terminée.', 'term-line-accent'), 80)
        return
      }
      let line = '  '
      for (let i = 0; i < 28; i++) {
        line += `${MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]} `
      }
      printLine(line, 'term-line-matrix')
      schedule(() => nextRow(row + 1), 80)
    }

    nextRow(0)
  }

  function cmdCv() {
    printLine('  📄 Téléchargement du CV en cours…', 'term-line-accent')
    downloadFile('docs/CV/CV.pdf')
  }

  function clearOutput() {
    setOutput([])
    lineIdRef.current = 0
    printWelcome()
  }

  // ── Dispatcher ───────────────────────────────────────────────────────
  function dispatch(raw: string) {
    const parts = raw.trim().split(/\s+/)
    const cmd = parts[0]?.toLowerCase() ?? ''
    const cmdArg = parts.slice(1).join(' ').toLowerCase()
    printLine(`leo@portfolio:~$ ${raw}`, 'term-line-prompt')

    switch (cmd) {
      case 'help':
        cmdHelp()
        break
      case 'whoami':
        cmdWhoami()
        break
      case 'skills':
        cmdSkills()
        break
      case 'contact':
        cmdContact()
        break
      case 'fortune':
        cmdFortune()
        break
      case 'blague':
        cmdBlague()
        break
      case 'ping':
        void cmdPing()
        break
      case 'countdown':
        cmdCountdown()
        break
      case 'history':
        cmdHistory()
        break
      case 'refresh':
        cmdRefresh()
        break
      case 'theme':
        cmdTheme()
        break
      case 'secret':
        cmdSecret()
        break
      case 'hack':
        cmdHack()
        break
      case 'weather':
        void cmdWeather()
        break
      case 'timezone':
        cmdTimezone(cmdArg)
        break
      case 'cv':
        cmdCv()
        break
      case 'matrix':
        cmdMatrix()
        break
      case 'lang':
        cmdLang(cmdArg)
        break
      case 'clear':
        clearOutput()
        break
      case 'exit':
        onClose()
        break
      default:
        if (cmd !== '') {
          printLine(`  Commande introuvable: "${cmd}". Tapez "help".`, 'term-line-error')
        }
    }
  }

  function runCommand(raw: string) {
    setInputValue('')
    setHistIdx(-1)
    if (raw.trim()) setHistory((prev) => [raw, ...prev])
    dispatch(raw)
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      runCommand(inputValue)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (histIdx < history.length - 1) {
        const next = histIdx + 1
        setHistIdx(next)
        setInputValue(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx > 0) {
        const next = histIdx - 1
        setHistIdx(next)
        setInputValue(history[next])
      } else {
        setHistIdx(-1)
        setInputValue('')
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  // Portal to <body>: matches vanilla's body.appendChild(modal). Rendering
  // this inline inside <nav> would resolve `position: fixed` against navbar's
  // own box (backdrop-filter creates a new containing block) instead of the
  // viewport, squashing the modal and clipping its close button.
  return createPortal(
    <div id="terminal-modal" className="term-open" role="dialog" aria-modal="true" aria-label="Terminal interactif">
      <div className="term-window">
        <div className="term-titlebar">
          <span className="term-dot term-dot-red" />
          <span className="term-dot term-dot-yellow" />
          <span className="term-dot term-dot-green" />
          <span className="term-title">terminal — leo@portfolio</span>
          <button type="button" className="term-close-btn" aria-label="Fermer le terminal" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="term-body">
          <div className="term-main">
            <div className="term-output" ref={outputRef} aria-live="polite">
              {output.map((line) => (
                <div key={line.id}>{line.node}</div>
              ))}
            </div>

            <div className="term-pills">
              {Object.keys(COMMANDS).map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  className="term-pill"
                  onClick={() => {
                    setInputValue(cmd)
                    inputRef.current?.focus()
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>

            <div className="term-input-row">
              <span className="term-prompt-label">leo@portfolio:~$</span>
              <div className="term-input-wrapper">
                <input
                  className="term-input"
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Commande terminal"
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onFocus={() => {
                    schedule(() => inputRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 300)
                  }}
                />
                <button
                  type="button"
                  className="term-send-btn"
                  aria-label="Envoyer la commande"
                  onClick={() => {
                    runCommand(inputValue)
                    inputRef.current?.focus()
                  }}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>

          <div className="term-cheatsheet">
            <div className="term-cheatsheet-title">Commandes</div>
            {Object.entries(COMMANDS).map(([cmd, desc]) => (
              <div className="term-cmd-hint" key={cmd}>
                <strong>{cmd}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
