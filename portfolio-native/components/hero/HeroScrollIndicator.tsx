import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useScrollContext } from '../../context/ScrollContext';

/**
 * Fades out once the user has scrolled roughly one viewport height — RN has
 * no IntersectionObserver, so this approximates vanilla's "hero no longer
 * intersecting" check using scrollY vs. the 'profil' section's registered
 * Y-offset instead.
 */
export function HeroScrollIndicator() {
  const { colors } = useTheme();
  const { scrollY, viewportHeight, scrollToSection } = useScrollContext();

  const visible = scrollY < viewportHeight * 0.9;

  return (
    <Pressable
      onPress={() => scrollToSection('profil')}
      accessibilityRole="button"
      accessibilityLabel="Descendre vers le profil"
      style={[styles.button, { borderColor: colors.border, opacity: visible ? 1 : 0 }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Text style={[styles.arrow, { color: colors.textMuted }]}>⌄</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 18,
  },
});
