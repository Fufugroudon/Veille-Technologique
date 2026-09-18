import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SECTIONS } from '../../constants/sections';
import { useTheme } from '../../context/ThemeContext';
import { useScrollContext } from '../../context/ScrollContext';

// Section dots crowd a narrow phone screen — vanilla hides them below 900px too.
const MIN_WIDTH = 900;

export function SectionDots() {
  const { colors } = useTheme();
  const { activeSectionId, scrollToSection } = useScrollContext();
  const { width } = useWindowDimensions();

  if (width < MIN_WIDTH) return null;

  return (
    <View style={styles.container} accessibilityRole="none">
      {SECTIONS.map((section) => {
        const active = activeSectionId === section.id;
        return (
          <Pressable
            key={section.id}
            onPress={() => scrollToSection(section.id)}
            accessibilityRole="button"
            accessibilityLabel={`Aller à ${section.labelFr}`}
            accessibilityState={{ selected: active }}
            style={[
              styles.dot,
              { borderColor: colors.border },
              active && { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 24,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    gap: 12,
    zIndex: 900,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
});
