import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { useI18n } from '../../i18n/I18nContext'
import { useTimezone } from '../../context/TimezoneContext'
import { downloadFile } from '../docviewer/downloadFile'
import { COMMANDS, TIMEZONE_MAP, FORTUNES, BLAGUES } from './terminalData'

interface Props {
  visible: boolean
  onClose: () => void
}

interface OutputLine {
  id: number
  node: ReactNode
}

const MATRIX_CHARS = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', '0', '1']
const CHEATSHEET_MIN_WIDTH = 768

function buildAsciiBox(lines: string[]): string[] {
  const maxLen = lines.reduce((m, l) => Math.max(m, l.length), 0)
  const bar = '─'.repeat(maxLen + 2)
  const rows = lines.map((l) => `│ ${l}${' '.repeat(maxLen - l.length)} │`)
  return [`┌${bar}┐`, ...rows, `└${bar}┘`]
}

/**
 * Ports portfolio-react's TerminalModal (itself a port of Portfolio/script.js's
 * initTerminal()) — all 19 commands. RN's Modal is a better fit than the
 * web version's portal-to-body hack (see the terminal-positioning bug fix
 * from the web port) — no workaround needed here.
 *
 * Scope notes:
 * - `refresh`: no page to reload on native — prints a
 *   "not available on this platform" message instead (confirmed decision).
 * - `weather`: web uses navigator.geolocation like portfolio-react; native
 *   has no geolocation wired up yet (would need expo-location's permission
 *   flow, out of scope for now) — falls back straight to Méru, FR, same as
 *   vanilla's own denial fallback.
 * - `secret`/Matrix rain: full canvas animation on web, message+beep only
 *   on native (confirmed decision) — see MatrixRain.tsx/.web.tsx.
 * - Arrow-key (↑/↓) history recall has no reliable native-touch equivalent
 *   (no physical keyboard) — the `history` command and tap-to-fill pills
 *   cover the same need on native.
 */
