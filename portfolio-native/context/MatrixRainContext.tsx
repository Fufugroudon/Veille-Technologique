import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

interface MatrixRainContextValue {
  visible: boolean;
  launch: () => void;
  dismiss: () => void;
}

const MatrixRainContext = createContext<MatrixRainContextValue | null>(null);

function playBeep() {
  try {
    // Web build only — Web Audio API. No native equivalent in scope (per
    // the confirmed decision, native shows the message with no sound).
    if (Platform.OS !== 'web') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // AudioContext blocked — silent fallback
  }
}

/**
 * Triggers: Konami code ↑↑↓↓←→←→BA (web only — keydown has no native
 * equivalent without a physical/Bluetooth keyboard, matching vanilla's own
 * desktop framing) or triple-tap the nav brand (cross-platform, wired from
 * Header). Consumed by MatrixRain for the actual overlay.
 */
export function MatrixRainProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const konamiIdx = useRef(0);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  function launch() {
    if (visibleRef.current) return;
    playBeep();
    setVisible(true);
  }

  function dismiss() {
    setVisible(false);
  }

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.keyCode === KONAMI[konamiIdx.current]) {
        konamiIdx.current++;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          launch();
        }
      } else {
        konamiIdx.current = 0;
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return <MatrixRainContext.Provider value={{ visible, launch, dismiss }}>{children}</MatrixRainContext.Provider>;
}

export function useMatrixRain(): MatrixRainContextValue {
  const ctx = useContext(MatrixRainContext);
  if (!ctx) {
    throw new Error('useMatrixRain must be used within a MatrixRainProvider');
  }
  return ctx;
}
