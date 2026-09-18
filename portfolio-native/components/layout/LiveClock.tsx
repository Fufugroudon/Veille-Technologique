import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTimezone } from '../../context/TimezoneContext';

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatNow(tz: string | null): { time: string; date: string } {
  const now = new Date();

  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...(tz ? { timeZone: tz } : {}),
  };
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(tz ? { timeZone: tz } : {}),
  };

  const tp = new Intl.DateTimeFormat('fr-FR', timeOpts).formatToParts(now);
  const h = tp.find((p) => p.type === 'hour')?.value ?? '';
  const m = tp.find((p) => p.type === 'minute')?.value ?? '';
  const s = tp.find((p) => p.type === 'second')?.value ?? '';

  const dp = new Intl.DateTimeFormat('fr-FR', dateOpts).formatToParts(now);
  const day = capitalize(dp.find((p) => p.type === 'weekday')?.value ?? '');
  const dateNum = dp.find((p) => p.type === 'day')?.value ?? '';
  const month = capitalize(dp.find((p) => p.type === 'month')?.value ?? '');
  const year = dp.find((p) => p.type === 'year')?.value ?? '';

  return { time: `${h}:${m}:${s}`, date: `${day} ${dateNum} ${month} ${year}` };
}

export function LiveClock() {
  const { colors } = useTheme();
  const { timezone } = useTimezone();
  const [now, setNow] = useState(() => formatNow(timezone))

  // No synchronous setState-in-effect (eslint's react-hooks rules forbid
  // both that and ref reads/writes during render): switching timezone via
  // the terminal's `timezone` command is reflected on the next tick, up to
  // 1s later, rather than instantly. A minor, acceptable tradeoff.
  useEffect(() => {
    const interval = setInterval(() => setNow(formatNow(timezone)), 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.time, { color: colors.accentLight }]}>{now.time}</Text>
      <Text style={[styles.date, { color: colors.textFaint }]}>{now.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  date: {
    fontSize: 11,
    marginTop: 2,
  },
});
