import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';

interface StatDef {
  target: number;
  suffix: string;
}

const STATS: StatDef[] = [
  { target: 10, suffix: '+' },
  { target: 5, suffix: '+' },
  { target: 2, suffix: '' },
  { target: 100, suffix: '%' },
];

const DURATION_MS = 1600;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function StatBox({ index, started }: { index: number; started: boolean }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const stat = STATS[index];
  const [display, setDisplay] = useState(`0${stat.suffix}`);
  const animated = useRef(false);

  useEffect(() => {
    if (!started || animated.current) return;
    animated.current = true;

    let startTs: number | null = null;
    let raf = 0;
    function tick(timestamp: number) {
      if (startTs === null) startTs = timestamp;
      const elapsed = timestamp - startTs;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const current = Math.floor(easeOutCubic(progress) * stat.target);
      setDisplay(`${current}${stat.suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setDisplay(`${stat.target}${stat.suffix}`);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, stat.suffix, stat.target]);

  return (
    <View style={[styles.statBox, { borderColor: colors.border, backgroundColor: colors.bgCard }]}>
      <Text style={[styles.statNumber, { color: colors.accentLight }]}>{display}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t.statLabels[index]}</Text>
    </View>
  );
}

/** Counters start as soon as Hero mounts (RN has no IntersectionObserver, and the hero is always the first thing visible on load). */
export function HeroStats() {
  return (
    <View style={styles.stats}>
      {STATS.map((_, i) => (
        <StatBox key={i} index={i} started />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  statBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    minWidth: 90,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});
