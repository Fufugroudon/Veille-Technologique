import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ScrollView, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';

/**
 * RN has no window.scrollY / IntersectionObserver, so every scroll-driven
 * feature from portfolio-react (navbar shadow, reading-progress bar,
 * back-to-top visibility, scroll-spy active nav link) is consolidated here
 * around a single root ScrollView's onScroll — one source of truth instead
 * of five separate window scroll listeners.
 *
 * Section Y-offsets are collected via each section's onLayout: since every
 * section is a direct sibling under the same content wrapper inside the
 * ScrollView, `layout.y` is already relative to the scrollable content's
 * top — no measureLayout() round-trip needed.
 */

const NAVBAR_SCROLLED_THRESHOLD = 20;
const BACK_TO_TOP_THRESHOLD = 300;
// Matches Portfolio/script.js's IntersectionObserver rootMargin '-30% 0px -60% 0px':
// a section becomes "active" once it reaches this fraction of the viewport height.
const ACTIVE_SECTION_BAND = 0.35;

interface ScrollContextValue {
  scrollViewRef: React.RefObject<ScrollView | null>;
  registerSection: (id: string, y: number) => void;
  scrollToSection: (id: string) => void;
  scrollToTop: () => void;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollViewLayout: (height: number) => void;
  onContentSizeChange: (height: number) => void;
  scrolled: boolean;
  progressPercent: number;
  showBackToTop: boolean;
  activeSectionId: string | null;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionYRef = useRef<Map<string, number>>(new Map());
  const viewportHeightRef = useRef(0);
  const contentHeightRef = useRef(0);

  const [scrolled, setScrolled] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const registerSection = useCallback((id: string, y: number) => {
    sectionYRef.current.set(id, y);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const y = sectionYRef.current.get(id);
    if (y === undefined) return;
    scrollViewRef.current?.scrollTo({ y, animated: true });
  }, []);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const onScrollViewLayout = useCallback((height: number) => {
    viewportHeightRef.current = height;
  }, []);

  const onContentSizeChange = useCallback((height: number) => {
    contentHeightRef.current = height;
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    const viewportHeight = viewportHeightRef.current;
    const contentHeight = contentHeightRef.current;

    setScrolled(scrollY > NAVBAR_SCROLLED_THRESHOLD);
    setShowBackToTop(scrollY > BACK_TO_TOP_THRESHOLD);

    const maxScroll = contentHeight - viewportHeight;
    setProgressPercent(maxScroll > 0 ? Math.min(100, (scrollY / maxScroll) * 100) : 0);

    const threshold = scrollY + viewportHeight * ACTIVE_SECTION_BAND;
    let candidate: string | null = null;
    let candidateY = -Infinity;
    sectionYRef.current.forEach((y, id) => {
      if (y <= threshold && y > candidateY) {
        candidate = id;
        candidateY = y;
      }
    });
    setActiveSectionId(candidate);
  }, []);

  const value = useMemo<ScrollContextValue>(
    () => ({
      scrollViewRef,
      registerSection,
      scrollToSection,
      scrollToTop,
      onScroll,
      onScrollViewLayout,
      onContentSizeChange,
      scrolled,
      progressPercent,
      showBackToTop,
      activeSectionId,
    }),
    [registerSection, scrollToSection, scrollToTop, onScroll, onScrollViewLayout, onContentSizeChange, scrolled, progressPercent, showBackToTop, activeSectionId],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScrollContext(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return ctx;
}
