import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SECTIONS } from './constants/sections';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ScrollProvider, useScrollContext } from './context/ScrollContext';
import { ToastProvider } from './context/ToastContext';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { useRegisterSection } from './hooks/useRegisterSection';
import { Header } from './components/layout/Header';
import { ReadingProgressBar } from './components/layout/ReadingProgressBar';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { SectionDots } from './components/layout/SectionDots';
import { Hero } from './components/hero/Hero';
import { Profil } from './components/sections/Profil';
import { Parcours } from './components/sections/Parcours';
import { Competences } from './components/sections/Competences';
import { Certifications } from './components/sections/Certifications';
import { Projets } from './components/sections/Projets';
import { Veille } from './components/sections/Veille';
import { DocViewerProvider } from './components/docviewer/DocViewerProvider';

// Placeholder — each section below is replaced with its real port in a
// later Phase 2 checkpoint. Kept here only so the App shell (nav, theme,
// i18n, scroll-spy) has real content to scroll and verify against.
function SectionStub({ id, index }: { id: string; index: number }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const onLayout = useRegisterSection(id);

  return (
    <View
      nativeID={id}
      onLayout={onLayout}
      style={[styles.stub, { backgroundColor: index % 2 === 0 ? colors.dark : colors.darkSecondary }]}
    >
      <Text style={[styles.stubText, { color: colors.text }]}>{t.nav[index]}</Text>
    </View>
  );
}

function AppContent() {
  const { colors } = useTheme();
  const { scrollViewRef, onScroll, onScrollViewLayout, onContentSizeChange } = useScrollContext();

  return (
    <View style={[styles.root, { backgroundColor: colors.dark }]}>
      <ToastProvider>
        <DocViewerProvider>
          <ScrollView
            ref={scrollViewRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onLayout={(e) => onScrollViewLayout(e.nativeEvent.layout.height)}
            onContentSizeChange={(_, height) => onContentSizeChange(height)}
            contentContainerStyle={styles.scrollContent}
          >
            {SECTIONS.map((section, i) => {
              if (section.id === 'accueil') return <Hero key={section.id} />;
              if (section.id === 'profil') return <Profil key={section.id} />;
              if (section.id === 'parcours') return <Parcours key={section.id} />;
              if (section.id === 'competences') return <Competences key={section.id} />;
              if (section.id === 'certifications') return <Certifications key={section.id} />;
              if (section.id === 'projets') return <Projets key={section.id} />;
              if (section.id === 'veille') return <Veille key={section.id} />;
              return <SectionStub key={section.id} id={section.id} index={i} />;
            })}
          </ScrollView>

          <ReadingProgressBar />
          <Header />
          <ScrollToTopButton />
          <SectionDots />
        </DocViewerProvider>
      </ToastProvider>
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ScrollProvider>
          <AppContent />
        </ScrollProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stub: {
    minHeight: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stubText: {
    fontSize: 28,
    fontWeight: '700',
  },
});
