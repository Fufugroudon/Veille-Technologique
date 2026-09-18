import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SECTIONS } from '../../constants/sections';
import { useTheme } from '../../context/ThemeContext';
import { useScrollContext } from '../../context/ScrollContext';
import { useI18n } from '../../i18n/I18nContext';
import { ThemeToggle } from './ThemeToggle';

const NAV_HEIGHT = 72;
const MOBILE_BREAKPOINT = 768;

export function Header() {
  const { colors, light } = useTheme();
  const { scrolled, activeSectionId, scrollToSection } = useScrollContext();
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = width < MOBILE_BREAKPOINT;

  function handleLinkPress(id: string) {
    scrollToSection(id);
    setIsOpen(false);
  }

  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: scrolled ? colors.bgCard : 'transparent',
          borderBottomColor: scrolled ? colors.border : 'transparent',
        },
      ]}
    >
      <View style={styles.container}>
        <Pressable onPress={() => handleLinkPress('accueil')} style={styles.brand}>
          <View style={[styles.brandBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.brandBadgeText}>LL</Text>
          </View>
          {!isMobile && (
            <Text style={[styles.brandName, { color: colors.text }]}>Leseigneur Léo</Text>
          )}
        </Pressable>

        {!isMobile && (
          <View style={styles.links}>
            {SECTIONS.map((section, i) => {
              const isContact = section.id === 'contact';
              const active = activeSectionId === section.id;
              return (
                <Pressable key={section.id} onPress={() => handleLinkPress(section.id)}>
                  <Text
                    style={[
                      styles.linkText,
                      { color: active ? colors.accent : colors.textMuted },
                      isContact && [styles.ctaText, { backgroundColor: colors.accent, color: '#fff' }],
                    ]}
                  >
                    {t.nav[i]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.right}>
          <ThemeToggle />
          {isMobile && (
            <Pressable
              onPress={() => setIsOpen((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={isOpen ? t.navCloseMenu : t.navOpenMenu}
              style={styles.hamburger}
            >
              <View style={[styles.bar, { backgroundColor: light ? colors.text : '#fff' }]} />
              <View style={[styles.bar, { backgroundColor: light ? colors.text : '#fff' }]} />
              <View style={[styles.bar, { backgroundColor: light ? colors.text : '#fff' }]} />
            </Pressable>
          )}
        </View>
      </View>

      {isMobile && isOpen && (
        <View style={[styles.mobileMenu, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          {SECTIONS.map((section, i) => {
            const active = activeSectionId === section.id;
            return (
              <Pressable key={section.id} onPress={() => handleLinkPress(section.id)} style={styles.mobileLink}>
                <Text style={[styles.linkText, { color: active ? colors.accent : colors.textMuted }]}>
                  {t.nav[i]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 800,
    borderBottomWidth: 1,
  },
  container: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  brandName: {
    fontWeight: '700',
    fontSize: 15,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ctaText: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hamburger: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bar: {
    width: 20,
    height: 2,
    borderRadius: 1,
  },
  mobileMenu: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  mobileLink: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
