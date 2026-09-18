import { useEffect, useState } from 'react'
import JSZip from 'jszip'
import { formatSize, downloadFile, type ProbedFile } from './docUtils'

interface Props {
  base: string | null
  files: ProbedFile[]
  onClose: () => void
}

export function DocPickerModal({ base, files, onClose }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isOpen = base !== null

  useEffect(() => {
    setDetailsOpen(false)
  }, [base])

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const pdfFile = files.find((f) => f.ext === 'pdf')
  const docxFile = files.find((f) => f.ext === 'docx')

  async function downloadZip() {
    if (!base || files.length === 0) return
    const docName = base.split('/').pop()
    const zip = new JSZip()
    await Promise.all(
      files.map(async (f) => {
        const blob = await fetch(f.url).then((r) => r.blob())
        zip.file(f.name, blob)
      }),
    )
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = `${docName} - Folder.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    onClose()
  }

  return (
    <div
      id="doc-picker-overlay"
      className={isOpen ? 'is-open' : ''}
      role="dialog"
      aria-modal="true"
      aria-label="Sélectionner le format"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="doc-picker-card">
        <div className="doc-picker-header">
          <p className="doc-picker-title">Sélectionner le format du document à télécharger :</p>
          <button type="button" className="doc-picker-close" aria-label="Fermer" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="doc-picker-actions">
          {pdfFile && (
            <button
              type="button"
              className="btn btn-outline doc-picker-pdf"
              title="Télécharger ce document en format PDF (.pdf)."
              onClick={() => {
                downloadFile(pdfFile.url)
                onClose()
              }}
            >
              PDF
            </button>
          )}
          {docxFile && (
            <button
              type="button"
              className="btn btn-outline doc-picker-docx"
              title="Télécharger ce document en format WORD (.docx)."
              onClick={() => {
                downloadFile(docxFile.url)
                onClose()
              }}
            >
              DOCX
            </button>
          )}
        </div>

        <details
          className="doc-picker-details"
          open={detailsOpen}
          onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
        >
          <summary className="doc-picker-summary">Détails des fichiers</summary>
          <div className="doc-picker-table-wrap">
            <table className="doc-picker-table">
              <thead>
                <tr>
                  <th>Nom du fichier</th>
                  <th>Format</th>
                  <th>Type</th>
                  <th>Taille</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.url}>
                    <td>{f.name}</td>
                    <td>{f.ext.toUpperCase()}</td>
                    <td>{f.ext === 'pdf' ? 'PDF' : f.ext === 'docx' ? 'DOCX' : f.mime || '—'}</td>
                    <td>{formatSize(f.sizeBytes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-outline doc-picker-zip" onClick={downloadZip}>
            <span>Tout télécharger</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </details>
      </div>
    </div>
  )
}
