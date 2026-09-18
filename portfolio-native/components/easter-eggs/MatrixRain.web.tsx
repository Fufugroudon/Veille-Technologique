import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMatrixRain } from '../../context/MatrixRainContext';

const CHARS = 'ァアィイゥウェエォオカガキギクグケゲコゴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FONT = 14;
const AUTO_DISMISS_MS = 4000;

// Web build only — ported near-verbatim from portfolio-react's MatrixRain.tsx
// (Canvas 2D rain animation). See MatrixRain.tsx for the native fallback
// (message + beep, no canvas, per the confirmed decision).
export function MatrixRain() {
  const { visible, dismiss } = useMatrixRain();
  const containerRef = useRef<View>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;

    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(dismiss, AUTO_DISMISS_MS);

    const container = containerRef.current as unknown as HTMLElement | null;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let drops: number[] = [];
    let raf = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / FONT);
      drops = [];
      for (let i = 0; i < cols; i++) drops[i] = Math.floor((Math.random() * -canvas.height) / FONT);
    }

    function drawFrame() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx!.fillStyle = '#00ff41';
      ctx!.font = `${FONT}px monospace`;

      for (let c = 0; c < cols; c++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx!.fillText(ch, c * FONT, drops[c] * FONT);
        if (drops[c] * FONT > canvas.height && Math.random() > 0.975) drops[c] = 0;
        drops[c]++;
      }
      raf = requestAnimationFrame(drawFrame);
    }

    resize();
    drawFrame();

    return () => {
      cancelAnimationFrame(raf);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      container.removeChild(canvas);
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={dismiss}>
      <View ref={containerRef} style={StyleSheet.absoluteFill} />
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
