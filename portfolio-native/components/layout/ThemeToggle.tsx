import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { light, toggle, colors } = useTheme();

  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityState={{ selected: light }}
      accessibilityLabel={light ? 'Activer le mode nuit' : 'Activer le mode jour'}
      style={[styles.button, { borderColor: colors.border }]}
    >
      <Text style={styles.icon}>{light ? '🌙' : '☀️'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
});
