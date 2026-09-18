import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useI18n } from '../../i18n/I18nContext'
import { ContactForm } from '../contact/ContactForm'
import { CopyEmailButton } from '../contact/CopyEmailButton'

const CONTACT_EMAIL = 'leo.leseigneur@orange.fr'

export function Contact() {
  const { t } = useI18n()
  const header = useReveal<HTMLDivElement>()
  const info = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()

  return (
    <section id="contact">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">07</span>
          <h2 ref={titleRef}>{t.nav[7]}</h2>
          <p className="section-subtitle">{t.contact.sectionSubtitle}</p>
        </div>

        <div className="contact-content">
          <div className={`contact-info ${info.className}`} ref={info.ref}>
            <h3>{t.contact.heading}</h3>

            <div className="contact-item">
              <span className="contact-item-icon" aria-hidden="true">
                📧
              </span>
              <div>
                <strong>{t.contact.emailLabel}</strong>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <CopyEmailButton email={CONTACT_EMAIL} />
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-item-icon" aria-hidden="true">
                💼
              </span>
              <div>
                <strong>{t.contact.githubLabel}</strong>
                <a href="https://github.com/Fufugroudon" target="_blank" rel="noopener noreferrer">
                  github.com/Fufugroudon
                </a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-item-icon" aria-hidden="true">
                📍
              </span>
              <div>
                <strong>{t.contact.locationLabel}</strong>
                <span>{t.contact.location}</span>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-item-icon" aria-hidden="true">
                🎓
              </span>
              <div>
                <strong>{t.contact.statusLabel}</strong>
                <span>
                  {t.contact.statusPrefix}{' '}
                  <a href="http://www.itec-engineering.com/" target="_blank" rel="noopener noreferrer">
                    ITEC Engineering
                  </a>{' '}
                  {t.contact.statusSuffix}
                </span>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}
