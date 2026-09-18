import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatNow(): { time: string; date: string } {
  const now = new Date();

  const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateOpts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

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

// NOTE: vanilla/portfolio-react let a `preferred_timezone` terminal command
// override the clock's timezone. Ported when the terminal checkpoint adds
// that command — this clock uses the device's local timezone until then.
export function LiveClock() {
  const { colors } = useTheme();
  const [now, setNow] = useState(formatNow);

  useEffect(() => {
    const interval = setInterval(() => setNow(formatNow()), 1000);
    return () => clearInterval(interval);
  }, []);

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
