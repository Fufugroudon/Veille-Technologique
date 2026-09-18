import { useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { CREATURES, CREATURE_LABELS, PARTICLE_COLORS } from './creatureData';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  anim: Animated.ValueXY;
  alpha: Animated.Value;
}

interface Creature {
  id: number;
  x: number;
  y: number;
  emoji: string;
  label: string;
  anim: Animated.Value;
}

const CLICK_WINDOW_MS = 900;

export interface CreatureEasterEggHandle {
  /** Call from the parent's onTouchEnd (plain View touch event, not the exclusive Responder System — never blocks sibling Pressables). */
  registerTap: (x: number, y: number) => void;
}

/**
 * Ports Portfolio/script.js's triple-click mythological creature easter egg.
 * Exposes registerTap via ref so Hero can feed it coordinates from its own
 * plain onTouchEnd handler — this overlay itself is pointerEvents="none"
 * and never intercepts touches, so it can't break Hero's real buttons.
 */
export const CreatureEasterEgg = forwardRef<CreatureEasterEggHandle>(function CreatureEasterEgg(_props, ref) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const nextId = useRef(0);
  const tapTimes = useRef<number[]>([]);

  function spawnExplosion(x: number, y: number) {
    const count = Math.floor(Math.random() * 5) + 12;
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 6) + 5;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      newParticles.push({
        id: nextId.current++,
        x,
        y,
        size,
        color,
        anim: new Animated.ValueXY({ x: 0, y: 0 }),
        alpha: new Animated.Value(1),
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);

    newParticles.forEach((p) => {
      const angle = Math.random() * 2 * Math.PI;
      const dist = Math.floor(Math.random() * 60) + 40;
      Animated.parallel([
        Animated.timing(p.anim, {
          toValue: { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist },
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(p.alpha, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
    });

    const ids = newParticles.map((p) => p.id);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !ids.includes(p.id)));
    }, 650);
  }

  function spawnCreature(x: number, y: number) {
    const emoji = CREATURES[Math.floor(Math.random() * CREATURES.length)];
    const label = CREATURE_LABELS[emoji] ?? '';
    const id = nextId.current++;
    const anim = new Animated.Value(0);
    setCreatures((prev) => [...prev, { id, x, y, emoji, label, anim }]);

    Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true }).start();

    setTimeout(() => {
      setCreatures((prev) => prev.filter((c) => c.id !== id));
    }, 2000);
  }

  useImperativeHandle(ref, () => ({
    registerTap(x: number, y: number) {
      const now = Date.now();
      tapTimes.current.push(now);
      tapTimes.current = tapTimes.current.filter((t) => now - t <= CLICK_WINDOW_MS);

      if (tapTimes.current.length >= 3) {
        tapTimes.current = [];
        spawnExplosion(x, y);
        spawnCreature(x, y);
      }
    },
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={[
            styles.particle,
            {
              left: p.x - p.size / 2,
              top: p.y - p.size / 2,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.alpha,
              transform: p.anim.getTranslateTransform(),
            },
          ]}
        />
      ))}
      {creatures.map((c) => (
        <Animated.View
          key={c.id}
          style={[
            styles.creatureWrap,
            {
              left: c.x,
              top: c.y,
              opacity: c.anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [
                { translateX: -20 },
                { translateY: c.anim.interpolate({ inputRange: [0, 1], outputRange: [0, -150] }) },
                { scale: c.anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) },
              ],
            },
          ]}
        >
          <Text style={styles.emoji}>{c.emoji}</Text>
          <Text style={styles.label}>{c.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 999,
  },
  creatureWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  label: {
    fontSize: 11,
    color: '#fff',
    fontFamily: 'monospace',
    marginTop: 2,
  },
});
