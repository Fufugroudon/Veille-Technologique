import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';

const ICONS = ['⚙️', '🌐', '🔒', '💻'];
const PCTS = [
  [90, 80, 85],
  [88, 75, 82],
  [70, 65, 78],
  [85, 80, 75],
];

function SkillBar({ pct }: { pct: number }) {
  const { colors } = useTheme();
  const [width] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(width, { toValue: pct, duration: 1300, useNativeDriver: false }).start();
  }, [pct, width]);

  return (
    <View style={[styles.barTrack, { backgroundColor: colors.accentGlow }]}>
      <Animated.View
        style={[
          styles.barFill,
          {
            backgroundColor: colors.accent,
            width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

export function Competences() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection('competences');

  return (
    <View nativeID="competences" onLayout={onLayout} style={[styles.section, { backgroundColor: colors.darkSecondary }]}>
      <Text style={[styles.sectionNumber, { color: colors.accent }]}>03</Text>
      <Text style={[styles.h2, { color: colors.text }]}>{t.nav[3]}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.competences.sectionSubtitle}</Text>

      <View style={styles.grid}>
        {t.competences.categories.map((category, i) => (
          <View key={category.title} style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{ICONS[i]}</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{category.title}</Text>
            </View>
            {category.skills.map((skill, j) => (
              <View key={skill} style={styles.skillItem}>
                <View style={styles.skillRow}>
                  <Text style={[styles.skillName, { color: colors.textMuted }]}>{skill}</Text>
                  <Text style={[styles.skillPct, { color: colors.accent }]}>{PCTS[i][j]}%</Text>
                </View>
                <SkillBar pct={PCTS[i][j]} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    paddingTop: 40,
    gap: 8,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: '800',
  },
  h2: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  skillItem: {
    gap: 6,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillName: {
    fontSize: 12,
    fontWeight: '500',
  },
  skillPct: {
    fontSize: 12,
    fontWeight: '700',
  },
  barTrack: {
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
