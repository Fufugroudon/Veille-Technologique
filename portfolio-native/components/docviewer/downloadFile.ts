import { Linking } from 'react-native';

// PLATFORM DECISION: native fallback. There's no filesystem-download UX
// equivalent to the web `<a download>` trick without expo-file-system +
// expo-sharing (real work, out of scope for now — see the confirmed
// decision on the zip-download button). Linking.openURL hands the file off
// to the OS's own viewer/handler, which is a real, sensible degrade.
export function downloadFile(url: string): void {
  Linking.openURL(url);
}
