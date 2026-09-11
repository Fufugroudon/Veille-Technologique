import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ReadingProgressBar } from './components/layout/ReadingProgressBar'
import { ScrollToTopButton } from './components/layout/ScrollToTopButton'
import { SectionDots } from './components/layout/SectionDots'
import { SECTIONS } from './constants/sections'
import { useHashNav } from './hooks/useHashNav'

// Placeholder content until Phase 3 migrates each section's real markup.
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
        {SECTIONS.map((section) => (
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
