import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';
import { DocActions } from '../docviewer/DocActions';

export function Profil() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection('profil');

  return (
    <View nativeID="profil" onLayout={onLayout} style={[styles.section, { backgroundColor: colors.darkSecondary }]}>
      <Text style={[styles.sectionNumber, { color: colors.accent }]}>01</Text>
      <Text style={[styles.h2, { color: colors.text }]}>{t.nav[1]}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.profil.sectionSubtitle}</Text>

      <View style={styles.content}>
        <View style={styles.text}>
          <Text style={[styles.h3, { color: colors.text }]}>{t.profil.heading}</Text>
          {t.profil.paragraphs.map((p, i) => (
            <Text key={i} style={[styles.paragraph, { color: colors.textMuted }]}>
              {p}
            </Text>
          ))}
          <View style={styles.tags}>
            {t.profil.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { borderColor: colors.border, backgroundColor: colors.bgCard }]}>
                <Text style={[styles.tagText, { color: colors.accentLight }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.image}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>LL</Text>
          </View>

          <View style={styles.docs}>
            <View style={styles.docGroup}>
              <Text style={[styles.docLabel, { color: colors.textFaint }]}>{t.profil.docCvLabel}</Text>
              <DocActions base="docs/CV/CV" />
            </View>
            <View style={styles.docGroup}>
              <Text style={[styles.docLabel, { color: colors.textFaint }]}>{t.profil.docTableauLabel}</Text>
              <DocActions base="docs/CV/TABLEAU_DE_SYNTHESE" />
            </View>
          </View>
        </View>
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
  content: {
    gap: 32,
  },
  text: {
    gap: 12,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  image: {
    alignItems: 'center',
    gap: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
  },
  docs: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  docGroup: {
    alignItems: 'center',
    gap: 8,
  },
  docLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
