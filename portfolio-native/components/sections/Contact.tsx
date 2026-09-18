import { Linking, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';
import { ContactForm } from '../contact/ContactForm';
import { CopyEmailButton } from '../contact/CopyEmailButton';

const CONTACT_EMAIL = 'leo.leseigneur@orange.fr';

export function Contact() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection('contact');

  return (
    <View nativeID="contact" onLayout={onLayout} style={[styles.section, { backgroundColor: colors.dark }]}>
      <Text style={[styles.sectionNumber, { color: colors.accent }]}>07</Text>
      <Text style={[styles.h2, { color: colors.text }]}>{t.nav[7]}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.contact.sectionSubtitle}</Text>

      <View style={styles.content}>
        <View style={[styles.info, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.infoHeading, { color: colors.text }]}>{t.contact.heading}</Text>

          <View style={styles.item}>
            <Text style={styles.itemIcon}>📧</Text>
            <View style={styles.itemBody}>
              <Text style={[styles.itemLabel, { color: colors.text }]}>{t.contact.emailLabel}</Text>
              <View style={styles.emailRow}>
                <Text
                  style={[styles.itemValue, { color: colors.accentLight }]}
                  onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
                >
                  {CONTACT_EMAIL}
                </Text>
                <CopyEmailButton email={CONTACT_EMAIL} />
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.itemIcon}>💼</Text>
            <View style={styles.itemBody}>
              <Text style={[styles.itemLabel, { color: colors.text }]}>{t.contact.githubLabel}</Text>
              <Text
                style={[styles.itemValue, { color: colors.accentLight }]}
                onPress={() => Linking.openURL('https://github.com/Fufugroudon')}
              >
                github.com/Fufugroudon
              </Text>
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.itemIcon}>📍</Text>
            <View style={styles.itemBody}>
              <Text style={[styles.itemLabel, { color: colors.text }]}>{t.contact.locationLabel}</Text>
              <Text style={[styles.itemValue, { color: colors.textMuted }]}>{t.contact.location}</Text>
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.itemIcon}>🎓</Text>
            <View style={styles.itemBody}>
              <Text style={[styles.itemLabel, { color: colors.text }]}>{t.contact.statusLabel}</Text>
              <Text style={[styles.itemValue, { color: colors.textMuted }]}>
                {t.contact.statusPrefix}{' '}
                <Text style={{ color: colors.accentLight }} onPress={() => Linking.openURL('http://www.itec-engineering.com/')}>
                  ITEC Engineering
                </Text>{' '}
                {t.contact.statusSuffix}
              </Text>
            </View>
          </View>
        </View>

        <ContactForm />
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
  content: {
    gap: 24,
  },
  info: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    gap: 18,
  },
  infoHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    gap: 12,
  },
  itemIcon: {
    fontSize: 18,
  },
  itemBody: {
    flex: 1,
    gap: 3,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemValue: {
    fontSize: 13,
    lineHeight: 19,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
