import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from './ThemeContext';
import { useScrollContext } from './ScrollContext';

export type ToastType = 'error' | 'warning' | 'success' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  /** A section id to scroll to (e.g. 'contact') — replaces vanilla's CSS-selector linkTarget, which has no RN equivalent. */
  linkTarget?: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, linkTarget?: string) => void;
}

const ICONS: Record<ToastType, string> = {
  error: '✕',
  warning: '⚠',
  success: '✓',
  info: 'ℹ',
};

const AUTO_DISMISS_MS = 15000;
const MAX_VISIBLE = 10;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const { scrollToSection } = useScrollContext();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', linkTarget?: string) => {
      const id = nextId.current++;
      setToasts((prev) => {
        const next = [...prev, { id, message, type, linkTarget }];
        if (next.length > MAX_VISIBLE) {
          const [oldest, ...rest] = next;
          const oldestTimer = timers.current.get(oldest.id);
          if (oldestTimer) {
            clearTimeout(oldestTimer);
            timers.current.delete(oldest.id);
          }
          return rest;
        }
        return next;
      });

      const timer = setTimeout(() => remove(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <View
            key={toast.id}
            style={[styles.toast, { backgroundColor: colors.bgCard, borderLeftColor: colorForType(toast.type, colors) }]}
          >
            <Text style={[styles.icon, { color: colorForType(toast.type, colors) }]}>{ICONS[toast.type]}</Text>
            <View style={styles.body}>
              <Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text>
              {toast.linkTarget && (
                <Pressable
                  onPress={() => {
                    scrollToSection(toast.linkTarget as string);
                    remove(toast.id);
                  }}
                >
                  <Text style={[styles.link, { color: colors.accentLight }]}>→ En savoir plus</Text>
                </Pressable>
              )}
            </View>
            <Pressable onPress={() => remove(toast.id)} accessibilityRole="button" accessibilityLabel="Fermer la notification">
              <Text style={[styles.close, { color: colors.textMuted }]}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function colorForType(type: ToastType, colors: ReturnType<typeof useTheme>['colors']): string {
  switch (type) {
    case 'error':
      return colors.error;
    case 'warning':
      return colors.warning;
    case 'success':
      return colors.success;
    default:
      return colors.accent;
  }
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    right: 16,
    left: 16,
    gap: 8,
    zIndex: 2000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
  },
  close: {
    fontSize: 16,
  },
});
