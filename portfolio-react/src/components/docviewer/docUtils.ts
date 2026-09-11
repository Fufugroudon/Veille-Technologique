export interface ProbedFile {
  ext: 'pdf' | 'docx'
  url: string
  name: string
  sizeBytes: number
  mime: string
}

const NBSP = String.fromCharCode(160)

export function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '—'
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}${NBSP}KB`
  return `${(bytes / 1048576).toFixed(2)}${NBSP}MB`
}

export async function probeFile(url: string, ext: 'pdf' | 'docx'): Promise<ProbedFile | null> {
  try {
    const r = await fetch(url, { method: 'HEAD' })
    if (!r.ok) return null
    return {
      ext,
      url,
      name: url.split('/').pop() ?? url,
      sizeBytes: parseInt(r.headers.get('Content-Length') ?? '', 10) || 0,
      mime: (r.headers.get('Content-Type') ?? '').split(';')[0].trim(),
    }
  } catch {
    return null
  }
}

export function downloadFile(url: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = ''
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/** Clears every pdfjs.* localStorage key before opening a document — required fix for stale viewer state. */
export function clearPdfjsCache(): void {
  try {
    localStorage.removeItem('pdfjs.history')
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.indexOf('pdfjs') === 0) keys.push(key)
    }
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // localStorage unavailable — nothing to clear
  }
}
