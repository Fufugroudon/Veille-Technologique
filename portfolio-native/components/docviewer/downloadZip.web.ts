import JSZip from 'jszip';
import type { ProbedFile } from './docUtils';

// Web build only — ported near-verbatim from portfolio-react's
// DocPickerModal.tsx "Tout télécharger" handler. Per the confirmed
// decision, this is web-only: DocPickerModal hides the zip button on
// native entirely rather than calling this.
export async function downloadZip(base: string, files: ProbedFile[]): Promise<void> {
  const docName = base.split('/').pop();
  const zip = new JSZip();
  await Promise.all(
    files.map(async (f) => {
      const blob = await fetch(f.url).then((r) => r.blob());
      zip.file(f.name, blob);
    }),
  );
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${docName} - Folder.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
