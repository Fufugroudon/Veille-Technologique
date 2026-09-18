import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatSize, type ProbedFile } from './docUtils';
import { downloadFile } from './downloadFile';
import { downloadZip } from './downloadZip';

interface Props {
  base: string | null;
  files: ProbedFile[];
  onClose: () => void;
}

/**
 * Ports portfolio-react's DocPickerModal (choose PDF/DOCX when both exist).
 * The "Tout télécharger" zip button is web-only per the confirmed decision —
 * native shows only the individual PDF/DOCX buttons via Linking.openURL.
 */
export function DocPickerModal({ base, files, onClose }: Props) {
  const { colors } = useTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isOpen = base !== null;

  const pdfFile = files.find((f) => f.ext === 'pdf');
  const docxFile = files.find((f) => f.ext === 'docx');

  async function handleZip() {
    if (!base) return;
    await downloadZip(base, files);
    onClose();
  }

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Sélectionner le format du document à télécharger :
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fermer">
              <Text style={[styles.close, { color: colors.textMuted }]}>×</Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            {pdfFile && (
              <Pressable
                onPress={() => {
                  downloadFile(pdfFile.url);
                  onClose();
                }}
                style={[styles.actionBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.actionText, { color: colors.text }]}>PDF</Text>
              </Pressable>
            )}
            {docxFile && (
              <Pressable
                onPress={() => {
                  downloadFile(docxFile.url);
                  onClose();
                }}
                style={[styles.actionBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.actionText, { color: colors.text }]}>DOCX</Text>
              </Pressable>
            )}
          </View>

          <Pressable onPress={() => setDetailsOpen((prev) => !prev)}>
            <Text style={[styles.summary, { color: colors.textMuted }]}>
              {detailsOpen ? '▾' : '▸'} Détails des fichiers
            </Text>
          </Pressable>

          {detailsOpen && (
            <ScrollView horizontal style={styles.tableWrap}>
              <View>
                <View style={[styles.tableRow, styles.tableHeadRow, { borderBottomColor: colors.border }]}>
                  {['Nom du fichier', 'Format', 'Type', 'Taille'].map((h) => (
                    <Text key={h} style={[styles.th, { color: colors.textFaint }]}>
                      {h}
                    </Text>
                  ))}
                </View>
                {files.map((f) => (
                  <View key={f.url} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.td, { color: colors.text }]}>{f.name}</Text>
                    <Text style={[styles.td, { color: colors.text }]}>{f.ext.toUpperCase()}</Text>
                    <Text style={[styles.td, { color: colors.text }]}>
                      {f.ext === 'pdf' ? 'PDF' : f.ext === 'docx' ? 'DOCX' : f.mime || '—'}
                    </Text>
                    <Text style={[styles.td, { color: colors.text }]}>{formatSize(f.sizeBytes)}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {detailsOpen && Platform.OS === 'web' && (
            <Pressable onPress={handleZip} style={[styles.zipBtn, { borderColor: colors.border }]}>
              <Text style={[styles.actionText, { color: colors.text }]}>Tout télécharger</Text>
            </Pressable>
          )}
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
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  close: {
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  summary: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableWrap: {
    maxHeight: 160,
  },
  tableRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  tableHeadRow: {
    borderBottomWidth: 1,
  },
  th: {
    width: 100,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  td: {
    width: 100,
    fontSize: 11,
  },
  zipBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
});
