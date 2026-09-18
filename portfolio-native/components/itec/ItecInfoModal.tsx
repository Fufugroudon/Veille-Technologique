import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function ExternalLink({ href, children }: { href: string; children: string }) {
  const { colors } = useTheme();
  return (
    <Text style={{ color: colors.accentLight, fontWeight: '600' }} onPress={() => Linking.openURL(href)}>
      {children}
    </Text>
  );
}

const INFO_ROWS: [string, string][] = [
  ['Présence internationale', 'Projets actifs sur 4 continents'],
  ['Effectif', '~50 collaborateurs'],
  ["Zones d'intervention", 'Europe, Afrique, Moyen-Orient'],
  ['Langues', 'Français, Anglais'],
  ["Chiffre d'affaires estimé", '~10 M€'],
  ['Projets réalisés', '+200 installations dans 30 pays'],
];

/** Ports portfolio-react's ItecInfoModal — the "En savoir plus" drawer nested inside the ITEC block modal. */
export function ItecInfoModal({ visible, onClose }: Props) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>ITEC Engineering</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fermer">
              <Text style={[styles.close, { color: colors.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.body}>
            <Text style={[styles.desc, { color: colors.textMuted }]}>
              ITEC Engineering est une société française d&apos;ingénierie industrielle fondée en 2005,
              spécialisée dans les projets clé en main pour les secteurs{' '}
              <ExternalLink href="https://fr.wikipedia.org/wiki/Industrie_p%C3%A9troli%C3%A8re">
                Oil &amp; Gas
              </ExternalLink>
              , Énergie et Utilities. Ses équipes interviennent de la phase FEED jusqu&apos;à la mise en
              service, couvrant l&apos;engineering procédé, électrique et instrumentation, la fabrication de
              shelters sur mesure, l&apos;intégration de systèmes d&apos;automatisme (
              <ExternalLink href="https://fr.wikipedia.org/wiki/SCADA">SCADA</ExternalLink>,{' '}
              <ExternalLink href="https://fr.wikipedia.org/wiki/Internet_des_objets">IIoT</ExternalLink>)
              ainsi que la conception d&apos;armoires électriques{' '}
              <ExternalLink href="https://fr.wikipedia.org/wiki/ATEX">ATEX</ExternalLink> certifiées.
              Active en <ExternalLink href="https://fr.wikipedia.org/wiki/Europe">Europe</ExternalLink>,{' '}
              <ExternalLink href="https://fr.wikipedia.org/wiki/Afrique">Afrique</ExternalLink> et{' '}
              <ExternalLink href="https://fr.wikipedia.org/wiki/Moyen-Orient">Moyen-Orient</ExternalLink>,
              la société s&apos;appuie sur des partenariats stratégiques avec Schneider Electric et{' '}
              <ExternalLink href="https://www.rockwellautomation.com">Rockwell Automation</ExternalLink>{' '}
              pour accompagner des opérateurs de premier plan tels que{' '}
              <ExternalLink href="https://www.perenco.com">Perenco</ExternalLink>.
            </Text>

            <View style={[styles.list, { borderTopColor: colors.border }]}>
              {INFO_ROWS.map(([key, val]) => (
                <View key={key} style={[styles.row, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.rowKey, { color: colors.textFaint }]}>{key}</Text>
                  <Text style={[styles.rowVal, { color: colors.text }]}>{val}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '85%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  close: {
    fontSize: 18,
  },
  body: {
    maxHeight: 480,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
  },
  list: {
    marginTop: 16,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  rowKey: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  rowVal: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
});
