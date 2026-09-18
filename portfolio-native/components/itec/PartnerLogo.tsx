import { useState } from 'react';
import { Image, StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  uri: string;
  alt: string;
  fallback: string;
  style?: StyleProp<ImageStyle>;
}

// PLATFORM/ASSET DECISION: none of the four ITEC images (Itec-enginneering-logo.png,
// perenco-logo.png, logo-Schneider-Electric.webp, rockwell-automation-logo.png)
// exist anywhere in the repo — portfolio-react/public/docs/images/ is empty.
// This is a pre-existing gap (they already 404 on the live site today, not
// something introduced here). Sourced from the documented production domain
// (lesnorrys.fr, per CLAUDE.md) so they resolve automatically once Léo adds
// the real files there — not a fabricated placeholder domain.
//
// portfolio-react's PartnerLogo only wraps the three partner logos (its own
// ITEC hero logo has no fallback at all, so it shows a broken-image icon on
// web today). This RN version wraps all four, including the hero logo — a
// small, disclosed improvement, since a broken-image icon degrades worse on
// native than the letter-badge fallback used elsewhere.
export function PartnerLogo({ uri, alt, fallback, style }: Props) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={[styles.fallback, style, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.fallbackText, { color: colors.textMuted }]}>{fallback}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: `https://lesnorrys.fr/docs/images/${uri}` }}
      accessibilityLabel={alt}
      onError={() => setFailed(true)}
      style={style}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  fallbackText: {
    fontWeight: '800',
    fontSize: 14,
  },
});