export function TerminalModal({ visible, onClose }: Props) {
  const { colors, light, toggle: toggleTheme } = useTheme()
  const { lang, setLang } = useI18n()
  const { timezone, setTimezone } = useTimezone()
  const { width } = useWindowDimensions()
  const showCheatsheet = width >= CHEATSHEET_MIN_WIDTH

  const [output, setOutput] = useState<OutputLine[]>([])
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const scrollRef = useRef<ScrollView>(null)
  const lineIdRef = useRef(0)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  function print(node: ReactNode) {
    const id = lineIdRef.current++
    setOutput((prev) => [...prev, { id, node }])
  }

  function printLine(text: string, color?: string) {
    print(
      <Text style={[styles.line, { color: color ?? colors.textMuted }]} selectable>
        {text}
      </Text>,
    )
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
    if (!visible) return
    scrollRef.current?.scrollToEnd({ animated: true })
  }, [output, visible])

  useEffect(() => {
    if (!visible) return
    if (output.length === 0) printWelcome()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [])

  function printWelcome() {
    printLine('  _____                   _             _ ', colors.accentLight)
    printLine(" |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |", colors.accentLight)
    printLine("   | |/ _ \\ '__| '_ ` _ \\| | '_ \\ / _` | |", colors.accentLight)
    printLine('   | |  __/ |  | | | | | | | | | | (_| | |', colors.accentLight)
    printLine("   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|", colors.accentLight)
    printLine('  Bienvenue ! Tapez "help" pour voir les commandes.', colors.textFaint)
    printBlank()
    printBlank()
  }

  // ── Command handlers ──────────────────────────────────────────────────
  function cmdHelp() {
    printBlank()
    printLine('Commandes disponibles :', colors.accentLight)
    Object.entries(COMMANDS).forEach(([cmd, desc]) => {
      print(
        <View style={styles.helpRow} key={cmd}>
          <Text style={[styles.helpCmd, { color: colors.accentLight }]}>{cmd}</Text>
          <Text style={[styles.line, { color: colors.textMuted }]}>{desc}</Text>
        </View>,
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
    printLine('  Compétences :', colors.accentLight)
    buildAsciiBox(lines).forEach((l) => printLine(`  ${l}`))
    printBlank()
  }

  function cmdContact() {
    printBlank()
    printLine('  ✉  Email  : leo.leseigneur@orange.fr', colors.accentLight)
    print(
      <Text style={styles.line} key="gh">
        {'  🔗 GitHub : '}
        <Text style={{ color: colors.accentLight, fontWeight: '700' }} onPress={() => Linking.openURL('https://github.com/Fufugroudon')}>
          github.com/Fufugroudon
        </Text>
      </Text>,
    )
    print(
      <Text style={styles.line} key="site">
        {'  🌐 Site   : '}
        <Text style={{ color: colors.accentLight, fontWeight: '700' }} onPress={() => Linking.openURL('https://lesnorrys.fr')}>
          lesnorrys.fr
        </Text>
      </Text>,
    )
    printBlank()
  }

  function cmdSecret() {
    printBlank()
    buildAsciiBox(['     SÉQUENCE SECRÈTE     ']).forEach((l) => printLine(`  ${l}`))
    printBlank()
    printLine('  ► Étape 1 — Konami Code (web/desktop)', colors.accentLight)
    print(<Text style={styles.line} key="k1">    Appuyez sur : ↑ ↑ ↓ ↓ ← → ← → B A</Text>)
    printBlank()
    printLine('  ► Étape 2 — Triple Tap (mobile)', colors.accentLight)
    printLine('    Appuyez 3 fois sur le logo du site')
    printBlank()
    printLine('  ► Résultat', colors.accentLight)
    printLine("    Un écran Matrix envahit l'écran pendant 4 secondes.")
    printLine('    Message : "ACCÈS AUTORISÉ"')
    printBlank()
  }

  function cmdHack() {
    printLine('  Initialisation de la connexion...', colors.textFaint)
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
        printLine(`  > ${msgs[5]}`, colors.error)
      } else {
        printBlank()
        printLine('  ⛔ ACCÈS REFUSÉ. Cible trop forte.', colors.error)
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
      const tz = timezone || 'Europe/Paris'
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
        printLine('  ⚠️ Impossible de récupérer la météo.', colors.error)
      }
    }

    function fallback() {
      return fetchAndDisplay(49.2333, 2.1333, 'Méru, FR (position par défaut)')
    }

    if (Platform.OS !== 'web' || typeof navigator === 'undefined' || !navigator.geolocation) {
      printLine('  Géolocalisation non disponible. Utilisation de Méru...', colors.textFaint)
      await fallback()
      return
    }

    printLine('  Récupération de la position...', colors.textFaint)

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
        printLine('  Accès refusé. Utilisation de Méru...', colors.textFaint)
        await fallback()
      },
      { timeout: 8000 },
    )
  }

  function cmdTimezone(arg: string) {
    if (!arg) {
      const current = timezone || 'Europe/Paris (défaut)'
      printBlank()
      printLine('  Usage: timezone <zone>', colors.accentLight)
      printBlank()
      printLine(`  Zone active : ${current}`)
      printBlank()
      printLine('  Zones disponibles :')
      Object.keys(TIMEZONE_MAP).forEach((k) => {
        const displayKey = k === 'utc' ? 'UTC' : k.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
        printLine(`    ${displayKey.padEnd(12)}→ ${TIMEZONE_MAP[k]}`)
      })
      printBlank()
      return
    }

    const iana = TIMEZONE_MAP[arg]
    if (!iana) {
      printLine(`  Zone inconnue : "${arg}". Tapez "timezone" pour la liste.`, colors.error)
      return
    }

    setTimezone(iana)
    printLine(`  ✓ Fuseau horaire défini sur ${iana}`, colors.accentLight)
  }

  function cmdFortune() {
    const q = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
    printBlank()
    printLine(`  "${q.text}"`)
    printLine(`  ${q.src}`, colors.accentLight)
    printBlank()
  }

  function cmdBlague() {
    const joke = BLAGUES[Math.floor(Math.random() * BLAGUES.length)]
    printBlank()
    printLine(`  ${joke}`, colors.accentLight)
    printBlank()
  }

  async function cmdPing() {
    printLine('  PING lesnorrys.fr…', colors.accentLight)
    const t0 = Date.now()
    const controller = new AbortController()
    const timer = schedule(() => controller.abort(), 5000)
    try {
      await fetch('https://lesnorrys.fr', { signal: controller.signal })
      clearTimeout(timer)
      timersRef.current.delete(timer)
      const ms = Date.now() - t0
      printLine(`  PING lesnorrys.fr — réponse en ${ms}ms [OK]`, colors.accentLight)
    } catch {
      clearTimeout(timer)
      timersRef.current.delete(timer)
      printLine('  PING lesnorrys.fr — [TIMEOUT]', colors.error)
    }
  }

  function cmdCountdown() {
    const end = new Date('2027-05-31T00:00:00').getTime()
    const diff = end - Date.now()
    printBlank()
    if (diff <= 0) {
      printLine('  BTS terminé ! 🎓', colors.accentLight)
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
      printLine('  Aucune commande dans l’historique.', colors.accentLight)
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
    // PLATFORM DECISION: no page to reload on native (confirmed decision).
    if (Platform.OS === 'web') {
      printLine('  Rechargement…', colors.accentLight)
      schedule(() => window.location.reload(), 600)
    } else {
      printLine('  Non disponible sur cette plateforme.', colors.textFaint)
    }
  }

  function cmdTheme() {
    toggleTheme()
    printLine(`  Thème : ${!light ? 'clair ☀️' : 'sombre 🌙'}`, colors.accentLight)
  }

  function cmdLang(arg: string) {
    if (!arg) {
      printBlank()
      printLine('  Usage : lang <fr|en>', colors.accentLight)
      printLine(`  Langue actuelle : ${lang}`)
      printBlank()
      return
    }
    if (arg !== 'fr' && arg !== 'en') {
      printLine('  Langue inconnue. Utilisez "lang fr" ou "lang en".', colors.error)
      return
    }
    setLang(arg)
    printLine(`  ✓ Langue définie sur : ${arg}`, colors.accentLight)
  }

  function cmdMatrix() {
    const rowCount = 12
    printBlank()

    function nextRow(row: number) {
      if (row >= rowCount) {
        schedule(() => printLine('  Simulation terminée.', colors.accentLight), 80)
        return
      }
      let line = '  '
      for (let i = 0; i < 28; i++) {
        line += `${MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]} `
      }
      printLine(line, '#22c55e')
      schedule(() => nextRow(row + 1), 80)
    }

    nextRow(0)
  }

  function cmdCv() {
    printLine('  📄 Téléchargement du CV en cours…', colors.accentLight)
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
    printLine(`leo@portfolio:~$ ${raw}`, colors.text)

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
          printLine(`  Commande introuvable: "${cmd}". Tapez "help".`, colors.error)
        }
    }
  }

  function runCommand(raw: string) {
    setInputValue('')
    if (raw.trim()) setHistory((prev) => [raw, ...prev])
    dispatch(raw)
  }

  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.window, { backgroundColor: colors.dark, borderColor: colors.border }]}>
          <View style={[styles.titlebar, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
            <View style={[styles.dot, { backgroundColor: '#ff5f57' }]} />
            <View style={[styles.dot, { backgroundColor: '#ffbd2e' }]} />
            <View style={[styles.dot, { backgroundColor: '#28c840' }]} />
            <Text style={[styles.titleText, { color: colors.textMuted }]}>terminal — leo@portfolio</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fermer le terminal">
              <Text style={[styles.closeBtn, { color: colors.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            <View style={styles.main}>
              <ScrollView ref={scrollRef} style={styles.output} contentContainerStyle={styles.outputContent}>
                {output.map((line) => (
                  <View key={line.id}>{line.node}</View>
                ))}
              </ScrollView>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
                {Object.keys(COMMANDS).map((cmd) => (
                  <Pressable
                    key={cmd}
                    onPress={() => setInputValue(cmd)}
                    style={[styles.pill, { borderColor: colors.border, backgroundColor: colors.bgCard }]}
                  >
                    <Text style={[styles.pillText, { color: colors.textMuted }]}>{cmd}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.inputRow}>
                <Text style={[styles.promptLabel, { color: colors.accentLight }]}>leo@portfolio:~$</Text>
                <TextInput
                  value={inputValue}
                  onChangeText={setInputValue}
                  onSubmitEditing={() => runCommand(inputValue)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="send"
                  placeholder="commande..."
                  placeholderTextColor={colors.textFaint}
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                />
                <Pressable
                  onPress={() => runCommand(inputValue)}
                  style={[styles.sendBtn, { backgroundColor: colors.accent }]}
                >
                  <Text style={styles.sendBtnText}>Envoyer</Text>
                </Pressable>
              </View>
            </View>

            {showCheatsheet && (
              <ScrollView style={[styles.cheatsheet, { borderLeftColor: colors.border }]}>
                <Text style={[styles.cheatsheetTitle, { color: colors.text }]}>Commandes</Text>
                {Object.entries(COMMANDS).map(([cmd, desc]) => (
                  <View key={cmd} style={styles.cheatHint}>
                    <Text style={[styles.cheatCmd, { color: colors.accentLight }]}>{cmd}</Text>
                    <Text style={[styles.cheatDesc, { color: colors.textFaint }]}>{desc}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  window: {
    width: '100%',
    maxWidth: 900,
    height: '85%',
    maxHeight: 620,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  titlebar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  titleText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 16,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  output: {
    flex: 1,
  },
  outputContent: {
    paddingBottom: 8,
  },
  line: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  helpRow: {
    flexDirection: 'row',
    gap: 10,
  },
  helpCmd: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    width: 90,
  },
  pillRow: {
    maxHeight: 36,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 6,
  },
  pillText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promptLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  sendBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cheatsheet: {
    width: 240,
    borderLeftWidth: 1,
    padding: 14,
  },
  cheatsheetTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  cheatHint: {
    marginBottom: 10,
  },
  cheatCmd: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
  },
  cheatDesc: {
    fontSize: 11,
    marginTop: 2,
  },
})
