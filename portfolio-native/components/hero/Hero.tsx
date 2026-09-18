import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useScrollContext } from '../../context/ScrollContext';
import { useRegisterSection } from '../../hooks/useRegisterSection';
import { HeroParticles } from './HeroParticles';
import { HeroTitle } from './HeroTitle';
import { HeroStats } from './HeroStats';
import { HeroScrollIndicator } from './HeroScrollIndicator';
import { ItecBlockModal } from '../itec/ItecBlockModal';

// NOTE: vanilla's decorative background (radial-gradient "orbs" + a faint
// grid pattern behind the hero) is omitted here — RN has no radial-gradient
// primitive and pulling in a gradient/blur library for pure background
// chrome wasn't worth it. Flagged, not silently dropped.
export function Hero() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { scrollToSection } = useScrollContext();
  const onLayout = useRegisterSection('accueil');
  const [itecOpen, setItecOpen] = useState(false);

  return (
    <View nativeID="accueil" onLayout={onLayout} style={[styles.section, { backgroundColor: colors.dark }]}>
      <HeroParticles />

      <View style={styles.content}>
        <View style={[styles.badge, { borderColor: colors.border, backgroundColor: colors.bgCard }]}>
          <View style={[styles.badgeDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.badgeText, { color: colors.textMuted }]}>{t.heroBadge}</Text>
        </View>

        <HeroTitle />

        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t.heroSubtitle}</Text>

        <Pressable onPress={() => setItecOpen(true)} style={styles.itecTrigger}>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {t.itecPrefix}{' '}
            <Text style={{ color: colors.accentLight, fontWeight: '700' }}>ITEC Engineering ›</Text>
          </Text>
        </Pressable>

        <View style={styles.availabilityBadge}>
          <View style={[styles.pulseDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.availabilityText, { color: colors.textMuted }]}>{t.availabilityBadge}</Text>
        </View>

        <Text style={[styles.description, { color: colors.textFaint }]}>{t.heroDesc}</Text>

        <View style={styles.cta}>
          <Pressable
            onPress={() => scrollToSection('projets')}
            style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.btnPrimaryText}>{t.heroCtaProjects}</Text>
          </Pressable>
          <Pressable
            onPress={() => scrollToSection('contact')}
            style={[styles.btn, styles.btnOutline, { borderColor: colors.border }]}
          >
            <Text style={[styles.btnOutlineText, { color: colors.text }]}>{t.heroCtaContact}</Text>
          </Pressable>
        </View>

        <HeroStats />
      </View>

      <HeroScrollIndicator />
      <ItecBlockModal visible={itecOpen} onClose={() => setItecOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    minHeight: 700,
    paddingTop: 96,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  content: {
    gap: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itecTrigger: {
    alignSelf: 'flex-start',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 520,
  },
  cta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  btnPrimary: {},
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnOutline: {
    borderWidth: 1,
  },
  btnOutlineText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
