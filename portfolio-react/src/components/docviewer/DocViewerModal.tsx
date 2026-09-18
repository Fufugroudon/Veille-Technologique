import { useEffect, useRef } from 'react'

interface Props {
  fileUrl: string | null
  onClose: () => void
}

export function DocViewerModal({ fileUrl, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const isOpen = fileUrl !== null

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement
    closeBtnRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  const viewerSrc = fileUrl
    ? `${import.meta.env.BASE_URL}viewer/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}&page=1`
    : ''

  return (
    <div
      id="doc-viewer-overlay"
      className={isOpen ? 'is-open' : ''}
      role="dialog"
      aria-modal="true"
      aria-label="Visualiser le document"
    >
      <button
        type="button"
        className="doc-viewer-close"
        aria-label="Fermer le visualiseur"
        ref={closeBtnRef}
        onClick={onClose}
      >
        ×
      </button>
      <div className="doc-viewer-panel">
        {isOpen && <iframe className="doc-viewer-frame" title="Visualiser le document" src={viewerSrc} />}
      </div>
    </div>
  )
}
