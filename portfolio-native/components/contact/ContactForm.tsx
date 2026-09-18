import { useState } from 'react'
import { Animated, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { useTermsModal } from '../../context/TermsModalContext'
import type { ColorTokens } from '../../theme'

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

interface FieldProps {
  field: keyof FormValues
  label: string
  placeholder: string
  keyboardType?: 'email-address' | 'default'
  multiline?: boolean
  value: string
  error?: string
  shakeAnim: Animated.Value
  colors: ColorTokens
  messageLength: number
  onChange: (value: string) => void
}

// Hoisted out of ContactForm (React Compiler / eslint's react-hooks/static-components
// rule forbids declaring components during render — they'd reset state on every render).
function Field({
  field,
  label,
  placeholder,
  keyboardType,
  multiline,
  value,
  error,
  shakeAnim,
  colors,
  messageLength,
  onChange,
}: FieldProps) {
  return (
    <Animated.View style={[styles.group, { transform: [{ translateX: Animated.multiply(shakeAnim, 6) }] }]}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        keyboardType={keyboardType}
        multiline={multiline}
        maxLength={field === 'message' ? MESSAGE_MAX : undefined}
        style={[
          styles.input,
          multiline && styles.textarea,
          { color: colors.text, backgroundColor: colors.dark, borderColor: error ? colors.error : colors.border },
        ]}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      {field === 'message' && (
        <Text style={[styles.counter, { color: messageLength > 1800 ? colors.error : colors.textFaint }]}>
          {messageLength} / {MESSAGE_MAX} caractères
        </Text>
      )}
    </Animated.View>
  )
}

/**
 * PLATFORM/SCOPE NOTE: no reCAPTCHA gate here. portfolio-react's widget is
 * a Google web script (<script src="recaptcha/api.js"> in index.html) with
 * no native equivalent, and per standing instruction it's already
 * broken/disabled there — this port leaves it inert everywhere (not
 * rendered, not validated) rather than half-wiring it up on web only.
 */
export function ContactForm() {
  const { colors } = useTheme()
  const { requestSubmit } = useTermsModal()
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [shakeAnims] = useState(() => ({
    name: new Animated.Value(0),
    email: new Animated.Value(0),
    subject: new Animated.Value(0),
    message: new Animated.Value(0),
  }))

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function shake(field: keyof FormValues) {
    const anim = shakeAnims[field]
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start()
  }

  function doSubmit() {
    const subject = encodeURIComponent(values.subject)
    const body = encodeURIComponent(`De : ${values.name} (${values.email})\n\n${values.message}`)
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`)

    setSubmitted(true)
    setTimeout(() => {
      setValues(EMPTY_VALUES)
      setErrors({})
      setSubmitted(false)
    }, 5000)
  }

  function handleSubmit() {
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      Object.keys(nextErrors).forEach((field) => shake(field as keyof FormValues))
      return
    }

    requestSubmit(doSubmit)
  }

  if (submitted) {
    return (
      <View style={[styles.feedback, { backgroundColor: colors.accentGlow, borderColor: colors.success }]}>
        <Text style={[styles.feedbackText, { color: colors.text }]}>
          ✅ Message envoyé ! Je vous répondrai dans les plus brefs délais.
        </Text>
      </View>
    )
  }

  const messageLength = values.message.length

  return (
    <View style={styles.form}>
      <Field
        field="name"
        label="Nom"
        placeholder="Votre nom"
        value={values.name}
        error={errors.name}
        shakeAnim={shakeAnims.name}
        colors={colors}
        messageLength={messageLength}
        onChange={(v) => updateField('name', v)}
      />
      <Field
        field="email"
        label="Email"
        placeholder="votre@email.com"
        keyboardType="email-address"
        value={values.email}
        error={errors.email}
        shakeAnim={shakeAnims.email}
        colors={colors}
        messageLength={messageLength}
        onChange={(v) => updateField('email', v)}
      />
      <Field
        field="subject"
        label="Sujet"
        placeholder="Objet de votre message"
        value={values.subject}
        error={errors.subject}
        shakeAnim={shakeAnims.subject}
        colors={colors}
        messageLength={messageLength}
        onChange={(v) => updateField('subject', v)}
      />
      <Field
        field="message"
        label="Message"
        placeholder="Votre message..."
        multiline
        value={values.message}
        error={errors.message}
        shakeAnim={shakeAnims.message}
        colors={colors}
        messageLength={messageLength}
        onChange={(v) => updateField('message', v)}
      />

      <Pressable onPress={handleSubmit} style={[styles.submitBtn, { backgroundColor: colors.accent }]}>
        <Text style={styles.submitText}>Envoyer le message</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  group: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 11,
    fontWeight: '600',
  },
  counter: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  feedback: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
})
