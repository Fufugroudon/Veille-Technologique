import { createElement, useEffect, useRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { resolvePdfViewerUrl } from './docUtils';

interface Props {
  fileUrl: string | null;
  onClose: () => void;
}

// Web build only — ported near-verbatim from portfolio-react's
// DocViewerModal.tsx (a PDF.js iframe). Native never opens this: see
// DocViewerProvider, which calls Linking.openURL directly on native
// instead of setting a viewer URL. react-native-web passes unknown DOM
// props straight through, so a raw <iframe> (RN core has no iframe
// primitive) works via createElement.
export function DocViewerModal({ fileUrl, onClose }: Props) {
  const isOpen = fileUrl !== null;
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  const viewerSrc = fileUrl ? resolvePdfViewerUrl(fileUrl) : '';

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fermer le visualiseur"
          style={styles.closeBtn}
        >
          <Text style={styles.closeText}>×</Text>
        </Pressable>
        <View style={styles.panel}>
          {isOpen &&
            createElement('iframe', {
              title: 'Visualiser le document',
              src: viewerSrc,
              style: { width: '100%', height: '100%', border: 'none' },
            })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 28,
  },
  panel: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
