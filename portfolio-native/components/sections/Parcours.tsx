import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';

export function Parcours() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection('parcours');

  return (
    <View nativeID="parcours" onLayout={onLayout} style={[styles.section, { backgroundColor: colors.dark }]}>
      <Text style={[styles.sectionNumber, { color: colors.accent }]}>02</Text>
      <Text style={[styles.h2, { color: colors.text }]}>{t.nav[2]}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.parcours.sectionSubtitle}</Text>

      <View style={[styles.timeline, { borderLeftColor: colors.border }]}>
        {t.parcours.entries.map((entry, i) => (
          <View key={entry.title} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: colors.accent, borderColor: colors.dark }]} />
            <Text style={[styles.date, { color: colors.accentLight }]}>{entry.date}</Text>
            <View
              style={[
                styles.badge,
                i === 0
                  ? { backgroundColor: colors.accentGlow, borderColor: colors.accent }
                  : { backgroundColor: colors.bgCard, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.badgeText, { color: i === 0 ? colors.accentLight : colors.textMuted }]}>
                {entry.badge}
              </Text>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{entry.title}</Text>
            <Text style={[styles.subtitleText, { color: colors.textMuted }]}>{entry.subtitle}</Text>
            {entry.paragraphs.map((p, j) => (
              <Text key={j} style={[styles.paragraph, { color: colors.textMuted }]}>
                {p}
              </Text>
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
    marginBottom: 24,
  },
  timeline: {
    borderLeftWidth: 2,
    paddingLeft: 20,
    gap: 28,
  },
  item: {
    gap: 4,
  },
  dot: {
    position: 'absolute',
    left: -26,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  date: {
    fontSize: 12,
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 6,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
  },
});
