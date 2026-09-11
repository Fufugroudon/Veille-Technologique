import { useState } from 'react'
import { useToast } from '../../context/ToastContext'

export function CopyEmailButton({ email }: { email: string }) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  if (!navigator.clipboard) return null

  return (
    <button
      type="button"
      className="copy-email-btn"
      aria-label="Copier l'adresse email"
      onClick={() => {
        navigator.clipboard.writeText(email).then(() => {
          setCopied(true)
          showToast('Email copié !', 'success')
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? '✅' : '📋'}
    </button>
  )
}
