import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'preferred_timezone';

interface TimezoneContextValue {
  timezone: string | null;
  setTimezone: (iana: string) => void;
}

const TimezoneContext = createContext<TimezoneContextValue | null>(null);

/** Backs the terminal's `timezone` command and LiveClock — split out of ThemeContext/I18nContext since it's read/written independently. */
export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [timezone, setTimezoneState] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) setTimezoneState(value);
    });
  }, []);

  function setTimezone(iana: string) {
    setTimezoneState(iana);
    AsyncStorage.setItem(STORAGE_KEY, iana).catch(() => {
      // storage unavailable — preference won't persist across reloads
    });
  }

  return <TimezoneContext.Provider value={{ timezone, setTimezone }}>{children}</TimezoneContext.Provider>;
}

export function useTimezone(): TimezoneContextValue {
  const ctx = useContext(TimezoneContext);
  if (!ctx) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return ctx;
}
