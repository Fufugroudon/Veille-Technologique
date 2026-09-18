import { Platform } from 'react-native';

export interface ProbedFile {
  ext: 'pdf' | 'docx';
  url: string;
  name: string;
  sizeBytes: number;
  mime: string;
}

// PLATFORM DECISION: web resolves relative doc paths against the page's own
// origin (window.location.origin — works for dev and prod alike, identical
// to portfolio-react's behavior). Native has no "current origin", so it
// resolves against the documented production domain (lesnorrys.fr, per
// CLAUDE.md) — unlike the ITEC images, these doc files (CV.pdf,
// TABLEAU_DE_SYNTHESE.pdf, cambridge.pdf, AD_Documentation_Leo.*) genuinely
// exist in portfolio-react/public/docs/ and will be deployed there.
const PRODUCTION_ORIGIN = 'https://lesnorrys.fr';

export function resolveDocUrl(path: string): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return new URL(path, window.location.origin).href;
  }
  return new URL(path, PRODUCTION_ORIGIN).href;
}

// The PDF.js viewer (viewer/pdfjs/, 400+ files) is not bundled into this
// project — copying it is a separate decision Léo hasn't asked for. Always
// resolved against the production origin, on both web and native, so it
// points at portfolio-react's already-deployed copy rather than assuming
// portfolio-native ships its own.
export function resolvePdfViewerUrl(fileUrl: string): string {
  return `${PRODUCTION_ORIGIN}/viewer/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}&page=1`;
}

const NBSP = String.fromCharCode(160);

export function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '—';
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}${NBSP}KB`;
  return `${(bytes / 1048576).toFixed(2)}${NBSP}MB`;
}

export async function probeFile(url: string, ext: 'pdf' | 'docx'): Promise<ProbedFile | null> {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    if (!r.ok) return null;
    return {
      ext,
      url,
      name: url.split('/').pop() ?? url,
      sizeBytes: parseInt(r.headers.get('Content-Length') ?? '', 10) || 0,
      mime: (r.headers.get('Content-Type') ?? '').split(';')[0].trim(),
    };
  } catch {
    return null;
  }
}
