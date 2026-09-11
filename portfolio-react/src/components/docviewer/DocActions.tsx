import { useDocViewer } from './DocViewerProvider'

interface Props {
  /** Path without extension — probed as `${base}.pdf` and `${base}.docx`. */
  base: string
}

// o2switch requires .htaccess MIME type declarations for the PDF.js
// viewer's .js/.wasm assets — both public/viewer/pdfjs/.htaccess and
// public/.htaccess (site root) carry these.
export function DocActions({ base }: Props) {
  const { openEye, openDownload } = useDocViewer()

  return (
    <div className="doc-btn-group">
      <button
        type="button"
        className="btn btn-outline doc-download-btn"
        aria-label="Télécharger le document"
        onClick={() => openDownload(base)}
      >
        <svg
          width="16"
          height="16"
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
        <span>Télécharger</span>
      </button>
      <button
        type="button"
        className="btn btn-outline doc-eye-btn"
        aria-label="Visualiser le document"
        onClick={() => openEye(base)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>Visualiser</span>
      </button>
    </div>
  )
}
