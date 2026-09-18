import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from './ThemeContext';
import { useI18n } from '../i18n/I18nContext';

type Source = 'form' | 'footer' | null;

interface TermsModalContextValue {
  requestSubmit: (onAccept: () => void) => void;
  showInfo: () => void;
}

const TermsModalContext = createContext<TermsModalContextValue | null>(null);

const BODY_TEXT = {
  fr: [
    { pre: 'Les informations transmises via ce formulaire sont utilisées ', bold: 'uniquement', post: ' pour vous répondre. Elles ne sont ni partagées, ni vendues à des tiers.' },
    { pre: 'Vos données sont conservées au maximum ', bold: '1 an', post: ', puis supprimées. Vous pouvez demander leur suppression à tout moment en me contactant directement.' },
    { pre: 'Conformément au ', bold: 'RGPD', post: ", vous disposez d'un droit d'accès, de rectification et d'effacement de vos données personnelles.", link: 'https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on' },
  ],
  en: [
    { pre: 'Information submitted through this form is used ', bold: 'solely', post: ' to reply to you. It is never shared or sold to third parties.' },
    { pre: 'Your data is kept for a maximum of ', bold: '1 year', post: ', then deleted. You may request its deletion at any time by contacting me directly.' },
    { pre: 'Under the ', bold: 'GDPR', post: ', you have the right to access, rectify and erase your personal data.', link: 'https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on' },
  ],
};

export function TermsModalProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const [source, setSource] = useState<Source>(null);
  const onAcceptRef = useRef<(() => void) | null>(null);

  function requestSubmit(onAccept: () => void) {
    onAcceptRef.current = onAccept;
    setSource('form');
  }

  function showInfo() {
    onAcceptRef.current = null;
    setSource('footer');
  }

  function close() {
    setSource(null);
    onAcceptRef.current = null;
  }

  function accept() {
    const callback = onAcceptRef.current;
    close();
    if (callback) callback();
  }

  const isOpen = source !== null;

  return (
    <TermsModalContext.Provider value={{ requestSubmit, showInfo }}>
      {children}
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.overlay} onPress={close}>
          <Pressable
            style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.title, { color: colors.text }]}>{t.terms.title}</Text>
            <View style={styles.body}>
              {BODY_TEXT[lang].map((p, i) => (
                <Text key={i} style={[styles.paragraph, { color: colors.textMuted }]}>
                  {p.pre}
                  <Text style={{ fontWeight: '700', color: colors.text }}>{p.bold}</Text>
                  {p.post}
                  {p.link && (
                    <Text style={{ color: colors.accentLight }} onPress={() => Linking.openURL(p.link!)}>
                      {' '}
                      ↗
                    </Text>
                  )}
                </Text>
              ))}
            </View>
            <View style={styles.actions}>
              {source === 'footer' && (
                <Pressable onPress={close} style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.accent }]}>
                  <Text style={styles.btnPrimaryText}>{t.terms.close}</Text>
                </Pressable>
              )}
              {source === 'form' && (
                <>
                  <Pressable onPress={accept} style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.accent }]}>
                    <Text style={styles.btnPrimaryText}>{t.terms.accept}</Text>
                  </Pressable>
                  <Pressable onPress={close} style={[styles.btn, styles.btnOutline, { borderColor: colors.border }]}>
                    <Text style={[styles.btnOutlineText, { color: colors.text }]}>{t.terms.refuse}</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </TermsModalContext.Provider>
  );
}

export function useTermsModal(): TermsModalContextValue {
  const ctx = useContext(TermsModalContext);
  if (!ctx) {
    throw new Error('useTermsModal must be used within a TermsModalProvider');
  }
  return ctx;
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
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: 16,
    padding: 22,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    gap: 12,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  btnPrimary: {},
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  btnOutline: {
    borderWidth: 1,
  },
  btnOutlineText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
