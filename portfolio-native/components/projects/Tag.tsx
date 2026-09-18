import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTagTooltip } from '../../context/TagTooltipContext';
import { TAG_DESCRIPTIONS } from './tagDescriptions';

/**
 * Ports portfolio-react's Tag: hover shows the tooltip (web only —
 * onHoverIn/onHoverOut are react-native-web passthroughs to real DOM
 * mouse events, no-ops on native), tap shows it with a 1.5s auto-hide,
 * matching vanilla's own touch fallback.
 */
export function Tag({ name }: { name: string }) {
  const { colors } = useTheme();
  const ref = useRef<View>(null);
  const { show, hide, scheduleHide } = useTagTooltip();
  const description = TAG_DESCRIPTIONS[name];

  if (!description) {
    return (
      <View style={[styles.tag, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.tagText, { color: colors.textMuted }]}>{name}</Text>
      </View>
    );
  }

  return (
    <Pressable
      ref={ref}
      onHoverIn={() => ref.current && show(ref.current, description)}
      onHoverOut={hide}
      onPress={() => {
        if (ref.current) show(ref.current, description);
        scheduleHide(1500);
      }}
      style={[styles.tag, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
    >
      <Text style={[styles.tagText, { color: colors.textMuted }]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
