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
import { SECTIONS } from './constants/sections'
import { useHashNav } from './hooks/useHashNav'

const PLACEHOLDER_IDS = new Set(['accueil', 'profil', 'parcours', 'competences'])
const PLACEHOLDER_SECTIONS = SECTIONS.filter((s) => !PLACEHOLDER_IDS.has(s.id))

// Placeholder content until later Phase 3 commits migrate each section's real markup.
function SectionPlaceholder({ id, label }: { id: string; label: string }) {
  return (
    <section id={id}>
      <div className="container">
        <div className="section-header">
          <h2>{label}</h2>
        </div>
      </div>
    </section>
  )
}

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
        {PLACEHOLDER_SECTIONS.map((section) => (
          <SectionPlaceholder key={section.id} id={section.id} label={section.labelFr} />
        ))}
      </main>
      <Footer />
      <SectionDots />
      <ScrollToTopButton />
    </>
  )
}

export default App
