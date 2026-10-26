import { useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import PageLoader from './components/PageLoader'
import NavBar from './components/layout/NavBar'
import Landing from './sections/Landing'
import Work from './sections/Work'
import About from './sections/About'
import Contact from './sections/Contact'
import { rememberIntro, shouldShowIntro } from './utils/intro'

function App() {
  const [loading, setLoading] = useState(shouldShowIntro)
  const focusAfterIntro = useRef(false)

  const finishIntro = ({ focusContent = false } = {}) => {
    focusAfterIntro.current = focusContent
    rememberIntro()
    setLoading(false)
  }

  const ready = !loading

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence onExitComplete={() => {
        if (focusAfterIntro.current) {
          document.getElementById('main')?.focus({ preventScroll: true })
          focusAfterIntro.current = false
        }
      }}>
        {loading && <PageLoader onDone={finishIntro} />}
      </AnimatePresence>

      <div inert={loading}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <NavBar activeLink="HOME" ready={ready} />

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
