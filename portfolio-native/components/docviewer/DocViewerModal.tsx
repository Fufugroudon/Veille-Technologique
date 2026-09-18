interface Props {
  fileUrl: string | null;
  onClose: () => void;
}

// PLATFORM DECISION: native fallback. DocViewerProvider never sets a viewer
// URL on native — it calls Linking.openURL(pdfUrl) directly instead (opens
// the PDF in the OS's own viewer). This file exists only so the import in
// DocViewerProvider resolves on native; it should never actually render.
export function DocViewerModal(_props: Props) {
  return null;
}
