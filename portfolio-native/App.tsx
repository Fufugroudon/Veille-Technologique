import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ScrollProvider, useScrollContext } from './context/ScrollContext';
import { ToastProvider } from './context/ToastContext';
import { TermsModalProvider } from './context/TermsModalContext';
import { TimezoneProvider } from './context/TimezoneContext';
import { MatrixRainProvider } from './context/MatrixRainContext';
import { I18nProvider } from './i18n/I18nContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
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
import { Contact } from './components/sections/Contact';
import { DocViewerProvider } from './components/docviewer/DocViewerProvider';
import { MatrixRain } from './components/easter-eggs/MatrixRain';
import { CreatureLegend } from './components/easter-eggs/CreatureLegend';

function AppContent() {
  const { colors } = useTheme();
  const { scrollViewRef, onScroll, onScrollViewLayout, onContentSizeChange } = useScrollContext();

  return (
    <View style={[styles.root, { backgroundColor: colors.dark }]}>
      <ToastProvider>
        <DocViewerProvider>
          <TermsModalProvider>
            <ScrollView
              ref={scrollViewRef}
              onScroll={onScroll}
              scrollEventThrottle={16}
              onLayout={(e) => onScrollViewLayout(e.nativeEvent.layout.height)}
              onContentSizeChange={(_, height) => onContentSizeChange(height)}
              contentContainerStyle={styles.scrollContent}
            >
              <Hero />
              <Profil />
              <Parcours />
              <Competences />
              <Certifications />
              <Projets />
              <Veille />
              <Contact />
              <Footer />
            </ScrollView>

            <ReadingProgressBar />
            <Header />
            <ScrollToTopButton />
            <SectionDots />
            <CreatureLegend />
            <MatrixRain />
          </TermsModalProvider>
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
        <TimezoneProvider>
          <ScrollProvider>
            <MatrixRainProvider>
              <AppContent />
            </MatrixRainProvider>
          </ScrollProvider>
        </TimezoneProvider>
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
});
