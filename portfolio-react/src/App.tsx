import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ReadingProgressBar } from './components/layout/ReadingProgressBar'
import { ScrollToTopButton } from './components/layout/ScrollToTopButton'
import { SectionDots } from './components/layout/SectionDots'
import { Hero } from './components/hero/Hero'
import { Profil } from './components/sections/Profil'
import { Parcours } from './components/sections/Parcours'
import { Competences } from './components/sections/Competences'
import { Certifications } from './components/sections/Certifications'
import { Projets } from './components/sections/Projets'
import { Veille } from './components/sections/Veille'
import { Contact } from './components/sections/Contact'
import { MatrixRain } from './components/easter-eggs/MatrixRain'
import { CreatureEasterEgg } from './components/easter-eggs/CreatureEasterEgg'
import { CreatureLegend } from './components/easter-eggs/CreatureLegend'
import { useHashNav } from './hooks/useHashNav'

function App() {
  useHashNav()

  return (
    <>
      <ReadingProgressBar />
      <Header />
      <main>
        <Hero />
        <Profil />
        <Parcours />
        <Competences />
        <Certifications />
        <Projets />
        <Veille />
        <Contact />
      </main>
      <Footer />
      <SectionDots />
      <ScrollToTopButton />
      <MatrixRain />
      <CreatureEasterEgg />
      <CreatureLegend />
    </>
  )
}

export default App
