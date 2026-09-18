import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useScrollContext } from '../../context/ScrollContext';
import { useI18n } from '../../i18n/I18nContext';

export function ScrollToTopButton() {
  const { colors } = useTheme();
  const { showBackToTop, scrollToTop } = useScrollContext();
  const { t } = useI18n();

  if (!showBackToTop) return null;

  return (
    <Pressable
      onPress={scrollToTop}
      accessibilityRole="button"
      accessibilityLabel={t.backToTop}
      style={[styles.button, { backgroundColor: colors.accent }]}
    >
      <Text style={styles.arrow}>↑</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 900,
  },
  arrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
