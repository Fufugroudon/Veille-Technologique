import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useMatrixRain } from '../../context/MatrixRainContext';

const AUTO_DISMISS_MS = 4000;

// PLATFORM DECISION: native fallback, per the confirmed decision — still
// shows the "ACCÈS AUTORISÉ" message overlay (and the beep, when the
// device allows it), just without the falling-character canvas animation.
// See MatrixRain.web.tsx for the full Canvas 2D version.
export function MatrixRain() {
  const { visible, dismiss } = useMatrixRain();
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    dismissTimer.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={dismiss}>
      <Text style={styles.message}>ACCÈS AUTORISÉ</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
    zIndex: 5000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#00ff41',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
