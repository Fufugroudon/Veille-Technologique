import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { CREATURE_BESTIARY } from './creatureData';

/** Ports portfolio-react's CreatureLegend — the bestiary popup, button bottom-right. */
export function CreatureLegend() {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le bestiaire mythologique"
        style={[styles.trigger, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
      >
        <Text style={styles.triggerEmoji}>🐉</Text>
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <Text style={styles.badgeText}>?</Text>
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.panel, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>📚 Bestiaire Mythologique</Text>
              <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Fermer">
                <Text style={[styles.close, { color: colors.textMuted }]}>✕</Text>
              </Pressable>
            </View>

            <Text style={[styles.hint, { color: colors.textFaint }]}>
              💡 Triple-tapez le fond de l&apos;accueil pour invoquer une créature
            </Text>

            <ScrollView style={styles.list}>
              {CREATURE_BESTIARY.map((entry, i) => (
                <View
                  key={entry.emoji}
                  style={[
                    styles.row,
                    i !== CREATURE_BESTIARY.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                  ]}
                >
                  <Text style={styles.emoji}>{entry.emoji}</Text>
                  <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }]}>{entry.name}</Text>
                    <Text style={[styles.desc, { color: colors.textMuted }]}>{entry.desc}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 900,
  },
  triggerEmoji: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  close: {
    fontSize: 18,
  },
  hint: {
    fontSize: 11,
    marginBottom: 10,
  },
  list: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
  },
  desc: {
    fontSize: 11,
    lineHeight: 16,
  },
});
