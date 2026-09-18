// Web build only — ported verbatim from portfolio-react's docUtils.ts
// `<a download>` DOM trick. See downloadFile.ts for the native fallback.
export function downloadFile(url: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
