import { useRef } from 'react';
import { View } from 'react-native';

// PLATFORM DECISION: native fallback. Mirrors vanilla's own touch-device
// behavior (see useCardTilt.web.ts) — no tilt on touch, just a brief shine
// flash — rather than inventing new behavior for native. Uses
// setNativeProps for the same "mutate imperatively, no React state" shape
// as the web version's direct DOM style writes, so Projets.tsx doesn't
// need to branch on platform.
export function useCardTilt<T extends View = View>() {
  const cardRef = useRef<T | null>(null);
  const shineRef = useRef<View | null>(null);

  function onTouchStart() {
    shineRef.current?.setNativeProps({ style: { opacity: 1 } });
    setTimeout(() => {
      shineRef.current?.setNativeProps({ style: { opacity: 0 } });
    }, 400);
  }

  return { cardRef, shineRef, onTouchStart };
}
