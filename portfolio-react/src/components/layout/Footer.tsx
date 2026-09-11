import { useI18n } from '../../i18n/I18nContext'
import { LiveClock } from './LiveClock'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer>
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-badge" aria-hidden="true">
            LL
          </span>
          <span>Leseigneur Léo</span>
        </div>
        <p className="footer-copy">{t.footerCopy}</p>
        <p className="footer-sub">Étudiant BTS SIO SISR</p>
        <a
          href="https://github.com/Fufugroudon"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github-badge"
        >
          <span aria-hidden="true">💼</span>
          github.com/Fufugroudon
        </a>
        <LiveClock />
      </div>
    </footer>
  )
}
