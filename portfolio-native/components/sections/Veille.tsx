import { Linking, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';

interface FeatureRow {
  label: string;
  value: string;
}

function FeatureBoxes({ features }: { features: FeatureRow[] }) {
  const { colors } = useTheme();
  return (
    <>
      {features.map((f, i) => {
        const highlight = i === features.length - 1;
        return (
          <View
            key={f.label}
            style={[
              styles.featureBox,
              { backgroundColor: colors.accentGlow, borderColor: colors.border },
              highlight && { borderColor: colors.success },
            ]}
          >
            <Text style={[styles.featureLabel, { color: colors.textFaint }]}>{f.label}</Text>
            <Text style={[styles.featureValue, { color: colors.text }]}>{f.value}</Text>
          </View>
        );
      })}
    </>
  );
}

function IconGrid({ items, icons }: { items: { label: string }[]; icons: string[] }) {
  const { colors } = useTheme();
  return (
    <View style={styles.iconGrid}>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.iconCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={styles.iconEmoji}>{icons[i]}</Text>
          <Text style={[styles.iconLabel, { color: colors.textMuted }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const DOMAINES_ICONS = ['🔐', '🧬', '🤖', '📊'];
const SOURCES_ICONS = ['🔬', '🏢', '🎓', '📰'];
const METHODES_ICONS = ['📰', '🔔', '💬', '📱'];

export function Veille() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection('veille');

  return (
    <View nativeID="veille" onLayout={onLayout} style={[styles.section, { backgroundColor: colors.darkSecondary }]}>
      <Text style={[styles.sectionNumber, { color: colors.accent }]}>06</Text>
      <Text style={[styles.h2, { color: colors.text }]}>{t.nav[6]}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.veille.sectionSubtitle}</Text>

      <Text
        style={[styles.githubLink, { color: colors.textMuted, borderColor: colors.border }]}
        onPress={() => Linking.openURL('https://github.com/Fufugroudon/Veille-Technologique')}
      >
        ↗ {t.veille.githubLabel}
      </Text>

      <View style={[styles.intro, { backgroundColor: colors.accentGlow, borderColor: colors.border }]}>
        <Text style={[styles.introText, { color: colors.textMuted }]}>
          {t.veille.introPrefix}
          <Text style={{ color: colors.accentLight, fontWeight: '600' }}>{t.veille.introStrong}</Text>.
        </Text>
      </View>

      <View style={styles.comparisonGrid}>
        <View style={[styles.comparisonCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.cardHeader, { backgroundColor: '#2563eb' }]}>
            <Text style={styles.cardIcon}>💻</Text>
            <Text style={styles.cardHeaderTitle}>{t.veille.classicTitle}</Text>
          </View>
          <View style={styles.cardContent}>
            <FeatureBoxes features={t.veille.classicFeatures} />
          </View>
        </View>

        <View style={[styles.comparisonCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.cardHeader, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.cardIcon}>⚛️</Text>
            <Text style={styles.cardHeaderTitle}>{t.veille.quantumTitle}</Text>
          </View>
          <View style={styles.cardContent}>
            <FeatureBoxes features={t.veille.quantumFeatures} />
          </View>
        </View>
      </View>

      <Text style={[styles.gridSectionTitle, { color: colors.text }]}>{t.veille.domainesTitle}</Text>
      <IconGrid items={t.veille.domaines} icons={DOMAINES_ICONS} />

      <Text style={[styles.gridSectionTitle, { color: colors.text }]}>{t.veille.sourcesTitle}</Text>
      <IconGrid items={t.veille.sources} icons={SOURCES_ICONS} />

      <Text style={[styles.gridSectionTitle, { color: colors.text }]}>{t.veille.methodesTitle}</Text>
      <IconGrid items={t.veille.methodes} icons={METHODES_ICONS} />

      <View style={[styles.conclusion, { backgroundColor: colors.accentGlow, borderColor: colors.border }]}>
        <Text style={[styles.conclusionTitle, { color: colors.text }]}>{t.veille.conclusionTitle}</Text>
        <Text style={[styles.conclusionText, { color: colors.textMuted }]}>{t.veille.conclusionText}</Text>
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
  },
  githubLink: {
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  intro: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  comparisonGrid: {
    gap: 14,
    marginBottom: 24,
  },
  comparisonCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 18,
    alignItems: 'center',
    gap: 6,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardHeaderTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  cardContent: {
    padding: 14,
    gap: 8,
  },
  featureBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  featureValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  iconCard: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  iconEmoji: {
    fontSize: 22,
  },
  iconLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  conclusion: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  conclusionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  conclusionText: {
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
});
