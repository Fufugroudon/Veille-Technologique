import { useEffect, useRef } from 'react';
import type { View } from 'react-native';

const MAX_TILT = 4; // degrees

// Web build only — ported near-verbatim from portfolio-react's
// useCardTilt.ts (DOM mousemove tilt + moving shine). See useCardTilt.ts
// for the native touch fallback (vanilla's own touch behavior already had
// no tilt on touch devices — just a shine flash — so native mirrors that
// exactly rather than inventing something new).
export function useCardTilt<T extends View = View>() {
  const cardRef = useRef<T | null>(null);
  const shineRef = useRef<View | null>(null);

  useEffect(() => {
    const card = cardRef.current as unknown as HTMLElement | null;
    const shine = shineRef.current as unknown as HTMLElement | null;
    if (!card || !shine) return;

    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    if (isTouchDevice) {
      function handleTouchStart() {
        shine!.style.opacity = '1';
        setTimeout(() => {
          shine!.style.opacity = '';
        }, 400);
      }
      card.addEventListener('touchstart', handleTouchStart, { passive: true });
      return () => card.removeEventListener('touchstart', handleTouchStart);
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = card!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotY = dx * MAX_TILT;
      const rotX = -dy * MAX_TILT;

      card!.style.transition = 'transform 0.1s ease, box-shadow 0.35s ease';
      card!.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;

      const pctX = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const pctY = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      shine!.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.056) 0%, transparent 55%)`;
    }

    function handleMouseLeave() {
      card!.style.transition = 'transform 0.5s ease, box-shadow 0.35s ease';
      card!.style.transform = '';
      shine!.style.background = '';
    }

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // No-op: the effect above already attaches its own native touchstart/mousemove
  // listeners directly to the DOM node — kept only so the return shape matches
  // useCardTilt.ts (native), letting Projets.tsx stay platform-agnostic.
  function onTouchStart() {}

  return { cardRef, shineRef, onTouchStart };
}
