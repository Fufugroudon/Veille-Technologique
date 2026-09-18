import type { ProbedFile } from './docUtils';

// PLATFORM DECISION: native fallback — never actually called. DocPickerModal
// hides the "Tout télécharger" zip button on native entirely (per the
// confirmed decision), so this only exists to satisfy the import on native.
export async function downloadZip(_base: string, _files: ProbedFile[]): Promise<void> {}
