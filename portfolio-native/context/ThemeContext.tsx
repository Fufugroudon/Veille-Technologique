import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, type ColorTokens } from '../theme';

const STORAGE_KEY = 'theme';

interface ThemeContextValue {
  light: boolean;
  toggle: () => void;
  colors: ColorTokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Ports portfolio-react's ThemeContext: shared light/dark state for the nav toggle and the terminal's `theme` command. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'light') setLight(true);
    });
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark').catch(() => {
      // storage unavailable — preference won't persist across reloads
    });
  }

  const colors = light ? lightTheme : darkTheme;

  return <ThemeContext.Provider value={{ light, toggle, colors }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
