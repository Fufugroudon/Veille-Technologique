import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useScrollContext } from '../../context/ScrollContext';

export function ReadingProgressBar() {
  const { colors } = useTheme();
  const { progressPercent } = useScrollContext();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progressPercent) }}
      style={styles.track}
    >
      <View style={[styles.fill, { width: `${progressPercent}%`, backgroundColor: colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 1000,
  },
  fill: {
    height: '100%',
  },
});
