import { useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import PageLoader from './components/PageLoader'
import NavBar from './components/layout/NavBar'
import Landing from './sections/Landing'
import Work from './sections/Work'
import About from './sections/About'
import Contact from './sections/Contact'
import { rememberIntro, shouldShowIntro } from './utils/intro'
import { SECTIONS } from './config/site'
import useActiveSection from './hooks/useActiveSection'
import useAnchorNavigation from './hooks/useAnchorNavigation'

const SECTION_IDS = SECTIONS.filter((section) => section.ready).map((section) => section.id)

function App() {
  const activeSection = useActiveSection(SECTION_IDS)
  const [loading, setLoading] = useState(shouldShowIntro)

  const finishIntro = () => {
    rememberIntro()
    setLoading(false)
  }

  const ready = !loading
  useAnchorNavigation(ready)

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {loading && <PageLoader onDone={finishIntro} />}
      </AnimatePresence>

      <div inert={loading}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <NavBar activeLink={activeSection} ready={ready} />

        <main id="main" tabIndex={-1}>
          <Landing ready={ready} />
          <Work />
          <About />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  )
}

export default App
