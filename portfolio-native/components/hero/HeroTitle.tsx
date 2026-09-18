import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const PART1 = 'Leseigneur ';
const PART2 = 'Léo';
const TOTAL_CHARS = PART1.length + PART2.length;
const TYPE_SPEED_MS = 80;
const START_DELAY_MS = 600;
const GLITCH_DURATION_MS = 600;

/**
 * Ports portfolio-react's HeroTitle: typing effect (state-driven here,
 * since RN Text has no imperative textContent to mutate) + a glitch effect
 * on press/hover.
 *
 * The glitch itself is a simplified re-implementation, not a literal port:
 * vanilla/web uses CSS ::before/::after with 6 keyframed clip-path bands
 * (RN has no clip-path). Approximated here with two color-tinted overlay
 * Text layers doing a short translateX jitter + opacity fade — visually
 * close for a decorative micro-interaction, without replicating every
 * clip-path keyframe band.
 */
export function HeroTitle() {
  const { colors } = useTheme();
  const [charsShown, setCharsShown] = useState(0);
  const [done, setDone] = useState(false);
  const [glitchA] = useState(() => new Animated.Value(0));
  const [glitchB] = useState(() => new Animated.Value(0));
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    function typeNext(count: number) {
      if (cancelled) return;
      if (count >= TOTAL_CHARS) {
        timer = setTimeout(() => {
          if (!cancelled) setDone(true);
        }, 800);
        return;
      }
      setCharsShown(count + 1);
      timer = setTimeout(() => typeNext(count + 1), TYPE_SPEED_MS);
    }

    timer = setTimeout(() => typeNext(0), START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  function triggerGlitch() {
    if (glitching) return;
    setGlitching(true);
    glitchA.setValue(1);
    glitchB.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(glitchA, { toValue: 0.6, duration: 90, useNativeDriver: true }),
        Animated.timing(glitchA, { toValue: 0.3, duration: 90, useNativeDriver: true }),
        Animated.timing(glitchA, { toValue: 0, duration: GLITCH_DURATION_MS - 180, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(glitchB, { toValue: -0.6, duration: 90, useNativeDriver: true }),
        Animated.timing(glitchB, { toValue: -0.3, duration: 90, useNativeDriver: true }),
        Animated.timing(glitchB, { toValue: 0, duration: GLITCH_DURATION_MS - 180, useNativeDriver: true }),
      ]),
    ]).start(() => setGlitching(false));
  }

  const part1Shown = PART1.slice(0, Math.min(charsShown, PART1.length));
  const part2Shown = PART2.slice(0, Math.max(0, charsShown - PART1.length));
  const fullText = `${part1Shown}${part2Shown}`;

  return (
    <Pressable onPress={triggerGlitch} style={styles.wrapper}>
      <View>
        <Text style={[styles.title, { color: colors.text }]}>
          {part1Shown}
          <Text style={{ color: colors.accentLight }}>{part2Shown}</Text>
          <Text style={[styles.cursor, { opacity: done ? 0 : 1, color: colors.accent }]}>|</Text>
        </Text>

        {glitching && (
          <>
            <Animated.Text
              style={[
                styles.title,
                styles.glitchLayer,
                { color: '#ff0066', transform: [{ translateX: Animated.multiply(glitchA, 6) }], opacity: 0.85 },
              ]}
              pointerEvents="none"
            >
              {fullText}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.title,
                styles.glitchLayer,
                { color: '#00ffff', transform: [{ translateX: Animated.multiply(glitchB, 6) }], opacity: 0.85 },
              ]}
              pointerEvents="none"
            >
              {fullText}
            </Animated.Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  cursor: {
    fontWeight: '300',
  },
  glitchLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
