import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n/I18nContext';
import { useDocViewer } from './DocViewerProvider';

interface Props {
  /** Path without extension — probed as `${base}.pdf` and `${base}.docx`. */
  base: string;
}

export function DocActions({ base }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { openEye, openDownload } = useDocViewer();

  return (
    <View style={styles.group}>
      <Pressable
        onPress={() => openDownload(base)}
        accessibilityRole="button"
        accessibilityLabel={t.docActions.downloadAria}
        style={[styles.btn, { borderColor: colors.border }]}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>{t.docActions.download}</Text>
      </Pressable>
      <Pressable
        onPress={() => openEye(base)}
        accessibilityRole="button"
        accessibilityLabel={t.docActions.viewAria}
        style={[styles.btn, { borderColor: colors.border }]}
      >
        <Text style={[styles.btnText, { color: colors.text }]}>{t.docActions.view}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
