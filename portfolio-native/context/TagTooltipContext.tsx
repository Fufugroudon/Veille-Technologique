import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, type View as RNView } from 'react-native';
import { useTheme } from './ThemeContext';

interface TagTooltipContextValue {
  show: (target: RNView, text: string) => void;
  hide: () => void;
  scheduleHide: (delayMs: number) => void;
}

const TagTooltipContext = createContext<TagTooltipContextValue | null>(null);

/**
 * Single global tooltip, matching portfolio-react's TagTooltipContext.
 * Positioning uses RN's View.measureInWindow instead of
 * getBoundingClientRect (no DOM here), same fixed-coordinates approach so
 * it's never clipped by a card's overflow.
 */
export function TagTooltipProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [tipSize, setTipSize] = useState({ width: 0, height: 0 });
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(target: RNView, tooltipText: string) {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setText(tooltipText);
    setVisible(true);

    target.measureInWindow((x, y, w, h) => {
      let left = x + w / 2 - tipSize.width / 2;
      let top = y - tipSize.height - 10;

      left = Math.max(8, Math.min(left, windowWidth - tipSize.width - 8));
      if (top < 8) top = y + h + 10;

      setPos({ top, left });
    });
  }

  function hide() {
    setVisible(false);
  }

  function scheduleHide(delayMs: number) {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(hide, delayMs);
  }

  return (
    <TagTooltipContext.Provider value={{ show, hide, scheduleHide }}>
      {children}
      <View
        pointerEvents="none"
        onLayout={(e) => setTipSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        style={[
          styles.tooltip,
          { backgroundColor: colors.bgCard, borderColor: colors.border, top: pos.top, left: pos.left, opacity: visible ? 1 : 0 },
        ]}
      >
        <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
      </View>
    </TagTooltipContext.Provider>
  );
}

export function useTagTooltip(): TagTooltipContextValue {
  const ctx = useContext(TagTooltipContext);
  if (!ctx) {
    throw new Error('useTagTooltip must be used within a TagTooltipProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: 220,
    zIndex: 3000,
  },
  text: {
    fontSize: 12,
  },
});
