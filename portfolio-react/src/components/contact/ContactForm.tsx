import { useState, type FormEvent } from 'react'
import { useToast } from '../../context/ToastContext'
import { useTermsModal } from '../../context/TermsModalContext'

const RECAPTCHA_SITE_KEY = '6LfxjqQsAAAAAMTqDhbyU-GW7J3-cb6jE-k8wRjY'
const MESSAGE_MAX = 2000
const CONTACT_EMAIL = 'leo.leseigneur@orange.fr'

interface FormValues {
  name: string
  email: string
  subject: string
  message: string
}

type FieldErrors = Partial<Record<keyof FormValues, string>>

const EMPTY_VALUES: FormValues = { name: '', email: '', subject: '', message: '' }

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (values.name.trim().length < 2) errors.name = 'Minimum 2 caractères.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Adresse email invalide.'
  if (values.subject.trim().length < 3) errors.subject = 'Minimum 3 caractères.'
  if (values.message.trim().length < 10) errors.message = 'Minimum 10 caractères.'
  else if (values.message.length > MESSAGE_MAX) errors.message = 'Maximum 2000 caractères.'
  return errors
}

export function ContactForm() {
  const { showToast } = useToast()
  const { requestSubmit } = useTermsModal()
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [shaking, setShaking] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function doSubmit() {
    const subject = encodeURIComponent(values.subject)
    const body = encodeURIComponent(`De : ${values.name} (${values.email})\n\n${values.message}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`

    setSubmitted(true)

    setTimeout(() => {
      setValues(EMPTY_VALUES)
      setErrors({})
      setSubmitted(false)
      window.grecaptcha?.reset()
    }, 5000)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const captchaResponse = window.grecaptcha?.getResponse() ?? ''
    if (!captchaResponse) {
      showToast('Veuillez valider le CAPTCHA.', 'warning')
      return
    }

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setShaking(new Set(Object.keys(nextErrors)))
      setTimeout(() => setShaking(new Set()), 600)
      return
    }

    requestSubmit(doSubmit)
  }

  if (submitted) {
    return (
      <form className="reveal visible" noValidate>
        <div id="form-feedback" className="form-feedback-success form-feedback-prominent" role="alert" aria-live="polite">
          ✅ Message envoyé ! Je vous répondrai dans les plus brefs délais.
        </div>
      </form>
    )
  }

  const messageLength = values.message.length

  return (
    <form id="contact-form" className="reveal visible" noValidate onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Votre nom"
          required
          value={values.name}
          onChange={(e) => updateField('name', e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          className={[shaking.has('name') && 'field-shake', errors.name && 'field-invalid']
            .filter(Boolean)
            .join(' ')}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="votre@email.com"
          required
          value={values.email}
          onChange={(e) => updateField('email', e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          className={[shaking.has('email') && 'field-shake', errors.email && 'field-invalid']
            .filter(Boolean)
            .join(' ')}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="subject">Sujet</label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="Objet de votre message"
          required
          value={values.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          aria-invalid={errors.subject ? true : undefined}
          className={[shaking.has('subject') && 'field-shake', errors.subject && 'field-invalid']
            .filter(Boolean)
            .join(' ')}
        />
        {errors.subject && <span className="field-error">{errors.subject}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Votre message..."
          maxLength={MESSAGE_MAX}
          required
          value={values.message}
          onChange={(e) => updateField('message', e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          className={[shaking.has('message') && 'field-shake', errors.message && 'field-invalid']
            .filter(Boolean)
            .join(' ')}
        />
        {errors.message && <span className="field-error">{errors.message}</span>}
        <div className={`char-counter${messageLength > 1800 ? ' char-counter-danger' : ''}`}>
          {messageLength} / {MESSAGE_MAX} caractères
        </div>
      </div>

      <div className="captcha-wrapper">
        <div className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY} data-theme="dark" />
      </div>

      <button type="submit" className="btn btn-primary btn-full">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        Envoyer le message
      </button>
    </form>
  )
}
