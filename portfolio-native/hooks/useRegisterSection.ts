import { useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useScrollContext } from '../context/ScrollContext';

/** Returns an onLayout handler that reports a section's Y-offset to ScrollContext, for scroll-spy and scrollToSection. */
export function useRegisterSection(id: string) {
  const { registerSection } = useScrollContext();
  return useCallback((e: LayoutChangeEvent) => registerSection(id, e.nativeEvent.layout.y), [id, registerSection]);
}
