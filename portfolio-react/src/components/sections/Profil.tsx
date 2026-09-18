import { useReveal } from '../../hooks/useReveal'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useI18n } from '../../i18n/I18nContext'
import { DocActions } from '../docviewer/DocActions'

export function Profil() {
  const { t } = useI18n()
  const header = useReveal<HTMLDivElement>()
  const titleRef = useScrambleText<HTMLHeadingElement>()
  const text = useReveal<HTMLDivElement>()
  const image = useReveal<HTMLDivElement>()

  return (
    <section id="profil">
      <div className="container">
        <div className={header.className} ref={header.ref}>
          <span className="section-number">01</span>
          <h2 ref={titleRef}>{t.nav[1]}</h2>
          <p className="section-subtitle">{t.profil.sectionSubtitle}</p>
        </div>

        <div className="profile-content">
          <div className={`profile-text ${text.className}`} ref={text.ref}>
            <h3>{t.profil.heading}</h3>
            {t.profil.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="profile-tags">
              {t.profil.tags.map((tag) => (
                <span className="profile-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={`profile-image ${image.className}`} ref={image.ref}>
            <div className="avatar-wrapper">
              <div className="avatar-ring" aria-hidden="true" />
              <div className="avatar-large">LL</div>
            </div>

            <div className="profile-docs">
              <div className="profile-doc-group">
                <span className="profile-doc-label">{t.profil.docCvLabel}</span>
                <DocActions base="docs/CV/CV" />
              </div>
              <div className="profile-doc-group">
                <span className="profile-doc-label">{t.profil.docTableauLabel}</span>
                <DocActions base="docs/CV/TABLEAU_DE_SYNTHESE" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
