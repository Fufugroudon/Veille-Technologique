import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';
import { DocActions } from '../docviewer/DocActions';

type Category = 'langue' | 'reseau' | 'cloud' | 'securite' | 'methode' | 'mooc';

const ICONS = ['🇬🇧'];
const CATEGORIES: Category[] = ['langue'];
const YEARS = ['2024'];
const DOC_BASES = ['docs/certifications/cambridge'];

const BADGE_COLORS: Record<Category, string> = {
  langue: '#34d399',
  reseau: '#60a5fa',
  cloud: '#a78bfa',
  securite: '#f87171',
  methode: '#fbbf24',
  mooc: '#2dd4bf',
};

export function Certifications() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection('certifications');
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all');

  return (
    <View
      nativeID="certifications"
      onLayout={onLayout}
      style={[styles.section, { backgroundColor: colors.dark }]}
    >
      <Text style={[styles.sectionNumber, { color: colors.accent }]}>04</Text>
      <Text style={[styles.h2, { color: colors.text }]}>{t.nav[4]}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.certifications.sectionSubtitle}</Text>

      <View style={styles.filters}>
        {t.certifications.filters.map((f) => {
          const active = activeFilter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setActiveFilter(f.id)}
              style={[
                styles.filterBtn,
                { borderColor: active ? colors.accent : colors.border },
                active && { backgroundColor: colors.accentGlow },
              ]}
            >
              <Text style={[styles.filterText, { color: active ? colors.accent : colors.textMuted }]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.grid}>
        {t.certifications.items.map((cert, i) => {
          const category = CATEGORIES[i];
          if (activeFilter !== 'all' && activeFilter !== category) return null;
          const badgeColor = BADGE_COLORS[category];
          return (
            <View key={cert.title} style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: colors.accentGlow, borderColor: colors.border }]}>
                  <Text style={styles.icon}>{ICONS[i]}</Text>
                </View>
                <View style={[styles.badge, { borderColor: badgeColor }]}>
                  <Text style={[styles.badgeText, { color: badgeColor }]}>{cert.badgeLabel}</Text>
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: colors.text }]}>{cert.title}</Text>
              <Text style={[styles.issuer, { color: colors.accent }]}>{cert.issuer}</Text>
              <Text style={[styles.desc, { color: colors.textFaint }]}>{cert.description}</Text>

              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <Text style={[styles.level, { color: colors.textMuted }]}>{cert.level}</Text>
                <View style={[styles.year, { backgroundColor: colors.accentGlow, borderColor: colors.border }]}>
                  <Text style={[styles.yearText, { color: colors.accent }]}>{YEARS[i]}</Text>
                </View>
                <DocActions base={DOC_BASES[i]} />
              </View>
            </View>
          );
        })}
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
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  issuer: {
    fontSize: 12,
    fontWeight: '600',
  },
  desc: {
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  level: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 'auto',
  },
  year: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  yearText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
