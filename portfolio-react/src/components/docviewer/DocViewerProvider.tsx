import { createContext, useContext, useState, type ReactNode } from 'react'
import { useToast } from '../../context/ToastContext'
import { clearPdfjsCache, downloadFile, probeFile, type ProbedFile } from './docUtils'
import { DocViewerModal } from './DocViewerModal'
import { DocPickerModal } from './DocPickerModal'

interface DocViewerContextValue {
  openEye: (base: string) => void
  openDownload: (base: string) => void
}

const DocViewerContext = createContext<DocViewerContextValue | null>(null)

export function DocViewerProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast()
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [pickerBase, setPickerBase] = useState<string | null>(null)
  const [pickerFiles, setPickerFiles] = useState<ProbedFile[]>([])

  function openViewer(fileUrl: string) {
    clearPdfjsCache()
    setViewerUrl(fileUrl)
  }

  async function openEye(base: string) {
    const pdfUrl = new URL(`${base}.pdf`, window.location.origin).href
    const docxUrl = new URL(`${base}.docx`, window.location.origin).href

    try {
      const pdfRes = await fetch(pdfUrl, { method: 'HEAD' })
      if (pdfRes.ok) {
        openViewer(pdfUrl)
        return
      }
      const docxRes = await fetch(docxUrl, { method: 'HEAD' })
      if (docxRes.ok) {
        showToast(
          'Visualisation disponible uniquement en PDF. Utilisez le bouton de téléchargement.',
          'warning',
        )
      } else {
        showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact')
      }
    } catch {
      showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact')
    }
  }

  async function openDownload(base: string) {
    const pdfUrl = new URL(`${base}.pdf`, window.location.origin).href
    const docxUrl = new URL(`${base}.docx`, window.location.origin).href

    const results = await Promise.all([probeFile(pdfUrl, 'pdf'), probeFile(docxUrl, 'docx')])
    const files = results.filter((f): f is ProbedFile => f !== null)

    if (files.length === 0) {
      showToast('Document indisponible. Veuillez me contacter.', 'error', '#contact')
    } else if (files.length === 1) {
      downloadFile(files[0].url)
    } else {
      setPickerFiles(files)
      setPickerBase(base)
    }
  }

  return (
    <DocViewerContext.Provider value={{ openEye, openDownload }}>
      {children}
      <DocViewerModal fileUrl={viewerUrl} onClose={() => setViewerUrl(null)} />
      <DocPickerModal base={pickerBase} files={pickerFiles} onClose={() => setPickerBase(null)} />
    </DocViewerContext.Provider>
  )
}

export function useDocViewer(): DocViewerContextValue {
  const ctx = useContext(DocViewerContext)
  if (!ctx) {
    throw new Error('useDocViewer must be used within a DocViewerProvider')
  }
  return ctx
}
