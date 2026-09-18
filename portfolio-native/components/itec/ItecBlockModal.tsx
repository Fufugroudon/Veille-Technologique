import { useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ItecInfoModal } from './ItecInfoModal';
import { PartnerLogo } from './PartnerLogo';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const POLES = [
  { icon: '✏️', title: 'Engineering', desc: "Études process, électricité, instrumentation et automatisme. Du FEED jusqu'à l'exécution complète." },
  { icon: '🏗️', title: 'Shelters', desc: 'Fabrication de shelters techniques sur mesure et conteneurs modifiés pour sites industriels.' },
  { icon: '⚙️', title: 'Automatisme', desc: 'Intégration PLC/DCS, SIS, F&G, SCADA, réseaux industriels et transformation digitale IIoT.' },
  { icon: '⚡', title: 'Armoires électriques', desc: 'HTA/HTB/BT, tableaux MCC, armoires ATEX certifiées Ex d / Ex p / Ex e.' },
];

const TIMELINE_STEPS = ['FEED', 'Conception détaillée', 'Fabrication atelier', 'Tests FAT', 'Mise en service'];

const SERVICE_PILLS = [
  'Gestion de projet',
  'Consulting FEED',
  'Études électriques',
  'Instrumentation',
  'Personnel certifié ATEX',
  'Services achat',
  'Télémaintenance',
  'Accès distant sécurisé',
  'Support cloud',
  'Formation on-site',
];

const PARTNERS = [
  { url: 'https://www.perenco.com', uri: 'perenco-logo.png', name: 'Perenco', desc: 'Opérateur pétrolier international', fallback: 'P' },
  { url: 'https://www.se.com', uri: 'logo-Schneider-Electric.webp', name: 'Schneider Electric', desc: 'Partenaire énergie & automatisme', fallback: 'SE' },
  { url: 'https://www.rockwellautomation.com', uri: 'rockwell-automation-logo.png', name: 'Rockwell Automation', desc: 'Intégrateur certifié', fallback: 'RA' },
];

/**
 * Ports portfolio-react's ItecBlockModal (the ITEC Engineering employer-promo
 * content triggered from Hero). Per the confirmed decision, the many
 * data-tooltip hover-hints on poles/timeline-steps/pills are omitted on
 * native (no hover on touch) — the modal already carries enough description
 * text elsewhere.
 */
export function ItecBlockModal({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable
            style={[styles.card, { backgroundColor: colors.dark, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fermer" style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: colors.textMuted }]}>✕</Text>
            </Pressable>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.hero}>
                <PartnerLogo
                  uri="Itec-enginneering-logo.png"
                  alt="ITEC Engineering"
                  fallback="ITEC"
                  style={styles.heroLogo}
                />
                <Text style={[styles.heroTitle, { color: colors.text }]}>ITEC Engineering</Text>
                <Pressable onPress={() => setInfoOpen(true)}>
                  <Text style={[styles.drawerLink, { color: colors.accentLight }]}>→ En savoir plus</Text>
                </Pressable>
                <Text style={[styles.heroDesc, { color: colors.textMuted }]}>
                  Société française d&apos;ingénierie industrielle spécialisée dans les solutions clé en main,
                  de la conception jusqu&apos;à la mise en service sur site, pour les secteurs pétroliers,
                  énergétiques et les services aux collectivités.
                </Text>
                <View style={styles.tags}>
                  {[
                    ['Oil & Gas', '#34d399'],
                    ['Énergie', '#60a5fa'],
                    ['Utilities', colors.textMuted],
                  ].map(([label, color]) => (
                    <View key={label} style={[styles.tag, { borderColor: color }]}>
                      <Text style={[styles.tagText, { color }]}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Informations générales</Text>
              <View style={[styles.infoCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                {[
                  ['Siège social', '8 Rue de Vignoru, 60110 Esches, France'],
                  ['Secteurs', 'Oil & Gas · Énergie · Utilities'],
                  ['Téléphone', '+33 (1) 30 28 81 90'],
                ].map(([key, val]) => (
                  <View key={key} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.infoKey, { color: colors.textFaint }]}>{key}</Text>
                    <Text style={[styles.infoVal, { color: colors.text }]}>{val}</Text>
                  </View>
                ))}
                <View style={styles.infoRow}>
                  <Text style={[styles.infoKey, { color: colors.textFaint }]}>Site web</Text>
                  <Text
                    style={[styles.infoVal, { color: colors.accentLight }]}
                    onPress={() => Linking.openURL('http://www.itec-engineering.com')}
                  >
                    itec-engineering.com
                  </Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Pôles d&apos;activité</Text>
              <View style={styles.polesGrid}>
                {POLES.map((pole) => (
                  <View key={pole.title} style={[styles.pole, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <Text style={styles.poleIcon}>{pole.icon}</Text>
                    <Text style={[styles.poleTitle, { color: colors.text }]}>{pole.title}</Text>
                    <Text style={[styles.poleDesc, { color: colors.textMuted }]}>{pole.desc}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Couverture projet de A à Z</Text>
              <View style={styles.timeline}>
                {TIMELINE_STEPS.map((step, i) => (
                  <View key={step} style={styles.timelineStep}>
                    <View style={[styles.stepNum, { backgroundColor: colors.accent }]}>
                      <Text style={styles.stepNumText}>{String(i + 1).padStart(2, '0')}</Text>
                    </View>
                    <Text style={[styles.stepLabel, { color: colors.textMuted }]}>{step}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Services proposés</Text>
              <View style={styles.pills}>
                {SERVICE_PILLS.map((pill) => (
                  <View key={pill} style={[styles.pill, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <Text style={[styles.pillText, { color: colors.textMuted }]}>{pill}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.certif, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                <View style={[styles.certifIcon, { backgroundColor: colors.success }]}>
                  <Text style={styles.certifIconText}>✓</Text>
                </View>
                <Text style={[styles.certifText, { color: colors.textMuted }]}>
                  <Text style={{ color: colors.text, fontWeight: '700' }}>
                    Intégrateur certifié Rockwell Automation
                  </Text>
                  {'\n'}Certification internationale attestant du niveau d&apos;expertise d&apos;ITEC Engineering dans
                  l&apos;intégration de systèmes d&apos;automatisme industriels.
                </Text>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Partenaires & Clients</Text>
              <View style={styles.partners}>
                {PARTNERS.map((p) => (
                  <Pressable
                    key={p.name}
                    onPress={() => Linking.openURL(p.url)}
                    style={[styles.partnerCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                  >
                    <PartnerLogo uri={p.uri} alt={p.name} fallback={p.fallback} style={styles.partnerLogo} />
                    <Text style={[styles.partnerName, { color: colors.text }]}>{p.name}</Text>
                    <Text style={[styles.partnerDesc, { color: colors.textFaint }]}>{p.desc}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <ItecInfoModal visible={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  closeText: {
    fontSize: 20,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 20,
  },
  hero: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  heroLogo: {
    width: 120,
    height: 60,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  drawerLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 12,
  },
  infoKey: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  polesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pole: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  poleIcon: {
    fontSize: 20,
  },
  poleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  poleDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  timeline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timelineStep: {
    alignItems: 'center',
    gap: 6,
    width: 80,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  certif: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  certifIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certifIconText: {
    color: '#fff',
    fontWeight: '800',
  },
  certifText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  partners: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  partnerCard: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  partnerLogo: {
    width: 60,
    height: 36,
  },
  partnerName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  partnerDesc: {
    fontSize: 10,
    textAlign: 'center',
  },
});
