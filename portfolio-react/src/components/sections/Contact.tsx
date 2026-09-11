import { useReveal } from '../../hooks/useReveal'
import { ContactForm } from '../contact/ContactForm'
import { CopyEmailButton } from '../contact/CopyEmailButton'

const CONTACT_EMAIL = 'leo.leseigneur@orange.fr'

export function Contact() {
  const header = useReveal<HTMLDivElement>()
  const info = useReveal<HTMLDivElement>()

  return (
    <section id="contact">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">06</span>
          <h2>Contact</h2>
          <p className="section-subtitle">Restons en contact</p>
        </div>

        <div className="contact-content">
          <div className={`contact-info ${info.className}`} ref={info.ref}>
            <h3>Mes coordonnées</h3>

            <div className="contact-item">
              <span className="contact-item-icon" aria-hidden="true">
                📧
              </span>
              <div>
                <strong>Email</strong>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <CopyEmailButton email={CONTACT_EMAIL} />
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-item-icon" aria-hidden="true">
                💼
              </span>
              <div>
                <strong>GitHub</strong>
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
                <strong>Localisation</strong>
                <span>Beauvais, Hauts-de-France</span>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-item-icon" aria-hidden="true">
                🎓
              </span>
              <div>
                <strong>Statut</strong>
                <span>
                  Étudiant en alternance BTS SIO SISR chez{' '}
                  <a href="http://www.itec-engineering.com/" target="_blank" rel="noopener noreferrer">
                    ITEC Engineering
                  </a>{' '}
                  à Esches
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
