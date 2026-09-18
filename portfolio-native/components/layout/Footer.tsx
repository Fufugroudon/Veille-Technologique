import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useTermsModal } from '../../context/TermsModalContext';
import { LiveClock } from './LiveClock';

export function Footer() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { showInfo } = useTermsModal();

  return (
    <View style={[styles.footer, { backgroundColor: colors.darkSecondary, borderTopColor: colors.border }]}>
      <View style={[styles.brandBadge, { backgroundColor: colors.accent }]}>
        <Text style={styles.brandBadgeText}>LL</Text>
      </View>
      <Text style={[styles.copy, { color: colors.textMuted }]}>{t.footerCopy}</Text>
      <Text style={[styles.sub, { color: colors.textFaint }]}>{t.footerRole}</Text>
      <Pressable onPress={showInfo}>
        <Text style={[styles.termsLink, { color: colors.accentLight }]}>{t.termsLink}</Text>
      </Pressable>
      <Text
        style={[styles.github, { color: colors.textMuted }]}
        onPress={() => Linking.openURL('https://github.com/Fufugroudon')}
      >
        💼 github.com/Fufugroudon
      </Text>
      <LiveClock />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    gap: 8,
    padding: 28,
    borderTopWidth: 1,
  },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  brandBadgeText: {
    color: '#fff',
    fontWeight: '800',
  },
  copy: {
    fontSize: 12,
    textAlign: 'center',
  },
  sub: {
    fontSize: 11,
  },
  termsLink: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  github: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
