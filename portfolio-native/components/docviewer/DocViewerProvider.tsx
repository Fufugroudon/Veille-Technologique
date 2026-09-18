import { createContext, useContext, useState, type ReactNode } from 'react';
import { Linking, Platform } from 'react-native';
import { useToast } from '../../context/ToastContext';
import { resolveDocUrl, probeFile, type ProbedFile } from './docUtils';
import { downloadFile } from './downloadFile';
import { DocViewerModal } from './DocViewerModal';
import { DocPickerModal } from './DocPickerModal';

interface DocViewerContextValue {
  openEye: (base: string) => void;
  openDownload: (base: string) => void;
}

const DocViewerContext = createContext<DocViewerContextValue | null>(null);

export function DocViewerProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [pickerBase, setPickerBase] = useState<string | null>(null);
  const [pickerFiles, setPickerFiles] = useState<ProbedFile[]>([]);

  async function openEye(base: string) {
    const pdfUrl = resolveDocUrl(`${base}.pdf`);
    const docxUrl = resolveDocUrl(`${base}.docx`);

    try {
      const pdfRes = await fetch(pdfUrl, { method: 'HEAD' });
      if (pdfRes.ok) {
        // PLATFORM DECISION: web opens the in-app PDF.js iframe viewer
        // (unchanged); native opens the PDF in the OS's own viewer via
        // Linking, since there's no iframe/PDF.js equivalent in RN core.
        if (Platform.OS === 'web') {
          setViewerUrl(pdfUrl);
        } else {
          Linking.openURL(pdfUrl);
        }
        return;
      }
      const docxRes = await fetch(docxUrl, { method: 'HEAD' });
      if (docxRes.ok) {
        showToast('Visualisation disponible uniquement en PDF. Utilisez le bouton de téléchargement.', 'warning');
      } else {
        showToast('Document indisponible. Veuillez me contacter.', 'error', 'contact');
      }
    } catch {
      showToast('Document indisponible. Veuillez me contacter.', 'error', 'contact');
    }
  }

  async function openDownload(base: string) {
    const pdfUrl = resolveDocUrl(`${base}.pdf`);
    const docxUrl = resolveDocUrl(`${base}.docx`);

    const results = await Promise.all([probeFile(pdfUrl, 'pdf'), probeFile(docxUrl, 'docx')]);
    const files = results.filter((f): f is ProbedFile => f !== null);

    if (files.length === 0) {
      showToast('Document indisponible. Veuillez me contacter.', 'error', 'contact');
    } else if (files.length === 1) {
      downloadFile(files[0].url);
    } else {
      setPickerFiles(files);
      setPickerBase(base);
    }
  }

  return (
    <DocViewerContext.Provider value={{ openEye, openDownload }}>
      {children}
      <DocViewerModal fileUrl={viewerUrl} onClose={() => setViewerUrl(null)} />
      <DocPickerModal base={pickerBase} files={pickerFiles} onClose={() => setPickerBase(null)} />
    </DocViewerContext.Provider>
  );
}

export function useDocViewer(): DocViewerContextValue {
  const ctx = useContext(DocViewerContext);
  if (!ctx) {
    throw new Error('useDocViewer must be used within a DocViewerProvider');
  }
  return ctx;
}
